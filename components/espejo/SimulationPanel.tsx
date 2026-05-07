'use client'

import { useState } from 'react'
import type { EspejoSimulationSuggestion, EspejoSignal, Segmento } from '@/types/espejo'

interface SimulationPanelProps {
  signals: EspejoSignal[]
  segmento: Segmento
  initialSuggestion?: EspejoSimulationSuggestion
}

type SimOption = {
  id: string
  goal: string
  icon: string
  label: string
  desc: string
  control: 'slider' | 'toggle'
  sliderMin?: number
  sliderMax?: number
  sliderDefault?: number
  sliderLabel?: string
  relevantSignals: string[]
}

const SIM_OPTIONS: SimOption[] = [
  {
    id: 'reducir_uso_cupo',
    goal: 'reducir_uso_cupo',
    icon: '💳',
    label: 'Bajar uso de cupo',
    desc: '¿Qué pasa si usas menos de tu tarjeta de crédito?',
    control: 'slider',
    sliderMin: 5,
    sliderMax: 30,
    sliderDefault: 20,
    sliderLabel: 'Reducir uso de cupo en',
    relevantSignals: ['sig_uso_cupo_alto', 'sig_uso_cupo_medio'],
  },
  {
    id: 'reducir_avances',
    goal: 'reducir_avances',
    icon: '💸',
    label: 'Eliminar avances',
    desc: '¿Qué pasa si dejas de pedir avances de efectivo?',
    control: 'toggle',
    relevantSignals: ['sig_avances_recurrentes'],
  },
  {
    id: 'formalizar_ingresos',
    goal: 'formalizar_ingresos',
    icon: '📋',
    label: 'Formalizar ingresos',
    desc: '¿Qué pasa si declaras más de lo que recibes en tu cuenta?',
    control: 'slider',
    sliderMin: 10,
    sliderMax: 50,
    sliderDefault: 30,
    sliderLabel: 'Cerrar brecha de formalidad en',
    relevantSignals: ['sig_brecha_formalidad'],
  },
]

export default function SimulationPanel({
  signals,
  segmento,
  initialSuggestion,
}: SimulationPanelProps) {
  const signalIds = new Set(signals.map(s => s.id))

  // Only show options where at least one relevant signal is present, or always show reducir_uso_cupo
  const availableOptions = SIM_OPTIONS.filter(
    opt => opt.id === 'reducir_uso_cupo' || opt.relevantSignals.some(id => signalIds.has(id))
  )

  const [activeOption, setActiveOption] = useState<SimOption>(availableOptions[0])
  const [pct, setPct] = useState(activeOption.sliderDefault ?? 20)
  const [suggestion, setSuggestion] = useState<EspejoSimulationSuggestion | undefined>(initialSuggestion)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSelectOption(opt: SimOption) {
    setActiveOption(opt)
    setPct(opt.sliderDefault ?? 20)
    setSuggestion(undefined)
    setError(null)
  }

  async function handleSimulate() {
    setLoading(true)
    setError(null)
    try {
      const hypothesis =
        activeOption.control === 'slider'
          ? activeOption.id === 'reducir_uso_cupo'
            ? { reducirUsoCupoPct: pct }
            : { formalizarVentasPct: pct }
          : { reducirAvances: true }

      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segmento,
          goal: activeOption.goal,
          hypothesis,
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
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Modifica un hábito financiero y ve cómo cambiaría tu perfil. La simulación muestra qué
          señales mejorarían y cómo te vería cada institución — es educativa, no una promesa.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* How it works callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-start text-xs text-gray-600">
          <span className="text-slate-400 shrink-0 text-base mt-0.5" aria-hidden="true">ℹ️</span>
          <p className="leading-relaxed">
            Selecciona un cambio posible en tus hábitos. El Espejo calcula cómo afectaría a tus
            señales usando los mismos indicadores macro (UF, TPM, TMC) con los que se generó tu
            análisis.
          </p>
        </div>

        {/* Option selector */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Elige qué cambiar:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  activeOption.id === opt.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span aria-hidden="true">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active option description */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-blue-900">{activeOption.desc}</p>
        </div>

        {/* Control */}
        {activeOption.control === 'slider' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                {activeOption.sliderLabel}:
              </label>
              <span className="text-xl font-black text-blue-600">{pct}%</span>
            </div>
            <input
              type="range"
              min={activeOption.sliderMin}
              max={activeOption.sliderMax}
              step={5}
              value={pct}
              onChange={e => setPct(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{activeOption.sliderMin}% (cambio menor)</span>
              <span>{activeOption.sliderMax}% (cambio mayor)</span>
            </div>
          </div>
        )}

        {activeOption.control === 'toggle' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
            Esta simulación asume que <strong>eliminas completamente los avances de efectivo</strong> y
            usas solo pagos directos con tarjeta. Los avances tienen las tasas más altas de cualquier
            producto bancario — eliminarlos tiene impacto inmediato.
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-600 text-white px-7 py-3 rounded-xl text-sm font-bold hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 transition-all no-print"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculando impacto…
            </span>
          ) : (
            `Ver impacto de "${activeOption.label}" →`
          )}
        </button>

        {error && (
          <p className="text-red-600 text-sm flex gap-2">
            <span>⚠️</span> {error}
          </p>
        )}

        {/* Result */}
        {suggestion && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0" aria-hidden="true">💡</span>
              <div className="space-y-1.5">
                <p className="font-bold text-sm text-gray-900">{suggestion.descripcionAccion}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{suggestion.explicacion}</p>
              </div>
            </div>

            {suggestion.señalesMejoran.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Señales que mejorarían
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestion.señalesMejoran.map(id => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full"
                    >
                      ✅ {id.replace(/^sig_/, '').replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400">
          Simulación educativa. No garantiza aprobaciones ni decisiones de bancos, fintechs o el Estado.
        </p>
      </div>
    </div>
  )
}
