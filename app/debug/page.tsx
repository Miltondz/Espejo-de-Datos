'use client'

import { useState } from 'react'
import type { AgentTraceResponse, ToolCallTrace } from '@/app/api/debug/trace/route'

const TOOL_COLORS: Record<string, string> = {
  parse_cartola:          'text-yellow-400',
  fetch_macro_indicators: 'text-cyan-400',
  build_financial_profile:'text-blue-400',
  extract_signals:        'text-purple-400',
  generate_lenses:        'text-green-400',
  simulate_change:        'text-orange-400',
}

const SIGNAL_COLORS: Record<string, string> = {
  riesgo:   'text-red-400',
  ambigua:  'text-yellow-400',
  positiva: 'text-green-400',
}

function TraceRow({ entry, idx }: { entry: ToolCallTrace; idx: number }) {
  const color = TOOL_COLORS[entry.tool] ?? 'text-white'
  return (
    <div className="border-b border-gray-700 py-2 font-mono text-sm">
      <div className="flex items-center gap-3">
        <span className="text-gray-500 w-5 text-right">{idx + 1}</span>
        <span className="text-gray-500">▶</span>
        <span className={`font-bold ${color}`}>{entry.tool}()</span>
        <span className="text-gray-500 text-xs ml-auto">{entry.elapsedMs}ms</span>
        {entry.status === 'error' && <span className="text-red-500 text-xs">✗ ERROR</span>}
        {entry.status === 'ok'    && <span className="text-green-500 text-xs">✓</span>}
      </div>
      <div className="ml-8 mt-1 text-gray-400 text-xs">
        <span className="text-gray-600">in  → </span>{entry.inputSummary}
      </div>
      <div className="ml-8 mt-0.5 text-gray-300 text-xs">
        <span className="text-gray-600">out → </span>{entry.outputSummary}
      </div>
    </div>
  )
}

export default function DebugPage() {
  const [data, setData]     = useState<AgentTraceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch('/api/debug/trace')
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? `HTTP ${res.status}`)
      }
      setData(await res.json())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-mono">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Espejo de Datos — Agent Trace</h1>
            <p className="text-gray-500 text-sm mt-0.5">MirrorBuilderAgent · demo Paula · claude-sonnet-4-6</p>
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-sans font-semibold transition-colors"
          >
            {loading ? '⟳ Ejecutando…' : '▶ Ejecutar agente'}
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="text-gray-400 text-sm animate-pulse">
              Ejecutando loop agéntico con Claude… (~40–60s)
            </div>
            <div className="mt-3 flex justify-center gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-4">

            {/* Stats bar */}
            <div className="bg-gray-900 rounded-xl px-5 py-3 flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">modelo  </span>
                <span className="text-cyan-400 font-bold">{data.model}</span>
              </div>
              <div>
                <span className="text-gray-500">demo  </span>
                <span className="text-white">{data.demoId}</span>
              </div>
              <div>
                <span className="text-gray-500">tool calls  </span>
                <span className="text-white">{data.trace.length}</span>
              </div>
              <div>
                <span className="text-gray-500">tiempo total  </span>
                <span className="text-white">{(data.totalMs / 1000).toFixed(1)}s</span>
              </div>
              <div className="ml-auto">
                {data.success
                  ? <span className="text-green-400 font-bold">✓ COMPLETADO</span>
                  : <span className="text-red-400 font-bold">✗ FALLÓ</span>
                }
              </div>
            </div>

            {/* Tool call trace */}
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-gray-400 text-xs">agentic loop — tool calls</span>
              </div>
              <div className="px-5 py-2">
                {data.trace.map((entry, i) => (
                  <TraceRow key={i} entry={entry} idx={i} />
                ))}
              </div>
            </div>

            {/* Signals output */}
            {data.finalSignals.length > 0 && (
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-700">
                  <span className="text-gray-400 text-xs">señales generadas ({data.finalSignals.length})</span>
                </div>
                <div className="px-5 py-3 space-y-1">
                  {data.finalSignals.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 w-4 text-right">{i + 1}</span>
                      <span className={`w-16 text-xs font-bold ${SIGNAL_COLORS[s.tipo] ?? 'text-white'}`}>{s.tipo}</span>
                      <span className="text-gray-300">{s.titulo}</span>
                      <span className="text-gray-600 text-xs ml-auto">{s.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="text-gray-600 text-xs text-center">
              Claude Impact Lab Chile 2026 · Espejo de Datos · Línea 01 Inclusión Financiera
            </p>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="bg-gray-900 rounded-xl p-8 text-center text-gray-500 text-sm">
            Presiona &quot;Ejecutar agente&quot; para correr el loop agéntico completo y ver cada tool call en tiempo real.
          </div>
        )}
      </div>
    </div>
  )
}
