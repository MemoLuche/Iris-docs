# Iris — Prototipo de diseño (mockup)

Prototipo **navegable** del panel de Iris, hecho en **HTML/CSS/JS puro** (sin frameworks ni backend), para **validar requerimientos y funcionalidades con el cliente** durante la fase de diseño.

> ⚠️ **No es el frontend real.** Usa datos de ejemplo y no se conecta a nada. El frontend real será React + Vite (ver `../docs/14 - Arquitectura de Software (Frontend).md`).

## Cómo abrirlo

Abre **`index.html`** con doble clic (login) → botón **Entrar** → panel.
O directo el panel: **`app.html`**.

No requiere servidor ni instalación.

## Qué incluye (vistas core)

- **Login**
- **Inbox Kanban** + **Conversación** (chat, asignar con preview de `resolverAsesorDestino`)
- **Asignación manual** (formulario + preview de asesor calculado)
- **Asesores** (lista) + **detalle/edición** (ausencias, cubridor, fallback, baja lógica)
- **Horarios** (semanal + excepciones)
- **Reglas de reasignación**
- **Base de conocimientos** (documentos, identidad del agente, propuestas, playground)
- **Métricas** de recepción
- **Auditoría / Logs** (tLog)
- **Configuración** (IA, integraciones, usuarios, agente admin, plantillas)
- **Mi cuenta**

## Archivos

```
prototipo/
├── index.html   ← login
├── app.html     ← shell del panel (sidebar + topbar)
├── styles.css   ← estilos (tema Iris)
├── app.js       ← router por hash + vistas + interacciones
└── data.js      ← datos de ejemplo (mock)
```

## Notas para la demo

- El **Kanban** representa el estado del chat de recepción (no el pipeline de Pipedrive).
- Los **asesores no usan el panel**: al asignar, se notifica por Slack/Pipedrive y atienden desde su WhatsApp personal.
- Botones/acciones muestran un *toast* de confirmación (demo), no ejecutan nada real.

Mapea a los requerimientos en `../docs/03 - Requerimientos.md` y a las vistas en `../docs/12 - Frontend (Estructura y Vistas).md`.
