import type { FinancialProfile } from '@/types/profile'
import type {
  EspejoResponse,
  EspejoSignal,
  EspejoLens,
  EspejoProfileSummary,
  EspejoSimulationSuggestion,
  Segmento,
} from '@/types/espejo'

function extractSignals(p: FinancialProfile): EspejoSignal[] {
  const signals: EspejoSignal[] = []
  const { credito, liquidez, ingresos, tributario } = p

  if (credito.usoCupoEstimadoPct >= 80) {
    signals.push({
      id: 'sig_uso_cupo_alto',
      familia: 'credito',
      tipo: 'riesgo',
      titulo: 'Uso de cupo muy alto',
      descripcionCorta: 'Casi siempre estás usando más del 80% de tu cupo de crédito.',
      importancia: 3,
      valorResumen: `Uso de cupo ~${credito.usoCupoEstimadoPct}%`,
      esLegal: false,
    })
  } else if (credito.usoCupoEstimadoPct >= 50) {
    signals.push({
      id: 'sig_uso_cupo_medio',
      familia: 'credito',
      tipo: 'ambigua',
      titulo: 'Uso de cupo moderado',
      descripcionCorta: 'Estás usando una parte importante de tu cupo de crédito.',
      importancia: 2,
      valorResumen: `Uso de cupo ~${credito.usoCupoEstimadoPct}%`,
      esLegal: false,
    })
  }

  if (liquidez.presion === 'alta' || liquidez.presion === 'critica') {
    signals.push({
      id: 'sig_liquidez_justa',
      familia: 'liquidez',
      tipo: 'riesgo',
      titulo: 'Liquidez muy ajustada',
      descripcionCorta: 'Llegas a fin de mes con saldos muy bajos o en rojo.',
      importancia: 3,
      valorResumen: `Saldo promedio fin de mes ~${liquidez.saldoPromedioFinMes.toLocaleString('es-CL')}`,
      esLegal: false,
    })
  } else if (liquidez.presion === 'baja' && liquidez.mesesConSaldoNegativo === 0) {
    signals.push({
      id: 'sig_liquidez_sana',
      familia: 'liquidez',
      tipo: 'positiva',
      titulo: 'Liquidez saludable',
      descripcionCorta: 'Llegas a fin de mes con saldo positivo de forma consistente.',
      importancia: 2,
      valorResumen: 'Sin meses en rojo',
      esLegal: false,
    })
  }

  if (ingresos.regularidad === 'irregular' || ingresos.regularidad === 'variable') {
    signals.push({
      id: 'sig_ingresos_irregulares',
      familia: 'ingresos',
      tipo: 'ambigua',
      titulo: 'Ingresos irregulares',
      descripcionCorta: 'Tus ingresos varían mucho entre meses.',
      importancia: 2,
      valorResumen: `Regularidad: ${ingresos.regularidad}`,
      esLegal: false,
    })
  } else {
    signals.push({
      id: 'sig_ingresos_estables',
      familia: 'ingresos',
      tipo: 'positiva',
      titulo: 'Ingresos estables',
      descripcionCorta: 'Recibes ingresos de forma regular y predecible.',
      importancia: 2,
      valorResumen: 'Regularidad: estable',
      esLegal: false,
    })
  }

  if (credito.tieneAvancesEfectivo) {
    signals.push({
      id: 'sig_avances_recurrentes',
      familia: 'credito',
      tipo: 'riesgo',
      titulo: 'Avances de efectivo recurrentes',
      descripcionCorta: 'Estás usando avances de efectivo de tu tarjeta, que tienen tasas muy altas.',
      importancia: 2,
      valorResumen: 'Avances de efectivo: sí',
      esLegal: false,
    })
  }

  if (tributario.brechaFormalidadPct >= 30) {
    signals.push({
      id: 'sig_brecha_formalidad',
      familia: 'formalidad',
      tipo: 'ambigua',
      titulo: 'Brecha entre cartola y declaración',
      descripcionCorta: 'Lo que entra a tu cuenta parece más que lo declarado formalmente.',
      importancia: 2,
      valorResumen: `Brecha estimada ~${tributario.brechaFormalidadPct}%`,
      esLegal: false,
    })
  }

  const tmcUmbral = (p.benchmarks.tmcPct ?? 45) * 0.90
  if (credito.tasaEfectivaEstimadoPct !== undefined && credito.tasaEfectivaEstimadoPct >= tmcUmbral) {
    const tmcRef = p.benchmarks.tmcPct ? ` (TMC vigente ~${p.benchmarks.tmcPct}%)` : ''
    signals.push({
      id: 'sig_tasa_cercana_tmc',
      familia: 'legal',
      tipo: 'riesgo',
      titulo: 'Tasa cercana al máximo legal',
      descripcionCorta: `La tasa estimada de tu crédito está cerca del límite legal permitido${tmcRef}.`,
      importancia: 2,
      valorResumen: `Tasa estimada ~${credito.tasaEfectivaEstimadoPct}% anual`,
      esLegal: true,
    })
  }

  if (credito.pagosPuntuales) {
    signals.push({
      id: 'sig_pagos_puntuales',
      familia: 'pagos',
      tipo: 'positiva',
      titulo: 'Pagos siempre al día',
      descripcionCorta: 'No tienes registros de pagos atrasados.',
      importancia: 1,
      valorResumen: 'Historial de pagos: puntual',
      esLegal: false,
    })
  }

  return signals
}

function buildLenses(p: FinancialProfile, signals: EspejoSignal[]): EspejoLens[] {
  const ids = new Set(signals.map(s => s.id))

  const bankSignals: EspejoLens['señalesClaves'] = []
  const cupoId = ids.has('sig_uso_cupo_alto') ? 'sig_uso_cupo_alto' : ids.has('sig_uso_cupo_medio') ? 'sig_uso_cupo_medio' : null
  if (cupoId) bankSignals.push({ signalId: cupoId, impacto: 'negativo', comentario: 'Uso de cupo alto aumenta el riesgo percibido.' })
  if (ids.has('sig_ingresos_irregulares')) bankSignals.push({ signalId: 'sig_ingresos_irregulares', impacto: 'negativo', comentario: 'Ingresos variables dificultan proyectar tu capacidad de pago.' })
  if (ids.has('sig_ingresos_estables')) bankSignals.push({ signalId: 'sig_ingresos_estables', impacto: 'positivo', comentario: 'Ingresos predecibles facilitan la evaluación crediticia.' })
  if (ids.has('sig_liquidez_justa')) bankSignals.push({ signalId: 'sig_liquidez_justa', impacto: 'negativo', comentario: 'Liquidez ajustada deja poco margen para imprevistos.' })
  if (ids.has('sig_pagos_puntuales')) bankSignals.push({ signalId: 'sig_pagos_puntuales', impacto: 'positivo', comentario: 'Historial de pago puntual es una señal positiva.' })

  const fintechSignals: EspejoLens['señalesClaves'] = []
  if (ids.has('sig_ingresos_irregulares')) fintechSignals.push({ signalId: 'sig_ingresos_irregulares', impacto: 'neutral', comentario: 'La variabilidad de ingresos es esperable en emprendedores.' })
  if (cupoId) fintechSignals.push({ signalId: cupoId, impacto: 'negativo', comentario: 'Uso muy alto de cupo limita productos con más flexibilidad.' })
  if (ids.has('sig_pagos_puntuales')) fintechSignals.push({ signalId: 'sig_pagos_puntuales', impacto: 'positivo', comentario: 'Pagos puntuales son buena señal para créditos alternativos.' })

  const estadoSignals: EspejoLens['señalesClaves'] = []
  if (ids.has('sig_brecha_formalidad')) estadoSignals.push({ signalId: 'sig_brecha_formalidad', impacto: 'negativo', comentario: 'Una brecha alta puede llevar a revisar tus declaraciones.' })

  const hasHighRisk = ids.has('sig_uso_cupo_alto') || ids.has('sig_liquidez_justa')
  const hasVarIncome = ids.has('sig_ingresos_irregulares')

  return [
    {
      institutionType: 'bank',
      nombre: 'Banco',
      headline: hasHighRisk
        ? 'Te vemos con ingresos variables y alta dependencia del crédito.'
        : 'Vemos un perfil con capacidad de pago y algunos elementos a mejorar.',
      resumen: 'Un banco tradicional se fija en qué tan predecibles son tus ingresos y cuánto usas tu tarjeta para llegar a fin de mes.',
      señalesClaves: bankSignals,
    },
    {
      institutionType: 'fintech',
      nombre: 'Fintech',
      headline: hasVarIncome
        ? 'Vemos actividad constante, pero tu uso de crédito puede limitar nuevas ofertas.'
        : 'Vemos un perfil activo con capacidad de aprovechar productos alternativos.',
      resumen: 'Una fintech tolera mejor ingresos variables si ve movimiento frecuente y pagos al día, pero observa tu dependencia del crédito.',
      señalesClaves: fintechSignals,
    },
    {
      institutionType: 'estado',
      nombre: 'Estado / SII',
      headline: ids.has('sig_brecha_formalidad')
        ? 'Ponemos atención a la brecha entre lo que entra a tu cuenta y lo que se declara.'
        : 'Vemos coherencia entre tus ingresos bancarios y tributarios.',
      resumen: 'Desde la mirada del Estado, importa que tus ingresos bancarios y tributarios estén alineados.',
      señalesClaves: estadoSignals,
    },
  ]
}

function buildSimulationSuggestion(
  signals: EspejoSignal[]
): EspejoSimulationSuggestion | undefined {
  const ids = new Set(signals.map(s => s.id))
  if (!ids.has('sig_uso_cupo_alto') && !ids.has('sig_uso_cupo_medio')) return undefined

  const mejoran = (['sig_uso_cupo_alto', 'sig_liquidez_justa'] as string[]).filter(id => ids.has(id))

  return {
    accion: { tipo: 'reducir_uso_cupo', cantidadPct: 20 },
    descripcionAccion:
      'Si reduces en 20% el uso promedio de tu cupo de crédito, tendrás más margen a fin de mes y menos dependencia de la tarjeta para gastos corrientes.',
    señalesMejoran: mejoran,
    explicacion:
      'Con un uso de cupo más bajo, la señal de "Uso de cupo muy alto" deja de estar en rojo y tu liquidez mejora. Un banco verá un perfil menos presionado; una fintech tendrá más espacio para ofrecerte productos sin empujarte al límite.',
  }
}

export function buildEspejoFromProfile(
  profile: FinancialProfile,
  nombreDemo?: string,
  segmentoOverride?: Segmento
): EspejoResponse {
  const signals = extractSignals(profile)
  const lenses = buildLenses(profile, signals)
  const simulationSuggestion = buildSimulationSuggestion(signals)

  const segmento: Segmento =
    segmentoOverride ??
    (profile.ingresos.regularidad !== 'estable' ? 'emprendedora' : 'jubilado')

  const profileSummary: EspejoProfileSummary = {
    nombreDemo,
    segmento,
    ingresosMensuales: profile.ingresos.promedioMensual,
    ingresosRegularidad: profile.ingresos.regularidad,
    egresosMensuales: profile.egresos.promedioMensual,
    saldoPromedioFinMes: profile.liquidez.saldoPromedioFinMes,
    mesesConSaldoNegativo: profile.liquidez.mesesConSaldoNegativo,
    usoCupoPct: profile.credito.usoCupoEstimadoPct,
    tieneAvancesEfectivo: profile.credito.tieneAvancesEfectivo,
    tieneSobregiros: profile.credito.tieneSobregiros,
  }

  return { profileSummary, signals, lenses, simulationSuggestion }
}
