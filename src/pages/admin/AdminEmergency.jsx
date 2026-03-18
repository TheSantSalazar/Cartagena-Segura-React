import { useEffect, useState } from 'react'
import { emergencyService } from '@/services/services'
import { Phone, Plus, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const typeColors = { POLICE: 'bg-blue-50 text-blue-600', FIRE_STATION: 'bg-orange-50 text-orange-600', HOSPITAL: 'bg-green-50 text-green-600', AMBULANCE: 'bg-red-50 text-red-600', COAST_GUARD: 'bg-cyan-50 text-cyan-600', OTHER: 'bg-gray-50 text-gray-600' }
const emptyForm = { name: '', phone: '', type: 'POLICE', address: '' }

export default function AdminEmergency() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    emergencyService.getAll()
      .then(res => setContacts(res.data?.data ?? res.data ?? []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await emergencyService.create(form)
      toast.success('Contacto creado'); setShowForm(false); setForm(emptyForm); load()
    } catch { toast.error('Error al crear') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este contacto?')) return
    try { await emergencyService.delete(id); toast.success('Contacto eliminado'); load() }
    catch { toast.error('Error al eliminar') }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Contactos de Emergencia</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de contactos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /><span className="hidden sm:inline">Nuevo Contacto</span><span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Nuevo Contacto</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nombre</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Policía Nacional" />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input className="input" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="123" />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {Object.keys(typeColors).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Dirección (opcional)</label>
                <input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Dirección" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : contacts.length === 0 ? (
        <div className="card p-12 text-center">
          <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No hay contactos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {contacts.map(c => (
            <div key={c.id} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[c.type] ?? 'bg-gray-50 text-gray-600'}`}>
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{c.type?.replace('_', ' ')}</p>
              </div>
              <a href={`tel:${c.phone}`} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0">
                {c.phone}
              </a>
              <button onClick={() => handleDelete(c.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}