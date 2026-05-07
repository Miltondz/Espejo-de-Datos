'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  {
    icon: '📄',
    title: 'Leyendo tu cartola',
    desc: 'Extrayendo transacciones del documento',
  },
  {
    icon: '📊',
    title: 'Consultando indicadores macro',
    desc: 'UF, TMC, TPM y dólar desde fuentes oficiales',
  },
  {
    icon: '🔍',
    title: 'Analizando tu perfil financiero',
    desc: 'Calculando señales, patrones y umbrales legales',
  },
  {
    icon: '🪞',
    title: 'Generando tu Espejo',
    desc: 'Cómo te ven banco, fintech y Estado',
  },
]

export default function AnalysisProgress({ visible }: { visible: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!visible) {
      setStep(0)
      return
    }
    const timer = setInterval(() => {
      setStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 5500)
    return () => clearInterval(timer)
  }, [visible])

  if (!visible) return null

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 text-white text-center">
          <div className="text-3xl mb-2" aria-hidden="true">🪞</div>
          <h3 className="font-black text-lg">Construyendo tu Espejo…</h3>
          <p className="text-blue-200 text-xs mt-1">
            El análisis con IA tarda entre 10 y 30 segundos
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-blue-100">
          <div
            className="h-full bg-blue-500 transition-all duration-[1500ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="p-5 space-y-2">
          {STEPS.map((s, i) => {
            const isDone    = i < step
            const isCurrent = i === step
            const isPending = i > step

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isCurrent ? 'bg-blue-50 border border-blue-200' :
                  isDone    ? 'opacity-60' :
                              'opacity-25'
                }`}
              >
                {/* Step indicator */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    isDone    ? 'bg-emerald-100 text-emerald-700' :
                    isCurrent ? 'bg-blue-600 text-white' :
                                'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : <span>{s.icon}</span>}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    isCurrent ? 'text-blue-900' :
                    isDone    ? 'text-gray-600' :
                                'text-gray-400'
                  }`}>
                    {s.title}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-blue-600 mt-0.5">{s.desc}</p>
                  )}
                </div>

                {/* Spinner for current */}
                {isCurrent && (
                  <div className="shrink-0">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Invisible placeholder for pending */}
                {isPending && <div className="w-4 shrink-0" />}
              </div>
            )
          })}
        </div>

        {/* Privacy footer */}
        <div className="mx-5 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <p className="text-xs text-emerald-700">
            🔒 Tu cartola se procesa en memoria y <strong>nunca se almacena</strong>.
            Se descarta al terminar el análisis.
          </p>
        </div>
      </div>
    </div>
  )
}
