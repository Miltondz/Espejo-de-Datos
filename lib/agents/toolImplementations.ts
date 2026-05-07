/**
 * Implementaciones TypeScript de las 6 tools del MCP financial-mirror-mcp.
 * Se usan como herramientas en el loop agentico de Claude (tool_use).
 * Lógica pura, sin side effects salvo fetch_macro_indicators.
 */

import type { FinancialProfile } from '@/types/profile'
import type { EspejoSignal, EspejoLens } from '@/types/espejo'

// ─── Tipos internos de las tools ───────────────────────────────────────────

export interface Transaccion {
  fecha: string
  monto: number
  tipo: 'abono' | 'cargo'
  descripcion: string
  saldo?: number
}

export interface ParseCartolaResult {
  transacciones: Transaccion[]
  periodoMeses: number
  institucionesDetectadas: string[]
}

export interface MacroIndicators {
  ufValor: number
  ipcUltimoMesPct: number
  tpmPct: number
  tmcPct: number
}

// ─── TOOL: fetch_macro_indicators ──────────────────────────────────────────

export async function fetchMacroIndicators(_fechaReferencia: string): Promise<MacroIndicators> {
  const BASE = 'https://mindicador.cl/api'
  const fallback: MacroIndicators = { ufValor: 36500, ipcUltimoMesPct: 0.3, tpmPct: 4.75, tmcPct: 45 }

  const [ufRes, ipcRes, tpmRes, tmcRes] = await Promise.allSettled([
    fetch(`${BASE}/uf`).then(r => r.json()),
    fetch(`${BASE}/ipc`).then(r => r.json()),
    fetch(`${BASE}/tpm`).then(r => r.json()),
    fetch(`${BASE}/tmc`).then(r => r.json()),
  ])

  return {
    ufValor: ufRes.status === 'fulfilled' ? Number(ufRes.value?.serie?.[0]?.valor ?? fallback.ufValor) : fallback.ufValor,
    ipcUltimoMesPct: ipcRes.status === 'fulfilled' ? Number(ipcRes.value?.serie?.[0]?.valor ?? fallback.ipcUltimoMesPct) : fallback.ipcUltimoMesPct,
    tpmPct: tpmRes.status === 'fulfilled' ? Number(tpmRes.value?.serie?.[0]?.valor ?? fallback.tpmPct) : fallback.tpmPct,
    tmcPct: tmcRes.status === 'fulfilled' ? Number(tmcRes.value?.serie?.[0]?.valor ?? fallback.tmcPct) : fallback.tmcPct,
  }
}

// ─── TOOL: parse_cartola ───────────────────────────────────────────────────

export function parseCartola(
  filePath: string,
  transacciones?: Transaccion[],
  periodoMeses?: number,
  institucionesDetectadas?: string[],
): ParseCartolaResult {
  // Cartola real subida por el usuario — Claude extrajo las transacciones del PDF
  if (transacciones && transacciones.length > 0) {
    return {
      transacciones,
      periodoMeses: periodoMeses ?? 1,
      institucionesDetectadas: institucionesDetectadas ?? ['Desconocido'],
    }
  }

  const nombre = filePath.toLowerCase()

  if (nombre.includes('paula') || nombre === 'demo://paula') {
    return {
      transacciones: [
        { fecha: '2026-01-03', monto: 750000,  tipo: 'abono', descripcion: 'Ventas enero',      saldo: 750000  },
        { fecha: '2026-01-10', monto: -180000, tipo: 'cargo', descripcion: 'Pago tarjeta',       saldo: 570000  },
        { fecha: '2026-01-20', monto: -200000, tipo: 'cargo', descripcion: 'Arriendo',           saldo: 370000  },
        { fecha: '2026-01-25', monto: -120000, tipo: 'cargo', descripcion: 'Avance en efectivo', saldo: 50000   },
        { fecha: '2026-02-03', monto: 600000,  tipo: 'abono', descripcion: 'Ventas febrero',     saldo: 650000  },
        { fecha: '2026-02-12', monto: -180000, tipo: 'cargo', descripcion: 'Pago tarjeta',       saldo: 470000  },
        { fecha: '2026-02-20', monto: -200000, tipo: 'cargo', descripcion: 'Arriendo',           saldo: 270000  },
        { fecha: '2026-02-27', monto: -310000, tipo: 'cargo', descripcion: 'Gastos varios',      saldo: -40000  },
        { fecha: '2026-03-03', monto: 900000,  tipo: 'abono', descripcion: 'Ventas marzo',       saldo: 860000  },
        { fecha: '2026-03-11', monto: -180000, tipo: 'cargo', descripcion: 'Pago tarjeta',       saldo: 680000  },
        { fecha: '2026-03-20', monto: -200000, tipo: 'cargo', descripcion: 'Arriendo',           saldo: 480000  },
        { fecha: '2026-03-28', monto: -430000, tipo: 'cargo', descripcion: 'Gastos varios',      saldo: 50000   },
      ],
      periodoMeses: 3,
      institucionesDetectadas: ['BancoEstado', 'Mercado Pago'],
    }
  }

  // Luis — jubilado, ingresos estables
  return {
    transacciones: [
      { fecha: '2026-01-01', monto: 850000,  tipo: 'abono', descripcion: 'Pensión enero',   saldo: 850000  },
      { fecha: '2026-01-10', monto: -350000, tipo: 'cargo', descripcion: 'Gastos hogar',     saldo: 500000  },
      { fecha: '2026-01-20', monto: -200000, tipo: 'cargo', descripcion: 'Crédito consumo',  saldo: 300000  },
      { fecha: '2026-02-01', monto: 850000,  tipo: 'abono', descripcion: 'Pensión febrero',  saldo: 1150000 },
      { fecha: '2026-02-10', monto: -350000, tipo: 'cargo', descripcion: 'Gastos hogar',     saldo: 800000  },
      { fecha: '2026-02-20', monto: -200000, tipo: 'cargo', descripcion: 'Crédito consumo',  saldo: 600000  },
      { fecha: '2026-03-01', monto: 850000,  tipo: 'abono', descripcion: 'Pensión marzo',    saldo: 1450000 },
      { fecha: '2026-03-10', monto: -350000, tipo: 'cargo', descripcion: 'Gastos hogar',     saldo: 1100000 },
      { fecha: '2026-03-20', monto: -200000, tipo: 'cargo', descripcion: 'Crédito consumo',  saldo: 900000  },
    ],
    periodoMeses: 3,
    institucionesDetectadas: ['BancoEstado'],
  }
}

// ─── TOOL: build_financial_profile ─────────────────────────────────────────

function relativeStd(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  if (mean === 0) return 0
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  return Math.sqrt(variance) / mean
}

export function buildFinancialProfile(
  transacciones: Transaccion[],
  periodoMeses: number,
  macro: MacroIndicators,
  fuenteDatos = 'cartola_manual'
): FinancialProfile {
  const meses = Math.max(periodoMeses, 1)

  const ingresosPorMes: Record<string, number> = {}
  const egresosPorMes: Record<string, number> = {}
  const saldosPorMes: Record<string, number> = {}

  for (const t of transacciones) {
    const mes = t.fecha.slice(0, 7)
    if (t.tipo === 'abono') {
      ingresosPorMes[mes] = (ingresosPorMes[mes] ?? 0) + t.monto
    } else {
      egresosPorMes[mes] = (egresosPorMes[mes] ?? 0) + Math.abs(t.monto)
    }
    if (t.saldo !== undefined) saldosPorMes[mes] = t.saldo
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

  const ingresosVals = Object.values(ingresosPorMes)
  const egresosVals = Object.values(egresosPorMes)
  const saldosVals = Object.values(saldosPorMes)

  const ingresosProm = avg(ingresosVals)
  const egresosProm = avg(egresosVals)
  const saldoProm = avg(saldosVals)
  const mesesNeg = saldosVals.filter(v => v < 0).length

  const d = ingresosVals.length <= 1 ? 1 : relativeStd(ingresosVals)
  const regularidad = d < 0.15 ? 'estable' : d < 0.40 ? 'variable' : 'irregular'

  const presion =
    saldoProm > 200000 ? 'baja' :
    saldoProm > 0 ? 'media' :
    mesesNeg <= 1 ? 'alta' : 'critica'

  const tieneAvances = transacciones.some(t =>
    t.descripcion.toLowerCase().includes('avance')
  )
  const tieneSobregiros = mesesNeg > 0

  return {
    metadata: {
      fechaAnalisis: new Date().toISOString().slice(0, 10),
      fuenteDatos: fuenteDatos as FinancialProfile['metadata']['fuenteDatos'],
      periodoAnalizadoMeses: meses,
      institucionesDetectadas: [],
      fuentesConsultadas: ['cartola', 'mindicador'],
    },
    ingresos: {
      promedioMensual: Math.round(ingresosProm),
      regularidad: regularidad as FinancialProfile['ingresos']['regularidad'],
      fuentes: 1,
      tendencia: 'estable',
    },
    egresos: {
      promedioMensual: Math.round(egresosProm),
      essentials: Math.round(egresosProm * 0.6),
      serviciosRecurrentes: Math.round(egresosProm * 0.2),
      creditoCuotas: Math.round(egresosProm * 0.15),
      avancesEfectivo: Math.round(egresosProm * 0.05),
      otros: 0,
    },
    liquidez: {
      saldoPromedioFinMes: Math.round(saldoProm),
      mesesConSaldoNegativo: mesesNeg,
      presion: presion as FinancialProfile['liquidez']['presion'],
    },
    credito: {
      usoCupoEstimadoPct: tieneAvances || tieneSobregiros ? 85 : 40,
      tieneAvancesEfectivo: tieneAvances,
      tieneSobregiros,
      pagosPuntuales: true,
      tasaEfectivaEstimadoPct: tieneAvances ? 46 : 28,
    },
    tributario: {
      ingresoTributarioEstimado: Math.round(ingresosProm * 12 * 0.6),
      ingresoBancarioEstimado: Math.round(ingresosProm * 12),
      brechaFormalidadPct: regularidad !== 'estable' ? 40 : 20,
    },
    benchmarks: {
      ufValor: macro.ufValor,
      ipcUltimoMesPct: macro.ipcUltimoMesPct,
      tpmPct: macro.tpmPct,
      tmcPct: macro.tmcPct,
    },
  }
}

// ─── TOOL: extract_signals ─────────────────────────────────────────────────

export function extractSignalsFromProfile(profile: FinancialProfile): EspejoSignal[] {
  const signals: EspejoSignal[] = []
  const { credito, liquidez, ingresos, tributario } = profile

  if (credito.usoCupoEstimadoPct >= 80) {
    signals.push({ id: 'sig_uso_cupo_alto', familia: 'credito', tipo: 'riesgo', titulo: 'Uso de cupo muy alto', descripcionCorta: 'Casi siempre estás usando más del 80% de tu cupo de crédito.', importancia: 3, valorResumen: `Uso de cupo ~${credito.usoCupoEstimadoPct}%`, esLegal: false })
  } else if (credito.usoCupoEstimadoPct >= 50) {
    signals.push({ id: 'sig_uso_cupo_medio', familia: 'credito', tipo: 'ambigua', titulo: 'Uso de cupo intermedio', descripcionCorta: 'Tu uso de cupo es moderado, conviene mirarlo.', importancia: 2, valorResumen: `Uso de cupo ~${credito.usoCupoEstimadoPct}%`, esLegal: false })
  }

  if (liquidez.presion === 'alta' || liquidez.presion === 'critica') {
    signals.push({ id: 'sig_liquidez_justa', familia: 'liquidez', tipo: 'riesgo', titulo: 'Liquidez muy ajustada', descripcionCorta: 'Llegas a fin de mes con saldos muy bajos o en rojo.', importancia: 3, valorResumen: `Saldo fin mes ~${liquidez.saldoPromedioFinMes.toLocaleString('es-CL')}`, esLegal: false })
  } else if (liquidez.presion === 'baja' && liquidez.mesesConSaldoNegativo === 0) {
    signals.push({ id: 'sig_liquidez_sana', familia: 'liquidez', tipo: 'positiva', titulo: 'Liquidez saludable', descripcionCorta: 'Llegas a fin de mes con saldo positivo de forma consistente.', importancia: 2, valorResumen: 'Sin meses en rojo', esLegal: false })
  }

  if (ingresos.regularidad !== 'estable') {
    signals.push({ id: 'sig_ingresos_irregulares', familia: 'ingresos', tipo: 'ambigua', titulo: 'Ingresos irregulares', descripcionCorta: 'Tus ingresos varían bastante de un mes a otro.', importancia: 2, valorResumen: `Regularidad: ${ingresos.regularidad}`, esLegal: false })
  } else {
    signals.push({ id: 'sig_ingresos_estables', familia: 'ingresos', tipo: 'positiva', titulo: 'Ingresos estables', descripcionCorta: 'Recibes ingresos de forma regular y predecible.', importancia: 2, valorResumen: 'Regularidad: estable', esLegal: false })
  }

  if (credito.tieneAvancesEfectivo) {
    signals.push({ id: 'sig_avances_recurrentes', familia: 'credito', tipo: 'riesgo', titulo: 'Avances de efectivo recurrentes', descripcionCorta: 'Estás usando avances de efectivo, que tienen tasas muy altas.', importancia: 2, valorResumen: 'Avances de efectivo: sí', esLegal: false })
  }

  if (tributario.brechaFormalidadPct >= 30) {
    signals.push({ id: 'sig_brecha_formalidad', familia: 'formalidad', tipo: 'ambigua', titulo: 'Brecha entre cartola y declaración', descripcionCorta: 'Lo que entra a tu cuenta parece más que lo declarado formalmente.', importancia: 2, valorResumen: `Brecha estimada ~${tributario.brechaFormalidadPct}%`, esLegal: false })
  }

  const tmcUmbral = (profile.benchmarks.tmcPct ?? 45) * 0.90
  if ((credito.tasaEfectivaEstimadoPct ?? 0) >= tmcUmbral) {
    const tmcRef = profile.benchmarks.tmcPct ? ` (TMC vigente ~${profile.benchmarks.tmcPct}%)` : ''
    signals.push({ id: 'sig_tasa_cercana_tmc', familia: 'legal', tipo: 'riesgo', titulo: 'Tasa cercana al máximo legal', descripcionCorta: `La tasa estimada de tu crédito está cerca del límite legal permitido${tmcRef}.`, importancia: 2, valorResumen: `Tasa estimada ~${credito.tasaEfectivaEstimadoPct}% anual`, esLegal: true })
  }

  if (credito.pagosPuntuales) {
    signals.push({ id: 'sig_pagos_puntuales', familia: 'pagos', tipo: 'positiva', titulo: 'Pagos siempre al día', descripcionCorta: 'No tienes registros de pagos atrasados.', importancia: 1, valorResumen: 'Historial de pagos: puntual', esLegal: false })
  }

  return signals
}

// ─── TOOL: generate_lenses ─────────────────────────────────────────────────

export function generateLensesFromProfile(profile: FinancialProfile, signals: EspejoSignal[]): EspejoLens[] {
  const ids = new Set(signals.map(s => s.id))
  const uso = profile.credito.usoCupoEstimadoPct
  const reg = profile.ingresos.regularidad

  const bankNeg = new Set(['sig_uso_cupo_alto', 'sig_uso_cupo_medio', 'sig_liquidez_justa', 'sig_ingresos_irregulares', 'sig_avances_recurrentes'])
  const bankPos = new Set(['sig_pagos_puntuales', 'sig_ingresos_estables', 'sig_liquidez_sana'])
  const fintechNeg = new Set(['sig_uso_cupo_alto'])
  const fintechPos = new Set(['sig_pagos_puntuales'])
  const estadoNeg = new Set(['sig_brecha_formalidad', 'sig_tasa_cercana_tmc'])

  const impact = (id: string, neg: Set<string>, pos: Set<string>): 'positivo' | 'negativo' | 'neutral' =>
    neg.has(id) ? 'negativo' : pos.has(id) ? 'positivo' : 'neutral'

  return [
    {
      institutionType: 'bank', nombre: 'Banco',
      headline: `Te vemos con ingresos ${reg}s y uso de crédito del ${uso}%.`,
      resumen: 'Un banco tradicional se fija en qué tan predecibles son tus ingresos y cuánto dependes del crédito para llegar a fin de mes.',
      señalesClaves: signals.filter(s => bankNeg.has(s.id) || bankPos.has(s.id)).map(s => ({ signalId: s.id, impacto: impact(s.id, bankNeg, bankPos), comentario: '' })),
    },
    {
      institutionType: 'fintech', nombre: 'Fintech',
      headline: 'Vemos actividad constante; tu uso de crédito puede limitar nuevas ofertas.',
      resumen: 'Una fintech tolera mejor ingresos variables si ve movimiento frecuente y cumplimiento de pagos.',
      señalesClaves: signals.filter(s => fintechNeg.has(s.id) || fintechPos.has(s.id) || s.id === 'sig_ingresos_irregulares').map(s => ({ signalId: s.id, impacto: s.id === 'sig_ingresos_irregulares' ? 'neutral' : impact(s.id, fintechNeg, fintechPos), comentario: '' })),
    },
    {
      institutionType: 'estado', nombre: 'Estado / SII',
      headline: ids.has('sig_brecha_formalidad') ? 'Ponemos atención a la brecha entre lo que entra a tu cuenta y lo que se declara.' : 'Vemos coherencia entre tus ingresos bancarios y tributarios.',
      resumen: 'Desde la mirada del Estado, el foco está en la formalidad y en que la brecha entre cartola y declaración no sea excesiva.',
      señalesClaves: signals.filter(s => estadoNeg.has(s.id)).map(s => ({ signalId: s.id, impacto: 'negativo' as const, comentario: '' })),
    },
  ]
}

// ─── TOOL: simulate_change ─────────────────────────────────────────────────

export function simulateChange(
  profile: FinancialProfile,
  action: { tipo: string; cantidadPct: number }
): { newProfile: FinancialProfile; changedSignals: Array<{ id: string; from: string; to: string }> } {
  const newProfile: FinancialProfile = JSON.parse(JSON.stringify(profile))
  const changed: Array<{ id: string; from: string; to: string }> = []

  if (action.tipo === 'reducir_uso_cupo' && action.cantidadPct > 0) {
    const actual = newProfile.credito.usoCupoEstimadoPct
    const nuevo = Math.max(0, actual - action.cantidadPct)
    newProfile.credito.usoCupoEstimadoPct = nuevo
    if (actual >= 80) changed.push({ id: 'sig_uso_cupo_alto', from: 'riesgo', to: nuevo >= 50 ? 'ambigua' : 'positiva' })
    newProfile.liquidez.saldoPromedioFinMes += 50000
    if (newProfile.liquidez.presion === 'alta') {
      newProfile.liquidez.presion = 'media'
      changed.push({ id: 'sig_liquidez_justa', from: 'riesgo', to: 'ambigua' })
    }
  } else if (action.tipo === 'reducir_avances') {
    newProfile.credito.tieneAvancesEfectivo = false
    newProfile.credito.tasaEfectivaEstimadoPct = 28
    changed.push({ id: 'sig_avances_recurrentes', from: 'riesgo', to: 'positiva' })
  } else if (action.tipo === 'formalizar_ingresos') {
    const brecha = newProfile.tributario.brechaFormalidadPct
    const nueva = Math.max(0, brecha - action.cantidadPct)
    newProfile.tributario.brechaFormalidadPct = nueva
    if (nueva < 30) changed.push({ id: 'sig_brecha_formalidad', from: 'ambigua', to: 'positiva' })
  }

  return { newProfile, changedSignals: changed }
}

// ─── Schemas Anthropic ─────────────────────────────────────────────────────

export const MIRROR_TOOLS: Anthropic.Tool[] = [
  {
    name: 'parse_cartola',
    description: 'Parsea cartola y devuelve transacciones normalizadas, período e instituciones. Para cartolas reales subidas como PDF, incluye las transacciones extraídas del documento en el campo "transacciones".',
    input_schema: {
      type: 'object' as const,
      properties: {
        file_path: { type: 'string', description: 'Ruta del archivo: "demo://paula", "demo://luis", o "uploaded://nombre.pdf" para cartolas reales' },
        transacciones: {
          type: 'array',
          description: 'Transacciones extraídas del PDF real. Fechas en YYYY-MM-DD, montos en CLP entero (sin puntos: 65000 no 65.000). Incluir cuando file_path empieza con "uploaded://".',
          items: {
            type: 'object',
            properties: {
              fecha:       { type: 'string', description: 'YYYY-MM-DD' },
              monto:       { type: 'number', description: 'Positivo=abono, negativo=cargo' },
              tipo:        { type: 'string', enum: ['abono', 'cargo'] },
              descripcion: { type: 'string' },
              saldo:       { type: 'number', description: 'Saldo después de la transacción (opcional)' },
            },
            required: ['fecha', 'monto', 'tipo', 'descripcion'],
          },
        },
        periodoMeses:           { type: 'number', description: 'Meses cubiertos por la cartola' },
        institucionesDetectadas:{ type: 'array', items: { type: 'string' }, description: 'Bancos o fintechs detectadas en el PDF' },
      },
      required: ['file_path'],
    },
  },
  {
    name: 'fetch_macro_indicators',
    description: 'Obtiene UF, IPC, TPM y TMC (Tasa Máxima Convencional) oficiales desde mindicador.cl.',
    input_schema: {
      type: 'object' as const,
      properties: { fecha_referencia: { type: 'string', description: 'Fecha YYYY-MM-DD de referencia' } },
      required: ['fecha_referencia'],
    },
  },
  {
    name: 'build_financial_profile',
    description: 'Construye FinancialProfile determinista desde transacciones y macro.',
    input_schema: {
      type: 'object' as const,
      properties: {
        transacciones: { type: 'array', description: 'Lista de transacciones de parse_cartola' },
        periodoMeses: { type: 'number', description: 'Número de meses analizados' },
        macro: { type: 'object', description: 'Indicadores macro de fetch_macro_indicators' },
        fuenteDatos: { type: 'string', description: 'cartola_manual | mock' },
      },
      required: ['transacciones', 'periodoMeses', 'macro'],
    },
  },
  {
    name: 'extract_signals',
    description: 'Deriva señales canónicas desde FinancialProfile.',
    input_schema: {
      type: 'object' as const,
      properties: { financial_profile: { type: 'object', description: 'FinancialProfile de build_financial_profile' } },
      required: ['financial_profile'],
    },
  },
  {
    name: 'generate_lenses',
    description: 'Genera lentes Banco / Fintech / Estado desde perfil + señales.',
    input_schema: {
      type: 'object' as const,
      properties: {
        financial_profile: { type: 'object' },
        signals: { type: 'array', description: 'Señales de extract_signals' },
      },
      required: ['financial_profile', 'signals'],
    },
  },
]

export const SIMULATION_TOOLS: Anthropic.Tool[] = [
  {
    name: 'simulate_change',
    description: 'Aplica una acción what-if y devuelve perfil modificado + señales que cambian.',
    input_schema: {
      type: 'object' as const,
      properties: {
        financial_profile: { type: 'object' },
        action: {
          type: 'object',
          properties: {
            tipo: { type: 'string', enum: ['reducir_uso_cupo', 'reducir_avances', 'aumentar_saldo_fin_mes', 'formalizar_ingresos'] },
            cantidadPct: { type: 'number' },
          },
          required: ['tipo', 'cantidadPct'],
        },
      },
      required: ['financial_profile', 'action'],
    },
  },
]

// ─── Ejecutor de tools ─────────────────────────────────────────────────────

export async function executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'fetch_macro_indicators':
      return fetchMacroIndicators(input.fecha_referencia as string)
    case 'parse_cartola':
      return parseCartola(
        input.file_path as string,
        input.transacciones as Transaccion[] | undefined,
        input.periodoMeses as number | undefined,
        input.institucionesDetectadas as string[] | undefined,
      )
    case 'build_financial_profile':
      return buildFinancialProfile(
        input.transacciones as Transaccion[],
        input.periodoMeses as number,
        input.macro as MacroIndicators,
        input.fuenteDatos as string | undefined
      )
    case 'extract_signals':
      return { signals: extractSignalsFromProfile(input.financial_profile as FinancialProfile) }
    case 'generate_lenses':
      return { lenses: generateLensesFromProfile(input.financial_profile as FinancialProfile, input.signals as EspejoSignal[]) }
    case 'simulate_change':
      return simulateChange(input.financial_profile as FinancialProfile, input.action as { tipo: string; cantidadPct: number })
    default:
      throw new Error(`Tool desconocida: ${name}`)
  }
}

// Re-export Anthropic type for convenience
import type Anthropic from '@anthropic-ai/sdk'
