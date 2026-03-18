import { useEffect, useState } from 'react'
import { Phone, Loader2 } from 'lucide-react'
import { emergencyService } from '@/services/services'

const typeColors = { POLICE: 'bg-blue-50 text-blue-600', FIRE_STATION: 'bg-orange-50 text-orange-600', HOSPITAL: 'bg-green-50 text-green-600', AMBULANCE: 'bg-red-50 text-red-600', COAST_GUARD: 'bg-cyan-50 text-cyan-600', OTHER: 'bg-gray-50 text-gray-600' }

export default function CitizenEmergency() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    emergencyService.getAll()
      .then(res => setContacts(res.data?.data ?? res.data ?? []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Contactos de Emergencia</h1>
      <p className="text-sm text-gray-500">Llama directamente desde la app</p>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : contacts.length === 0 ? (
        <div className="card p-12 text-center">
          <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No hay contactos registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} className="card p-4 flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[c.type] ?? 'bg-gray-50 text-gray-600'}`}>
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{c.type?.replace('_', ' ')}</p>
                {c.address && <p className="text-xs text-gray-400 truncate">{c.address}</p>}
              </div>
              <a href={`tel:${c.phone}`}
                className="px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex-shrink-0">
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}