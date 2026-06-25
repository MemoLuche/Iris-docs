# Iris — Documentación

Repositorio de **documentación** del Proyecto Iris (herramienta de atención de WhatsApp con IA para **CrossHome**).

> Iris **no es un CRM**: se integra con Pipedrive, gestiona la WhatsApp Cloud API, automatiza la asignación de leads (reemplaza a Make) y opera dos agentes IA (cliente y administrador).

## Estructura del repo

```
Iris-docs/
├── docs/                  ← Vault de documentación (Obsidian-ready)
│   ├── 00 - Índice.md     ← Empieza aquí (mapa de toda la documentación)
│   ├── 01..15 ...         ← Visión, arquitectura, datos, requerimientos, etc.
│   └── Flujos/            ← Diagramas de flujo (Mermaid)
├── CONTEXTO.md            ← Notas de trabajo (origen del proyecto)
└── Propuesta-Bot-IA-WhatsApp-CrossHome.md   ← Propuesta inicial
```

## Cómo usar

- **Punto de entrada:** [`docs/00 - Índice.md`](docs/00%20-%20Índice.md).
- **Recomendado:** abrir la carpeta `Iris-docs` como **vault en Obsidian** para navegar los `[[enlaces]]` y ver los diagramas **Mermaid** renderizados.
- Exportable a Notion si se requiere.

## Repos relacionados

| Repo | Contenido |
|---|---|
| **Iris-docs** | Esta documentación |
| **Iris-backend** | API NestJS + Prisma (WhatsApp, routing, IA, integraciones) |
| **Iris-frontend** | Panel React + Vite (SPA) |
