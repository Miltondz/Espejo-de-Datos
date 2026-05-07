'use client'

import { useState } from 'react'
import type { EspejoResponse } from '@/types/espejo'
import CartolaUpload from '@/components/espejo/CartolaUpload'
import ProfileSummaryCard from '@/components/espejo/ProfileSummaryCard'
import SignalsGrid from '@/components/espejo/SignalsGrid'
import InstitutionLensesTabs from '@/components/espejo/InstitutionLensesTabs'
import SimulationPanel from '@/components/espejo/SimulationPanel'
import PasaporteButton from '@/components/espejo/PasaporteButton'
import PrivacyBadge from '@/components/espejo/PrivacyBadge'

export default function AnalizadorPage() {
  const [data, setData] = useState<EspejoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
      {/* Page header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tu Espejo Financiero</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Así te leen los bancos, fintechs y el Estado — en lenguaje ciudadano
          </p>
        </div>
        <PrivacyBadge />
      </div>

      {/* Upload / Demo selector */}
      <CartolaUpload onAnalyzed={setData} onError={setError} setLoading={setLoading} />

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Analizando tu cartola…</p>
          <p className="text-xs text-gray-400">
            Procesando transacciones, consultando indicadores macro y construyendo tu espejo.
            Esto tarda entre 10 y 30 segundos.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex justify-between items-start gap-3">
          <div className="flex gap-3 items-start">
            <span className="text-red-500 text-lg mt-0.5" aria-hidden="true">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 text-sm underline shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-6">
          <ProfileSummaryCard summary={data.profileSummary} />
          <SignalsGrid signals={data.signals} segmento={data.profileSummary.segmento} />
          <InstitutionLensesTabs lenses={data.lenses} signals={data.signals} />
          <SimulationPanel
            signals={data.signals}
            segmento={data.profileSummary.segmento}
            initialSuggestion={data.simulationSuggestion}
          />
          <PasaporteButton />
        </div>
      )}
    </div>
  )
}
