'use client'

import { useState } from 'react'
import type { EspejoSignal, Segmento } from '@/types/espejo'
import CartaModal from './CartaModal'

const COLORS: Record<string, string> = {
  positiva: 'bg-emerald-50 border-emerald-200',
  ambigua: 'bg-yellow-50 border-yellow-200',
  riesgo: 'bg-red-50 border-red-200',
  sin_datos: 'bg-gray-50 border-gray-200',
}

const ICONS: Record<string, string> = {
  positiva: '✅',
  ambigua: '⚠️',
  riesgo: '🔴',
  sin_datos: '—',
}

export default function SignalsGrid({ signals, segmento }: { signals: EspejoSignal[]; segmento: Segmento }) {
  const [activeSignal, setActiveSignal] = useState<EspejoSignal | null>(null)

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Señales de tu perfil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {signals.map(signal => (
            <div key={signal.id} className={`rounded-lg border p-4 ${COLORS[signal.tipo]}`}>
              <div className="flex items-start gap-2">
                <span aria-hidden="true">{ICONS[signal.tipo]}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{signal.titulo}</p>
                  <p className="text-xs text-gray-600 mt-1">{signal.descripcionCorta}</p>
                  <p className="text-xs font-medium mt-2 text-gray-700">{signal.valorResumen}</p>
                  {signal.esLegal && (
                    <button
                      onClick={() => setActiveSignal(signal)}
                      className="mt-2 text-xs text-blue-600 underline"
                    >
                      Generar borrador de carta
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeSignal && (
        <CartaModal signal={activeSignal} segmento={segmento} onClose={() => setActiveSignal(null)} />
      )}
    </>
  )
}
