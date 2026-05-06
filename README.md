# Espejo de Datos

> Convierte tu cartola bancaria en un **espejo financiero ciudadano**: descubre cómo te ven Banco, Fintech y Estado, con señales explicables y simulaciones "¿qué pasaría si…?".

Construido para el **Claude Impact Lab Chile 2026** — Línea 01 Inclusión Financiera.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / API | Next.js 14 App Router + TypeScript + Tailwind CSS |
| IA | Claude API (`claude-sonnet-4-6`) vía `@anthropic-ai/sdk` |
| MCP server | Python + FastMCP (`financial-mirror-mcp`) |
| Persistencia | Ninguna — todo en memoria, sin DB |
| Deploy | Vercel (Next.js) + local stdio (MCP) |

---

## Correr local

**Requisitos:** Node.js 20+, Python 3.10+

```bash
# 1. Clonar e instalar
git clone https://github.com/Miltondz/Espejo-de-Datos.git
cd Espejo-de-Datos
npm install

# 2. Variables de entorno (solo necesario para los agentes IA)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 3. Correr Next.js
npm run dev
# → http://localhost:3000

# 4. Correr MCP server (segunda terminal, cuando esté implementado)
cd mcp-server
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux
pip install fastmcp httpx
python financial_mirror_mcp.py
```

> El modo demo (`/analizador` → "Probar con Paula") funciona **sin API key** ni MCP server.

---

## Estructura

```
app/
  page.tsx                    # Landing
  analizador/page.tsx         # Core — upload + espejo completo
  dashboard/page.tsx          # Indicadores macro
  educacion/page.tsx          # Recursos CMF, SERNAC, BCN
  api/
    analyze/route.ts          # POST /api/analyze
    simulate/route.ts         # POST /api/simulate
    generar-carta/route.ts    # POST /api/generar-carta
components/espejo/            # 8 componentes UI
lib/
  data-adapter.ts             # DAL: mock → FinancialProfile
  espejo-builder.ts           # FinancialProfile → EspejoResponse
  agents/                     # Helpers de agentes Claude (día 1 tarde)
types/
  profile.ts                  # FinancialProfile (dominio interno)
  espejo.ts                   # EspejoResponse (contrato frontend)
data/                         # Fixtures demo Paula y Luis
mcp-server/                   # Python FastMCP (día 1 tarde)
.claude/commands/             # 6 skills para Claude Code
```

---

## Disclaimer

Espejo de Datos es una herramienta educativa. No es asesoría financiera ni legal. No predice decisiones de bancos, fintech ni organismos del Estado. Tus datos se procesan en memoria y nunca se guardan.

---

## Equipo

| Rol | Persona |
|---|---|
| Arquitectura / Backend / IA | Milton |
| Liderazgo / Frontend / UX | Alejandra |
| Negocio / Adopción | Adolfo |
| Legal / Datos Personales | Renzo |

---

## Roadmap — Hackathon 6–7 mayo 2026

### Día 1 — 6 mayo

| Hora (UTC-4) | Bloque | Estado |
|---|---|---|
| 00:00 → en curso | **Scaffold MVP** — Next.js, tipos, DAL, espejo-builder, 3 API routes, 8 componentes, 6 skills | ✅ |
| En curso → 19:00 | **Frontend polish** — layout, diseño Tailwind, UX `/analizador` (Alejandra) | 🔄 |
| 19:00 → 21:00 | **MCP server** — 6 tools Python (parse_cartola, fetch_macro_indicators, build_financial_profile, extract_signals, generate_lenses, simulate_change) | 🔜 |
| 21:00 → 23:59 | **Integración agentes** — MirrorBuilderAgent + ActionPlannerAgent conectados a `/api/analyze` y `/api/simulate` | 🔜 |

### Día 2 — 7 mayo

| Hora (UTC-4) | Bloque | Estado |
|---|---|---|
| 09:00 → 11:00 | **Easy wins** — Pasaporte imprimible (`@media print`), SimulationPanel slider, CartaModal con LetterGeneratorAgent | 🔜 |
| 11:00 → 14:00 | **QA + demo script** — Flujo Paula feliz + fallbacks + mobile | 🔜 |
| 14:00 → 17:00 | **Pitch + Ficha Cívica** — Grabación video demo, entrega portal | 🔜 |
| **17:00** | **Deadline entrega técnica** | ⏰ |

### Post-hackathon (roadmap producto)

| Hito | Descripción |
|---|---|
| v0.5 — 30 días | Upload real de cartola PDF/Excel con parser |
| v0.6 — 60 días | Integración Open Finance / SFA cuando esté disponible |
| v1.0 — 90 días | Historial de análisis opt-in, comparación de períodos |
| v1.x | Canal B2G — integración con programas FOSIS, BancoEstado MiPyme |

---

## Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para el historial detallado de cambios.
