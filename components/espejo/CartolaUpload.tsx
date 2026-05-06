'use client'

import type { EspejoResponse } from '@/types/espejo'

interface CartolaUploadProps {
  onAnalyzed: (resp: EspejoResponse) => void
  onError: (msg: string) => void
  setLoading: (b: boolean) => void
}

export default function CartolaUpload({ onAnalyzed, onError, setLoading }: CartolaUploadProps) {
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
            Probar con demo Paula
          </button>
          <button
            onClick={() => loadDemo('luis')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Probar con demo Luis
          </button>
        </div>
      </div>
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm">
        Subir cartola PDF / Excel — próximamente
      </div>
    </div>
  )
}
