import { useEffect, useState } from 'react'
import { incidentService } from '@/services/services'
import { Loader2, AlertTriangle, MapPin, ChevronDown, X } from 'lucide-react'
import toast from 'react-hot-toast'

const priorityColor = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high', CRITICAL: 'badge-critical' }
const statusLabel   = { PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', RESOLVED: 'Resuelto', REJECTED: 'Rechazado' }
const statusColor   = { PENDING: 'text-yellow-600 bg-yellow-50', IN_PROGRESS: 'text-blue-600 bg-blue-50', RESOLVED: 'text-green-600 bg-green-50', REJECTED: 'text-red-500 bg-red-50' }

const emptyUpdate = { status: '', priority: '', assignedTo: '', changeReason: '' }

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [form, setForm]           = useState(emptyUpdate)
  const [saving, setSaving]       = useState(false)
  const [filter, setFilter]       = useState('ALL')

  const load = () => {
    setLoading(true)
    incidentService.getAll()
      .then(res => setIncidents(res.data?.data ?? res.data?.content ?? res.data ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openModal = (inc) => {
    setSelected(inc)
    setForm({ status: inc.status, priority: inc.priority, assignedTo: inc.assignedTo ?? '', changeReason: '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!form.changeReason.trim()) { toast.error('Ingresa una razón del cambio'); return }
    setSaving(true)
    try {
      await incidentService.updateStatus(selected.id, form)
      toast.success('Incidente actualizado')
      setSelected(null)
      load()
    } catch { toast.error('Error al actualizar') }
    finally { setSaving(false) }
  }

  const filtered = filter === 'ALL' ? incidents : incidents.filter(i => i.status === filter)

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Incidentes</h1>
        <p className="text-sm text-gray-500 mt-0.5">{incidents.length} incidentes en el sistema</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s === 'ALL' ? 'Todos' : statusLabel[s]}
            {s !== 'ALL' && <span className="ml-1.5 opacity-70">({incidents.filter(i => i.status === s).length})</span>}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No hay incidentes</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(inc => (
              <div key={inc.id} className="p-4 sm:px-6 sm:py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{inc.type}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[inc.status]}`}>
                      {statusLabel[inc.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-1">{inc.description}</p>
                  {inc.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /><span className="truncate">{inc.location}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">👤 {inc.reportedBy}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`${priorityColor[inc.priority] ?? 'badge-low'}`}>{inc.priority}</span>
                  <button onClick={() => openModal(inc)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-medium rounded-lg transition-colors">
                    <ChevronDown className="w-3 h-3" /> Gestionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal cambio de estado */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Gestionar Incidente</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.type} · {selected.reportedBy}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info del incidente */}
            <div className="bg-gray-50 rounded-xl p-3 mb-5">
              <p className="text-sm text-gray-700 line-clamp-3">{selected.description}</p>
              {selected.location && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />{selected.location}
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="label">Estado</label>
                <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="PENDING">Pendiente</option>
                  <option value="IN_PROGRESS">En progreso</option>
                  <option value="RESOLVED">Resuelto</option>
                  <option value="REJECTED">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="label">Prioridad</label>
                <select className="input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </div>

              <div>
                <label className="label">Asignar a (opcional)</label>
                <input className="input" value={form.assignedTo}
                  onChange={e => setForm({...form, assignedTo: e.target.value})}
                  placeholder="username del agente" />
              </div>

              <div>
                <label className="label">Razón del cambio <span className="text-red-500">*</span></label>
                <textarea className="input" rows={3} required value={form.changeReason}
                  onChange={e => setForm({...form, changeReason: e.target.value})}
                  placeholder="Ej: Se envió patrulla al sector, incidente verificado..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelected(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}