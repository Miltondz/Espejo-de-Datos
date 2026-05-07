# 17 — Cómo funciona Espejo de Datos en producción (Vercel)

> Para que cualquier integrante del equipo pueda explicar la arquitectura,
> especialmente la pregunta del jurado: **"¿dónde está el servidor MCP?"**

---

## La pregunta clave: ¿el MCP server corre en Vercel?

**No.** El servidor MCP (`mcp-server/financial_mirror_mcp.py`) corre solo en
local, en la máquina del equipo, usando el transporte **stdio**.

**¿Rompe algo?** No. La app en Vercel funciona al 100% sin él.

---

## Por qué: hay dos implementaciones paralelas

El proyecto tiene las tools implementadas **dos veces**, en dos lenguajes
distintos, con el mismo comportamiento:

| Archivo | Lenguaje | Dónde corre | Para qué |
|---|---|---|---|
| `mcp-server/financial_mirror_mcp.py` | Python + FastMCP | Local (stdio) | Claude Desktop, demos locales |
| `lib/agents/toolImplementations.ts` | TypeScript | Vercel serverless | Producción en línea |

Las dos implementaciones hacen exactamente lo mismo: mismas 6 tools, mismos
inputs, mismos outputs. Son **gemelas** en distinto lenguaje.

---

## Cómo fluye una solicitud en Vercel

Cuando un usuario en la web sube una cartola o pide un demo, esto es lo que
ocurre paso a paso:

```
Usuario (browser)
      │
      │  POST /api/analyze
      ▼
Vercel Serverless Function (Next.js)
      │
      │  client.messages.create(tools: MIRROR_TOOLS)
      ▼
Claude API (nube Anthropic)
      │
      │  stop_reason: "tool_use"
      │  → quiero llamar parse_cartola(...)
      ▼
executeTool('parse_cartola', ...) — TypeScript puro, en la misma función
      │
      │  Resultado → devuelto a Claude como tool_result
      ▼
Claude API (segunda llamada)
      │
      │  → quiero llamar fetch_macro_indicators(...)
      ▼
fetchMacroIndicators() — hace fetch HTTP a mindicador.cl
      │
      ▼
Claude API (tercera llamada)
      │  ... y así hasta completar las 5 tools ...
      │
      │  stop_reason: "end_turn"
      │  → JSON final con profileSummary + signals + lenses
      ▼
NextResponse.json(espejo) → el browser muestra el Espejo
```

**El servidor Python nunca aparece en este flujo.** Todo ocurre dentro de la
función serverless de Vercel.

---

## ¿Y los indicadores macro (UF, TMC, dólar)?

Los obtiene en tiempo real desde APIs públicas, también dentro de la función
serverless:

| Indicador | Fuente | Autenticación |
|---|---|---|
| UF, IPC, TPM, TMC | `mindicador.cl/api/{indicador}` | Pública (sin key) |
| Dólar observado | Banco Central BDE API | `BDE_USER` + `BDE_PASS` (env vars en Vercel) |
| IMACEC | Banco Central BDE API | Ídem |

Si una fuente falla, hay valores fallback hardcodeados (UF ~36.500, TPM 4.75%,
TMC 45%). La app nunca se rompe por un timeout de API externa.

---

## ¿Y si Claude (la IA) falla?

Hay una capa de fallback determinista completa:

```
Claude API falla (o ANTHROPIC_API_KEY no está configurada)
      │
      ▼
lib/espejo-builder.ts — lógica pura TypeScript sin IA
      │
      ▼
Espejo generado con reglas fijas (menos rico, pero funcional)
```

**Nunca se devuelve un error 500 al usuario** por culpa de la IA.

---

## ¿Para qué sirve entonces el servidor MCP?

Tiene valor real en dos contextos:

**1. Claude Desktop (uso local del equipo)**
Si un miembro del equipo conecta el MCP a Claude Desktop, puede hacer
preguntas directamente en el chat tipo _"analiza este perfil financiero"_
y Claude usará las mismas tools. Es una forma de explorar sin abrir la app.

**2. Demostración de arquitectura al jurado**
El servidor Python existe, tiene las 6 tools documentadas con types, hace
fetches reales a mindicador.cl. Esto demuestra que la arquitectura está
**diseñada alrededor de MCP** como protocolo — aunque en producción se use
la implementación TypeScript equivalente por razones de despliegue.

---

## Cómo explicarlo en 30 segundos (versión pitch)

> "El MCP define el contrato de nuestras 6 tools financieras — cómo se
> llaman, qué reciben, qué devuelven. En producción en Vercel, esas mismas
> tools están implementadas en TypeScript dentro del serverless. El servidor
> Python MCP lo usamos en local con Claude Desktop y como documentación
> arquitectural. Es el mismo contrato, dos implementaciones."

---

## Diagrama de arquitectura completo

```
┌─────────────────────────────────────────────────────┐
│                   PRODUCCIÓN (Vercel)                │
│                                                     │
│  Browser → /api/analyze (serverless)                │
│                    │                                │
│                    ▼                                │
│         MirrorBuilderAgent.ts                       │
│         ┌─────────────────────┐                    │
│         │  Loop agentico      │                    │
│         │  (máx 10 rondas)   │◄──── Claude API    │
│         │                     │      (Anthropic)   │
│         │  executeTool()      │                    │
│         │  ├─ parse_cartola   │                    │
│         │  ├─ fetch_macro ────┼──► mindicador.cl  │
│         │  ├─ build_profile   │    Banco Central   │
│         │  ├─ extract_signals │                    │
│         │  └─ generate_lenses │                    │
│         └─────────────────────┘                    │
│                    │                                │
│              EspejoResponse JSON                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   LOCAL (equipo)                     │
│                                                     │
│  financial_mirror_mcp.py                            │
│  FastMCP stdio ──► Claude Desktop                   │
│  (mismas 6 tools, Python)                           │
└─────────────────────────────────────────────────────┘
```

---

## Resumen en una oración

> El MCP define la arquitectura; Vercel corre la implementación TypeScript
> equivalente dentro del serverless, sin necesitar un proceso Python aparte.
