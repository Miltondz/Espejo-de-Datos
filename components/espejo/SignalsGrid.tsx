'use client'

import { useState } from 'react'
import type { EspejoSignal, Segmento } from '@/types/espejo'
import CartaModal from './CartaModal'

const TYPE_CONFIG: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  positiva: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: '✅',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  ambigua: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '⚠️',
    badge: 'bg-amber-100 text-amber-700',
  },
  riesgo: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '🔴',
    badge: 'bg-red-100 text-red-700',
  },
  informativa: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'ℹ️',
    badge: 'bg-blue-100 text-blue-700',
  },
  sin_datos: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: '—',
    badge: 'bg-gray-100 text-gray-600',
  },
}

const IMPORTANCE_LABEL: Record<number, string> = {
  3: 'Alta',
  2: 'Media',
  1: 'Baja',
}

function SignalCard({
  signal,
  onCartaClick,
}: {
  signal: EspejoSignal
  onCartaClick: (s: EspejoSignal) => void
}) {
  const cfg = TYPE_CONFIG[signal.tipo] ?? TYPE_CONFIG.sin_datos
  const isHigh = signal.importancia === 3

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 ${cfg.bg} ${cfg.border} ${
        isHigh ? 'ring-1 ring-offset-1 ring-red-200' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span aria-hidden="true" className="text-base shrink-0 mt-0.5">{cfg.icon}</span>
          <p className="font-semibold text-sm text-gray-900 leading-tight">{signal.titulo}</p>
        </div>
        {isHigh && (
          <span className="shrink-0 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            ALTA
          </span>
        )}
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{signal.descripcionCorta}</p>
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {signal.valorResumen}
        </span>
        {signal.esLegal && (
          <button
            onClick={() => onCartaClick(signal)}
            className="text-xs text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded-full font-medium transition-colors"
          >
            Generar carta →
          </button>
        )}
      </div>
    </div>
  )
}

export default function SignalsGrid({
  signals,
  segmento,
}: {
  signals: EspejoSignal[]
  segmento: Segmento
}) {
  const [activeSignal, setActiveSignal] = useState<EspejoSignal | null>(null)

  const sorted = [...signals].sort((a, b) => b.importancia - a.importancia)

  const byImportance: Record<number, EspejoSignal[]> = { 3: [], 2: [], 1: [] }
  for (const s of sorted) {
    const key = s.importancia as 1 | 2 | 3
    if (byImportance[key]) byImportance[key].push(s)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Señales de tu perfil</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {signals.length} señales detectadas ·{' '}
            {signals.filter(s => s.esLegal).length > 0
              ? `${signals.filter(s => s.esLegal).length} permiten generar carta`
              : 'ordenadas por importancia'}
          </p>
        </div>
        <div className="p-6 space-y-6">
          {([3, 2, 1] as const).map(
            imp =>
              byImportance[imp].length > 0 && (
                <div key={imp}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Importancia {IMPORTANCE_LABEL[imp]}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {byImportance[imp].map(signal => (
                      <SignalCard
                        key={signal.id}
                        signal={signal}
                        onCartaClick={setActiveSignal}
                      />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {activeSignal && (
        <CartaModal
          signal={activeSignal}
          segmento={segmento}
          onClose={() => setActiveSignal(null)}
        />
      )}
    </>
  )
}
