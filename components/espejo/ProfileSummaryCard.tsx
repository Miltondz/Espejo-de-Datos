import type { EspejoProfileSummary } from '@/types/espejo'

const CLP = (n: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n)

function Stat({
  label,
  value,
  color = 'default',
}: {
  label: string
  value: string
  color?: 'default' | 'green' | 'red' | 'yellow'
}) {
  const valueColor = {
    default: 'text-gray-900',
    green: 'text-emerald-600',
    red: 'text-red-600',
    yellow: 'text-amber-600',
  }[color]

  return (
    <div className="bg-slate-50 rounded-xl p-3.5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`font-bold text-sm ${valueColor}`}>{value}</p>
    </div>
  )
}

const REGULARIDAD_LABEL: Record<string, string> = {
  estable: 'Estables',
  variable: 'Variables',
  irregular: 'Irregulares',
}

const REGULARIDAD_COLOR: Record<string, 'green' | 'yellow' | 'red'> = {
  estable: 'green',
  variable: 'yellow',
  irregular: 'red',
}

export default function ProfileSummaryCard({ summary }: { summary: EspejoProfileSummary }) {
  const ingresosRegularidadLabel = REGULARIDAD_LABEL[summary.ingresosRegularidad] ?? summary.ingresosRegularidad
  const ingresosRegularidadColor = REGULARIDAD_COLOR[summary.ingresosRegularidad] ?? 'default'

  const saldoColor =
    summary.saldoPromedioFinMes < 0
      ? 'red'
      : summary.saldoPromedioFinMes < 100_000
      ? 'yellow'
      : 'green'

  const cupoPct = summary.usoCupoPct
  const cupoColor: 'red' | 'yellow' | 'green' =
    cupoPct >= 80 ? 'red' : cupoPct >= 50 ? 'yellow' : 'green'

  const ingresosPct = summary.egresosMensuales / (summary.ingresosMensuales || 1)
  const barPct = Math.min(ingresosPct * 100, 100)
  const barColor = barPct >= 90 ? 'bg-red-500' : barPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 text-white">
        <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">
          Perfil analizado
        </p>
        <h2 className="text-xl font-bold">
          {summary.nombreDemo ? `Hola, ${summary.nombreDemo}` : 'Tu perfil financiero'} —{' '}
          así te ven hoy.
        </h2>
        <p className="text-blue-100 text-sm mt-1 capitalize">
          Segmento: {summary.segmento}
          {summary.tieneSobregiros && (
            <span className="ml-3 text-xs bg-red-500/30 text-red-100 border border-red-400/30 px-2 py-0.5 rounded-full">
              Con sobregiros
            </span>
          )}
          {summary.tieneAvancesEfectivo && (
            <span className="ml-2 text-xs bg-amber-500/30 text-amber-100 border border-amber-400/30 px-2 py-0.5 rounded-full">
              Avances de efectivo
            </span>
          )}
        </p>
      </div>

      {/* Stats grid */}
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat label="Ingresos mensuales" value={CLP(summary.ingresosMensuales)} color="green" />
          <Stat label="Egresos mensuales" value={CLP(summary.egresosMensuales)} />
          <Stat
            label="Regularidad de ingresos"
            value={ingresosRegularidadLabel}
            color={ingresosRegularidadColor}
          />
          <Stat
            label="Saldo fin de mes"
            value={CLP(summary.saldoPromedioFinMes)}
            color={saldoColor}
          />
          <Stat
            label="Uso de cupo"
            value={`${summary.usoCupoPct}%`}
            color={cupoColor}
          />
          <Stat
            label="Meses en rojo"
            value={`${summary.mesesConSaldoNegativo}`}
            color={summary.mesesConSaldoNegativo > 0 ? 'red' : 'green'}
          />
        </div>

        {/* Ingresos vs egresos bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Ingresos vs egresos</span>
            <span className={barPct >= 90 ? 'text-red-600 font-medium' : ''}>
              {Math.round(barPct)}% comprometido
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${barPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{CLP(summary.ingresosMensuales)}</span>
            <span className="text-xs">{CLP(summary.egresosMensuales)} en gastos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
