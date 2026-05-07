const badges = [
  {
    icon: '🔒',
    label: 'Ley 21.719',
    desc: 'Protección de datos personales (Chile 2024) — tus datos no se ceden ni comercializan',
  },
  {
    icon: '📭',
    label: 'Datos mínimos',
    desc: 'Solo procesamos lo estrictamente necesario para el análisis. Sin perfilamiento adicional',
  },
  {
    icon: '🗑️',
    label: 'Sin persistencia',
    desc: 'La cartola y las transacciones se descartan al terminar. Ningún servidor las guarda',
  },
  {
    icon: '🚫',
    label: 'Sin tracking',
    desc: 'No usamos cookies de seguimiento, píxeles ni herramientas de analítica que identifiquen al usuario',
  },
  {
    icon: '🔐',
    label: 'HTTPS siempre',
    desc: 'Toda comunicación con el servidor viaja cifrada. Nunca en texto plano',
  },
  {
    icon: '👤',
    label: 'Sin cuenta',
    desc: 'No requerimos registro, email ni RUT. El análisis es completamente anónimo',
  },
]

export default function ComplianceBadges() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-700">Cumplimiento normativo y privacidad</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Diseñado con privacidad desde el origen (privacy by design)
        </p>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {badges.map(b => (
          <div
            key={b.label}
            title={b.desc}
            className="flex items-start gap-2 bg-slate-50 hover:bg-slate-100 rounded-xl p-3 transition-colors cursor-default group"
          >
            <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">{b.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{b.label}</p>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5 hidden sm:block">
                {b.desc.split('—')[0].trim()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
