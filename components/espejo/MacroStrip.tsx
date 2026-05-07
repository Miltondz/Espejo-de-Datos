'use client'

import { useEffect, useState } from 'react'

interface MacroData {
  ufValor: number | null
  tpmPct: number | null
  tmcPct: number | null
  usdClp: number | null
  fechaConsulta: string
  fuenteBde: boolean
}

export default function MacroStrip() {
  const [data, setData] = useState<MacroData | null>(null)

  useEffect(() => {
    fetch('/api/macro')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) return null

  const items = [
    data.ufValor  !== null && { label: 'UF',  value: `$${data.ufValor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    data.tpmPct   !== null && { label: 'TPM', value: `${data.tpmPct}%` },
    data.tmcPct   !== null && { label: 'TMC', value: `${data.tmcPct}%` },
    data.usdClp   !== null && { label: 'USD', value: `$${Math.round(data.usdClp).toLocaleString('es-CL')}` },
  ].filter(Boolean) as { label: string; value: string }[]

  if (items.length === 0) return null

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl no-print overflow-x-auto">
      <div className="flex items-center gap-x-5 px-4 py-2.5 text-xs min-w-0">
        <span className="text-slate-500 font-semibold shrink-0 uppercase tracking-wide">
          Indicadores
        </span>
        {items.map(({ label, value }) => (
          <span key={label} className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400">{label}</span>
            <span className="font-bold text-gray-800">{value}</span>
          </span>
        ))}
        <span className="text-slate-400 shrink-0 hidden sm:inline ml-auto">
          mindicador.cl{data.fuenteBde ? ' · Banco Central' : ''}
        </span>
      </div>
    </div>
  )
}
