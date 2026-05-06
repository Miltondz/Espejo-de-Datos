'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Indicadores {
  ufValor: number | null
  ipcPct: number | null
  tpmPct: number | null
  tmcPct: number | null
  fechaConsulta: string | null
}

const CLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

export default function DashboardPage() {
  const [data, setData] = useState<Indicadores>({ ufValor: null, ipcPct: null, tpmPct: null, tmcPct: null, fechaConsulta: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const BASE = 'https://mindicador.cl/api'

    Promise.allSettled([
      fetch(`${BASE}/uf`).then(r => r.json()),
      fetch(`${BASE}/ipc`).then(r => r.json()),
      fetch(`${BASE}/tpm`).then(r => r.json()),
      fetch(`${BASE}/tmc`).then(r => r.json()),
    ]).then(([uf, ipc, tpm, tmc]) => {
      const ufValor  = uf.status  === 'fulfilled' ? Number(uf.value?.serie?.[0]?.valor)  : null
      const ipcPct   = ipc.status === 'fulfilled' ? Number(ipc.value?.serie?.[0]?.valor) : null
      const tpmPct   = tpm.status === 'fulfilled' ? Number(tpm.value?.serie?.[0]?.valor) : null
      const tmcPct   = tmc.status === 'fulfilled' ? Number(tmc.value?.serie?.[0]?.valor) : null
      const fecha    = uf.status  === 'fulfilled' ? uf.value?.serie?.[0]?.fecha?.slice(0, 10) : null

      if (ufValor === null && ipcPct === null && tpmPct === null) setError(true)
      setData({ ufValor, ipcPct, tpmPct, tmcPct, fechaConsulta: fecha })
    }).catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const indicadores = [
    {
      label: 'UF hoy',
      value: data.ufValor !== null ? CLP(data.ufValor) : '—',
      sub: 'Unidad de Fomento',
    },
    {
      label: 'IPC último mes',
      value: data.ipcPct !== null ? `${data.ipcPct.toFixed(1)}%` : '—',
      sub: 'Inflación mensual',
    },
    {
      label: 'TPM',
      value: data.tpmPct !== null ? `${data.tpmPct.toFixed(2)}%` : '—',
      sub: 'Tasa de política monetaria',
    },
    {
      label: 'TMC',
      value: data.tmcPct !== null ? `${data.tmcPct.toFixed(2)}%` : '—',
      sub: 'Tasa máxima convencional',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Macro</h1>
        {data.fechaConsulta && (
          <span className="text-xs text-gray-400">Actualizado: {data.fechaConsulta}</span>
        )}
      </div>

      <p className="text-gray-500 text-sm">
        Indicadores económicos en tiempo real desde{' '}
        <a href="https://mindicador.cl" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          mindicador.cl
        </a>
      </p>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3].map(i => (
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {indicadores.map(({ label, value, sub }) => (
            <div key={label} className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-xs text-gray-500">{label}</p>
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
