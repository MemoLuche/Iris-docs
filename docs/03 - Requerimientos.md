---
tags: [iris, requerimientos]
---

# 03 · Requerimientos

[[00 - Índice|← Índice]]

## Requerimientos funcionales (RF)

| ID | Requerimiento | Flujo |
|---|---|---|
| RF-01 | Recibir y enviar mensajes de WhatsApp vía Cloud API | [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)]] |
| RF-02 | Resolver por cada mensaje quién responde (IA / administrativo) según modo y horario | [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)]] |
| RF-03 | Inbox web tipo Kanban del número de empresa, en tiempo real, para administrativos (no asesores) | [[Flujos/04 - Handoff y Kanban de Recepción]] |
| RF-04 | Tomar / liberar conversación (administrativo) y asignar/reasignar el lead a un asesor | [[Flujos/03 - Asignación (resolverAsesorDestino)]] |
| RF-05 | Activar IA manualmente por tiempo específico (`caduca_en`) | [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)]] |
| RF-06 | Configurar horarios, descansos y excepciones (festivos) | [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)]] |
| RF-07 | IA responde fuera de horario y hace intake del lead | [[Flujos/02 - Intake y Obtención de Clave]] |
| RF-08 | Escalamiento bot → humano por intención o por SLA | [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)]] |
| RF-09 | Crear/actualizar Person, Lead y Deal en Pipedrive | [[06 - Integraciones]] |
| RF-10 | Sincronizar owner y etapa con Pipedrive (bidireccional) | [[06 - Integraciones]] |
| RF-11 | Registrar resumen + enlace de conversación como Nota en Pipedrive | [[06 - Integraciones]] |
| RF-12 | Notificaciones y alertas a Slack (leads, escalamiento, SLA, digest) | [[06 - Integraciones]] |
| RF-13 | Roles y permisos (administrador-owner / administrativo-operador; el asesor no es usuario del panel) | [[05 - Roles y Permisos]] |
| RF-14 | Tablero de supervisión y métricas de recepción | [[05 - Roles y Permisos]] |
| RF-15 | Asignación dirigida por la clave del inmueble (`resolverAsesorDestino`), con cola manual de respaldo | [[Flujos/03 - Asignación (resolverAsesorDestino)]] |
| RF-16 | Intake IA del lead: obtener la clave por dictado, link de portal o foto del cartel (visión/OCR) | [[Flujos/02 - Intake y Obtención de Clave]] |
| RF-17 | Agente IA administrativo por WhatsApp: reasignar/asignar/consultar por conversación, con autorización por rol | [[Flujos/05 - Agente IA Administrativo]] |
| RF-18 | Handoff: al asignar, enviar mensaje de transición y cerrar el hilo de recepción | [[Flujos/04 - Handoff y Kanban de Recepción]] |
| RF-19 | Gestión de asesores: iniciales, IDs Pipedrive/Slack, ausencias, cubridores, fallback, reglas de reasignación | [[04 - Modelo de Datos]] |

## Requerimientos de administración (panel)

| ID | Requerimiento | Vista |
|---|---|---|
| RF-20 | **CRUD de asesores**: alta, edición y **baja lógica** (desactivar, conserva historial). Iniciales de 2 letras **únicas** | [[12 - Frontend (Estructura y Vistas)]] §3 |
| RF-21 | Gestión de **ausencias** por asesor (`ausente_desde`/`ausente_hasta`) y **cubridor** que recibe sus leads | [[12 - Frontend (Estructura y Vistas)]] §3 |
| RF-22 | Marcar un asesor como **fallback** (único en el sistema) | [[12 - Frontend (Estructura y Vistas)]] §3 |
| RF-23 | Gestión de **disponibilidad** (disponible/ocupado/fuera) y **carga máxima** por asesor | [[12 - Frontend (Estructura y Vistas)]] §3 |
| RF-24 | Gestión de **horarios** laborales con turnos partidos/descansos + **excepciones** (festivos/cierres/horario especial) + zona horaria | [[12 - Frontend (Estructura y Vistas)]] §4 |
| RF-25 | **Kill-switch** global de IA y configuración (`sla_minutos`, `mensaje_fuera_horario`, `mensaje_transicion`) | [[12 - Frontend (Estructura y Vistas)]] §7 |
| RF-26 | **CRUD de reglas de reasignación** por propiedad (`tReasignacionPropiedad`) | [[12 - Frontend (Estructura y Vistas)]] §5 |
| RF-27 | **Panel de asignación manual** (formulario independiente): registrar lead que no vino por WhatsApp y asignar/reasignar con **preview** de `resolverAsesorDestino` + override | [[12 - Frontend (Estructura y Vistas)]] §2 |
| RF-28 | **Gestión de usuarios y roles** del panel (operador/owner) | [[12 - Frontend (Estructura y Vistas)]] §7 |
| RF-29 | **Navegación del panel** por rol (SPA) con acceso fino operador vs. owner | [[12 - Frontend (Estructura y Vistas)]] |
| RF-39 | **Vista de auditoría / logs**: consultar `tLog` con filtros (categoría, nivel, asesor, usuario, conversación, fecha) — solo Owner | [[12 - Frontend (Estructura y Vistas)]] §9 |
| RF-40 | **Configurar números/usuarios autorizados** para el agente IA administrativo por WhatsApp | [[12 - Frontend (Estructura y Vistas)]] §7.4 |
| RF-41 | **Gestión de plantillas de WhatsApp** aprobadas por Meta (mensajes iniciados por la empresa) — *Fase 2/3* | [[12 - Frontend (Estructura y Vistas)]] §7.5 |
| RF-42 | **Perfil / mi cuenta**: ver datos del usuario y cambiar contraseña | [[12 - Frontend (Estructura y Vistas)]] §10 |

## Requerimientos de base de conocimientos (RAG)

Ver [[15 - Base de Conocimientos (RAG)]].

| ID | Requerimiento | Fase |
|---|---|---|
| RF-30 | **Gestión de fuentes de conocimiento**: subir/editar/desactivar documentos (PDF/DOCX/XLSX/PPTX/URL/texto) con **extracción automática** | MVP básico / Fase 2 |
| RF-31 | **Indexación**: chunking + embeddings + almacenamiento en pgvector (`tDocumentoEmbedding`); re-indexar al actualizar | Fase 2 |
| RF-32 | **RAG en respuestas**: recuperar contexto relevante (top-k) y responder con **citas/origen** | Fase 2 |
| RF-33 | **Categorización** del conocimiento (identidad/catálogo/política/manual/FAQ) y **vigencia** | Fase 2 |
| RF-34 | **Contexto/identidad del agente** configurable (tono, reglas de negocio, límites, escalamiento) | MVP |
| RF-35 | **Autoaprendizaje supervisado**: la IA propone entradas/correcciones que un humano aprueba/rechaza | Fase 2 |
| RF-36 | **Memoria persistente por conversación** e **identidad multicanal** del contacto | Fase 2 |
| RF-37 | **Trazabilidad/auditoría** del conocimiento usado por la IA en cada respuesta | Fase 2 |
| RF-38 | **Playground**: probar el agente contra la base de conocimientos y ver fuentes citadas | Fase 2 |

## Requerimientos no funcionales (RNF)

| ID | Requerimiento | Detalle |
|---|---|---|
| RNF-01 | **Seguridad webhook** | Validar firma de Meta en cada webhook; rechazar no firmados |
| RNF-02 | **Autorización por rol** | Acciones sensibles (asignación, config, agente admin) restringidas a operador/owner |
| RNF-03 | **Auditoría** | Todo evento relevante (asignaciones, sincronizaciones Pipedrive/Slack, acciones del agente admin, cambios de estado/modo) queda en `tLog` (categoría/motivo/nivel) |
| RNF-04 | **Tiempo real** | El panel refleja mensajes y cambios de estado por WebSocket sin recargar |
| RNF-05 | **Resiliencia** | Reintentos con backoff en llamadas a APIs externas; jobs en cola (BullMQ) |
| RNF-06 | **Idempotencia** | Procesar el mismo webhook dos veces no duplica Person/Deal/mensaje |
| RNF-07 | **Control de costo IA** | Cascada de modelos (clasificar barato → responder → razonar) + prompt caching |
| RNF-08 | **Zona horaria** | Toda la lógica de horarios respeta la zona horaria configurada de CrossHome |
| RNF-09 | **Privacidad de datos** | Datos de clientes propios de CrossHome; control total (sin SaaS de terceros) |
| RNF-10 | **Observabilidad** | Logs estructurados y métricas operativas básicas |

## Pendientes que afectan requerimientos

Ver [[10 - Registro de Decisiones]] (sección "Abiertas"): horario laboral exacto, número de WhatsApp, etapas reales de Pipedrive, lista real de asesores, documentos del RAG.
