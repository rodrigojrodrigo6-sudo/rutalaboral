import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search, Send, CheckCircle, Bookmark,
  Eye, MessageSquare, Users, TrendingUp,
  ArrowUpRight, Briefcase, ExternalLink, Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import DashboardClient from '@/components/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('job_offers')
    .select('*')
    .order('fecha_descubrimiento', { ascending: false })

  const total      = jobs?.length || 0
  const postulados = jobs?.filter(j => j.estado === 'postulado').length || 0
  const visitados  = jobs?.filter(j => j.estado === 'visitado').length  || 0
  const nuevos     = jobs?.filter(j => j.estado === 'nuevo').length     || 0
  const noAplica   = jobs?.filter(j => j.estado === 'no_aplica').length || 0
  const entrevistas= jobs?.filter(j => j.estado === 'entrevista').length|| 0
  const finalizados= jobs?.filter(j => j.estado === 'finalizado').length|| 0

  let encontradasSemana = 0
  let postuladasSemana = 0
  let procesoSemana = 0
  let guardadasSemana = 0

  if (jobs) {
    const now = new Date()
    jobs.forEach(job => {
      if (!job.fecha_descubrimiento) return
      const date = new Date(job.fecha_descubrimiento)
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays >= 0 && diffDays <= 7) {
        encontradasSemana++
        if (job.estado === 'postulado') postuladasSemana++
        if (job.estado === 'visitado') procesoSemana++
        if (job.estado === 'nuevo') guardadasSemana++
      }
    })
  }

  const stats = [
    {
      name: 'Ofertas encontradas',
      value: total,
      delta: encontradasSemana > 0 ? `+${encontradasSemana} esta semana` : 'Sin cambios',
      iconName: 'Search',
      gradient: 'from-fuchsia-600 to-purple-700',
      glow: 'shadow-fuchsia-500/25',
    },
    {
      name: 'CVs Enviados',
      value: postulados,
      delta: postuladasSemana > 0 ? `+${postuladasSemana} esta semana` : 'Sin cambios',
      iconName: 'Send',
      gradient: 'from-indigo-600 to-blue-700',
      glow: 'shadow-indigo-500/25',
    },
    {
      name: 'En proceso',
      value: visitados,
      delta: procesoSemana > 0 ? `+${procesoSemana} esta semana` : 'Sin cambios',
      iconName: 'CheckCircle',
      gradient: 'from-emerald-600 to-teal-700',
      glow: 'shadow-emerald-500/25',
    },
    {
      name: 'Guardadas',
      value: nuevos,
      delta: guardadasSemana > 0 ? `+${guardadasSemana} esta semana` : 'Sin cambios',
      iconName: 'Bookmark',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/25',
    },
  ]

  const recentJobs = jobs?.slice(0, 4) || []

  const donutData = [
    { name: 'Entrevista', value: entrevistas, color: '#a855f7' },
    { name: 'Finalizado', value: finalizados, color: '#6366f1' },
    { name: 'En proceso', value: visitados, color: '#22c55e' },
    { name: 'CV Enviado', value: postulados, color: '#818cf8' },
    { name: 'Nuevo',      value: nuevos,    color: '#f59e0b' },
    { name: 'No aplica',  value: noAplica,  color: '#ef4444' },
  ].filter(d => d.value > 0 || d.name === 'Nuevo' || d.name === 'CV Enviado')

  const activity = (jobs || []).slice(0, 5).map(j => ({
    id: j.id,
    titulo: j.titulo,
    empresa: j.empresa,
    estado: j.estado,
    fecha: j.fecha_descubrimiento,
  }))

  const weeklyChartData = [
    { day: 'Lun', ofertas: 0 },
    { day: 'Mar', ofertas: 0 },
    { day: 'Mié', ofertas: 0 },
    { day: 'Jue', ofertas: 0 },
    { day: 'Vie', ofertas: 0 },
    { day: 'Sáb', ofertas: 0 },
    { day: 'Dom', ofertas: 0 },
  ]

  const monthlyChartData = [
    { sem: 'Sem 1', ofertas: 0 },
    { sem: 'Sem 2', ofertas: 0 },
    { sem: 'Sem 3', ofertas: 0 },
    { sem: 'Sem 4', ofertas: 0 },
    { sem: 'Sem 5', ofertas: 0 },
  ]

  const weeklyMini = { vistas: 0, postulaciones: 0, entrevistas: 0, finalizados: 0 }

  if (jobs) {
    const now = new Date()
    jobs.forEach(job => {
      if (!job.fecha_descubrimiento) return
      const date = new Date(job.fecha_descubrimiento)
      
      // Weekly Chart Data
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays <= 7) {
        let dayIdx = date.getDay() - 1
        if (dayIdx === -1) dayIdx = 6
        weeklyChartData[dayIdx].ofertas++

        if (job.estado === 'visitado') weeklyMini.vistas++
        if (job.estado === 'postulado') weeklyMini.postulaciones++
        if (job.estado === 'entrevista') weeklyMini.entrevistas++
        if (job.estado === 'finalizado') weeklyMini.finalizados++
      }

      // Monthly Chart Data
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        const weekIdx = Math.floor((date.getDate() - 1) / 7)
        if (weekIdx >= 0 && weekIdx <= 4) {
          monthlyChartData[weekIdx].ofertas++
        }
      }
    })
  }

  return (
    <DashboardClient
      stats={stats}
      recentJobs={recentJobs}
      donutData={donutData}
      donutTotal={postulados + visitados + nuevos + noAplica + entrevistas + finalizados}
      activity={activity}
      weeklyMini={weeklyMini}
      monthlyMini={{ total, postulaciones: postulados, entrevistas, finalizados }}
      weeklyChartData={weeklyChartData}
      monthlyChartData={monthlyChartData}
    />
  )
}
