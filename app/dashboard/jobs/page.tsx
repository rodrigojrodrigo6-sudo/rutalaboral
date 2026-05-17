import { createClient } from '@/lib/supabase/server'
import JobsTable from '@/components/jobs-table'
import ScrapeButton from '@/components/scrape-button'

export default async function JobsPage() {
  const supabase = await createClient()
  
  const { data: jobs } = await supabase
    .from('job_offers')
    .select('*')
    .order('fecha_descubrimiento', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Mis Ofertas</h1>
          <p className="text-slate-400 mt-1">Gestiona y haz seguimiento a tus postulaciones</p>
        </div>
        <ScrapeButton />
      </div>

      <JobsTable initialJobs={jobs || []} />
    </div>
  )
}
