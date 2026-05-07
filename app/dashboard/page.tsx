'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface MacroData {
  ufValor:       number | null
  ipcPct:        number | null
  tpmPct:        number | null
  tmcPct:        number | null
  usdClp:        number | null
  usdFecha:      string | null
  imacec:        number | null
  imacecFecha:   string | null
  fuenteBde:     boolean
  fechaConsulta: string | null
}

const CLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

function IndicadorCard({
  label,
  value,
  sub,
  badge,
  highlight,
}: {
  label: string
  value: string
  sub: string
  badge?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
        highlight ? 'border-amber-200 bg-amber-50' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        {badge && (
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-1.5">{sub}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-7 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<MacroData>({
    ufValor: null, ipcPct: null, tpmPct: null, tmcPct: null,
    usdClp: null, usdFecha: null, imacec: null, imacecFecha: null,
    fuenteBde: false, fechaConsulta: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/macro')
      .then(r => r.json())
      .then((d: MacroData) => {
        if (!d.ufValor && !d.ipcPct && !d.tpmPct) setError(true)
        setData(d)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const indicadores = [
    {
      label: 'UF hoy',
      value: data.ufValor !== null ? CLP(data.ufValor) : '—',
      sub: 'Unidad de Fomento · Mindicador.cl',
    },
    {
      label: 'IPC último mes',
      value: data.ipcPct !== null ? `${data.ipcPct.toFixed(1)}%` : '—',
      sub: 'Inflación mensual · Mindicador.cl',
    },
    {
      label: 'TPM',
      value: data.tpmPct !== null ? `${data.tpmPct.toFixed(2)}%` : '—',
      sub: 'Tasa de política monetaria · BCCh',
    },
    {
      label: 'TMC vigente',
      value: data.tmcPct !== null ? `${data.tmcPct.toFixed(2)}%` : '—',
      sub: 'Tasa máxima convencional · Mindicador.cl',
      highlight: true,
    },
    {
      label: 'USD / CLP',
      value: data.usdClp !== null ? CLP(data.usdClp) : '—',
      sub: data.usdFecha ? `Dólar observado ${data.usdFecha}` : 'Dólar observado',
      badge: data.fuenteBde ? 'BCCh BDE' : undefined,
    },
    {
      label: 'IMACEC',
      value: data.imacec !== null ? `${data.imacec.toFixed(1)}` : '—',
      sub: data.imacecFecha
        ? `Actividad económica ${data.imacecFecha.slice(0, 7)}`
        : 'Actividad económica mensual',
      badge: data.fuenteBde ? 'BCCh BDE' : undefined,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Indicadores Macro</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Datos económicos en tiempo real usados por el Espejo para contextualizar tu perfil
            </p>
          </div>
          {data.fechaConsulta && (
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              Actualizado: {data.fechaConsulta}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap pt-1 text-xs text-gray-500">
          <a
            href="https://mindicador.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Mindicador.cl
          </a>
          {data.fuenteBde && (
            <>
              <span>·</span>
              <a
                href="https://si3.bcentral.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Banco Central de Chile (BDE)
              </a>
            </>
          )}
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
          <p className="font-semibold">No se pudieron cargar los indicadores.</p>
          <p className="mt-1 text-xs">Revisa tu conexión a internet e intenta nuevamente.</p>
        </div>
      )}

      {/* Data */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {indicadores.map(ind => (
            <IndicadorCard key={ind.label} {...ind} />
          ))}
        </div>
      )}

      {/* TMC explanation */}
      {!loading && !error && data.tmcPct !== null && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
            ¿Por qué importa la TMC?
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">
            La <strong>Tasa Máxima Convencional ({data.tmcPct.toFixed(2)}%)</strong> es el límite
            legal que ningún banco ni fintech puede superar. Si tu crédito tiene una tasa mayor,
            tienes derecho a reclamar. El Espejo compara tu perfil con este indicador para
            detectar situaciones de riesgo legal.
          </p>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/analizador"
        className="block text-center bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:from-blue-800 hover:to-blue-700 transition-all"
      >
        Analizar mi cartola con estos indicadores →
      </Link>
    </div>
  )
}
