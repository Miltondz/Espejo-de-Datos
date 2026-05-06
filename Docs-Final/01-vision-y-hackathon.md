# 01 — Visión del producto y reglas del Hackathon

> Documento ejecutivo. Define qué construimos, en qué evento competimos y
> qué reglas (gates) son obligatorias para no quedar descalificados.

---

## 1. La visión en una frase

> Espejo de Datos toma la cartola bancaria —ese documento que hoy banco, fintech
> y Estado usan para evaluarte en silencio— y la traduce en un **espejo ciudadano**
> donde la persona ve las mismas señales, en lenguaje simple, y puede simular
> qué cambiaría si ajusta su comportamiento.

**Lo que SOMOS:** herramienta educativa y de autoconocimiento, con foco en transparencia y
empoderamiento ciudadano.

**Lo que NO somos:** scoring crediticio, asesoría financiera regulada, ni un
predictor de "te aprobarán o no".

## 2. El problema concreto

Chile tiene la **Ley Fintech (21.521)** y un Sistema de Finanzas Abiertas (SFA)
en construcción —pero el SFA no estará operativo hasta **2027–2028**. Mientras
tanto, los datos bancarios siguen viviendo en cartolas PDF/Excel y la persona:

- No entiende qué lectura generan sus patrones de uso del crédito, de ingresos
  y de liquidez.
- No sabe cómo eso conversa con sus derechos (SERNAC, CMF) ni con sus
  obligaciones tributarias (SII).
- Tiene leyes y normativas disponibles, pero en portales densos y lenguaje
  técnico-jurídico.

Resultado: 5 millones de personas en Chile con derechos financieros que no
pueden ejercer.

## 3. La solución que construimos

Una app web (Next.js) donde el usuario:

1. Sube una cartola (PDF/Excel) o usa un perfil demo (Paula).
2. Ve un **resumen de perfil** (ingresos, egresos, liquidez, uso de cupo).
3. Ve **señales** clasificadas: positivas, ambiguas, de riesgo, legales.
4. Ve **lentes** institucionales: cómo se ve el mismo perfil desde Banco /
   Fintech / Estado.
5. **Simula** un cambio ("¿qué pasa si bajo el uso de cupo 20%?").
6. Descarga un **Pasaporte Financiero** imprimible.
7. Si hay una señal legal, puede generar un **borrador de carta** de reclamo.

Detrás: Next.js + DAL + un servidor MCP en Python que expone tools de dominio
(parsear cartola, indicadores macro, extraer señales, generar lentes, simular)
+ dos agentes Claude (MirrorBuilder y ActionPlanner) que orquestan esas tools.

## 4. El evento: Claude Impact Lab Chile 2026

| Dato | Valor |
|---|---|
| Fechas | 6–7 mayo 2026 |
| Sede | Espacio Riesco, Santiago — dentro del Chile Fintech Forum 2026 |
| Equipo | 4 personas (Milton, Alejandra, Adolfo, Renzo) |
| Línea temática | **01 — Inclusión Financiera** |
| Categoría | **AI Builder** |
| Modelo principal | Claude Sonnet 4.6 |
| Créditos | USD 50 / persona en API + USD 2.000 / equipo |
| Premio 1° por línea | USD 500 + Mac Mini + 60 días sandbox CMF + stage CFF |

## 5. Rúbrica resumida (qué evalúan los jueces)

| Criterio | Peso | Cómo lo cumple Espejo |
|---|---|---|
| Impacto ciudadano | 25% | Segmento concreto (Paula, emprendedora), canal B2G, propuesta de valor clara |
| Datos responsables | 20% | Privacy by design: cartola en memoria, sin DB, disclaimers, alineado con Ley 21.719 |
| Uso de Claude + pensamiento agéntico | 25% | 2 agentes (MirrorBuilder + ActionPlanner) que usan MCP. Bonus +5 |
| Funciona | 15% | MVP corre de punta a punta: cartola → espejo → simulación |
| Pitch + narrativa | 15% | Mensaje claro, lenguaje ciudadano, demo de Paula |
| **Bonus agéntico** | **+5** | **Sí**: agentes orquestando tools MCP con razonamiento |

Total objetivo: **90+ con bonus**, suficiente para top 6 de la línea.

## 6. ⚠️ Gates obligatorios — si fallas, te descalifican o restas puntos

### Gate 1 — Ventana de construcción válida

Todo el código y contenido de la solución debe crearse **entre 6 mayo 00:00 y
7 mayo 23:59 hora Chile (UTC-4)**. Commits fuera de esa ventana penalizan con
**score técnico = 0**. Los jueces verifican vía consola de Claude + git log.

**Implicancia para nosotros (5 mayo):**

- ❌ NO crear el proyecto Next con `create-next-app` antes del 6.
- ❌ NO escribir tipos `FinancialProfile` ni `EspejoResponse` en archivos antes del 6.
- ❌ NO instalar dependencias antes del 6.
- ✅ SÍ leer docs, diseñar en papel/Figma, ensayar el pitch.
- ✅ SÍ tener listas las **decisiones**: stack, persona, copy, contratos
  (pero solo en estos `Docs-Final/`, no en código).

### Gate 2 — Sin alucinación regulatoria

Los agentes nunca deben inventar leyes, artículos ni tasas. Si no tienen el
dato, deben decir "sin datos suficientes". Si citamos algo (ej. la Ley 21.521),
debe ser real y verificable.

### Gate 3 — Claude como motor principal

No usar otros LLMs. Solo Claude. Ya está cubierto por nuestro stack.

### Gate 4 — Manejo de PII

Si el demo recibe RUT o cartolas reales, no se persisten. La app advierte al
usuario antes de subir cualquier archivo.

### Gate 5 — Entregables completos

- **Ficha cívica** entregada a 7 mayo 10:00.
- **Entregable técnico** entregado a 7 mayo 17:00 (video 3–5 min + screenshot
  consola Claude + system prompt principal).
- **Pitch en vivo** el 7 mayo en la tarde (3 min + 2 min Q&A).

Detalle en `12-entregables-rubrica.md`.

## 7. Definición de éxito

**Éxito mínimo (no perdimos el tiempo):**
- MVP corre punta a punta con Paula.
- Cumplimos los 5 gates.
- Entregamos los 3 entregables a tiempo.

**Éxito objetivo (top 6 por línea):**
- Lo anterior + simulación funcionando con `ActionPlannerAgent` + MCP real.
- Pasaporte imprimible.
- Pitch claro y memorable.

**Éxito superior (1° de línea):**
- Lo anterior + carta de reclamo + 1 contacto B2G concreto identificado
  (CMF Educa o SERNAC) + narrativa de adopción a 30/60/90 días.

## 8. Mensaje de cierre del proyecto

> **"La cartola que hoy se usa para evaluarte en silencio se convierte, con
> Espejo de Datos, en un espejo ciudadano donde tú ves lo mismo que ven banco,
> fintech y Estado — en lenguaje claro y con un botón para simular qué pasaría
> si cambias algo."**

Esa frase es la tesis. Todo lo demás (arquitectura, agentes, MCP, demo) debe
poder reconducirse a ella.
