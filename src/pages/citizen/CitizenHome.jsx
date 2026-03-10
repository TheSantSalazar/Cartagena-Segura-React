import { useEffect, useState } from 'react'
import { AlertTriangle, Map, Phone, Plus } from 'lucide-react'
import { incidentService, emergencyService } from '@/services/services'
import { Link } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

export default function CitizenHome() {
  const { user } = useAuthStore()
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    incidentService.getMine()
      .then(res => setIncidents(res.data?.data ?? res.data?.content ?? res.data ?? []))
      .catch(() => {})
  }, [])

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-5 text-white">
        <p className="text-primary-200 text-sm">Bienvenido de vuelta</p>
        <h1 className="text-xl font-bold mt-0.5">{user?.username} 👋</h1>
        <p className="text-primary-200 text-xs mt-1">Ciudadano activo · Cartagena Segura</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link to="/app/incidents" className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Mis Reportes</span>
        </Link>
        <Link to="/app/map" className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Map className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Ver Mapa</span>
        </Link>
        <Link to="/app/emergency" className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Emergencias</span>
        </Link>
      </div>

      <div className="card">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Mis reportes recientes</h2>
          <Link to="/app/incidents" className="text-xs text-primary-600 font-medium">Ver todos</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {incidents.length === 0
            ? <p className="p-6 text-center text-sm text-gray-400">No has reportado incidentes aún</p>
            : incidents.slice(0, 4).map(inc => (
              <div key={inc.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{inc.type}</p>
                  <p className="text-xs text-gray-400 truncate">{inc.status}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}