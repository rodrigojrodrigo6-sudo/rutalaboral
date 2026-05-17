'use client'

import { useState } from 'react'
import { updateSources } from '@/app/dashboard/settings/actions'
import { Check } from 'lucide-react'

export default function SourcesForm({ initialSources }: { initialSources: string[] }) {
  const [sources, setSources] = useState<string[]>(initialSources)
  const [updating, setUpdating] = useState(false)

  const toggleSource = async (sourceName: string) => {
    if (updating) return
    setUpdating(true)

    let newSources: string[]
    if (sources.includes(sourceName)) {
      newSources = sources.filter(s => s !== sourceName)
    } else {
      newSources = [...sources, sourceName]
    }

    setSources(newSources)

    try {
      await updateSources(newSources)
    } catch (err) {
      console.error('Error updating sources:', err)
      // Revert if error
      setSources(sources)
    } finally {
      setUpdating(false)
    }
  }

  const isCTActive = sources.includes('ChileTrabajos')
  const isLAActive = sources.includes('Laborum')

  return (
    <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-slate-800/50 shadow-2xl p-6 space-y-4 relative overflow-hidden group pt-14">
      {/* Premium Auto-Save Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-950/40 border-slate-800/50">
        {updating ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-amber-400">Guardando...</span>
          </>
        ) : (
          <>
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-slate-400">Guardado en la nube</span>
          </>
        )}
      </div>

      {/* ChileTrabajos Toggle */}
      <div 
        onClick={() => toggleSource('ChileTrabajos')}
        className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:bg-slate-800/30 transition-all cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-xl">
            <span className="text-fuchsia-400 font-black text-xs">CT</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">ChileTrabajos</p>
            <p className="text-xs text-slate-400">Portal líder en Chile</p>
          </div>
        </div>
        <div className={`h-6 w-11 rounded-full relative transition-all shadow-lg ${
          isCTActive 
            ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 shadow-fuchsia-500/20' 
            : 'bg-slate-800 border border-slate-700'
        }`}>
          <div className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-all ${
            isCTActive ? 'right-1' : 'left-1'
          }`}></div>
        </div>
      </div>
      
      {/* Laborum Toggle */}
      <div 
        onClick={() => toggleSource('Laborum')}
        className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:bg-slate-800/30 transition-all cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
            <span className="text-amber-400 font-black text-xs">LA</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">Laborum</p>
            <p className="text-xs text-slate-400">Búsqueda rápida en Chile</p>
          </div>
        </div>
        <div className={`h-6 w-11 rounded-full relative transition-all shadow-lg ${
          isLAActive 
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/20' 
            : 'bg-slate-800 border border-slate-700'
        }`}>
          <div className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-all ${
            isLAActive ? 'right-1' : 'left-1'
          }`}></div>
        </div>
      </div>
    </div>
  )
}
