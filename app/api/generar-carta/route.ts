import { NextRequest, NextResponse } from 'next/server'
import { callLetterGeneratorAgent } from '@/lib/agents/letterGeneratorAgent'
import { getLeyParaProblema } from '@/data/leyes-referencias'

interface CartaRequest {
  tipoProblema:      string
  nombreInstitucion: string
  tipoProducto:      string
  segmento:          'emprendedora' | 'jubilado'
  nombreUsuario?:    string
  rutUsuario?:       string
  enableThinking?:   boolean
  enableCitations?:  boolean
}

export async function POST(req: NextRequest) {
  let body: CartaRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 })
  }

  const tipoProblema = body.tipoProblema ?? 'tasa_cercana_tmc'

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const ley = (body.enableCitations ?? false) ? getLeyParaProblema(tipoProblema) : null

      const result = await callLetterGeneratorAgent({
        tipoProblema,
        nombreInstitucion: body.nombreInstitucion ?? '[Institución]',
        tipoProducto:      body.tipoProducto ?? 'crédito',
        segmento:          body.segmento ?? 'emprendedora',
        nombreUsuario:     body.nombreUsuario,
        rutUsuario:        body.rutUsuario,
        enableThinking:    body.enableThinking  ?? false,
        enableCitations:   body.enableCitations ?? false,
        ley:               ley ?? undefined,
      })
      return NextResponse.json(result)
    } catch (err) {
      console.error('[/api/generar-carta] Agente falló, usando fallback:', err)
    }
  }

  // Fallback determinista
  const inst = body?.nombreInstitucion ?? '[Institución]'
  const prod = body?.tipoProducto ?? 'producto financiero'

  const cartaTexto = `AVISO: Este borrador es educativo. Revísalo antes de enviarlo.

Estimados señores de ${inst}:

Me dirijo a ustedes para solicitar información y revisión sobre las condiciones de mi ${prod}.

He identificado, a través de una herramienta educativa, que la tasa de interés aplicada podría estar cercana al máximo legal permitido en Chile. En virtud de la legislación chilena vigente sobre derechos del consumidor financiero, solicito respetuosamente que me entreguen el detalle completo de los cobros realizados y la tasa efectiva anual aplicada.

Solicito también confirmar si existe algún cargo adicional no informado en el contrato original.

Espero su respuesta en un plazo de 10 días hábiles.

Sin otro particular, saluda atentamente,

[Tu nombre]
[RUT opcional]
[Fecha]

---
Para asesoría gratuita: SERNAC (sernac.cl) · CMF Educa (cmfeduca.cl)`

  return NextResponse.json({ cartaTexto, modoUsado: 'fallback-determinista' })
}
