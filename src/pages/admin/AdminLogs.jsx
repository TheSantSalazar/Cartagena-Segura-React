import { useEffect, useState } from 'react'
import { logService } from '@/services/services'
import { FileText, Loader2, RefreshCw } from 'lucide-react'

const levelColors = { INFO: 'bg-blue-100 text-blue-700', WARN: 'bg-yellow-100 text-yellow-700', ERROR: 'bg-red-100 text-red-700', DEBUG: 'bg-gray-100 text-gray-600' }

export default function AdminLogs() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    logService.getAll()
      .then(res => setLogs(res.data?.data ?? res.data ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Logs del Sistema</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registro de actividad</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No hay logs registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log, i) => (
              <div key={log.id ?? i} className="p-4 sm:px-6 sm:py-4 flex items-start gap-3 hover:bg-gray-50">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 whitespace-nowrap flex-shrink-0 ${levelColors[log.level] ?? 'bg-gray-100 text-gray-600'}`}>
                  {log.level ?? 'INFO'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{log.message ?? log.action ?? 'Sin mensaje'}</p>
                  {log.userId && <p className="text-xs text-gray-400 mt-0.5">Usuario: {log.userId}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 hidden sm:block">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString('es-CO') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}