import { NextRequest, NextResponse } from 'next/server'
import { getFinancialProfileFromMock } from '@/lib/data-adapter'
import { buildEspejoFromProfile } from '@/lib/espejo-builder'
import type { Segmento } from '@/types/espejo'

interface AnalyzeRequest {
  mode: 'demo'
  demoId: 'paula' | 'luis'
  segmento?: Segmento
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json()

    if (body.mode !== 'demo' || !['paula', 'luis'].includes(body.demoId)) {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const profile = getFinancialProfileFromMock(body.demoId)
    const nombreDemo = body.demoId === 'paula' ? 'Paula' : 'Luis'
    const espejo = buildEspejoFromProfile(profile, nombreDemo, body.segmento)

    return NextResponse.json(espejo)
  } catch {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud. Intenta nuevamente.' },
      { status: 500 }
    )
  }
}
