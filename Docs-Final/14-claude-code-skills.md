# 14 — Skills conceptuales para Claude Code

> Patrones de prompt para estructurar peticiones a Claude Code en este repo.
> No son skills formales del sistema — son **roles** que el usuario adopta
> al pedir ayuda, para mantener contexto enfocado.
>
> Regla central: **una petición → un skill → un objetivo claro**.
> No mezclar "hazme UI + backend + pitch" en el mismo mensaje.

---

## 1. ¿Por qué skills?

Los súper-prompts difusos producen resultados difusos. Si en cambio se le
pide a Claude Code algo enmarcado en un rol específico, con input
estructurado y restricciones claras, los resultados son consistentes y
reusables.

Aplicamos lo que recomienda Anthropic: skills pequeños, contexto estructurado,
una sola responsabilidad por petición.

---

## 2. Inventario de skills

| Skill | Para quién | Qué hace |
|---|---|---|
| `espejo-frontend-builder` | Alejandra | Componentes y páginas Next + Tailwind |
| `espejo-dal-and-domain-builder` | Milton | Funciones puras de `lib/` |
| `espejo-api-routes-builder` | Milton | Endpoints `/api/*` |
| `espejo-mcp-tools-builder` | Milton | Tools del MCP Python |
| `espejo-agents-designer` | Milton (con Renzo en disclaimers) | System prompts y helpers de agentes |
| `espejo-copy-and-narrative-writer` | Alejandra, Adolfo, Renzo | Textos en lenguaje ciudadano |

Los detalles de cada skill se desarrollan abajo.

---

## 3. `espejo-frontend-builder`

**Quién lo usa:** Alejandra para frontend.

**Cuándo usarlo:**
- Crear o modificar componentes en `app/` o `components/espejo/`.
- Generar layouts responsive con Tailwind.
- Conectar UI con `/api/analyze` y `/api/simulate`.

**Cuándo NO:**
- No usar para lógica de negocio.
- No usar para escribir prompts de agentes.

**Estructura de input (XML):**

```xml
<skill-espejo-frontend-builder>
  <context>
    <!-- Qué parte de la UI se quiere construir o modificar.
         Ej: "Quiero un grid de señales con cards usando EspejoSignal[]." -->
  </context>
  <types>
    <!-- Pegar las definiciones relevantes de types/espejo.ts. -->
  </types>
  <example-data>
    <!-- Opcional: EspejoResponse de demo para imaginar el render. -->
  </example-data>
  <constraints>
    - Next.js 14 App Router
    - TypeScript
    - Tailwind CSS, sin librería extra de UI
    - No lógica de negocio, solo presentación
    - Mobile-first (360px+)
  </constraints>
</skill-espejo-frontend-builder>
```

**Output esperado:**
- Código TSX completo del componente o página.
- Props tipadas con los tipos de `types/espejo.ts`.
- Si hace fetch, usa `/api/analyze` o `/api/simulate` explícitamente.

---

## 4. `espejo-dal-and-domain-builder`

**Quién lo usa:** Milton para lógica de dominio pura.

**Cuándo usarlo:**
- Crear/modificar funciones en `lib/`:
  - `buildEspejoFromProfile`
  - `simulateProfileChange`
  - `recalculateSignals`
- Ajustar reglas de señales o lentes.

**Cuándo NO:**
- No para UI.
- No para llamadas HTTP.
- No para prompts de IA.

**Estructura de input:**

```xml
<skill-espejo-dal-and-domain-builder>
  <context>
    <!-- Qué función se quiere crear o cambiar.
         Ej: "Quiero que SIG_OVER_DEBT se active cuando carga financiera > 35%." -->
  </context>
  <types>
    <!-- types/profile.ts y types/espejo.ts -->
  </types>
  <current-code>
    <!-- Código actual de la función si existe. -->
  </current-code>
  <rules>
    - Funciones puras, sin side effects
    - Sin fetch, sin disco, sin React/Next
    - Solo parámetros y retornos tipados
  </rules>
</skill-espejo-dal-and-domain-builder>
```

**Output esperado:**
- TypeScript de funciones puras.
- Comentarios solo donde la regla de negocio lo justifique.
- Sin imports a frameworks.

---

## 5. `espejo-api-routes-builder`

**Quién lo usa:** Milton para endpoints HTTP.

**Cuándo usarlo:**
- Crear/ajustar `app/api/analyze/route.ts`, `simulate/route.ts`,
  `generar-carta/route.ts`.
- Implementar parsing de multipart/form-data.
- Conectar con agentes vía helpers de `lib/agents/`.
- Manejo de errores.

**Estructura de input:**

```xml
<skill-espejo-api-routes-builder>
  <route>
    <!-- /api/analyze | /api/simulate | /api/generar-carta -->
  </route>
  <context>
    <!-- Qué debe hacer la ruta:
         - qué recibe (body o multipart),
         - qué llama (DAL, agentes, MCP),
         - qué devuelve. -->
  </context>
  <types>
    <!-- Tipos relevantes (FinancialProfile, EspejoResponse, ...) -->
  </types>
  <claude-config>
    <!-- Forma actual de uso de @anthropic-ai/sdk. -->
  </claude-config>
  <constraints>
    - No exponer API keys
    - Responder siempre JSON tipado
    - Fallback determinista si la IA falla
    - No loggear contenido del usuario
  </constraints>
</skill-espejo-api-routes-builder>
```

**Output esperado:**
- Código TypeScript del archivo `route.ts`.
- Manejo explícito de:
  - parsing del body / FormData
  - errores con status 4xx/5xx claros
  - mensajes sin datos sensibles

---

## 6. `espejo-mcp-tools-builder`

**Quién lo usa:** Milton para las tools del MCP Python.

**Cuándo usarlo:**
- Definir o ajustar input/output de tools en `mcp-server/financial_mirror_mcp.py`.
- Agregar validaciones o nuevas tools.

**Estructura de input:**

```xml
<skill-espejo-mcp-tools-builder>
  <tool-name>
    <!-- parse_cartola | fetch_macro_indicators | extract_signals | ... -->
  </tool-name>
  <context>
    <!-- Qué debe hacer la tool y qué NO. -->
  </context>
  <schemas>
    <!-- Estructura esperada de input y output (en JSON). -->
  </schemas>
  <current-code>
    <!-- Implementación actual si existe. -->
  </current-code>
  <constraints>
    - Python + FastMCP
    - No llamar a Claude API desde aquí
    - Solo parsing, HTTP a APIs públicas, cálculo
    - Manejar errores con mensajes claros (sin datos sensibles)
  </constraints>
</skill-espejo-mcp-tools-builder>
```

**Output esperado:**
- Código Python de la tool con `@mcp.tool()`.
- Validaciones básicas de input.
- Sin lógica de UI ni prompts.

---

## 7. `espejo-agents-designer`

**Quién lo usa:** Milton (con apoyo de Renzo en restricciones legales).

**Cuándo usarlo:**
- Diseñar/refinar `MIRROR_BUILDER_SYSTEM_PROMPT`,
  `ACTION_PLANNER_SYSTEM_PROMPT`, `LETTER_GENERATOR_SYSTEM_PROMPT`.
- Implementar helpers `callXxxAgent`.
- Ajustar formato de salida JSON.

**Estructura de input:**

```xml
<skill-espejo-agents-designer>
  <agent-name>
    <!-- mirror-builder | action-planner | letter-generator -->
  </agent-name>
  <context>
    <!-- Qué hace el agente hoy, qué problema concreto se está viendo
         (ej: "a veces no usa simulate_change", "a veces inventa leyes"). -->
  </context>
  <tools>
    <!-- Tools MCP disponibles. -->
  </tools>
  <io-schemas>
    <!-- Esquema actual de input y output JSON. -->
  </io-schemas>
  <current-prompt>
    <!-- System prompt actual si existe. -->
  </current-prompt>
  <constraints>
    - Debe SIEMPRE usar tool X para dato Y
    - Debe SIEMPRE devolver JSON válido con esquema Z
    - No debe citar artículos específicos si no está seguro
    - Lenguaje ciudadano, no paternalista
  </constraints>
</skill-espejo-agents-designer>
```

**Output esperado:**
- System prompt actualizado con secciones (Rol, Herramientas, Pasos,
  Formato de salida, Restricciones).
- Helper TypeScript con validación del JSON de salida.
- Sugerencias de modelo (Sonnet vs Haiku) y `max_tokens`.

---

## 8. `espejo-copy-and-narrative-writer`

**Quién lo usa:** Alejandra, Adolfo, Renzo para textos.

**Cuándo usarlo:**
- Escribir/ajustar headlines de lentes.
- Descripciones de señales en lenguaje ciudadano.
- Explicaciones de simulaciones.
- Disclaimers.
- Texto del pitch.

**Estructura de input:**

```xml
<skill-espejo-copy-and-narrative-writer>
  <context>
    <!-- Dónde se usará el texto (ej: headline lente Banco, señal
         de uso de cupo alto, etc.). -->
  </context>
  <audience>
    <!-- Segmento: "emprendedora de primera generación en región" o similar. -->
  </audience>
  <constraints>
    - Lenguaje simple, sin tecnicismos
    - Tono respetuoso, no paternalista
    - Máx 2-3 frases por bloque
    - No prometer aprobaciones ni resultados
    - Incluir enfoque "cómo te ven" cuando aplique
  </constraints>
  <draft>
    <!-- Texto actual o ideas en crudo (opcional). -->
  </draft>
</skill-espejo-copy-and-narrative-writer>
```

**Output esperado:**
- Texto listo para pegar en componentes o prompts.
- Si se piden variantes, hasta 3 con la misma intención.

---

## 9. Patrones de uso

### Patrón A — Empezar siempre con plan

```
Usa el skill `espejo-X` para ayudarme con [tarea concreta].

[input estructurado del skill]

Por favor:
1) Dame primero un PLAN de 3-5 pasos.
2) Luego, si confirmo, aplica los cambios en los archivos específicos.
3) Si necesitas ver tipos o código actual, pídemelo explícitamente.
```

### Patrón B — Reuso de contexto

Si ya hubo una sesión previa, abrir con:

```
Continuando con [skill] del proyecto Espejo de Datos.
[CLAUDE.md está en raíz del repo, types y datos en /types y /data]

Contexto adicional:
[lo que cambió desde la última vez]

Tarea:
[qué quiero ahora]
```

### Patrón C — Cuando algo no funciona

```
Skill: [el que aplica]

Síntoma: [qué está fallando, ejemplo concreto]

Hipótesis: [si tienes una idea, dila]

Constraint: no toques [archivo / función] sin proponerlo primero.

Por favor:
1) Diagnóstico (no toques código aún).
2) Plan de fix.
3) Aplica solo si confirmo.
```

---

## 10. Lo que NO hacer (errores comunes)

- ❌ "Hazme la app entera" — viola "una petición → un objetivo".
- ❌ Pegar 500 líneas de código sin contexto — Claude se pierde.
- ❌ Pedir UI + backend + IA en el mismo mensaje.
- ❌ Cambiar `FinancialProfile` o `EspejoResponse` sin pasar por el flujo
  de `04-contrato-de-datos.md`.
- ❌ Pedir prompts "mágicos" de 300 líneas. Mejor secciones cortas y
  claras.
- ❌ Olvidar mencionar el modelo (`claude-sonnet-4-6`).

## 11. Para los prompts concretos por persona

Ver:
- `15-prompts-equipo/milton-backend.md`
- `15-prompts-equipo/alejandra-frontend.md`
- `15-prompts-equipo/adolfo-negocio.md`
- `15-prompts-equipo/renzo-legal.md`
