# Prompts para Milton — Backend / MCP / Agentes

> Conjunto de prompts listos para copiar/pegar en Claude Code durante el Lab.
> Optimizados para Sonnet 4.6 + buenas prácticas Anthropic. Cada prompt
> corresponde a un paso concreto del plan de 48h (`Docs-Final/09-plan-48h.md`).
>
> **Recordatorio:** todos estos prompts se ejecutan **dentro de la ventana
> válida** (6 mayo 00:00 → 7 mayo 23:59 UTC-4).

---

## Prompt 0 — Cargar contexto en Claude Code

Este se corre **una sola vez** al inicio de cada sesión nueva.

```text
Voy a trabajar en el proyecto Espejo de Datos durante el Claude Impact Lab
Chile 2026.

Contexto del proyecto:
- CLAUDE.md está en la raíz del repo (cópialo si aún no lo has visto).
- La carpeta Docs-Final/ tiene la documentación canónica del proyecto.
- Stack: Next.js 14 + TS + Tailwind + MCP Python con FastMCP + 2 agentes Claude.
- Modelo default: claude-sonnet-4-6.
- Naming: camelCase. NO snake_case.

Reglas firmes:
1. Plan primero (3-6 pasos), código después.
2. No cambiar tipos (FinancialProfile, EspejoResponse) sin proponerlo primero.
3. No mezclar áreas en una misma petición.
4. Funciones de lib/ son puras, sin fetch ni disco.
5. La cartola NUNCA se persiste — todo en memoria.

Confirma que entendiste y dime si necesitas leer algún archivo antes de
empezar.
```

---

## Prompt 1 — Setup inicial del proyecto (6 mayo, 12:30)

```text
Skill: espejo-api-routes-builder + setup inicial.

Tarea: crear la base del proyecto Next.js 14 dentro de la ventana del
Hackathon.

Contexto:
- Hoy es 6 mayo 2026 después de las 12:00 hora Chile. Podemos comprometer
  cambios al repo a partir de ahora.
- Necesito un proyecto Next 14 con App Router, TS, Tailwind, ESLint.

Tarea:
1) Dame el PLAN de comandos a ejecutar (npx create-next-app, deps adicionales,
   estructura de carpetas según Docs-Final/03-arquitectura.md §3).
2) Listame los archivos vacíos que tengo que crear inicialmente (types,
   lib/, app/api/, components/espejo/, etc.).
3) Dame el contenido inicial de:
   - .env.local (placeholder de ANTHROPIC_API_KEY)
   - lib/claude.ts (cliente Anthropic singleton)
4) NO crees aún tipos ni lógica — esto es solo el esqueleto.
5) Al final, ejecuta este comando para instalar los skills de Claude Code:
   cp -r ../Doc_EspejoDatos/Docs-Final/skills-para-proyecto/ .claude/skills/
   (ajusta la ruta si la carpeta de docs está en otro lugar)
   Confirma que los 6 archivos .md quedaron en .claude/skills/.
```

---

## Prompt 2 — Tipos y fixtures

```text
Skill: espejo-dal-and-domain-builder.

Tarea: crear types/profile.ts, types/espejo.ts y los fixtures de Paula.

Contexto:
- Las definiciones canónicas están en Docs-Final/04-contrato-de-datos.md.
- Los fixtures canónicos están en Docs-Final/16-fixtures/*.json.
- Convención: camelCase, sin abreviaturas.

Tarea:
1) Plan de los 4 archivos a crear:
   - types/profile.ts (FinancialProfile + tipos auxiliares)
   - types/espejo.ts (EspejoResponse + subtipos)
   - data/demo-financial-profile-paula.json
   - data/demo-espejo-paula.json
2) Implementa los .ts copiando exactamente lo del documento canónico.
3) Copia los fixtures desde Docs-Final/16-fixtures/.
4) Confirma que el repo compila con `npx tsc --noEmit`.
```

---

## Prompt 3 — DAL mock + `/api/analyze` modo demo

```text
Skill: espejo-dal-and-domain-builder + espejo-api-routes-builder.

Tarea: implementar la versión sin IA de /api/analyze.

Contexto:
- Ya existen types/profile.ts, types/espejo.ts.
- Ya están los fixtures en data/.
- Flujo deseado:
  POST /api/analyze con { mode: "demo", demoId: "paula", segmento: "emprendedora" }
  → carga el FinancialProfile de Paula desde data/
  → llama buildEspejoFromProfile(profile)
  → devuelve EspejoResponse.

Tarea:
1) Plan: lib/data-adapter.ts, lib/espejo-builder.ts, app/api/analyze/route.ts.
2) Implementa lib/data-adapter.ts:
   - export async function getFinancialProfileFromMock(demoId: 'paula' | 'luis')
3) Implementa lib/espejo-builder.ts con funciones puras:
   - buildEspejoFromProfile(profile): EspejoResponse
   - extractSignalsFromProfile(profile): EspejoSignal[]
   - generateLensesFromProfile(profile, signals): EspejoLens[]
   - usa las reglas del catálogo de señales en Docs-Final/04-contrato-de-datos.md §3
4) Implementa app/api/analyze/route.ts:
   - parsea body, distingue mode "demo" vs multipart
   - en demo: llama el DAL + builder
   - en multipart: TODO (siguiente paso)
   - devuelve JSON tipado con manejo de errores
5) Confirma que un POST de prueba con curl devuelve un EspejoResponse válido.
```

---

## Prompt 4 — MCP server Python

```text
Skill: espejo-mcp-tools-builder.

Tarea: levantar el servidor MCP financial-mirror-mcp en Python.

Contexto:
- El código de referencia COMPLETO está en Docs-Final/05-mcp-financial-mirror.md.
- Carpeta destino: mcp-server/.
- Dependencias: fastmcp + httpx.

Tarea:
1) Plan: crear mcp-server/{requirements.txt, financial_mirror_mcp.py, README.md}.
2) Copia el código desde el documento canónico, sin modificar las firmas.
3) Crea requirements.txt con fastmcp y httpx pinneado.
4) Dame los comandos para crear el venv y arrancar el server.
5) Sugiere cómo probar fetch_macro_indicators desde MCP Inspector o desde
   un script Python aparte.
```

---

## Prompt 5 — `MirrorBuilderAgent` integrado en `/api/analyze`

```text
Skill: espejo-agents-designer + espejo-api-routes-builder.

Tarea: implementar el agente MirrorBuilderAgent y conectarlo a /api/analyze
para soportar cartolas reales (multipart).

Contexto:
- System prompt y schema de salida están en Docs-Final/06-agentes-claude.md §2.
- El agente usa MCP financial-mirror-mcp con tools: parse_cartola,
  fetch_macro_indicators, build_financial_profile, extract_signals,
  generate_lenses.
- Modelo: claude-sonnet-4-6.
- Output: EspejoResponse SIN simulationSuggestion.

Tarea:
1) Plan:
   - lib/agents/mirrorBuilderAgent.ts (constante MIRROR_BUILDER_SYSTEM_PROMPT
     + interface MirrorBuilderInput + función callMirrorBuilderAgent)
   - cómo inyectar las tools MCP en messages.create
   - actualizar app/api/analyze/route.ts para soportar multipart/form-data
2) Implementa el agente con validación del JSON de salida.
3) Implementa el handling multipart en la route. Mantén el modo demo intacto.
4) **Fallback obligatorio:** si la llamada al agente falla (timeout, JSON
   inválido, MCP caído), cae al DAL determinista con demoId="paula" y marca
   profileSummary.nombreDemo = "Paula (modo demo)".
5) Loggea solo metadatos (status, latencia, conteo de tools llamadas), nunca
   contenido del usuario.
```

---

## Prompt 6 — `ActionPlannerAgent` + `/api/simulate`

```text
Skill: espejo-agents-designer + espejo-api-routes-builder.

Tarea: implementar ActionPlannerAgent y el endpoint /api/simulate.

Contexto:
- System prompt completo en Docs-Final/06-agentes-claude.md §3.
- Tool MCP usada: simulate_change.
- Output: EspejoSimulationSuggestion (ver types/espejo.ts).
- Modelo: claude-sonnet-4-6.

Tarea:
1) Plan:
   - lib/agents/actionPlannerAgent.ts
   - app/api/simulate/route.ts
2) Implementa el agente con validación del JSON.
3) Implementa la route que recibe { segmento, goal, hypothesis, [profile,
   signals] } y devuelve { simulationSuggestion }.
4) **Fallback determinista:** si falla la IA, usa lib/simulation.ts (función
   pura) y genera una sugerencia plausible para el slider de uso de cupo.
5) Validación: bloquear hypothesis con valores absurdos (ej.
   reducirUsoCupoPct > 100) con 400.
```

---

## Prompt 7 — `LetterGeneratorAgent` + `/api/generar-carta`

```text
Skill: espejo-agents-designer + espejo-api-routes-builder.

Tarea: implementar LetterGeneratorAgent (sin MCP, modelo Haiku).

Contexto:
- System prompt completo en Docs-Final/06-agentes-claude.md §4.
- Modelo: claude-haiku-4-5 (más económico, suficiente para texto plano).
- Output: { cartaTexto: string }.
- Tipos válidos de tipoProblema: tasa_cercana_tmc, cobro_no_autorizado,
  portabilidad_credito.

Tarea:
1) Plan: archivo del agente + route.
2) Implementa el agente, devuelve solo el texto sin envoltorios.
3) Implementa la route con validación del body.
4) Sin fallback (si Haiku falla, devolvemos 503 con mensaje "intenta más tarde").
   La UI muestra el botón con manejo de error.
```

---

## Prompt 8 — Auditoría de seguridad y datos

```text
Skill: revisión de seguridad/datos personales.

Tarea: auditar el backend completo antes de cerrar.

Contexto:
- El proyecto está casi completo.
- Reglas duras en Docs-Final/08-privacidad-y-datos.md §5.
- En particular: NO loggear contenido de cartolas, NO devolver payload del
  usuario en errores, NO escribir archivos en disco para procesar la cartola
  más allá del buffer temporal.

Tarea:
1) Revisa:
   - app/api/analyze/route.ts
   - app/api/simulate/route.ts
   - app/api/generar-carta/route.ts
   - cualquier código en lib/ que toque files o input del usuario
2) Lista riesgos detectados (ej. "console.log de body en línea X", "error
   con error.message que puede contener datos del usuario").
3) Propón cambios concretos. NO los apliques aún — déjame revisarlos
   primero.
```

---

## Prompt 9 — Capturas y documentación de entregables

```text
Tarea: preparar el entregable técnico para subir al portal.

Contexto:
- Deadline 7 mayo 17:00.
- Obligatorio: video 3-5 min + screenshot consola Claude + system prompt
  principal.
- Bonus: link al repo público + tools schema.

Tarea:
1) Dame los pasos para:
   - generar un screenshot limpio de la consola Claude mostrando una
     invocación del MirrorBuilderAgent con tool_use blocks visibles.
   - exportar MIRROR_BUILDER_SYSTEM_PROMPT a un archivo .txt limpio (sin
     escapes de TS).
   - generar un README.md mínimo del repo (ver Docs-Final/12-entregables-rubrica.md §5).
   - hacer público el repo si está privado (sin filtrar la API key).
2) Lista todo lo que debe ir en el ZIP/entregable y los nombres sugeridos
   de archivo.
```

---

## Prompt 10 — Si algo falla minutos antes del pitch

```text
Tarea: diagnóstico rápido de bug bloqueante.

Síntoma: [describir qué falla].

Constraint:
- No reescribir nada que ya funcione.
- Cambio mínimo posible.
- Si no es trivial, mejor usar el modo demo offline (toggle en frontend).

Tarea:
1) Diagnóstico en 3-5 puntos.
2) Si es < 5 min de fix: aplicarlo.
3) Si es > 5 min: confirmar que demo offline funciona y dejar el bug para
   post-pitch.
```

---

## Reglas de oro al usar estos prompts

1. **Una sesión = un prompt = un objetivo.** Si el chat se infla, abre uno
   nuevo y empieza con Prompt 0.
2. **Antes de aceptar código, lee el plan.** Si el plan tiene 7 pasos y solo
   pediste uno, recórtalo.
3. **No copies a ciegas.** Si ves algo raro (un `as any`, un `console.log`
   sospechoso), pregúntale a Claude por qué lo puso.
4. **Si Claude propone cambiar tipos**, di "no, propónmelo primero por
   separado en `04-contrato-de-datos.md` y conversémoslo".
