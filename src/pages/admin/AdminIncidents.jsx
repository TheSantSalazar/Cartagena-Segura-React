import { useEffect, useState } from 'react'
import { incidentService } from '@/services/services'
import { Loader2 } from 'lucide-react'

const priorityColor = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high', CRITICAL: 'badge-critical' }

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    incidentService.getAll()
      .then(res => setIncidents(res.data?.data ?? res.data?.content ?? res.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Incidentes</h1>
      <div className="card">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
          ) : incidents.map(inc => (
            <div key={inc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{inc.type}</p>
                <p className="text-xs text-gray-400">{inc.description}</p>
              </div>
              <span className={priorityColor[inc.priority]}>{inc.priority}</span>
              <span className="text-xs text-gray-500">{inc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}