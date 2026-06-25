# Contexto del Proyecto Iris — para retomar en otro equipo

Este archivo resume la conversación y el razonamiento detrás de cada decisión, para poder continuar el proyecto (con o sin asistente de IA) desde cualquier equipo. Para el detalle formal, ver `Propuesta-Bot-IA-WhatsApp-CrossHome.md`.

## Qué es

Herramienta propia para **CrossHome** (inmobiliaria) que NO es un CRM: **se integra con Pipedrive** (que sigue siendo el CRM / sistema de registro) y aporta cuatro cosas:

1. **Gestión de WhatsApp** vía Cloud API (hoy atienden manual con celular + WhatsApp Web).
2. **Automatizaciones** de asignación/reasignación de leads — **reemplaza al sistema actual de Make/Integromat**.
3. **Agente IA de cara al cliente** que responde por WhatsApp en los horarios que defina CrossHome.
4. **Agente IA de cara al administrador, por WhatsApp**, que ejecuta acciones por conversación (reasignar clientes, asignar manualmente, etc.).

Se busca una solución **propia** (no SaaS de pago) y, a futuro, **comercializarla** a otras empresas.

- **Nombre clave:** Iris (nombre comercial por definir; candidatos discutidos: Atendia, Replai, Leadia, Domia).
- **Repo backend:** https://github.com/MemoLuche/Iris-backend

## Decisiones tomadas (y por qué)

1. **WhatsApp Cloud API directo con Meta** (no WhatsApp Web automatizado, no BSP).
   - Por qué: oficial y estable; sin riesgo de bloqueo; sin markup de intermediario; hosting gratis de Meta.
   - Ojo: al migrar el número a la API, ese número deja de funcionar en la app normal / WhatsApp Web. Por eso el panel debe estar listo antes de migrar.

2. **Backend: NestJS + TypeScript**, como **monolito modular** (no microservicios).
   - Por qué: a <1,000 conversaciones/mes los microservicios son sobreingeniería; el monolito es más barato y simple. Se separa a futuro si escala.

3. **Base de datos: PostgreSQL + pgvector**.
   - Por qué: relacional + RAG en la misma BD; no se necesita vector DB aparte a este volumen.

4. **Cache/colas: Redis + BullMQ** (sesiones, contexto, jobs de SLA).

5. **IA: OpenAI**. GPT-4o mini para clasificar, GPT-5.4 mini para responder, GPT-5.5 para razonamiento complejo. Prompt caching activado.
   - Costo estimado: ~$25–30/mes a 1,000 conversaciones.

6. **Frontend: React + Vite (SPA)**, NO Next.js.
   - Por qué: el panel es privado tras login, no necesita SSR ni SEO; el backend ya es NestJS (las API routes de Next serían redundantes); deploy estático en S3 + CloudFront es más barato.
   - UI: Tailwind + shadcn/ui. Datos: TanStack Query. Tiempo real: Socket.io.

7. **Infra AWS:** 1× EC2 (t3.small) con Docker Compose (Nest + Postgres + Redis) + ECR + S3/CloudFront.
   - Por qué no ECS/Fargate en el MVP: obligaría a RDS + ElastiCache, subiendo a ~$35–55/mes sin beneficio a este volumen. ECS es la ruta de escalamiento (Fase 3).
   - Costo total operativo estimado: ~$50–65/mes (vs $50–300+ de SaaS).

8. **Integraciones:** Pipedrive (CRM, ya en uso) y Slack (ya en uso).
   - **Pipedrive = sistema de registro** (datos del lead, pipeline). **Slack = canal de coordinación** (alertas, acciones). El sistema es dueño de la conversación/mensajes.

## Concepto central: la IA como "modo", no motor permanente

Por cada mensaje entrante, un *resolvedor de modo* decide quién responde (agente o IA), con esta jerarquía:
1. Override manual de la conversación (FORZAR_IA / FORZAR_HUMANO, con `caduca_en` opcional).
2. Agente activo → la IA se calla.
3. Horario: dentro = cola de agentes; fuera (noche, descanso, festivo) = IA responde.
4. Fallback por SLA: en horario, si nadie contesta en X min, entra la IA.

## Decisiones CERRADAS (24-jun-2026)

- **ORM: Prisma.** Mejor DX/type-safety, migraciones declarativas, schema único. pgvector vía raw queries para el RAG.
- **Pipedrive: inbound entra como *Lead* (bandeja) → se convierte a *Deal* al calificar.** Mantiene limpio el pipeline y las métricas de conversión.
- **Registro en Pipedrive: resumen + enlace (Nota/Actividad), no se vuelca cada mensaje.** El sistema es dueño de la conversación.
- **Slack en el MVP: solo notificaciones** (leads, escalamiento, SLA, digest). Acciones interactivas (Block Kit: tomar/reasignar) quedan para Fase 2/3.

## Asignación de leads — modelo real de CrossHome (descubierto 24-jun-2026)

**NO es round-robin ni perfil por presupuesto/zona. La propiedad manda: el asesor dueño del inmueble es el destino.** CrossHome ya tiene esta lógica operando en automatizaciones Make/Integromat (carpeta local `C:\Users\marid\Documents\crosshome`; repo aparte). Iris debe replicarla.

- **Equipo:** 10 asesores (cada uno con iniciales 2 letras, ID Pipedrive, canal Slack) + 2 administrativos (= rol operador, primer punto de contacto / triage).
- **Roles del panel (24-jun-2026):** solo **Administrador/Owner** y **Administrativo de oficina (operador)**, más la **IA** como actor virtual. **Los asesores NO son usuarios del panel.** Iris vive en el número de WhatsApp **de la empresa** (recepción). Al asignar un cliente, el asesor queda como **owner en Pipedrive** + **notificación en Slack**, y atiende al cliente desde su **WhatsApp personal** (esa conversación ocurre fuera de Iris).
- **Clave del inmueble** = `[2 letras asesor][2-3 letras tipo+negocio][identificador]`. Ej. `HRCVCENTRO01` → Huascar Ramírez, Casa Venta, CENTRO01. `COR`/`COV` (consultorio) necesitan `contains()` por solapar con prefijos de 2 letras.
- **`resolverAsesorDestino`:** 1) regla en REASIGNACIONES_PROPIEDAD → 2) ausencia del candidato → cubridor → 3) asignación directa al dueño. Fallback global = Carolina (`EsFallback`).
- **Match Pipedrive:** Person por tel principal → tel secundario → correo. Existe = mover deal a "No contactados" + notificar dueño. Nuevo = crear Person+Deal con owner=asesorDestino + Slack al asesor.
- **A migrar:** Sheets ASESORES y REASIGNACIONES_PROPIEDAD → tablas (`tAgente` ampliada, `tReasignacionPropiedad`).

### Canal WhatsApp/IA — decidido (24-jun-2026)
- **Leads multicanal:** portales (Inmuebles24, Mercado Libre, Lamudi…), recomendación, anuncio en calle, anuncio **en la propiedad**, redes sociales. → **La clave NO siempre viene.**
- **Intake de lead sin clave:** el **agente IA** le pide al cliente la propiedad de interés → solicita **clave**, **link del portal**, o **foto del cartel/anuncio** → **extrae la clave** (parseo de links de portal + **lectura de la clave en la foto del letrero**, vision/OCR) → corre `resolverAsesorDestino` → asigna.
- **Iris reemplaza a Make:** `resolverAsesorDestino` se implementa **nativo** en el backend (no se invoca Make).
- **Agente IA administrativo (WhatsApp):** el administrador conversa con Iris por WhatsApp para ejecutar acciones (reasignar, asignar manualmente, consultar estado). Requiere intención + autorización por rol.
- **Inbox = tablero Kanban de recepción:** las conversaciones del número de empresa avanzan por estados (`NUEVO`, `EN_ATENCION`, `EN_ESPERA_CLIENTE`, `EN_ESPERA_RESPUESTA`, `ASIGNADO`, `PERDIDO`, `CERRADO`) en `tConversacion.estado`. Esto es estado del **chat de recepción**, NO el pipeline del deal (ese vive en Pipedrive). Por eso Iris no es un CRM.
- **Handoff al asignar:** Iris envía **mensaje de transición** al cliente ("el asesor X te contactará") y **cierra el hilo** de recepción; el asesor sigue por su WhatsApp personal.
- **Métricas:** Iris solo mide **recepción** (leads captados, atendidos por IA vs. administrativo, tiempo de respuesta, perdidos). La **conversión** del lead se mide en **Pipedrive**.

## Otras decisiones ABIERTAS (pendientes de cerrar)
- Horario laboral exacto y zona horaria de CrossHome.
- ¿Migrar el número actual o usar uno nuevo?
- Verificación de Meta Business y aprobación de plantillas.
- Estimación de horas de desarrollo por fase (cotización).
- Documentos fuente para el RAG (Fase 2).

## Próximos pasos sugeridos

1. Cerrar las decisiones abiertas (sobre todo Pipedrive Lead/Deal, asignación, horario).
2. Definir ORM y generar el esqueleto del backend NestJS (módulos: Webhook, Routing, Schedule, Bot, Agent, Outbound, Notification, Sla, integraciones Pipedrive/Slack).
3. Configurar WhatsApp Cloud API y verificación de Meta Business.
4. Arrancar Fase 1 (MVP).

## Cómo retomar la conversación con el asistente en otro equipo

Comparte este archivo (`CONTEXTO.md`) y la propuesta al inicio de la nueva sesión. Con eso el asistente recupera todo el contexto y las decisiones sin perder nada.
