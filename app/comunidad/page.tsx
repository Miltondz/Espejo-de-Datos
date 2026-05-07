import Link from 'next/link'

const ideas = [
  {
    icon: '💬',
    title: 'Foro de señales',
    desc: 'Comparte qué señales aparecen en tu perfil y qué hiciste al respecto.',
  },
  {
    icon: '📊',
    title: 'Comparativa anónima',
    desc: 'Ve cómo se distribuyen los perfiles en tu segmento — sin identificar a nadie.',
  },
  {
    icon: '🎯',
    title: 'Metas compartidas',
    desc: 'Sigue tu progreso junto a personas con objetivos financieros similares.',
  },
]

export default function ComunidadPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Comunidad</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Aprende junto a otras personas que también están entendiendo su situación financiera.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-3">
        <p className="text-4xl" aria-hidden="true">🔜</p>
        <h2 className="font-bold text-blue-900">En construcción</h2>
        <p className="text-sm text-blue-700 leading-relaxed">
          La sección de Comunidad llegará en una próxima versión. El MVP prioriza la privacidad
          total — sin cuentas, sin guardar datos — por lo que la comunidad requiere una
          arquitectura especial.
        </p>
      </div>

      {/* Feature preview */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Lo que viene</p>
        <div className="space-y-3">
          {ideas.map(idea => (
            <div
              key={idea.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start opacity-60"
            >
              <span className="text-2xl shrink-0" aria-hidden="true">{idea.icon}</span>
              <div>
                <p className="font-semibold text-gray-800">{idea.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{idea.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/analizador"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Ir a mi Espejo →
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
