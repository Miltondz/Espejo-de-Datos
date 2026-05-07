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
import AnalysisProgress from '@/components/espejo/AnalysisProgress'
import ComplianceBadges from '@/components/espejo/ComplianceBadges'
import MacroStrip from '@/components/espejo/MacroStrip'

export default function AnalizadorPage() {
  const [data, setData] = useState<EspejoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
      {/* Analysis progress overlay */}
      <AnalysisProgress visible={loading} />

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

      {/* Live macro indicators */}
      <MacroStrip />

      {/* Upload / Demo selector */}
      <CartolaUpload onAnalyzed={setData} onError={setError} setLoading={setLoading} />

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
          {/* AI feature badges — cache hit + thinking */}
          {data._meta && (
            <div className="flex flex-wrap gap-2">
              {data._meta.cacheHit && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                  ⚡ Caché activo — {data._meta.cacheReadTokens.toLocaleString('es-CL')} tokens reutilizados
                </span>
              )}
              {data._meta.usedThinking && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full">
                  🧠 Razonamiento extendido activo
                </span>
              )}
            </div>
          )}
          <ProfileSummaryCard summary={data.profileSummary} />
          <SignalsGrid signals={data.signals} segmento={data.profileSummary.segmento} />
          <InstitutionLensesTabs lenses={data.lenses} signals={data.signals} />
          <SimulationPanel
            key={data.signals.map(s => s.id).join('|')}
            signals={data.signals}
            segmento={data.profileSummary.segmento}
            initialSuggestion={data.simulationSuggestion}
          />
          <PasaporteButton />
          <ComplianceBadges />
        </div>
      )}

      {/* Compliance badges shown before any analysis too */}
      {!data && !loading && (
        <ComplianceBadges />
      )}
    </div>
  )
}
