'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Trash2, CheckSquare, Square, Search, FilterX, Briefcase } from 'lucide-react'
import { format, isAfter, subDays, startOfDay } from 'date-fns'
import { deleteSelectedJobs, deleteAllJobs, deleteJob, updateJobStatus } from '@/app/dashboard/jobs/actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

export default function JobsTable({ initialJobs }: { initialJobs: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [sourceFilter, setSourceFilter] = useState('todos')
  const [dateFilter, setDateFilter] = useState('todos')

  // Apply filters
  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      // Text Search
      if (searchQuery && !job.titulo.toLowerCase().includes(searchQuery.toLowerCase()) && !job.empresa.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Status Filter
      if (statusFilter !== 'todos' && job.estado !== statusFilter) {
        return false
      }

      // Source Filter
      if (sourceFilter !== 'todos' && job.fuente !== sourceFilter) {
        return false
      }

      // Date Filter
      if (dateFilter !== 'todos') {
        const jobDate = new Date(job.fecha_descubrimiento)
        const today = startOfDay(new Date())
        
        if (dateFilter === 'hoy' && !isAfter(jobDate, today)) return false
        if (dateFilter === 'semana' && !isAfter(jobDate, subDays(today, 7))) return false
        if (dateFilter === 'mes' && !isAfter(jobDate, subDays(today, 30))) return false
      }

      return true
    })
  }, [initialJobs, searchQuery, statusFilter, sourceFilter, dateFilter])

  // Get unique sources for the filter dropdown
  const uniqueSources = useMemo(() => {
    return Array.from(new Set(initialJobs.map(job => job.fuente))).filter(Boolean)
  }, [initialJobs])

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredJobs.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredJobs.map(j => j.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleDeleteSelected = async () => {
    setIsDeleting(true)
    try {
      await deleteSelectedJobs(selectedIds)
      setSelectedIds([])
      toast.success('Ofertas eliminadas correctamente')
    } catch (error) {
      toast.error('Error al eliminar las ofertas')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteAllFiltered = async () => {
    setIsDeleting(true)
    try {
      if (filteredJobs.length === initialJobs.length) {
        // If no filters are active, delete all
        await deleteAllJobs()
      } else {
        // If filters are active, delete only the filtered ones using deleteSelectedJobs
        await deleteSelectedJobs(filteredJobs.map(j => j.id))
      }
      setSelectedIds([])
      toast.success(`${filteredJobs.length} ofertas han sido eliminadas`)
    } catch (error) {
      toast.error('Error al eliminar las ofertas')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteOne = async (id: string) => {
    try {
      await deleteJob(id)
      setSelectedIds(selectedIds.filter(i => i !== id))
      toast.success('Oferta eliminada')
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateJobStatus(id, newStatus)
      toast.success('Estado actualizado')
    } catch (error) {
      toast.error('Error al actualizar el estado')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('todos')
    setSourceFilter('todos')
    setDateFilter('todos')
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="backdrop-blur-xl bg-slate-900/40 p-5 rounded-2xl shadow-xl border border-slate-800/50 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Buscar por cargo o empresa..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/50 rounded-xl h-12"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 md:w-auto"
            >
              <option value="todos">Todos los Estados</option>
              <option value="nuevo">Nuevo</option>
              <option value="visitado">Visitado</option>
              <option value="postulado">Postulado</option>
              <option value="no_aplica">No Aplica</option>
            </select>

            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 md:w-auto"
            >
              <option value="todos">Cualquier Fecha</option>
              <option value="hoy">Últimas 24 horas</option>
              <option value="semana">Últimos 7 días</option>
              <option value="mes">Últimos 30 días</option>
            </select>

            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 md:w-auto"
            >
              <option value="todos">Todas las Fuentes</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>

            <button 
              onClick={clearFilters}
              className="flex items-center justify-center h-12 px-4 text-sm font-medium text-slate-400 hover:text-fuchsia-400 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-fuchsia-500/20"
              title="Limpiar filtros"
            >
              <FilterX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl bg-slate-900/40 p-5 rounded-2xl shadow-xl border border-slate-800/50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
            Mostrando <span className="text-fuchsia-400 font-bold">{filteredJobs.length}</span> de {initialJobs.length}
          </span>
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <button 
            onClick={toggleSelectAll}
            disabled={filteredJobs.length === 0}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-fuchsia-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {selectedIds.length === filteredJobs.length && filteredJobs.length > 0 ? (
              <CheckSquare className="h-5 w-5 text-fuchsia-500" />
            ) : (
              <Square className="h-5 w-5 text-slate-500 group-hover:text-fuchsia-400" />
            )}
            Seleccionar Visibles
          </button>
          
          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center gap-2 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar ({selectedIds.length})
            </button>
          )}
        </div>

        <button 
          onClick={handleDeleteAllFiltered}
          disabled={isDeleting || filteredJobs.length === 0}
          className="text-sm font-medium text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl hover:bg-slate-800/50"
        >
          {filteredJobs.length === initialJobs.length ? 'Vaciar Todo' : `Eliminar ${filteredJobs.length} filtrados`}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/50 backdrop-blur-xl bg-slate-900/40 shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-slate-400 bg-slate-950/80 border-b border-slate-800/50">
            <tr>
              <th className="px-6 py-5 w-10"></th>
              <th className="px-6 py-5 font-bold tracking-wider">Cargo / Empresa</th>
              <th className="px-6 py-5 font-bold tracking-wider">Región / Fuente</th>
              <th className="px-6 py-5 font-bold tracking-wider">Estado</th>
              <th className="px-6 py-5 font-bold tracking-wider">Fecha</th>
              <th className="px-6 py-5 font-bold tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="h-8 w-8 text-slate-600 opacity-50" />
                    <span>
                      {initialJobs.length === 0 
                        ? "No se encontraron ofertas. Pronto el scraper encontrará nuevas opciones."
                        : "Ninguna oferta coincide con los filtros aplicados."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelectOne(job.id)}>
                      {selectedIds.includes(job.id) ? (
                        <CheckSquare className="h-5 w-5 text-fuchsia-500" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-600 group-hover:text-fuchsia-500/50 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200 line-clamp-1 text-base">{job.titulo}</div>
                    <div className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                      <Briefcase className="h-3 w-3" />
                      {job.empresa}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">{job.region || 'N/A'}</div>
                    <Badge variant="outline" className="text-[10px] uppercase mt-1 border-slate-700 text-slate-400 bg-slate-950/50">
                      {job.fuente}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={job.estado}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all shadow-sm ${
                        job.estado === 'nuevo' ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' :
                        job.estado === 'postulado' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' :
                        job.estado === 'visitado' ? 'bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20' :
                        'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <option className="bg-slate-900 text-slate-200" value="nuevo">Nuevo</option>
                      <option className="bg-slate-900 text-slate-200" value="visitado">Visitado</option>
                      <option className="bg-slate-900 text-slate-200" value="postulado">Postulado</option>
                      <option className="bg-slate-900 text-slate-200" value="no_aplica">No Aplica</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                    {format(new Date(job.fecha_descubrimiento), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        title="Abrir oferta"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button 
                        onClick={() => handleDeleteOne(job.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
