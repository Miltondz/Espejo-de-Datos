import Anthropic from '@anthropic-ai/sdk'
import type { EspejoResponse, Segmento } from '@/types/espejo'
import { MIRROR_TOOLS, executeTool } from './toolImplementations'

export interface MirrorBuilderInput {
  task: 'build_espejo'
  segmento: Segmento
  demoNombre?: string
  cartola: {
    filePath: string
    periodoEsperadoMeses?: number
  }
  fechaReferencia: string
}

export const MIRROR_BUILDER_SYSTEM_PROMPT = `
# Rol
Eres MirrorBuilderAgent, un agente que construye un "espejo financiero ciudadano"
para personas en Chile a partir de su cartola bancaria e indicadores macro oficiales.

# Herramientas disponibles
- parse_cartola(file_path): devuelve transacciones normalizadas.
- fetch_macro_indicators(fecha_referencia): devuelve UF, IPC y TPM.
- build_financial_profile(transacciones, periodoMeses, macro): devuelve FinancialProfile.
- extract_signals(financial_profile): devuelve señales canónicas.
- generate_lenses(financial_profile, signals): devuelve lentes Banco/Fintech/Estado.

# Pasos obligatorios (en orden)
1. Llama parse_cartola con el filePath del input.
2. Llama fetch_macro_indicators con fechaReferencia.
3. Llama build_financial_profile con los outputs anteriores.
4. Llama extract_signals con el financial_profile.
5. Llama generate_lenses con financial_profile + signals.
6. Con todos los resultados, ensambla y devuelve un JSON válido.

# Restricciones
- Nunca inventes tasas, leyes ni indicadores: usa SIEMPRE las tools.
- Si una tool falla o devuelve datos vacíos, usa tipo "sin_datos" en las señales afectadas.
- Lenguaje ciudadano en títulos y descripciones de señales y lentes. Sin tecnicismos.
- No prometas aprobaciones de crédito ni decisiones de instituciones.
- Máximo 2-3 frases por headline/resumen/descripcionCorta.

# Formato de salida
Devuelve SOLO un JSON válido con esta estructura exacta (sin markdown, sin texto extra):

{
  "profileSummary": {
    "nombreDemo": string | null,
    "segmento": "emprendedora" | "jubilado",
    "ingresosMensuales": number,
    "ingresosRegularidad": "estable" | "variable" | "irregular",
    "egresosMensuales": number,
    "saldoPromedioFinMes": number,
    "mesesConSaldoNegativo": number,
    "usoCupoPct": number,
    "tieneAvancesEfectivo": boolean,
    "tieneSobregiros": boolean
  },
  "signals": [{ "id": string, "familia": string, "tipo": string, "titulo": string, "descripcionCorta": string, "importancia": 1|2|3, "valorResumen": string, "esLegal": boolean }],
  "lenses": [{ "institutionType": string, "nombre": string, "headline": string, "resumen": string, "señalesClaves": [{ "signalId": string, "impacto": string, "comentario": string }] }]
}
`.trim()

const client = new Anthropic()

export async function callMirrorBuilderAgent(input: MirrorBuilderInput): Promise<EspejoResponse> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: JSON.stringify(input) },
  ]

  // Loop agentico: máximo 10 rondas para evitar loops infinitos
  for (let round = 0; round < 10; round++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: MIRROR_BUILDER_SYSTEM_PROMPT,
      tools: MIRROR_TOOLS,
      messages,
    })

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('MirrorBuilderAgent: no text block en respuesta final')
      }
      const parsed = JSON.parse(textBlock.text) as EspejoResponse
      if (!parsed.profileSummary || !Array.isArray(parsed.signals) || !Array.isArray(parsed.lenses)) {
        throw new Error('MirrorBuilderAgent: campos requeridos ausentes en respuesta')
      }
      return parsed
    }

    if (response.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: response.content })

      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          try {
            const result = await executeTool(block.name, block.input as Record<string, unknown>)
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) })
          } catch (err) {
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: `Error: ${String(err)}`, is_error: true })
          }
        }
      }
      messages.push({ role: 'user', content: toolResults })
      continue
    }

    break
  }

  throw new Error('MirrorBuilderAgent: no completó el loop agentico')
}
