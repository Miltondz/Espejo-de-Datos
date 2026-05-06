# 07 — Frontend Next.js

> Rutas, componentes, integración con las API Routes y patrones de UX
> ciudadana para el frontend de Espejo de Datos.

---

## 1. Stack del frontend

- **Next.js 14 App Router** (server components + client components donde haga falta).
- **TypeScript** (strict).
- **Tailwind CSS** (sin librería extra de UI).
- Cliente HTTP: `fetch` nativo. Sin React Query / SWR en el MVP.
- Estado: `useState` / `useReducer` locales. Sin Zustand / Redux en el MVP.

## 2. Mapa de rutas

| Ruta | Tipo | Propósito |
|---|---|---|
| `/` | Landing | Explica qué es Espejo + CTA "Ver mi Espejo" |
| `/analizador` | **Core** | Upload + perfil + señales + lentes + simulación + pasaporte + carta |
| `/dashboard` | Auxiliar | 2–3 indicadores macro desde mindicador.cl + CTA grande "Ir a tu Espejo" |
| `/educacion` | Auxiliar | Texto explicativo de derechos + enlaces a CMF Educa, SERNAC, BCN |
| `/historial` | "Próximamente" | Pantalla simple con roadmap de la funcionalidad |
| `/comunidad` | "Próximamente" | Pantalla simple con roadmap de la funcionalidad |

`/analizador` es el único core. Las demás son "lugares" para refuerzo
narrativo y para llenar el menú; no se les invierte más de 30 minutos cada una.

## 3. Layout global (`app/layout.tsx`)

```
┌─────────────────────────────────────────────────┐
│ HEADER                                          │
│ [Logo Espejo de Datos]   Tu Espejo · Dashboard ·│
│                          Educación · Historial* ·│
│                          Comunidad*             │
├─────────────────────────────────────────────────┤
│ <main>                                          │
│   {children}                                    │
│ </main>                                         │
├─────────────────────────────────────────────────┤
│ FOOTER                                          │
│ Espejo de Datos es educativo. No es asesoría    │
│ financiera ni legal. Tus datos no se guardan.   │
│ © 2026 · Construido para Claude Impact Lab Chile│
└─────────────────────────────────────────────────┘

* "Próximamente"
```

## 4. Componentes core (`components/espejo/`)

### 4.1. `CartolaUpload`

**Props:**
```ts
interface CartolaUploadProps {
  onAnalyzed: (resp: EspejoResponse) => void
  onError: (msg: string) => void
  setLoading: (b: boolean) => void
}
```

**UX:**
- Botón **"Probar con demo Paula"** (POST `/api/analyze` con `{ mode: "demo", demoId: "paula" }`).
- Botón **"Probar con demo Luis"** (backup).
- Drop zone para PDF/Excel real (POST con FormData).
- Aviso de privacidad visible: "Tu cartola se procesa en memoria y no se guarda."

### 4.2. `ProfileSummaryCard`

**Props:** `EspejoProfileSummary`.

**Render:** card con:
- Saludo: "Hola {nombreDemo ?? 'Espejo'} — así te ven hoy."
- Grid 2x3: ingresos, regularidad, egresos, saldo fin de mes, uso de cupo, sobregiros.
- Badges visuales para uso de cupo alto y meses negativos.

### 4.3. `SignalsGrid`

**Props:** `EspejoSignal[]`.

**Render:** grid responsivo de cards, agrupadas por familia.
- Color por `tipo`: positiva (verde), ambigua (amarillo), riesgo (rojo), sin_datos (gris).
- Cada card: `titulo`, `descripcionCorta`, `valorResumen`.
- Si `esLegal: true`, muestra botón "Generar borrador de carta" → abre `CartaModal`.

### 4.4. `InstitutionLensesTabs`

**Props:** `EspejoLens[]` + `EspejoSignal[]` (para mapear `signalId` → señal).

**Render:** tabs Banco · Fintech · Estado/SII.
- Cada pestaña muestra `headline` (grande), `resumen`, lista de `señalesClaves`
  con su `impacto` y `comentario`.

### 4.5. `SimulationPanel`

**Props:**
```ts
interface SimulationPanelProps {
  profile?: FinancialProfile
  signals: EspejoSignal[]
  segmento: 'emprendedora' | 'jubilado'
  initialSuggestion?: EspejoSimulationSuggestion
}
```

**UX:**
- Slider único en el MVP: "Bajar uso de cupo (%)" — rango 0–30, default 20.
- (Opcional) toggle: "Formalizar 20% más de ventas".
- Botón **"Ver impacto"** → POST `/api/simulate` con la `hypothesis`.
- Render del resultado:
  - `descripcionAccion` como título.
  - Lista de `señalesMejoran`.
  - `explicacion` en bloque destacado.

Manejo de estados: loading (spinner), error (mensaje claro), éxito (resultado).

### 4.6. `PasaporteButton`

**Props:** ninguna (lee de su contenedor via context o props superiores).

**UX:**
- Botón **"Descargar mi Pasaporte Financiero (demo)"**.
- onClick: `window.print()`.
- El CSS `@media print` (en `app/globals.css`) oculta:
  - header, footer, navegación
  - botones interactivos, sliders, modales
- y muestra:
  - encabezado del pasaporte
  - resumen de perfil
  - 3–5 señales clave
  - resumen de los 3 lenses
  - sello "datos macro oficiales (UF/IPC/TPM, mindicador.cl)"
  - disclaimers

### 4.7. `CartaModal`

**Props:**
```ts
interface CartaModalProps {
  signal: EspejoSignal
  onClose: () => void
}
```

**UX:**
- Modal centrado.
- Inputs editables: nombre, RUT (opcional), nombre de la institución.
- Botón **"Generar borrador"** → POST `/api/generar-carta`.
- Resultado en `<textarea>` editable (el usuario puede modificarlo).
- Disclaimer destacado: "Este borrador es una ayuda inicial. Revísalo con un
  abogado, con SERNAC o con un programa de asesoría gratuita antes de enviarlo."

### 4.8. `PrivacyBadge`

**Props:** ninguna.

**Render:** badge pequeño persistente en `/analizador`:
🔒 "Procesado en memoria · Sin guardar tus datos"

## 5. `app/analizador/page.tsx` — orquestación

```tsx
'use client'

import { useState } from 'react'
import type { EspejoResponse } from '@/types/espejo'
// imports de componentes ...

export default function AnalizadorPage() {
  const [data, setData] = useState<EspejoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PrivacyBadge />
      <CartolaUpload onAnalyzed={setData} onError={setError} setLoading={setLoading} />

      {loading && <p>Analizando tu cartola…</p>}
      {error && <ErrorBanner message={error} />}

      {data && (
        <>
          <ProfileSummaryCard summary={data.profileSummary} />
          <SignalsGrid signals={data.signals} />
          <InstitutionLensesTabs lenses={data.lenses} signals={data.signals} />
          <SimulationPanel
            signals={data.signals}
            segmento={data.profileSummary.segmento}
            initialSuggestion={data.simulationSuggestion}
          />
          <PasaporteButton />
        </>
      )}
    </div>
  )
}
```

## 6. Estados y errores

Para cada llamada HTTP:
- **Loading:** placeholder o spinner inline. Texto: "Analizando…", "Calculando impacto…".
- **Error:** banner rojo con mensaje en lenguaje no técnico. Botón "Reintentar".
  Sugerir botón "Probar con demo Paula" como respaldo.
- **Empty:** si la respuesta es válida pero no hay señales ni datos suficientes,
  mostrar "Aún no tenemos suficiente información para generar tu espejo. Prueba
  con un período más largo o con la demo de Paula."

## 7. Patrones de copy ciudadano

| Decir | No decir |
|---|---|
| "Estás usando casi todo tu cupo" | "Tu utilización de línea rotativa es 85%" |
| "Llegas a fin de mes con poco margen" | "Liquidez crítica" |
| "Si bajas un poco el uso de tu tarjeta…" | "Reduzca el ratio de utilización" |
| "Cómo te ve un banco" | "Análisis de risk profile bancario" |
| "No es asesoría financiera" | "DISCLAIMER: This tool is informational only" |

## 8. Accesibilidad mínima

- Contraste AA (Tailwind ya lo facilita con paleta default).
- `aria-label` en botones de íconos.
- Tamaño de texto base 16px.
- No usar solo color para distinguir tipo de señal — añadir ícono o texto.

## 9. Reglas para Claude Code (frontend)

1. Siempre consume `EspejoResponse` desde la API. No reinventes el contrato.
2. Sin librerías de UI pesadas (Chakra, MUI, Material). Tailwind nativo.
3. Sin animaciones complejas. Transiciones simples (`transition-all duration-200`).
4. Sin imágenes externas en el MVP (solo SVG inline o emojis si hace falta).
5. Mobile-first: cada componente se ve bien en 360px de ancho.

## 10. Lo que NO se construye en el MVP

- Login / auth.
- Persistencia entre sesiones (`localStorage` solo se usa para el resultado actual).
- Múltiples cartolas comparadas.
- Visualización de la transacción individual.
- Internacionalización.
- Tests E2E (playwright) — solo QA manual via checklist.
