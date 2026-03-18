import { useEffect, useState } from 'react'
import { zoneService } from '@/services/services'
import { MapPin, Plus, X, Loader2, Shield, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const riskColors = { LOW: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HIGH: 'bg-orange-100 text-orange-700', CRITICAL: 'bg-red-100 text-red-700' }
const emptyForm = { name: '', description: '', riskLevel: 'LOW', latitude: '', longitude: '' }

export default function AdminZones() {
  const [zones, setZones]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    zoneService.getAll()
      .then(res => setZones(res.data?.data ?? res.data ?? []))
      .catch(() => setZones([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await zoneService.create(form)
      toast.success('Zona creada'); setShowForm(false); setForm(emptyForm); load()
    } catch { toast.error('Error al crear') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta zona?')) return
    try { await zoneService.delete(id); toast.success('Zona eliminada'); load() }
    catch { toast.error('Error al eliminar') }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Zonas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Zonas de seguridad de Cartagena</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /><span className="hidden sm:inline">Nueva Zona</span><span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Nueva Zona</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nombre</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Getsemaní" />
              </div>
              <div>
                <label className="label">Descripción</label>
                <textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Descripción de la zona" />
              </div>
              <div>
                <label className="label">Nivel de Riesgo</label>
                <select className="input" value={form.riskLevel} onChange={e => setForm({...form, riskLevel: e.target.value})}>
                  <option value="LOW">Bajo</option><option value="MEDIUM">Medio</option>
                  <option value="HIGH">Alto</option><option value="CRITICAL">Crítico</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Latitud</label>
                  <input className="input" type="number" step="any" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} placeholder="10.4236" />
                </div>
                <div>
                  <label className="label">Longitud</label>
                  <input className="input" type="number" step="any" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} placeholder="-75.5378" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Crear Zona'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : zones.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No hay zonas registradas</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary text-sm">Crear primera zona</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {zones.map(zone => (
            <div key={zone.id} className="card p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{zone.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColors[zone.riskLevel] ?? 'bg-gray-100 text-gray-600'}`}>{zone.riskLevel}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(zone.id)} className="text-gray-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              {zone.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{zone.description}</p>}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <AlertTriangle className="w-3 h-3" /><span>{zone.totalIncidents ?? 0} incidentes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}