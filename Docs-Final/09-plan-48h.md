# 09 — Plan de las 48h del Lab (6–7 mayo 2026)

> Cronograma respetando la **ventana de construcción válida**:
> 6 mayo 00:00 → 7 mayo 23:59 hora Chile (UTC-4).
> Cualquier commit fuera de esa ventana implica score técnico = 0.

---

## 0. Antes del 6 mayo (5 mayo y previos) — sin código

✅ Permitido:
- Lectura de docs y APIs (mindicador.cl, FastMCP, @anthropic-ai/sdk).
- Diseño en papel, Figma o Markdown.
- Ensayos de pitch.
- Decisiones de stack y copy (en `Docs-Final/`).
- Reuniones de equipo, división de roles.

❌ **Prohibido**:
- `npx create-next-app`
- `git init` para el repo del proyecto
- Crear archivos `.ts` o `.py` del MVP
- Instalar dependencias (`pip install`, `npm install`)
- Cualquier commit que el jurado pueda ver fuera de ventana.

> El equipo se reúne el **5 mayo** para alinear con esta carpeta `Docs-Final/`
> y confirmar que todos entienden los gates.

---

## 1. Día 1 — miércoles 6 mayo

### 11:00 — Apertura del Lab (Espacio Riesco)

- Bienvenida + apertura oficial.
- Mesa público-privada con reguladores.

### 12:30 — Kickoff de construcción (¡aquí empieza la ventana!)

**Stand-up de 10 minutos:** todos confirman que tienen acceso a:
- WiFi, créditos Claude, ANTHROPIC_API_KEY del Lab.
- Repo Git compartido (GitHub, recién creado a las 12:30).
- `Docs-Final/` como referencia.

### 13:00 → 16:00 — Bloque 1: setup + esqueleto

**Milton (backend / MCP / agentes):**
1. `npx create-next-app@latest espejo-de-datos --ts --eslint --tailwind --app`.
2. Copiar `Docs-Final/CLAUDE.md` a la raíz del proyecto.
3. Crear `types/profile.ts` y `types/espejo.ts` desde `04-contrato-de-datos.md`.
4. Copiar fixtures de `Docs-Final/16-fixtures/` a `data/`.
5. Crear `lib/data-adapter.ts` con `getFinancialProfileFromMock`.
6. Crear `lib/espejo-builder.ts` con `buildEspejoFromProfile`.
7. Crear `app/api/analyze/route.ts` modo demo (sin IA aún).
8. Setup MCP en `mcp-server/`:
   - `python -m venv .venv && pip install fastmcp httpx`.
   - Copiar `financial_mirror_mcp.py` desde `Docs-Final/05-mcp-financial-mirror.md`.
   - Probar `fetch_macro_indicators` desde Claude Code/MCP Inspector.

**Alejandra (frontend / UX / líder):**
1. Crear tablero Trello/Notion con columnas Backlog / En curso / Listo.
2. Crear `app/layout.tsx` con header, footer, disclaimer.
3. Crear `app/page.tsx` (landing) con CTA "Ver mi Espejo".
4. Crear `app/analizador/page.tsx` que importa el JSON demo (mock estático
   inicialmente, antes de tener `/api/analyze`).
5. Crear componentes vacíos: `ProfileSummaryCard`, `SignalsGrid`,
   `InstitutionLensesTabs`, `SimulationPanel`, `CartolaUpload`,
   `PasaporteButton`, `CartaModal`, `PrivacyBadge`.
6. Crear `app/dashboard/page.tsx`, `/educacion`, `/historial`, `/comunidad`
   con contenido mínimo.

**Adolfo (negocio):**
1. Redactar `casos-uso-espejo.md` con 2–3 escenarios B2G.
2. Redactar `roadmap-adopcion.md` con plan 30/60/90 días post-Lab.
3. Preparar 5–7 frases pitch de negocio.
4. Apoyar a Alejandra revisando el copy de la landing.

**Renzo (legal):**
1. Definir disclaimers de UI a partir de `08-privacidad-y-datos.md`.
2. Validar que el aviso de privacidad esté visible en `/analizador`.
3. Esquema de las 1–2 plantillas de carta (input para
   `LetterGeneratorAgent`).
4. Prepararse para la **Ficha Cívica** (mañana 10:00) — borrador.

### 16:00 → 19:00 — Bloque 2: integración mock + MCP

**Milton:**
1. Hacer que `/api/analyze` modo demo llame al DAL determinista y devuelva
   `EspejoResponse` real (ya con todos los campos).
2. Implementar todas las tools del MCP (`build_financial_profile`,
   `extract_signals`, `generate_lenses`, `simulate_change`).
3. Probar cada tool desde Claude Code.

**Alejandra:**
1. Conectar `/analizador` a `/api/analyze` con `fetch`.
2. Manejo de loading / error.
3. Implementar `CartolaUpload` con botones "demo Paula" y "demo Luis".
4. Pulir `ProfileSummaryCard`, `SignalsGrid`, `InstitutionLensesTabs`.

**Adolfo + Renzo:**
1. Borrador de la **Ficha Cívica** (qué problema, segmento, propuesta de valor,
   canal, datos usados). Detalle en `12-entregables-rubrica.md`.
2. Revisar todos los textos visibles en la app.

### 19:00 → 21:00 — Bloque 3: agentes (`MirrorBuilderAgent`)

**Milton:**
1. Crear `lib/agents/mirrorBuilderAgent.ts`.
2. Pegar `MIRROR_BUILDER_SYSTEM_PROMPT` desde `06-agentes-claude.md`.
3. Implementar `callMirrorBuilderAgent` con cliente Anthropic + MCP tools.
4. Conectarlo a `/api/analyze` modo cartola (multipart).
5. **Mantener fallback determinista** si el agente falla.

**Alejandra:**
1. Si Milton ya tiene `/api/analyze` con agente, probar con cartola real.
2. Agregar mensaje en UI "modo IA" vs "modo demo".
3. Empezar `SimulationPanel` (slider + botón "Ver impacto").

### 21:00 — Cierre día 1

**Stand-up final:**
- Estado del MVP: ¿corre demo Paula end-to-end? ✅ es el mínimo aceptable.
- Bloqueos detectados.
- Plan ajustado para día 2.

**Checkpoint A (lo mínimo):**
- ✅ `/analizador` funciona con `/api/analyze` modo demo.
- ✅ MCP server probado en aislamiento.
- ✅ Borrador de Ficha Cívica.

---

## 2. Día 2 — jueves 7 mayo

### 09:00 — Check-in

Stand-up: estado real, cuánto falta para el MVP completo.

### 09:30 → 10:00 — Mentoría de refinamiento + cierre Ficha Cívica

**🚨 10:00 — Deadline Ficha Cívica.**

Adolfo + Renzo finalizan y suben la ficha al portal.

### 10:00 → 12:30 — Bloque 4: ActionPlannerAgent + simulación

**Milton:**
1. Crear `lib/agents/actionPlannerAgent.ts` con
   `ACTION_PLANNER_SYSTEM_PROMPT`.
2. Implementar `callActionPlannerAgent` + MCP `simulate_change`.
3. Crear `app/api/simulate/route.ts`.

**Alejandra:**
1. Conectar `SimulationPanel` a `/api/simulate`.
2. Render de `simulationSuggestion` con destacado visual.
3. Empezar `@media print` en `globals.css` para Pasaporte.

**Adolfo:**
1. Practicar pitch de 30–45s ("cómo se implementa esto en una organización
   real").
2. Q&A esperable: "¿quién paga?", "¿escala a 1M usuarios?", "¿modelo de
   ingresos en producción?".

**Renzo:**
1. Validar copy de `SimulationPanel` (que no prometa "el banco te aprobará").
2. Practicar pitch de 30–45s sobre privacidad y legitimidad regulatoria.

### 12:30 → 14:30 — Bloque 5: Easy wins + carta

**Milton:**
1. Crear `lib/agents/letterGeneratorAgent.ts`.
2. Crear `app/api/generar-carta/route.ts`.
3. Probar con un input "tasa_cercana_tmc" y validar el output.

**Alejandra:**
1. Terminar `@media print` (Pasaporte).
2. Implementar `CartaModal` con botón "Generar borrador".
3. Pulir rutas "próximamente".
4. QA manual completo: flujo demo Paula, simulación, pasaporte, carta.

**Adolfo + Renzo:**
1. Grabar el video de 3–5 minutos (en simultáneo con el pulido — desktop
   recording de la app más voice-over).

### 14:30 → 16:00 — Bloque 6: pulido + entregables

**Todos:**
1. Capturar **screenshot de consola Claude** mostrando una invocación de
   agente con tool calls (esto es entregable obligatorio).
2. Exportar el `MIRROR_BUILDER_SYSTEM_PROMPT` como archivo de texto limpio
   para entregar.
3. Push final del repo (commit dentro de la ventana).
4. Subir entregable técnico al portal.

### 🚨 17:00 — Deadline entregable técnico + preselección Top 6

Una vez subido, esperar resultados de preselección.

### 17:00 → fin tarde — Pitches finales

Si quedamos en Top 6:
- Pitch en vivo: 3 min + 2 min Q&A.
- Roles en escena (ver `11-demo-y-pitch.md`).
- Ensayo final 15 minutos antes.

### Cierre — premiación + networking

23:59 — cierra ventana de construcción.

---

## 3. Reglas de oro durante el Lab

1. **No hagas todo en serie.** Backend/MCP y frontend trabajan en paralelo
   contra el mismo contrato (`EspejoResponse`).
2. **Si algo se rompe, fallback determinista.** Nunca dejes un endpoint
   reventando — siempre hay una ruta sin IA que funciona.
3. **Si el tiempo aprieta, corta features.** Prioridad fija:
   1. Demo Paula end-to-end (`/api/analyze` modo demo).
   2. `MirrorBuilderAgent` real con cartola de prueba.
   3. `ActionPlannerAgent` + simulación.
   4. Pasaporte imprimible.
   5. `LetterGeneratorAgent` + carta.
   6. Rutas "próximamente" pulidas.
4. **Stand-ups cada 3–4 horas** (5 min): qué hicimos / qué hacemos / qué bloquea.
5. **Backup video grabado** del flujo completo, por si la app falla en pitch.

## 4. Si quedan tiempos muertos (cómo aportar)

- **Milton libre:** ajustar prompts según logs reales, mejorar reglas en
  `extract_signals`, escribir 2–3 frases técnicas para el jurado.
- **Alejandra libre:** QA en distintos navegadores, ajustar copy ciudadano,
  README corto del repo.
- **Adolfo libre:** practicar pitch frente al espejo, pulir frases comerciales,
  pensar 1 stakeholder concreto B2G a contactar post-Lab.
- **Renzo libre:** afinar disclaimers, armar Q&A legal con respuestas de 2–3
  frases, prevenir preguntas sobre Ley 21.719.

## 5. Plan de contingencia

| Falla | Mitigación |
|---|---|
| Internet caído en `/api/analyze` | Botón "modo demo offline" usa JSON local |
| Agente devuelve JSON malformado | Fallback al DAL determinista (siempre disponible) |
| MCP server caído | API Routes detectan y usan `lib/espejo-builder.ts` puro |
| App entera no levanta | Video grabado de 2–3 min como respaldo en pendrive |
| Pitch confuso | Ensayo previo 15 min antes; texto en cartulina como cue |
