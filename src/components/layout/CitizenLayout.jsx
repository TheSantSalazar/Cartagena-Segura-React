import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Home, AlertTriangle, Map, Phone, LogOut, Bell } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const navItems = [
  { to: '/app',           icon: Home,          label: 'Inicio',      end: true },
  { to: '/app/incidents', icon: AlertTriangle, label: 'Mis Reportes' },
  { to: '/app/map',       icon: Map,           label: 'Mapa'         },
  { to: '/app/emergency', icon: Phone,         label: 'Emergencias'  },
]

export default function CitizenLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* TOP BAR */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="w-8 h-8 rounded-xl object-contain" />
          <span className="font-bold text-gray-900 text-sm">Cartagena Segura</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.username}</span>
          </div>
          <button onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-xs font-medium
                ${isActive ? 'text-primary-600' : 'text-gray-400'}`
              }>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}