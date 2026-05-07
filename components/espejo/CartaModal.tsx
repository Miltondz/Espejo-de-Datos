'use client'

import { useState } from 'react'
import type { EspejoSignal, Segmento } from '@/types/espejo'

interface CartaModalProps {
  signal: EspejoSignal
  segmento: Segmento
  onClose: () => void
}

export default function CartaModal({ signal, segmento, onClose }: CartaModalProps) {
  const [nombre, setNombre] = useState('')
  const [institucion, setInstitucion] = useState('')
  const [carta, setCarta] = useState('')
  const [modoUsado, setModoUsado] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [enableThinking, setEnableThinking] = useState(false)
  const [enableCitations, setEnableCitations] = useState(false)

  async function handleGenerar() {
    setLoading(true)
    setCarta('')
    setModoUsado(null)
    try {
      const res = await fetch('/api/generar-carta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoProblema: signal.id,
          nombreInstitucion: institucion,
          tipoProducto: 'crédito',
          segmento,
          nombreUsuario: nombre || undefined,
          enableThinking,
          enableCitations,
        }),
      })
      const data = await res.json()
      setCarta(data.cartaTexto ?? '')
      setModoUsado(data.modoUsado ?? null)
    } catch {
      setCarta('Error al generar. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(carta)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-start rounded-t-2xl z-10">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Borrador de carta</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{signal.titulo}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors ml-3 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Nombre de la institución (ej: Banco Falabella)"
              value={institucion}
              onChange={e => setInstitucion(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
          </div>

          {/* AI options */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Opciones IA</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableThinking}
                onChange={e => setEnableThinking(e.target.checked)}
                className="accent-blue-600 w-4 h-4"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">Razonamiento extendido</span>
                <span className="ml-2 text-xs text-gray-400">Más lento, más preciso</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCitations}
                onChange={e => setEnableCitations(e.target.checked)}
                className="accent-blue-600 w-4 h-4"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">Citar ley exacta</span>
                <span className="ml-2 text-xs text-gray-400">Incluye artículos de ley vigente</span>
              </div>
            </label>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerar}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando carta…
              </span>
            ) : (
              'Generar borrador'
            )}
          </button>

          {/* Feature badges */}
          {modoUsado && (
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {modoUsado.includes('extended-thinking') && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full">
                  🧠 Razonamiento extendido
                </span>
              )}
              {modoUsado.includes('citations') && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  📚 Citas legales verificadas
                </span>
              )}
              {modoUsado === 'fallback-determinista' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  Modo plantilla
                </span>
              )}
              {!modoUsado.includes('extended-thinking') && !modoUsado.includes('citations') && modoUsado !== 'fallback-determinista' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ✓ Generado con IA
                </span>
              )}
            </div>
          )}

          {/* Carta result */}
          {carta && (
            <div className="space-y-3">
              <textarea
                value={carta}
                onChange={e => setCarta(e.target.value)}
                rows={10}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono"
              />
              <button
                onClick={handleCopy}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  copied
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {copied ? '✅ ¡Copiado al portapapeles!' : '📋 Copiar al portapapeles'}
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Borrador educativo.</strong> Revísalo con un abogado, con SERNAC o con un
              programa de asesoría gratuita antes de enviarlo. Para asesoría gratuita:{' '}
              <a href="https://sernac.cl" target="_blank" rel="noopener noreferrer" className="underline">
                SERNAC
              </a>{' '}
              ·{' '}
              <a href="https://cmfeduca.cl" target="_blank" rel="noopener noreferrer" className="underline">
                CMF Educa
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
