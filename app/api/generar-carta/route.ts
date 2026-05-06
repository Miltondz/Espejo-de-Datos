import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const institucion: string = body.nombreInstitucion ?? '[Institución]'
    const producto: string = body.tipoProducto ?? 'producto financiero'

    const carta = `Estimados señores de ${institucion},

Me dirijo a ustedes para solicitar información y revisión sobre las condiciones de mi ${producto}.

He identificado, a través de una herramienta educativa, que la tasa de interés aplicada a mi producto podría estar cercana al máximo legal permitido en Chile (Tasa Máxima Convencional, regulada por la CMF). En virtud de la Ley N° 18.010 y la normativa vigente, solicito respetuosamente que me entreguen el detalle de los cobros realizados y la tasa efectiva anual aplicada al día de hoy.

Solicito también confirmar si existe algún cargo adicional que no haya sido informado en el contrato original.

Quedo a disposición para aclarar cualquier duda al respecto.

Sin otro particular, saluda atentamente,

[Tu nombre]
[RUT opcional]
[Fecha]

---
Este borrador fue generado por Espejo de Datos con fines educativos.
Revísalo antes de enviarlo. Para asesoría gratuita: SERNAC (sernac.cl) o CMF Educa (cmfeduca.cl).`

    return NextResponse.json({ cartaTexto: carta })
  } catch {
    return NextResponse.json({ error: 'Error al generar carta' }, { status: 500 })
  }
}
