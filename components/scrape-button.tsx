'use client'

import { useState } from 'react'
import { Search, Loader2, X, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalDetails, setModalDetails] = useState<any>(null)
  const router = useRouter()

  const handleScrape = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/jobs/scrape', {
        method: 'POST',
      })
      const data = await res.json()
      const total = data.added ?? 0
      setResult(`✓ ${total} nuevas ofertas encontradas`)
      if (data.details) {
        setModalDetails(data.details)
        setShowModal(true)
      }
      router.refresh()
    } catch {
      setResult('✗ Error al ejecutar la búsqueda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className={`text-sm font-medium ${result.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
          {result}
        </span>
      )}
      <button
        onClick={handleScrape}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-fuchsia-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        {loading ? 'Buscando...' : 'Buscar Trabajos'}
      </button>

      {/* Premium Glassmorphic Results Modal */}
      {showModal && modalDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 backdrop-blur-2xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl space-y-6 transform scale-100 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <h3 className="text-lg font-extrabold text-white">Resultado de la Búsqueda</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Source list */}
            <div className="space-y-3.5">
              {Object.entries(modalDetails).map(([source, details]: [string, any]) => {
                const isSuccess = details.success
                const isDeactivated = details.error === "Desactivada"
                
                return (
                  <div key={source} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/40">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl text-xs font-black select-none ${
                        source === 'Laborum' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20'
                      }`}>
                        {source === 'Laborum' ? 'LA' : 'CT'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{source}</p>
                        {isDeactivated ? (
                          <p className="text-xs text-slate-500 italic">Desactivada en ajustes</p>
                        ) : isSuccess ? (
                          <p className="text-xs text-emerald-400 font-medium">✓ Correcto</p>
                        ) : (
                          <p className="text-xs text-red-400 font-medium">✗ Error: {details.error}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      {!isDeactivated && isSuccess && (
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50">
                          +{details.added} ofertas
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-fuchsia-500/25 transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
