import Link from 'next/link'

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
  emoji,
  name,
  tag,
  desc,
  href,
  variant,
}: {
  emoji: string
  name: string
  tag: string
  desc: string
  href: string
  variant: 'primary' | 'secondary'
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

export default function Home() {
  return (
    <div>
      {/* HERO */}
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
          <p className="text-xs text-blue-300/80">
            🔒 Procesado en memoria · Sin almacenamiento · Sin asesoría financiera
          </p>
        </div>
      </section>

      {/* FEATURES */}
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

      {/* HOW IT WORKS */}
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

      {/* PERSONAS */}
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

      {/* TECH BADGES */}
      <section className="py-10 px-4 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Tecnologías Anthropic utilizadas
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Agent SDK',
              'Files API',
              'Extended Thinking',
              'Citations',
              'Prompt Caching',
              'MCP Server',
            ].map(tech => (
              <span
                key={tech}
                className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="py-8 px-4 bg-amber-50 border-b border-amber-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-amber-800 text-center leading-relaxed">
            <strong>Herramienta educativa.</strong> Espejo de Datos no es asesoría financiera ni
            legal. Sus señales son lecturas plausibles, no decisiones de ninguna institución.
            Consulta fuentes oficiales — SERNAC, CMF — antes de actuar.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <h2 className="text-2xl font-bold">¿Listo para ver tu espejo?</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Carga tu cartola PDF o usa uno de los demos. El análisis completo tarda menos de 30
            segundos.
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
