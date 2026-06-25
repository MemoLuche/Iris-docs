---
tags: [iris, decisiones, adr]
---

# 10 · Registro de Decisiones

[[00 - Índice|← Índice]]

Bitácora de decisiones del proyecto (estilo ADR ligero).

## ✅ Decisiones cerradas

| # | Decisión | Razón | Fecha |
|---|---|---|---|
| D-01 | **WhatsApp Cloud API directo con Meta** (no WhatsApp Web, no BSP) | Oficial y estable; sin riesgo de bloqueo; sin markup; hosting gratis | — |
| D-02 | **Backend NestJS, monolito modular** | A <1,000 conv/mes los microservicios son sobreingeniería | — |
| D-03 | **PostgreSQL + pgvector** | Relacional + RAG en la misma BD | — |
| D-04 | **Redis + BullMQ** | Sesiones, contexto, jobs de SLA | — |
| D-05 | **OpenAI** (cascada de modelos + caching + visión + tool calling) | Control de costo; visión para leer claves; tool calling para agente admin | — |
| D-06 | **Frontend React + Vite (SPA)**, no Next.js | Panel privado tras login; no requiere SSR; deploy estático barato | — |
| D-07 | **AWS: 1× EC2 + Docker Compose** en el MVP | Más barato que ECS+RDS+ElastiCache a este volumen | — |
| D-08 | **ORM: Prisma** | Mejor DX/type-safety, migraciones declarativas; pgvector vía raw queries | 2026-06-24 |
| D-09 | **Pipedrive: inbound = Lead → Deal al calificar** | Mantiene limpio el pipeline y las métricas de conversión | 2026-06-24 |
| D-10 | **Registro en Pipedrive: resumen + enlace** (no volcar cada mensaje) | El sistema es dueño de la conversación; no saturar el CRM | 2026-06-24 |
| D-11 | **Slack (MVP): solo notificaciones** | Acciones interactivas (Block Kit) en Fase 2/3; menor alcance del MVP | 2026-06-24 |
| D-12 | **Iris reemplaza a Make** (`resolverAsesorDestino` nativo) | Una sola fuente de lógica; sin dependencia de Make | 2026-06-24 |
| D-13 | **Asignación dirigida por la clave del inmueble** (no round-robin) | Replica el modelo real de CrossHome: la propiedad manda | 2026-06-24 |
| D-14 | **Iris NO es un CRM; se integra con Pipedrive** | Pipedrive sigue como sistema de registro del deal | 2026-06-24 |
| D-15 | **Asesores fuera del panel** | Reciben el lead (owner Pipedrive + Slack) y atienden por su WhatsApp personal | 2026-06-24 |
| D-16 | **Inbox = tablero Kanban de recepción** | Gestiona el estado del chat de recepción, no el pipeline del deal | 2026-06-24 |
| D-17 | **Handoff: mensaje de transición + cerrar hilo** | El asesor continúa por su WhatsApp personal | 2026-06-24 |
| D-18 | **Métricas: solo recepción en Iris**; conversión en Pipedrive | Iris no ve la conversación asesor↔cliente | 2026-06-24 |
| D-19 | **Agente IA administrativo por WhatsApp** | El admin ejecuta acciones por conversación (con autorización por rol) | 2026-06-24 |
| D-20 | **Arquitectura en capas + monolito modular** | Presentación → aplicación → infraestructura; dependencias hacia adentro | 2026-06-24 |
| D-21 | **Auth: JWT access (corto) + refresh** | Access en memoria; **refresh en cookie httpOnly**; guards JWT + Roles | 2026-06-24 |
| D-22 | **Webhook asíncrono vía BullMQ** | Responder 200 rápido y procesar en cola; resiliencia e idempotencia | 2026-06-24 |
| D-23 | **Estado front: TanStack Query (servidor) + Zustand (UI global)** | Separar estado de servidor del estado de UI | 2026-06-24 |
| D-24 | **Asignación manual = formulario independiente; baja de asesor = lógica** | Form estilo el Google Form actual; desactivar conserva historial | 2026-06-24 |
| D-25 | **Base de conocimientos (RAG) propia** con autoaprendizaje supervisado | Igualar/superar la propuesta de Gazeti AI; conocimiento contextual con trazabilidad y control humano | 2026-06-24 |
| D-26 | **Sin catálogo/BD de propiedades en el sistema** | Las propiedades viven en sus portales; el sistema solo enruta por la clave. La base de conocimientos es solo info general (identidad, políticas, manuales, FAQs) | 2026-06-24 |
| D-27 | **Frontend en repo aparte (`Iris-frontend`)** | Este repo es solo backend; la SPA se despliega en S3/CloudFront | 2026-06-24 |
| D-28 | **Personas separadas: `tUsuario` (login) y `tAsesor` (ventas)** | Asesores no usan panel; modelos con responsabilidades distintas | 2026-06-24 |
| D-29 | **`tLog` unificado** (reemplaza `tAsignacion` y `tIntegracionLog`) | Un solo log de todo el sistema con enums `categoria`/`motivo`/`nivel`; el historial de asignaciones se consulta por `categoria=ASIGNACION` | 2026-06-24 |
| D-30 | **Kanban = cambio de estado del chat; notificaciones solo toasts** | UX simple: columnas = estados de la conversación; sin centro de notificaciones | 2026-06-24 |

## ⏳ Decisiones abiertas (pendientes de CrossHome)

| # | Pendiente | Necesario para |
|---|---|---|
| A-01 | Horario laboral exacto y **zona horaria** | ScheduleModule / `horario_abierto()` |
| A-02 | ¿**Migrar el número** actual (pierde uso en app normal) o usar uno nuevo? | WhatsApp Cloud API |
| A-03 | Verificación de **Meta Business** y aprobación de plantillas iniciales | Despliegue / outbound |
| A-04 | **Volumen real** de conversaciones/mes | Afinar costos OpenAI/WhatsApp |
| A-05 | **Etapas reales** del pipeline de Pipedrive | Mapeo Lead/Deal/Stage |
| A-06 | **Lista real de asesores** (iniciales, IDs Pipedrive/Slack, altas/bajas) | `tAsesor` (validar; Tania/Johanna ya no laboran, etc.) |
| A-07 | Documentos fuente para el **RAG** (Fase 2) | `tDocumentoEmbedding` |
| A-08 | **Estimación de horas** de desarrollo por fase | Cotización |
| A-09 | **Nombre comercial** definitivo | Branding |
| A-10 | Mapeo de **links de portales** (Inmuebles24/ML/Lamudi) → clave interna | Intake (Flujo 02) |
| A-11 | Estrategia de **tipos compartidos** back↔front (OpenAPI / paquete común) | [[14 - Arquitectura de Software (Frontend)]] |
| A-12 | **Fijar versiones** del stack al iniciar el repo (las del doc 02 son indicativas) | [[02 - Arquitectura]] |
| A-13 | Documentos y **contenido inicial** de la base de conocimientos (identidad, políticas, FAQs) — *se definirá más adelante* | [[15 - Base de Conocimientos (RAG)]] |

## Notas

- La lógica de asignación existente vive en automatizaciones Make/Integromat de CrossHome (carpeta local `crosshome`, repo aparte). Sirve de **referencia** para `resolverAsesorDestino`, pero los IDs pueden estar desactualizados (validar en A-06).
- El usuario mencionó un **link de documentos de CrossCoam** (automatizaciones previas) aún no compartido.
