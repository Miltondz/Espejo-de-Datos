import Link from 'next/link'

const BUBBLES = [
  {
    role: 'user',
    text: '¿Por qué mi señal de uso de cupo está en rojo?',
  },
  {
    role: 'espejo',
    text: 'Tu tarjeta tiene un uso del 84% del cupo disponible. Los bancos consideran riesgo moderado-alto cualquier uso sobre el 70%. Esto afecta principalmente tu perfil de crédito de consumo.',
  },
  {
    role: 'user',
    text: '¿Qué debería hacer primero?',
  },
  {
    role: 'espejo',
    text: 'El mayor impacto lo tendrías bajando el saldo de tarjeta. Reducir el uso al 50% podría mejorar dos señales simultáneamente — liquidez y cupo.',
  },
]

export default function ChatEspejoTeaser() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Chat con tu Espejo</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Pregúntale directamente sobre tu análisis — sin reanalizar
          </p>
        </div>
        <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
          Próximamente v2.5
        </span>
      </div>

      {/* Blurred mockup */}
      <div className="relative">
        <div className="p-5 space-y-3 blur-sm select-none pointer-events-none">
          {BUBBLES.map((b, i) => (
            <div
              key={i}
              className={`flex ${b.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {b.role === 'espejo' && (
                <span className="text-lg mr-2 shrink-0 mt-1" aria-hidden="true">🪞</span>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  b.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {b.text}
              </div>
            </div>
          ))}

          {/* Fake input bar */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <div className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400">
              Escribe tu pregunta…
            </div>
            <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
              →
            </button>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[2px] rounded-b-2xl">
          <div className="text-center space-y-3 px-6">
            <span className="text-3xl" aria-hidden="true">💬</span>
            <p className="font-bold text-gray-900">Disponible en v2.5</p>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Conversa sobre tu análisis existente — el Espejo responde con contexto
              de tus señales específicas, sin necesidad de reanalizar.
            </p>
            <Link
              href="/proximas-funciones"
              className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              Ver roadmap completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
