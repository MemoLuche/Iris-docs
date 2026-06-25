---
tags: [iris, flujo, agente-admin, ia]
---

# 05 · Agente IA Administrativo (por WhatsApp)

[[Flujos/00 - Índice de Flujos|← Índice de Flujos]]

Además del agente de cara al cliente, Iris expone un **agente IA de cara al administrador por WhatsApp**: el operador/owner conversa en lenguaje natural y la IA **ejecuta acciones de gestión**, sin entrar al panel (AdminAgentModule).

## Acciones soportadas

| Acción | Ejemplo de instrucción |
|---|---|
| **Reasignar** un cliente a otro asesor | "Reasigna a Juan Pérez con Carolina" |
| **Asignar manualmente** un lead | "Asigna el cliente del 55-1234 a Héctor" |
| **Consultar estado** | "¿A quién está asignado el cliente X?", "¿Cuántos leads sin atender hay?" |
| **Marcar ausencia / cubridor** | "Pon a Gabriela ausente del 1 al 5 de julio, la cubre Ana" |

## Diagrama

```mermaid
sequenceDiagram
    participant Adm as 👤 Administrador (WhatsApp)
    participant WH as WebhookModule
    participant Auth as Autorización (rol)
    participant LLM as LLM (intención + tool calling)
    participant Svc as Servicios internos<br/>(Assignment / Agent / Pipedrive)
    participant Log as tLog

    Adm->>WH: mensaje ("reasigna a X con Y")
    WH->>Auth: ¿número autorizado y rol OPERADOR/OWNER?
    Auth-->>WH: no → responder "no autorizado" y fin
    Auth->>LLM: sí → interpretar intención
    LLM->>LLM: detectar acción + parámetros (tool call)
    LLM->>Adm: confirmar acción sensible<br/>("¿Confirmas reasignar X→Y?")
    Adm->>LLM: "sí"
    LLM->>Svc: ejecutar (p. ej. resolverAsesorDestino / updateDeal owner)
    Svc->>Log: registrar acción (auditoría)
    Svc-->>Adm: resultado ("Listo, X reasignado a Y")
```

## Seguridad (RNF-02 / RNF-03)

- El número del administrador debe estar **autorizado** y con **rol `OPERADOR` u `OWNER`**.
- Las acciones **sensibles** (asignación/reasignación, cambios de config) **confirman antes de ejecutar**.
- Toda acción queda registrada en `tLog` (`categoria = AGENTE_ADMIN`, auditoría).

## Implementación

- Detección de intención + **tool calling** del LLM contra los servicios internos.
- Las "tools" expuestas al LLM son envoltorios de los mismos servicios que usa el panel (AssignmentModule, AgentModule, PipedriveModule) → una sola fuente de lógica, dos interfaces (panel y WhatsApp).

## Relación con otros flujos

- Reasignar/asignar reutiliza [[Flujos/03 - Asignación (resolverAsesorDestino)]].
- Las acciones impactan el [[Flujos/04 - Handoff y Kanban de Recepción|Kanban]] y Pipedrive.
