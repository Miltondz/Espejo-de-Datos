export type IncomeRegularity = 'estable' | 'variable' | 'irregular'
export type LiquidityPressure = 'baja' | 'media' | 'alta' | 'critica'
export type IncomeTrend = 'creciente' | 'estable' | 'decreciente'
export type DataSource = 'cartola_manual' | 'sfa_api' | 'mock'

export interface FinancialProfile {
  metadata: {
    fechaAnalisis: string
    fuenteDatos: DataSource
    periodoAnalizadoMeses: number
    institucionesDetectadas: string[]
    fuentesConsultadas: string[]
  }
  ingresos: {
    promedioMensual: number
    regularidad: IncomeRegularity
    fuentes: number
    tendencia: IncomeTrend
  }
  egresos: {
    promedioMensual: number
    essentials: number
    serviciosRecurrentes: number
    creditoCuotas: number
    avancesEfectivo: number
    otros: number
  }
  liquidez: {
    saldoPromedioFinMes: number
    mesesConSaldoNegativo: number
    presion: LiquidityPressure
  }
  credito: {
    usoCupoEstimadoPct: number
    tieneAvancesEfectivo: boolean
    tieneSobregiros: boolean
    pagosPuntuales: boolean
    tasaEfectivaEstimadoPct?: number
  }
  tributario: {
    ingresoTributarioEstimado: number
    ingresoBancarioEstimado: number
    brechaFormalidadPct: number
  }
  benchmarks: {
    ufValor: number
    ipcUltimoMesPct: number
    tpmPct: number
  }
}
