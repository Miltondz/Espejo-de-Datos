# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Versiones siguiendo [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

- MCP server Python con 6 tools (parse_cartola, fetch_macro_indicators, build_financial_profile, extract_signals, generate_lenses, simulate_change)
- MirrorBuilderAgent conectado a `/api/analyze`
- ActionPlannerAgent conectado a `/api/simulate`
- LetterGeneratorAgent conectado a `/api/generar-carta`
- Pasaporte imprimible con `@media print`
- Frontend polish (Alejandra) — diseño visual y UX

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
