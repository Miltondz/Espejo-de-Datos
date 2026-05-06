# 10 — Roles y responsabilidades del equipo

> Equipo de 4: Milton (técnico), Alejandra (líder + frontend + UX),
> Adolfo (negocio), Renzo (legal). Documenta foco antes / durante / si está
> desocupado.

---

## 1. Resumen ejecutivo

| Persona | Foco principal | Habla en pitch sobre |
|---|---|---|
| Milton | Arquitectura, backend, MCP, agentes Claude | Capa IA / MCP, decisiones técnicas |
| Alejandra | Líder de equipo + frontend Next + UX | Experiencia de Paula, decisiones de UX |
| Adolfo | Casos de uso, narrativa de adopción | Cómo se implementa esto en una organización real |
| Renzo | Marco legal, datos personales, plantilla de carta | Privacidad, legitimidad regulatoria |

---

## 2. Milton — Arquitecto / Backend / IA

### Antes del Lab (sin código)

- Validar `Docs-Final/` con el equipo.
- Leer documentación: FastMCP, `@anthropic-ai/sdk`, `@modelcontextprotocol/sdk`,
  mindicador.cl.
- Tener el **Servidor MCP Python** memorizado mentalmente (puede leer el
  archivo `Docs-Final/05-mcp-financial-mirror.md` durante el Lab).
- Decidir cómo va a montar el cliente MCP en el backend Next (stdio vs HTTP).
- Probar la API key del Lab (cuando llegue).

### Durante el Lab (qué construye)

- Día 1 mañana: setup Next, types, DAL mock, `/api/analyze` modo demo, MCP base.
- Día 1 tarde: `MirrorBuilderAgent` integrado.
- Día 2 mañana: `ActionPlannerAgent` + `/api/simulate`.
- Día 2 tarde: `LetterGeneratorAgent` + `/api/generar-carta`. Pulido seguridad.

### Si está desocupado

- Mejorar reglas en `extract_signals` (más matices a las señales).
- Tunear prompts de agentes según logs reales.
- Escribir 2–3 frases técnicas listas para responder en Q&A.
- Capturar buenos screenshots de consola Claude.

### Su rol en el pitch

- Conduce el "flow" de la demo (en pantalla / video).
- Explica en 30–45 segundos: "Esto corre con Next.js, Sonnet 4.6, un MCP en
  Python con 6 tools y dos agentes que orquestan el espejo y las simulaciones.
  No es un mock — es agéntico de verdad."

---

## 3. Alejandra — Líder + Frontend + UX

### Antes del Lab (sin código)

- Liderar la reunión del 5 mayo: confirmar roles y plan.
- Crear el tablero (Trello/Notion) con columnas Backlog / En curso / Listo.
- Definir el "objetivo demo-ready" de cada día.
- Diseñar wireframes en Figma (o lápiz) de:
  - landing,
  - `/analizador` con todos los componentes,
  - estados loading / error.
- Leer `07-frontend-next.md` y los fixtures JSON.
- Acordar el copy ciudadano base con el equipo (revisar `02-producto-y-segmento.md`).

### Durante el Lab (qué construye)

- Día 1 mañana: layout, landing, `/analizador` con JSON local, componentes
  vacíos.
- Día 1 tarde: conectar a `/api/analyze`, pulir todos los componentes con
  Tailwind, agregar `PrivacyBadge` y disclaimers.
- Día 2 mañana: `SimulationPanel` conectado, `@media print` para pasaporte.
- Día 2 tarde: `CartaModal`, QA manual exhaustivo, README del repo.

### Como líder

- Stand-ups cada 3–4 horas (5 min): qué hicimos / hacemos / bloquea.
- Decisión final si hay que recortar features (escala de prioridad en
  `09-plan-48h.md` §3.3).
- Asegurar que el equipo entrega Ficha Cívica antes de las 10:00 del 7 mayo.

### Si está desocupada

- QA en Chrome / Safari / Firefox / mobile.
- Ajustar copy ciudadano de los textos (con ayuda del skill
  `espejo-copy-and-narrative-writer`).
- Documentar checklist QA: "si algo falla en demo, hacer X".

### Su rol en el pitch

- Habla 30–45 segundos sobre **la experiencia de Paula**: "Lo que ven es lo
  que ve Paula. Acá ve sus señales en lenguaje simple, ahí ve cómo la mira
  un banco distinto a una fintech, y aquí simula qué pasaría si baja el uso
  de su tarjeta. Todo en menos de 3 minutos sin abrir un PDF de la CMF."

---

## 4. Adolfo — Negocio + casos de uso + adopción

### Antes del Lab (sin código)

- Redactar `casos-uso-espejo.md` con 2–3 escenarios concretos:
  - **Banco / cooperativa** que quiere explicar criterios de riesgo a clientes
    nuevos.
  - **Fintech** que quiere educar antes de ofrecer crédito.
  - **Servicio público / municipio / CMF Educa** que quiere un "Pasaporte
    Financiero" ciudadano.
- Redactar `roadmap-adopcion.md` con plan 30/60/90 días post-Lab:
  - 30: piloto con 10–20 emprendedoras + un stakeholder B2G identificado.
  - 60: refinamiento + primer contacto formal CMF Educa o SERNAC.
  - 90: integración con sandbox CMF si está disponible; pilot extendido.
- Preparar 5–7 frases tipo pitch corto:
  - "Esto convierte un 'no' bancario en una conversación educada sobre el
    'cómo sí'."
  - "Es un perfil crediticio explicable para humanos, no solo para comités
    de riesgo."

### Durante el Lab (qué hace)

- Día 1: revisar la app en construcción y ajustar narrativa para que **calce
  con lo que sí hace** (sin vender humo). Coordinar con Alejandra dónde
  insertar mensajes de caso de uso (en `/dashboard` o `/educacion`).
- Día 2: practicar su intervención de 30–45s. Preparar respuestas a:
  - "¿Quién pagaría por esto?"
  - "¿Cuál es el modelo de ingresos en producción?"
  - "¿Cómo escala en una organización compleja?"

### Si está desocupado

- Mini guion del pitch desde el punto de vista de un ejecutivo de banco viendo
  Espejo por primera vez ("¿qué le sorprendería?").
- Feedback de UI con Alejandra ("este botón confunde", "este texto no se
  entiende").
- Identificar 1 stakeholder concreto a contactar el lunes 11 mayo (CMF
  Educa, SERNAC, ASECH).

### Su rol en el pitch

- Habla 30–45 segundos sobre **adopción**: "Esto se piloteba con CMF Educa
  o SERNAC en 60 días. No es una startup que pide ronda — es una herramienta
  cívica con stakeholder clarísimo. La rúbrica del Lab pesa 25% impacto
  ciudadano: nuestro segmento son emprendedoras de regiones, nuestro canal
  es B2G, y tenemos plan de 30/60/90 días escrito."

---

## 5. Renzo — Legal + datos personales + legitimidad regulatoria

### Antes del Lab (sin código)

- Redactar `espejo-marco-legal-y-datos.md` (puede ser una versión condensada
  de `Docs-Final/08-privacidad-y-datos.md`):
  - Principios de tratamiento (minimización, finalidad, seguridad).
  - Qué hace y qué NO hace Espejo.
  - Alineamiento con Ley 21.719 (vigencia plena dic 2026).
- Definir 1–2 **señales legales** priorizadas (ya están en el catálogo:
  `sig_tasa_cercana_tmc`).
- Esquema de plantillas de carta:
  - Tasa cercana al máximo legal.
  - (Opcional) Cobro no autorizado / portabilidad de crédito.
- Disclaimers para UI:
  - en `CartolaUpload`,
  - al pie del Pasaporte,
  - dentro de `CartaModal`.

### Durante el Lab (qué hace)

- Día 1: revisar todos los textos sensibles que Alejandra ponga en la UI.
  Validar el aviso de privacidad antes de cualquier subida de archivo.
- Día 2: ajustar el contenido del Pasaporte (que no prometa "garantías") y
  de las cartas. Ayudar a Adolfo con la Ficha Cívica.

### Si está desocupado

- Q&A legal escrita con respuestas de 2–3 frases:
  - "¿Y si un banco usa esto para perfilar de más?"
  - "¿Cómo evitan discriminación algorítmica?"
  - "¿Esto requiere registro CMF?"
  - "¿Qué pasa con la Ley 21.719?"
- Pensar extensiones futuras: integrar evaluadores de cumplimiento Ley 21.719
  para empresas (su área de expertise).

### Su rol en el pitch

- Habla 30–45 segundos sobre **datos responsables y legitimidad**: "La
  cartola es el dato más sensible del usuario. La procesamos en memoria y
  la descartamos. No la guardamos, no la vendemos. Esto no solo cumple la
  Ley 21.719 que entra en vigencia en diciembre — es practicar lo que el
  SFA exigirá mañana. Y nuestras señales legales no son scoring: son
  indicios con llamado a profesionales."

---

## 6. Tabla resumen (para imprimir / pegar en el muro del Lab)

| Persona | Pre-Lab (5 mayo) | Día 1 mañana | Día 1 tarde | Día 2 mañana | Día 2 tarde | Pitch |
|---|---|---|---|---|---|---|
| Milton | Validar docs, leer SDKs | Setup Next, types, DAL, MCP base | MirrorBuilderAgent + `/analyze` real | ActionPlannerAgent + `/simulate` | LetterGenerator + seguridad | Capa IA/MCP |
| Alejandra | Tablero + wireframes Figma | Layout, landing, `/analizador` mock | Pulir UI, conectar `/analyze` | SimulationPanel + Pasaporte | CartaModal + QA + README | UX de Paula |
| Adolfo | Casos de uso + roadmap + frases | Apoyar copy, casos de uso en `/dashboard` | Ajustar narrativa con app real | Practicar 30–45s | Apoyar grabación video | Adopción |
| Renzo | Marco legal + esquema cartas | Disclaimers, aviso privacidad | Validar copy sensibles | Practicar 30–45s | Validar Pasaporte y cartas | Privacidad |

---

## 7. Reglas de equipo

1. **Una persona, una tarea, un objetivo.** Si te bloquea otra cosa, pásala
   a Alejandra (líder).
2. **No mover el contrato de datos sin acuerdo.** `04-contrato-de-datos.md` manda.
3. **No mezclar áreas en una petición a Claude Code.** Usar los 6 skills
   de `14-claude-code-skills.md`.
4. **Stand-ups cortos.** 5 minutos. Lo que hiciste, lo que harás, lo que bloquea.
5. **Cuando algo falle, no tapar — comunicar.** Hay fallback en cada capa.
