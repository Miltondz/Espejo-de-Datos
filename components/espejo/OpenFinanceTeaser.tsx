import Link from 'next/link'

const BANCOS = [
  { nombre: 'BancoEstado',  color: 'bg-red-50 border-red-200 text-red-700' },
  { nombre: 'Santander',    color: 'bg-red-50 border-red-100 text-red-600' },
  { nombre: 'BCI',          color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { nombre: 'Banco Chile',  color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { nombre: 'Falabella',    color: 'bg-green-50 border-green-200 text-green-700' },
  { nombre: 'Scotiabank',   color: 'bg-red-50 border-red-200 text-red-800' },
]

export default function OpenFinanceTeaser() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Open Finance</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Conecta tu banco directamente — sin subir ningún PDF
          </p>
        </div>
        <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
          Próximamente v3.0
        </span>
      </div>

      {/* Blurred mockup */}
      <div className="relative">
        <div className="p-5 space-y-5 blur-sm select-none pointer-events-none">
          <p className="text-sm font-semibold text-gray-700 text-center">
            Selecciona tu banco para autorizar la conexión
          </p>

          {/* Bank grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BANCOS.map(b => (
              <div
                key={b.nombre}
                className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold ${b.color}`}
              >
                {b.nombre}
              </div>
            ))}
          </div>

          {/* Fake connect button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold">
            Conectar con mi banco →
          </button>

          {/* Privacy note */}
          <div className="flex gap-2 items-center text-xs text-gray-400 justify-center">
            <span>🔒</span>
            <span>Autorización OAuth · Solo lectura · Revocable en cualquier momento</span>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[2px] rounded-b-2xl">
          <div className="text-center space-y-3 px-6">
            <span className="text-3xl" aria-hidden="true">🔗</span>
            <p className="font-bold text-gray-900">Disponible en v3.0</p>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              La <strong className="text-gray-700">Ley 21.658 (Fintech)</strong> ya permite
              que autorices a una app a leer tus movimientos directamente desde tu banco —
              sin descargar ni subir ningún archivo.
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
