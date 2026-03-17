import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { incidentService } from '@/services/services'
import { AlertTriangle, Loader2, MapPin, User } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const priorityColor = {
  LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444',
}

const createIcon = (color, isMine) => L.divIcon({
  className: '',
  html: `<div style="
    width: ${isMine ? 32 : 26}px;
    height: ${isMine ? 32 : 26}px;
    background: ${color};
    border: ${isMine ? '3px solid white' : '2px solid white'};
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,${isMine ? '0.4' : '0.2'});
  "></div>`,
  iconSize: [isMine ? 32 : 26, isMine ? 32 : 26],
  iconAnchor: [isMine ? 16 : 13, isMine ? 32 : 26],
  popupAnchor: [0, -30],
})

const CENTER = [10.3910, -75.4794]

export default function CitizenMap() {
  const [all, setAll]           = useState([])
  const [mine, setMine]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all') // 'all' | 'mine'

  useEffect(() => {
    Promise.all([
      incidentService.getAll().then(r => r.data?.data ?? r.data ?? []),
      incidentService.getMine().then(r => r.data?.data ?? r.data ?? []),
    ])
      .then(([allData, mineData]) => {
        setAll(Array.isArray(allData) ? allData : [])
        setMine(Array.isArray(mineData) ? mineData : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const mineIds    = new Set(mine.map(i => i.id))
  const displayed  = (filter === 'mine' ? mine : all).filter(i => i.latitude && i.longitude)
  const noCoords   = (filter === 'mine' ? mine : all).filter(i => !i.latitude || !i.longitude)

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
    </div>
  )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="px-4 pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mapa de Incidentes</h1>
          <p className="text-sm text-gray-500">{all.length} incidentes en la ciudad</p>
        </div>
        {/* Filter tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            Ciudad
          </button>
          <button onClick={() => setFilter('mine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'mine' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            Míos
          </button>
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '420px', zIndex: 0 }}>
        <MapContainer center={CENTER} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {displayed.map(inc => (
            <Marker key={inc.id}
              position={[inc.latitude, inc.longitude]}
              icon={createIcon(priorityColor[inc.priority] ?? '#6b7280', mineIds.has(inc.id))}>
              <Popup>
                <div className="p-1 min-w-[160px]">
                  <div className="flex items-center gap-1 mb-1">
                    {mineIds.has(inc.id) && <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">Mi reporte</span>}
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{inc.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{inc.description}</p>
                  {inc.location && <p className="text-xs text-gray-400 mt-1">📍 {inc.location}</p>}
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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Leyenda</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary-500 border-2 border-white shadow" />
                Mi reporte (más grande)
              </span>
            </div>
          </div>
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
      {noCoords.length > 0 && (
        <div className="px-4 pb-4">
          <div className="card">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">{noCoords.length} incidentes sin ubicación en mapa</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {noCoords.map(inc => (
                <div key={inc.id} className="px-4 py-3 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{inc.type}</p>
                    <p className="text-xs text-gray-400 truncate">{inc.location || 'Sin dirección'}</p>
                  </div>
                  {mineIds.has(inc.id) && <span className="text-xs text-primary-500 font-medium">Mío</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}