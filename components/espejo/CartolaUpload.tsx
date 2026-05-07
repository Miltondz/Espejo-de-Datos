'use client'

import { useRef, useState } from 'react'
import type { EspejoResponse, Segmento } from '@/types/espejo'

interface CartolaUploadProps {
  onAnalyzed: (resp: EspejoResponse) => void
  onError: (msg: string) => void
  setLoading: (b: boolean) => void
}

export default function CartolaUpload({ onAnalyzed, onError, setLoading }: CartolaUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [segmento, setSegmento] = useState<Segmento>('emprendedora')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function loadDemo(demoId: 'paula' | 'luis') {
    setLoading(true)
    setFileName(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'demo', demoId }),
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

  async function uploadPDF(file: File) {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onError('Solo se aceptan archivos PDF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      onError('El archivo no puede superar 5 MB.')
      return
    }
    setFileName(file.name)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('segmento', segmento)
      const res = await fetch('/api/analyze', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? 'Error al analizar')
      }
      const data: EspejoResponse = await res.json()
      onAnalyzed(data)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'No se pudo analizar la cartola.')
      setFileName(null)
    } finally {
      setLoading(false)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadPDF(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadPDF(file)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
      {/* Privacy banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
        <span className="text-emerald-600" aria-hidden="true">🔒</span>
        <p className="text-xs text-emerald-700 font-medium">
          Tu cartola se procesa en memoria y nunca se almacena. Nadie más accede a tus datos.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Demo section */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Prueba con un perfil de ejemplo:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loadDemo('paula')}
              className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 py-3 text-left transition-colors group"
            >
              <span className="text-2xl shrink-0" aria-hidden="true">👩‍💼</span>
              <div>
                <p className="text-sm font-semibold text-blue-900 group-hover:text-blue-700">Demo Paula</p>
                <p className="text-xs text-blue-600">Emprendedora</p>
              </div>
            </button>
            <button
              onClick={() => loadDemo('luis')}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-left transition-colors group"
            >
              <span className="text-2xl shrink-0" aria-hidden="true">👴</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">Demo Luis</p>
                <p className="text-xs text-gray-500">Jubilado</p>
              </div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400 font-medium">o sube tu cartola PDF</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Segmento selector */}
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="segmento"
              value="emprendedora"
              checked={segmento === 'emprendedora'}
              onChange={() => setSegmento('emprendedora')}
              className="accent-blue-600"
            />
            <span className="text-gray-700">Emprendedora / Trabajadora</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="segmento"
              value="jubilado"
              checked={segmento === 'jubilado'}
              onChange={() => setSegmento('jubilado')}
              className="accent-blue-600"
            />
            <span className="text-gray-700">Jubilado / Pensionado</span>
          </label>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-blue-400 bg-blue-50'
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
                Arrastra tu cartola aquí o{' '}
                <span className="text-blue-600 underline font-medium">haz clic para seleccionar</span>
              </p>
              <p className="text-xs text-gray-400">
                Solo PDF · Máximo 5 MB · El texto debe ser seleccionable (no imagen escaneada)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
