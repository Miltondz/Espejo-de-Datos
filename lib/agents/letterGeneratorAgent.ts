import Anthropic from '@anthropic-ai/sdk'
import type { LeyReferencia } from '@/data/leyes-referencias'

export interface LetterGeneratorInput {
  tipoProblema: 'tasa_cercana_tmc' | 'cobro_no_autorizado' | 'portabilidad_credito' | string
  nombreInstitucion: string
  tipoProducto: 'tarjeta_credito' | 'credito_consumo' | 'cuenta_vista' | string
  segmento: 'emprendedora' | 'jubilado'
  nombreUsuario?: string
  rutUsuario?: string
  enableThinking?:  boolean
  enableCitations?: boolean
  ley?: LeyReferencia
}

const SYSTEM_BASE = `
# Rol
Eres LetterGeneratorAgent, un asistente que redacta borradores de cartas formales
en español para que personas en Chile ejerzan sus derechos como consumidores financieros.

# Restricciones
- Esto es un BORRADOR educativo, no asesoría legal individual.
- Incluye un aviso claro al inicio: "AVISO: Este borrador es educativo. Revísalo antes de enviarlo."
- La carta va en primera persona, tono formal pero claro y accesible.
- Pide respuesta en plazo de 10 días hábiles.
- No prometas resultados al usuario.

# Formato de salida
Devuelve SOLO el texto de la carta como string plano.
Sin JSON, sin markdown, sin etiquetas.
Empieza con "AVISO:" y luego con "Estimados señores de [institución]:".

# Estructura (4-6 párrafos)
1. Saludo e identificación del solicitante.
2. Descripción del producto y del problema detectado.
3. Solicitud concreta (revisión de tasa, información de cargos, portabilidad, etc.).
4. Marco legal aplicable.
5. Plazo de respuesta solicitado (10 días hábiles).
6. Despedida y firma.
`.trim()

const SYSTEM_WITH_CITATIONS = `
# Rol
Eres LetterGeneratorAgent, un asistente que redacta borradores de cartas formales
en español para que personas en Chile ejerzan sus derechos como consumidores financieros.

# Restricciones
- Esto es un BORRADOR educativo, no asesoría legal individual.
- Incluye un aviso claro al inicio: "AVISO: Este borrador es educativo. Revísalo antes de enviarlo."
- La carta va en primera persona, tono formal pero claro y accesible.
- Pide respuesta en plazo de 10 días hábiles.
- No prometas resultados al usuario.
- Usa el documento legal proporcionado para fundamentar la solicitud con citas precisas.

# Formato de salida
Devuelve SOLO el texto de la carta como string plano.
Sin JSON, sin markdown, sin etiquetas.
Empieza con "AVISO:" y luego con "Estimados señores de [institución]:".

# Estructura (4-6 párrafos)
1. Saludo e identificación del solicitante.
2. Descripción del producto y del problema detectado.
3. Solicitud concreta fundamentada en la ley provista.
4. Cita específica del marco legal aplicable (usa el texto del documento).
5. Plazo de respuesta solicitado (10 días hábiles).
6. Despedida y firma.
`.trim()

export const LETTER_GENERATOR_SYSTEM_PROMPT = SYSTEM_BASE

const client = new Anthropic()

function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter(b => b.type === 'text')
    .map(b => (b as Anthropic.TextBlock).text)
    .join('')
}

export async function callLetterGeneratorAgent(
  input: LetterGeneratorInput
): Promise<{ cartaTexto: string; modoUsado: string }> {
  const useThinking  = input.enableThinking  ?? false
  const useCitations = input.enableCitations ?? false

  const systemPrompt = useCitations ? SYSTEM_WITH_CITATIONS : SYSTEM_BASE
  const model = useThinking ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'

  // Build user content — include law document when citations enabled
  const userContent: Anthropic.MessageParam['content'] = []

  if (useCitations && input.ley) {
    userContent.push({
      type: 'document',
      source: { type: 'text', media_type: 'text/plain', data: input.ley.extracto },
      title: input.ley.nombre,
      citations: { enabled: true },
    } as unknown as Anthropic.TextBlockParam)
  }

  userContent.push({
    type: 'text',
    text: JSON.stringify({
      tipoProblema:      input.tipoProblema,
      nombreInstitucion: input.nombreInstitucion,
      tipoProducto:      input.tipoProducto,
      segmento:          input.segmento,
      nombreUsuario:     input.nombreUsuario,
      rutUsuario:        input.rutUsuario,
    }),
  })

  const baseParams = {
    model,
    max_tokens: useThinking ? 6000 : 2048,
    system: [{ type: 'text' as const, text: systemPrompt, cache_control: { type: 'ephemeral' as const } }],
    messages: [{ role: 'user' as const, content: userContent }],
  }

  const betas: string[] = []
  if (useThinking) betas.push('interleaved-thinking-2025-05-14')

  const finalParams = useThinking
    ? { ...baseParams, thinking: { type: 'enabled' as const, budget_tokens: 2048 } }
    : baseParams

  const requestOpts = betas.length > 0
    ? { headers: { 'anthropic-beta': betas.join(',') } }
    : undefined

  const response = await client.messages.create(finalParams, requestOpts)

  const cartaTexto = extractText(response.content)
  if (!cartaTexto) throw new Error('LetterGeneratorAgent: no text block')

  const modoUsado = [
    model,
    useThinking  ? 'extended-thinking' : null,
    useCitations ? 'citations'         : null,
  ].filter(Boolean).join(' · ')

  return { cartaTexto, modoUsado }
}
