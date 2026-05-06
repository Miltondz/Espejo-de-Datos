'use client'

export default function PasaporteButton() {
  return (
    <div className="no-print text-center py-4">
      <button
        onClick={() => window.print()}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
      >
        Descargar mi Pasaporte Financiero (demo)
      </button>
      <p className="text-xs text-gray-400 mt-2">Usa Ctrl+P / Cmd+P para guardar como PDF</p>
    </div>
  )
}
