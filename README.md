# Espejo de Datos

> **Convierte tu cartola bancaria en un espejo financiero ciudadano.**
> Descubre cómo te ven el Banco, la Fintech y el Estado — con señales explicables,
> datos oficiales en tiempo real y simulaciones "¿qué pasaría si…?".

Construido para el **Claude Impact Lab Chile 2026** · Línea 01 Inclusión Financiera · AI Builder.

> **Video demo:** *(agregar link antes del 7 mayo 17:00)*

## 🌐 App en vivo

# [espejo-de-datos.vercel.app](https://espejo-de-datos.vercel.app/)

---

## Herramientas Anthropic utilizadas

| Herramienta | Uso |
|---|---|
| **Agent SDK** | MirrorBuilderAgent orquesta 5 tools MCP en loop agentico (hasta 10 rondas) |
| **MCP** | `financial-mirror-mcp` expone 6 tools de dominio (parse, macro, profile, signals, lenses, simulate) |
| **Files API** | Carga y descarta cartolas PDF de forma privada — eliminado en bloque `finally` |
| **Extended Thinking** | `interleaved-thinking-2025-05-14` en MirrorBuilderAgent (análisis completo) y LetterGeneratorAgent (cartas SERNAC) |
| **Citations** | Fundamenta cartas ciudadanas en extractos de ley chilena vigente (Ley 18.010, 19.496, 21.236, 21.719) |
| **Prompt Caching** | `cache_control: ephemeral` en system prompt de los 3 agentes — cache hit visible en el UI |

---

## ¿Qué hace?

1. **Analiza** tu cartola bancaria (demo con Paula o Luis, o sube la tuya).
2. **Genera un espejo** con 7 señales canónicas: uso de cupo, liquidez, regularidad de ingresos, avances, brecha tributaria, tasa cercana a la TMC, pagos puntuales.
3. **Muestra 3 lentes** — cómo interpreta tu perfil un banco tradicional, una fintech y el Estado/SII.
4. **Simula cambios**: "¿qué mejora si bajo mi uso de cupo en 20%?"
5. **Genera borradores de carta** para ejercer derechos ante el SERNAC o la CMF.
6. **Dashboard macro** con UF, IPC, TPM, TMC, Dólar observado e IMACEC — todo en tiempo real desde APIs oficiales.

Todo sin guardar ningún dato. Sin base de datos. Sin login.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / API | Next.js 14 App Router + TypeScript + Tailwind CSS |
| IA | Claude API · `claude-sonnet-4-6` (agentes) · `claude-haiku-4-5` (cartas) |
| MCP server | Python 3.10 + FastMCP · 6 tools · transporte stdio |
| Datos macro | mindicador.cl · Banco Central BDE API (autenticada) |
| Persistencia | Ninguna — todo en memoria, sin DB |
| Deploy | Vercel (Next.js) + local stdio (MCP) |

---

## Correr local

**Requisitos:** Node.js 20+, Python 3.10+

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/Miltondz/Espejo-de-Datos.git
cd Espejo-de-Datos
npm install

# 2. Variables de entorno
cp .env.local.example .env.local   # o crea el archivo manualmente
# ANTHROPIC_API_KEY=sk-ant-...     → activa los 3 agentes Claude
# BDE_USER / BDE_PASS              → activa Dólar observado + IMACEC desde BCentral

# 3. Correr Next.js
npm run dev
# → http://localhost:3000

# 4. MCP server (opcional — segunda terminal)
cd mcp-server
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python financial_mirror_mcp.py
```

> **Modo demo funciona sin API key ni MCP server.** Ve a `/analizador` → "Probar con Paula".
> Con `ANTHROPIC_API_KEY` los agentes se activan automáticamente. Sin ella, el sistema usa lógica determinista como fallback.

---

## Arquitectura

```
app/
  page.tsx                     # Landing
  analizador/page.tsx          # Core — upload + espejo completo + teasers
  dashboard/page.tsx           # Dashboard macro (6 indicadores)
  educacion/page.tsx           # Glosario + leyes + recursos CMF, SERNAC, BCN
  nosotros/page.tsx            # Equipo Dunatech
  historial/page.tsx           # Preview v2.0 — historial de análisis
  comunidad/page.tsx           # Preview v2.0 — talleres B2G
  proximas-funciones/page.tsx  # Roadmap v1.0 → v3.0
  api/
    macro/route.ts             # GET  /api/macro  — indicadores en tiempo real
    analyze/route.ts           # POST /api/analyze — espejo completo
    simulate/route.ts          # POST /api/simulate — simulación what-if
    generar-carta/route.ts     # POST /api/generar-carta — borrador carta

components/espejo/             # 14 componentes UI
  ProfileSummaryCard           # Resumen de perfil con barra ingresos/egresos
  SignalsGrid                  # Señales ordenadas por importancia
  InstitutionLensesTabs        # 3 lentes (banco / fintech / estado)
  SimulationPanel              # Panel what-if con simulación
  CartolaUpload                # Upload PDF + tabs demo/upload + toggle thinking
  CartaModal                   # Generador de cartas ciudadanas
  PasaporteButton              # Pasaporte financiero imprimible
  PrivacyBadge                 # Badge privacidad by design
  AnalysisProgress             # Overlay de progreso durante análisis
  ComplianceBadges             # 14 badges de cumplimiento normativo
  MacroStrip                   # Indicadores macro en vivo (UF, TPM, TMC, USD)
  ChatEspejoTeaser             # Preview "coming soon" chat con el espejo
  OpenFinanceTeaser            # Preview "coming soon" conexión bancaria directa

lib/
  data-adapter.ts              # DAL: única interfaz hacia fuentes de datos
  espejo-builder.ts            # FinancialProfile → EspejoResponse (fallback)
  agents/
    mirrorBuilderAgent.ts      # Agente principal — Extended Thinking + Prompt Caching
    actionPlannerAgent.ts      # Agente simulación what-if (usa signals[])
    letterGeneratorAgent.ts    # Agente generador de cartas (Haiku)
    toolImplementations.ts     # 6 tools + schemas Anthropic + ejecutor

types/
  profile.ts                   # FinancialProfile — contrato de dominio
  espejo.ts                    # EspejoResponse + EspejoResponseMeta (_meta)

data/                          # Fixtures demo: Paula (emprendedora) y Luis (jubilado)
mcp-server/
  financial_mirror_mcp.py      # FastMCP: 6 tools, 1 resource, 1 prompt
  requirements.txt
.claude/commands/              # 6 slash commands para Claude Code
```

### Flujo de datos

```
Browser → POST /api/analyze
  → MirrorBuilderAgent (claude-sonnet-4-6)
      → parse_cartola()
      → fetch_macro_indicators()   ← mindicador.cl + BDE
      → build_financial_profile()
      → extract_signals()
      → generate_lenses()
  → EspejoResponse (JSON)
  → Frontend renderiza espejo
```

Si el agente falla o no hay API key → `buildEspejoFromProfile()` (determinista, nunca rompe).

---

## APIs integradas

| API | Indicadores | Autenticación |
|---|---|---|
| [mindicador.cl](https://mindicador.cl) | UF, IPC, TPM, TMC | Pública |
| [Banco Central BDE](https://si3.bcentral.cl) | Dólar observado, IMACEC | Usuario + contraseña |
| [Anthropic Claude](https://console.anthropic.com) | Agentes IA | API key |

---

## Historial de versiones

| Versión | Fecha | Qué se construyó |
|---|---|---|
| **v0.1** | 6 mayo | Documentación completa, CLAUDE.md, fixtures demo Paula y Luis |
| **v0.2** | 6 mayo | Scaffold Next.js — tipos, DAL, espejo-builder, 3 API routes, 8 componentes UI |
| **v0.3** | 6 mayo | 6 slash commands de Claude Code instalados en `.claude/commands/` |
| **v0.4** | 6 mayo | MCP server Python completo — 6 tools, resource, prompt (FastMCP + httpx) |
| **v0.5** | 6 mayo | 3 agentes Claude con loop agentico y fallback determinista |
| **v0.6** | 6 mayo | Dashboard conectado a mindicador.cl en tiempo real (UF, IPC, TPM) |
| **v0.7** | 6 mayo | TMC real desde `mindicador.cl/api/tmc` — umbral dinámico en señales |
| **v0.8** | 6 mayo | `/api/macro` con integración BDE (USD/CLP + IMACEC) · fix parse agentes · `/educacion` con 4 leyes chilenas |
| **v1.0** | 6 mayo | Rediseño UI completo — landing, analizador, dashboard, educación, historial, comunidad |
| **v1.1** | 6 mayo | Landing: sección "Privacidad por diseño" con 14 badges temáticos · context hints en upload · CSS de impresión |
| **v1.2** | 7 mayo | Página `/nosotros` equipo Dunatech · sección rubric en landing · ficha-proyecto.md · fix error mensajes API |
| **v1.3** | 7 mayo | Extended Thinking en MirrorBuilderAgent + badge _meta en UI · MacroStrip live · ChatEspejoTeaser + OpenFinanceTeaser · /proximas-funciones con roadmap · redesigns /nosotros /historial /comunidad /educacion · NavLinks "Pronto" |
| **v1.4** | 7 mayo | Fixes mobile 360–480px: hamburger menu, MacroStrip overflow-x-auto, grids 3→2 cols, hero text responsivo, footer compacto |

Ver [CHANGELOG.md](./CHANGELOG.md) para el detalle técnico completo.

---

## Roadmap hackathon — 6–7 mayo 2026

### Día 1 — 6 mayo

| Bloque | Estado |
|---|---|
| Scaffold MVP — Next.js, tipos, DAL, espejo-builder, API routes, componentes | ✅ |
| MCP server — 6 tools Python | ✅ |
| 3 agentes Claude con loop agentico y fallback | ✅ |
| APIs reales — mindicador.cl, TMC, Banco Central BDE | ✅ |
| Loop agentico verificado con API key real | ✅ |
| Frontend polish — layout, diseño Tailwind, UX (Alejandra) | ✅ |

### Día 2 — 7 mayo

| Bloque | Estado |
|---|---|
| PDF upload vía Files API (drag-and-drop, privacidad by design) | ✅ |
| Extended Thinking + Citations en LetterGeneratorAgent | ✅ |
| Prompt Caching en los 3 agentes | ✅ |
| Rediseño frontend completo — landing, analizador, dashboard, educación | ✅ |
| CartaModal con toggles thinking/citations + modoUsado badge | ✅ |
| SignalsGrid ordenado por importancia + señales legales accionables | ✅ |
| Pasaporte imprimible (@media print) | ✅ |
| Pitch + Ficha Cívica — video demo, entrega portal | 🔜 |
| **Deadline 17:00 UTC-4** | ⏰ |

### Post-hackathon

| Hito | Descripción |
|---|---|
| v0.9 — 30 días | Upload real de cartola PDF/Excel con parser |
| v1.0 — 60 días | Integración Open Finance / SFA |
| v1.1 — 90 días | Historial de análisis opt-in, comparación de períodos |
| v1.x | Canal B2G — integración FOSIS, BancoEstado MiPyme |

---

## Equipo

| Persona | Rol |
|---|---|
| Milton | Arquitectura · Backend · IA |
| Alejandra | Liderazgo · Frontend · UX |
| Adolfo | Negocio · Adopción |
| Renzo | Legal · Datos Personales |

---

## Disclaimer

Espejo de Datos es una herramienta **educativa**. No es asesoría financiera ni legal. No predice ni emula decisiones reales de bancos, fintechs ni organismos del Estado. Sus señales son lecturas plausibles basadas en patrones observables, no reglas exactas de ninguna institución. Los datos se procesan en memoria y **nunca se almacenan**.
