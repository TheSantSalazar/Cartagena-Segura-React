import { useEffect, useState, useRef, useCallback } from 'react'
import { incidentService, aiService } from '@/services/services'
import { AlertTriangle, Plus, X, Loader2, MapPin, Navigation, Sparkles, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const priorityColor = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high', CRITICAL: 'badge-critical' }
const statusLabel   = { PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', RESOLVED: 'Resuelto', REJECTED: 'Rechazado' }
const statusColor   = { PENDING: 'text-yellow-600', IN_PROGRESS: 'text-blue-600', RESOLVED: 'text-green-600', REJECTED: 'text-red-600' }

const emptyForm = { type: 'ROBO', description: '', location: '', latitude: '', longitude: '', priority: 'MEDIUM' }

export default function CitizenIncidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)

  // AI classification state
  const [classifying, setClassifying] = useState(false)
  const [suggestion, setSuggestion]   = useState(null)
  const [suggestionApplied, setSuggestionApplied] = useState(false)
  const debounceRef = useRef(null)

  const load = () => {
    setLoading(true)
    incidentService.getMine()
      .then(res => setIncidents(res.data?.data ?? res.data ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // AI auto-classify with debounce
  const classifyDescription = useCallback(async (desc) => {
    if (desc.length < 30) {
      setSuggestion(null)
      return
    }
    setClassifying(true)
    setSuggestionApplied(false)
    try {
      const res = await aiService.classify({ description: desc })
      const data = res.data
      if (data?.type || data?.priority) {
        setSuggestion({
          type: data.type ?? null,
          priority: data.priority ?? null,
          confidence: data.confidence ?? null,
        })
      }
    } catch {
      setSuggestion(null)
    } finally {
      setClassifying(false)
    }
  }, [])

  const handleDescriptionChange = (e) => {
    const val = e.target.value
    setForm(f => ({ ...f, description: val }))
    setSuggestionApplied(false)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => classifyDescription(val), 1200)
  }

  const applySuggestion = () => {
    if (!suggestion) return
    setForm(f => ({
      ...f,
      type: suggestion.type ?? f.type,
      priority: suggestion.priority ?? f.priority,
    }))
    setSuggestionApplied(true)
    toast.success('Sugerencia de IA aplicada')
  }

  const detectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Tu dispositivo no soporta GPS')
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        setForm(f => ({ ...f, latitude: lat, longitude: lng }))
        toast.success('Ubicación GPS detectada')
        setGpsLoading(false)
      },
      () => {
        toast.error('No se pudo obtener la ubicación GPS')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await incidentService.create({
        ...form,
        latitude:  form.latitude  ? parseFloat(form.latitude)  : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      })
      toast.success('Incidente reportado correctamente')
      setShowForm(false)
      setForm(emptyForm)
      setSuggestion(null)
      load()
    } catch {
      toast.error('Error al reportar el incidente')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Mis Reportes</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Reportar
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Nuevo Reporte</h2>
              <button onClick={() => { setShowForm(false); setSuggestion(null) }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="label">Tipo de Incidente</label>
                <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {['ROBO','ACCIDENTE','PELEA','INCENDIO','VANDALISMO','SOSPECHOSO','OTRO'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Descripción</label>
                <textarea className="input" rows={3} required value={form.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe lo que ocurrió... (la IA analizará tu descripción)" />

                {/* AI Classification Badge */}
                {classifying && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl border border-primary-100 animate-chat-slide-in">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />
                    <span className="text-xs text-primary-600 font-medium">IA analizando descripción...</span>
                  </div>
                )}

                {suggestion && !classifying && (
                  <div className="mt-2 px-3 py-2.5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-purple-200 animate-chat-slide-in">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-xs font-bold text-purple-700">IA sugiere:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {suggestion.type && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {suggestion.type}
                        </span>
                      )}
                      {suggestion.priority && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityColor[suggestion.priority] || 'bg-gray-100 text-gray-600'}`}>
                          {suggestion.priority}
                        </span>
                      )}
                      {suggestion.confidence && (
                        <span className="text-[10px] text-purple-500 font-medium">
                          ({Math.round(suggestion.confidence * 100)}% confianza)
                        </span>
                      )}
                    </div>
                    {!suggestionApplied ? (
                      <button type="button" onClick={applySuggestion}
                        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                        <Check className="w-3 h-3" /> Aplicar sugerencia
                      </button>
                    ) : (
                      <p className="mt-2 text-[10px] text-green-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Sugerencia aplicada
                      </p>
                    )}
                  </div>
                )}
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

              {/* Ubicación */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-3 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" /> Ubicación del incidente
                </p>

                <button type="button" onClick={detectGPS} disabled={gpsLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
                  {gpsLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Detectando GPS...</>
                    : <><Navigation className="w-4 h-4" /> Usar mi ubicación actual</>
                  }
                </button>

                {form.latitude && form.longitude && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700 font-medium">
                      GPS: {form.latitude}, {form.longitude}
                    </span>
                    <button type="button" onClick={() => setForm(f => ({...f, latitude: '', longitude: ''}))}
                      className="ml-auto text-green-400 hover:text-green-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span>o escribe la dirección</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <input className="input" value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  placeholder="Ej: Carrera 3 con Calle 10, Getsemaní" />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label text-xs">Latitud manual</label>
                    <input className="input text-xs" type="number" step="any"
                      value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})}
                      placeholder="10.4236" />
                  </div>
                  <div>
                    <label className="label text-xs">Longitud manual</label>
                    <input className="input text-xs" type="number" step="any"
                      value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})}
                      placeholder="-75.5378" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setSuggestion(null) }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enviar Reporte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : incidents.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No has reportado incidentes aún</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary text-sm">Hacer primer reporte</button>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map(inc => (
            <div key={inc.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{inc.type}</span>
                    <span className={`text-xs font-medium ${statusColor[inc.status]}`}>{statusLabel[inc.status]}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{inc.description}</p>
                  {inc.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /><span>{inc.location}</span>
                    </div>
                  )}
                </div>
                <span className={`${priorityColor[inc.priority] ?? 'badge-low'} text-xs`}>{inc.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}