import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Macro</h1>
      <p className="text-gray-500 text-sm">Indicadores económicos del día (próximamente en vivo desde mindicador.cl)</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'UF hoy', value: '$36.500', sub: 'Unidad de Fomento' },
          { label: 'IPC último mes', value: '0.3%', sub: 'Inflación mensual' },
          { label: 'TPM', value: '4.75%', sub: 'Tasa de política monetaria' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-blue-700 my-1">{value}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>
      <Link
        href="/analizador"
        className="block text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
      >
        Ir a tu Espejo
      </Link>
    </div>
  )
}
