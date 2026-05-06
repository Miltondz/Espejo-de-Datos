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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-2">¿Qué pasaría si…?</h2>
      <p className="text-sm text-gray-600 mb-4">
        Simula un cambio y ve cómo afectaría tu perfil.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">
            Bajar uso de cupo en <span className="text-blue-600">{pct}%</span>
          </label>
          <input
            type="range"
            min={5}
            max={30}
            value={pct}
            onChange={e => setPct(Number(e.target.value))}
            className="w-full accent-blue-600"
            aria-label="Porcentaje de reducción de cupo"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5%</span>
            <span>30%</span>
          </div>
        </div>
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 no-print"
        >
          {loading ? 'Calculando…' : 'Ver impacto'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {suggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm">{suggestion.descripcionAccion}</p>
            <p className="text-xs text-gray-600">{suggestion.explicacion}</p>
            {suggestion.señalesMejoran.length > 0 && (
              <p className="text-xs font-medium text-emerald-700">
                ✅ Mejora: {suggestion.señalesMejoran.join(', ')}
              </p>
            )}
          </div>
        )}
        <p className="text-xs text-gray-400">
          Esta simulación es educativa. No garantiza decisiones de bancos, fintech o el Estado.
        </p>
      </div>
    </div>
  )
}
