import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { AlertTriangle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { incidentService, zoneService } from '@/services/services'
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

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value ?? '—'}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

const CENTER = [10.3910, -75.4794]

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([])
  const [zones, setZones]         = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([incidentService.getAll(), zoneService.getAll()])
      .then(([inc, zon]) => {
        setIncidents(inc.data?.data ?? inc.data?.content ?? inc.data ?? [])
        setZones(zon.data?.data ?? zon.data ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending  = incidents.filter(i => i.status === 'PENDING').length
  const resolved = incidents.filter(i => i.status === 'RESOLVED').length
  const critical = incidents.filter(i => i.priority === 'CRITICAL').length
  const withCoords = incidents.filter(i => i.latitude && i.longitude)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="Total Incidentes" value={incidents.length}
          color="bg-blue-50 text-blue-600" sub="reportados en el sistema" />
        <StatCard icon={Clock} label="Pendientes" value={pending}
          color="bg-yellow-50 text-yellow-600" sub="requieren atención" />
        <StatCard icon={CheckCircle} label="Resueltos" value={resolved}
          color="bg-green-50 text-green-600" sub="casos cerrados" />
        <StatCard icon={XCircle} label="Críticos" value={critical}
          color="bg-red-50 text-red-600" sub="prioridad máxima" />
      </div>

      {/* Map */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Mapa de Incidentes</h2>
          <span className="text-xs text-gray-400">{withCoords.length} con ubicación</span>
        </div>
        <div style={{ height: '400px', zIndex: 0 }}>
          <MapContainer center={CENTER} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {withCoords.map(inc => (
              <Marker key={inc.id} position={[inc.latitude, inc.longitude]}
                icon={createIcon(priorityColor[inc.priority] ?? '#6b7280')}>
                <Popup>
                  <div className="p-1 min-w-[160px]">
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
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Incidentes Recientes</h2>
          <span className="text-xs text-gray-400">{incidents.length} total</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
          ) : incidents.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay incidentes registrados</div>
          ) : incidents.slice(0, 8).map(inc => (
            <div key={inc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{inc.type}</p>
                <p className="text-xs text-gray-400 truncate">{inc.description}</p>
              </div>
              <span className={badgeColor[inc.priority] ?? 'badge-low'}>{inc.priority}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">{statusLabel[inc.status]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zones */}
      {zones.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Zonas Registradas</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {zones.map(zone => (
              <div key={zone.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
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