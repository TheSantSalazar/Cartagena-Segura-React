import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { incidentService } from '@/services/services'
import { AlertTriangle, Loader2, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const priorityColor = {
  LOW:      '#22c55e',
  MEDIUM:   '#f59e0b',
  HIGH:     '#f97316',
  CRITICAL: '#ef4444',
}

const createIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    width: 28px; height: 28px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
})

const CENTER = [10.3910, -75.4794] // Cartagena

export default function CitizenMap() {
  const [incidents, setIncidents] = useState([])
  const [all, setAll]             = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    incidentService.getMine()
      .then(res => {
        const data = res.data?.data ?? res.data ?? []
        const arr  = Array.isArray(data) ? data : []
        setAll(arr)
        setIncidents(arr.filter(i => i.latitude && i.longitude))
      })
      .catch(() => { setAll([]); setIncidents([]) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
    </div>
  )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-gray-900">Mapa de Incidentes</h1>
        <p className="text-sm text-gray-500">Tus reportes en Cartagena</p>
      </div>

      {/* Map */}
      <div style={{ height: '420px', zIndex: 0 }}>
        <MapContainer
          center={CENTER}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {incidents.map(inc => (
            <Marker
              key={inc.id}
              position={[inc.latitude, inc.longitude]}
              icon={createIcon(priorityColor[inc.priority] ?? '#6b7280')}
            >
              <Popup>
                <div className="p-1 min-w-[160px]">
                  <p className="font-bold text-gray-900 text-sm">{inc.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{inc.description}</p>
                  {inc.location && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      📍 {inc.location}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                      style={{ background: priorityColor[inc.priority] ?? '#6b7280' }}>
                      {inc.priority}
                    </span>
                    <span className="text-xs text-gray-400">{inc.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="px-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Leyenda de prioridad</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(priorityColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-600">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sin coordenadas */}
      {all.filter(i => !i.latitude || !i.longitude).length > 0 && (
        <div className="px-4 pb-4">
          <div className="card">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Sin ubicación en mapa</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {all.filter(i => !i.latitude || !i.longitude).map(inc => (
                <div key={inc.id} className="px-4 py-3 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{inc.type}</p>
                    <p className="text-xs text-gray-400 truncate">{inc.location || 'Sin dirección'}</p>
                  </div>
                  <span className="text-xs text-gray-400">{inc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}