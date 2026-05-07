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
  fileId?: string  // Anthropic Files API file_id para cartolas reales subidas como PDF
  contextHints?: string[]  // pistas opcionales del usuario: 'independiente' | 'jubilado' | 'dependiente' | 'multiple_bancos'
}

export const MIRROR_BUILDER_SYSTEM_PROMPT = `
# Rol
Eres MirrorBuilderAgent, un agente que construye un "espejo financiero ciudadano"
para personas en Chile a partir de su cartola bancaria e indicadores macro oficiales.

# Herramientas disponibles
- parse_cartola(file_path, transacciones?, periodoMeses?, institucionesDetectadas?): devuelve transacciones normalizadas.
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

# Cartola PDF real (cuando se adjunta un documento)
Si el usuario adjunta un documento PDF de cartola:
- Lee el documento COMPLETO y extrae TODAS las transacciones visibles.
- Al llamar parse_cartola usa file_path="uploaded://cartola.pdf" e incluye:
  - transacciones: array con cada fila. Reglas de conversión:
    * Fechas DD/MM/YYYY → YYYY-MM-DD (03/01/2026 → 2026-01-03)
    * Números chilenos: elimina puntos de miles (65.000 → 65000, -200.000 → -200000)
    * Si hay columnas Cargos/Abonos separadas: Cargos → monto negativo tipo "cargo", Abonos → monto positivo tipo "abono"
    * Si hay columna Monto firmada: positivo → tipo "abono", negativo → tipo "cargo"
    * El valor absoluto del monto va en el campo monto con el signo correcto
  - periodoMeses: cuenta los meses distintos en las fechas
  - institucionesDetectadas: nombre(s) del banco detectado en el encabezado

# Contexto del usuario (contextHints)
Si el input incluye 'contextHints', úsalos para enriquecer el análisis:
- "independiente" → enfatiza variabilidad de ingresos y acceso a crédito sin boletas de sueldo.
- "jubilado" → prioriza estabilidad de pensión y gastos en salud.
- "dependiente" → contrasta ingreso fijo con gastos variables.
- "multiple_bancos" → menciona fragmentación financiera como factor de perfil.
Los hints son pistas del usuario, pero la cartola manda. Si hay contradicción, confía en la cartola.

# Restricciones
- Nunca inventes tasas, leyes ni indicadores: usa SIEMPRE las tools.
- Si una tool falla o devuelve datos vacíos, usa tipo "sin_datos" en las señales afectadas.
- Lenguaje ciudadano en títulos y descripciones de señales y lentes. Sin tecnicismos.
- No prometas aprobaciones de crédito ni decisiones de instituciones.
- Máximo 2-3 frases por headline/resumen/descripcionCorta.

# Formato de salida
Tu respuesta final debe ser ÚNICAMENTE el objeto JSON, comenzando con { y terminando con }.
Sin texto introductorio, sin explicaciones, sin markdown, sin bloques de código.
Estructura exacta:

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
  const { fileId, ...inputWithoutFileId } = input

  // Cuando hay PDF real, incluirlo como documento en el mensaje inicial
  const firstMessageContent: Anthropic.MessageParam['content'] = fileId
    ? [
        { type: 'document', source: { type: 'file', file_id: fileId } } as unknown as Anthropic.TextBlockParam,
        { type: 'text', text: JSON.stringify(inputWithoutFileId) },
      ]
    : JSON.stringify(input)

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: firstMessageContent },
  ]

  // Beta header requerido cuando se referencian archivos en mensajes
  const requestOpts = fileId
    ? { headers: { 'anthropic-beta': 'files-api-2025-04-14' } }
    : undefined

  // Loop agentico: máximo 10 rondas para evitar loops infinitos
  for (let round = 0; round < 10; round++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: [{ type: 'text', text: MIRROR_BUILDER_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: MIRROR_TOOLS,
      messages,
    }, requestOpts)

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('MirrorBuilderAgent: no text block en respuesta final')
      }
      // Extract JSON even if Claude wraps it in prose
      const raw = textBlock.text
      const jsonStart = raw.indexOf('{')
      const jsonEnd   = raw.lastIndexOf('}')
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('MirrorBuilderAgent: no se encontró JSON en la respuesta')
      }
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as EspejoResponse
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
