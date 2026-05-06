export default function EducacionPage() {
  const leyes = [
    {
      numero: 'Ley 18.010',
      titulo: 'Operaciones de crédito de dinero',
      desc: 'Establece la Tasa Máxima Convencional (TMC). Ningún banco ni fintech puede cobrarte más que ese límite. Si tu tasa lo supera, tienes derecho a reclamar.',
      url: 'https://www.bcn.cl/leychile/navegar?idNorma=29570',
      tag: 'TMC / Tasas',
    },
    {
      numero: 'Ley 20.555',
      titulo: 'SERNAC Financiero',
      desc: 'Regula los derechos del consumidor financiero. Obliga a las instituciones a entregarte información clara sobre tasas, comisiones y costos totales del crédito.',
      url: 'https://www.bcn.cl/leychile/navegar?idNorma=1022319',
      tag: 'Derechos / Transparencia',
    },
    {
      numero: 'Ley 19.496',
      titulo: 'Protección del Consumidor',
      desc: 'Base legal para presentar reclamos ante el SERNAC. Aplica a servicios financieros: tarjetas, créditos de consumo, cuentas bancarias.',
      url: 'https://www.bcn.cl/leychile/navegar?idNorma=61438',
      tag: 'Reclamos / SERNAC',
    },
    {
      numero: 'Ley 21.719',
      titulo: 'Protección de datos personales',
      desc: 'Nueva ley de datos (2024). Establece tu derecho a saber qué información financiera circula sobre ti y a solicitar su eliminación o corrección.',
      url: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272',
      tag: 'Datos / Privacidad',
    },
  ]

  const recursos = [
    {
      title: 'CMF Educa',
      url: 'https://www.cmfeduca.cl',
      desc: 'Educación financiera de la Comisión para el Mercado Financiero. Simuladores de crédito, comparadores de tasas y guías en lenguaje ciudadano.',
    },
    {
      title: 'SERNAC Financiero — Reclamos',
      url: 'https://www.sernac.cl/portal/604/w3-channel.html',
      desc: 'Presenta reclamos contra bancos, fintechs y multitiendas. Gratuito, sin abogado.',
    },
    {
      title: 'CMF — Registro instituciones',
      url: 'https://www.cmfchile.cl/instituciones',
      desc: 'Verifica si una institución financiera está autorizada a operar en Chile antes de contratar.',
    },
    {
      title: 'BCN — Ley Chile',
      url: 'https://www.bcn.cl/leychile',
      desc: 'Texto completo y actualizado de todas las leyes chilenas vigentes.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Educación Financiera</h1>
        <p className="text-gray-500 mt-2">
          Conoce las leyes que te protegen y los recursos oficiales para entender tu situación financiera.
        </p>
      </div>

      {/* Leyes clave */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Leyes que te protegen</h2>
        <div className="space-y-3">
          {leyes.map(l => (
            <a
              key={l.numero}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-blue-700">{l.numero} — {l.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1">{l.desc}</p>
                </div>
                <span className="shrink-0 text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded px-2 py-0.5 mt-0.5">
                  {l.tag}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Recursos externos */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Recursos oficiales</h2>
        <div className="space-y-3">
          {recursos.map(r => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-blue-700">{r.title}</p>
              <p className="text-sm text-gray-600 mt-1">{r.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400">
        Espejo de Datos no es asesoría legal ni financiera. Estos recursos son orientativos.
        Para casos específicos consulta un abogado o al SERNAC directamente.
      </p>
    </div>
  )
}
