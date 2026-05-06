# 11 — Demo y pitch

> El Lab da **3 minutos de pitch + 2 minutos de Q&A**. Más un **video grabado
> de 3–5 minutos** como entregable técnico. **No** existe la "demo en
> escenario" de 7–10 minutos que algunos docs viejos describían — eso era
> incorrecto.

---

## 1. Las dos piezas a preparar

| Pieza | Duración | Cuándo | Quién la conduce |
|---|---|---|---|
| **Pitch en vivo** | 3 min + 2 min Q&A | 7 mayo, tarde (si quedamos en Top 6) | Milton, con cameos de Alejandra, Adolfo, Renzo |
| **Video demo** | 3–5 min grabado | Entregar antes de 7 mayo 17:00 | Milton (pantalla) + voice-over |

Ambas piezas cuentan la **misma historia**. El video es la versión "lenta y
prolija"; el pitch es la versión "rápida e impactante".

---

## 2. La tesis en 1 frase

> **"La cartola que hoy usan banco, fintech y Estado para evaluarte en
> silencio se convierte, con Espejo de Datos, en un espejo ciudadano donde
> tú ves las mismas señales en lenguaje claro y puedes simular qué pasaría
> si cambias algo."**

Toda demo y todo pitch deben poder reconducirse a esa frase.

---

## 3. Pitch en vivo — guion de 3 minutos

### Bloque 1 — 0:00 → 0:30 — Hook + problema (Milton)

> "En Chile, cuando un banco, una fintech o el Estado te evalúan, casi siempre
> miran tu cartola. Esa información existe — pero la persona nunca ve esa
> evaluación en un lenguaje que pueda entender. 5 millones de chilenos tienen
> derechos financieros que no pueden ejercer porque la regulación vive en PDFs
> densos y portales desconectados."

### Bloque 2 — 0:30 → 0:50 — Persona (Alejandra)

> "Quiero presentarles a Paula. Tiene 34 años, vive en Temuco, vende ropa por
> Instagram. Ingresos variables, mezcla cuentas personales y de negocio, usa
> avances cuando baja la caja. Siente que el banco no la entiende — pero su
> cartola sí tiene una historia."

### Bloque 3 — 0:50 → 2:00 — Demo flash (Milton, click en pantalla)

Muestra **3 vistas, no más**:

1. **0:50 → 1:10** — Click en "Probar con demo Paula". Aparece el espejo:
   "Acá Paula ve su perfil resumido y sus señales. La de uso de cupo está en
   rojo. La de ingresos irregulares en amarillo. Una positiva por
   movimiento constante."

2. **1:10 → 1:30** — Click en tab "Banco" → "Fintech" → "Estado":
   "La misma cartola se lee distinto según quién mire. Banco se fija en
   estabilidad y crédito; Fintech tolera la variabilidad; Estado pone foco
   en la formalidad tributaria. Tres lentes, una sola cartola."

3. **1:30 → 2:00** — Mover slider "bajar uso de cupo 20%" → "Ver impacto":
   "Aquí Paula simula: si baja en 20% el uso de su tarjeta, esta señal
   pasa de rojo a amarillo, su liquidez mejora, y un banco la vería con
   menos riesgo. No prometemos que un banco le diga que sí — mostramos
   cómo se mueve el reflejo."

### Bloque 4 — 2:00 → 2:30 — Tecnología (Milton)

> "Atrás corre Next.js, Sonnet 4.6, un servidor MCP en Python con seis tools
> de dominio y dos agentes — uno construye el espejo, otro razona sobre la
> simulación. Es **agéntico de verdad**: los agentes deciden qué tools llamar
> y cómo combinarlas. La cartola se procesa en memoria y se descarta — no
> guardamos nada."

### Bloque 5 — 2:30 → 3:00 — Impacto + cierre (Adolfo o Renzo)

> "Pesa 25% de la rúbrica el impacto ciudadano: nuestro segmento son
> emprendedoras de regiones; el canal es B2G — pilotamos con CMF Educa o
> SERNAC en 60 días. Pesa 20% datos responsables: cumplimos hoy lo que la
> Ley 21.719 va a exigir en diciembre. Y la persona se va con un Pasaporte
> Financiero descargable y, si hace falta, un borrador de carta para
> ejercer sus derechos. Espejo de Datos no es scoring. Es educación con
> arquitectura."

---

## 4. Q&A — 2 minutos esperables

Preguntas más probables y respuestas cortas (todas deben caber en 2–3 frases):

### Técnicas

**P:** ¿Por qué dos agentes y no uno?
**R:** Separación de responsabilidades. MirrorBuilder construye lectura;
ActionPlanner razona sobre cambios. Eso permite reusar el primero sin
arrastrar el costo del segundo.

**P:** ¿Cómo evitan que la IA invente leyes o tasas?
**R:** Toda cifra y referencia viene de tools MCP — nunca del modelo. Si
no hay dato, las señales se marcan como `sin_datos` y se dice explícitamente.

**P:** ¿Por qué MCP en Python si el resto es TypeScript?
**R:** Python tiene mejor ecosistema para parsing de cartolas (PDF/Excel) y
FastMCP es muy directo. La separación de procesos también nos da resiliencia
— el MCP puede caer y el frontend sigue mostrando una versión determinista.

### De negocio / impacto

**P:** ¿Quién pagaría por esto en producción?
**R:** En el modelo B2G, el regulador o municipio (CMF Educa, SERNAC, Sercotec)
licencia o contrata como herramienta de inclusión. En B2NGO, las ONGs lo
integran a sus programas. No es un B2C que cobra al usuario.

**P:** ¿Cómo escala a 1M usuarios?
**R:** El cuello de botella es Claude API (escala con créditos) y el parser
de cartolas. Hoy tenemos 1 parser stub; en producción, un parser por banco.
La arquitectura DAL nos permite cambiar la fuente sin tocar el resto.

**P:** ¿En qué se diferencian de Destacame, Fintual, CMF Educa?
**R:** Destacame da score; nosotros explicabilidad. Fintual enseña en
abstracto; nosotros usamos la cartola real. CMF Educa publica circulares;
nosotros las traducimos a la cartola del usuario.

### Legales / privacidad

**P:** ¿Qué hacen con la cartola del usuario?
**R:** Se procesa en memoria y se descarta. Nunca se guarda en disco, DB ni
logs. Esto es la regla central del proyecto, no un nice-to-have.

**P:** ¿Necesitan registro CMF (RPSF) si esto crece?
**R:** No otorgamos crédito ni hacemos scoring. Es una herramienta educativa
de explicabilidad. Si en el futuro emitieramos productos financieros, sí —
pero no es el camino.

**P:** ¿Y la Ley 21.719?
**R:** Diseñamos para cumplirla antes de su vigencia plena (dic 2026):
minimización, finalidad, derecho a borrado, sin transferencia internacional
no autorizada. Si guardáramos el perfil agregado (post-MVP), sería opt-in
explícito, cifrado, con derecho a borrado.

---

## 5. Video demo (entregable técnico) — 3–5 minutos

### Estructura

| Tiempo | Contenido |
|---|---|
| 0:00 → 0:30 | Title + tesis ("Espejo de Datos — Hackathon Claude Impact Lab") |
| 0:30 → 1:00 | Problema + Paula (slide o landing) |
| 1:00 → 3:30 | Demo flow: cartola → espejo → señales → lentes → simulación → pasaporte → carta |
| 3:30 → 4:00 | Arquitectura (diagrama estático del documento `03-arquitectura.md`) |
| 4:00 → 4:30 | Datos responsables (frase + ícono privacidad) |
| 4:30 → 5:00 | Cierre + roadmap 30/60/90 + agradecimiento |

### Producción

- Captura de pantalla con OBS o Loom.
- Voice-over **Milton** (pre-grabado).
- Música de fondo opcional, baja.
- Subtítulos en español incrustados (mejora accesibilidad).

### Si la app no está estable, grabar el flujo "modo demo" sí o sí

**No grabar con cartolas reales** ni con datos personales del equipo.

---

## 6. Plan de contingencia para el pitch en vivo

| Si pasa esto… | Hacer esto… |
|---|---|
| WiFi se cae o `/api/analyze` da timeout | Toggle "modo demo offline" — usa JSON local. Frase: "lo importante son las señales, no el ping de la red." |
| Agente devuelve JSON malformado | Caer al fallback determinista (siempre disponible). Frase: "lo que ven es la versión sin IA del mismo flujo — lo dejamos así para no depender del modelo en vivo." |
| App no levanta | Reproducir el video de respaldo en el pendrive. Frase: "preferimos mostrar el video para no castigarles con el WiFi." |
| Pregunta inesperada en Q&A | Pasar a quien tiene el ángulo: técnica → Milton, negocio → Adolfo, legal → Renzo, UX → Alejandra. |
| Se acaba el tiempo en pitch | Cortar limpio. La frase de cierre del Bloque 5 vale más que terminar el bloque 4. |

---

## 7. Checklist antes de subir al pitch

- [ ] Demo Paula funciona end-to-end (probada en los últimos 30 min).
- [ ] Botón "modo demo offline" probado.
- [ ] Simulación con slider 20% probada.
- [ ] Pasaporte imprimible probado (`window.print()` no rompe layout).
- [ ] `CartaModal` genera al menos un texto razonable.
- [ ] Video de respaldo en pendrive **y** en Drive del equipo.
- [ ] Capturas del Pasaporte y de un Espejo en PDF.
- [ ] Cartulina con 5 frases clave (cue cards).
- [ ] Roles confirmados: quién dice qué bloque, quién hace clic.

---

## 8. Tono y reglas en escena

- **Hablar a Paula, no a los jueces.** El público se convence cuando ve que
  hablamos del usuario, no del producto.
- **No usar tecnicismos sin traducir.** "MCP", "agentes", "JSON" se mencionan
  una vez y se explican en la misma frase.
- **No prometer más de lo que la app hace.** "No predecimos aprobación de
  crédito" se dice explícitamente. Eso da credibilidad.
- **Frases cortas.** Mejor 3 frases simples que 1 frase compuesta.
- **Sin disculpas** ("perdón si esto falla…"). Si algo falla, decir el plan
  de contingencia con confianza.

---

## 9. Mensaje cierre (para que se nos quede en la cabeza)

> **"Espejo de Datos. La cartola que te evalúa en silencio, ahora
> también te explica."**

Esa frase puede ir al final del video, en la última diapositiva, y como cierre
del pitch.
