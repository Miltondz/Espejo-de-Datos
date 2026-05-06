# CLAUDE.md — Espejo de Datos

> Este archivo se copia a la raíz del repositorio del proyecto. Le indica a
> Claude Code el contexto, las reglas y los contratos del sistema. Si entra en
> conflicto con cualquier sugerencia, **mandan estas reglas**.

---

## 1. Qué es Espejo de Datos

App web que toma una **cartola bancaria chilena** (PDF/Excel) y devuelve un
**"espejo financiero ciudadano"**: un resumen visual de cómo distintas
instituciones (Banco, Fintech, Estado/SII) podrían interpretar el perfil del
usuario, con señales explicables y una simulación "qué pasaría si…".

Construido para el **Claude Impact Lab Chile 2026** (6–7 mayo 2026, UTC-4),
**Línea 01 — Inclusión Financiera**, categoría **AI Builder**.

No es scoring crediticio. No es asesoría financiera. Es educación + transparencia.

## 2. Stack canónico (no cambiar sin acuerdo)

- **Frontend / API HTTP:** Next.js 14 App Router + TypeScript + Tailwind CSS
- **IA:** Claude API vía `@anthropic-ai/sdk`, modelo `claude-sonnet-4-6` por default
- **MCP server:** Python con **FastMCP**, llamado `financial-mirror-mcp`
- **Persistencia:** ninguna en el MVP. Todo en memoria. Sin DB
- **Deploy:** Vercel para Next; el MCP corre local (stdio) en la máquina del equipo
- **Naming:** **camelCase** en TypeScript (`fuenteDatos`, no `fuente_datos`)

## 3. Reglas críticas de arquitectura

### 3.1. Privacidad (INNEGOCIABLE)

- La cartola del usuario **NUNCA** se persiste (ni en disco, ni en DB, ni en logs).
- Las transacciones individuales **NUNCA** se guardan.
- Todo el procesamiento de cartola ocurre **en memoria del servidor**.
- Solo se podría guardar el **perfil normalizado agregado** (sin transacciones)
  y solo si el usuario lo solicita explícitamente (post-MVP).

### 3.2. Llamadas a APIs externas

- Todas las llamadas a Claude API y a APIs públicas (mindicador.cl, etc.) se
  hacen desde **API Routes en `app/api/`**, nunca desde el browser.
- Las API keys (`ANTHROPIC_API_KEY`) viven solo en variables de entorno del
  servidor. Nunca en el código ni en el cliente.

### 3.3. Data Adapter Layer (DAL)

- `lib/data-adapter.ts` es la **única** interfaz entre la app y las fuentes de
  datos. La app NUNCA importa directamente de un parser de cartola, fetcher
  macro o lógica MCP.
- El DAL siempre devuelve un **`FinancialProfile`** con la forma definida en
  `types/profile.ts` (ver `04-contrato-de-datos.md`).
- Si mañana llega Open Finance / SFA, solo cambia el interior del DAL.

### 3.4. Contrato de datos

- `types/profile.ts` → `FinancialProfile` (modelo de dominio interno)
- `types/espejo.ts` → `EspejoResponse` (lo que consume el frontend)
- **No cambiar la forma de estos tipos sin coordinación explícita**: detectar
  impacto, proponer cambio, esperar confirmación.

## 4. Capas que deben mantenerse separadas

| Capa | Carpeta | Restricciones |
|---|---|---|
| Dominio puro | `lib/` | Funciones puras, sin fetch, sin disco, sin React/Next |
| MCP server | `mcp-server/` | Python + FastMCP. Tools pequeñas con tipos. **No llama a Claude** |
| API Routes | `app/api/*/route.ts` | Solo glue HTTP. Llaman dominio + agentes + MCP, devuelven JSON |
| Agentes | `lib/agents/` | System prompt + uso de tools MCP + validación del JSON de salida |
| UI | `app/` y `components/` | Solo presentación. Consume `EspejoResponse` |

## 5. Reglas de colaboración con Claude Code

1. **Plan primero, código después.** Cada respuesta empieza con un plan numerado
   (3–6 pasos) antes de tocar archivos.
2. **Contexto acotado.** No abrir todo el repo. Pedir abrir solo los archivos
   relevantes (ej. `app/api/analyze/route.ts`, `lib/espejo-builder.ts`).
3. **Una petición → un objetivo.** No mezclar "UI + backend + pitch" en el
   mismo mensaje. Usar los **6 skills conceptuales** (ver `14-claude-code-skills.md`).
4. **Sin súper-prompts monolíticos** para agentes. Separar:
   diseño de prompt → implementación de llamada → validación de respuesta.
5. **MCP tools pequeñas:** una cosa, input/output tipados, sin lógica de IA dentro.
6. **Errores con degradación controlada:** si el agente o MCP falla, caer a la
   ruta determinista del DAL. Nunca dejar un endpoint reventando sin mensaje.
7. **Lenguaje ciudadano** en todo lo que ve el usuario. No "tu DTI es alto" sino
   "casi todo lo que ganas se va en pagar deudas".

## 6. Reglas de la **ventana de construcción válida**

> El Hackathon penaliza con score técnico = 0 cualquier commit fuera de la
> ventana **6 mayo 00:00 → 7 mayo 23:59 (UTC-4)**.

Antes del 6 mayo 00:00:
- ✅ Lectura de docs y APIs.
- ✅ Diseño en docs / Figma / papel.
- ✅ Ensayos de pitch.
- ❌ `git init`, `npx create-next-app`, archivos de código.
- ❌ Cualquier commit, incluso "preparatorio".

## 7. Lo que el Espejo NO es (importante)

- No es un score crediticio.
- No predice si el banco aprueba o rechaza al usuario.
- No es asesoría financiera ni legal.
- Sus señales son "lecturas plausibles", no reglas exactas de ninguna institución.
- Siempre debe haber disclaimer visible.

## 8. Lo que Claude **NO debe hacer** en este repo

- Cambiar el stack (no migrar a otro framework).
- Reestructurar el repo sin pedírselo.
- Introducir librerías de UI pesadas (Chakra, MUI) sin pedirlas.
- Implementar scoring opaco que el usuario no pueda explicar.
- Prometer cosas ("el banco te aprobará X", "vas a ahorrar Y").
- Inventar leyes o tasas. Si no hay datos, decir "sin datos suficientes".
- Persistir cartolas o transacciones individuales.
- Escribir comentarios redundantes ("aquí declaramos la variable X").

## 9. Skills conceptuales (estructura de peticiones)

Cuando se trabaje en este repo con Claude Code, prefiere enmarcar la petición
como uno de estos roles (detalles en `14-claude-code-skills.md`):

- `espejo-frontend-builder` — componentes / páginas Next + Tailwind
- `espejo-dal-and-domain-builder` — funciones puras de `lib/`
- `espejo-api-routes-builder` — endpoints `/api/*`
- `espejo-mcp-tools-builder` — tools del MCP Python
- `espejo-agents-designer` — prompts y helpers de agentes
- `espejo-copy-and-narrative-writer` — textos en lenguaje ciudadano

Regla: **una petición → un skill → un objetivo claro**.

## 10. Recursos

- Bases del Lab y rúbrica: `Docs-Final/01-vision-y-hackathon.md` y `12-entregables-rubrica.md`
- Stack y arquitectura: `Docs-Final/03-arquitectura.md`
- Contrato de datos: `Docs-Final/04-contrato-de-datos.md`
- Plan 48h: `Docs-Final/09-plan-48h.md`
