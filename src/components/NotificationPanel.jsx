import { useEffect, useState, useRef } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, Loader2 } from 'lucide-react'
import { notificationService } from '@/services/services'
import toast from 'react-hot-toast'

const typeIcon = {
  INCIDENT_CREATED:        '🆕',
  INCIDENT_STATUS_CHANGED: '🔄',
  INCIDENT_RESOLVED:       '✅',
  INCIDENT_REJECTED:       '❌',
  SYSTEM:                  '⚙️',
}

export default function NotificationPanel() {
  const [open, setOpen]         = useState(false)
  const [notifs, setNotifs]     = useState([])
  const [unread, setUnread]     = useState(0)
  const [loading, setLoading]   = useState(false)
  const panelRef                = useRef(null)

  // Contar no leídas al montar
  useEffect(() => {
    notificationService.countUnread()
      .then(res => setUnread(res.data?.data ?? 0))
      .catch(() => {})
  }, [])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const loadNotifs = () => {
    setLoading(true)
    notificationService.getAll()
      .then(res => setNotifs(res.data?.data ?? res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const handleOpen = () => {
    setOpen(o => !o)
    if (!open) loadNotifs()
  }

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifs(n => n.map(x => x.id === id ? {...x, read: true} : x))
      setUnread(u => Math.max(0, u - 1))
    } catch {}
  }

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifs(n => n.map(x => ({...x, read: true})))
      setUnread(0)
      toast.success('Todas marcadas como leídas')
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id)
      const wasUnread = notifs.find(x => x.id === id && !x.read)
      setNotifs(n => n.filter(x => x.id !== id))
      if (wasUnread) setUnread(u => Math.max(0, u - 1))
    } catch {}
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5 text-gray-500" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Notificaciones</h3>
              {unread > 0 && <p className="text-xs text-gray-400">{unread} sin leer</p>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={handleMarkAll}
                  className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:text-primary-700">
                  <CheckCheck className="w-3.5 h-3.5" /> Leer todas
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div>
            ) : notifs.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Sin notificaciones</p>
              </div>
            ) : notifs.map(n => (
              <div key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-primary-50/30' : ''}`}>
                <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[n.type] ?? '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                  </p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!n.read && (
                    <button onClick={() => handleMarkRead(n.id)}
                      className="p-1 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)}
                    className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
