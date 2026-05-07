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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg space-y-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">Borrador de carta</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500">{signal.titulo}</p>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Tu nombre (opcional)"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Nombre de la institución"
            value={institucion}
            onChange={e => setInstitucion(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableThinking}
              onChange={e => setEnableThinking(e.target.checked)}
              className="accent-blue-600"
            />
            <span>
              Razonamiento extendido
              <span className="ml-1 text-xs text-gray-400">(más preciso)</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableCitations}
              onChange={e => setEnableCitations(e.target.checked)}
              className="accent-blue-600"
            />
            <span>
              Citar ley exacta
              <span className="ml-1 text-xs text-gray-400">(referencia legal)</span>
            </span>
          </label>
        </div>

        <button
          onClick={handleGenerar}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generando…' : 'Generar borrador'}
        </button>

        {modoUsado && (
          <p className="text-xs text-gray-400">
            Generado con: <span className="font-mono text-gray-600">{modoUsado}</span>
          </p>
        )}

        {carta && (
          <>
            <textarea
              value={carta}
              onChange={e => setCarta(e.target.value)}
              rows={8}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button onClick={handleCopy} className="text-sm text-blue-600 underline">
              {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
            </button>
          </>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            Este borrador es una ayuda inicial. Revísalo con un abogado, con SERNAC o con un
            programa de asesoría gratuita antes de enviarlo.
          </p>
        </div>
      </div>
    </div>
  )
}
