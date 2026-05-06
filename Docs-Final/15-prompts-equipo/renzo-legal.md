# Prompts para Renzo — Legal / Datos personales / Legitimidad regulatoria

> Renzo aporta el marco legal, valida disclaimers, define las plantillas de
> carta y prepara la línea de privacidad para el pitch. Estos prompts son
> para usar Claude Code (o Claude.ai directo) como apoyo de redacción y
> revisión legal.

---

## Prompt 0 — Contexto

```text
Voy a trabajar en la dimensión legal y de protección de datos del proyecto
Espejo de Datos para el Claude Impact Lab Chile 2026.

Contexto del proyecto (resumen):
- Espejo toma cartolas bancarias y devuelve un "espejo financiero ciudadano".
- NO es scoring crediticio. NO es asesoría legal/financiera regulada.
- Cartola se procesa en memoria y se descarta. No se guarda nada.
- Equipo: Milton (técnico), Alejandra (frontend), Adolfo (negocio), Renzo (yo, legal).

Mi rol:
- Validar disclaimers en la UI.
- Definir 1-2 señales legales y plantilla de carta de reclamo.
- Hablar 30-45s en el pitch sobre privacidad y legitimidad regulatoria.
- Anticipar Q&A legal.

Marco legal vigente / próximo:
- Ley 19.628 (datos personales, vigente).
- Ley 21.719 (nueva LPDP, promulgada, vigencia plena 1 dic 2026).
- Ley 21.521 (Fintech, vigente).
- Ley 19.496 + 20.555 + 21.398 (consumidor financiero).

Reglas:
- No prometer cumplimiento total ("cumplimos con [ley]").
- Sí describir qué reglas concretas seguimos (minimización, finalidad, etc.).
- No citar artículos específicos en cartas si no estoy 100% seguro.
- Tono claro, sin jerga jurídica para textos visibles al usuario.

¿Listo?
```

---

## Prompt 1 — Marco legal y de datos del proyecto

```text
Tarea: redactar un documento corto (1-2 páginas) con el marco legal y de
datos del proyecto.

Contexto:
- Audiencia: equipo + jurado del Lab + posible stakeholder B2G.
- Debe explicar: qué leyes aplican, qué hacemos, qué NO hacemos,
  cómo nos alineamos con la próxima Ley 21.719.

Tarea:
1) Estructura propuesta (5-7 secciones):
   - Marco legal aplicable (Chile, mayo 2026).
   - Principios de tratamiento que seguimos (minimización, finalidad,
     proporcionalidad, seguridad).
   - Qué hace Espejo y qué NO hace.
   - Por qué no requerimos registro CMF (RPSF).
   - Cómo nos alineamos con Ley 21.719.
   - Riesgos identificados y mitigaciones.
   - Disclaimers visibles al usuario.
2) Tono: profesional pero claro. Sin jerga.
3) Formato: markdown, listo para pegar en espejo-marco-legal-y-datos.md.
4) Cita normas por nombre (Ley 21.521, NCG 514, Ley 21.719) sin entrar en
   artículos a menos que estés seguro.
```

---

## Prompt 2 — Disclaimers de UI

```text
Tarea: validar y reescribir los disclaimers que aparecen en la UI.

Contexto:
- Disclaimers actuales (versión borrador):
  - Aviso de privacidad antes de subir cartola: "Tu cartola se procesa en
    memoria..."
  - Footer de toda la app: "Espejo de Datos es educativo..."
  - Disclaimer en CartaModal: "Este borrador es una ayuda inicial..."
  - Disclaimer en Pasaporte: "Versión demo — no es documento oficial..."
- Reglas en Docs-Final/08-privacidad-y-datos.md §6 y §7.
- Audiencia: usuario común, no abogado.

Tarea:
1) Para cada disclaimer:
   - Versión actual.
   - 2 versiones mejoradas (más claras + más cortas).
   - Razón del cambio.
2) No usar jerga ("PII", "data minimization"). Usar palabras simples.
3) No prometer cumplimiento absoluto. Decir qué hacemos concretamente.
4) Asegurar que el aviso de privacidad antes de subir archivos sea
   visualmente prominente — no enterrado al final.
```

---

## Prompt 3 — Esqueleto de plantilla de carta (tasa cercana al máximo legal)

```text
Tarea: esqueleto + reglas para la plantilla de carta de
"sig_tasa_cercana_tmc".

Contexto:
- Esto es lo que LetterGeneratorAgent (Haiku 4.5) toma como base.
- El agente recibe input { tipoProblema, nombreInstitucion, tipoProducto,
  segmento } y devuelve un texto de carta.
- Yo defino las restricciones del prompt — no escribo el código del agente
  (eso es Milton).

Tarea:
1) Esqueleto de la carta en 4-6 párrafos:
   - Saludo + identificación.
   - Descripción del producto y motivo.
   - Solicitud concreta (revisión de tasa).
   - Marco legal genérico aplicable (sin artículos específicos).
   - Plazo de respuesta (10 días hábiles).
   - Despedida.
2) Reglas para el agente (qué SÍ y qué NO hacer):
   - SÍ usar primera persona.
   - SÍ tono formal pero claro.
   - SÍ pedir respuesta razonable.
   - NO citar artículos específicos.
   - NO prometer resultados.
   - NO inventar tasas.
3) Disclaimer de la carta (que va al inicio o al final del texto generado):
   "Este es un borrador. Revísalo con un abogado, con SERNAC o con un
   programa de asesoría gratuita antes de enviarlo."
4) Formato: markdown listo para que Milton lo incorpore al system prompt.
```

---

## Prompt 4 — Q&A legal esperable

```text
Tarea: lista de preguntas legales/regulatorias que pueden hacer los
jueces, con respuestas cortas (2-3 frases cada una).

Contexto:
- Tono: confiado, no defensivo.
- Si la pregunta excede mi conocimiento, decir "no soy especialista en X,
  pero la mitigación que tenemos es Y".

Tarea:
1) Genera 10-12 preguntas + respuestas:
   - "¿Cómo manejan los datos personales de la cartola?"
   - "¿Esto requiere registro CMF (RPSF)?"
   - "¿Qué pasa con la Ley 21.719 que entra en diciembre?"
   - "¿Y si un banco usa esto para perfilar de más?"
   - "¿Cómo evitan discriminación algorítmica?"
   - "¿Esta carta tiene valor legal?"
   - "¿Qué pasa si Anthropic guarda los datos enviados a la API?"
   - "¿Cumplen GDPR? ¿Cumplen Ley 19.628?"
   - "¿Quién es responsable si la carta genera un problema?"
   - "¿Por qué dicen que no es asesoría legal? ¿Y si igual se confunde?"
2) Marca cuáles son las 4 más probables.
3) Para las más probables, dame 2 versiones de respuesta (la que diría
   yo + una alternativa más corta).
```

---

## Prompt 5 — Mi bloque del pitch (30-45 segundos)

```text
Tarea: pulir mi bloque de cierre del pitch.

Contexto:
- Hablo justo antes o junto con Adolfo en los últimos 30 segundos.
- Debo cubrir: privacidad por diseño + alineamiento con Ley 21.719 +
  legitimidad regulatoria.

Texto base:
"La cartola es el dato más sensible del usuario. La procesamos en memoria
y la descartamos. No la guardamos, no la vendemos. Esto no solo cumple
la Ley 21.719 que entra en diciembre — es practicar lo que el SFA
exigirá mañana."

Tarea:
1) Mejora ese párrafo a 30-45 segundos exactos (~75 palabras).
2) Mantén el orden: privacidad → ley → narrativa de "anticipación al SFA".
3) Tono: convencido pero no arrogante. No "cumplimos todo", sino "diseñamos
   para".
4) Dame 2 versiones para elegir.
```

---

## Prompt 6 — Revisión de copy con riesgo legal

```text
Tarea: revisar todos los textos visibles en la UI y marcar los que
tengan riesgo legal/regulatorio.

Contexto:
- Yo te paso los textos extraídos de la app (landing, /analizador,
  modal carta, Pasaporte, mensajes de error).
- Quiero saber: cuáles son seguros, cuáles tienen riesgo, qué cambiar.

Tarea:
1) Para cada texto que yo te pegue:
   - Marcar como ✅ seguro / ⚠️ riesgo bajo / 🚫 riesgo alto.
   - Si es ⚠️ o 🚫: explicar el riesgo en 1-2 frases.
   - Proponer reescritura.
2) Riesgos típicos a buscar:
   - Promesas de aprobación de crédito ("el banco te va a aprobar").
   - Verbos que sugieran obligación financiera ("debes ahorrar X").
   - Citas de artículos no verificados.
   - Promesas absolutas de seguridad ("100% seguro", "sin riesgo").
   - Tono que sugiera asesoría legal individual.
3) Formato: lista numerada con el texto, marca y propuesta.
```

---

## Prompt 7 — Extensiones futuras compatibles con tu expertise

```text
Tarea: pensar 2-3 extensiones futuras de Espejo de Datos que conecten con
mi área de expertise (cumplimiento Ley 21.719, riesgo de datos, derecho
digital).

Contexto:
- Esto NO se construye en el Lab.
- Es para mencionar en el pitch o Q&A si surge "¿qué viene después?".
- Quiero ideas que sean viables, no fantásticas.

Tarea:
1) Genera 3 ideas:
   - Idea A: integración con evaluador de cumplimiento Ley 21.719 para
     pymes que adopten Espejo.
   - Idea B: derecho a portabilidad de datos personales (ARCO+) integrado
     con la app.
   - Idea C: alertas pro-activas cuando una empresa cambia sus T&C
     (relacionado con consentimiento informado).
2) Para cada idea: 3-4 frases que explican qué hace + por qué encaja con
   Espejo + qué se necesitaría para construirla.
3) Tono: visionario pero realista.
```

---

## Reglas para usarme bien con Claude Code

1. **Siempre pega el contexto** (Prompt 0) al inicio de la sesión.
2. **No pidas opiniones jurídicas vinculantes** — solo análisis y propuestas.
3. **Si Claude cita un artículo específico**, valídalo o pídelo con fuente.
4. **Para textos de la UI**, pide siempre 2 versiones — eliges la mejor.
5. **Para Q&A**, ensáyalo antes en voz alta para validar fluidez.
6. **No firmes nada como "asesoría legal"** — somos un equipo del Lab.
