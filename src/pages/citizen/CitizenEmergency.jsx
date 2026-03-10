import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { emergencyService } from '@/services/services'

const typeColors = {
  POLICE: 'bg-blue-50 text-blue-600',
  FIRE_STATION: 'bg-orange-50 text-orange-600',
  HOSPITAL: 'bg-green-50 text-green-600',
  AMBULANCE: 'bg-red-50 text-red-600',
  CIVIL_DEFENSE: 'bg-purple-50 text-purple-600',
  COAST_GUARD: 'bg-cyan-50 text-cyan-600',
  MUNICIPALITY: 'bg-gray-50 text-gray-600',
  OTHER: 'bg-gray-50 text-gray-600',
}

export default function CitizenEmergency() {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    emergencyService.getAll().then(res => setContacts(res.data?.data ?? res.data ?? [])).catch(() => {})
  }, [])

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Contactos de Emergencia</h1>
      <div className="space-y-3">
        {contacts.length === 0
          ? <p className="text-center text-sm text-gray-400 py-8">No hay contactos registrados</p>
          : contacts.map(c => (
            <div key={c.id} className="card p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${typeColors[c.type] ?? 'bg-gray-50 text-gray-600'}`}>
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                <p className="text-xs text-gray-400">{c.type?.replace('_', ' ')}</p>
              </div>
              <a href={`tel:${c.phone}`}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
                {c.phone}
              </a>
            </div>
          ))
        }
      </div>
    </div>
  )
}