'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, CloudLightning, Check } from 'lucide-react'
import { updateKeywords, updateRegions } from '@/app/dashboard/settings/actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const CHILE_REGIONS = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", 
  "Valparaíso", "Región Metropolitana", "O'Higgins", "Maule", "Ñuble", 
  "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
]

export default function SettingsForm({ initialPreferences }: { initialPreferences: any }) {
  const [keywords, setKeywords] = useState<string[]>(initialPreferences?.keywords || [])
  const [newKeyword, setNewKeyword] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<string[]>(initialPreferences?.regions || [])
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const addKeyword = async () => {
    if (newKeyword && !keywords.includes(newKeyword.trim())) {
      const updated = [...keywords, newKeyword.trim()]
      setKeywords(updated)
      setNewKeyword('')
      
      setIsSaving(true)
      try {
        await updateKeywords(updated)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const removeKeyword = async (kw: string) => {
    const updated = keywords.filter(k => k !== kw)
    setKeywords(updated)
    
    setIsSaving(true)
    try {
      await updateKeywords(updated)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleRegion = async (region: string) => {
    let updated: string[]
    if (selectedRegions.includes(region)) {
      updated = selectedRegions.filter(r => r !== region)
    } else {
      updated = [...selectedRegions, region]
    }
    setSelectedRegions(updated)

    setIsSaving(true)
    try {
      await updateRegions(updated)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 p-6 backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-slate-800/50 shadow-2xl relative overflow-hidden group">
      {/* Premium Auto-Save Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-950/40 border-slate-800/50">
        {isSaving ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-ping"></span>
            <span className="text-fuchsia-400">Guardando cambios...</span>
          </>
        ) : (
          <>
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-slate-400">Guardado en la nube</span>
          </>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-bold text-slate-200">Palabras Clave</Label>
          <div className="flex gap-3">
            <Input 
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Ej: Jefe de Proyecto, React..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addKeyword()
                }
              }}
              className="bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/50 rounded-xl h-12"
            />
            <button 
              type="button" 
              onClick={addKeyword}
              className="px-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white rounded-xl hover:from-fuchsia-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-fuchsia-500/25"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-xl bg-slate-950/30 border border-slate-800/50">
            {keywords.map(kw => (
              <Badge key={kw} variant="secondary" className="px-3 py-1.5 flex items-center gap-2 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 transition-colors">
                <span className="text-sm font-medium">{kw}</span>
                <button type="button" onClick={() => removeKeyword(kw)} className="text-slate-400 hover:text-fuchsia-400 ml-1">
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))}
            {keywords.length === 0 && <span className="text-slate-500 text-sm italic py-1">No hay palabras clave configuradas</span>}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-bold text-slate-200">Regiones de Búsqueda</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto p-4 rounded-xl bg-slate-950/30 border border-slate-800/50 custom-scrollbar">
            {CHILE_REGIONS.map(region => {
              const id = region.toLowerCase().replace(/\s+/g, '-')
              const isSelected = selectedRegions.includes(region)
              return (
                <div key={region} className={cn(
                  "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                  isSelected ? "bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.05)]" : "bg-slate-900/50 border-slate-800/50 hover:bg-slate-800"
                )} onClick={() => toggleRegion(region)}>
                  <input 
                    type="checkbox" 
                    id={id} 
                    checked={isSelected}
                    onChange={() => {}} // handled by parent div
                    className="h-5 w-5 text-fuchsia-500 focus:ring-fuchsia-500/50 border-slate-700 bg-slate-950 rounded cursor-pointer"
                  />
                  <label htmlFor={id} className={cn("text-sm font-medium cursor-pointer select-none", isSelected ? "text-fuchsia-300" : "text-slate-300")}>
                    {region}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
