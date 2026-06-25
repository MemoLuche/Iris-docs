---
tags: [iris, arquitectura, backend, nestjs]
---

# 13 · Arquitectura de Software — Backend (NestJS)

[[00 - Índice|← Índice]] · [[02 - Arquitectura|← Arquitectura general]]

## Arquitectura en capas

Cada módulo NestJS respeta tres capas + transversales. Las dependencias apuntan **hacia adentro** (la presentación depende de la aplicación; la aplicación depende de abstracciones de infraestructura, no de detalles).

```mermaid
flowchart TD
    subgraph Presentacion["① Presentación"]
        Ctrl["Controllers (REST)"]
        GW["Gateways (WebSocket)"]
        Consumers["Queue Consumers (BullMQ)"]
        WebhookCtrl["Webhook Controller"]
    end
    subgraph Aplicacion["② Aplicación / Dominio"]
        Svc["Services (lógica de negocio)"]
        DTO["DTOs · Entidades · Tipos"]
    end
    subgraph Infra["③ Infraestructura"]
        Prisma["Prisma (repositorios)"]
        Clients["Adaptadores externos<br/>Meta · OpenAI · Pipedrive · Slack"]
        Queue["Colas BullMQ (Redis)"]
    end
    subgraph Cross["Transversal"]
        Guards["Guards (JWT, Roles)"]
        Pipes["Pipes (validación)"]
        Interceptors["Interceptors (logging, transform)"]
        Filters["Exception Filters"]
        Config["ConfigModule"]
    end

    Ctrl --> Svc
    GW --> Svc
    Consumers --> Svc
    WebhookCtrl --> Svc
    Svc --> DTO
    Svc --> Prisma
    Svc --> Clients
    Svc --> Queue
    Cross -.aplica a.-> Presentacion
```

### Anatomía de un módulo

```
src/<modulo>/
├── <modulo>.module.ts        # declara providers, imports, exports
├── <modulo>.controller.ts    # rutas REST (capa presentación)
├── <modulo>.service.ts       # lógica de negocio (capa aplicación)
├── <modulo>.gateway.ts       # (opcional) WebSocket
├── dto/                      # DTOs de entrada/salida + class-validator
├── entities/                # tipos de dominio
└── <modulo>.consumer.ts      # (opcional) procesador de cola BullMQ
```

## Grafo de dependencias de módulos

```mermaid
flowchart TD
    AppModule --> AuthModule
    AppModule --> WebhookModule
    AppModule --> RoutingModule

    WebhookModule --> RoutingModule
    RoutingModule --> ScheduleModule
    RoutingModule --> BotModule
    RoutingModule --> AdminAgentModule
    RoutingModule --> OutboundModule
    RoutingModule --> NotificationModule
    RoutingModule --> SlaModule

    BotModule --> AssignmentModule
    BotModule --> KnowledgeModule
    AdminAgentModule --> AssignmentModule
    AdminAgentModule --> AgentModule
    AssignmentModule --> PipedriveModule
    AssignmentModule --> NotificationModule
    AssignmentModule --> AsesoresModule
    AgentModule --> AsesoresModule

    SlaModule --> RoutingModule

    subgraph Globales["Módulos globales"]
        PrismaModule
        ConfigModule
        QueueModule["QueueModule (BullMQ)"]
        IntegrationsModule["IntegrationsModule (clientes Meta/OpenAI)"]
    end

    AuthModule --> PrismaModule
    AuthModule --> UsersModule
    UsersModule --> PrismaModule
    AsesoresModule --> PrismaModule
    AssignmentModule --> PrismaModule
    ScheduleModule --> PrismaModule
    PipedriveModule --> IntegrationsModule
    BotModule --> IntegrationsModule
    OutboundModule --> IntegrationsModule
    SlaModule --> QueueModule
```

### Responsabilidad de módulos

| Módulo | Capa principal | Depende de |
|---|---|---|
| `AuthModule` | Auth (JWT, login, guards) | Prisma, Users |
| `UsersModule` | Usuarios del panel (`tUsuario`, login, roles) | Prisma |
| `AsesoresModule` | Asesores de ventas (`tAsesor`: iniciales, Pipedrive/Slack, ausencias, cubridor, fallback) | Prisma |
| `WebhookModule` | Ingesta de Meta (valida firma) | Routing |
| `RoutingModule` | Resolvedor de modo | Schedule, Bot, AdminAgent, Outbound, Notification, Sla |
| `ScheduleModule` | `horario_abierto()` | Prisma |
| `BotModule` | IA + intake (texto/visión) | Assignment, Knowledge, Integrations(OpenAI) |
| `KnowledgeModule` | Base de conocimientos (RAG): ingesta, embeddings, búsqueda, autoaprendizaje | Prisma(pgvector), Integrations(OpenAI) |
| `AssignmentModule` | `resolverAsesorDestino` | Pipedrive, Notification, Users, Prisma |
| `AdminAgentModule` | Agente admin (tool calling) | Assignment, Agent, Pipedrive |
| `AgentModule` | Tomar/liberar, toggle IA | Users, Notification, Prisma |
| `OutboundModule` | Envío Cloud API | Integrations(Meta) |
| `NotificationModule` | Socket.io + Slack | Integrations(Slack) |
| `PipedriveModule` | Person/Deal/owner/notas | Integrations(Pipedrive), Prisma |
| `SlaModule` | Jobs de fallback | Queue(BullMQ), Routing |

## Ciclo de vida — mensaje entrante de WhatsApp

```mermaid
sequenceDiagram
    participant Meta
    participant WHC as WebhookController
    participant Sig as Guard (firma Meta)
    participant Q as Cola (BullMQ)
    participant RS as RoutingService
    participant Bot as BotService
    participant Out as OutboundService

    Meta->>WHC: POST /webhook (mensaje)
    WHC->>Sig: validar firma
    Sig-->>WHC: ok
    WHC->>Q: encolar evento (responde 200 rápido)
    Q->>RS: procesar evento
    RS->>RS: resolver modo (Flujo 01)
    alt IA responde
        RS->>Bot: generar respuesta / intake
        Bot->>Out: enviar
        Out->>Meta: mensaje saliente
    else administrativo
        RS->>RS: encolar a panel (Socket.io) + SLA
    end
```

> El webhook **responde 200 de inmediato** y procesa en cola → resiliencia e idempotencia (RNF-05/06).

## Ciclo de vida — petición REST del panel

```mermaid
sequenceDiagram
    participant SPA as Panel (React)
    participant G as JwtAuthGuard + RolesGuard
    participant P as ValidationPipe
    participant C as Controller
    participant S as Service
    participant DB as Prisma → PostgreSQL

    SPA->>G: GET /asesores (Bearer access token)
    G->>G: validar JWT + rol
    G->>P: ok
    P->>C: DTO validado
    C->>S: llamar caso de uso
    S->>DB: query (Prisma)
    DB-->>S: filas
    S-->>C: resultado
    C-->>SPA: JSON (interceptor transforma)
```

## Autenticación y autorización (JWT)

```mermaid
sequenceDiagram
    participant U as Usuario (panel)
    participant Auth as AuthController/Service
    participant DB as Prisma (tUsuario)

    U->>Auth: POST /auth/login {email, password}
    Auth->>DB: buscar usuario
    DB-->>Auth: hash
    Auth->>Auth: bcrypt.compare
    Auth-->>U: access JWT (corto) + refresh token
    Note over U,Auth: Peticiones: Authorization Bearer <access>
    U->>Auth: POST /auth/refresh (refresh token)
    Auth-->>U: nuevo access JWT
```

- **Access token** JWT de vida corta (ej. 15 min), firmado (`@nestjs/jwt` + Passport `JwtStrategy`).
- **Refresh token** de vida larga; recomendación: **cookie httpOnly + SameSite** (mitiga XSS). El access token se mantiene en memoria en el SPA.
- **Guards:** `JwtAuthGuard` (autenticación) + `RolesGuard` con decorador `@Roles('OWNER')` (autorización por rol — RNF-02).
- **Hash de contraseñas:** bcrypt/argon2.
- El **agente admin por WhatsApp** no usa JWT: autoriza por **número + rol** del remitente (ver [[Flujos/05 - Agente IA Administrativo]]).

## Capa de datos — Prisma

- **Schema** único (`schema.prisma`) como fuente de verdad → ver [[04 - Modelo de Datos]].
- **Migraciones** declarativas (`prisma migrate`) versionadas en el repo.
- **PrismaModule** global expone `PrismaService` (cliente) por inyección.
- **Repositorios:** los services usan `PrismaService`; para dominios complejos se puede envolver en un repositorio.
- **Transacciones:** `prisma.$transaction([...])` para operaciones atómicas (ej. crear Person+Deal+mapeo).
- **pgvector:** búsqueda de similitud (RAG, Fase 2) vía `prisma.$queryRaw` (Prisma no soporta el operador vectorial nativamente).
- **Idempotencia:** claves únicas (ej. `message_id` de Meta) para no duplicar al reprocesar webhooks.

## Colas y jobs — BullMQ

```mermaid
flowchart LR
    Prod["Producer (Service)"] -->|add job| Q[("Cola Redis")]
    Q --> Worker["Consumer (@Processor)"]
    Worker --> Svc["Service (efecto)"]
    Sched["Job programado (delay)"] --> Q
```

- **Eventos de webhook:** procesamiento asíncrono y reintentos con backoff.
- **Fallback SLA:** job con `delay` = `sla_minutos`; si nadie contestó, dispara la IA (Flujo 01).
- **Reintentos:** llamadas a Pipedrive/Slack/Meta con reintento y *dead-letter*.

## Transversales

- **ValidationPipe** global + DTOs con `class-validator`.
- **Exception filters** → respuestas de error consistentes.
- **Interceptors** → logging de request/response y *transform* de salida.
- **ConfigModule** → entornos y secretos por variables de entorno.
- **Logger** estructurado (pino).

## Estructura de carpetas (propuesta)

```
src/
├── main.ts
├── app.module.ts
├── common/            # guards, pipes, filters, interceptors, decorators
├── config/            # ConfigModule y validación de env
├── prisma/            # PrismaModule + PrismaService
├── auth/
├── users/             # tUsuario (login, roles)
├── asesores/          # tAsesor (ventas; no login)
├── webhook/
├── routing/
├── schedule/
├── bot/
├── knowledge/         # base de conocimientos (RAG, embeddings, autoaprendizaje)
├── assignment/
├── admin-agent/
├── agent/
├── outbound/
├── notification/
├── pipedrive/
├── sla/
└── integrations/      # clientes Meta / OpenAI / Pipedrive / Slack
prisma/
└── schema.prisma
```
