import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { incidentService } from '@/services/services'
import { AlertTriangle, Loader2, Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const priorityColor = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' }

const createIcon = (color, isMine, isCritical = false, delay = 0) => L.divIcon({
  className: '',
  html: `
    <div class="marker-pin-wrap marker-pin-appear ${isCritical ? 'marker-pin-critical' : ''}" style="width:${isMine ? 32 : 26}px;height:${isMine ? 32 : 26}px;animation-delay:${delay}ms;">
      ${isCritical ? '<span class="marker-ping"></span>' : ''}
      <div style="position:relative;z-index:2;width:${isMine ? 32 : 26}px;height:${isMine ? 32 : 26}px;background:${color};border:${isMine ? '3px' : '2px'} solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,${isMine ? '0.4' : '0.2'})"></div>
    </div>
  `,
  iconSize: [isMine ? 32 : 26, isMine ? 32 : 26],
  iconAnchor: [isMine ? 16 : 13, isMine ? 32 : 26],
  popupAnchor: [0, -30],
})

const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function FlyTo({ coords }) {
  const map = useMap()
  useEffect(() => { if (coords) map.flyTo(coords, 16, { animate: true, duration: 1.5 }) }, [coords, map])
  return null
}

const CENTER = [10.3910, -75.4794]

export default function CitizenMap() {
  const [all, setAll] = useState([])
  const [mine, setMine] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [userCoords, setUserCoords] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [flyTo, setFlyTo] = useState(null)

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

  const handleLocate = () => {
    if (!navigator.geolocation) { alert('GPS no disponible'); return }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setUserCoords(coords)
        setFlyTo(coords)
        setGpsLoading(false)
      },
      () => { alert('No se pudo obtener ubicación'); setGpsLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const mineIds = new Set(mine.map(i => i.id))
  const displayed = (filter === 'mine' ? mine : all).filter(i => i.latitude && i.longitude)
  const noCoords = (filter === 'mine' ? mine : all).filter(i => !i.latitude || !i.longitude)

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
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter==='all'?'bg-white text-gray-900 shadow-sm':'text-gray-500'}`}>
            Ciudad
          </button>
          <button onClick={() => setFilter('mine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter==='mine'?'bg-white text-gray-900 shadow-sm':'text-gray-500'}`}>
            Míos
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: '420px', zIndex: 0 }}>
        <MapContainer center={CENTER} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyTo coords={flyTo} />}

          {userCoords && (
            <Marker position={userCoords} icon={userLocationIcon}>
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-blue-600 text-sm">📍 Estás aquí</p>
                  <p className="text-xs text-gray-500 mt-1">{userCoords[0].toFixed(5)}, {userCoords[1].toFixed(5)}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {displayed.map((inc, index) => (
            <Marker
              key={inc.id}
              position={[inc.latitude, inc.longitude]}
              icon={createIcon(priorityColor[inc.priority] ?? '#6b7280', mineIds.has(inc.id), inc.priority === 'CRITICAL', Math.min(index * 80, 600))}
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  {mineIds.has(inc.id) && <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">Mi reporte</span>}
                  <p className="font-bold text-gray-900 text-sm mt-1">{inc.type}</p>
                  <p className="text-xs text-gray-500">{inc.description}</p>
                  {inc.location && <p className="text-xs text-gray-400 mt-1">📍 {inc.location}</p>}
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{background: priorityColor[inc.priority]??'#6b7280'}}>{inc.priority}</span>
                    <span className="text-xs text-gray-400">{inc.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <button onClick={handleLocate} disabled={gpsLoading}
          className="absolute bottom-4 right-4 z-[1000] bg-white shadow-lg border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
          {gpsLoading
            ? <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
            : <Navigation className="w-4 h-4 text-primary-500" />
          }
          <span className="hidden sm:inline">{userCoords ? 'Estás aquí' : 'Mi ubicación'}</span>
        </button>
      </div>

      <div className="px-4">
        <div className="card p-4">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {Object.entries(priorityColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${level === 'CRITICAL' ? 'animate-ping' : ''}`} style={{backgroundColor: color}} />
                <span className="text-xs text-gray-600">{level}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-600">Tu ubicación</span>
            </div>
          </div>
        </div>
      </div>

      {noCoords.length > 0 && (
        <div className="px-4 pb-4">
          <div className="card">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">{noCoords.length} sin ubicación en mapa</h3>
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
