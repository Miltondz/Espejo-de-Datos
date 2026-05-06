'use client'

import { useState } from 'react'
import type { EspejoLens, EspejoSignal } from '@/types/espejo'

const LENS_ICONS: Record<string, string> = {
  bank: '🏦',
  fintech: '📱',
  estado: '🏛️',
}

const IMPACT_COLORS: Record<string, string> = {
  positivo: 'text-emerald-700',
  negativo: 'text-red-700',
  neutral: 'text-yellow-700',
}

const IMPACT_ARROWS: Record<string, string> = {
  positivo: '↑',
  negativo: '↓',
  neutral: '→',
}

export default function InstitutionLensesTabs({
  lenses,
  signals,
}: {
  lenses: EspejoLens[]
  signals: EspejoSignal[]
}) {
  const [active, setActive] = useState(0)
  const signalMap = new Map(signals.map(s => [s.id, s]))
  const lens = lenses[active]

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cómo te ven</h2>
      <div className="flex gap-2 mb-4 flex-wrap">
        {lenses.map((l, i) => (
          <button
            key={l.institutionType}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {LENS_ICONS[l.institutionType]} {l.nombre}
          </button>
        ))}
      </div>
      {lens && (
        <div>
          <p className="text-lg font-semibold mb-2">{lens.headline}</p>
          <p className="text-gray-600 text-sm mb-4">{lens.resumen}</p>
          <ul className="space-y-2">
            {lens.señalesClaves.map(sv => {
              const signal = signalMap.get(sv.signalId)
              return (
                <li key={sv.signalId} className="flex items-start gap-2 text-sm">
                  <span className={`font-bold ${IMPACT_COLORS[sv.impacto]}`}>
                    {IMPACT_ARROWS[sv.impacto]}
                  </span>
                  <div>
                    <span className="font-medium">{signal?.titulo ?? sv.signalId}:</span>{' '}
                    <span className="text-gray-600">{sv.comentario}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
