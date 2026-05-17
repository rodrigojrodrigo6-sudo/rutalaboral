'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { WeeklyChart, MonthlyChart, DonutChart } from './dashboard-charts'
import {
  Search, Send, CheckCircle, Bookmark,
  Eye, MessageSquare, Users, ArrowUpRight,
  Briefcase, Rocket, TrendingUp, Clock,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────
interface StatItem {
  name: string
  value: number
  delta: string
  iconName: string
  gradient: string
  glow: string
}

interface Job {
  id: string
  titulo: string
  empresa: string
  estado: string
  region?: string
  fecha_descubrimiento?: string
  url?: string
}

interface DonutEntry {
  name: string
  value: number
  color: string
}

interface ActivityEntry {
  id: string
  titulo: string
  empresa: string
  estado: string
  fecha?: string
}

interface Props {
  stats: StatItem[]
  recentJobs: Job[]
  donutData: DonutEntry[]
  donutTotal: number
  activity: ActivityEntry[]
  weeklyMini: { vistas: number; postulaciones: number; respuestas: number; entrevistas: number }
  monthlyMini: { total: number; postulaciones: number; tasa: number; entrevistas: number }
  weeklyChartData: { day: string; ofertas: number }[]
  monthlyChartData: { sem: string; ofertas: number }[]
}

// ─── Estado badge colors ──────────────────────────────────────────
const estadoStyle: Record<string, string> = {
  nuevo:      'bg-blue-500/15 text-blue-400',
  postulado:  'bg-emerald-500/15 text-emerald-400',
  visitado:   'bg-fuchsia-500/15 text-fuchsia-400',
  no_aplica:  'bg-slate-700 text-slate-400',
}

const estadoIcon: Record<string, React.ElementType> = {
  nuevo:     Clock,
  postulado: Send,
  visitado:  Eye,
  no_aplica: CheckCircle,
}

// ─── Activity icon colors ─────────────────────────────────────────
const activityColors = ['#818cf8', '#22c55e', '#a855f7', '#f59e0b', '#ef4444']

// ─── Main component ───────────────────────────────────────────────
export default function DashboardClient({
  stats, recentJobs, donutData, donutTotal, activity,
  weeklyMini, monthlyMini, weeklyChartData, monthlyChartData
}: Props) {
  const [username, setUsername] = useState('Usuario')

  useEffect(() => {
    const stored = localStorage.getItem('jobtracker_username')
    if (stored) setUsername(stored)
    const onUpdate = (e: Event) => {
      setUsername((e as CustomEvent<string>).detail || 'Usuario')
    }
    window.addEventListener('username-updated', onUpdate)
    return () => window.removeEventListener('username-updated', onUpdate)
  }, [])

  return (
    <div className="space-y-6">

      {/* ── Greeting header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            ¡Hola, {username}! <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-slate-400 mt-1">Aquí tienes un resumen de tu búsqueda de empleo</p>
        </div>
        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar en ofertas..."
              className="bg-slate-900/60 border border-slate-800/60 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 w-56"
            />
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = { Search, Send, CheckCircle, Bookmark }[s.iconName] || Search
          return (
            <div
              key={s.name}
              className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className={cn('h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-lg', s.gradient, s.glow)}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 truncate">{s.name}</p>
                <p className="text-3xl font-black text-slate-100 leading-tight">{s.value}</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {s.delta}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column (Charts + Recent Jobs) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weekly line chart */}
            <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-200">Avance semanal</h2>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">Esta semana</span>
              </div>
              <WeeklyChart data={weeklyChartData} />
              {/* Weekly mini-stats */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800/50">
                {[
                  { label: 'Vistas', value: weeklyMini.vistas, icon: Eye },
                  { label: 'Postulaciones', value: weeklyMini.postulaciones, icon: Send },
                  { label: 'Respuestas', value: weeklyMini.respuestas, icon: MessageSquare },
                  { label: 'Entrevistas', value: weeklyMini.entrevistas, icon: Users },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <m.icon className="h-3.5 w-3.5 text-slate-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">{m.label}</p>
                    <p className="text-base font-black text-slate-200">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly bar chart */}
            <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-200">Avance mensual</h2>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">Este mes</span>
              </div>
              <MonthlyChart data={monthlyChartData} />
              {/* Monthly mini-stats */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800/50">
                {[
                  { label: 'Total ofertas', value: monthlyMini.total },
                  { label: 'Postulaciones', value: monthlyMini.postulaciones },
                  { label: 'Tasa resp.', value: `${monthlyMini.tasa}%` },
                  { label: 'Entrevistas', value: monthlyMini.entrevistas },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <p className="text-[10px] text-slate-500">{m.label}</p>
                    <p className="text-base font-black text-slate-200">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent job offers ── */}
          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-200">Ofertas recientes encontradas</h2>
              <Link href="/dashboard/jobs" className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1">
                Ver todas <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No hay ofertas aún. Ejecuta el scraper.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentJobs.map((job, i) => {
                  const letters = ['bg-fuchsia-500/15 text-fuchsia-400', 'bg-indigo-500/15 text-indigo-400', 'bg-cyan-500/15 text-cyan-400', 'bg-amber-500/15 text-amber-400']
                  const letter = (job.empresa || '??').substring(0, 2).toUpperCase()
                  return (
                    <div
                      key={job.id}
                      className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-4 hover:bg-slate-800/40 hover:border-slate-700/50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0', letters[i % 4])}>
                          {letter}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-200 leading-snug truncate">{job.titulo}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{job.empresa}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700/50 text-slate-400">{job.region || 'Remoto'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700/50 text-slate-400">Full Time</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', estadoStyle[job.estado] || estadoStyle.nuevo)}>
                            {job.estado}
                          </span>
                          <Bookmark className="h-4 w-4 text-slate-600 group-hover:text-fuchsia-400 transition-colors mt-1" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500">
                        <span>
                          {job.fecha_descubrimiento
                            ? `Hace ${Math.floor((Date.now() - new Date(job.fecha_descubrimiento).getTime()) / 3600000)}h`
                            : 'Hace poco'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Donut + Activity) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Donut */}
          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-200">Estado de postulaciones</h2>
            </div>
            <DonutChart data={donutData} total={donutTotal} />
          </div>

          {/* Activity feed */}
          <div className="flex-1 backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-200 mb-3">Actividad reciente</h2>
            <div className="space-y-4 mt-4">
              {activity.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">Sin actividad reciente</p>
              )}
              {activity.map((a, i) => {
                const Icon = estadoIcon[a.estado] || Briefcase
                return (
                  <div key={a.id} className="flex items-start gap-3 relative">
                    {/* timeline line */}
                    {i !== activity.length - 1 && (
                      <div className="absolute left-3.5 top-7 bottom-[-16px] w-px bg-slate-800/60" />
                    )}
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                      style={{ background: `${activityColors[i % activityColors.length]}20` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: activityColors[i % activityColors.length] }} />
                    </div>
                    <div className="min-w-0 pb-1">
                      <p className="text-xs text-slate-300 font-medium leading-snug">
                        {a.estado === 'postulado' && 'Te postulaste a '}
                        {a.estado === 'visitado' && 'Viste una oferta de '}
                        {a.estado === 'nuevo' && 'Nueva oferta de '}
                        <span className="font-bold text-slate-200">{a.titulo}</span> en <span className="font-semibold text-slate-300">{a.empresa}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Hace {i + 1} horas</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/50 text-center">
              <Link href="/dashboard/activity" className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                Ver todas las actividades
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Motivational banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-fuchsia-900/40 to-purple-900/60 border border-fuchsia-500/20 p-6 flex items-center justify-between gap-4">
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Rocket className="h-40 w-40 text-fuchsia-400" />
        </div>
        <div>
          <p className="text-lg font-black text-slate-100">¡No te rindas! 🚀</p>
          <p className="text-sm text-slate-400 mt-1">La oportunidad perfecta podría estar más cerca de lo que imaginas.</p>
        </div>
        <Link
          href="/dashboard/jobs"
          className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 whitespace-nowrap"
        >
          Buscar nuevas ofertas
        </Link>
      </div>

    </div>
  )
}
