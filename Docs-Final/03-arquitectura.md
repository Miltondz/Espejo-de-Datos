# 03 — Arquitectura técnica canónica

> Stack único, capas y responsabilidades del sistema. Si cualquier doc viejo
> contradice esto, manda este.

---

## 1. Stack

| Componente | Decisión | Por qué |
|---|---|---|
| Framework web | **Next.js 14 App Router** | UI + API routes en un proyecto; deploy en Vercel; Claude Code lo domina |
| Lenguaje web | **TypeScript** | Tipado de los contratos del DAL — reduce errores |
| Estilos | **Tailwind CSS** | Incluido por `create-next-app`; rápido de iterar |
| IA | **Claude API + `@anthropic-ai/sdk`** | Modelo `claude-sonnet-4-6` por default |
| MCP | **Python con FastMCP** (`pip install fastmcp httpx`) | Ya existe el código completo escrito; ideal para parsing |
| Persistencia MVP | **Ninguna** | Privacy by design + simplicidad de 48h |
| Deploy | **Vercel** (Next) + MCP local (stdio) en máquina del equipo | Sin infra extra |

**Modelos Claude disponibles** (según bases del Lab, abril 2026):
- `claude-opus-4-7` — razonamiento complejo, agentes largos. Usar si necesitamos
  más profundidad en `MirrorBuilderAgent`. Atención: usa adaptive thinking,
  **no** enviar `temperature`, `top_p`, `top_k`, `budget_tokens`.
- `claude-sonnet-4-6` — **default** del proyecto.
- `claude-haiku-4-5` — clasificación / parseo rápido / generador de cartas.

## 2. Capas lógicas

```
┌─────────────────────────────────────────────────────────────┐
│  UI (Next.js / app/)                                         │
│  pages: / · /analizador · /dashboard · /educacion ·          │
│         /historial · /comunidad                              │
└────────────────────┬────────────────────────────────────────┘
                     │ fetch JSON (EspejoResponse)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  API Routes (app/api/*/route.ts)                             │
│  POST /api/analyze · POST /api/simulate · POST /api/generar-carta │
└────────────────────┬────────────────────────────────────────┘
                     │ llama a un agente (o al DAL si demo)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Agentes Claude (lib/agents/)                                │
│  • MirrorBuilderAgent  → cartola + segmento → EspejoResponse │
│  • ActionPlannerAgent  → perfil + hipótesis → simulación     │
│  • LetterGeneratorAgent → señal legal → texto carta (sin MCP)│
└────────────────────┬────────────────────────────────────────┘
                     │ tool use (MCP)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  MCP server (mcp-server/financial_mirror_mcp.py)             │
│  Tools:                                                      │
│   • parse_cartola         → transacciones                    │
│   • fetch_macro_indicators→ UF, IPC, TPM (mindicador.cl)     │
│   • build_financial_profile → FinancialProfile               │
│   • extract_signals       → EspejoSignal[]                   │
│   • generate_lenses       → EspejoLens[]                     │
│   • simulate_change       → newProfile + diff                │
└────────────────────┬────────────────────────────────────────┘
                     │ funciones puras
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Dominio (lib/)                                              │
│  • lib/data-adapter.ts  (DAL — punto único de entrada de datos) │
│  • lib/espejo-builder.ts (FinancialProfile → EspejoResponse) │
│  • lib/simulation.ts    (reglas de what-if)                  │
└─────────────────────────────────────────────────────────────┘
```

## 3. Estructura de carpetas del repo

```
espejo-de-datos/
├── CLAUDE.md                              # copia de Docs-Final/CLAUDE.md
├── package.json
├── .env.local                             # ANTHROPIC_API_KEY (gitignored)
├── app/
│   ├── layout.tsx                         # header + footer + disclaimer
│   ├── page.tsx                           # landing
│   ├── analizador/
│   │   └── page.tsx                       # core: espejo + sim + pasaporte
│   ├── dashboard/page.tsx                 # macro ligero + CTA "ir a tu espejo"
│   ├── educacion/page.tsx                 # links CMF Educa / SERNAC
│   ├── historial/page.tsx                 # "próximamente"
│   ├── comunidad/page.tsx                 # "próximamente"
│   └── api/
│       ├── analyze/route.ts               # POST cartola/demo → EspejoResponse
│       ├── simulate/route.ts              # POST hipótesis → simulationSuggestion
│       └── generar-carta/route.ts         # POST tipoProblema → cartaTexto
├── components/
│   └── espejo/
│       ├── ProfileSummaryCard.tsx
│       ├── SignalsGrid.tsx
│       ├── InstitutionLensesTabs.tsx
│       ├── SimulationPanel.tsx
│       ├── CartolaUpload.tsx
│       ├── PasaporteButton.tsx
│       ├── CartaModal.tsx
│       └── PrivacyBadge.tsx
├── lib/
│   ├── data-adapter.ts                    # DAL — único punto de fuentes de datos
│   ├── espejo-builder.ts                  # FinancialProfile → EspejoResponse
│   ├── simulation.ts                      # reglas what-if puras
│   ├── claude.ts                          # cliente Anthropic + helpers
│   └── agents/
│       ├── mirrorBuilderAgent.ts
│       ├── actionPlannerAgent.ts
│       └── letterGeneratorAgent.ts
├── types/
│   ├── profile.ts                         # FinancialProfile
│   └── espejo.ts                          # EspejoResponse + subtipos
├── data/
│   ├── demo-financial-profile-paula.json  # copia de Docs-Final/16-fixtures/
│   ├── demo-espejo-paula.json
│   ├── demo-financial-profile-luis.json
│   └── demo-espejo-luis.json
└── mcp-server/
    ├── financial_mirror_mcp.py            # FastMCP — entry point
    ├── requirements.txt                   # fastmcp, httpx
    └── README.md
```

## 4. Responsabilidades por capa

### 4.1. UI (`app/` y `components/`)

- **Solo presentación** y estados locales.
- Consume `EspejoResponse` desde las API Routes.
- No importa nada de `lib/agents/`, `lib/data-adapter.ts` ni el MCP.
- Estilos solo con Tailwind. Sin librerías de UI pesadas.

### 4.2. API Routes (`app/api/*/route.ts`)

- Glue HTTP fino. No hacen lógica de dominio.
- Validan body, llaman al agente o al DAL determinista, devuelven JSON.
- Manejan multipart/form-data en `analyze` para cartolas reales.
- **Fallback obligatorio:** si el agente o el MCP falla, caer al camino
  determinista (`getFinancialProfileFromMock` + `buildEspejoFromProfile`).

### 4.3. Agentes (`lib/agents/`)

- Cada agente es una función `callXxxAgent(input): Promise<Output>`.
- Tienen un `system prompt` exportado como constante.
- Validan el JSON de salida del modelo antes de devolverlo (try/catch + parse +
  chequeo de campos críticos).
- **No** llaman directamente a APIs externas: usan tools MCP.

### 4.4. Dominio (`lib/`)

- **Funciones puras**: sin fetch, sin disco, sin React/Next, sin Claude.
- Reciben `FinancialProfile`, devuelven `EspejoResponse` o partes.
- Son la **garantía de fallback**: si la IA falla, el DAL determinista
  produce un `EspejoResponse` razonable.

### 4.5. MCP (`mcp-server/`)

- Python + FastMCP. Transporte stdio (local).
- Cada tool: input/output tipados, una sola responsabilidad, sin lógica de IA.
- Las tools son la "verdad numérica": parsean cartola, llaman APIs públicas,
  calculan perfiles, extraen señales.

## 5. Flujo principal — `/api/analyze` con cartola real

```
1. Browser: POST multipart con file + segmento.
2. Route: parsea FormData, guarda buffer en memoria.
3. Route: llama callMirrorBuilderAgent({ fileDescriptor, segmento }).
4. MirrorBuilderAgent (Claude Sonnet 4.6 + MCP):
     - llama parse_cartola(filePath) → transacciones
     - llama fetch_macro_indicators(fechaRef) → UF/IPC/TPM
     - llama build_financial_profile(transacciones, periodoMeses, macro) → profile
     - llama extract_signals(profile) → signals
     - llama generate_lenses(profile, signals) → lenses
     - ensambla EspejoResponse y lo devuelve como JSON
5. Route: valida JSON con tipos, descarta el buffer del archivo, devuelve al front.
```

**Fallback:** si paso 4 falla (timeout, JSON inválido, MCP caído), la route
llama al DAL determinista con el `demoId` "paula" como respaldo y marca
`profileSummary.nombreDemo = "Paula (modo demo)"` en la respuesta.

## 6. Flujo `/api/simulate`

```
1. Browser: POST { segmento, goal, hypothesis, [profile/signals opcional] }.
2. Route: llama callActionPlannerAgent(input).
3. ActionPlannerAgent (Claude Sonnet 4.6 + MCP):
     - llama simulate_change(profile, action) → newProfile + changedSignals
     - genera explicación en lenguaje ciudadano con vista por institución
     - devuelve EspejoSimulationSuggestion
4. Route: valida y devuelve { simulationSuggestion }.
```

**Fallback:** si falla, la route llama a `lib/simulation.ts`
`simulateProfileChange()` (función pura) y genera una `simulationSuggestion`
determinista con texto plano.

## 7. Flujo `/api/generar-carta`

```
1. Browser: POST { tipoProblema, nombreInstitucion, tipoProducto, segmento }.
2. Route: llama callLetterGeneratorAgent(input).
3. LetterGeneratorAgent (Claude Haiku 4.5, sin MCP):
     - usa system prompt simple con plantilla y disclaimers.
     - genera el texto.
4. Route: devuelve { cartaTexto }.
```

## 8. Decisiones de diseño que NO se cambian sin acuerdo

1. **MCP en Python**, no TypeScript.
2. **Sin DB** en el MVP.
3. **camelCase** en TypeScript y JSON.
4. **Procesamiento en memoria** de cartolas, descarte explícito tras `analyze`.
5. **DAL como punto único** de fuentes de datos (la app jamás importa
   directo de `cartola-parser` o `macro-fetcher`).
6. **2 agentes core** + 1 mini para cartas. No multiplicar agentes.
7. **`financial-mirror-mcp`** como nombre del servidor.
8. **`claude-sonnet-4-6`** como modelo default.

## 9. Variables de entorno

```bash
# .env.local (gitignored)
ANTHROPIC_API_KEY=sk-ant-...

# Opcional, si se usa Claude Files API o transporte HTTP del MCP:
MCP_SERVER_URL=stdio://mcp-server/financial_mirror_mcp.py
```

## 10. Roadmap evolución (post-Lab, no se construye en 48h)

- Reemplazar `parse_cartola` stub por parser real de PDF/Excel para 5+ bancos.
- Añadir fuentes al DAL: API CMF Bancos, BDE Banco Central, BCN Ley Chile.
- Cuando la CMF abra el sandbox SFA: reemplazar `parse_cartola` por
  `fetch_via_sfa(consent_token)`. **El contrato de `FinancialProfile` no cambia**.
- Persistencia opcional opt-in (perfil agregado, no transacciones).
