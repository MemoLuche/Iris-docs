---
tags: [iris, flujo, asignacion]
---

# 03 · Asignación — `resolverAsesorDestino`

[[Flujos/00 - Índice de Flujos|← Índice de Flujos]]

La asignación **NO es round-robin ni perfil por presupuesto/zona: la propiedad manda**. El asesor dueño del inmueble es el destino, salvo reglas de reasignación. Esta lógica ya opera hoy en automatizaciones Make/Integromat de CrossHome; **Iris la implementa nativa** (AssignmentModule) y reemplaza a Make.

## Clave del inmueble (fuente de la asignación)

Ejemplo: `HRCVCENTRO01`.

| Segmento | Significado | Ejemplo |
|---|---|---|
| 2 letras | **Iniciales del asesor dueño** | `HR` = Huascar Ramírez |
| 2-3 letras | **Tipo de propiedad + negocio** | `CV` = Casa Venta |
| Resto | Identificador de la propiedad | `CENTRO01` |

**Tipos de contrato:** `CR` Casa Renta · `CV` Casa Venta · `LR/LV` Local · `TR/TV` Terreno · `OR/OV` Oficina · `DR/DV` Departamento · `BR/BV` Bodega · `ER/EV` Edificio · `COR/COV` Consultorio.

> ⚠️ `COR` / `COV` (consultorio) tienen 3 letras y **solapan** con prefijos de 2 letras → requieren detección especial con `contains()`.

## Diagrama del algoritmo

```mermaid
flowchart TD
    Start([Entrada: claveInmueble]) --> Prefijo["asesorCandidato =<br/>primeras 2 letras de la clave"]
    Prefijo --> Regla{"¿Existe regla en<br/>tReasignacionPropiedad<br/>(asesorPropietario, claveInmueble)?"}

    Regla -->|Sí| R1["asesorDestino = regla.asesorDestino<br/>motivo = reasignacion_por_propiedad<br/>(+ nota de la regla)"]
    Regla -->|No| Ausente{"¿asesorCandidato<br/>ausente hoy?<br/>(hoy ∈ ausente_desde..ausente_hasta)"}

    Ausente -->|Sí| R2["asesorDestino = candidato.cubridor<br/>motivo = reasignacion_por_ausencia"]
    Ausente -->|No| R3["asesorDestino = asesorCandidato<br/>motivo = asignacion_directa"]

    R1 --> Check{¿asesorDestino<br/>resuelto?}
    R2 --> Check
    R3 --> Check
    Check -->|Sí| Salida([asesorDestino])
    Check -->|No| Fallback["asesorDestino = asesor con es_fallback = true<br/>(hoy Carolina)"]
    Fallback --> Salida
```

> El **override manual** (operador elige el asesor al registrar/reasignar) tiene prioridad sobre todo el algoritmo.

## Datos de soporte (migran de Google Sheets a tablas)

| Origen (hoy, Sheet) | Destino (Iris) |
|---|---|
| `ASESORES` | `tAsesor` (iniciales, `pipedrive_id`, `slack_channel`, `es_fallback`, `ausente_desde/hasta`, `cubridor_id`) |
| `REASIGNACIONES_PROPIEDAD` | `tReasignacionPropiedad` (`asesor_propietario`, `clave_inmueble`, `asesor_destino`, `nota`) |

## Tras resolver el asesor: Pipedrive + Slack

```mermaid
flowchart TD
    A([asesorDestino resuelto]) --> Busca["Buscar Person en Pipedrive:<br/>tel principal → tel secundario → correo"]
    Busca --> Existe{¿Person existe?}
    Existe -->|Sí| Upd["Mover Deal a 'No contactados'<br/>+ notificar al dueño actual"]
    Existe -->|No| New["Crear Person + Deal<br/>owner = asesorDestino"]
    Upd --> Slack
    New --> Slack["Notificar al canal de Slack<br/>del asesor destino"]
    Slack --> Handoff([Ir a Flujo 04 · Handoff])
```

## Salida

Lead asignado (owner en Pipedrive + aviso Slack) → [[Flujos/04 - Handoff y Kanban de Recepción]].
