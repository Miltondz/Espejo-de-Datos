# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Versiones siguiendo [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

- Pasaporte imprimible con `@media print`
- Frontend polish (Alejandra) — diseño visual y UX

---

## [0.8.0] — 2026-05-06

### Added
- `app/api/macro/route.ts` — endpoint GET /api/macro: consolida UF/IPC/TPM/TMC (mindicador.cl) + Dólar observado + IMACEC (Banco Central BDE API)
- Integración Banco Central BDE — series `F073.TCO.PRE.Z.D` (USD/CLP) y `F032.IMC.IND.Z.Z.EP18.Z.Z.0.M` (IMACEC) con credenciales en `BDE_USER`/`BDE_PASS`
- `types/profile.ts` — campo `benchmarks.tmcPct` para propagar la TMC real al perfil
- `/educacion` — 4 leyes chilenas con links directos a bcn.cl (Ley 18.010, 20.555, 19.496, 21.719) + CMF registro instituciones

### Changed
- `fetchMacroIndicators` — añade TMC real desde mindicador.cl/api/tmc (fallback 45%)
- `extractSignalsFromProfile` — umbral `sig_tasa_cercana_tmc` es ahora dinámico: `tmcPct * 0.90` (no hardcodeado)
- `espejo-builder.ts` — mismo fix de umbral dinámico TMC
- Dashboard migrado a `/api/macro` (fixes arquitectura: fetch externo debe ir por servidor)
- Dashboard muestra 6 indicadores en grilla 2×3 con badge "BCCh" para datos BDE
- `mirrorBuilderAgent.ts` + `actionPlannerAgent.ts` — fix parse: extrae JSON aunque Claude añada texto introductorio
- System prompts reforzados para respuesta JSON pura sin prose

### Fixed
- Loop agentico ahora completa correctamente: Claude genera textos en lenguaje ciudadano enriquecido (verificado con API key real)
- `sig_tasa_cercana_tmc` usa TMC real de la API (45% vigente) en vez de umbral fijo 40%

---

## [0.5.0] — 2026-05-06

### Added
- `lib/agents/toolImplementations.ts` — 6 implementaciones TypeScript de las tools MCP + schemas Anthropic + ejecutor
- `lib/agents/mirrorBuilderAgent.ts` — MirrorBuilderAgent: loop agentico con 5 tool calls en cadena (parse → fetch_macro → build_profile → extract_signals → generate_lenses)
- `lib/agents/actionPlannerAgent.ts` — ActionPlannerAgent: simula cambio con `simulate_change` y genera explicación ciudadana
- `lib/agents/letterGeneratorAgent.ts` — LetterGeneratorAgent: genera borrador de carta con `claude-haiku-4-5`

### Changed
- `app/api/analyze/route.ts` — usa MirrorBuilderAgent si hay API key; fallback determinista si falla
- `app/api/simulate/route.ts` — usa ActionPlannerAgent si hay API key + financialProfile; fallback determinista
- `app/api/generar-carta/route.ts` — usa LetterGeneratorAgent si hay API key; fallback con carta base

### Notes
- Build limpio: 10 rutas compiladas sin errores
- Fallback garantizado en los 3 endpoints — nunca se rompe sin API key

---

## [0.4.0] — 2026-05-06

### Added
- `mcp-server/financial_mirror_mcp.py` — servidor MCP completo con 6 tools:
  - `fetch_macro_indicators` — UF, IPC, TPM desde mindicador.cl (async httpx)
  - `parse_cartola` — stub MVP con transacciones reales para Paula (3 meses) y Luis
  - `build_financial_profile` — cálculo determinista de FinancialProfile desde transacciones + macro
  - `extract_signals` — 8 señales canónicas con reglas de umbral
  - `generate_lenses` — lentes Banco / Fintech / Estado con impactos por señal
  - `simulate_change` — what-if para `reducir_uso_cupo`, `reducir_avances`, `formalizar_ingresos`
- Resource `macro-indicator://{tipo}` — descripción de UF/IPC/TPM
- Prompt `explain_indicator` — plantilla lenguaje ciudadano
- `mcp-server/requirements.txt` — `fastmcp>=0.4.0`, `httpx>=0.27.0`

### Notes
- Sintaxis verificada (`ast.parse`)
- Import verificado con dependencias instaladas (`fastmcp`, `httpx`)
- Transporte: stdio (compatible con Claude Desktop y agentes locales)

---

## [0.3.0] — 2026-05-06

### Added
- 6 slash commands de Claude Code instalados en `.claude/commands/`:
  - `/espejo-frontend-builder`
  - `/espejo-dal-and-domain-builder`
  - `/espejo-api-routes-builder`
  - `/espejo-mcp-tools-builder`
  - `/espejo-agents-designer`
  - `/espejo-copy-and-narrative-writer`

---

## [0.2.0] — 2026-05-06

### Added
- Scaffold completo Next.js 14 App Router + TypeScript + Tailwind CSS
- `types/profile.ts` — interfaz `FinancialProfile` (contrato de dominio interno)
- `types/espejo.ts` — interfaz `EspejoResponse` y subtipos (contrato frontend)
- `lib/data-adapter.ts` — DAL mock: `getFinancialProfileFromMock('paula' | 'luis')`
- `lib/espejo-builder.ts` — transformación determinista `FinancialProfile → EspejoResponse` (sin IA)
- `app/api/analyze/route.ts` — `POST /api/analyze` modo demo funcional
- `app/api/simulate/route.ts` — `POST /api/simulate` stub determinista
- `app/api/generar-carta/route.ts` — `POST /api/generar-carta` stub con carta base
- 8 componentes en `components/espejo/`: `ProfileSummaryCard`, `SignalsGrid`, `InstitutionLensesTabs`, `SimulationPanel`, `CartolaUpload`, `PasaporteButton`, `CartaModal`, `PrivacyBadge`
- `app/analizador/page.tsx` — página core funcional end-to-end con demo Paula
- `app/layout.tsx` + `app/page.tsx` — layout global con header, footer y disclaimer
- Páginas stub: `/dashboard`, `/educacion`, `/historial`, `/comunidad`
- `data/` — fixtures demo Paula y Luis (FinancialProfile + EspejoResponse)
- `.gitignore`, `.eslintrc.json`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`

### Notes
- Build limpio: 10 rutas compiladas sin errores
- Modo demo funciona sin `ANTHROPIC_API_KEY` ni MCP server

---

## [0.1.0] — 2026-05-06

### Added
- `CLAUDE.md` — contexto, reglas de arquitectura y contratos para Claude Code
- `Docs-Final/` — documentación completa del proyecto (15 archivos):
  - Visión y hackathon, producto, arquitectura, contrato de datos
  - MCP server, agentes Claude, frontend Next.js, privacidad
  - Plan 48h, roles, demo/pitch, rúbrica, easy wins, skills
  - Prompts por rol (Milton, Alejandra, Adolfo, Renzo)
  - Fixtures demo (Paula y Luis)
  - Skills para Claude Code (6 archivos)
- `README.md` inicial

---

[Unreleased]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Miltondz/Espejo-de-Datos/releases/tag/v0.1.0
