'use client'

import { useRef, useState } from 'react'
import type { EspejoResponse, Segmento } from '@/types/espejo'

interface CartolaUploadProps {
  onAnalyzed: (resp: EspejoResponse) => void
  onError: (msg: string) => void
  setLoading: (b: boolean) => void
}

type Tab = 'demo' | 'upload'

type HintId = 'independiente' | 'jubilado' | 'dependiente' | 'multiple_bancos'

const CONTEXT_HINTS: { id: HintId; icon: string; label: string }[] = [
  { id: 'independiente', icon: '🧑‍💼', label: 'Trabajo de forma independiente o tengo un emprendimiento' },
  { id: 'jubilado',      icon: '👴',    label: 'Recibo pensión o soy jubilado/a' },
  { id: 'dependiente',   icon: '🏢',    label: 'Soy empleado/a con sueldo fijo mensual' },
  { id: 'multiple_bancos', icon: '🏦',  label: 'Uso más de un banco o tengo varias cuentas' },
]

function deriveSegmento(hints: HintId[]): Segmento {
  if (hints.includes('jubilado')) return 'jubilado'
  return 'emprendedora'
}

const DEMO_PROFILES = {
  paula: {
    emoji: '👩‍💼',
    name: 'Paula',
    tag: 'Emprendedora · 34 años · Santiago',
    description: 'Gestiona su propio negocio. Sus ingresos varían cada mes y usa la tarjeta de crédito como capital de trabajo.',
    signals: [
      '💳 85% del cupo de crédito usado',
      '⚠️ Avances de efectivo todos los meses',
      '📈 Tasa estimada cerca de la TMC (límite legal)',
      '✅ Ingresos que llegan puntualmente',
      '🔴 Servicios pagados con atraso',
    ],
    segmento: 'emprendedora' as Segmento,
  },
  luis: {
    emoji: '👴',
    name: 'Luis',
    tag: 'Jubilado · 68 años · Valparaíso',
    description: 'Recibe su pensión mensual de AFP. Gasta principalmente en salud, medicamentos y servicios básicos.',
    signals: [
      '✅ Pensión fija y puntual cada mes',
      '✅ Sin deuda de consumo activa',
      '🟡 Gastos en salud sobre el promedio',
      '✅ Saldo siempre positivo',
      '🔵 Cuenta vista BancoEstado activa',
    ],
    segmento: 'jubilado' as Segmento,
  },
}

const FILE_ERRORS: Record<string, string> = {
  type: 'Solo se aceptan archivos PDF. Asegúrate de exportar o descargar tu cartola en formato PDF desde tu banco.',
  size: 'El archivo supera el límite de 5 MB. Descarga solo los últimos 3-6 meses de movimientos.',
  content: 'El PDF debe tener texto seleccionable (no una imagen escaneada). Descarga la cartola directamente desde el portal web de tu banco.',
}

export default function CartolaUpload({ onAnalyzed, onError, setLoading }: CartolaUploadProps) {
  const [tab, setTab]               = useState<Tab>('demo')
  const [selected, setSelected]     = useState<'paula' | 'luis' | null>(null)
  const [hints, setHints]           = useState<HintId[]>([])
  const [fileName, setFileName]     = useState<string | null>(null)
  const [dragging, setDragging]     = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [enableThinking, setEnableThinking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function toggleHint(id: HintId) {
    setHints(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
  }

  async function loadDemo(demoId: 'paula' | 'luis') {
    setUploadError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'demo', demoId, enableThinking }),
      })
      if (!res.ok) throw new Error('Error al cargar')
      const data: EspejoResponse = await res.json()
      onAnalyzed(data)
    } catch {
      onError('No se pudo cargar el perfil demo. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  function validateFile(file: File): string | null {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return FILE_ERRORS.type
    }
    if (file.size > 5 * 1024 * 1024) {
      return FILE_ERRORS.size
    }
    return null
  }

  async function uploadPDF(file: File) {
    setUploadError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }
    setFileName(file.name)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('segmento', deriveSegmento(hints))
      if (hints.length > 0) form.append('contextHints', hints.join(','))
      form.append('enableThinking', String(enableThinking))
      const res = await fetch('/api/analyze', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = (err as { error?: string }).error ?? ''
        if (msg.toLowerCase().includes('texto seleccionable') || msg.toLowerCase().includes('selectable')) {
          setUploadError(FILE_ERRORS.content)
        } else {
          setUploadError(msg || 'No se pudo analizar la cartola.')
        }
        setFileName(null)
        return
      }
      const data: EspejoResponse = await res.json()
      onAnalyzed(data)
    } catch {
      setUploadError('No se pudo conectar con el servidor. Verifica tu conexión.')
      setFileName(null)
    } finally {
      setLoading(false)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadPDF(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadPDF(file)
  }

  const profile = selected ? DEMO_PROFILES[selected] : null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
      {/* Tab switcher */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setTab('demo'); setUploadError(null) }}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
            tab === 'demo'
              ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          🧪 Modo demo
        </button>
        <button
          onClick={() => { setTab('upload'); setSelected(null); setUploadError(null) }}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
            tab === 'upload'
              ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          📄 Mi cartola real
        </button>
      </div>

      {/* ── DEMO TAB ── */}
      {tab === 'demo' && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">
            Explora el Espejo con un perfil sintético. No necesitas subir ningún archivo.
          </p>

          {/* Persona cards */}
          <div className="grid grid-cols-2 gap-3">
            {(['paula', 'luis'] as const).map(id => {
              const p = DEMO_PROFILES[id]
              const isSelected = selected === id
              return (
                <button
                  key={id}
                  onClick={() => setSelected(isSelected ? null : id)}
                  className={`text-left rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-3xl mb-2" aria-hidden="true">{p.emoji}</div>
                  <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{p.tag.split(' · ')[0]}</p>
                  {isSelected && (
                    <span className="inline-block mt-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Seleccionado
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Expanded profile preview */}
          {profile && selected && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 animate-fade-in">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {profile.emoji} {profile.name} — {profile.tag}
                </p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{profile.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Señales que aparecerán en el análisis
                </p>
                <ul className="space-y-1">
                  {profile.signals.map(s => (
                    <li key={s} className="text-xs text-gray-700 flex gap-2">
                      <span className="shrink-0">{s.slice(0, 2)}</span>
                      <span>{s.slice(2).trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => loadDemo(selected)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Ver Espejo de {profile.name} →
              </button>
            </div>
          )}

          {!selected && (
            <p className="text-xs text-gray-400 text-center pt-1">
              Selecciona un perfil para ver los detalles antes de cargar el análisis
            </p>
          )}

          {/* Extended thinking toggle */}
          <label className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all ${
            enableThinking ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200 hover:bg-slate-50'
          }`}>
            <input
              type="checkbox"
              checked={enableThinking}
              onChange={e => setEnableThinking(e.target.checked)}
              className="accent-purple-600 shrink-0"
            />
            <span className="text-base shrink-0" aria-hidden="true">🧠</span>
            <div>
              <span className="text-sm font-medium text-gray-800">Razonamiento extendido</span>
              <span className="ml-2 text-xs text-gray-400">Más profundo · ~2× más lento</span>
            </div>
          </label>
        </div>
      )}

      {/* ── UPLOAD TAB ── */}
      {tab === 'upload' && (
        <div className="p-5 space-y-4">
          {/* Privacy banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex gap-2 items-start">
            <span className="text-emerald-600 shrink-0 mt-0.5" aria-hidden="true">🔒</span>
            <p className="text-xs text-emerald-700">
              Tu cartola se procesa en memoria del servidor y <strong>nunca se almacena</strong>.
              El archivo se elimina automáticamente al terminar el análisis.
            </p>
          </div>

          {/* Context hints — optional checklist */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-700">Cuéntanos un poco (opcional)</p>
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                El análisis se infiere de tu cartola
              </span>
            </div>
            <div className="space-y-1.5">
              {CONTEXT_HINTS.map(h => (
                <label
                  key={h.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all ${
                    hints.includes(h.id)
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hints.includes(h.id)}
                    onChange={() => toggleHint(h.id)}
                    className="accent-blue-600 shrink-0"
                  />
                  <span className="text-base shrink-0" aria-hidden="true">{h.icon}</span>
                  <span className="text-sm text-gray-700">{h.label}</span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 pt-0.5">
              Si no marcas nada, el Espejo infiere tu perfil directamente desde la cartola.
            </p>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all ${
              dragging
                ? 'border-blue-400 bg-blue-50'
                : uploadError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            {fileName ? (
              <div className="space-y-1">
                <p className="text-2xl" aria-hidden="true">📄</p>
                <p className="text-sm text-blue-700 font-semibold">{fileName}</p>
                <p className="text-xs text-gray-400">Haz clic para cambiar el archivo</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-3xl" aria-hidden="true">📂</p>
                <p className="text-sm text-gray-600">
                  Arrastra aquí o{' '}
                  <span className="text-blue-600 underline font-medium">selecciona tu cartola PDF</span>
                </p>
                <p className="text-xs text-gray-400">
                  Solo PDF · Máximo 5 MB · Debe tener texto seleccionable
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start">
              <span className="text-red-500 shrink-0 text-base" aria-hidden="true">⚠️</span>
              <div className="space-y-1">
                <p className="text-sm text-red-700 font-medium">No se pudo procesar el archivo</p>
                <p className="text-xs text-red-600 leading-relaxed">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Help note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>¿Cómo obtengo mi cartola en PDF?</strong> Ingresa al portal web de tu banco
              → Movimientos o Cartola → Descargar o Exportar → PDF. Asegúrate de que sea
              descargable (no una imagen escaneada).
            </p>
          </div>

          {/* Extended thinking toggle */}
          <label className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all ${
            enableThinking ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200 hover:bg-slate-50'
          }`}>
            <input
              type="checkbox"
              checked={enableThinking}
              onChange={e => setEnableThinking(e.target.checked)}
              className="accent-purple-600 shrink-0"
            />
            <span className="text-base shrink-0" aria-hidden="true">🧠</span>
            <div>
              <span className="text-sm font-medium text-gray-800">Razonamiento extendido</span>
              <span className="ml-2 text-xs text-gray-400">Más profundo · ~2× más lento</span>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
