# 04 — Contrato de datos canónico

> **Fuente única de verdad** sobre los tipos del proyecto. Si cualquier otro
> documento (incluido el código) discrepa, manda este.
>
> Convención: **camelCase** para nombres de campos en TypeScript y JSON
> (no `snake_case`).

---

## 1. `FinancialProfile` — modelo de dominio interno

Vive en `types/profile.ts`. Es lo que devuelve el DAL y lo que reciben las
funciones puras de `lib/`. **No** lo consume directamente el frontend.

```ts
// types/profile.ts

export type IncomeRegularity = 'estable' | 'variable' | 'irregular'
export type LiquidityPressure = 'baja' | 'media' | 'alta' | 'critica'
export type Trend = 'creciente' | 'estable' | 'decreciente'
export type DataSource = 'cartola_manual' | 'sfa_api' | 'mock'

export interface FinancialProfile {
  metadata: {
    fechaAnalisis: string                  // ISO8601 "YYYY-MM-DD"
    fuenteDatos: DataSource
    periodoAnalizadoMeses: number
    institucionesDetectadas: string[]      // ej: ["BancoEstado"]
    fuentesConsultadas: string[]           // ej: ["cartola", "mindicador"]
  }
  ingresos: {
    promedioMensual: number                // CLP
    regularidad: IncomeRegularity
    fuentes: number                        // cuántas fuentes distintas detectadas
    tendencia: Trend
  }
  egresos: {
    promedioMensual: number                // CLP
    essentials: number                     // arriendo, servicios básicos, alimentación
    serviciosRecurrentes: number           // streaming, telco, suscripciones
    creditoCuotas: number
    avancesEfectivo: number
    otros: number
  }
  liquidez: {
    saldoPromedioFinMes: number            // CLP
    mesesConSaldoNegativo: number          // 0..periodoAnalizadoMeses
    presion: LiquidityPressure
  }
  credito: {
    usoCupoEstimadoPct: number             // 0..100
    tieneAvancesEfectivo: boolean
    tieneSobregiros: boolean
    pagosPuntuales: boolean
    tasaEfectivaEstimadoPct?: number       // opcional, si se puede inferir
  }
  tributario: {
    ingresoTributarioEstimado: number      // CLP anual
    ingresoBancarioEstimado: number        // CLP anual (movimientos detectados)
    brechaFormalidadPct: number            // 0..100
  }
  benchmarks: {
    ufValor: number
    ipcUltimoMesPct: number
    tpmPct: number
  }
}
```

### Notas de diseño

- `tendencia` y `regularidad` se calculan con heurísticas simples (ver
  `extract_signals` en `05-mcp-financial-mirror.md`).
- `tributario` puede ser `0/0/0` si no hay base para estimar; las señales lo
  manejarán con tipo `sin_datos`.
- `tasaEfectivaEstimadoPct` es opcional porque no siempre se puede inferir
  desde la cartola.

---

## 2. `EspejoResponse` — modelo que consume el frontend

Vive en `types/espejo.ts`. Es lo que devuelven `/api/analyze` y `/api/simulate`.

```ts
// types/espejo.ts

export type SignalKind = 'positiva' | 'ambigua' | 'riesgo' | 'sin_datos'
export type SignalFamily = 'ingresos' | 'liquidez' | 'credito' | 'pagos' | 'formalidad' | 'legal'
export type InstitutionType = 'bank' | 'fintech' | 'estado'
export type Importance = 1 | 2 | 3
export type Segment = 'emprendedora' | 'jubilado'

export interface EspejoProfileSummary {
  nombreDemo?: string                      // "Paula", "Luis", o ausente
  segmento: Segment
  ingresosMensuales: number
  ingresosRegularidad: IncomeRegularity
  egresosMensuales: number
  saldoPromedioFinMes: number
  mesesConSaldoNegativo: number
  usoCupoPct: number
  tieneAvancesEfectivo: boolean
  tieneSobregiros: boolean
}

export interface EspejoSignal {
  id: string                               // ej: "sig_uso_cupo_alto"
  familia: SignalFamily
  tipo: SignalKind
  titulo: string                           // 3-7 palabras
  descripcionCorta: string                 // 1-2 frases ciudadanas
  importancia: Importance                  // 1=baja, 2=media, 3=alta
  valorResumen: string                     // ej: "Uso de cupo ~85%"
  esLegal?: boolean                        // true si gatilla acción legal
}

export interface EspejoLensSignalView {
  signalId: string
  impacto: 'positivo' | 'neutral' | 'negativo'
  comentario: string                       // 1 frase, lenguaje ciudadano
}

export interface EspejoLens {
  institutionType: InstitutionType
  nombre: string                           // "Banco" | "Fintech" | "Estado / SII"
  headline: string                         // frase corta, 1ra persona del observador
  resumen: string                          // 2-3 frases con matiz, sin juicio
  señalesClaves: EspejoLensSignalView[]
}

export interface EspejoSimulationSuggestion {
  accion: {
    tipo: 'reducir_uso_cupo' | 'reducir_avances' | 'aumentar_saldo_fin_mes' | 'formalizar_ingresos'
    cantidadPct: number
  }
  descripcionAccion: string                // 1-2 frases para el usuario
  señalesMejoran: string[]                 // ids de señales
  explicacion: string                      // 2-4 frases con vista por institución
}

export interface EspejoResponse {
  profileSummary: EspejoProfileSummary
  signals: EspejoSignal[]
  lenses: EspejoLens[]
  simulationSuggestion?: EspejoSimulationSuggestion
}
```

### Reglas de las señales

Cada `EspejoSignal` debe responder dos preguntas:
1. ¿Qué está pasando? → `titulo` + `descripcionCorta`.
2. ¿Por qué importa? → `importancia` + interpretación en `lenses`.

### Reglas de los lenses

Cada `EspejoLens` responde a "Desde la mirada de X, esto es lo que más pesa".
- `headline`: frase corta y específica al perfil ("Te vemos con ingresos
  variables y alta dependencia del crédito").
- `resumen`: 2–3 frases con matiz, **sin juicio moral** ni paternalismo.
- `señalesClaves`: subconjunto de las `signals` con un comentario propio del
  observador.

---

## 3. Catálogo de señales canónicas

Estas son las señales mínimas que extrae `extract_signals`. El catálogo es
ampliable, pero estas IDs están **reservadas**.

| ID | Familia | Tipo típico | Cuándo se activa |
|---|---|---|---|
| `sig_uso_cupo_alto` | credito | riesgo | `usoCupoEstimadoPct >= 80` |
| `sig_uso_cupo_medio` | credito | ambigua | `50 <= usoCupoEstimadoPct < 80` |
| `sig_liquidez_justa` | liquidez | riesgo | `presion in {alta, critica}` |
| `sig_liquidez_sana` | liquidez | positiva | `presion == baja && mesesConSaldoNegativo == 0` |
| `sig_ingresos_irregulares` | ingresos | ambigua | `regularidad == irregular` |
| `sig_ingresos_estables` | ingresos | positiva | `regularidad == estable` |
| `sig_avances_recurrentes` | credito | riesgo | `tieneAvancesEfectivo == true` |
| `sig_brecha_formalidad` | formalidad | ambigua | `brechaFormalidadPct >= 30` |
| `sig_tasa_cercana_tmc` | legal | riesgo | `tasaEfectivaEstimadoPct >= 40` |
| `sig_pagos_puntuales` | pagos | positiva | `pagosPuntuales == true` |
| `sig_sin_datos` | * | sin_datos | cualquier campo crítico vacío |

`esLegal: true` solo en señales de la familia `legal` o que gatillen carta.

---

## 4. Contratos de los endpoints HTTP

### `POST /api/analyze`

**Request — modo demo:**
```json
{
  "mode": "demo",
  "demoId": "paula" | "luis",
  "segmento": "emprendedora" | "jubilado"
}
```

**Request — modo cartola** (`Content-Type: multipart/form-data`):
```
file: <archivo PDF/Excel>
segmento: "emprendedora"
```

**Response (200):** `EspejoResponse` — sin `simulationSuggestion`.

**Errors:**
- 400: body inválido o archivo no soportado.
- 500: error en agente o MCP. **Antes** de devolver 500, intentar fallback al
  DAL determinista (ver `03-arquitectura.md`).

### `POST /api/simulate`

**Request:**
```json
{
  "segmento": "emprendedora",
  "goal": "mejorar_estabilidad_y_menos_dependencia_credito",
  "hypothesis": {
    "reducirUsoCupoPct": 20
  },
  "financialProfile": { /* opcional, si el front lo guardó */ },
  "signals": [ /* opcional, ids o subset */ ]
}
```

**Response (200):**
```json
{
  "simulationSuggestion": { /* EspejoSimulationSuggestion */ }
}
```

### `POST /api/generar-carta`

**Request:**
```json
{
  "tipoProblema": "tasa_cercana_tmc" | "cobro_no_autorizado" | "portabilidad_credito",
  "nombreInstitucion": "Banco X",
  "tipoProducto": "tarjeta_credito" | "credito_consumo" | "cuenta_vista",
  "segmento": "emprendedora"
}
```

**Response (200):**
```json
{
  "cartaTexto": "Estimados,\n\nPor medio de la presente..."
}
```

---

## 5. Fixtures canónicos

Los archivos JSON de demo viven en `Docs-Final/16-fixtures/`:

- `demo-financial-profile-paula.json` — `FinancialProfile` de Paula.
- `demo-espejo-paula.json` — `EspejoResponse` de Paula (con `simulationSuggestion`).
- `demo-financial-profile-luis.json` — backup `FinancialProfile`.
- `demo-espejo-luis.json` — backup `EspejoResponse`.

Cuando se cree el repo (6 mayo), copiarlos a:
- `data/demo-financial-profile-paula.json`
- `data/demo-espejo-paula.json`
- etc.

---

## 6. Reglas para extender este contrato

1. **Cualquier cambio se documenta primero aquí.**
2. Cualquier campo nuevo es opcional (`?`) por default. Solo se vuelve obligatorio
   en una "versión 2" del contrato.
3. Nombres en **camelCase**. Sin abreviaturas oscuras.
4. Si un campo necesita explicación, va en este doc, no como comentario en `.ts`.
