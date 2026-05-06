# Espejo de Datos — Documentación Canónica (Docs-Final)

> Versión única, congruente y optimizada para alimentar agentes de Claude Code.
> Cada decisión de stack, alcance y diseño es **autoritativa**: si un documento
> antiguo (carpeta `Docs/`) contradice algo de aquí, manda esta carpeta.

---

## Para qué sirve esta carpeta

1. Dar a **Claude Code** (y a otros agentes) un cuerpo de docs autocontenido para
   construir Espejo de Datos en la ventana del Claude Impact Lab Chile 2026
   (6–7 mayo 2026, UTC-4).
2. Servir de **fuente de verdad** del proyecto: stack, arquitectura, contratos
   de datos, prompts de agentes, plan de trabajo y entregables.
3. Resolver las **inconsistencias** que existían entre los documentos previos
   (lenguaje del MCP, naming de tipos, alcance, ventana de construcción, etc.).

---

## Cómo está organizada

| Tipo | Archivo | Audiencia | Propósito |
|---|---|---|---|
| Ejecutivo | [01-vision-y-hackathon.md](01-vision-y-hackathon.md) | Equipo + Claude | Qué construimos + bases del Lab + gates críticos |
| Ejecutivo | [02-producto-y-segmento.md](02-producto-y-segmento.md) | Equipo + Claude | Persona (Paula), propuesta de valor, canal B2G |
| Técnico | [03-arquitectura.md](03-arquitectura.md) | Claude (back) | Stack canónico: Next 14 + DAL + MCP Python + 2 agentes |
| Técnico | [04-contrato-de-datos.md](04-contrato-de-datos.md) | Claude (todos) | `FinancialProfile` + `EspejoResponse` (camelCase, único) |
| Técnico | [05-mcp-financial-mirror.md](05-mcp-financial-mirror.md) | Claude (back) | Servidor MCP Python con FastMCP — tools, resources, prompts |
| Técnico | [06-agentes-claude.md](06-agentes-claude.md) | Claude (back) | `MirrorBuilderAgent` + `ActionPlannerAgent` — system prompts |
| Técnico | [07-frontend-next.md](07-frontend-next.md) | Claude (front) | Rutas, componentes, integración API, easy wins UI |
| Técnico | [08-privacidad-y-datos.md](08-privacidad-y-datos.md) | Claude (todos) | Principios de privacidad por diseño y reglas duras |
| Ejecutivo | [09-plan-48h.md](09-plan-48h.md) | Equipo + Claude | Cronograma 6–7 mayo respetando la ventana válida |
| Ejecutivo | [10-roles-y-responsabilidades.md](10-roles-y-responsabilidades.md) | Equipo | Milton / Ale / Adolfo / Renzo — qué hace cada uno |
| Ejecutivo | [11-demo-y-pitch.md](11-demo-y-pitch.md) | Equipo | Pitch 3 min + Q&A + video 3–5 min + contingencias |
| Ejecutivo | [12-entregables-rubrica.md](12-entregables-rubrica.md) | Equipo + Claude | Ficha cívica, entregable técnico, cómo subir a 5/5 |
| Técnico | [13-easy-wins.md](13-easy-wins.md) | Claude (todos) | Pasaporte, What-If, Carta — implementación detallada |
| Técnico | [14-claude-code-skills.md](14-claude-code-skills.md) | Equipo + Claude | 6 skills conceptuales para estructurar peticiones |
| Prompts | [15-prompts-equipo/milton-backend.md](15-prompts-equipo/milton-backend.md) | Milton | Prompts para backend / MCP / agentes |
| Prompts | [15-prompts-equipo/alejandra-frontend.md](15-prompts-equipo/alejandra-frontend.md) | Alejandra | Prompts para frontend Next |
| Prompts | [15-prompts-equipo/adolfo-negocio.md](15-prompts-equipo/adolfo-negocio.md) | Adolfo | Prompts para casos de uso y narrativa |
| Prompts | [15-prompts-equipo/renzo-legal.md](15-prompts-equipo/renzo-legal.md) | Renzo | Prompts para disclaimers y carta de reclamo |
| Datos | [16-fixtures/demo-financial-profile-paula.json](16-fixtures/demo-financial-profile-paula.json) | Claude / repo | Fixture canónico Paula (input dominio) |
| Datos | [16-fixtures/demo-espejo-paula.json](16-fixtures/demo-espejo-paula.json) | Claude / repo | Fixture canónico Paula (output frontend) |
| Datos | [16-fixtures/demo-financial-profile-luis.json](16-fixtures/demo-financial-profile-luis.json) | Claude / repo | Fixture backup Luis |
| Datos | [16-fixtures/demo-espejo-luis.json](16-fixtures/demo-espejo-luis.json) | Claude / repo | Fixture backup Luis |
| Raíz | [CLAUDE.md](CLAUDE.md) | Claude Code | Reglas duras del repo (a copiar a la raíz del proyecto) |
| Skills | [skills-para-proyecto/](skills-para-proyecto/) | Milton (setup) | 6 skills formales de Claude Code — copiar a `.claude/skills/` al crear el repo |

---

## Orden de lectura recomendado

### Para alguien nuevo en el equipo (humano)
1. `01-vision-y-hackathon.md` — qué construimos y en qué reglas jugamos.
2. `02-producto-y-segmento.md` — para quién y por qué.
3. `10-roles-y-responsabilidades.md` — qué hace cada quien.
4. `09-plan-48h.md` — cronograma del Lab.
5. `11-demo-y-pitch.md` — el día D.

### Para Claude Code construyendo el repo
1. `CLAUDE.md` — reglas duras.
2. `03-arquitectura.md` — qué se construye.
3. `04-contrato-de-datos.md` — tipos.
4. `05-mcp-financial-mirror.md` o `06-agentes-claude.md` o `07-frontend-next.md` — según el área.
5. `13-easy-wins.md` cuando toque pulir.

### Setup de skills al crear el repo (Milton — paso 0)

Copiar los skills formales de Claude Code al proyecto recién creado:

```bash
cp -r Docs-Final/skills-para-proyecto/ <ruta-repo>/.claude/skills/
```

Después se invocan en cualquier sesión con `/espejo-frontend-builder`, `/espejo-dal-and-domain-builder`, etc.

---

## Decisiones canónicas (resumen rápido)

| Decisión | Valor canónico |
|---|---|
| Línea del Lab | **01 — Inclusión Financiera** |
| Categoría | **AI Builder** |
| Frontend / Backend HTTP | **Next.js 14 App Router + TypeScript + Tailwind CSS** |
| Modelo Claude default | **`claude-sonnet-4-6`** |
| MCP server | **Python con FastMCP**, llamado **`financial-mirror-mcp`** |
| Persistencia en MVP | **Sin DB**. Procesamiento en memoria, descarte inmediato |
| Naming de tipos | **camelCase** (`fuenteDatos`, no `fuente_datos`) |
| Rutas core | `/`, `/analizador` |
| Rutas secundarias (mínimas) | `/dashboard`, `/educacion`, `/historial`, `/comunidad` |
| Agentes obligatorios | `MirrorBuilderAgent` + `ActionPlannerAgent` |
| Tercer agente (mini) | `LetterGeneratorAgent` (llamada simple, sin MCP) |
| Fuentes de datos en MVP | Cartola (parser) + `mindicador.cl` (UF, IPC, TPM) |
| Demo principal | Paula (emprendedora). Backup: Luis |
| Canal de adopción | B2G primario (CMF Educa, SERNAC, municipios) |
| Pitch | **3 min + 2 min Q&A** (no hay "demo en escenario" larga) |
| Video entregable | **3–5 min** grabado |
| **Ventana válida** | **6 mayo 00:00 → 7 mayo 23:59 (UTC-4)** — fuera de eso, score técnico = 0 |

---

## Qué cambió respecto a `Docs/` (la carpeta vieja)

- Se unificó el lenguaje del MCP a **Python** (había contradicción TS vs Python).
- Se unificó el naming a **camelCase** (había snake_case en arquitectura-tecnica).
- Se eliminó Supabase del MVP (privacy by design + simplicidad de 48h).
- Se ajustó el pitch a **3 minutos** (los docs viejos tenían un guion de 7–10 min, inválido).
- Se documentó **claramente** el gate de la ventana de construcción (los docs viejos
  asumían setup pre-Lab, lo cual descalifica al equipo).
- Se consolidaron los fixtures JSON en un solo lugar (`16-fixtures/`).
