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

export default function DashboardPage() {
  const [data, setData] = useState<MacroData>({
    ufValor: null, ipcPct: null, tpmPct: null, tmcPct: null,
    usdClp: null, usdFecha: null, imacec: null, imacecFecha: null,
    fuenteBde: false, fechaConsulta: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

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
      sub:   'Unidad de Fomento',
      fuente: 'mindicador.cl',
    },
    {
      label: 'IPC último mes',
      value: data.ipcPct !== null ? `${data.ipcPct.toFixed(1)}%` : '—',
      sub:   'Inflación mensual',
      fuente: 'mindicador.cl',
    },
    {
      label: 'TPM',
      value: data.tpmPct !== null ? `${data.tpmPct.toFixed(2)}%` : '—',
      sub:   'Tasa política monetaria',
      fuente: 'mindicador.cl',
    },
    {
      label: 'TMC',
      value: data.tmcPct !== null ? `${data.tmcPct.toFixed(2)}%` : '—',
      sub:   'Tasa máxima convencional',
      fuente: 'mindicador.cl',
    },
    {
      label: 'USD/CLP',
      value: data.usdClp !== null ? CLP(data.usdClp) : '—',
      sub:   data.usdFecha ? `Dólar observado ${data.usdFecha}` : 'Dólar observado',
      fuente: 'BCentral BDE',
      badge: data.fuenteBde,
    },
    {
      label: 'IMACEC',
      value: data.imacec !== null ? data.imacec.toFixed(1) : '—',
      sub:   data.imacecFecha ? `Actividad econ. ${data.imacecFecha.slice(0, 7)}` : 'Actividad econ. mensual',
      fuente: 'BCentral BDE',
      badge: data.fuenteBde,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Macro</h1>
        {data.fechaConsulta && (
          <span className="text-xs text-gray-400">Actualizado: {data.fechaConsulta}</span>
        )}
      </div>

      <p className="text-gray-500 text-sm">
        Indicadores económicos en tiempo real —{' '}
        <a href="https://mindicador.cl" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mindicador.cl</a>
        {data.fuenteBde && (
          <> y <a href="https://si3.bcentral.cl" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Banco Central BDE</a></>
        )}
      </p>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow p-4 text-center animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
              <div className="h-7 bg-gray-200 rounded w-1/2 mx-auto mb-1" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          No se pudieron cargar los indicadores. Revisa tu conexión a internet.
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {indicadores.map(({ label, value, sub, fuente, badge }) => (
            <div key={label} className="bg-white rounded-xl shadow p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <p className="text-xs text-gray-500">{label}</p>
                {badge && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-medium">BCCh</span>
                )}
              </div>
              <p className="text-2xl font-bold text-blue-700 my-1">{value}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/analizador"
        className="block text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
      >
        Ir a tu Espejo
      </Link>
    </div>
  )
}
