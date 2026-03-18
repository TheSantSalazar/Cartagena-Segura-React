import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Shield, LogOut, Edit2, Check, X } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'

export default function CitizenProfile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' })

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSave = () => {
    toast.success('Perfil actualizado')
    setEditing(false)
  }

  const initial = user?.username?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="p-4 space-y-5 animate-fade-in pb-24">
      <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>

      {/* Avatar + nombre */}
      <div className="card p-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
          {initial}
        </div>
        <h2 className="text-lg font-bold text-gray-900">{user?.username}</h2>
        <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium mt-1">
          Ciudadano
        </span>
      </div>

      {/* Info */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">Información personal</h3>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:text-primary-700">
              <Edit2 className="w-3.5 h-3.5" /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check className="w-3.5 h-3.5" /> Guardar
              </button>
              <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <X className="w-3.5 h-3.5" /> Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Usuario</p>
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Nombre completo</p>
              {editing ? (
                <input className="input py-1 text-sm mt-0.5" value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  placeholder="Tu nombre completo" />
              ) : (
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'No especificado'}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900">{user?.email || 'No especificado'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Teléfono</p>
              {editing ? (
                <input className="input py-1 text-sm mt-0.5" value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="+57 300 000 0000" />
              ) : (
                <p className="text-sm font-medium text-gray-900">{user?.phone || 'No especificado'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cerrar sesión */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-500 rounded-2xl text-sm font-semibold hover:bg-red-50 transition-colors">
        <LogOut className="w-4 h-4" /> Cerrar sesión
      </button>
    </div>
  )
}
