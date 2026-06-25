---
tags: [iris, moc, indice]
---

# 🟣 Proyecto Iris — Documentación

> **Iris** es la herramienta de atención de WhatsApp con IA para **CrossHome** (inmobiliaria). NO es un CRM: se integra con **Pipedrive**, gestiona la **WhatsApp Cloud API**, automatiza la **asignación de leads** (reemplaza a Make) y opera dos **agentes IA** (cliente y administrador).

Este vault es la documentación viva del proyecto. Pensado para **Obsidian** (Markdown + Mermaid + `[[enlaces]]`); exportable a Notion.

## 🗺️ Mapa de la documentación

| # | Documento | Contenido |
|---|---|---|
| 01 | [[01 - Visión y Alcance]] | Qué es Iris, problema, objetivos, alcance |
| 02 | [[02 - Arquitectura]] | Vista general: contexto, contenedores, stack |
| 13 | [[13 - Arquitectura de Software (Backend)]] | NestJS: capas, módulos, JWT, Prisma, colas |
| 14 | [[14 - Arquitectura de Software (Frontend)]] | React: routing, auth, estado, tiempo real |
| 03 | [[03 - Requerimientos]] | Requerimientos funcionales (RF) y no funcionales (RNF) |
| 04 | [[04 - Modelo de Datos]] | Tablas PostgreSQL + diagrama ER |
| 05 | [[05 - Roles y Permisos]] | Administrador, Operador, IA; el asesor fuera del panel |
| 06 | [[06 - Integraciones]] | WhatsApp Cloud API, Pipedrive, Slack |
| 07 | [[07 - Infraestructura]] | AWS, despliegue, entornos |
| 08 | [[08 - Costos]] | Operación recurrente y comparativo SaaS |
| 09 | [[09 - Fases y Roadmap]] | MVP, Fase 2, Fase 3 |
| 10 | [[10 - Registro de Decisiones]] | Bitácora de decisiones (ADR) |
| 11 | [[11 - Glosario]] | Términos clave |
| 12 | [[12 - Frontend (Estructura y Vistas)]] | Panel SPA: navegación, vistas, administración |
| 15 | [[15 - Base de Conocimientos (RAG)]] | Conocimiento del agente: documentos, RAG, autoaprendizaje |

## 🔀 Flujos (diagramas)

| Flujo | Descripción |
|---|---|
| [[Flujos/00 - Índice de Flujos\|Índice de Flujos]] | Mapa de todos los flujos |
| [[Flujos/01 - Mensaje Entrante (Resolvedor de Modo)\|01 · Mensaje entrante]] | Quién responde: IA / administrativo |
| [[Flujos/02 - Intake y Obtención de Clave\|02 · Intake de clave]] | Obtener la clave del inmueble |
| [[Flujos/03 - Asignación (resolverAsesorDestino)\|03 · Asignación]] | `resolverAsesorDestino` |
| [[Flujos/04 - Handoff y Kanban de Recepción\|04 · Handoff y Kanban]] | Transición al asesor + estados |
| [[Flujos/05 - Agente IA Administrativo\|05 · Agente admin]] | Acciones por WhatsApp |

## 📌 Estado del proyecto

Fase de **diseño / documentación**. Arquitectura, stack, modelo de datos y requerimientos definidos. **Aún sin código.**

> Documentos de origen (notas de trabajo): `../CONTEXTO.md`, `../Propuesta-Bot-IA-WhatsApp-CrossHome.md`. Este vault los consolida y formaliza.
