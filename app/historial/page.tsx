import Link from 'next/link'

export default function HistorialPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Historial</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Guarda y compara tus análisis a lo largo del tiempo para ver tu progreso financiero.
        </p>
      </div>

      {/* Privacy-first explanation */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🔒</span>
          <h2 className="font-bold text-emerald-900">Privacidad primero</h2>
        </div>
        <p className="text-sm text-emerald-800 leading-relaxed">
          En el MVP de Espejo de Datos, <strong>tus datos no se guardan</strong> en ningún servidor.
          Cada análisis se procesa en memoria y se descarta al terminar. Esto es intencional: tu
          cartola contiene información muy sensible y protegerla es nuestra prioridad absoluta.
        </p>
        <p className="text-sm text-emerald-700">
          El historial requiere almacenamiento voluntario y cifrado — lo construiremos en la
          siguiente versión, siempre con tu consentimiento explícito.
        </p>
      </div>

      {/* What comes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">En la próxima versión</p>
        <ul className="space-y-3 text-sm text-gray-600">
          {[
            'Guarda tu Espejo con un solo clic — cifrado en tu dispositivo',
            'Compara mes a mes cómo evolucionan tus señales',
            'Detecta si tu situación mejora o empeora con el tiempo',
            'Exporta tu historial como PDF para mostrarlo a un asesor',
          ].map(item => (
            <li key={item} className="flex gap-2 items-start">
              <span className="text-blue-400 mt-0.5" aria-hidden="true">○</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/analizador"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Hacer un análisis nuevo →
        </Link>
        <Link
          href="/educacion"
          className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Ver Educación Financiera
        </Link>
      </div>
    </div>
  )
}
