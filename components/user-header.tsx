'use client'

import { useEffect, useState } from 'react'
import { User, Clock } from 'lucide-react'

export default function UserHeader() {
  const [username, setUsername] = useState<string>('')
  const [dateTime, setDateTime] = useState<string>('')

  useEffect(() => {
    // Load username from localStorage
    const stored = localStorage.getItem('jobtracker_username')
    setUsername(stored || 'Usuario')

    // Listen for updates from profile page
    const onStorage = () => {
      const updated = localStorage.getItem('jobtracker_username')
      setUsername(updated || 'Usuario')
    }
    window.addEventListener('storage', onStorage)

    // Custom event for same-tab updates
    const onProfile = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      setUsername(detail || 'Usuario')
    }
    window.addEventListener('username-updated', onProfile)

    // Clock tick
    const fmt = () => {
      const now = new Date()
      const date = now.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const time = now.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setDateTime(`${date} · ${time}`)
    }
    fmt()
    const timer = setInterval(fmt, 1000)

    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('username-updated', onProfile)
    }
  }, [])

  return (
    <div className="flex items-center justify-end gap-4 mb-6 px-1">
      {/* Date & Time */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-2 shadow-inner">
        <Clock className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
        <span className="capitalize tracking-wide">{dateTime}</span>
      </div>

      {/* Username */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 border border-fuchsia-500/20 rounded-xl px-4 py-2 shadow-[0_0_15px_rgba(217,70,239,0.08)]">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
          <User className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-fuchsia-300">{username}</span>
      </div>
    </div>
  )
}
