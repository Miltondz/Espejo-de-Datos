'use client'

export default function PasaporteButton() {
  return (
    <div className="no-print">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-3">
        <div className="text-3xl" aria-hidden="true">📄</div>
        <div>
          <h3 className="font-bold text-gray-900">Guardar mi Pasaporte Financiero</h3>
          <p className="text-sm text-gray-500 mt-1">
            Descarga un PDF con tu análisis completo. Solo se guarda en tu dispositivo.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:from-blue-800 hover:to-blue-700 transition-all shadow-md shadow-blue-200"
        >
          Descargar Pasaporte (PDF)
        </button>
        <p className="text-xs text-gray-400">
          Usa Ctrl+P / Cmd+P en tu navegador · Solo imprime lo esencial
        </p>
      </div>
    </div>
  )
}
