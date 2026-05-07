import Link from 'next/link'

const TALLER_MOCK = [
  { segmento: 'Emprendedoras', n: 12, pct: 67, color: 'bg-blue-400' },
  { segmento: 'Dependientes',  n: 8,  pct: 44, color: 'bg-emerald-400' },
  { segmento: 'Jubilados',     n: 5,  pct: 28, color: 'bg-violet-400' },
]

const FEATURES = [
  {
    version: 'v2.0',
    versionColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🏫',
    title: 'Modo Taller B2G',
    target: 'CMF Educa · SERNAC · Municipios',
    desc: 'Un facilitador puede correr múltiples perfiles en una sesión de taller y ver resultados agregados anónimos del grupo — sin acceder a los datos individuales de ningún participante.',
    detalle: [
      'Vista de facilitador con métricas del grupo',
      'Señales más frecuentes en la sala',
      'Distribución por segmento en tiempo real',
      'Exportar informe anónimo del taller',
    ],
  },
  {
    version: 'v2.0',
    versionColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '📊',
    title: 'Comparativa anónima',
    target: 'Usuarios individuales',
    desc: 'Compara tu perfil de señales con la distribución anónima de tu segmento — sin identificar a nadie, solo para entender si tu situación es común o atípica.',
    detalle: [
      '"El 68% de las personas en tu segmento tiene uso de cupo alto"',
      'Benchmarks por segmento y ciudad',
      'Completamente anónimo — sin identificadores',
    ],
  },
]

export default function ComunidadPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-12">

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Comunidad y Talleres</h1>
          <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full shrink-0">
            v2.0
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          El canal de impacto real de Espejo de Datos no es viral — es institucional.
          Estas funciones convierten el producto en una herramienta B2G para talleres
          de educación financiera ciudadana.
        </p>
      </div>

      {/* Workshop mockup preview */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-white p-6 space-y-5 select-none pointer-events-none blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Taller — Vista facilitador</p>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">● En vivo · 25 participantes</span>
          </div>
          <div className="space-y-3">
            {TALLER_MOCK.map(t => (
              <div key={t.segmento} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span className="font-medium">{t.segmento}</span>
                  <span>{t.n} personas</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {[
              { label: 'Señal más frecuente', value: 'Uso cupo alto' },
              { label: 'Señales legales', value: '8 participantes' },
              { label: 'Segmento mayoría', value: 'Emprendedoras' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <div className="text-center space-y-3 px-6">
            <span className="text-4xl" aria-hidden="true">🏫</span>
            <p className="font-bold text-gray-900 text-lg">Modo Taller — v2.0</p>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
              Para facilitadores de CMF Educa, SERNAC y municipios — datos agregados y anónimos
              del grupo en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Funciones en desarrollo</p>
        <div className="space-y-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">{f.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{f.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.target}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${f.versionColor}`}>
                    {f.version}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                <ul className="space-y-1">
                  {f.detalle.map(d => (
                    <li key={d} className="text-xs text-gray-500 flex gap-2 items-start">
                      <span className="text-blue-300 shrink-0 mt-0.5">○</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why B2G */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
        <p className="font-semibold text-blue-900 text-sm">¿Por qué B2G y no B2C?</p>
        <p className="text-sm text-blue-800 leading-relaxed">
          CMF Educa, SERNAC y los municipios ya tienen el mandato legal y los canales para llegar
          a los segmentos C2-D. Espejo de Datos no necesita construir distribución desde cero —
          se integra como herramienta a los programas de educación financiera que llegan a
          cientos de miles de personas por año a costo marginal cercano a cero.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/analizador"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Probar el Espejo ahora →
        </Link>
        <Link
          href="/proximas-funciones"
          className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Ver roadmap completo
        </Link>
      </div>
    </div>
  )
}
