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

  const stats = [
    {
      name: 'Ofertas encontradas',
      value: total,
      delta: '+12 esta semana',
      iconName: 'Search',
      gradient: 'from-fuchsia-600 to-purple-700',
      glow: 'shadow-fuchsia-500/25',
    },
    {
      name: 'Ofertas postuladas',
      value: postulados,
      delta: '+5 esta semana',
      iconName: 'Send',
      gradient: 'from-indigo-600 to-blue-700',
      glow: 'shadow-indigo-500/25',
    },
    {
      name: 'En proceso',
      value: visitados,
      delta: 'Sin cambios',
      iconName: 'CheckCircle',
      gradient: 'from-emerald-600 to-teal-700',
      glow: 'shadow-emerald-500/25',
    },
    {
      name: 'Guardadas',
      value: nuevos,
      delta: '+3 esta semana',
      iconName: 'Bookmark',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/25',
    },
  ]

  const recentJobs = jobs?.slice(0, 4) || []

  const donutData = [
    { name: 'En proceso', value: visitados, color: '#22c55e' },
    { name: 'Postulado',  value: postulados, color: '#818cf8' },
    { name: 'Nuevo',      value: nuevos,    color: '#f59e0b' },
    { name: 'No aplica',  value: noAplica,  color: '#ef4444' },
  ]

  const activity = (jobs || []).slice(0, 5).map(j => ({
    id: j.id,
    titulo: j.titulo,
    empresa: j.empresa,
    estado: j.estado,
    fecha: j.fecha_descubrimiento,
  }))

  return (
    <DashboardClient
      stats={stats}
      recentJobs={recentJobs}
      donutData={donutData}
      donutTotal={postulados + visitados + nuevos + noAplica}
      activity={activity}
      weeklyMini={{ vistas: 86, postulaciones: 12, respuestas: 3, entrevistas: 1 }}
      monthlyMini={{ total, postulaciones: postulados, tasa: postulados > 0 && total > 0 ? Math.round((postulados / total) * 100) : 0, entrevistas: visitados }}
    />
  )
}
