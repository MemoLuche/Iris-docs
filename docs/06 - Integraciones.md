---
tags: [iris, integraciones]
---

# 06 · Integraciones

[[00 - Índice|← Índice]]

## WhatsApp Cloud API (Meta)

- **Directo con Meta**, sin BSP: oficial, estable, sin markup de intermediario, hosting gratis de Meta.
- **WebhookModule** recibe mensajes (valida firma), **OutboundModule** envía respuestas.
- ⚠️ Al migrar el número a la API, ese número **deja de funcionar** en WhatsApp normal / Web. El panel debe estar listo antes de migrar.
- Tarifas (MX 2026): *service* (cliente inicia) **gratis** en ventana 24h · *utility* $0.0080 · *authentication* $0.0207 · *marketing* $0.0436 por mensaje.

## Pipedrive (CRM — sistema de registro)

Pipedrive es **dueño** de los datos del lead/deal, etapa y owner. **Iris es dueño** de la conversación de recepción.

| Concepto WhatsApp | Objeto Pipedrive |
|---|---|
| Contacto que escribe | **Person** (match por teléfono; crea si no existe) |
| Nueva consulta/interés | **Lead** (bandeja) → **Deal** al calificar |
| Asesor que atiende | **Owner** del Deal |
| Etapa del proceso | **Stage** del pipeline |
| Datos capturados por IA (zona, presupuesto, tipo) | **Campos personalizados** |

- **Inbound = Lead → Deal al calificar** (mantiene limpio el pipeline). Ver [[10 - Registro de Decisiones]].
- **Match** Person: tel principal → tel secundario → correo.
- **Registro:** **resumen + enlace** (Nota/Actividad), **no** se vuelca cada mensaje.
- **Sincronización** owner/etapa **bidireccional** vía webhooks de Pipedrive ↔ eventos del backend.
- Ciclo de vida (etapas): `Nuevo (WhatsApp) → Contactado → Calificado → Cita/Visita → Negociación → Ganado/Perdido` *(confirmar etapas reales con CrossHome)*.

## Slack (coordinación y alertas)

Canal de coordinación, complementa el panel (no lo reemplaza). **MVP = solo notificaciones**; acciones interactivas (Block Kit) en Fase 2/3.

| Evento | Destino |
|---|---|
| **Nuevo lead fuera de horario** (IA) | `#leads` con resumen y datos |
| **Lead asignado a asesor** | Canal de Slack del asesor (handoff) |
| **Escalamiento** (cliente molesto / pide humano) | `#soporte` o DM al asesor + deep-link al panel |
| **Aviso de SLA** (nadie contestó en X min) | Ping al operador |
| **Resumen diario/semanal** | Canal del equipo |

> Cada asesor tiene su **canal de Slack** propio (mapeado en `tAsesor.slack_channel`).

## Auditoría

Toda sincronización con Pipedrive/Slack queda en `tLog` (`categoria = INTEGRACION`, RNF-03).
