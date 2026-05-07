import Anthropic from '@anthropic-ai/sdk'
import type { EspejoSimulationSuggestion, EspejoSignal, Segmento } from '@/types/espejo'
import type { FinancialProfile } from '@/types/profile'
import { SIMULATION_TOOLS, executeTool } from './toolImplementations'

export interface ActionPlannerInput {
  task: 'plan_simulation'
  segmento: Segmento
  goal: string
  financialProfile: FinancialProfile
  signals: EspejoSignal[]
  hypothesis: {
    reducirUsoCupoPct?: number
    formalizarVentasPct?: number
    aumentarSaldoFinMes?: number
  }
}

export const ACTION_PLANNER_SYSTEM_PROMPT = `
# Rol
Eres ActionPlannerAgent, un agente educativo que ayuda a entender qué cambiaría
en el espejo financiero si la persona modifica un comportamiento concreto.

# Herramientas disponibles
- simulate_change(financial_profile, action): aplica una acción y devuelve
  newProfile + changedSignals.

# Pasos
1. Lee la hipótesis y elige UNA acción concreta:
   - Si "reducirUsoCupoPct" presente → tipo "reducir_uso_cupo", cantidadPct = valor.
   - Si "formalizarVentasPct" presente → tipo "formalizar_ingresos", cantidadPct = valor.
   - Si "aumentarSaldoFinMes" presente → tipo "aumentar_saldo_fin_mes", cantidadPct = 0.
2. Llama simulate_change con el financial_profile y la acción elegida.
3. Identifica qué señales cambian positivamente (changedSignals) — usa los IDs del campo changedSignals del resultado de simulate_change.
4. Genera explicación en 2-4 frases cubriendo la mirada de Banco, Fintech y Estado.

# Restricciones
- No inventes campos del perfil.
- No emitas asesoría financiera.
- Lenguaje ciudadano, tono respetuoso.
- Solo una acción simulada (la de mayor impacto).

# Formato de salida
Tu respuesta final debe ser ÚNICAMENTE el objeto JSON, comenzando con { y terminando con }.
Sin texto introductorio, sin explicaciones, sin markdown, sin bloques de código.
Estructura exacta:

{
  "accion": { "tipo": string, "cantidadPct": number },
  "descripcionAccion": string,
  "señalesMejoran": ["sig_uso_cupo_alto", "sig_liquidez_justa"],
  "explicacion": string
}

El campo "señalesMejoran" SIEMPRE debe ser un array de strings con IDs de señales (puede ser vacío []).
Ejemplo válido: ["sig_uso_cupo_alto"] o [].
`.trim()

const client = new Anthropic()

export async function callActionPlannerAgent(
  input: ActionPlannerInput
): Promise<EspejoSimulationSuggestion> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: JSON.stringify(input) },
  ]

  for (let round = 0; round < 5; round++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: [{ type: 'text', text: ACTION_PLANNER_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: SIMULATION_TOOLS,
      messages,
    })

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('ActionPlannerAgent: no text block')
      }
      const raw = textBlock.text
      const jsonStart = raw.indexOf('{')
      const jsonEnd   = raw.lastIndexOf('}')
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('ActionPlannerAgent: no se encontró JSON en la respuesta')
      }
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as EspejoSimulationSuggestion
      if (!parsed.accion || !parsed.descripcionAccion || !parsed.explicacion) {
        throw new Error('ActionPlannerAgent: campos requeridos ausentes')
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

  throw new Error('ActionPlannerAgent: no completó el loop agentico')
}
