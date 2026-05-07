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
    <div className="bg-white rounded-xl shadow p-6 space-y-4 no-print">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          🔒 Tu cartola se procesa en memoria y no se guarda. Nadie más accede a tus datos.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-sm">Prueba con un perfil de ejemplo:</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => loadDemo('paula')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Demo Paula (emprendedora)
          </button>
          <button
            onClick={() => loadDemo('luis')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Demo Luis (jubilado)
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-sm">O sube tu propia cartola PDF:</p>

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="segmento"
              value="emprendedora"
              checked={segmento === 'emprendedora'}
              onChange={() => setSegmento('emprendedora')}
              className="accent-blue-600"
            />
            Emprendedora / Trabajadora
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="segmento"
              value="jubilado"
              checked={segmento === 'jubilado'}
              onChange={() => setSegmento('jubilado')}
              className="accent-blue-600"
            />
            Jubilado / Pensionado
          </label>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileInput}
          />
          {fileName ? (
            <p className="text-sm text-blue-700 font-medium">📄 {fileName}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Arrastra tu cartola PDF aquí o <span className="text-blue-600 underline">haz clic para seleccionar</span>
              <br />
              <span className="text-xs text-gray-400">Solo PDF · máx. 5 MB · con texto seleccionable</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
