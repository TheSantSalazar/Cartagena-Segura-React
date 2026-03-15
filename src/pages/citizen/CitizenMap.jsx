import { useEffect, useRef, useState } from 'react'
import { incidentService } from '@/services/services'
import { Loader2, MapPin, AlertTriangle } from 'lucide-react'

const priorityColor = {
  LOW:      '#22c55e',
  MEDIUM:   '#f59e0b',
  HIGH:     '#f97316',
  CRITICAL: '#ef4444',
}

export default function CitizenMap() {
  const mapRef                    = useRef(null)
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Cartagena center
  const CENTER = { lat: 10.3910, lng: -75.4794 }

  useEffect(() => {
    incidentService.getMine()
      .then(res => {
        const data = res.data?.data ?? res.data ?? []
        setIncidents(Array.isArray(data) ? data.filter(i => i.latitude && i.longitude) : [])
      })
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false))
  }, [])

  // Simple SVG map placeholder with incident markers
  const mapWidth  = 800
  const mapHeight = 500

  const latToY = (lat) => ((CENTER.lat + 0.15 - lat) / 0.3) * mapHeight
  const lngToX = (lng) => ((lng - (CENTER.lng - 0.2)) / 0.4) * mapWidth

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Mapa de Incidentes</h1>
      <p className="text-sm text-gray-500">Visualización geográfica de incidentes en Cartagena</p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : (
        <>
          {/* Map Container */}
          <div className="card overflow-hidden">
            <div className="relative bg-blue-50 w-full" style={{height: '400px'}}>
              {/* SVG Map */}
              <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                className="w-full h-full"
                style={{background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)'}}
              >
                {/* Grid lines */}
                {[...Array(8)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={mapHeight}
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 100} x2={mapWidth} y2={i * 100}
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                ))}
                {/* Center marker */}
                <circle cx={mapWidth/2} cy={mapHeight/2} r="8" fill="#3b82f6" opacity="0.3" />
                <circle cx={mapWidth/2} cy={mapHeight/2} r="4" fill="#1d4ed8" />
                <text x={mapWidth/2 + 10} y={mapHeight/2 + 4} fill="#1d4ed8" fontSize="12" fontWeight="600">
                  Cartagena
                </text>
                {/* Incident markers */}
                {incidents.map(inc => {
                  const x = lngToX(inc.longitude)
                  const y = latToY(inc.latitude)
                  const color = priorityColor[inc.priority] ?? '#6b7280'
                  return (
                    <g key={inc.id} onClick={() => setSelected(inc)} style={{cursor: 'pointer'}}>
                      <circle cx={x} cy={y} r="12" fill={color} opacity="0.2" />
                      <circle cx={x} cy={y} r="6" fill={color} stroke="white" strokeWidth="2" />
                    </g>
                  )
                })}
              </svg>

              {/* No incidents message */}
              {incidents.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
                    <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay incidentes con coordenadas</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Leyenda</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(priorityColor).map(([level, color]) => (
                <div key={level} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: color}} />
                  <span className="text-xs text-gray-600">{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected incident */}
          {selected && (
            <div className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{selected.type}</p>
                    <p className="text-xs text-gray-400">{selected.location}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>
              <p className="text-xs text-gray-500 mt-3">{selected.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">Prioridad:</span>
                <span className="text-xs font-medium" style={{color: priorityColor[selected.priority]}}>
                  {selected.priority}
                </span>
              </div>
            </div>
          )}

          {/* Incidents list */}
          {incidents.length > 0 && (
            <div className="card">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">{incidents.length} incidentes con ubicación</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {incidents.map(inc => (
                  <div key={inc.id} onClick={() => setSelected(inc)}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: priorityColor[inc.priority]}} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{inc.type}</p>
                      <p className="text-xs text-gray-400 truncate">{inc.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}