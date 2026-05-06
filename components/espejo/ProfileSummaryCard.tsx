import type { EspejoProfileSummary } from '@/types/espejo'

const CLP = (n: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n)

export default function ProfileSummaryCard({ summary }: { summary: EspejoProfileSummary }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Hola {summary.nombreDemo ?? 'Espejo'} — así te ven hoy.
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Ingresos mensuales</p>
          <p className="font-semibold">{CLP(summary.ingresosMensuales)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Regularidad</p>
          <p className="font-semibold capitalize">{summary.ingresosRegularidad}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Egresos mensuales</p>
          <p className="font-semibold">{CLP(summary.egresosMensuales)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Saldo fin de mes</p>
          <p
            className={`font-semibold ${summary.saldoPromedioFinMes < 100000 ? 'text-red-600' : 'text-green-600'}`}
          >
            {CLP(summary.saldoPromedioFinMes)}
          </p>
        </div>
        <div
          className={`rounded-lg p-3 ${summary.usoCupoPct >= 80 ? 'bg-red-50' : summary.usoCupoPct >= 50 ? 'bg-yellow-50' : 'bg-green-50'}`}
        >
          <p className="text-xs text-gray-500">Uso de cupo</p>
          <p className="font-semibold">{summary.usoCupoPct}%</p>
        </div>
        <div
          className={`rounded-lg p-3 ${summary.mesesConSaldoNegativo > 0 ? 'bg-red-50' : 'bg-green-50'}`}
        >
          <p className="text-xs text-gray-500">Meses en rojo</p>
          <p className="font-semibold">{summary.mesesConSaldoNegativo}</p>
        </div>
      </div>
    </div>
  )
}
