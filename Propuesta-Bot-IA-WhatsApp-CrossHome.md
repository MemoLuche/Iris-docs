# Propuesta de Proyecto — Sistema de Atención WhatsApp con IA para CrossHome

**Nombre clave:** Proyecto Iris (nombre comercial por definir)
**Cliente:** CrossHome
**Documento:** Propuesta técnica y de infraestructura (versión de trabajo)
**Fecha:** 24 de junio de 2026
**Estado:** En construcción — documento vivo

---

## 1. Resumen ejecutivo

CrossHome atiende actualmente su WhatsApp de forma **manual**: un celular con chip conectado a WhatsApp Web en una computadora, desde donde un asesor responde los mensajes. Este esquema no escala, depende de un dispositivo físico, no permite métricas ni varios agentes simultáneos, y deja sin atención los mensajes fuera de horario laboral.

Esta propuesta plantea migrar a una **solución propia** sobre la **WhatsApp Business Platform (Cloud API)** de Meta. El número de empresa funciona como **recepción**: los **administrativos de oficina** atienden y hacen triage desde un **panel web**, y un **asistente de IA entra únicamente cuando se requiere** (fuera de horario, descansos, festivos o por activación manual) para responder, captar la propiedad de interés y **asignar el lead al asesor que corresponde**. El asesor recibe el lead (owner en Pipedrive + aviso en Slack) y atiende al cliente desde su **WhatsApp personal**. El desarrollo a medida evita las cuotas mensuales de plataformas SaaS (Wati, Kommo, Zendesk) y da control total sobre datos, flujo y experiencia.

**Beneficio clave:** atención 24/7 sin contratar más personal, métricas reales del canal, y un costo operativo estimado de **~$50–100 USD/mes** frente a $50–300+ USD/mes de plataformas comerciales con menos control.

---

## 2. Situación actual vs. objetivo

| Aspecto | Hoy (manual) | Con el sistema propuesto |
|---|---|---|
| Canal | Celular + WhatsApp Web | WhatsApp Cloud API (oficial) |
| Atención del número de empresa | 1 (un dispositivo) | Varios administrativos, desde panel web |
| Fuera de horario | Sin atención | IA responde, capta la propiedad y asigna el lead |
| Asignación a asesor | Manual, en la cabeza del administrativo | `resolverAsesorDestino` (clave del inmueble) + Pipedrive + Slack |
| Métricas | Ninguna | Dashboard en tiempo real |
| Dependencia física | Celular siempre encendido | Infraestructura en la nube |
| Riesgo | Bloqueo de sesión, pérdida de chip | Plataforma oficial y estable |

**Objetivo:** el número de empresa como recepción, atendido por administrativos en horario y por IA fuera de horario, que **asigna cada lead al asesor dueño de la propiedad**; el asesor cierra con el cliente desde su WhatsApp personal. Con seguimiento de leads en Pipedrive y métricas.

---

## 3. Alcance funcional y requerimientos

### Requisitos confirmados

- **Panel web** para que los **administrativos de oficina** atiendan el número de empresa en horario laboral (inbox tipo WhatsApp Web, en tiempo real) y hagan triage/asignación. Los **asesores no usan el panel**: atienden por su WhatsApp personal tras la asignación.
- **IA que se activa solo cuando se requiere:** fuera de horario de oficina, en descansos (ej. comida), en festivos, o por activación manual del agente por un tiempo específico.
- **Conmutación bot ↔ humano** por reglas y manual.
- **Integración con Pipedrive** (CRM, sistema de registro). Iris **no es un CRM**: se integra con Pipedrive.
- **Integración con Slack** para coordinación y alertas del equipo.
- **Automatizaciones de asignación/reasignación** de leads, **reemplazando el sistema actual de Make/Integromat** (`resolverAsesorDestino` nativo).
- **Agente IA administrativo por WhatsApp:** el administrador ejecuta acciones por conversación (reasignar, asignar manualmente, consultar estado), con autorización por rol.
- **Intake inteligente del lead:** la IA obtiene la clave del inmueble cuando no viene (pide propiedad de interés, link de portal o foto del cartel; parsea/lee la clave).
- Control de clientes por parte de operadores de oficina y asesores.

### La IA como "modo", no como motor permanente

El sistema decide, **para cada mensaje entrante**, quién responde (agente o IA) mediante un *resolvedor de modo*. La IA nunca interrumpe a un agente activo; entra solo cuando las reglas lo indican.

### 3.1 Roles y permisos

**Iris opera sobre el número de WhatsApp _de la empresa_ (recepción).** Los **asesores NO son usuarios del sistema ni del panel**: cuando se les asigna un cliente, atienden por su **WhatsApp personal**, fuera de Iris. Solo hay dos roles humanos en el panel (**Administrador/Owner** y **Administrativo de oficina**) más la **IA** como actor virtual.

| Rol | Permisos |
|---|---|
| **Administrador / Owner** | Acceso total: ve todas las conversaciones y asesores, configura horarios y reglas de asignación, gestiona la lista de asesores (altas/bajas, ausencias, cubridores, fallback), controla el kill-switch de IA, ve métricas globales |
| **Administrativo de oficina** (operador) | Primer punto de contacto y triage: ve las conversaciones del número de empresa, identifica la clave del inmueble, asigna/reasigna clientes a asesores, responde en horario desde el panel, monitorea SLA |
| **IA** (actor virtual) | Responde al cliente fuera de horario, hace el intake (obtiene la clave), califica, asigna vía `resolverAsesorDestino` y escala; además, agente administrativo por WhatsApp para el operador/owner. No ocupa asiento de panel |

> **El asesor no es un rol del panel.** Recibe el lead asignado como **owner del Deal en Pipedrive** + **notificación en Slack** (a su canal), y se comunica con el cliente desde su **WhatsApp personal**. Esa conversación asesor↔cliente ocurre fuera de Iris.

### 3.2 Gestión de leads e integración con Pipedrive

Pipedrive es el **sistema de registro** (datos del lead y pipeline). Mapeo conceptual:

| Concepto WhatsApp | Objeto Pipedrive |
|---|---|
| Contacto que escribe | **Person** (match por teléfono; crea si no existe) |
| Nueva consulta/interés | **Lead** (bandeja) → se convierte en **Deal** al calificar |
| Asesor que atiende | **Owner** del Deal |
| Etapa del proceso | **Stage** del pipeline |
| Datos capturados por IA (zona, presupuesto, tipo) | **Campos personalizados** |

Ciclo de vida del lead (mapeado a etapas del pipeline):

```
Nuevo (WhatsApp) → Contactado → Calificado → Cita/Visita → Negociación → Ganado/Perdido
```

La IA, fuera de horario, **pre-califica** el lead (zona, presupuesto, tipo de propiedad) y lo deja cargado en Pipedrive para que el asesor lo retome con contexto.

**Fuente de verdad y sincronización:**

- **Pipedrive es dueño** de los datos del lead/deal, etapa y owner.
- **El sistema es dueño** de la conversación y los mensajes.
- No se vuelca cada mensaje al CRM (lo satura): se registra una **Nota/Actividad con resumen + enlace** a la conversación en el panel (resumen generado por IA).
- Sincronización bidireccional vía **webhooks de Pipedrive** ↔ eventos del backend.

### 3.3 Gestión de asesores y asignación

**Decisión (24-jun-2026): la asignación NO es round-robin ni perfilación por atributos del lead. Es _asignación dirigida por la clave del inmueble_**, replicando la lógica que CrossHome **ya opera hoy** en automatizaciones Make/Integromat (carpeta `C:\Users\marid\Documents\crosshome`). La propiedad manda: el dueño de la propiedad es el asesor destino, salvo reglas de reasignación.

#### Estructura del equipo

- **10 asesores** (cada uno con iniciales de 2 letras, ID de Pipedrive y canal de Slack propio).
- **2 administrativos** = rol **operador**. Hoy son el **primer punto de contacto**: reciben al cliente, identifican el inmueble y registran el lead (Google Form). En Iris, ese triage se hace desde el panel.

#### Clave del inmueble (fuente de la asignación)

Clave compuesta de 3 partes. Ejemplo: `HRCVCENTRO01`.

| Segmento | Significado | Ejemplo |
|---|---|---|
| 2 letras | **Iniciales del asesor dueño** | `HR` = Huascar Ramírez |
| 2-3 letras | **Tipo de propiedad + negocio** | `CV` = Casa Venta |
| Resto | Identificador de la propiedad | `CENTRO01` |

Tipos de contrato reconocidos: `CR` Casa Renta · `CV` Casa Venta · `LR/LV` Local · `TR/TV` Terreno · `OR/OV` Oficina · `DR/DV` Departamento · `BR/BV` Bodega · `ER/EV` Edificio · `COR/COV` Consultorio (estos dos requieren detección con `contains()` por solapar con prefijos de 2 letras).

#### Algoritmo `resolverAsesorDestino` (a replicar en RoutingModule/AssignmentModule)

Entrada: `asesorCandidato` (derivado del prefijo de la clave) + `claveInmueble`.

```
1. ¿Existe regla en REASIGNACIONES_PROPIEDAD para (asesorPropietario, claveInmueble)?
   → SÍ: asesorDestino = regla.AsesorDestino   (motivo: reasignacion_por_propiedad, + nota)
2. ¿asesorCandidato está AUSENTE hoy? (hoy dentro de FechaAusenteDesde..FechaAusenteHasta)
   → SÍ: asesorDestino = candidato.cubridor     (motivo: reasignacion_por_ausencia)
3. En otro caso:
   → asesorDestino = asesorCandidato            (motivo: asignacion_directa)
Fallback global: si no se resuelve, asesorDestino = asesor con EsFallback=TRUE (hoy Carolina).
```

#### Reglas y datos de soporte (hoy en Google Sheets → migrar a tablas)

- **ASESORES**: iniciales, ID Pipedrive, canal Slack, `EsFallback`, `FechaAusenteDesde/Hasta`, cubridor.
- **REASIGNACIONES_PROPIEDAD**: reglas específicas `(asesorPropietario, claveInmueble) → asesorDestino`.
- **Override manual**: el operador puede forzar el asesor destino en el momento del registro.

#### Match con Pipedrive (ya definido en el flujo actual)

Buscar Person por **teléfono principal → teléfono secundario → correo**. Si existe: mover el deal a "No contactados" y notificar al dueño actual. Si es nuevo: crear Person + Deal con `owner = asesorDestino` y notificar al canal de Slack del asesor.

#### Intake del lead y obtención de la clave (canal WhatsApp)

A diferencia del flujo actual (el administrativo conoce la clave y la captura), en WhatsApp **el cliente inicia y la clave no siempre viene**. Los leads llegan de múltiples medios: portales (Inmuebles24, Mercado Libre, Lamudi), recomendación, anuncio en la calle, **anuncio en la propiedad**, redes sociales.

El **agente IA** resuelve la clave antes de asignar:

1. Pregunta por la **propiedad de interés**.
2. Acepta y procesa: **clave** dictada, **link del portal** (parseo a clave), o **foto del cartel/anuncio** (lectura de la clave en la imagen — vision/OCR).
3. Con la clave, ejecuta `resolverAsesorDestino` y asigna; si no logra obtenerla, cae a la **cola del administrativo** (operador) para triage manual.

### 3.3.1 Tablero Kanban de conversaciones (recepción)

El panel del administrativo **no es un simple inbox**: es un **tablero Kanban** donde cada conversación del número de empresa avanza por **estados de recepción** (campo `tConversacion.estado`). Esto NO es el pipeline de Pipedrive (ese gestiona el deal con el asesor); aquí se gestiona el **estado del chat de recepción**.

Estados propuestos (configurables):

| Estado | Significado |
|---|---|
| `NUEVO` | Chat entrante sin atender |
| `EN_ATENCION` | IA o administrativo respondiendo |
| `EN_ESPERA_CLIENTE` | Se espera respuesta/datos del cliente (ej. la clave o foto del cartel) |
| `EN_ESPERA_RESPUESTA` | El cliente escribió y espera respuesta nuestra |
| `ASIGNADO` | Lead asignado a un asesor (handoff hecho) |
| `PERDIDO` | Cliente no respondió / descartado |
| `CERRADO` | Conversación de recepción finalizada |

**Handoff al asignar:** al asignar el lead a un asesor, Iris **envía un mensaje de transición** al cliente (ej. "El asesor X te contactará en breve") y **cierra el hilo de recepción** (estado → `ASIGNADO`/`CERRADO`). El asesor continúa desde su WhatsApp personal, fuera de Iris.

### 3.4 Control del operador de oficina

- Tablero de supervisión en tiempo real (todas las conversaciones + asesor + SLA).
- Reasignar conversaciones entre asesores.
- Tomar el control de cualquier chat.
- Activar/desactivar IA global o por conversación.
- Gestionar horarios, descansos y festivos.
- Métricas de recepción: leads captados, leads asignados por asesor, atendidas por IA vs. administrativo, tiempo de respuesta, perdidos. (La tasa de conversión del deal vive en Pipedrive.)

### 3.5 Integración con Slack

Slack es el **canal de coordinación y alertas** (complementa el panel, no lo reemplaza):

- **Nuevo lead fuera de horario** (IA) → mensaje a `#leads` con resumen y datos.
- **Escalamiento** (cliente molesto / pide humano) → alerta a `#soporte` o DM al asesor, con botón **"Tomar conversación"** (deep-link al panel).
- **Aviso de SLA** (nadie contestó en X min) → ping al operador.
- **Resumen diario/semanal** de métricas al canal del equipo.
- *(Opcional)* acciones interactivas con **Block Kit**: tomar/reasignar leads desde Slack.

### 3.6 Agente IA administrativo por WhatsApp

Además del agente de cara al cliente, Iris expone un **agente IA de cara al administrador por WhatsApp**: el operador conversa en lenguaje natural y la IA **ejecuta acciones de gestión**, sin entrar al panel.

- Acciones: **reasignar** un cliente a otro asesor, **asignar manualmente** un lead, **consultar estado** (a quién está asignado un cliente, leads sin atender, SLA), marcar ausencia/cubridor de un asesor.
- **Seguridad:** el número del administrador debe estar autorizado y con **rol operador**; las acciones sensibles confirman antes de ejecutar. Toda acción queda en `tIntegracionLog`.
- Implementación: detección de intención + *tool calling* del LLM contra los servicios internos (AgentModule / AssignmentModule).

### 3.7 Lista consolidada de requerimientos funcionales

| ID | Requerimiento |
|---|---|
| RF-01 | Recibir y enviar mensajes de WhatsApp vía Cloud API |
| RF-02 | Resolver por cada mensaje quién responde (IA / administrativo) según modo y horario |
| RF-03 | Inbox web en tiempo real del número de empresa, para administrativos (no para asesores) |
| RF-04 | Tomar / liberar conversación (administrativo) y asignar/reasignar el lead a un asesor |
| RF-05 | Activar IA manualmente por tiempo específico (`caduca_en`) |
| RF-06 | Configurar horarios, descansos y excepciones (festivos) |
| RF-07 | IA responde fuera de horario y pre-califica leads |
| RF-08 | Escalamiento bot → humano por intención o por SLA |
| RF-09 | Crear/actualizar Person, Lead y Deal en Pipedrive |
| RF-10 | Sincronizar owner y etapa con Pipedrive (bidireccional) |
| RF-11 | Registrar resumen + enlace de conversación como Nota en Pipedrive |
| RF-12 | Notificaciones y alertas a Slack (leads, escalamiento, SLA, digest) |
| RF-13 | Roles y permisos (administrador-owner / administrativo-operador; el asesor no es usuario del panel) |
| RF-14 | Tablero de supervisión y métricas para administradores/operadores |
| RF-15 | Asignación de leads dirigida por la clave del inmueble (`resolverAsesorDestino`: reglas de reasignación + ausencias/cubridor + fallback), con cola manual de respaldo |
| RF-16 | Intake IA del lead: obtener la clave por dictado, link de portal o foto del cartel (vision/OCR) |
| RF-17 | Agente IA administrativo por WhatsApp: reasignar/asignar/consultar por conversación, con autorización por rol |

---

## 4. Arquitectura general

```
        Cliente (WhatsApp)
                │
                ▼
        Meta WhatsApp Cloud API
                │  (webhook)
                ▼
        ┌───────────────────────┐
        │   Backend NestJS      │
        │  (monolito modular)   │
        │                       │
        │  Webhook → Routing →  │
        │  (Schedule / Bot /    │
        │   Agent / SLA)        │
        └───────┬───────┬───────┘
                │       │
       ┌────────┘       └─────────┐
       ▼                          ▼
  PostgreSQL + pgvector        Redis (BullMQ)
  (datos + RAG)                (cache, colas, SLA)
       │
       ▼
  OpenAI API (respuestas IA)
                │
                ▼
        Panel de agentes (React SPA)
        S3 + CloudFront · WebSocket (Socket.io)
```

Diseño **monolito modular** (no microservicios): para el volumen esperado (<1,000 conversaciones/mes) es más barato, más simple de operar y suficiente. La separación en microservicios queda como evolución futura si el volumen lo exige.

---

## 5. Lógica de IA y horarios

### Modos de conversación (`tConversacion.modo`)

| Modo | Comportamiento |
|---|---|
| `AUTO` | Sigue el horario laboral (valor por defecto) |
| `HUMANO_ACTIVO` | Un agente la tomó; la IA permanece en silencio |
| `FORZAR_IA` | IA siempre, aun en horario (con `caduca_en` opcional) |
| `FORZAR_HUMANO` | Siempre humano, aun fuera de horario (ej. cliente VIP) |

El campo `caduca_en` resuelve la activación **por tiempo específico**: un agente activa la IA "hasta las 16:00" (junta de equipo) y a esa hora la conversación vuelve sola a `AUTO`.

### Algoritmo del resolvedor de modo (por mensaje)

```
mensaje_entra(conv):
  if conv.modo == FORZAR_HUMANO:   → encolar_agente()
  elif conv.modo == FORZAR_IA:     → responder_IA()
  elif conv.modo == HUMANO_ACTIVO: → notificar_panel()        # IA callada
  else:  # AUTO
     if horario_abierto(ahora):
        encolar_agente()
        programar_fallback_SLA(conv, 10 min)   # nadie contesta → IA entra
     else:
        responder_IA()
```

`horario_abierto()` evalúa horarios por día, descansos y excepciones (festivos, cierres, juntas).

### Casos cubiertos

- **Noche / fin de semana:** IA responde, captura el lead y crea ticket de seguimiento.
- **Hora de comida (hueco en el horario):** IA cubre automáticamente.
- **Festivo / cierre:** IA todo el día (vía excepción).
- **Junta imprevista:** agente activa "IA hasta las 16:00".
- **Nadie contesta en horario:** fallback por SLA, la IA entra a los 10 min.
- **Cliente pide humano / molesto en horario:** la IA detecta la intención y encola con prioridad.

---

## 6. Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Mensajería | WhatsApp Cloud API (directo con Meta, sin BSP) | Oficial, sin markup de intermediario, hosting gratis de Meta |
| Backend | NestJS + TypeScript | Estructura modular, ya es stack del equipo |
| Base de datos | PostgreSQL + extensión pgvector | Relacional + RAG en la misma BD (sin vector DB aparte) |
| Cache / colas | Redis + BullMQ | Sesiones, contexto, jobs de SLA |
| IA | OpenAI API | GPT-4o mini (clasificar) · GPT-5.4 mini (responder) · GPT-5.5 (razonamiento complejo) · modelo con **visión** para leer la clave en fotos de carteles · **tool calling** para el agente administrativo |
| Frontend | React + Vite (SPA) + TypeScript | Panel privado tras login; no requiere SSR; deploy estático barato |
| UI | Tailwind + shadcn/ui | Desarrollo rápido y consistente |
| Datos cliente | TanStack Query | Cache y sincronización con el API |
| Tiempo real | Socket.io | Inbox en vivo, presencia, "agente escribiendo" |
| CRM | Pipedrive API + webhooks | Sistema de registro de leads (ya en uso) |
| Coordinación | Slack API + Block Kit | Alertas, escalamiento y acciones del equipo (ya en uso) |
| Infra | AWS — EC2 + Docker Compose, ECR, S3 + CloudFront | Costo mínimo a este volumen; escalable a futuro |

### Estrategia de modelos de IA (control de costo)

- **GPT-4o mini** — clasificar intención, detectar "quiero un humano", calificar lead (lo más barato).
- **GPT-5.4 mini** — respuestas conversacionales normales.
- **GPT-5.5** — solo cuando la consulta requiere razonamiento complejo.
- **Prompt caching** activado — descuenta 75–90% el prompt repetido (instrucción de sistema + catálogo).

---

## 7. Modelo de datos (PostgreSQL)

Nomenclatura con prefijo `t` según convención del equipo.

| Tabla | Propósito |
|---|---|
| `tCliente` | Datos del contacto de WhatsApp |
| `tConversacion` | Hilo por cliente. Campos: `modo`, `caduca_en`, `agente_asignado_id`, **`estado`** (columna Kanban de recepción), `asesor_asignado_id` (al hacer handoff) |
| `tMensaje` | Cada mensaje (entrante/saliente), autor (cliente / IA / agente) |
| `tAgente` | Asesores del panel. Campos clave de asignación: `iniciales` (2 letras), `pipedrive_id`, `slack_channel`, `es_fallback`, `ausente_desde`, `ausente_hasta`, `cubridor_id` |
| `tReasignacionPropiedad` | Reglas específicas `(asesor_propietario, clave_inmueble) → asesor_destino`, con nota/motivo (migra de la Sheet REASIGNACIONES_PROPIEDAD) |
| `tHorario` | `dia_semana`, `hora_inicio`, `hora_fin` (varias filas por día → turnos partidos y descansos) |
| `tExcepcion` | `fecha`, `tipo` (FESTIVO \| CIERRE \| HORARIO_ESPECIAL), `hora_inicio`, `hora_fin` |
| `tConfiguracionIA` | `ia_global_activa` (kill-switch), `sla_minutos`, `mensaje_fuera_horario`, `zona_horaria` |
| `tDocumentoEmbedding` | Vectores pgvector para RAG (catálogo, políticas, créditos) |
| `tTicket` / `tLead` | Seguimiento de prospectos (Fase 2) |
| `tAgente` (rol) | Campo `rol` (OPERADOR \| ASESOR), `disponibilidad`, `carga_max` |
| `tMapeoCRM` | Vínculo entre `tCliente`/`tConversacion` y los IDs de Pipedrive (Person/Lead/Deal) |
| `tIntegracionLog` | Auditoría de sincronizaciones con Pipedrive y Slack |

---

## 8. Componentes del sistema

### Backend (módulos NestJS)

- **WebhookModule** — recibe mensajes de Meta, valida firma, persiste.
- **RoutingModule** — el resolvedor de modo (cerebro del sistema).
- **ScheduleModule** — `horario_abierto()`, horarios, excepciones, zona horaria.
- **BotModule** — OpenAI + RAG (pgvector). Incluye **intake del lead**: pedir/leer la clave (dictado, link de portal, foto del cartel con visión).
- **AssignmentModule** — `resolverAsesorDestino` (clave → reglas de reasignación → ausencias/cubridor → fallback). Reemplaza la lógica de Make.
- **AdminAgentModule** — agente IA administrativo por WhatsApp (intención + tool calling: reasignar/asignar/consultar, con autorización por rol).
- **AgentModule** — tomar/liberar conversación, asignación, toggle manual de IA.
- **OutboundModule** — envío de respuestas vía Cloud API.
- **NotificationModule** — eventos en tiempo real al panel (Socket.io).
- **PipedriveModule** — match Person (tel/correo), crear/actualizar Person y Deal, owner, notas, webhooks.
- **SlaModule** — jobs (BullMQ) para el fallback por SLA.

### Frontend (React SPA) — para administrativos y administrador/owner

- **Inbox tipo Kanban** del número de empresa, en tiempo real (lo usan los administrativos, no los asesores): columnas por estado de recepción (`NUEVO`, `EN_ATENCION`, `EN_ESPERA_CLIENTE`, `EN_ESPERA_RESPUESTA`, `ASIGNADO`, `PERDIDO`, `CERRADO`), arrastrables.
- Vista de chat estilo WhatsApp Web; indicador de quién contestó (IA / administrativo) y botones tomar / liberar / activar IA por tiempo.
- **Asignar / reasignar** el lead a un asesor (con sugerencia de `resolverAsesorDestino` y override manual) → dispara handoff (mensaje de transición + cierre del hilo).
- **Configuración** — horarios, descansos, festivos, kill-switch global, y **gestión de asesores** (iniciales, IDs Pipedrive/Slack, ausencias, cubridores, fallback) y reglas de reasignación por propiedad.
- **Dashboard (métricas de recepción)** — leads captados, atendidos por IA vs. administrativo, tiempo de respuesta, asignados por asesor, perdidos. *La conversión final del lead se mide en Pipedrive, no en Iris.*

---

## 9. Infraestructura AWS

| Servicio | Uso |
|---|---|
| **EC2** (t3.small) | NestJS + PostgreSQL + Redis vía Docker Compose |
| **ECR** | Registro de imágenes Docker del backend |
| **S3 + CloudFront** | Hosting estático del panel React (SPA) |
| **Route 53 / ACM** | Dominio y certificados SSL |

Punto de partida deliberadamente simple: **un solo EC2 con Docker Compose**. Cuando el volumen crezca, la ruta de evolución es separar la BD a **RDS**, Redis a **ElastiCache**, y el backend a **ECS Fargate** con autoescalado.

> Nota técnica: ECS/Fargate se evaluó y **no conviene en el MVP** — obligaría a usar RDS + ElastiCache (BD y Redis no corren bien en Fargate), elevando el costo a ~$35–55/mes sin beneficio a este volumen. Es la opción de la fase de escalamiento, no del arranque.

---

## 10. Costos estimados (mensuales)

### Operación (recurrente)

| Concepto | Estimado/mes | Notas |
|---|---|---|
| WhatsApp Cloud API | ~$0–10 USD | La mayoría de chats son *service* (cliente inicia) = **gratis** en ventana de 24h. Solo se paga por plantillas iniciadas por la empresa |
| OpenAI | ~$25–30 USD | A 1,000 conversaciones (~10 turnos c/u) con GPT-5.4 mini; menos con caching |
| AWS (EC2 + S3 + CloudFront + ECR) | ~$15–25 USD | Un EC2 t3.small + estáticos + registro |
| **Total operativo** | **~$50–65 USD/mes** | Escala con el volumen |

> Tarifas WhatsApp México (2026): *service* (cliente inicia) gratis · *utility* $0.0080 · *authentication* $0.0207 · *marketing* $0.0436 por mensaje. Modelo por mensaje desde julio 2025.

### Comparativo vs. SaaS

Plataformas tipo Wati / Kommo / Zendesk: **$50–300+ USD/mes** en suscripción + costos de WhatsApp por encima, con menos control sobre datos y flujo. La solución propia se paga sola a mediano plazo y queda como activo de la empresa.

> El **costo de desarrollo** (horas de ingeniería) se detalla por fases en la sección 11 y se cotiza aparte.

---

## 11. Fases del proyecto

### Fase 1 — MVP

- WhatsApp Cloud API conectada y verificada.
- Backend NestJS: webhook, routing por horario, envío de mensajes.
- Panel React: inbox en tiempo real, tomar/liberar conversación, toggle de IA.
- Configuración de horarios, descansos y festivos.
- IA básica con OpenAI (respuestas + escalamiento a humano).
- Roles operador/asesor y asignación de leads.
- Integración Pipedrive básica (crear Person/Lead, sincronizar owner).
- Notificaciones a Slack (nuevo lead, escalamiento, SLA).
- Despliegue en AWS (EC2 + S3/CloudFront).

### Fase 2 — Inteligencia y seguimiento

- RAG con documentación de CrossHome (catálogo, créditos, políticas).
- Clasificación y calificación automática de leads.
- Tickets y seguimiento.
- Dashboard de métricas.

### Fase 3 — Escalamiento y automatización

- Agenda de citas / visitas.
- Campañas y envíos masivos (plantillas).
- Seguimiento automático de prospectos.
- Integración con CRM y, opcionalmente, migración a ECS Fargate.

---

## 12. Pendientes y decisiones abiertas

### Decisiones cerradas (24-jun-2026)

- [x] **ORM:** Prisma (pgvector vía raw queries para el RAG).
- [x] **Pipedrive:** inbound entra como *Lead* (bandeja) → se convierte a *Deal* al calificar.
- [x] **Registro en Pipedrive:** resumen + enlace (Nota/Actividad); no se vuelca cada mensaje.
- [x] **Slack (MVP):** solo notificaciones; acciones interactivas (Block Kit) en Fase 2/3.

### Abiertas

- [ ] **Asignación de leads = por perfilación.** Pendiente: conversación de descubrimiento sobre quién es CrossHome y sus procesos administrativos internos, para definir los criterios de perfilación y enrutamiento.
- [ ] Definir horario laboral exacto y zona horaria de CrossHome.
- [ ] Confirmar si se migra el número actual (pierde uso en la app normal) o se usa uno nuevo.
- [ ] Verificación de Meta Business y aprobación de plantillas iniciales.
- [ ] Volumen real de conversaciones para afinar costos de OpenAI.
- [ ] Estimación de horas de desarrollo por fase (cotización).
- [ ] Definir documentos fuente para el RAG (Fase 2).
- [ ] Confirmar pipeline y etapas actuales de Pipedrive.

---

*Documento de trabajo — se irá completando conforme avancen las decisiones.*
