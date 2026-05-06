# Prompts para Adolfo — Negocio / Casos de uso / Adopción

> Adolfo redacta los casos de uso, el roadmap de adopción, las frases de
> pitch comercial y la Ficha Cívica. Estos prompts están pensados para
> usar Claude Code (o Claude.ai directo) como apoyo de redacción y
> structurado de ideas.

---

## Prompt 0 — Contexto

```text
Voy a trabajar en la dimensión de negocio y adopción del proyecto Espejo
de Datos para el Claude Impact Lab Chile 2026.

Contexto del proyecto (resumen):
- Espejo de Datos toma una cartola bancaria y devuelve un "espejo financiero
  ciudadano": resumen, señales, lentes Banco/Fintech/Estado, simulación,
  pasaporte y carta de reclamo.
- Línea 01: Inclusión Financiera. Categoría AI Builder.
- Segmento: emprendedoras de primera generación en regiones (Paula).
- Canal de adopción primario: B2G (CMF Educa, SERNAC, municipios).
- Stack: Next 14 + MCP Python + 2 agentes Claude.
- Equipo: Milton (técnico), Alejandra (frontend/UX/líder), Adolfo (yo,
  negocio), Renzo (legal).

Mi rol:
- Redactar casos de uso y narrativa de adopción.
- Preparar respuestas de Q&A de modelo de negocio.
- Liderar la Ficha Cívica para el Lab (deadline 7 mayo 10:00).

Reglas:
- No vender humo: la app SÍ hace lo que decimos, no lo que quisiéramos.
- Lenguaje claro, no jerga corporativa.
- No prometer modelo de negocio: el Lab evalúa impacto cívico, no startup.

¿Listo?
```

---

## Prompt 1 — Casos de uso concretos

```text
Tarea: redactar 2-3 casos de uso concretos para Espejo de Datos en
contexto B2G chileno.

Contexto:
- Audiencia: jueces del Lab + post-Lab posibles stakeholders (CMF Educa,
  SERNAC, municipios).
- Cada caso debe tener: institución, problema concreto, cómo Espejo
  resuelve, qué se mide.

Tarea:
1) Genera 3 casos de uso, cada uno en 4-5 frases:
   - Caso A: CMF Educa quiere expandir su programa de educación financiera
     a emprendedoras en regiones.
   - Caso B: SERNAC quiere reducir reclamos por desinformación financiera.
   - Caso C: Municipio con programa de fomento productivo (ej. Sercotec
     regional) quiere herramienta para sus talleres.
2) Para cada caso:
   - Problema en 1 frase.
   - Cómo Espejo encaja (con qué pantalla concreta).
   - Qué se mide (1-2 KPIs).
   - Disclaimer si aplica.
3) Formato: markdown listo para pegar en casos-uso-espejo.md.
```

---

## Prompt 2 — Roadmap de adopción 30/60/90

```text
Tarea: roadmap de adopción post-Lab a 30, 60, 90 días.

Contexto:
- Tras el Lab, Espejo necesita un plan claro y realista.
- Premio: 60 días en AI Fintech Sandbox Chile (si quedamos top 6).
- El equipo es de 4 personas part-time.

Tarea:
1) Genera un roadmap en formato tabla:
   - 30 días: piloto micro con 10-20 emprendedoras + 1 stakeholder B2G
     identificado (mail enviado).
   - 60 días: refinamiento + primera reunión con CMF Educa o SERNAC.
   - 90 días: integración con sandbox CMF (si está disponible) + extensión
     piloto.
2) Para cada hito:
   - Quién lidera (yo, Adolfo).
   - Qué se entrega.
   - Qué se mide.
   - Riesgos.
3) Sé realista: 4 personas part-time, no 40 a tiempo completo.
4) Formato: markdown listo para pegar en roadmap-adopcion.md.
```

---

## Prompt 3 — Frases de pitch comercial

```text
Tarea: 5-7 frases cortas tipo "pitch corto" para usar en Q&A.

Contexto:
- Audiencia: jurado técnico + ejecutivos de fintech + reguladores.
- Espejo NO es scoring crediticio, NO es asesoría regulada, SÍ es
  educación + transparencia.
- Quiero frases con "punch" que pueda decir en 5-10 segundos cada una.

Reglas:
- Cero jerga.
- No prometer resultados.
- Cada frase autocontenida.

Tarea:
1) Genera 7-10 frases candidatas.
2) Para cada una, di en qué contexto la usaría (Q&A técnica, Q&A negocio,
   apertura de pitch, etc.).
3) Dos ejemplos de tono:
   - "Esto convierte un 'no' bancario en una conversación educada sobre el
     'cómo sí'."
   - "Es un perfil crediticio explicable para humanos, no solo para comités
     de riesgo."
```

---

## Prompt 4 — Ficha Cívica del Lab

```text
Tarea: redactar la Ficha Cívica para el portal del Lab.

Contexto:
- Deadline: 7 mayo 10:00.
- Campos esperados: línea temática, problema ciudadano, segmento, propuesta
  de valor, canal, datos usados, stakeholder identificado, equipo.
- Detalle en Docs-Final/12-entregables-rubrica.md §1.1.
- Plantilla del Lab dice: "Para [segmento específico] que [problema], [tu
  solución] [qué hace con IA] para que [beneficio humano] — vía [canal]."

Tarea:
1) Llena cada campo con texto listo para pegar:
   - Línea: 01 — Inclusión Financiera.
   - Problema: 5 millones de chilenos con derechos financieros que no pueden
     ejercer porque la regulación vive en PDFs densos. Específicamente,
     emprendedoras de regiones con cuentas mixtas no entienden cómo el
     banco/fintech/Estado las ven.
   - Segmento: emprendedoras 25-45 años en regiones que venden por redes
     sociales y mezclan cuenta personal con cuenta de negocio.
   - Propuesta de valor: usar la plantilla del Lab.
   - Canal: B2G — CMF Educa, SERNAC, Sercotec regional.
   - Datos: cartola del usuario (en memoria, no se guarda) + APIs públicas
     (mindicador.cl: UF, IPC, TPM).
   - Stakeholder: identificado + plan de contacto post-Lab.
   - Equipo: 4 personas, perfiles complementarios.
2) Cada campo en 2-4 frases máximo.
3) Tono: claro, sin jerga, citable.
```

---

## Prompt 5 — Storytelling para el pitch (mi bloque)

```text
Tarea: pulir mi bloque del pitch (30-45 segundos).

Contexto:
- Mi bloque va al final del pitch (ver Docs-Final/11-demo-y-pitch.md §3 Bloque 5).
- Debo cubrir: impacto ciudadano (25% rúbrica), canal B2G, plan post-Lab.
- Tono: convencido, claro, no hard-sell.

Texto base (lo que tengo):
"Esto se piloteba con CMF Educa o SERNAC en 60 días. No es una startup que
pide ronda — es una herramienta cívica con stakeholder clarísimo..."

Tarea:
1) Mejora ese párrafo a 30-45 segundos exactos (cuento mentalmente: ~75
   palabras).
2) Mantén la estructura: rúbrica → segmento → canal → plan → cierre.
3) Dame 2 versiones para que elija.
4) Si una versión cita un dato (ej. "5 millones de chilenos"), asegúrate
   que sea verificable.
```

---

## Prompt 6 — Q&A esperable de negocio

```text
Tarea: lista de preguntas posibles del jurado sobre modelo de negocio,
con respuestas cortas (2-3 frases cada una).

Contexto:
- Tono: confiado, no defensivo.
- Si una pregunta no tiene buena respuesta, decir "no tenemos métrica/dato
  de eso aún" en vez de inventar.

Tarea:
1) Genera 10-12 preguntas + respuestas en formato:
   P: ...
   R: (2-3 frases)
2) Cubre:
   - Modelo de ingresos.
   - Quién paga en producción.
   - Escala (de 100 a 1M usuarios).
   - Diferenciación (vs Destacame, Fintual, CMF Educa).
   - Por qué B2G y no B2C.
   - Riesgo legal/regulatorio.
   - Plan de exit / sostenibilidad.
   - Métricas de éxito.
3) Marca cuáles son las 3 más probables (que pidan los jueces).
```

---

## Prompt 7 — Mensaje a CMF Educa (para post-Lab)

```text
Tarea: borrador de mail para enviar el lunes 11 mayo a CMF Educa o SERNAC.

Contexto:
- Acabo de participar en el Claude Impact Lab Chile 2026 con Espejo de
  Datos.
- Quiero pedir una reunión de 30 min para presentar la herramienta.
- Tono: profesional, directo, sin venta dura.

Tarea:
1) Asunto: máximo 80 caracteres, claro.
2) Cuerpo: 4-6 párrafos cortos.
   - Quién soy + contexto del Lab.
   - Qué construimos en 1 frase.
   - Por qué les puede interesar (educación financiera ciudadana).
   - Pedido concreto (reunión 30 min).
   - Adjunto: link al video del Lab + 1 captura del Pasaporte.
3) No prometer cosas ("nuestra app va a resolver X"). Sí ofrecer mostrar.
4) Firma profesional, mi rol (consultoría/innovación/RPA).
```

---

## Prompt 8 — Mini-guion "ejecutivo viendo Espejo por primera vez"

```text
Tarea: mini-guion (1 página) desde el punto de vista de un ejecutivo de
banco viendo Espejo por primera vez.

Contexto:
- Este guion es para mi mejor ensayo del pitch.
- Quiero anticipar qué dudas tendría una persona del lado financiero
  tradicional.

Tarea:
1) Imagina a Carla, gerente de inclusión financiera de un banco mediano,
   viendo Espejo por primera vez.
2) Escribe sus pensamientos en orden (5-8 párrafos cortos):
   - "Otro dashboard más..."
   - "¿Por qué hay tres lentes?"
   - "Espera, esto no me reemplaza..."
   - "Ah, esto es educación..."
   - etc.
3) Termina con: ¿qué le diría a su equipo después de salir de la sala?
4) Esto es para mí — no es contenido del producto.
```

---

## Reglas para usarme bien con Claude Code

1. **Siempre pega el contexto del proyecto** (Prompt 0) al inicio.
2. **Pide texto editable**, no diseño visual (eso es de Alejandra).
3. **Pide 2 versiones** cuando sea texto importante (pitch, Ficha Cívica).
4. **Si Claude inventa datos**, pídele fuente. Si no la tiene, descarta.
5. **No pidas modelos de negocio fantásticos**. El Lab evalúa impacto, no
   pitch de startup.
