---
tags: [iris, vision, alcance]
---

# 01 · Visión y Alcance

[[00 - Índice|← Índice]]

## Qué es Iris

Herramienta propia para **CrossHome** (inmobiliaria) que **NO es un CRM**. Se integra con **Pipedrive** (que sigue siendo el CRM / sistema de registro) y aporta:

1. **Gestión de WhatsApp** vía Cloud API. Hoy CrossHome atiende manual con un celular + WhatsApp Web.
2. **Automatizaciones** de asignación/reasignación de leads — **reemplaza al sistema actual de Make/Integromat**.
3. **Agente IA de cara al cliente** que responde por WhatsApp en los horarios que defina CrossHome.
4. **Agente IA de cara al administrador**, también por WhatsApp, que ejecuta acciones por conversación (reasignar, asignar manualmente, consultar estado).

Se busca una solución **propia** (no SaaS de pago) y, a futuro, **comercializarla** a otras empresas.

- **Nombre clave:** Iris (nombre comercial por definir; candidatos: Atendia, Replai, Leadia, Domia).
- **Origen del nombre:** **Iris**, la **mensajera de los dioses** en la mitología griega — la que lleva los mensajes entre mundos. Encaja con un sistema de atención y mensajería por WhatsApp.
- **Repo backend:** https://github.com/MemoLuche/Iris-backend

## El problema (situación actual)

CrossHome atiende su WhatsApp de forma **manual**: un celular con chip en WhatsApp Web. No escala, depende de un dispositivo físico, no da métricas ni atención fuera de horario, y la asignación de leads vive "en la cabeza" de los administrativos.

| Aspecto | Hoy (manual) | Con Iris |
|---|---|---|
| Canal | Celular + WhatsApp Web | WhatsApp Cloud API (oficial) |
| Atención del número | 1 dispositivo | Varios administrativos, panel web |
| Fuera de horario | Sin atención | IA responde, capta la propiedad y asigna |
| Asignación a asesor | Manual, informal | `resolverAsesorDestino` (clave del inmueble) |
| Métricas | Ninguna | Dashboard de recepción en tiempo real |
| Riesgo | Bloqueo de sesión / pérdida de chip | Plataforma oficial y estable |

## Modelo operativo (clave)

El número de WhatsApp **de la empresa** funciona como **recepción**:

- Los **administrativos** atienden y hacen triage desde un **panel web** (inbox tipo Kanban).
- La **IA** entra solo cuando se requiere (fuera de horario, descansos, festivos, activación manual), responde, **obtiene la clave del inmueble** y **asigna el lead**.
- El **asesor** recibe el lead (owner en Pipedrive + aviso en Slack) y atiende al cliente desde su **WhatsApp personal**. Esa conversación ocurre **fuera de Iris**.

Ver [[05 - Roles y Permisos]] y [[Flujos/04 - Handoff y Kanban de Recepción]].

## Objetivo

Un canal de WhatsApp empresarial: recepción atendida por administrativos en horario y por IA fuera de horario, que **asigna cada lead al asesor dueño de la propiedad**, con seguimiento del deal en Pipedrive y métricas de recepción.

## Beneficio clave

Atención 24/7 sin contratar más personal, asignación consistente y trazable, métricas reales del canal, y costo operativo estimado de **~$50–65 USD/mes** frente a $50–300+ de plataformas SaaS con menos control. Ver [[08 - Costos]].

## Fuera de alcance (explícito)

- Iris **no** reemplaza a Pipedrive ni gestiona el pipeline del deal.
- Iris **no** capta la conversación asesor↔cliente (ocurre en el WhatsApp personal del asesor).
- Los **asesores no son usuarios** del panel.
