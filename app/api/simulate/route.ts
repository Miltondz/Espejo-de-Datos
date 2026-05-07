import { NextRequest, NextResponse } from 'next/server'
import { callActionPlannerAgent } from '@/lib/agents/actionPlannerAgent'
import type { EspejoSignal, Segmento } from '@/types/espejo'
import type { FinancialProfile } from '@/types/profile'

interface SimulateRequest {
  segmento: Segmento
  goal: string
  hypothesis: { reducirUsoCupoPct?: number; formalizarVentasPct?: number; reducirAvances?: boolean; aumentarSaldoFinMes?: number }
  financialProfile?: FinancialProfile
  signals?: EspejoSignal[]
}

export async function POST(req: NextRequest) {
  let body: SimulateRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 })
  }

  const goal = body.goal ?? 'reducir_uso_cupo'
  const pct  = body.hypothesis?.reducirUsoCupoPct ?? body.hypothesis?.formalizarVentasPct ?? 20

  // Ruta principal: agente (requiere API key + al menos una señal)
  if (process.env.ANTHROPIC_API_KEY && (body.signals?.length ?? 0) > 0) {
    try {
      const suggestion = await callActionPlannerAgent({
        task: 'plan_simulation',
        segmento: body.segmento ?? 'emprendedora',
        goal,
        financialProfile: body.financialProfile,
        signals: body.signals ?? [],
        hypothesis: body.hypothesis,
      })
      return NextResponse.json({ simulationSuggestion: suggestion })
    } catch (err) {
      console.error('[/api/simulate] Agente falló, usando fallback determinista:', err)
    }
  }

  // Fallback determinista — responde según el goal enviado
  const FALLBACKS: Record<string, object> = {
    reducir_uso_cupo: {
      accion: { tipo: 'reducir_uso_cupo', cantidadPct: pct },
      descripcionAccion: `Si reduces en ${pct}% el uso promedio de tu cupo de crédito, tendrás más margen a fin de mes y menos dependencia de la tarjeta para gastos corrientes.`,
      señalesMejoran: ['sig_uso_cupo_alto', 'sig_liquidez_justa'],
      explicacion: `Con un uso de cupo ${pct}% más bajo, la señal de "Uso de cupo muy alto" deja de estar en rojo y tu liquidez mejora. Un banco verá un perfil menos presionado; una fintech tendrá más espacio para ofrecerte productos.`,
    },
    reducir_avances: {
      accion: { tipo: 'reducir_avances', cantidadPct: 100 },
      descripcionAccion: 'Si eliminas los avances de efectivo, dejarás de pagar la tasa más cara de cualquier producto bancario.',
      señalesMejoran: ['sig_avances_recurrentes', 'sig_liquidez_justa'],
      explicacion: 'Los avances de efectivo suelen tener tasas cercanas a la TMC (límite legal). Eliminarlos reduce tu costo financiero mensual y mejora tu perfil de riesgo ante bancos y fintechs.',
    },
    formalizar_ingresos: {
      accion: { tipo: 'formalizar_ingresos', cantidadPct: pct },
      descripcionAccion: `Si formalizas el ${pct}% de la brecha entre lo que recibes y lo que declaras, amplías tu acceso a crédito formal.`,
      señalesMejoran: ['sig_brecha_formalidad'],
      explicacion: `Con más ingresos declarados ante el SII, el sistema financiero puede evaluar tu capacidad real de pago. Esto mejora tu acceso a créditos de consumo y reduces la dependencia de productos informales o de alto costo.`,
    },
  }

  return NextResponse.json({
    simulationSuggestion: FALLBACKS[goal] ?? FALLBACKS['reducir_uso_cupo'],
  })
}
