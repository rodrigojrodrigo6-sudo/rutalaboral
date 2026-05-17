import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/settings-form'
import SourcesForm from '@/components/sources-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: preferences } = await supabase
    .from('search_preferences')
    .select('*')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Configuración</h1>
        <p className="text-slate-400 mt-1">Ajusta tus preferencias de búsqueda</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-1">Búsqueda Automática</h2>
          <p className="text-sm text-slate-400 mb-4">Configura qué palabras clave y regiones quieres monitorear.</p>
          <SettingsForm initialPreferences={preferences} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-1">Fuentes Disponibles</h2>
          <p className="text-sm text-slate-400 mb-4">Activa o desactiva portales de empleo.</p>
          <SourcesForm initialSources={preferences?.sources || ['ChileTrabajos']} />
        </div>
      </div>
    </div>
  )
}
