import type { IncomeRegularity } from './profile'

export type SignalFamily = 'ingresos' | 'liquidez' | 'credito' | 'pagos' | 'formalidad' | 'legal'
export type SignalType = 'positiva' | 'ambigua' | 'riesgo' | 'sin_datos'
export type InstitutionType = 'bank' | 'fintech' | 'estado'
export type Segmento = 'emprendedora' | 'jubilado'
export type SimulationActionType =
  | 'reducir_uso_cupo'
  | 'reducir_avances'
  | 'aumentar_saldo_fin_mes'
  | 'formalizar_ingresos'
export type LensSignalImpact = 'positivo' | 'negativo' | 'neutral'

export interface EspejoProfileSummary {
  nombreDemo?: string
  segmento: Segmento
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
  id: string
  familia: SignalFamily
  tipo: SignalType
  titulo: string
  descripcionCorta: string
  importancia: 1 | 2 | 3
  valorResumen: string
  esLegal?: boolean
}

export interface EspejoLensSignalView {
  signalId: string
  impacto: LensSignalImpact
  comentario: string
}

export interface EspejoLens {
  institutionType: InstitutionType
  nombre: string
  headline: string
  resumen: string
  señalesClaves: EspejoLensSignalView[]
}

export interface EspejoSimulationSuggestion {
  accion: {
    tipo: SimulationActionType
    cantidadPct: number
  }
  descripcionAccion: string
  señalesMejoran: string[]
  explicacion: string
}

export interface EspejoResponseMeta {
  cacheHit: boolean
  cacheReadTokens: number
  usedThinking: boolean
}

export interface EspejoResponse {
  profileSummary: EspejoProfileSummary
  signals: EspejoSignal[]
  lenses: EspejoLens[]
  simulationSuggestion?: EspejoSimulationSuggestion
  _meta?: EspejoResponseMeta
}
