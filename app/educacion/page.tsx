export default function EducacionPage() {
  const recursos = [
    {
      title: 'CMF Educa',
      url: 'https://www.cmfeduca.cl',
      desc: 'Educación financiera de la Comisión para el Mercado Financiero.',
    },
    {
      title: 'SERNAC Financiero',
      url: 'https://www.sernac.cl/portal/604/w3-channel.html',
      desc: 'Reclamos y derechos del consumidor financiero.',
    },
    {
      title: 'BCN — Ley Chile',
      url: 'https://www.bcn.cl/leychile',
      desc: 'Consulta leyes vigentes: Ley 18.010 (créditos), Ley 21.719 (datos personales).',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Educación Financiera</h1>
      <p className="text-gray-500">
        Conoce tus derechos y accede a recursos oficiales para entender mejor tu situación financiera.
      </p>
      <div className="space-y-4">
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
    </div>
  )
}
