import { NextRequest, NextResponse } from 'next/server'
import { callActionPlannerAgent } from '@/lib/agents/actionPlannerAgent'
import type { EspejoSignal, Segmento } from '@/types/espejo'
import type { FinancialProfile } from '@/types/profile'

interface SimulateRequest {
  segmento: Segmento
  goal: string
  hypothesis: { reducirUsoCupoPct?: number; formalizarVentasPct?: number; aumentarSaldoFinMes?: number }
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

  const pct = body.hypothesis?.reducirUsoCupoPct ?? 20

  // Ruta principal: agente (requiere API key + financialProfile)
  if (process.env.ANTHROPIC_API_KEY && body.financialProfile) {
    try {
      const suggestion = await callActionPlannerAgent({
        task: 'plan_simulation',
        segmento: body.segmento ?? 'emprendedora',
        goal: body.goal ?? 'mejorar_perfil',
        financialProfile: body.financialProfile,
        signals: body.signals ?? [],
        hypothesis: body.hypothesis,
      })
      return NextResponse.json({ simulationSuggestion: suggestion })
    } catch (err) {
      console.error('[/api/simulate] Agente falló, usando fallback determinista:', err)
    }
  }

  // Fallback determinista
  return NextResponse.json({
    simulationSuggestion: {
      accion: { tipo: 'reducir_uso_cupo', cantidadPct: pct },
      descripcionAccion: `Si reduces en ${pct}% el uso promedio de tu cupo de crédito, tendrás más margen a fin de mes y menos dependencia de la tarjeta para gastos corrientes.`,
      señalesMejoran: ['sig_uso_cupo_alto', 'sig_liquidez_justa'],
      explicacion: `Con un uso de cupo ${pct}% más bajo, la señal de "Uso de cupo muy alto" deja de estar en rojo y tu liquidez mejora. Un banco verá un perfil menos presionado; una fintech tendrá más espacio para ofrecerte productos sin empujarte al límite.`,
    },
  })
}
