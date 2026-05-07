'use client'

import { useState } from 'react'
import type { EspejoSimulationSuggestion, EspejoSignal, Segmento } from '@/types/espejo'

interface SimulationPanelProps {
  signals: EspejoSignal[]
  segmento: Segmento
  initialSuggestion?: EspejoSimulationSuggestion
}

export default function SimulationPanel({
  signals,
  segmento,
  initialSuggestion,
}: SimulationPanelProps) {
  const [pct, setPct] = useState(20)
  const [suggestion, setSuggestion] = useState<EspejoSimulationSuggestion | undefined>(
    initialSuggestion
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSimulate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segmento,
          goal: 'reducir_uso_cupo',
          hypothesis: { reducirUsoCupoPct: pct },
          signals,
        }),
      })
      if (!res.ok) throw new Error('Error al calcular')
      const data = await res.json()
      setSuggestion(data.simulationSuggestion)
    } catch {
      setError('No se pudo calcular el impacto. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-blue-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">¿Qué pasaría si…?</h2>
        <p className="text-sm text-gray-600 mt-0.5">
          Simula un cambio en tus hábitos y ve cómo afectaría tu perfil
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Reducir uso del cupo de crédito en:
            </label>
            <span className="text-lg font-black text-blue-600">{pct}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={pct}
            onChange={e => setPct(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
            aria-label="Porcentaje de reducción de cupo"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>5% (poco)</span>
            <span>30% (mucho)</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors no-print"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculando…
            </span>
          ) : (
            'Ver impacto →'
          )}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Result */}
        {suggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl shrink-0" aria-hidden="true">💡</span>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-gray-900">{suggestion.descripcionAccion}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{suggestion.explicacion}</p>
              </div>
            </div>
            {suggestion.señalesMejoran.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestion.señalesMejoran.map(id => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"
                  >
                    ✅ {id.replace(/^sig_/, '').replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400">
          Esta simulación es educativa. No garantiza decisiones de bancos, fintechs ni el Estado.
        </p>
      </div>
    </div>
  )
}
