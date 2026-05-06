/**
 * GET /api/debug/trace
 * Runs MirrorBuilderAgent for Paula and returns the full agentic loop trace:
 * each tool call, its input, output summary, and elapsed time.
 * For hackathon jury submission screenshot only.
 */
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { MIRROR_TOOLS, executeTool } from '@/lib/agents/toolImplementations'
import { MIRROR_BUILDER_SYSTEM_PROMPT } from '@/lib/agents/mirrorBuilderAgent'

export interface ToolCallTrace {
  round:     number
  tool:      string
  inputSummary: string
  outputSummary: string
  elapsedMs: number
  status:    'ok' | 'error'
}

export interface AgentTraceResponse {
  model:      string
  demoId:     string
  totalMs:    number
  rounds:     number
  trace:      ToolCallTrace[]
  finalSignals: Array<{ id: string; tipo: string; titulo: string }>
  success:    boolean
  error?:     string
}

function summarizeInput(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case 'parse_cartola':
      return `file_path: "${input.file_path}"`
    case 'fetch_macro_indicators':
      return `fecha_referencia: "${input.fecha_referencia}"`
    case 'build_financial_profile':
      return `transacciones: ${(input.transacciones as unknown[])?.length ?? '?'} items, periodoMeses: ${input.periodoMeses}`
    case 'extract_signals':
      return `financial_profile.ingresos.regularidad: "${(input.financial_profile as Record<string,unknown> & {ingresos?:{regularidad?:string}})?.ingresos?.regularidad}"`
    case 'generate_lenses':
      return `signals: ${(input.signals as unknown[])?.length ?? '?'} señales`
    case 'simulate_change':
      return `action: ${JSON.stringify(input.action)}`
    default:
      return JSON.stringify(input).slice(0, 120)
  }
}

function summarizeOutput(name: string, output: unknown): string {
  try {
    const o = output as Record<string, unknown>
    switch (name) {
      case 'parse_cartola':
        return `${(o.transacciones as unknown[])?.length} transacciones, ${o.periodoMeses} meses, instituciones: [${(o.institucionesDetectadas as string[])?.join(', ')}]`
      case 'fetch_macro_indicators':
        return `UF: $${(o.ufValor as number)?.toLocaleString('es-CL')}, IPC: ${o.ipcUltimoMesPct}%, TPM: ${o.tpmPct}%, TMC: ${o.tmcPct}%, USD/CLP: ${o.usdClp ?? 'n/a'}`
      case 'build_financial_profile': {
        const p = o as Record<string, Record<string, unknown>>
        return `ingresos: $${(p.ingresos?.promedioMensual as number)?.toLocaleString('es-CL')}/mes, presión: ${p.liquidez?.presion}, usoCupo: ${p.credito?.usoCupoEstimadoPct}%`
      }
      case 'extract_signals':
        return `${(o.signals as unknown[])?.length} señales: ${(o.signals as Array<{id:string}>)?.map(s => s.id).join(', ')}`
      case 'generate_lenses':
        return `3 lentes: ${(o.lenses as Array<{institutionType:string}>)?.map(l => l.institutionType).join(', ')}`
      default:
        return JSON.stringify(output).slice(0, 200)
    }
  } catch {
    return String(output).slice(0, 200)
  }
}

export async function GET() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 403 })
  }

  const startTotal = Date.now()
  const client = new Anthropic()
  const trace: ToolCallTrace[] = []
  let round = 0

  const messages: Anthropic.MessageParam[] = [{
    role: 'user',
    content: JSON.stringify({
      task: 'build_espejo',
      segmento: 'emprendedora',
      demoNombre: 'Paula',
      cartola: { filePath: 'demo://paula' },
      fechaReferencia: new Date().toISOString().slice(0, 10),
    }),
  }]

  try {
    for (let i = 0; i < 10; i++) {
      round = i + 1
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: MIRROR_BUILDER_SYSTEM_PROMPT,
        tools: MIRROR_TOOLS,
        messages,
      })

      if (response.stop_reason === 'end_turn') {
        const textBlock = response.content.find(b => b.type === 'text')
        const raw = textBlock?.type === 'text' ? textBlock.text : ''
        const j1 = raw.indexOf('{'), j2 = raw.lastIndexOf('}')
        const parsed = j1 !== -1 ? JSON.parse(raw.slice(j1, j2 + 1)) : null

        return NextResponse.json({
          model: 'claude-sonnet-4-6',
          demoId: 'paula',
          totalMs: Date.now() - startTotal,
          rounds: round,
          trace,
          finalSignals: (parsed?.signals ?? []).map((s: {id:string; tipo:string; titulo:string}) => ({
            id: s.id, tipo: s.tipo, titulo: s.titulo,
          })),
          success: !!parsed,
        } satisfies AgentTraceResponse)
      }

      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content })
        const toolResults: Anthropic.ToolResultBlockParam[] = []

        for (const block of response.content) {
          if (block.type !== 'tool_use') continue
          const t0 = Date.now()
          try {
            const result = await executeTool(block.name, block.input as Record<string, unknown>)
            const elapsedMs = Date.now() - t0
            trace.push({
              round,
              tool: block.name,
              inputSummary: summarizeInput(block.name, block.input as Record<string, unknown>),
              outputSummary: summarizeOutput(block.name, result),
              elapsedMs,
              status: 'ok',
            })
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) })
          } catch (err) {
            trace.push({
              round,
              tool: block.name,
              inputSummary: summarizeInput(block.name, block.input as Record<string, unknown>),
              outputSummary: `ERROR: ${String(err)}`,
              elapsedMs: Date.now() - t0,
              status: 'error',
            })
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: `Error: ${String(err)}`, is_error: true })
          }
        }
        messages.push({ role: 'user', content: toolResults })
      }
    }

    return NextResponse.json({
      model: 'claude-sonnet-4-6',
      demoId: 'paula',
      totalMs: Date.now() - startTotal,
      rounds: round,
      trace,
      finalSignals: [],
      success: false,
      error: 'Loop agéntico no completó en 10 rondas',
    } satisfies AgentTraceResponse)

  } catch (err) {
    return NextResponse.json({
      model: 'claude-sonnet-4-6',
      demoId: 'paula',
      totalMs: Date.now() - startTotal,
      rounds: round,
      trace,
      finalSignals: [],
      success: false,
      error: String(err),
    } satisfies AgentTraceResponse)
  }
}
