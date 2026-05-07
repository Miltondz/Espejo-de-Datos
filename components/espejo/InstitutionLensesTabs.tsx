'use client'

import { useState } from 'react'
import type { EspejoLens, EspejoSignal } from '@/types/espejo'

const LENS_CONFIG: Record<
  string,
  { icon: string; color: string; activeBg: string; activeBorder: string; headlineBg: string }
> = {
  bank: {
    icon: '🏦',
    color: 'text-blue-700',
    activeBg: 'bg-blue-600 text-white',
    activeBorder: 'border-blue-600',
    headlineBg: 'bg-blue-50 border-blue-100',
  },
  fintech: {
    icon: '📱',
    color: 'text-purple-700',
    activeBg: 'bg-purple-600 text-white',
    activeBorder: 'border-purple-600',
    headlineBg: 'bg-purple-50 border-purple-100',
  },
  estado: {
    icon: '🏛️',
    color: 'text-emerald-700',
    activeBg: 'bg-emerald-600 text-white',
    activeBorder: 'border-emerald-600',
    headlineBg: 'bg-emerald-50 border-emerald-100',
  },
}

const IMPACT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  positivo: { icon: '↑', color: 'text-emerald-600', label: 'Positivo' },
  negativo: { icon: '↓', color: 'text-red-600', label: 'Negativo' },
  neutral: { icon: '→', color: 'text-amber-600', label: 'Neutral' },
  informativo: { icon: 'ℹ', color: 'text-blue-600', label: 'Informativo' },
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
  const cfg = LENS_CONFIG[lens?.institutionType] ?? LENS_CONFIG.bank

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Cómo te ven</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Tres lecturas distintas del mismo perfil financiero
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-1">
        {lenses.map((l, i) => {
          const c = LENS_CONFIG[l.institutionType] ?? LENS_CONFIG.bank
          const isActive = i === active
          return (
            <button
              key={l.institutionType}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? `${c.activeBg} ${c.activeBorder} shadow-sm`
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span aria-hidden="true">{c.icon}</span>
              {l.nombre}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {lens && (
        <div className="p-6 space-y-5">
          {/* Headline */}
          <div className={`rounded-xl border p-4 ${cfg.headlineBg}`}>
            <p className={`text-base font-semibold leading-snug ${cfg.color}`}>
              {cfg.icon} {lens.headline}
            </p>
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-700 leading-relaxed">{lens.resumen}</p>

          {/* Key signals */}
          {lens.señalesClaves.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Señales clave para esta perspectiva
              </p>
              <ul className="space-y-3">
                {lens.señalesClaves.map(sv => {
                  const signal = signalMap.get(sv.signalId)
                  const impCfg =
                    IMPACT_CONFIG[sv.impacto] ?? IMPACT_CONFIG.neutral
                  return (
                    <li
                      key={sv.signalId}
                      className="flex items-start gap-3 text-sm bg-slate-50 rounded-xl p-3"
                    >
                      <span
                        className={`font-bold text-base mt-0.5 shrink-0 ${impCfg.color}`}
                        aria-label={impCfg.label}
                      >
                        {impCfg.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          {signal?.titulo ?? sv.signalId}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{sv.comentario}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
