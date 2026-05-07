import Link from 'next/link'

const CHART_DATA = [
  { mes: 'Feb', pct: 38, color: 'bg-red-400' },
  { mes: 'Mar', pct: 52, color: 'bg-amber-400' },
  { mes: 'Abr', pct: 61, color: 'bg-amber-400' },
  { mes: 'May', pct: 78, color: 'bg-emerald-400' },
]

const SIGNALS_MOCK = [
  { label: 'Uso de cupo', antes: 'rojo', despues: 'amarillo', icon: '💳' },
  { label: 'Liquidez fin de mes', antes: 'amarillo', despues: 'verde', icon: '💰' },
  { label: 'Avances de efectivo', antes: 'rojo', despues: 'verde', icon: '💸' },
]

const SIGNAL_COLOR: Record<string, string> = {
  rojo: 'bg-red-100 text-red-600',
  amarillo: 'bg-amber-100 text-amber-600',
  verde: 'bg-emerald-100 text-emerald-700',
}

const FEATURES = [
  { icon: '💾', title: 'Guarda con un clic', desc: 'Cifrado en tu dispositivo, sin pasar por ningún servidor.' },
  { icon: '📈', title: 'Evolución de señales', desc: 'Gráfico mes a mes de cada señal — ve si mejoró o empeoró.' },
  { icon: '🔔', title: 'Alertas de cambio', desc: 'Notificación si una señal cambia de color entre un análisis y el siguiente.' },
  { icon: '📄', title: 'Exportar historial', desc: 'Descarga un PDF con tu progreso para mostrarlo a un asesor o institución.' },
]

export default function HistorialPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-10">

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tu progreso en el tiempo</h1>
          <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full shrink-0">
            v2.0
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          Compara tus análisis mes a mes y detecta si tus hábitos están mejorando tu perfil
          financiero — sin enviar ningún dato a ningún servidor.
        </p>
      </div>

      {/* Mockup preview — blurred "coming soon" */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        {/* Fake chart content */}
        <div className="bg-white p-6 space-y-6 select-none pointer-events-none blur-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Salud financiera — últimos 4 meses</p>
          {/* Bar chart */}
          <div className="flex items-end gap-3 h-28">
            {CHART_DATA.map(d => (
              <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-600">{d.pct}%</span>
                <div className="w-full rounded-t-lg overflow-hidden" style={{ height: `${d.pct}%` }}>
                  <div className={`w-full h-full ${d.color} opacity-80`} />
                </div>
                <span className="text-xs text-gray-400">{d.mes}</span>
              </div>
            ))}
          </div>
          {/* Signal comparison */}
          <div className="space-y-2">
            {SIGNALS_MOCK.map(s => (
              <div key={s.label} className="flex items-center gap-3 text-sm">
                <span>{s.icon}</span>
                <span className="flex-1 text-gray-700 font-medium">{s.label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SIGNAL_COLOR[s.antes]}`}>{s.antes}</span>
                <span className="text-gray-300">→</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SIGNAL_COLOR[s.despues]}`}>{s.despues}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <div className="text-center space-y-3 px-6">
            <span className="text-4xl" aria-hidden="true">🔒</span>
            <p className="font-bold text-gray-900 text-lg">Disponible en v2.0</p>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
              El historial requiere almacenamiento cifrado local — lo activamos en la siguiente versión
              sin tocar ningún servidor.
            </p>
          </div>
        </div>
      </div>

      {/* Why not MVP */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex gap-3 items-start">
        <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">🔒</span>
        <div className="space-y-1">
          <p className="font-semibold text-emerald-900 text-sm">¿Por qué no está en esta versión?</p>
          <p className="text-sm text-emerald-800 leading-relaxed">
            El MVP procesa todo en memoria y no guarda nada — es una decisión de privacidad deliberada.
            El historial requiere consentimiento explícito + cifrado local, que implementaremos en v2.0
            sin comprometer ese principio.
          </p>
        </div>
      </div>

      {/* Feature list */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Lo que incluirá la v2.0</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 items-start"
            >
              <span className="text-xl shrink-0" aria-hidden="true">{f.icon}</span>
              <div>
                <p className="font-semibold text-sm text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/analizador"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Hacer un análisis ahora →
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
