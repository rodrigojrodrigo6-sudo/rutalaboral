'use client'

import { useState, useEffect } from 'react'
import { User, Save, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('jobtracker_username')
    if (stored) setName(stored)
  }, [])

  const handleSave = () => {
    const trimmed = name.trim() || 'Usuario'
    localStorage.setItem('jobtracker_username', trimmed)
    // Notify UserHeader in the same tab
    window.dispatchEvent(new CustomEvent('username-updated', { detail: trimmed }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">
          Mi Perfil
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Personaliza tu identidad en la plataforma</p>
      </div>

      <div className="max-w-lg">
        <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-200">{name || 'Sin nombre'}</p>
              <p className="text-sm text-slate-500 mt-0.5">Tu nombre aparece en todas las pantallas</p>
            </div>
          </div>

          <div className="h-px bg-slate-800/60" />

          {/* Name input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-slate-300">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setSaved(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Ej: Juan Pérez"
              maxLength={40}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all text-base"
            />
            <p className="text-xs text-slate-600">{name.length}/40 caracteres</p>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
              saved
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                : 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-fuchsia-500/20 hover:shadow-fuchsia-500/30 hover:-translate-y-0.5'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
