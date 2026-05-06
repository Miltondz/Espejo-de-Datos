import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const pct: number = body.hypothesis?.reducirUsoCupoPct ?? 20

    return NextResponse.json({
      simulationSuggestion: {
        accion: { tipo: 'reducir_uso_cupo', cantidadPct: pct },
        descripcionAccion: `Si reduces en ${pct}% el uso promedio de tu cupo de crédito, tendrás más margen a fin de mes y menos dependencia de la tarjeta para gastos corrientes.`,
        señalesMejoran: ['sig_uso_cupo_alto', 'sig_liquidez_justa'],
        explicacion: `Con un uso de cupo ${pct}% más bajo, la señal de "Uso de cupo muy alto" deja de estar en rojo y tu liquidez mejora. Un banco verá un perfil menos presionado; una fintech tendrá más espacio para ofrecerte productos sin empujarte al límite.`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error al simular' }, { status: 500 })
  }
}
