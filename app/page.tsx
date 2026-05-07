import Link from 'next/link'

// ─── Sub-components ────────────────────────────────────────────────────────

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
      <span className="text-3xl shrink-0" aria-hidden="true">{icon}</span>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function PersonaCard({
  emoji, name, tag, desc, href, variant,
}: {
  emoji: string; name: string; tag: string; desc: string; href: string; variant: 'primary' | 'secondary'
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="text-4xl" aria-hidden="true">{emoji}</div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
        <p className="text-xs text-blue-600 font-medium mt-0.5">{tag}</p>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed flex-1">{desc}</p>
      <Link
        href={href}
        className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          variant === 'primary'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Ver demo de {name}
      </Link>
    </div>
  )
}

type BadgeItem = { icon: string; label: string; desc: string }

function ComplianceGroup({
  groupIcon, title, subtitle, items, accentClass, textClass, subtextClass,
}: {
  groupIcon: string
  title: string
  subtitle: string
  items: BadgeItem[]
  accentClass: string
  textClass: string
  subtextClass: string
}) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${accentClass}`}>
      <div className="px-5 py-4 border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl shrink-0" aria-hidden="true">{groupIcon}</span>
          <div>
            <h3 className={`text-sm font-bold leading-tight ${textClass}`}>{title}</h3>
            <p className={`text-xs mt-0.5 ${subtextClass}`}>{subtitle}</p>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-black/5">
        {items.map(item => (
          <li key={item.label} className="flex gap-3 px-5 py-3.5">
            <span className="text-base shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
            <div>
              <p className={`text-xs font-semibold ${textClass}`}>{item.label}</p>
              <p className={`text-[11px] leading-relaxed mt-0.5 ${subtextClass}`}>{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────

const COMPLIANCE_GROUPS = [
  {
    groupIcon: '🔒',
    title: 'Privacidad absoluta',
    subtitle: 'Tus datos no van a ningún lado',
    accentClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-900',
    subtextClass: 'text-blue-700',
    items: [
      {
        icon: '🗑️',
        label: 'Sin persistencia',
        desc: 'La cartola y sus transacciones se procesan en memoria del servidor y se descartan automáticamente al terminar el análisis.',
      },
      {
        icon: '📵',
        label: 'Sin cesión de datos',
        desc: 'Ninguna información se vende, cede ni comparte con bancos, fintechs, anunciantes ni el Estado.',
      },
      {
        icon: '👤',
        label: 'Anónimo por diseño',
        desc: 'No pedimos registro, email ni RUT. El análisis es completamente anónimo; no hay forma de asociarlo a una persona real.',
      },
      {
        icon: '📭',
        label: 'Datos mínimos',
        desc: 'Procesamos únicamente lo necesario para el análisis. Sin perfilamiento adicional ni enriquecimiento externo.',
      },
    ],
  },
  {
    groupIcon: '🏛️',
    title: 'Marco legal chileno',
    subtitle: 'Amparados por las leyes que te protegen',
    accentClass: 'bg-emerald-50 border-emerald-100',
    textClass: 'text-emerald-900',
    subtextClass: 'text-emerald-700',
    items: [
      {
        icon: '🔒',
        label: 'Ley 21.719 — Datos Personales (2024)',
        desc: 'Nueva ley de protección de datos de Chile. Aplicamos sus principios de licitud, finalidad y seguridad desde el primer commit.',
      },
      {
        icon: '📜',
        label: 'Ley 19.628 — Vida Privada',
        desc: 'Ley vigente de protección de la vida privada. Aplicamos proporcionalidad y seguridad en el tratamiento de información.',
      },
      {
        icon: '🏛️',
        label: 'Ley 21.658 — Fintech y Open Finance',
        desc: 'Marco de Open Finance Chile (CMF). Operamos bajo sus principios de transparencia, portabilidad y consentimiento informado.',
      },
      {
        icon: '🚷',
        label: 'Ley 20.575 — Principio de Finalidad',
        desc: 'No generamos score crediticio. Los datos sirven para educarte, no para evaluarte. Cumplimos el principio de finalidad.',
      },
    ],
  },
  {
    groupIcon: '🤖',
    title: 'Diseño ético',
    subtitle: 'Principios que guían cada decisión técnica',
    accentClass: 'bg-violet-50 border-violet-100',
    textClass: 'text-violet-900',
    subtextClass: 'text-violet-700',
    items: [
      {
        icon: '🧩',
        label: 'Privacy by Design (ISO 29101)',
        desc: 'Principio recogido en la Ley 21.719. La privacidad está en la arquitectura técnica, no como parche posterior.',
      },
      {
        icon: '🤖',
        label: 'IA Explicable — sin caja negra',
        desc: 'Cada señal tiene su explicación en lenguaje ciudadano. Sabes qué se detectó y por qué. Sin scoring opaco ni algoritmo secreto.',
      },
      {
        icon: '🎓',
        label: 'CMF Educa',
        desc: 'Alineado con los objetivos de educación financiera ciudadana de la CMF. Espejo de Datos no es una entidad financiera.',
      },
    ],
  },
  {
    groupIcon: '🛡️',
    title: 'Seguridad técnica',
    subtitle: 'La arquitectura respalda las promesas',
    accentClass: 'bg-slate-50 border-slate-200',
    textClass: 'text-slate-800',
    subtextClass: 'text-slate-600',
    items: [
      {
        icon: '🚫',
        label: 'Sin tracking ni cookies de seguimiento',
        desc: 'Sin píxeles de terceros ni Analytics. No rastreamos al usuario entre sesiones ni construimos perfiles de comportamiento.',
      },
      {
        icon: '🛡️',
        label: 'OWASP Top 10',
        desc: 'Seguimos las buenas prácticas de seguridad web: sin XSS, sin inyecciones, sin exposición de secrets en el cliente.',
      },
      {
        icon: '🔐',
        label: 'HTTPS / TLS 1.3',
        desc: 'Toda comunicación entre el navegador y el servidor viaja cifrada. Las API keys del servidor nunca llegan al cliente.',
      },
    ],
  },
]

const ANTHROPIC_TECH = [
  {
    icon: '📄',
    name: 'Files API',
    desc: 'Lee tu PDF directamente en el servidor — sin exponerlo al cliente ni a terceros.',
  },
  {
    icon: '🤖',
    name: 'Agent SDK',
    desc: 'Un agente autónomo orquesta el análisis y decide qué herramientas ejecutar en cada paso.',
  },
  {
    icon: '🧠',
    name: 'Extended Thinking',
    desc: 'Razonamiento profundo para interpretar transacciones y contextos financieros ambiguos.',
  },
  {
    icon: '⚡',
    name: 'Prompt Caching',
    desc: 'Reutiliza el contexto del agente entre llamadas para reducir latencia y costo operativo.',
  },
  {
    icon: '🔗',
    name: 'MCP Server',
    desc: 'Herramientas Python conectadas al agente: parseo de cartola, indicadores macro, análisis de señales.',
  },
  {
    icon: '📎',
    name: 'Citations',
    desc: 'Cada señal puede trazarse a las transacciones específicas que la generaron.',
  },
]

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-400/30">
            <span aria-hidden="true">🏆</span> Claude Impact Lab Chile 2026 · Línea Inclusión Financiera
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Tu cartola ya te evalúa.
            <br />
            <span className="text-blue-300">Ahora tú también la lees.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto leading-relaxed">
            Espejo de Datos muestra cómo bancos, fintechs y el Estado interpretan tu perfil
            financiero — en lenguaje ciudadano, con IA y sin guardar tus datos.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/analizador"
              className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/30"
            >
              Ver mi Espejo →
            </Link>
            <Link
              href="/dashboard"
              className="border border-blue-400/50 text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Indicadores macro
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center pt-1 text-xs text-blue-300/90">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">🗑️</span> Cartola descartada al terminar
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">👤</span> Sin cuenta ni RUT
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">📜</span> Ley 21.719 · Ley 21.658
            </span>
          </div>
        </div>
      </section>

      {/* ── QUÉ HACE ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">¿Qué hace Espejo de Datos?</h2>
            <p className="text-gray-500 mt-2 text-sm">Transparencia financiera en tres dimensiones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon="🔍"
              title="Transparencia real"
              desc="Ve exactamente qué datos de tu cartola pesan en la evaluación de tu perfil y por qué."
            />
            <FeatureCard
              icon="🏛️"
              title="Tres perspectivas"
              desc="Banco tradicional, fintech y Estado — cada institución te lee diferente. Espejo te lo muestra."
            />
            <FeatureCard
              icon="📜"
              title="Derechos en acción"
              desc="Genera borradores de cartas fundamentadas en ley para ejercer tus derechos financieros."
            />
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Cómo funciona</h2>
            <p className="text-gray-500 mt-2 text-sm">Tres pasos para entender tu situación financiera</p>
          </div>
          <div className="space-y-8">
            <Step
              n={1}
              title="Carga tu cartola o usa un demo"
              desc="Sube tu cartola bancaria en PDF o explora con los perfiles de ejemplo de Paula o Luis. Sin crear cuenta."
            />
            <div className="ml-4 border-l-2 border-blue-100 pl-6 -mt-4 -mb-4 py-2">
              <div className="flex flex-wrap gap-2 text-xs">
                {['UF en tiempo real', 'TPM Banco Central', 'TMC vigente', 'Dólar observado', 'IPC mensual'].map(t => (
                  <span key={t} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Step
              n={2}
              title="La IA analiza con datos macro reales"
              desc="Nuestro agente procesa tus transacciones junto a indicadores económicos oficiales del Banco Central y Mindicador."
            />
            <Step
              n={3}
              title="Entiende cómo te ven y qué puedes hacer"
              desc='Recibe señales claras en lenguaje ciudadano, ve cómo te evalúa cada institución y simula cambios con el panel "¿Qué pasaría si…?"'
            />
          </div>
        </div>
      </section>

      {/* ── DEMOS ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Perfiles de demo</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Explora el Espejo con dos perfiles sintéticos — sin subir ningún archivo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PersonaCard
              emoji="👩‍💼"
              name="Paula"
              tag="Emprendedora · 34 años · Santiago"
              desc="Ingresos variables de su emprendimiento, usa tarjeta de crédito como capital de trabajo, con cupo al límite algunos meses y avances de efectivo recurrentes."
              href="/analizador"
              variant="primary"
            />
            <PersonaCard
              emoji="👴"
              name="Luis"
              tag="Jubilado · 68 años · Valparaíso"
              desc="Pensión mensual fija de AFP, gastos concentrados en salud y servicios básicos, sin deuda de consumo pero con cuenta vista activa en BancoEstado."
              href="/analizador"
              variant="secondary"
            />
          </div>
        </div>
      </section>

      {/* ── A QUIÉN AYUDA Y CÓMO LLEGA ──────────────────────────────── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">¿A quién ayuda y cómo llega?</h2>
            <p className="text-gray-500 text-sm">El ciudadano, el problema y el canal de adopción</p>
          </div>

          {/* Problema ≤300 chars sin jerga */}
          <div className="bg-gray-900 rounded-2xl px-8 py-6 text-white text-center space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">El problema</p>
            <p className="text-lg md:text-xl font-semibold leading-relaxed max-w-2xl mx-auto">
              "Tu banco ya sabe cómo eres financieramente. Tú no. Espejo de Datos te muestra la misma
              lectura que ellos hacen — en lenguaje simple, sin guardar tus datos."
            </p>
            <p className="text-xs text-gray-500">↑ 175 caracteres · sin términos técnicos sin explicar</p>
          </div>

          {/* Segmento · Canal · Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Segmento */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">👥</span>
                <h3 className="text-sm font-bold text-blue-900">El ciudadano</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                Trabajadores, emprendedores y pensionados chilenos de{' '}
                <strong>25 a 65 años</strong>, segmentos <strong>C2 y D</strong>
                {' '}(ingresos entre $500 K y $1,2 M mensuales), con cuenta bancaria
                activa pero sin acceso a educación financiera formal.
              </p>
              <p className="text-xs text-blue-700 font-medium">
                📍 Región Metropolitana · Valparaíso · Biobío
              </p>
            </div>

            {/* Canal */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">📲</span>
                <h3 className="text-sm font-bold text-emerald-900">Canal de adopción</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Compartible por <strong>WhatsApp</strong> con un enlace directo.
                Sin app que instalar, sin cuenta que crear. Funciona en cualquier
                navegador de celular — diseñado para pantallas de 360 px (gama baja).
              </p>
              <p className="text-xs text-emerald-700 font-medium">
                WhatsApp · {'>'}90% penetración en Chile · cero fricciones de onboarding
              </p>
            </div>

            {/* Impacto */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">📊</span>
                <h3 className="text-sm font-bold text-amber-900">El impacto</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                Más de <strong>8 millones de personas</strong> tienen deuda vigente
                en el sistema financiero regulado. La mayoría desconoce cómo se calcula
                su tasa efectiva o qué señales determinan su acceso al crédito.
              </p>
              <a
                href="https://www.cmf.cl/estadisticas/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold underline underline-offset-2 hover:text-amber-900"
              >
                Fuente: CMF Chile — Estadísticas →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── PRIVACIDAD POR DISEÑO ────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Tu privacidad, por diseño</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
              No es una política de privacidad que nadie lee. Es la arquitectura técnica
              y el marco legal que respalda cada promesa que hacemos — 14 compromisos concretos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPLIANCE_GROUPS.map(group => (
              <ComplianceGroup key={group.title} {...group} />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
            <strong className="text-gray-500">Herramienta educativa.</strong>{' '}
            Espejo de Datos no es asesoría financiera ni legal. Sus señales son lecturas plausibles,
            no decisiones de ninguna institución. Consulta fuentes oficiales — SERNAC, CMF —
            antes de actuar.
          </p>
        </div>
      </section>

      {/* ── TECNOLOGÍA ANTHROPIC ─────────────────────────────────────── */}
      <section className="py-12 px-4 bg-slate-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Tecnologías Anthropic que lo hacen posible
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ANTHROPIC_TECH.map(tech => (
              <div key={tech.name} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
                <span className="text-xl shrink-0" aria-hidden="true">{tech.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{tech.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <h2 className="text-2xl font-bold">¿Listo para ver tu espejo?</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Carga tu cartola PDF o usa uno de los demos. El análisis completo tarda menos de 30 segundos.
          </p>
          <Link
            href="/analizador"
            className="inline-block bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/30"
          >
            Comenzar ahora →
          </Link>
        </div>
      </section>

    </div>
  )
}
