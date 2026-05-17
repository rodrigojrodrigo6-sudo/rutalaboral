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
  const postulados = jobs?.filter(j => j.estado === 'cv_enviado').length || 0
  const visitados  = jobs?.filter(j => j.estado === 'visitado').length  || 0
  const nuevos     = jobs?.filter(j => j.estado === 'nuevo').length     || 0
  const noAplica   = jobs?.filter(j => j.estado === 'no_aplica').length || 0
  const entrevistas= jobs?.filter(j => j.estado === 'entrevista').length|| 0
  const finalizados= jobs?.filter(j => j.estado === 'finalizado').length|| 0

  let encontradasSemana = 0
  let postuladasSemana = 0
  let entrevistasSemana = 0
  let visitadasSemana = 0

  if (jobs) {
    const now = new Date()
    jobs.forEach(job => {
      if (!job.fecha_descubrimiento) return
      const date = new Date(job.fecha_descubrimiento)
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays >= 0 && diffDays <= 7) {
        encontradasSemana++
        if (job.estado === 'cv_enviado') postuladasSemana++
        if (job.estado === 'entrevista') entrevistasSemana++
        if (job.estado === 'visitado') visitadasSemana++
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
      name: 'Entrevistas',
      value: entrevistas,
      delta: entrevistasSemana > 0 ? `+${entrevistasSemana} esta semana` : 'Sin cambios',
      iconName: 'Users',
      gradient: 'from-emerald-600 to-teal-700',
      glow: 'shadow-emerald-500/25',
    },
    {
      name: 'Visitados',
      value: visitados,
      delta: visitadasSemana > 0 ? `+${visitadasSemana} esta semana` : 'Sin cambios',
      iconName: 'Eye',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/25',
    },
  ]

  const recentJobs = jobs?.slice(0, 4) || []

  const donutData = [
    { name: 'Entrevista', value: entrevistas, color: '#a855f7' },
    { name: 'Finalizado', value: finalizados, color: '#6366f1' },
    { name: 'Visitado',   value: visitados,  color: '#22c55e' },
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
    { day: 'Lun', total: 0, cvEnviados: 0, entrevistas: 0 },
    { day: 'Mar', total: 0, cvEnviados: 0, entrevistas: 0 },
    { day: 'Mié', total: 0, cvEnviados: 0, entrevistas: 0 },
    { day: 'Jue', total: 0, cvEnviados: 0, entrevistas: 0 },
    { day: 'Vie', total: 0, cvEnviados: 0, entrevistas: 0 },
    { day: 'Sáb', total: 0, cvEnviados: 0, entrevistas: 0 },
    { day: 'Dom', total: 0, cvEnviados: 0, entrevistas: 0 },
  ]

  const monthlyChartData = [
    { sem: 'Sem 1', total: 0, cvEnviados: 0, entrevistas: 0 },
    { sem: 'Sem 2', total: 0, cvEnviados: 0, entrevistas: 0 },
    { sem: 'Sem 3', total: 0, cvEnviados: 0, entrevistas: 0 },
    { sem: 'Sem 4', total: 0, cvEnviados: 0, entrevistas: 0 },
    { sem: 'Sem 5', total: 0, cvEnviados: 0, entrevistas: 0 },
  ]

  const weeklyMini = {
    total: encontradasSemana,
    cvEnviados: postuladasSemana,
    entrevistas: entrevistasSemana,
  }

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
        weeklyChartData[dayIdx].total++
        if (job.estado === 'cv_enviado') weeklyChartData[dayIdx].cvEnviados++
        if (job.estado === 'entrevista') weeklyChartData[dayIdx].entrevistas++
      }

      // Monthly Chart Data
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        const weekIdx = Math.floor((date.getDate() - 1) / 7)
        if (weekIdx >= 0 && weekIdx <= 4) {
          monthlyChartData[weekIdx].total++
          if (job.estado === 'cv_enviado') monthlyChartData[weekIdx].cvEnviados++
          if (job.estado === 'entrevista') monthlyChartData[weekIdx].entrevistas++
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
      monthlyMini={{ total, cvEnviados: postulados, entrevistas }}
      weeklyChartData={weeklyChartData}
      monthlyChartData={monthlyChartData}
    />
  )
}
