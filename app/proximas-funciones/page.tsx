import Link from 'next/link'

const VERSIONES = [
  {
    version: 'v1.0',
    label: 'MVP · Actual',
    estado: 'lanzado',
    estadoColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    lineColor: 'bg-emerald-200',
    items: [
      'MirrorBuilderAgent — análisis con 5 tools MCP',
      'ActionPlannerAgent — simulación "¿qué pasaría si…?"',
      'LetterGeneratorAgent — cartas SERNAC con Citations',
      'Files API — procesamiento privado de PDFs',
      'Extended Thinking en análisis y cartas',
      'Dashboard de indicadores macro en vivo (BDE + mindicador.cl)',
      'Educación financiera + glosario ciudadano',
      'Transparencia técnica — loop agéntico visible',
    ],
  },
  {
    version: 'v2.0',
    label: 'Próxima versión',
    estado: 'en diseño',
    estadoColor: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-400',
    lineColor: 'bg-blue-100',
    items: [
      'Historial local — cifrado en tu dispositivo (localStorage)',
      'Gráfico de evolución de señales mes a mes',
      'Modo Taller B2G — vista de facilitador con stats agregados',
      'Comparativa anónima por segmento',
      'Comparador de créditos según tu perfil de señales',
      'Exportar informe anónimo de taller en PDF',
    ],
  },
  {
    version: 'v2.5',
    label: 'En evaluación',
    estado: 'conceptual',
    estadoColor: 'bg-amber-100 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-300',
    lineColor: 'bg-amber-100',
    items: [
      'Chat conversacional con tu Espejo (streaming con Claude)',
      'Alertas de cambio cuando una señal mejora o empeora',
      'Pasaporte financiero interactivo — no solo PDF imprimible',
      'Integración con agenda SERNAC para derivar reclamos',
    ],
  },
  {
    version: 'v3.0',
    label: 'Visión futura',
    estado: 'visión',
    estadoColor: 'bg-slate-100 text-slate-600 border-slate-200',
    dotColor: 'bg-slate-300',
    lineColor: 'bg-slate-100',
    items: [
      'Open Finance (Ley 21.658) — lectura directa desde el banco sin PDF',
      'Modo multiusuario familiar — espejo del hogar',
      'API pública para integradores CMF/SERNAC',
      'Módulo de educación adaptativa según señales del usuario',
    ],
  },
]

const PRINCIPIOS = [
  { icon: '🔒', title: 'Privacidad por diseño', desc: 'Toda función nueva nace sin persistencia en servidor. El usuario elige qué guardar y dónde.' },
  { icon: '🏛️', title: 'B2G primero', desc: 'Cada función se evalúa por su capacidad de funcionar en un taller CMF Educa o municipal.' },
  { icon: '💬', title: 'Lenguaje ciudadano', desc: 'Ninguna feature puede requerir formación financiera previa para ser entendida.' },
  { icon: '📡', title: 'Datos reales', desc: 'Nada se inventa. Indicadores, tasas y leyes desde fuentes oficiales verificables.' },
]

export default function ProximasFuncionesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
            Hoja de ruta · Espejo de Datos
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Próximas funciones</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xl mx-auto">
            El MVP es el punto de partida. Aquí está lo que viene — diseñado con los mismos
            principios: privacidad, lenguaje ciudadano e impacto institucional.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

        {/* Roadmap timeline */}
        <section className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">Roadmap de versiones</p>

          <div className="space-y-0">
            {VERSIONES.map((v, i) => (
              <div key={v.version} className="flex gap-5">
                {/* Timeline column */}
                <div className="flex flex-col items-center w-10 shrink-0">
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm shrink-0 ${v.dotColor}`} />
                  {i < VERSIONES.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${v.lineColor}`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-10 flex-1 ${i === VERSIONES.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h2 className="text-base font-black text-gray-900">{v.version}</h2>
                    <span className="text-sm text-gray-500">— {v.label}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${v.estadoColor}`}>
                      {v.estado}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <ul className="space-y-2">
                      {v.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${v.dotColor}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Principios que guían el roadmap */}
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Lo que guía cada decisión</h2>
            <p className="text-sm text-gray-500 mt-0.5">Cada función nueva se evalúa contra estos cuatro filtros</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRINCIPIOS.map(p => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-3">
                <span className="text-2xl shrink-0" aria-hidden="true">{p.icon}</span>
                <div>
                  <p className="font-bold text-sm text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-semibold text-blue-900">¿Quieres participar en el siguiente paso?</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Escríbenos — buscamos instituciones (CMF Educa, SERNAC, municipios) que quieran
              pilotear el Modo Taller en sus programas de educación financiera.
            </p>
          </div>
          <a
            href="https://www.linkedin.com/company/dunatech"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Contactar equipo →
          </a>
        </div>

        {/* Back */}
        <div className="flex flex-wrap gap-3">
          <Link href="/analizador" className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            ← Ir al Espejo
          </Link>
          <Link href="/nosotros" className="text-gray-500 text-sm px-5 py-2.5 hover:text-gray-700 transition-colors">
            Conocer el equipo
          </Link>
        </div>

      </div>
    </div>
  )
}
