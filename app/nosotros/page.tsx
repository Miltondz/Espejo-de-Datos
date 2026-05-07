import Image from 'next/image'
import Link from 'next/link'

const TEAM = [
  {
    name: 'María Alejandra Eggers',
    role: 'Team Lead & Producto',
    area: 'Diseño UX · Front-end',
    areaIcon: '🎨',
    roleColor: 'bg-blue-600',
    cardAccent: 'bg-gradient-to-br from-blue-600 to-blue-500',
    tagColor: 'bg-blue-100 text-blue-800',
    desc: 'Aplica Antropodiseño para conectar el comportamiento humano con la tecnología financiera, priorizando la confianza y la usabilidad en cada decisión de producto.',
    linkedin: 'https://www.linkedin.com/in/antropoeggers',
    photo: '/img/alejandra.jpg',
  },
  {
    name: 'Milton Diaz',
    role: 'Tech Lead',
    area: 'Back-end · IA · Infra',
    areaIcon: '⚙️',
    roleColor: 'bg-slate-700',
    cardAccent: 'bg-gradient-to-br from-slate-700 to-slate-600',
    tagColor: 'bg-slate-100 text-slate-800',
    desc: 'Arquitecto de la infraestructura crítica, asegurando un motor financiero robusto, escalable y con una gestión de datos de alto rendimiento.',
    linkedin: 'https://www.linkedin.com/in/miltondz/',
    photo: '/img/milton.jpg',
  },
  {
    name: 'Adolfo Hübner',
    role: 'Growth Lead',
    area: 'Negocio · Adopción',
    areaIcon: '📈',
    roleColor: 'bg-emerald-600',
    cardAccent: 'bg-gradient-to-br from-emerald-600 to-emerald-500',
    tagColor: 'bg-emerald-100 text-emerald-800',
    desc: 'Estratega comercial enfocado en la viabilidad del modelo de negocio y en alinear la innovación técnica con las demandas reales del mercado financiero.',
    linkedin: 'https://www.linkedin.com/in/adolfohubner/',
    photo: '/img/adolfo.jpg',
  },
  {
    name: 'Renzo Rodrigo',
    role: 'Legal Lead',
    area: 'Legal · Compliance',
    areaIcon: '⚖️',
    roleColor: 'bg-violet-600',
    cardAccent: 'bg-gradient-to-br from-violet-600 to-violet-500',
    tagColor: 'bg-violet-100 text-violet-800',
    desc: 'Especialista en el marco regulatorio FinTech, garantizando que cada decisión del producto cumpla con los estándares de seguridad y legalidad vigentes en Chile.',
    linkedin: 'https://www.linkedin.com/in/renzo-rodrigo-gandolfi-diaz-28513244/',
    photo: '/img/renzo.jpg',
  },
]

const VALORES = [
  {
    icon: '🔒',
    titulo: 'Privacidad por diseño',
    desc: 'Sin base de datos, sin login. La cartola se procesa en memoria y se elimina automáticamente.',
  },
  {
    icon: '💬',
    titulo: 'Lenguaje ciudadano',
    desc: 'Ningún tecnicismo sin explicación. Si no lo entiende cualquier persona, no está bien escrito.',
  },
  {
    icon: '📡',
    titulo: 'Datos reales',
    desc: 'Indicadores macro desde el Banco Central y mindicador.cl. No inventamos tasas ni cifras.',
  },
  {
    icon: '🏛️',
    titulo: 'Canal institucional',
    desc: 'Diseñado para llegar a través de CMF Educa, SERNAC y municipios — no como app viral.',
  },
]

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      {/* Colored header strip with overlapping circular photo */}
      <div className={`relative ${member.cardAccent} h-24 flex-shrink-0`}>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-md">
            <Image
              src={member.photo}
              alt={member.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Body — pt-12 to clear the overlapping photo */}
      <div className="pt-12 pb-6 px-5 flex flex-col items-center gap-3 flex-1 text-center">
        {/* Area badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${member.tagColor}`}>
          <span aria-hidden="true">{member.areaIcon}</span>
          {member.area}
        </span>

        {/* Name + role */}
        <div>
          <h3 className="font-black text-gray-900 text-base leading-tight">{member.name}</h3>
          <p className="text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wide">{member.role}</p>
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200" />

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{member.desc}</p>

        {/* LinkedIn */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors mt-1"
        >
          <LinkedInIcon />
          Ver perfil
        </a>
      </div>
    </div>
  )
}

export default function NosotrosPage() {
  return (
    <div className="bg-slate-50">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white pt-16 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
            Claude Impact Lab Chile 2026 · Línea 01 Inclusión Financiera
          </span>

          <div className="space-y-3">
            <div className="text-5xl" aria-hidden="true">🪞</div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">Dunatech</h1>
            <p className="text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
              El equipo detrás de <strong className="text-white">Espejo de Datos</strong> —
              cuatro disciplinas, un objetivo: que cada chileno entienda su perfil financiero.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm">
            {[
              { n: '4',   label: 'disciplinas' },
              { n: '48h', label: 'de desarrollo' },
              { n: '3',   label: 'agentes IA' },
              { n: '8M+', label: 'personas alcanzables' },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{n}</p>
                <p className="text-xs text-blue-300 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Lo que nos guía</h2>
            <p className="text-gray-500 text-sm mt-1">Los principios no negociables del producto</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALORES.map(v => (
              <div
                key={v.titulo}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl" aria-hidden="true">{v.icon}</span>
                <p className="font-bold text-sm text-gray-900">{v.titulo}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ───────────────────────────────────────────────────── */}
      <section className="py-10 px-4 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">El equipo</h2>
            <p className="text-gray-500 text-sm mt-1">Cuatro perspectivas, un producto</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {TEAM.map(member => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTEXTO ─────────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full">
            🏆 Hackathon · 6 y 7 de mayo 2026
          </div>

          <p className="text-gray-600 leading-relaxed">
            Espejo de Datos fue construido íntegramente durante la ventana del{' '}
            <strong className="text-gray-800">Claude Impact Lab Chile 2026</strong>,
            categoría AI Builder, línea Inclusión Financiera. Cuarenta y ocho horas de trabajo
            continuo para poner en manos de los ciudadanos la información que las instituciones
            financieras ya tienen sobre ellos.
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/analizador"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Probar el Espejo →
            </Link>
            <Link
              href="/"
              className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
