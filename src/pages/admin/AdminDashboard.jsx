import { useEffect, useState } from 'react'
import { AlertTriangle, Map, Users, Activity, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { incidentService, zoneService } from '@/services/services'

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

const priorityColor = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high', CRITICAL: 'badge-critical' }
const statusLabel   = { PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', RESOLVED: 'Resuelto', REJECTED: 'Rechazado' }

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
      .finally(() => setLoading(false))
  }, [])

  const pending   = incidents.filter(i => i.status === 'PENDING').length
  const resolved  = incidents.filter(i => i.status === 'RESOLVED').length
  const critical  = incidents.filter(i => i.priority === 'CRITICAL').length
  const recent    = [...incidents].slice(0, 8)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
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

      {/* Recent Incidents */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Incidentes Recientes</h2>
          <span className="text-xs text-gray-400">{incidents.length} total</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
          ) : recent.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay incidentes registrados</div>
          ) : recent.map(inc => (
            <div key={inc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{inc.type}</p>
                <p className="text-xs text-gray-400 truncate">{inc.description}</p>
              </div>
              <span className={priorityColor[inc.priority] ?? 'badge-low'}>{inc.priority}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">{statusLabel[inc.status]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zones */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Zonas Registradas</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {zones.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay zonas registradas</div>
          ) : zones.map(zone => (
            <div key={zone.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                <p className="text-xs text-gray-400">{zone.totalIncidents ?? 0} incidentes</p>
              </div>
              <span className={priorityColor[zone.riskLevel] ?? 'badge-low'}>{zone.riskLevel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}