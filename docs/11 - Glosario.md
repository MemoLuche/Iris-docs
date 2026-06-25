---
tags: [iris, glosario]
---

# 11 · Glosario

[[00 - Índice|← Índice]]

| Término | Definición |
|---|---|
| **Iris** | Nombre clave del proyecto: herramienta de WhatsApp + IA + automatizaciones para CrossHome. No es un CRM. |
| **CrossHome** | Inmobiliaria cliente: compra/venta de inmuebles (residencial, comercial, terrenos, desarrollos). 10 asesores + 2 administrativos. |
| **Clave del inmueble** | Código `[2 letras asesor][2-3 letras tipo+negocio][identificador]`, ej. `HRCVCENTRO01`. Fuente de la asignación. Ver [[Flujos/03 - Asignación (resolverAsesorDestino)]]. |
| **`resolverAsesorDestino`** | Algoritmo que decide el asesor de un lead: regla de reasignación → ausencia/cubridor → directa → fallback. |
| **Administrativo / Operador** | Rol humano: primer contacto, triage y asignación desde el panel. (2 en CrossHome.) |
| **Administrador / Owner** | Rol humano con acceso total (config, asesores, métricas, kill-switch). |
| **Asesor** | Vendedor dueño de propiedades. **No usa el panel**; recibe leads (Pipedrive + Slack) y atiende por su WhatsApp personal. |
| **Agente IA (cliente)** | La IA que responde a clientes por WhatsApp fuera de horario, hace intake y asigna. |
| **Agente IA (administrativo)** | La IA que ejecuta acciones de gestión para el admin vía WhatsApp (reasignar, asignar, consultar). |
| **Modo** | Eje "quién responde": `AUTO`, `HUMANO_ACTIVO`, `FORZAR_IA`, `FORZAR_HUMANO`. Ver [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)]]. |
| **Estado (Kanban)** | Eje "punto del chat de recepción": `NUEVO`, `EN_ATENCION`, `EN_ESPERA_CLIENTE`, `EN_ESPERA_RESPUESTA`, `ASIGNADO`, `PERDIDO`, `CERRADO`. |
| **Handoff** | Transición del lead al asesor: mensaje de transición al cliente + cierre del hilo de recepción. |
| **Recepción** | El número de WhatsApp de la empresa, atendido por administrativos + IA (no por asesores). |
| **SLA** | Tiempo máximo en horario sin que un administrativo conteste antes de que entre la IA (fallback). |
| **Modo "IA como modo"** | La IA no es motor permanente: entra solo cuando las reglas lo indican. |
| **Pipedrive** | CRM externo, sistema de registro del lead/deal. Permanece; Iris se integra con él. |
| **BSP** | *Business Solution Provider* de WhatsApp. **No** se usa (conexión directa con Meta). |
| **RAG** | *Retrieval-Augmented Generation*: respuestas de IA apoyadas en documentos de CrossHome. Ver [[15 - Base de Conocimientos (RAG)]]. |
| **Base de conocimientos** | Conjunto de fuentes (identidad, políticas, manuales, FAQs) que el agente usa para contextualizar respuestas. **No** incluye catálogo de propiedades (eso vive en los portales). |
| **Chunk** | Fragmento de un documento, vectorizado (embedding) y almacenado en pgvector para la búsqueda por similitud. |
| **Embedding** | Representación vectorial de un texto; permite buscar contenido semánticamente similar. |
| **Autoaprendizaje supervisado** | La IA propone mejoras al conocimiento; un humano las aprueba/rechaza antes de que entren en vigor. |
| **Contexto/identidad del agente** | Configuración base del agente (tono, reglas, límites, escalamiento) inyectada en el *system prompt*. |
| **Trazabilidad de fuentes** | Registro de qué documentos/chunks usó la IA en cada respuesta (auditoría). |
| **Gazeti AI** | Proveedor externo que propuso un servicio similar a CrossHome; usado como **referencia** de capacidades. |
| **Make / Integromat** | Plataforma de automatización que CrossHome usa **hoy** para asignar leads. Iris la **reemplaza**. |
