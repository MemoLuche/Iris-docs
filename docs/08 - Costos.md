---
tags: [iris, costos]
---

# 08 · Costos

[[00 - Índice|← Índice]]

## Operación (recurrente, mensual)

| Concepto | Estimado/mes | Notas |
|---|---|---|
| WhatsApp Cloud API | ~$0–10 USD | La mayoría de chats son *service* (cliente inicia) = **gratis** en ventana de 24h. Solo se paga por plantillas iniciadas por la empresa |
| OpenAI | ~$25–30 USD | A 1,000 conversaciones (~10 turnos c/u); menos con prompt caching. Suma uso de **visión** (leer clave en fotos) y **tool calling** del agente admin |
| AWS (EC2 + S3 + CloudFront + ECR) | ~$15–25 USD | Un EC2 t3.small + estáticos + registro |
| **Total operativo** | **~$50–65 USD/mes** | Escala con el volumen |

## Estrategia de control de costo IA

- **GPT-4o mini** — clasificar intención, detectar "quiero un humano", calificar lead (lo más barato).
- **GPT-5.4 mini** — respuestas conversacionales normales.
- **GPT-5.5** — solo cuando la consulta requiere razonamiento complejo.
- **Visión** — solo cuando el cliente manda foto del cartel.
- **Prompt caching** — descuenta 75–90% el prompt repetido (instrucción de sistema + contexto/identidad del agente).

## Comparativo vs. SaaS

Plataformas tipo Wati / Kommo / Zendesk: **$50–300+ USD/mes** de suscripción + WhatsApp por encima, con menos control sobre datos y flujo. La solución propia se paga sola a mediano plazo y queda como **activo** de la empresa (y base para comercializarla).

## Costo de desarrollo

Las **horas de ingeniería** por fase se cotizan aparte (ver [[09 - Fases y Roadmap]]). **Pendiente:** estimación de horas por fase.

## Variables que afinan el costo

- Volumen real de conversaciones/mes (afecta OpenAI y WhatsApp).
- Proporción de plantillas iniciadas por la empresa (marketing/utility).
- Frecuencia de uso de visión (fotos de carteles).
