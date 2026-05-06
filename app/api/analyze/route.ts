import { NextRequest, NextResponse } from 'next/server'
import { getFinancialProfileFromMock } from '@/lib/data-adapter'
import { buildEspejoFromProfile } from '@/lib/espejo-builder'
import { callMirrorBuilderAgent } from '@/lib/agents/mirrorBuilderAgent'
import type { Segmento } from '@/types/espejo'

interface AnalyzeRequest {
  mode: 'demo'
  demoId: 'paula' | 'luis'
  segmento?: Segmento
}

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 })
  }

  if (body.mode !== 'demo' || !['paula', 'luis'].includes(body.demoId)) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const nombreDemo = body.demoId === 'paula' ? 'Paula' : 'Luis'
  const segmento: Segmento = body.segmento ?? (body.demoId === 'paula' ? 'emprendedora' : 'jubilado')
  const hoy = new Date().toISOString().slice(0, 10)

  // Ruta principal: agente
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const espejo = await callMirrorBuilderAgent({
        task: 'build_espejo',
        segmento,
        demoNombre: nombreDemo,
        cartola: { filePath: `demo://${body.demoId}` },
        fechaReferencia: hoy,
      })
      // Asegurar nombreDemo en profileSummary
      espejo.profileSummary.nombreDemo = nombreDemo
      return NextResponse.json(espejo)
    } catch (err) {
      console.error('[/api/analyze] Agente falló, usando fallback determinista:', err)
    }
  }

  // Fallback determinista (sin API key o si el agente falla)
  const profile = getFinancialProfileFromMock(body.demoId)
  const espejo = buildEspejoFromProfile(profile, nombreDemo, segmento)
  return NextResponse.json(espejo)
}
