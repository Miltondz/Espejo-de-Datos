# 12 — Entregables y rúbrica

> Lista de qué hay que entregar, cuándo y cómo, más una guía concreta para
> subir cada criterio de la rúbrica a 5/5.

---

## 1. Tres entregables obligatorios

### 1.1. Ficha Cívica

- **Deadline:** 7 mayo 2026, **10:00 hora Chile**.
- **Formato:** formulario estructurado en el portal del Lab.
- **Quién entrega:** Adolfo (con apoyo de Renzo).
- **Contenido (campos esperados):**
  - Línea temática: **01 — Inclusión Financiera**.
  - Categoría: **AI Builder**.
  - Problema ciudadano: ver `01-vision-y-hackathon.md` §2.
  - Segmento específico: ver `02-producto-y-segmento.md` §1.
  - Propuesta de valor: ver `02-producto-y-segmento.md` §5.
  - Canal de adopción: B2G primario.
  - Datos usados: cartola del usuario + mindicador.cl (UF/IPC/TPM).
  - Stakeholder identificado: CMF Educa o SERNAC (mencionar contacto post-Lab).
  - Equipo: Milton, Alejandra, Adolfo, Renzo.

### 1.2. Entregable técnico

- **Deadline:** 7 mayo 2026, **17:00 hora Chile**.
- **Quién entrega:** Milton.
- **Obligatorio:**
  1. **Video demo de 3–5 minutos** (ver `11-demo-y-pitch.md` §5).
  2. **Screenshot de consola Claude** mostrando una invocación del
     `MirrorBuilderAgent` con tool calls del MCP.
  3. **System prompt principal** (`MIRROR_BUILDER_SYSTEM_PROMPT` o
     `ACTION_PLANNER_SYSTEM_PROMPT`) en archivo de texto limpio.
- **Opcional pero suma bonus:**
  - URL del repositorio público de GitHub.
  - Schemas de las tools MCP (lista o JSON).
  - Declaración explícita de herramientas Anthropic usadas: **Claude API,
    MCP, Agent SDK, Files API** (si aplica).

### 1.3. Pitch en vivo

- **Cuándo:** 7 mayo, tarde (después de la preselección Top 6 por línea).
- **Duración:** 3 min + 2 min Q&A.
- **Quién:** equipo completo en escena, Milton conduce, ver
  `11-demo-y-pitch.md`.

---

## 2. Rúbrica detallada — cómo subir cada criterio

5 criterios + bonus. Cada criterio en escala 1–5. Suma ponderada sobre 100.

### 2.1. Impacto ciudadano (25%)

| Nivel | Cómo se ve |
|---|---|
| 1 | "Para chilenos en general" sin segmento |
| 3 | Segmento concreto, canal realista, sin contacto identificado |
| 4 | Lo anterior + primer contacto identificado |
| **5** | **Lo anterior + plan 30/60/90 escrito + stakeholder comprometido o reunión en agenda** |

**Cómo llegamos a 5:**
- Segmento súper concreto: emprendedoras de primera generación, regiones,
  ventas digitales con cuentas fintech.
- Canal B2G claro: CMF Educa / SERNAC / municipios con fomento productivo.
- Plan 30/60/90 días en `roadmap-adopcion.md` (lo escribe Adolfo).
- Lunes 11 mayo (post-Lab) Adolfo envía mail a contacto identificado en CMF
  Educa o SERNAC para reunión.

### 2.2. Datos responsables (20%)

| Nivel | Cómo se ve |
|---|---|
| 1 | Pide datos sensibles sin explicar para qué |
| 3 | Hay disclaimers básicos |
| 4 | Privacy by design real (no persiste, minimización) |
| **5** | **Lo anterior + alineamiento con Ley 21.719 + frase clara al usuario + no se loggea PII** |

**Cómo llegamos a 5:**
- Cartola en memoria, descarte explícito. Sin DB.
- Disclaimer visible **antes** de subir cualquier archivo.
- Sin logs de transacciones ni perfiles del usuario.
- Frase ancla: "tu cartola se procesa en memoria y se descarta. Lo que se
  queda contigo es tu Espejo — no tus datos."
- Renzo lo argumenta en 30s con referencia a Ley 21.719.

### 2.3. Uso de Claude y pensamiento agéntico (25%)

| Nivel | Cómo se ve |
|---|---|
| 1 | Una llamada simple a Claude |
| 3 | Tool use simple |
| 4 | Agente con tools y razonamiento |
| **5** | **Múltiples agentes que orquestan tools MCP en cadena, con outputs estructurados validados, fallback determinista** |

**Cómo llegamos a 5:**
- 2 agentes core: `MirrorBuilderAgent` orquesta **5 tools** del MCP en
  cadena (parse → macro → profile → signals → lenses).
- `ActionPlannerAgent` razona sobre el output de `simulate_change` y
  elige la acción de mayor impacto entre las hipótesis.
- 1 mini-agente `LetterGeneratorAgent` con Haiku (eficiencia de costo).
- Outputs JSON validados con tipos antes de devolver.
- Fallback determinista en `lib/` si el agente falla → demuestra **diseño
  agéntico responsable**.
- **Bonus +5** se explica abajo.

### 2.4. Funciona (15%)

| Nivel | Cómo se ve |
|---|---|
| 1 | No corre |
| 3 | Demo limitada |
| 4 | MVP funcional con limitaciones conocidas |
| **5** | **Demo end-to-end estable + simulación + pasaporte + carta** |

**Cómo llegamos a 5:**
- Demo Paula corre fluida (test 30 min antes del pitch).
- Simulación con slider funciona y muestra cambio real.
- Pasaporte se descarga (vía `window.print()`).
- Carta se genera para `sig_tasa_cercana_tmc`.
- Modo demo offline disponible como contingencia.

### 2.5. Pitch + narrativa ciudadana (15%)

| Nivel | Cómo se ve |
|---|---|
| 1 | Confuso, lleno de tecnicismos |
| 3 | Mensaje claro, demo razonable |
| 4 | Narrativa centrada en la persona, lenguaje claro |
| **5** | **Frase ancla memorable + estructura de pitch impecable + 4 voces complementarias en escena** |

**Cómo llegamos a 5:**
- Frase ancla: "La cartola que te evalúa en silencio, ahora también te explica."
- Estructura del pitch en `11-demo-y-pitch.md` §3, ensayada al menos 3 veces.
- Cada miembro del equipo tiene 30–45s con un ángulo distinto.
- Demo se ve y se entiende sin requerir explicación adicional.

### 2.6. Bonus agéntico (+5)

| Cumple si… | Estado Espejo |
|---|---|
| Hay agente(s) que orquestan tools (no solo prompts simples) | ✅ |
| Manejan razonamiento sobre output de tools (no solo "llamar y devolver") | ✅ ActionPlannerAgent elige acción |
| Hay arquitectura de agentes documentada | ✅ `06-agentes-claude.md` |
| Hay validación de outputs estructurados | ✅ JSON Schema en cada agente |
| Documentado en entregable técnico (system prompt + screenshot consola) | ✅ entregable obligatorio cubre esto |

---

## 3. Score objetivo

| Criterio | Peso | Score objetivo | Score ponderado |
|---|---|---|---|
| Impacto ciudadano | 25% | 5/5 | 25 |
| Datos responsables | 20% | 5/5 | 20 |
| Uso de Claude | 25% | 5/5 | 25 |
| Funciona | 15% | 4/5 | 12 |
| Pitch + narrativa | 15% | 5/5 | 15 |
| **Subtotal** | 100% | | **97** |
| Bonus agéntico | +5 | sí | **+5** |
| **Total** | | | **102 / 100+5** |

Subir a 5/5 en "Funciona" depende de cómo corra la demo en vivo — el MVP debe
ser **estable**, no necesariamente más completo.

---

## 4. Gates obligatorios — riesgo de descalificación o penalización

| Gate | Cómo se cumple |
|---|---|
| **Ventana de construcción** (6 mayo 00:00 → 7 mayo 23:59 UTC-4) | Sin commits ni código fuera de la ventana. Confirmado en `09-plan-48h.md` |
| **Sin trabajo preexistente** | Repo Git nuevo creado el 6 mayo. Diseño en `Docs-Final/` no es código |
| **Sin alucinación regulatoria** | Cifras y leyes solo desde MCP / fuentes verificables. `LetterGenerator` evita citar artículos específicos |
| **Claude como motor principal** | Solo Claude. No mezclar con OpenAI / Gemini |
| **Manejo de PII** | Cartola en memoria, no se guarda. `08-privacidad-y-datos.md` lo detalla |
| **Entregables completos a tiempo** | Ficha cívica 10:00, técnico 17:00, pitch en horario |

---

## 5. Cómo se ve el repo en el entregable

Si entregamos el link al repo (suma bonus), debe verse así:

```
espejo-de-datos/
├── README.md                    ← qué es, cómo correr
├── CLAUDE.md                    ← reglas del proyecto
├── package.json
├── app/                         ← Next.js
├── components/
├── lib/
│   └── agents/                  ← system prompts y helpers
├── types/
├── data/                        ← fixtures demo
└── mcp-server/
    └── financial_mirror_mcp.py
```

`README.md` debe incluir:
- Qué es Espejo de Datos (1 párrafo).
- Stack.
- Cómo correr local (Next + MCP).
- Variables de entorno requeridas.
- Disclaimer.
- Link al video.
- Equipo.

---

## 6. Material adicional para el entregable técnico

Sumar como anexos:

- **Diagrama de arquitectura** (puede ser captura del esquema de
  `03-arquitectura.md`).
- **Lista de tools del MCP** con sus inputs/outputs.
- **System prompts** completos de los 3 agentes.
- **Capturas de la app** (Espejo + Pasaporte + Carta).
- **Screenshot consola Claude** con tool calls visibles.

Todo esto sube significativamente la percepción de "esto es agéntico de verdad".
