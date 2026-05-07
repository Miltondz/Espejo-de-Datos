import Image from 'next/image'
import Link from 'next/link'

const TEAM = [
  {
    name: 'María Alejandra Eggers',
    role: 'Team Lead & Producto / Front-end',
    roleColor: 'bg-blue-100 text-blue-800',
    desc: 'Aplica Antropodiseño para conectar el comportamiento humano con la tecnología financiera, priorizando la confianza y la usabilidad en cada decisión de producto.',
    linkedin: 'https://www.linkedin.com/in/antropoeggers',
    photo: '/img/alejandra.jpg',
    accent: 'from-blue-200 to-blue-100',
  },
  {
    name: 'Milton Diaz',
    role: 'Tech Lead & Back-end / Infraestructura',
    roleColor: 'bg-slate-100 text-slate-800',
    desc: 'Arquitecto de la infraestructura crítica, asegurando un motor financiero robusto, escalable y con una gestión de datos de alto rendimiento.',
    linkedin: 'https://www.linkedin.com/in/miltondz/',
    photo: '/img/milton.jpg',
    accent: 'from-slate-200 to-slate-100',
  },
  {
    name: 'Adolfo Hübner',
    role: 'Growth & Business',
    roleColor: 'bg-emerald-100 text-emerald-800',
    desc: 'Estratega comercial enfocado en la viabilidad del modelo de negocio y en alinear la innovación técnica con las demandas reales del mercado financiero.',
    linkedin: 'https://www.linkedin.com/in/adolfohubner/',
    photo: '/img/adolfo.jpg',
    accent: 'from-emerald-200 to-emerald-100',
  },
  {
    name: 'Renzo Rodrigo',
    role: 'Legal & Compliance',
    roleColor: 'bg-violet-100 text-violet-800',
    desc: 'Especialista en el marco regulatorio FinTech, garantizando que cada decisión del producto cumpla con los estándares de seguridad y legalidad vigentes en Chile.',
    linkedin: 'https://www.linkedin.com/in/renzo-rodrigo-gandolfi-diaz-28513244/',
    photo: '/img/renzo.jpg',
    accent: 'from-violet-200 to-violet-100',
  },
]

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Foto con fondo degradado */}
      <div className={`bg-gradient-to-b ${member.accent} p-6 flex justify-center`}>
        <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{member.name}</h3>
          <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${member.roleColor}`}>
            {member.role}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed flex-1">{member.desc}</p>

        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  )
}

export default function NosotrosPage() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-400/30">
            Claude Impact Lab Chile 2026 · Línea Inclusión Financiera
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            Dunatech
          </h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
            El equipo detrás de <strong className="text-white">Espejo de Datos</strong> — cuatro disciplinas,
            un objetivo: que cada chileno entienda su perfil financiero.
          </p>
        </div>
      </section>

      {/* ── MISIÓN ───────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Nuestra misión</h2>
          <p className="text-gray-600 leading-relaxed">
            Combinamos diseño humano, ingeniería de IA, estrategia de negocio y derecho financiero
            para construir herramientas que devuelvan a los ciudadanos el control sobre su propia
            información financiera — con transparencia, privacidad y lenguaje simple.
          </p>
        </div>
      </section>

      {/* ── EQUIPO ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">El equipo</h2>
            <p className="text-gray-500 mt-2 text-sm">Cuatro perspectivas, un producto</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TEAM.map(member => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTEXTO ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            Espejo de Datos fue construido en el{' '}
            <strong className="text-gray-700">Claude Impact Lab Chile 2026</strong>,
            categoría AI Builder, línea Inclusión Financiera.
            Desarrollado íntegramente durante la ventana de hackathon del 6 y 7 de mayo de 2026.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/analizador"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver el Espejo →
            </Link>
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
