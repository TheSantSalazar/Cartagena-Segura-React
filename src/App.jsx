import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

// Landing
import LandingPage  from '@/pages/LandingPage'

// Auth
import LoginPage    from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Admin
import AdminLayout        from '@/components/layout/AdminLayout'
import AdminDashboard     from '@/pages/admin/AdminDashboard'
import AdminIncidents     from '@/pages/admin/AdminIncidents'
import AdminZones         from '@/pages/admin/AdminZones'
import AdminLogs          from '@/pages/admin/AdminLogs'
import AdminEmergency     from '@/pages/admin/AdminEmergency'

// Citizen
import CitizenLayout      from '@/components/layout/CitizenLayout'
import CitizenHome        from '@/pages/citizen/CitizenHome'
import CitizenIncidents   from '@/pages/citizen/CitizenIncidents'
import CitizenMap         from '@/pages/citizen/CitizenMap'
import CitizenEmergency   from '@/pages/citizen/CitizenEmergency'

// Guards
const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/app" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Citizen */}
      <Route path="/app" element={<PrivateRoute><CitizenLayout /></PrivateRoute>}>
        <Route index              element={<CitizenHome />} />
        <Route path="incidents"   element={<CitizenIncidents />} />
        <Route path="map"         element={<CitizenMap />} />
        <Route path="emergency"   element={<CitizenEmergency />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index              element={<AdminDashboard />} />
        <Route path="incidents"   element={<AdminIncidents />} />
        <Route path="zones"       element={<AdminZones />} />
        <Route path="logs"        element={<AdminLogs />} />
        <Route path="emergency"   element={<AdminEmergency />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}