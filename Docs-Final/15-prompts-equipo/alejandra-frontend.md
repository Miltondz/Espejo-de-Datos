# Prompts para Alejandra — Frontend / UX / Liderazgo

> Conjunto de prompts listos para Claude Code, para construir el frontend
> Next.js 14 + Tailwind durante el Lab. Optimizados para que puedas usarlos
> casi tal cual.
>
> Asume que Milton ya creó el proyecto y los tipos. Tu trabajo se enfoca
> en `app/`, `components/espejo/` y la experiencia de Paula.

---

## Prompt 0 — Cargar contexto

```text
Voy a trabajar en el frontend del proyecto Espejo de Datos durante el
Claude Impact Lab Chile 2026.

Contexto:
- CLAUDE.md está en la raíz del repo.
- Docs-Final/07-frontend-next.md tiene el detalle de rutas y componentes.
- Docs-Final/04-contrato-de-datos.md define EspejoResponse (lo que mi UI
  consume).
- Stack: Next 14 App Router + TypeScript + Tailwind. Sin librerías de UI
  pesadas.
- Yo soy Alejandra, líder de equipo + frontend + UX.
- Milton se encarga del backend, MCP y agentes. Yo NO toco eso.

Reglas:
1. Mobile-first (360px+).
2. Lenguaje ciudadano en todo lo visible.
3. No prometer cosas ("el banco te aprobará").
4. Tailwind sin librerías extra.
5. Plan primero, código después.

¿Listo? Confirma que entendiste y dime si necesitas leer algún archivo.
```

---

## Prompt 1 — Layout base + landing

```text
Skill: espejo-frontend-builder.

Situación:
- Proyecto Next 14 recién creado por Milton.
- /app/page.tsx tiene boilerplate. /app/layout.tsx también.

Objetivo:
- Crear el layout global con header (logo + navegación), main, footer con
  disclaimer.
- Crear la landing en / con CTA grande "Ver mi Espejo" → /analizador.

Tarea:
1) Plan de 3-5 pasos.
2) Implementa app/layout.tsx con el layout descrito en Docs-Final/07-frontend-next.md §3.
3) Implementa app/page.tsx con landing minimalista:
   - h1 "Espejo de Datos"
   - subtítulo: "La cartola que te evalúa en silencio, ahora también te explica."
   - 2-3 párrafos de explicación
   - botón grande hacia /analizador
4) Footer con: "Espejo de Datos es educativo. No es asesoría financiera ni
   legal. Tus datos no se guardan. © 2026 · Construido para Claude Impact Lab."
```

---

## Prompt 2 — `/analizador` con JSON local (mock)

```text
Skill: espejo-frontend-builder.

Situación:
- Layout base listo.
- En /data hay demo-espejo-paula.json con un EspejoResponse completo.
- Quiero la página /analizador armada con componentes reales pero alimentados
  por el JSON local (todavía no llamamos a la API).

Objetivo:
- /analizador renderiza ProfileSummaryCard, SignalsGrid, InstitutionLensesTabs,
  SimulationPanel — todos consumiendo el JSON local.

Tarea:
1) Plan: archivos a crear en components/espejo/.
2) Crea cada componente con sus props tipadas según types/espejo.ts.
3) En app/analizador/page.tsx, importa el JSON local y pasa las partes a cada
   componente.
4) Estilo Tailwind simple: cards con shadow, padding generoso, colores por
   tipo de señal (positiva = emerald-100, ambigua = yellow-100, riesgo = red-100,
   sin_datos = gray-100).
5) Asegúrate de que se ve bien en mobile (360px) y desktop.
```

---

## Prompt 3 — `CartolaUpload` y conexión a `/api/analyze`

```text
Skill: espejo-frontend-builder.

Situación:
- /analizador funciona con JSON local.
- Milton ya implementó POST /api/analyze (modo demo). Acepta:
  { mode: "demo", demoId: "paula" | "luis", segmento: "emprendedora" }
  → devuelve EspejoResponse.

Objetivo:
- Componente CartolaUpload con:
  - botón "Probar con demo Paula" (más visible)
  - botón "Probar con demo Luis" (secundario)
  - drop zone para PDF/Excel (preparada para multipart, aunque el backend
    real puede aún no soportarlo)
- /analizador usa CartolaUpload para cargar datos en lugar del JSON local.
- Maneja loading, error, empty.

Tarea:
1) Plan.
2) Implementa CartolaUpload con props { onAnalyzed, onError, setLoading }.
3) Actualiza /analizador para usar useState + CartolaUpload.
4) Aviso de privacidad visible justo arriba del componente: el copy exacto
   está en Docs-Final/08-privacidad-y-datos.md §6.
5) Componente PrivacyBadge pequeño persistente: "🔒 Procesado en memoria · Sin guardar tus datos".
```

---

## Prompt 4 — `SimulationPanel` con slider

```text
Skill: espejo-frontend-builder.

Situación:
- El espejo se carga vía /api/analyze.
- Milton ya implementó POST /api/simulate. Recibe:
  { segmento, goal, hypothesis: { reducirUsoCupoPct }, financialProfile?, signals? }
  → devuelve { simulationSuggestion }.

Objetivo:
- SimulationPanel con:
  - slider "¿Qué pasa si bajo mi uso de cupo?" (0-30, default 20)
  - botón "Ver impacto"
  - render de simulationSuggestion (descripción acción + lista señales que
    mejoran + explicación)

Tarea:
1) Plan.
2) Implementa SimulationPanel con useState para hypothesis y suggestion.
3) Llamada fetch a /api/simulate con manejo de loading/error.
4) Render limpio del resultado, con destacado visual.
5) Disclaimer pequeño abajo: "Esta simulación es educativa. No garantiza
   decisiones de bancos, fintech o el Estado."
```

---

## Prompt 5 — Pasaporte imprimible (`@media print`)

```text
Skill: espejo-frontend-builder.

Situación:
- /analizador completo y funcional.
- Quiero un botón "Descargar mi Pasaporte Financiero" que dispare
  window.print() y produzca un layout de 1 página apto para PDF.

Objetivo:
- PasaporteButton (componente).
- CSS @media print en globals.css que oculte navegación, sliders, botones,
  modales, y muestre solo: encabezado del pasaporte, ProfileSummaryCard,
  3-5 señales clave, mini-bloques de los 3 lenses, sello de "datos macro
  oficiales", disclaimers.

Tarea:
1) Plan: dónde van los estilos, qué clases marcar como .no-print.
2) Implementa PasaporteButton.
3) Añade el CSS @media print con el detalle de Docs-Final/13-easy-wins.md §1.3.
4) Marca los componentes interactivos con className="no-print".
5) Prueba: Cmd+P en /analizador debería mostrar la vista correcta.
```

---

## Prompt 6 — Modal de carta

```text
Skill: espejo-frontend-builder.

Situación:
- En SignalsGrid, las señales con esLegal: true muestran un botón pequeño
  "Generar borrador de carta".
- Milton ya tiene POST /api/generar-carta:
  { tipoProblema, nombreInstitucion, tipoProducto, segmento } → { cartaTexto }.

Objetivo:
- CartaModal: modal con inputs (nombre, RUT opcional, institución, tipo
  producto), botón "Generar", textarea editable con resultado, disclaimer
  destacado.

Tarea:
1) Plan.
2) Implementa CartaModal.
3) Conecta el botón en SignalsGrid para abrirlo con la señal activa.
4) Usa el copy de disclaimer de Docs-Final/13-easy-wins.md §3.5.
5) Botón "Copiar al portapapeles" con feedback visual ("¡Copiado!").
```

---

## Prompt 7 — Rutas "próximamente" y `/dashboard` `/educacion`

```text
Skill: espejo-frontend-builder.

Situación:
- /analizador completo. Hay rutas pendientes: /dashboard, /educacion,
  /historial, /comunidad.

Objetivo:
- /dashboard: 2-3 indicadores macro (UF, IPC, TPM) desde mindicador.cl, más
  un CTA grande "Ir a tu Espejo". Puedes hacer fetch directo a mindicador.cl
  desde el lado client (es API pública sin CORS issues).
- /educacion: contenido editorial con enlaces a CMF Educa, SERNAC, BCN Ley
  Chile.
- /historial y /comunidad: pantallas "Próximamente" con explicación corta
  de roadmap.

Tarea:
1) Plan corto.
2) Implementa /dashboard con un componente que llama mindicador.cl y muestra
   cards.
3) Implementa /educacion con secciones y enlaces.
4) Implementa /historial y /comunidad como server components estáticos
   simples.
5) Asegúrate de que el header destaque la ruta activa.
```

---

## Prompt 8 — Pulido UX y copy

```text
Skill: espejo-copy-and-narrative-writer.

Situación:
- Toda la UI funciona.
- Quiero pulir textos para Paula (emprendedora primera generación).

Objetivo:
- Revisar y mejorar copy de:
  - landing
  - aviso de privacidad
  - microcopy en SimulationPanel
  - disclaimers en CartaModal
  - mensajes de error y loading
  - textos del Pasaporte

Tarea:
1) Pegáme abajo el copy actual (yo lo extraigo de los componentes).
2) Para cada bloque, dame:
   - 1 versión propuesta (recomendada)
   - 1 alternativa
   - razón corta de cada cambio
3) No cambies el significado clave; solo claridad y tono.

Reglas:
- Lenguaje simple, sin tecnicismos.
- No paternalismo ("tienes que" → "puedes").
- Máximo 2-3 frases por bloque.
- No prometas resultados.
```

---

## Prompt 9 — Checklist QA para la demo

```text
Tarea: diseñar un checklist de QA manual para la demo del 7 mayo.

Contexto:
- Tenemos /analizador completo, /api/analyze + /api/simulate + /api/generar-carta.
- La demo principal es Paula. Necesito flujos felices y de error testados.

Tarea:
1) NO escribas código. Diseña un checklist en Markdown.
2) Divide en secciones:
   - "Flujo feliz Paula"
   - "Flujo Luis (backup)"
   - "Errores controlados" (red caída, agente falla, JSON inválido)
   - "Modo demo offline"
   - "Pasaporte imprimible" (Cmd+P en distintos navegadores)
   - "Mobile" (360px)
   - "Visual" (contraste, tipografía, badges, spacing)
3) Cada ítem es una acción concreta y un resultado esperado.
4) Marca cuáles son críticos (no podemos demo sin estos).
```

---

## Prompt 10 — README del repo

```text
Tarea: escribir el README.md del repositorio para entregar como bonus.

Contexto:
- Repo público en GitHub.
- Stack: Next 14 + TS + Tailwind + Python MCP.
- Es para que cualquier persona pueda levantar la app y ver la demo.

Tarea:
1) Genera un README.md con secciones:
   - "Espejo de Datos" (1 párrafo qué es)
   - "Stack"
   - "Cómo correr local" (Next + MCP, dos terminales)
   - "Variables de entorno"
   - "Disclaimer"
   - "Equipo"
   - Link al video y a Docs-Final/
2) Incluye los comandos exactos.
3) No incluyas secretos.
```

---

## Reglas para usarme bien con Claude Code

1. **Siempre pega el contexto** del archivo actual antes de pedir cambios
   masivos.
2. **Pide plan primero**, especialmente si hay >2 archivos involucrados.
3. **Si Claude propone librerías** (Material UI, Chakra), di "no, solo
   Tailwind".
4. **Si propone cambiar tipos**, di "habla con Milton, los tipos son del
   backend".
5. **Para textos**, mejor pedir 2-3 variantes y elegir.
6. **Probá en mobile siempre** — el responsive truena fácil.
