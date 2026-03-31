import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { AlertTriangle, Clock, CheckCircle, XCircle, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { incidentService, zoneService, aiService } from '@/services/services'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const priorityColor = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' }
const statusLabel   = { PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', RESOLVED: 'Resuelto', REJECTED: 'Rechazado' }
const badgeColor    = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high', CRITICAL: 'badge-critical' }

const createIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:${color};border:2px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -28],
})

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const num = parseInt(value)
    if (isNaN(num) || num === 0) { setCount(0); return }

    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.round(eased * num))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return <>{count}</>
}

const StatCard = ({ icon: Icon, label, value, color, sub, delay = 0 }) => (
  <div
    className="card p-4 sm:p-6 animate-slide-up-stagger"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <span className="text-xs sm:text-sm font-medium text-gray-500">{label}</span>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </div>
    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
      {value != null ? <AnimatedCounter value={value} /> : '—'}
    </p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

const CENTER = [10.3910, -75.4794]

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([])
  const [zones, setZones]         = useState([])
  const [loading, setLoading]     = useState(true)

  // AI summary state
  const [summaryText, setSummaryText] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    Promise.all([incidentService.getAll(), zoneService.getAll()])
      .then(([inc, zon]) => {
        setIncidents(inc.data?.data ?? inc.data?.content ?? inc.data ?? [])
        setZones(zon.data?.data ?? zon.data ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Typewriter effect for AI summary
  useEffect(() => {
    if (!summaryText) { setDisplayedText(''); return }
    setDisplayedText('')
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayedText(summaryText.slice(0, i))
      if (i >= summaryText.length) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [summaryText])

  const generateSummary = async () => {
    setSummaryLoading(true)
    setSummaryError(false)
    setSummaryText('')
    try {
      const res = await aiService.summary()
      const text = res.data?.summary ?? res.data?.message ?? res.data ?? 'Sin respuesta.'
      setSummaryText(typeof text === 'string' ? text : JSON.stringify(text))
    } catch {
      setSummaryError(true)
    } finally {
      setSummaryLoading(false)
    }
  }

  const pending    = incidents.filter(i => i.status === 'PENDING').length
  const resolved   = incidents.filter(i => i.status === 'RESOLVED').length
  const critical   = incidents.filter(i => i.priority === 'CRITICAL').length
  const withCoords = incidents.filter(i => i.latitude && i.longitude)

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={AlertTriangle} label="Total" value={incidents.length} color="bg-blue-50 text-blue-600" sub="incidentes" delay={0} />
        <StatCard icon={Clock} label="Pendientes" value={pending} color="bg-yellow-50 text-yellow-600" sub="sin atender" delay={100} />
        <StatCard icon={CheckCircle} label="Resueltos" value={resolved} color="bg-green-50 text-green-600" sub="cerrados" delay={200} />
        <StatCard icon={XCircle} label="Críticos" value={critical} color="bg-red-50 text-red-600" sub="urgentes" delay={300} />
      </div>

      {/* AI Summary Card */}
      <div className="card overflow-hidden border-purple-100">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-100 bg-gradient-to-r from-violet-50/80 to-purple-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Resumen IA</h2>
              <p className="text-[10px] text-gray-400">Análisis generado por Spring AI</p>
            </div>
          </div>
          <button
            onClick={generateSummary}
            disabled={summaryLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
          >
            {summaryLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {summaryText ? 'Regenerar' : 'Generar'}
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4">
          {!summaryText && !summaryLoading && !summaryError && (
            <p className="text-sm text-gray-400 text-center py-4">
              Haz clic en "Generar" para obtener un resumen inteligente del estado del sistema
            </p>
          )}
          {summaryLoading && (
            <div className="flex items-center gap-3 py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              <span className="text-sm text-gray-500">Generando resumen...</span>
            </div>
          )}
          {summaryError && (
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-red-600 text-xs font-medium">Servicio de IA no disponible</p>
              <button onClick={generateSummary} className="mt-2 text-xs text-red-500 flex items-center gap-1 mx-auto">
                <RefreshCw className="w-3 h-3" /> Reintentar
              </button>
            </div>
          )}
          {displayedText && !summaryLoading && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {displayedText}
              {displayedText.length < summaryText.length && <span className="typewriter-cursor ml-0.5">&nbsp;</span>}
            </p>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="card overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Mapa de Incidentes</h2>
          <span className="text-xs text-gray-400">{withCoords.length} con ubicación</span>
        </div>
        <div style={{ height: '300px', zIndex: 0 }} className="sm:h-96">
          <MapContainer center={CENTER} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {withCoords.map(inc => (
              <Marker key={inc.id} position={[inc.latitude, inc.longitude]}
                icon={createIcon(priorityColor[inc.priority] ?? '#6b7280')}>
                <Popup>
                  <div className="p-1 min-w-[140px]">
                    <p className="font-bold text-gray-900 text-sm">{inc.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{inc.description}</p>
                    {inc.location && <p className="text-xs text-gray-400 mt-1">📍 {inc.location}</p>}
                    <p className="text-xs text-gray-400 mt-1">👤 {inc.reportedBy}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ background: priorityColor[inc.priority] ?? '#6b7280' }}>
                        {inc.priority}
                      </span>
                      <span className="text-xs text-gray-400">{statusLabel[inc.status]}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Incidentes Recientes</h2>
          <span className="text-xs text-gray-400">{incidents.length} total</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
          ) : incidents.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay incidentes registrados</div>
          ) : incidents.slice(0, 8).map(inc => (
            <div key={inc.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{inc.type}</p>
                <p className="text-xs text-gray-400 truncate">{inc.description}</p>
              </div>
              <span className={`${badgeColor[inc.priority] ?? 'badge-low'} hidden sm:inline-flex`}>{inc.priority}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">{statusLabel[inc.status]}</span>
            </div>
          ))}
        </div>
      </div>

      {zones.length > 0 && (
        <div className="card">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Zonas Registradas</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {zones.map(zone => (
              <div key={zone.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                  <p className="text-xs text-gray-400">{zone.totalIncidents ?? 0} incidentes</p>
                </div>
                <span className={badgeColor[zone.riskLevel] ?? 'badge-low'}>{zone.riskLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}