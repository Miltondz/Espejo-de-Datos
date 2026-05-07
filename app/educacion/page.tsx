import Link from 'next/link'

const glosario = [
  {
    termino: 'DTI — Deuda sobre ingresos',
    definicion: 'El porcentaje de tus ingresos mensuales que ya va comprometido pagando deudas. Por encima del 50%, los bancos lo marcan como riesgo.',
    ejemplo: 'Ganas $800.000 y pagas $450.000 en cuotas → DTI = 56%.',
  },
  {
    termino: 'Cupo de crédito',
    definicion: 'El límite máximo de tu tarjeta. Usar más del 70% es señal de presión financiera para bancos y fintechs.',
    ejemplo: 'Cupo $500.000, deuda $420.000 → uso 84% → señal en rojo.',
  },
  {
    termino: 'TMC — Tasa Máxima Convencional',
    definicion: 'El límite legal de interés anual que cualquier institución puede cobrarte. La CMF lo fija mensualmente. Superarlo es ilegal.',
    ejemplo: 'Si la TMC es 36% anual y tu crédito cobra 40%, tienes derecho a reclamar ante el SERNAC.',
  },
  {
    termino: 'Avance de efectivo',
    definicion: 'Sacar plata en efectivo con la tarjeta de crédito. Tiene la tasa más alta de cualquier producto bancario — muchas veces cerca de la TMC.',
    ejemplo: 'Un avance de $100.000 puede costarte $8.000 extra solo en intereses el primer mes.',
  },
  {
    termino: 'Brecha de formalidad',
    definicion: 'La diferencia entre lo que recibes en tu cuenta y lo que declaras al SII. Una brecha alta limita tu acceso a crédito formal.',
    ejemplo: 'Recibes $700.000 pero el SII ve $300.000 declarados → los bancos evalúan sobre los $300.000.',
  },
  {
    termino: 'Sobregiro',
    definicion: 'Cuando tu cuenta queda en negativo — el banco pagó por ti. Es caro y afecta tu historial.',
    ejemplo: 'Saldo $0, pago de $30.000 automático → cuenta queda en -$30.000 → el banco cobra interés sobre ese saldo.',
  },
  {
    termino: 'TPM — Tasa de Política Monetaria',
    definicion: 'La tasa base del Banco Central. Cuando sube, todos los créditos se encarecen. Cuando baja, los créditos se abaratan.',
    ejemplo: 'Con TPM en 5%, un crédito de consumo puede estar en 20–30%. Con TPM en 2%, baja considerablemente.',
  },
  {
    termino: 'Score crediticio',
    definicion: 'Puntaje interno que usan bancos y fintechs para decidir si te prestan. No existe un número único — cada institución tiene el suyo y no están obligados a mostrártelo.',
    ejemplo: 'El Espejo no calcula tu score, pero muestra las señales que más lo afectan.',
  },
]

const leyes = [
  {
    numero: 'Ley 18.010',
    titulo: 'Operaciones de crédito de dinero',
    desc: 'Establece la Tasa Máxima Convencional (TMC). Ningún banco ni fintech puede cobrarte más que ese límite. Si tu tasa lo supera, tienes derecho a reclamar.',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=29570',
    tag: 'TMC / Tasas',
    color: 'bg-red-50 border-red-200 text-red-700',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    numero: 'Ley 20.555',
    titulo: 'SERNAC Financiero',
    desc: 'Regula los derechos del consumidor financiero. Obliga a las instituciones a entregarte información clara sobre tasas, comisiones y costos totales del crédito.',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1022319',
    tag: 'Derechos / Transparencia',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    numero: 'Ley 19.496',
    titulo: 'Protección del Consumidor',
    desc: 'Base legal para presentar reclamos ante el SERNAC. Aplica a servicios financieros: tarjetas, créditos de consumo, cuentas bancarias.',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=61438',
    tag: 'Reclamos / SERNAC',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    numero: 'Ley 21.236',
    titulo: 'Portabilidad financiera',
    desc: 'Permite cambiar tu deuda de un banco a otro que ofrezca mejores condiciones. El banco actual debe facilitar el proceso sin cobros adicionales.',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1155491',
    tag: 'Portabilidad',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    numero: 'Ley 21.719',
    titulo: 'Protección de datos personales',
    desc: 'Nueva ley de datos (2024). Establece tu derecho a saber qué información financiera circula sobre ti y a solicitar su eliminación o corrección.',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272',
    tag: 'Datos / Privacidad',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
]

const recursos = [
  {
    title: 'CMF Educa',
    url: 'https://www.cmfeduca.cl',
    desc: 'Educación financiera oficial de la CMF. Simuladores de crédito, comparadores de tasas y guías en lenguaje ciudadano.',
    icon: '🏛️',
  },
  {
    title: 'SERNAC — Presentar reclamo',
    url: 'https://www.sernac.cl/portal/604/w3-channel.html',
    desc: 'Reclama ante bancos, fintechs y multitiendas. Gratuito, sin necesitar abogado.',
    icon: '📋',
  },
  {
    title: 'CMF — Registro de instituciones',
    url: 'https://www.cmfchile.cl/instituciones',
    desc: 'Verifica si una institución financiera está autorizada a operar en Chile antes de contratar.',
    icon: '✅',
  },
  {
    title: 'BCN — Ley Chile',
    url: 'https://www.bcn.cl/leychile',
    desc: 'Texto completo y actualizado de todas las leyes chilenas vigentes, incluyendo las financieras.',
    icon: '📜',
  },
]

export default function EducacionPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Educación Financiera</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Conoce las leyes que te protegen como consumidor financiero y los recursos oficiales para
          entender — y mejorar — tu situación.
        </p>
      </div>

      {/* Glosario */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Glosario ciudadano</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Los términos que los bancos usan — explicados sin jerga
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {glosario.map(g => (
            <div
              key={g.termino}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2"
            >
              <p className="font-bold text-sm text-gray-900">{g.termino}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{g.definicion}</p>
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 leading-relaxed">
                <span className="font-semibold text-slate-600">Ej: </span>{g.ejemplo}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leyes */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Leyes que te protegen</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Marco legal vigente en Chile para consumidores financieros
          </p>
        </div>
        <div className="space-y-3">
          {leyes.map(l => (
            <a
              key={l.numero}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${l.color.split(' ')[1]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${l.color.split(' ')[2]}`}>
                    {l.numero}
                  </p>
                  <p className="font-semibold text-gray-900 mt-0.5">{l.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{l.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.tagColor}`}>
                    {l.tag}
                  </span>
                  <span className="text-xs text-gray-400">↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recursos oficiales</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Organismos y portales del Estado para ejercer tus derechos
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recursos.map(r => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-3"
            >
              <span className="text-2xl shrink-0" aria-hidden="true">{r.icon}</span>
              <div>
                <p className="font-semibold text-blue-700 text-sm">{r.title}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Espejo */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <p className="font-semibold text-blue-900">¿Tienes una señal legal en tu Espejo?</p>
          <p className="text-sm text-blue-700 mt-0.5">
            El Espejo puede generar un borrador de carta fundamentado en estas leyes para que
            puedas ejercer tus derechos.
          </p>
        </div>
        <Link
          href="/analizador"
          className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Ir al Espejo →
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Espejo de Datos no es asesoría legal ni financiera. Los recursos y leyes aquí indicados son
        orientativos. Para casos específicos, consulta directamente al SERNAC, la CMF o un abogado.
      </p>
    </div>
  )
}
