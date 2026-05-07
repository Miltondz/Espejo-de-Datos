import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getFinancialProfileFromMock } from '@/lib/data-adapter'
import { buildEspejoFromProfile, buildSimulationSuggestion } from '@/lib/espejo-builder'
import { callMirrorBuilderAgent } from '@/lib/agents/mirrorBuilderAgent'
import type { Segmento } from '@/types/espejo'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    return handleUpload(req)
  }
  return handleDemo(req)
}

// ─── Modo demo (JSON) ──────────────────────────────────────────────────────

async function handleDemo(req: NextRequest) {
  let body: { mode: string; demoId: string; segmento?: Segmento }

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

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const espejo = await callMirrorBuilderAgent({
        task: 'build_espejo',
        segmento,
        demoNombre: nombreDemo,
        cartola: { filePath: `demo://${body.demoId}` },
        fechaReferencia: hoy,
      })
      espejo.profileSummary.nombreDemo = nombreDemo
      if (!espejo.simulationSuggestion) {
        espejo.simulationSuggestion = buildSimulationSuggestion(espejo.signals)
      }
      return NextResponse.json(espejo)
    } catch (err) {
      console.error('[/api/analyze] Agente falló, usando fallback determinista:', err)
    }
  }

  const profile = getFinancialProfileFromMock(body.demoId as 'paula' | 'luis')
  const espejo = buildEspejoFromProfile(profile, nombreDemo, segmento)
  return NextResponse.json(espejo)
}

// ─── Modo upload PDF (FormData + Files API) ────────────────────────────────

async function handleUpload(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 403 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'FormData inválido' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const segmento = (formData.get('segmento') as Segmento | null) ?? 'emprendedora'

  if (!file) {
    return NextResponse.json({ error: 'Se requiere un archivo PDF' }, { status: 400 })
  }
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Solo se aceptan archivos PDF' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'El archivo no puede superar 5 MB' }, { status: 400 })
  }

  const anthropic = new Anthropic()
  let fileId: string | null = null

  try {
    // 1. Subir PDF a Files API de Anthropic
    const arrayBuffer = await file.arrayBuffer()
    const uploadedFile = await anthropic.beta.files.upload(
      { file: new File([arrayBuffer], file.name, { type: 'application/pdf' }) },
      { headers: { 'anthropic-beta': 'files-api-2025-04-14' } },
    )
    fileId = uploadedFile.id
    console.log(`[/api/analyze] PDF subido a Files API: ${fileId}`)

    // 2. Correr MirrorBuilderAgent con el fileId
    const hoy = new Date().toISOString().slice(0, 10)
    const espejo = await callMirrorBuilderAgent({
      task: 'build_espejo',
      segmento,
      cartola: { filePath: `uploaded://${file.name}` },
      fechaReferencia: hoy,
      fileId,
    })

    if (!espejo.simulationSuggestion) {
      espejo.simulationSuggestion = buildSimulationSuggestion(espejo.signals)
    }

    return NextResponse.json(espejo)

  } catch (err) {
    console.error('[/api/analyze] Upload falló:', err)
    return NextResponse.json(
      { error: 'No se pudo analizar la cartola. Verifica que el PDF tenga texto seleccionable.' },
      { status: 500 },
    )
  } finally {
    // 3. Eliminar el archivo de Files API — privacidad: no persiste
    if (fileId) {
      try {
        await anthropic.beta.files.delete(fileId,
          { headers: { 'anthropic-beta': 'files-api-2025-04-14' } } as Parameters<typeof anthropic.beta.files.delete>[1],
        )
        console.log(`[/api/analyze] Archivo eliminado de Files API: ${fileId}`)
      } catch {
        console.error('[/api/analyze] No se pudo eliminar archivo de Files API:', fileId)
      }
    }
  }
}
