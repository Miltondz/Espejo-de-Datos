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
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h1 className="text-2xl font-bold">Tu Espejo Financiero</h1>
        <PrivacyBadge />
      </div>

      <CartolaUpload onAnalyzed={setData} onError={setError} setLoading={setLoading} />

      {loading && (
        <div className="text-center py-8 text-gray-500">Analizando tu cartola…</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-start">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 ml-2 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {data && (
        <>
          <ProfileSummaryCard summary={data.profileSummary} />
          <SignalsGrid signals={data.signals} />
          <InstitutionLensesTabs lenses={data.lenses} signals={data.signals} />
          <SimulationPanel
            signals={data.signals}
            segmento={data.profileSummary.segmento}
            initialSuggestion={data.simulationSuggestion}
          />
          <PasaporteButton />
        </>
      )}
    </div>
  )
}
