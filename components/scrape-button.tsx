'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  const handleScrape = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/cron/scrape?secret=jobtracker_secret_123')
      const data = await res.json()
      const total = data.results?.reduce((acc: number, r: any) => acc + r.added, 0) ?? 0
      setResult(`✓ ${total} nuevas ofertas encontradas`)
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
    </div>
  )
}
