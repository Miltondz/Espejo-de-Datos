const NORMATIVA = [
  {
    icon: '🔒',
    label: 'Ley 21.719',
    short: 'Datos personales Chile 2024',
    desc: 'Ley de protección de datos personales (Chile, 2024). Tus datos no se ceden, comercializan ni transfieren a terceros.',
  },
  {
    icon: '📜',
    label: 'Ley 19.628',
    short: 'Protección vida privada',
    desc: 'Ley de protección de la vida privada vigente en Chile. Aplicamos sus principios de finalidad, proporcionalidad y seguridad en el tratamiento.',
  },
  {
    icon: '🏛️',
    label: 'Ley 21.658 Fintech',
    short: 'Open Finance Chile',
    desc: 'Ley Fintech y marco de Open Finance Chile (CMF). Espejo de Datos opera bajo sus principios de transparencia, portabilidad y consentimiento informado.',
  },
  {
    icon: '🎓',
    label: 'CMF Educa',
    short: 'Educación financiera',
    desc: 'Alineado con los objetivos de educación financiera ciudadana de la Comisión para el Mercado Financiero (CMF). No somos entidad financiera regulada.',
  },
  {
    icon: '🧩',
    label: 'Privacy by Design',
    short: 'ISO 29101 / Ley 21.719',
    desc: 'Principio formal de privacidad desde el origen (ISO 29101), recogido explícitamente en la Ley 21.719. La privacidad es parte del diseño técnico, no un add-on.',
  },
  {
    icon: '📭',
    label: 'Datos mínimos',
    short: 'Solo lo necesario',
    desc: 'Principio de minimización de datos: procesamos únicamente lo estrictamente necesario para el análisis. Sin perfilamiento adicional ni enriquecimiento de datos.',
  },
  {
    icon: '🗑️',
    label: 'Sin persistencia',
    short: 'Descarte automático',
    desc: 'La cartola y las transacciones individuales se procesan en memoria RAM y se descartan automáticamente al terminar. Ningún servidor las almacena.',
  },
  {
    icon: '📵',
    label: 'Sin cesión de datos',
    short: 'No vendemos información',
    desc: 'Ninguna información procesada se vende, cede, comparte ni transfiere a terceros, incluyendo bancos, fintechs, anunciantes o el Estado.',
  },
  {
    icon: '🤖',
    label: 'IA Explicable',
    short: 'Sin caja negra',
    desc: 'Cada señal tiene una explicación en lenguaje ciudadano. El análisis es auditable: sabes qué se detectó y por qué. No hay scoring opaco ni algoritmo secreto.',
  },
  {
    icon: '🚷',
    label: 'Sin scoring crediticio',
    short: 'Solo educación',
    desc: 'Espejo de Datos no genera score crediticio ni predice decisiones de bancos. Es una herramienta educativa. Aplicamos el principio de finalidad de la Ley 20.575.',
  },
  {
    icon: '🛡️',
    label: 'OWASP Top 10',
    short: 'Seguridad web',
    desc: 'La aplicación sigue las buenas prácticas de seguridad web del OWASP Top 10: sin XSS, sin inyecciones, sin exposición de secrets en el cliente.',
  },
  {
    icon: '🔐',
    label: 'HTTPS / TLS 1.3',
    short: 'Cifrado en tránsito',
    desc: 'Toda comunicación entre el navegador y el servidor viaja cifrada con TLS. Las API keys del servidor nunca se exponen al cliente.',
  },
  {
    icon: '🚫',
    label: 'Sin tracking',
    short: 'Sin cookies de seguimiento',
    desc: 'No usamos cookies de seguimiento, píxeles de terceros, Google Analytics ni ninguna herramienta que identifique o rastree al usuario entre sesiones.',
  },
  {
    icon: '👤',
    label: 'Sin cuenta',
    short: 'Anónimo por diseño',
    desc: 'No requerimos registro, email ni RUT. El análisis es completamente anónimo. No hay forma de asociar un análisis a una persona real.',
  },
]

export default function ComplianceBadges() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-700">Cumplimiento normativo y privacidad</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Diseñado con privacidad desde el origen — pasa el cursor sobre cada badge para ver el detalle
        </p>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {NORMATIVA.map(b => (
          <div
            key={b.label}
            title={b.desc}
            className="flex items-start gap-2 bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl p-3 transition-all cursor-default"
          >
            <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">{b.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{b.label}</p>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{b.short}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
