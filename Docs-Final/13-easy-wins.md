# 13 — Easy wins (Pasaporte, What-If, Carta)

> Tres extensiones de **alto impacto y bajo costo** para el MVP, ya cubiertas
> conceptualmente en el código. Aquí se documenta su implementación
> detallada.

---

## 1. Pasaporte Financiero (vista imprimible)

### 1.1. Qué es

Una vista imprimible de la página `/analizador` que la persona puede:
- descargar como PDF (vía `Cmd+P` / "Guardar como PDF" del navegador),
- imprimir,
- llevar a una reunión con un ejecutivo, ONG o municipio.

**No** es un PDF generado server-side. **No** se usa una librería pesada
(jsPDF, react-pdf). Es solo CSS `@media print`.

### 1.2. UX

- Un botón visible en `/analizador` (componente `PasaporteButton`):

  ```tsx
  <button
    onClick={() => window.print()}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
  >
    📄 Descargar mi Pasaporte Financiero (demo)
  </button>
  ```

- Disclaimer junto al botón: "Versión demo — no es documento oficial".

### 1.3. CSS `@media print`

En `app/globals.css`:

```css
@media print {
  /* Oculta lo que no es parte del pasaporte */
  header, footer, nav,
  .no-print,
  button, input, .slider,
  .modal-overlay {
    display: none !important;
  }

  /* Reset de fondos para tinta */
  body {
    background: white !important;
    color: black !important;
    font-size: 11pt;
  }

  /* Forzar layout de 1 página */
  .pasaporte-container {
    page-break-inside: avoid;
    max-width: 210mm;
    margin: 0 auto;
    padding: 1.5cm;
  }

  /* Cabecera con sello */
  .pasaporte-header::before {
    content: "Pasaporte Financiero — Demo Espejo de Datos";
    display: block;
    font-weight: bold;
    font-size: 14pt;
    border-bottom: 2px solid #047857;
    padding-bottom: 0.5cm;
    margin-bottom: 0.5cm;
  }

  /* Sello visual de fuentes oficiales */
  .pasaporte-sello {
    border: 1px dashed #047857;
    padding: 0.5cm;
    margin-top: 1cm;
    font-style: italic;
    font-size: 9pt;
  }
}
```

### 1.4. Contenido del pasaporte (en orden de impresión)

1. Título y subtítulo:
   - "Pasaporte Financiero — Demo Espejo de Datos"
   - "Resumen educativo basado en tu cartola y datos macro oficiales."

2. Bloque de Perfil (`ProfileSummaryCard`).

3. Señales clave (top 3–5):
   - una positiva,
   - 1–2 de riesgo,
   - 1 de formalidad/liquidez.

4. Cómo te ven otras instituciones (Banco / Fintech / Estado):
   - `headline` + 1–2 frases de cada lente.

5. Sello visual:
   > "Este espejo se apoya en indicadores macro oficiales (UF, TPM, IPC)
   > publicados por Banco Central / mindicador.cl."

6. Disclaimer final:
   > "Espejo de Datos es una herramienta educativa. No es asesoría
   > financiera ni legal, ni certifica decisiones de bancos, fintech o el
   > Estado."

### 1.5. Marcar elementos para no imprimir

En cada componente que **no** debe aparecer en el pasaporte (slider de
simulación, modal de carta, navegación, botones de acción), añadir
`className="no-print"`.

---

## 2. Simulador What-If (sliders + agente)

### 2.1. Qué es

Permite a la persona modificar una variable y ver cómo cambia su espejo.
El UX es el slider; la magia es el agente `ActionPlannerAgent` que
orquesta `simulate_change` en el MCP y devuelve una explicación con
mirada de las 3 instituciones.

### 2.2. UX (`SimulationPanel`)

```
┌────────────────────────────────────────────────────┐
│ Simula un cambio en tu espejo                      │
│                                                    │
│ ¿Qué pasa si bajo mi uso de cupo?                  │
│ [────●─────────] 20 %                              │
│                                                    │
│ □ También: simular formalizar 20% más mis ventas  │
│                                                    │
│   [ Ver impacto ]                                  │
│                                                    │
│ ─────────────────────────────────────────────────  │
│ Resultado:                                         │
│                                                    │
│ ✅ Acción: Reducir uso de cupo en 20 %             │
│                                                    │
│ Si bajas en 20% el uso de tu cupo, llegas a fin de│
│ mes con más margen y un banco te vería con menos  │
│ riesgo. Una fintech podría ofrecerte productos    │
│ algo más flexibles. El Estado no cambia su        │
│ mirada con esta acción.                            │
│                                                    │
│ Señales que mejoran:                               │
│ • Uso de cupo muy alto → ambigua                   │
│ • Liquidez muy ajustada → ambigua                  │
└────────────────────────────────────────────────────┘
```

### 2.3. Payload al backend

```json
POST /api/simulate
{
  "segmento": "emprendedora",
  "goal": "mejorar_estabilidad_y_menos_dependencia_credito",
  "hypothesis": {
    "reducirUsoCupoPct": 20
  },
  "financialProfile": { /* del estado del front, opcional */ },
  "signals": [ /* del estado, opcional */ ]
}
```

### 2.4. Render del resultado

Usa los campos de `EspejoSimulationSuggestion`:
- `accion.tipo` → header con ícono.
- `descripcionAccion` → texto destacado.
- `explicacion` → bloque principal.
- `señalesMejoran` → lista con check verde.

### 2.5. Si el tiempo aprieta

- **MVP mínimo:** 1 solo slider (`reducirUsoCupoPct`) sin toggle de
  formalidad. Funciona y se ve completo.
- El toggle de formalidad puede dejarse visible pero deshabilitado con
  texto "Próximamente".

---

## 3. Generador de Carta de Reclamo

### 3.1. Qué es

Cuando una señal con `esLegal: true` aparece en `SignalsGrid`, junto a la
señal hay un botón "Generar borrador de carta" que abre `CartaModal`.
Este modal llama a `LetterGeneratorAgent` (Haiku 4.5, sin MCP) y devuelve un
texto de carta editable.

### 3.2. Cuándo se ofrece

Solo cuando hay una señal en `signals` con `esLegal: true`. En el catálogo
canónico, esto incluye:
- `sig_tasa_cercana_tmc` (tasa cercana al máximo legal).
- (Futuras) `sig_unreg_entity`, `sig_abusive_fee`, etc.

### 3.3. UX (`CartaModal`)

```
┌─────────────────────────────────────────────────┐
│ ✕                                                │
│ Borrador de carta — Tasa cercana al máximo legal│
│                                                  │
│ Tu nombre:        [____________________]         │
│ RUT (opcional):   [____________________]         │
│ Institución:      [Banco X__________]            │
│ Tipo de producto: [▼ Tarjeta de crédito]         │
│                                                  │
│           [ Generar borrador ]                   │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ Estimados,                                 │  │
│ │                                            │  │
│ │ Por medio de la presente, me dirijo a      │  │
│ │ ustedes para solicitar...                  │  │
│ │                                            │  │
│ │ [...]                                      │  │
│ │                                            │  │
│ │ Atentamente,                               │  │
│ │ [Tu nombre]                                │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ⚠️ Este borrador es una ayuda inicial. Revísalo │
│ con un abogado, con SERNAC o con un programa de │
│ asesoría gratuita antes de enviarlo.            │
│                                                  │
│ [ Copiar al portapapeles ]   [ Cerrar ]          │
└─────────────────────────────────────────────────┘
```

### 3.4. Endpoint

```
POST /api/generar-carta
{
  "tipoProblema": "tasa_cercana_tmc",
  "nombreInstitucion": "Banco X",
  "tipoProducto": "tarjeta_credito",
  "segmento": "emprendedora"
}
→ 200
{ "cartaTexto": "Estimados,\n\n..." }
```

`LetterGeneratorAgent` usa Haiku 4.5 por costo. No requiere MCP.

### 3.5. Reglas de copy de la carta

- Primera persona, tono formal pero claro.
- Pide respuesta en 10 días hábiles.
- **No cita artículos específicos** si no los tiene con certeza. Usa
  referencias genéricas: "la legislación chilena vigente sobre derechos
  del consumidor financiero".
- Termina con "[Tu nombre]" o el nombre del input.

### 3.6. Si el tiempo aprieta

- Versión mínima: una sola plantilla cableada (`tipoProblema = "tasa_cercana_tmc"`).
- Versión "demo precocinada": botón muestra texto fijo si Haiku falla, con
  disclaimer "ejemplo de borrador para `tasa_cercana_tmc`".

---

## 4. Prioridad si hay que cortar

Orden de **mayor → menor** valor por costo:

1. **Simulador What-If** con 1 slider funcional. (Demuestra agentes y MCP en
   acción.)
2. **Pasaporte imprimible**. (CSS `@media print` — pocas líneas, alto
   impacto visual.)
3. **Carta de reclamo** para 1 sola señal. (Demuestra "acción, no solo info"
   — criterio del Lab.)

Si no se llega:
- Cortar primero el toggle de formalidad del simulador.
- Después la carta (dejar botón visible con "próximamente").
- Pasaporte siempre se mantiene.
- 1 slider funcional siempre se mantiene.

---

## 5. Por qué importan estos easy wins en la rúbrica

- **"Acción, no solo info"** — el Lab valora explícitamente que la solución
  lleve a algo concreto (carta, pasaporte). +1 en Impacto ciudadano.
- **"Funciona"** — pasaporte y simulador son lo más visible en la demo. +1
  en Funciona.
- **"Pitch + narrativa"** — el pasaporte es el cierre visual perfecto del
  pitch ("y se va con esto en la mano"). +1 en narrativa.

Tres easy wins → tres puntos de subida potencial en la rúbrica.
