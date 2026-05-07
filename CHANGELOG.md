# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Versiones siguiendo [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

- Video demo 3–5 min (deadline 7 mayo 17:00)
- Plan 30/60/90 días (Adolfo)

---

## [1.3.0] — 2026-05-07

### Added
- **`components/espejo/MacroStrip.tsx`** — strip de indicadores macro en vivo (UF, TPM, TMC, USD) mostrado en `/analizador` antes del upload; fetch desde `/api/macro` al montar; atribución `mindicador.cl · Banco Central`
- **`components/espejo/ChatEspejoTeaser.tsx`** — preview "coming soon v2.5" de Chat con tu Espejo: burbujas de chat (usuario + 🪞 espejo) con `blur-sm` + overlay; enlace a `/proximas-funciones`
- **`components/espejo/OpenFinanceTeaser.tsx`** — preview "coming soon v3.0" de Open Finance: grid de 6 bancos chilenos con chip de color, botón "Conectar" falso; referencia a Ley 21.658; enlace a `/proximas-funciones`
- **`app/proximas-funciones/page.tsx`** — nueva página con hero oscuro, timeline de versiones (v1.0 lanzado → v2.0 en diseño → v2.5 conceptual → v3.0 visión) con dot + línea vertical entre versiones, 4 principios y CTA institucional
- **`types/espejo.ts`** — interfaz `EspejoResponseMeta { cacheHit: boolean; cacheReadTokens: number; usedThinking: boolean }` + campo `_meta?: EspejoResponseMeta` en `EspejoResponse`
- **Extended Thinking en MirrorBuilderAgent** — beta header `interleaved-thinking-2025-05-14`; `budget_tokens: 5000`; `max_tokens` sube a 16 000 cuando activo; acumula `totalCacheReadTokens` y publica `_meta` en `EspejoResponse`
- **`enableThinking` en CartolaUpload** — toggle 🧠 con borde morado cuando activo; se pasa en JSON body (demo) y FormData (upload); controla Extended Thinking end-to-end
- **NavLinks `soon` flag** — campo `soon: boolean` en todos los links; rutas `/historial`, `/comunidad`, `/proximas-funciones` marcadas `soon: true`; badge ámbar "Pronto" de 9 px visible en rutas no activas

### Changed
- **`lib/agents/actionPlannerAgent.ts`** — condición de activación cambia de `&& body.financialProfile` a `&& (body.signals?.length ?? 0) > 0`; `financialProfile` ahora es opcional en `ActionPlannerInput`; system prompt con rama "sin perfil": razona directo desde `signals[]` sin llamar `simulate_change`
- **`app/analizador/page.tsx`** — añade `MacroStrip` bajo el header; badges `_meta` (⚡ ámbar para cache hit, 🧠 morado para thinking) cuando `data._meta` presente; sección "Próximas funciones" siempre visible al pie (cuando `!loading`): `ChatEspejoTeaser` + `OpenFinanceTeaser`
- **`app/educacion/page.tsx`** — botones de navegación rápida (Glosario / Leyes / Recursos) con anchor links y `scroll-mt-20`; glosario rediseñado con `accent` color por término, `icon`, `tag` pill, ejemplo en bloque blanco/70; cada sección con `id` para anchor
- **`app/nosotros/page.tsx`** — rediseño completo: hero gradient oscuro con stats strip (4 disciplinas · 48h · 3 agentes IA · 8M+); 4 cards de valores; TeamCard con franja de color de 24 px, foto circular `rounded-full ring-4 ring-white` superpuesta con `absolute -bottom-10`, `pt-12` en body; grid 2→4 columnas
- **`app/historial/page.tsx`** — rediseño como pantalla "coming soon v2.0": gráfica de barras CSS `blur-sm` (4 meses, barras de colores) + comparativa de señales antes/después; overlay "Disponible en v2.0"; callout de privacidad; 4 cards de funciones pendientes
- **`app/comunidad/page.tsx`** — rediseño con mockup de vista de facilitador `blur-sm` (barras de participantes, métricas del grupo) + overlay "Modo Taller v2.0"; 2 feature cards: Modo Taller B2G + Comparativa anónima; sección "¿Por qué B2G?"
- **`app/layout.tsx`** — `scroll-smooth` en `<html>`; link "Roadmap" → `/proximas-funciones` en footer; link "Transparencia técnica" → `/debug` en footer
- **`components/NavLinks.tsx`** — 3 rutas nuevas (historial, comunidad, proximas-funciones) con `soon: true`; estilo gris `text-gray-400` para rutas pronto; badge "Pronto" ámbar oculto en ruta activa

### Chore
- `.gitignore` — agrega `social/`
- **`social/`** (gitignored) — plantillas de publicaciones para LinkedIn (3 variantes: técnico, ciudadano, corto) e Instagram (3 posts + Stories con sugerencias de imagen y hashtags)

---

## [1.2.0] — 2026-05-07

### Added
- **`app/nosotros/page.tsx`** — página del equipo Dunatech con hero, misión y 4 cards con foto pixel art, badge de rol por color y link directo a LinkedIn (Alejandra, Milton, Adolfo, Renzo)
- **`public/img/`** — fotos pixel art del equipo servidas estáticamente (adolfo.jpg, alejandra.jpg, milton.jpg, renzo.jpg)
- **`entregable/ficha-proyecto.md`** — documento estructurado que responde campo a campo el bloque "Problema y ciudadano" del rubric: problema ≤300 chars, segmento etario + NSE + ubicación, canal de adopción + justificación, impacto cuantificado + 6 URLs oficiales (leychile.cl, cmf.cl, sernac.cl)
- **Landing — sección "¿A quién ayuda y cómo llega?"** — 3 cards: segmento (25–65 años, C2-D, RM/Valparaíso/Biobío), canal (WhatsApp + browser sin descarga), impacto (>8M personas con deuda vigente, fuente cmf.cl/estadisticas/)
- **Landing — bloque "El problema"** — descripción de 175 chars sin jerga técnica, visible en demo y parseable por Bendi

### Changed
- `components/NavLinks.tsx` — agrega "Equipo" → `/nosotros`
- `app/layout.tsx` footer — agrega link "Equipo"

### Fixed
- **`/api/analyze` handleUpload** — el catch ahora detecta el mensaje de la API y devuelve error útil cuando el problema es saldo insuficiente ("Sin saldo en la API de IA") en lugar de culpar al PDF con "texto seleccionable"

### Chore
- `.gitignore` — agrega `data-sintetica/`, `Docs-Final/series.csv` y `Docs-Final/Banco central*`

---

## [1.1.0] — 2026-05-06

### Added
- **Landing — sección "Tu privacidad, por diseño"** — agrupa los 14 compliance badges en 4 cards temáticas con descripción visible (sin hover): Privacidad absoluta (sin persistencia, sin cesión, anónimo, datos mínimos) · Marco legal chileno (Leyes 21.719, 19.628, 21.658, 20.575) · Diseño ético (Privacy by Design, IA explicable, CMF Educa) · Seguridad técnica (sin tracking, OWASP Top 10, TLS 1.3)
- **Landing — trust strip en el hero** — 3 señales de privacidad debajo de los botones CTA: "Cartola descartada al terminar · Sin cuenta ni RUT · Ley 21.719 · Ley 21.658"
- **Landing — grilla Anthropic tech** — 6 cards con función real de cada tecnología (Files API, Agent SDK, Extended Thinking, Prompt Caching, MCP Server, Citations)
- **`CartolaUpload`** — reemplaza radio "segmento" por 4 checkboxes opcionales de contexto: `independiente`, `jubilado`, `dependiente`, `multiple_bancos`; el segmento se deriva de los hints y se pasan como `contextHints` al API
- **`MirrorBuilderInput`** — campo `contextHints?: string[]`; system prompt ampliado con instrucciones para enriquecer el análisis según hints sin sobreescribir la cartola
- **`/api/analyze` handleUpload** — lee `contextHints` del FormData y lo pasa al agente

### Changed
- **`app/globals.css`** — bloque `@media print` completo: `break-inside: avoid` en cards, `overflow: visible` en `.rounded-2xl` (fix clip en print), fuerza impresión de gradientes con `-webkit-print-color-adjust: exact`, margen entre secciones
- **Disclaimer** — integrado al pie de la sección de privacidad como nota de texto; elimina el banner amarillo huérfano
- `.gitignore` — agrega `data-sintetica/`, `Docs-Final/series.csv` y `Docs-Final/Banco central*` (archivos de prueba locales)

---

## [1.0.0] — 2026-05-06

### Added
- `components/NavLinks.tsx` — componente cliente con `usePathname` para resaltar ruta activa en el header
- `app/comunidad/page.tsx` — rediseño completo: preview de funciones futuras con cards semi-transparentes
- `app/historial/page.tsx` — rediseño completo: explicación privacidad-primero + lista de funciones pendientes

### Changed
- **Landing (`app/page.tsx`)** — rediseño completo: hero gradient oscuro (`slate-900 → blue-700`), feature cards (3 pilares), how-it-works numerado con badges de indicadores macro, persona cards Paula/Luis, tech badges Anthropic, disclaimer banner, CTA final gradient
- **Layout (`app/layout.tsx`)** — header sticky con logo `🪞 Espejo de Datos`, NavLinks activo, footer enriquecido con links externos (SERNAC, CMF Educa)
- **Analizador (`app/analizador/page.tsx`)** — header con subtítulo, spinner animado durante carga con copy explicativo, error state con ícono
- **ProfileSummaryCard** — header gradient azul, barra de progreso ingresos/egresos con color dinámico, badges `Con sobregiros` / `Avances de efectivo`, stats con color semántico
- **SignalsGrid** — señales ordenadas por importancia (3→2→1) con separadores de sección, badge `ALTA` rojo, botón "Generar carta →" como pill en señales legales
- **InstitutionLensesTabs** — colores por institución (banco=azul, fintech=morado, estado=esmeralda), headline en tarjeta coloreada, señales en fondo slate
- **SimulationPanel** — header gradient índigo/azul, spinner en botón, badges pill para señales que mejoran
- **CartaModal** — header sticky con X, backdrop blur, panel "Opciones IA" enmarcado, spinner en generación, botón copiar con estado visual
- **CartolaUpload** — banner privacidad verde, botones demo con avatar emoji, divider entre demo y upload, dropzone con feedback visual
- **PasaporteButton** — tarjeta con ícono 📄 y botón gradient
- **PrivacyBadge** — color esmeralda, texto simplificado
- **Dashboard** — cards con label uppercase, box explicativo TMC, links a fuentes
- **Educación** — cards de leyes con color por ley, grid 2 columnas para recursos, CTA hacia Espejo
- `README.md` — tabla de herramientas Anthropic usadas, placeholders video/deploy, roadmap Día 2 actualizado a ✅

---

## [0.9.0] — 2026-05-06

### Added
- `data/leyes-referencias.ts` — extractos de 4 leyes chilenas (Ley 18.010, 19.496, 21.236, 21.719) para Citations; función `getLeyParaProblema(tipoProblema)`
- `types/debug.ts` — tipos `ToolCallTrace` y `AgentTraceResponse` extraídos del route para evitar hydration bug
- `entregable/` — 4 archivos de texto con system prompts de los 3 agentes y schema de tools MCP para entrega al jurado

### Changed
- **Prompt Caching** — `cache_control: { type: 'ephemeral' }` en system prompt array de los 3 agentes (`mirrorBuilderAgent`, `actionPlannerAgent`, `letterGeneratorAgent`)
- **LetterGeneratorAgent** — soporte para Extended Thinking (`interleaved-thinking-2025-05-14` beta header, `thinking: enabled`, `budget_tokens: 2048`, modelo sube a `claude-sonnet-4-6`); soporte para Citations (document block con `media_type: text/plain`, `citations: { enabled: true }` sin beta header extra); campo `modoUsado` en respuesta
- **`/api/generar-carta/route.ts`** — acepta `enableThinking` y `enableCitations` en el body; llama a `getLeyParaProblema` cuando citations habilitado
- **CartaModal** — checkboxes `enableThinking` / `enableCitations`, muestra `modoUsado` badge
- **`/api/debug/trace/route.ts`** — `export const dynamic = 'force-dynamic'`; system prompt con `cache_control`; tipos importados desde `@/types/debug`
- **`app/debug/page.tsx`** — importa tipos desde `@/types/debug` (fix hydration — no importar desde server route)

### Fixed
- Hydration bug en `/debug`: importar tipos de `@/app/api/debug/trace/route` en componente `'use client'` causaba fallo silencioso del botón. Resuelto moviendo tipos a `types/debug.ts`
- ESLint unescaped entities en debug page (`"` → `&quot;`)
- Webpack cache corruption después de cambios de tipos (`.next` limpiado)
- `citations-2025-04-11` beta header eliminado (API lo rechazaba — citations no necesita beta header)
- `media_type: 'text/plain'` añadido al document source (era requerido y faltaba)

---

## [0.8.5] — 2026-05-06

### Added
- `app/api/analyze/route.ts` — `handleUpload()`: recibe FormData, sube PDF a Files API, corre MirrorBuilderAgent con `fileId`, elimina archivo en bloque `finally` (privacidad garantizada)
- `lib/agents/mirrorBuilderAgent.ts` — campo `fileId?` en `MirrorBuilderInput`; cuando presente adjunta PDF como document block con beta header `files-api-2025-04-14`; system prompt ampliado con reglas de parsing PDF: fechas DD/MM/YYYY→YYYY-MM-DD, números chilenos (65.000→65000), columnas Cargos/Abonos separadas vs Monto firmado
- `lib/agents/toolImplementations.ts` — `parseCartola` acepta parámetros opcionales `transacciones[]`, `periodoMeses`, `institucionesDetectadas`; si se pasan, los usa directamente (modo PDF real); MIRROR_TOOLS schema actualizado con campos opcionales y descripciones detalladas
- `CartolaUpload.tsx` — dropzone drag-and-drop real con `<input type="file">`, selector de segmento (radio), envía FormData a `/api/analyze`; validación cliente (solo PDF, máx 5 MB)
- `data-sintetica/` — 2 cartolas PDF sintéticas para pruebas: `Riesgo_Falabella_4meses.pdf` (ciclo deuda con avances) y `Riesgo_BancoEstado_4meses.pdf` (déficit mensual con sobregiros)

### Changed
- `app/api/analyze/route.ts` — dividido en `handleDemo()` (JSON, modo original) y `handleUpload()` (FormData + Files API); `export const dynamic = 'force-dynamic'`
- `SignalsGrid` — recibe y pasa prop `segmento` a `CartaModal`
- `CartaModal` — recibe `segmento` como prop (ya no hardcodeado a `'emprendedora'`)
- `AnalizadorPage` — pasa `data.profileSummary.segmento` a `SignalsGrid`

### Fixed
- `demoId` cast a `'paula' | 'luis'` en fallback de `handleDemo` (error TypeScript)

### Tested
- PDF Falabella: detecta 85% uso cupo, 4 avances efectivo, tasa estimada ~46% (≥ TMC 45%)
- PDF BancoEstado: detecta 4 meses saldo negativo, sobregiros, pagos de juegos online

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

[Unreleased]: https://github.com/Miltondz/Espejo-de-Datos/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.8.5...v0.9.0
[0.8.5]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.8.0...v0.8.5
[0.8.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.5.0...v0.8.0
[0.5.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Miltondz/Espejo-de-Datos/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Miltondz/Espejo-de-Datos/releases/tag/v0.1.0
