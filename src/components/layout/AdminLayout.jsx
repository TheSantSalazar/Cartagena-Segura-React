import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, Map, FileText, Phone, LogOut } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const navItems = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/admin/incidents', icon: AlertTriangle,   label: 'Incidentes'  },
  { to: '/admin/zones',     icon: Map,             label: 'Zonas'       },
  { to: '/admin/emergency', icon: Phone,           label: 'Emergencias' },
  { to: '/admin/logs',      icon: FileText,        label: 'Logs'        },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-primary-950 flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-800">
          <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura"
            className="w-9 h-9 rounded-xl object-contain flex-shrink-0" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Cartagena</p>
            <p className="text-primary-400 text-xs">Panel Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                }`
              }>
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-primary-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary-800/50 mb-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.username}</p>
              <p className="text-primary-400 text-xs">Administrador</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-primary-300 hover:bg-red-500/20 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}