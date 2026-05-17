import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/settings-form'

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
          <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-slate-800/50 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-xl">
                  <span className="text-fuchsia-400 font-black text-xs">CT</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">ChileTrabajos</p>
                  <p className="text-xs text-slate-400">Portal líder en Chile</p>
                </div>
              </div>
              <div className="h-6 w-11 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-full relative shadow-lg shadow-fuchsia-500/20">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-950/30 opacity-50">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl">
                  <span className="text-indigo-400 font-black text-xs">LI</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">LinkedIn <span className="text-slate-500 font-normal">(Próximamente)</span></p>
                  <p className="text-xs text-slate-400">Conexión directa</p>
                </div>
              </div>
              <div className="h-6 w-11 bg-slate-700 rounded-full relative">
                <div className="absolute left-1 top-1 h-4 w-4 bg-slate-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
