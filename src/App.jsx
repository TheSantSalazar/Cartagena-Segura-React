import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '@/Store/AuthStore'

import LandingPage from '@/Pages/LandingPage'
import LoginPage    from '@/Pages/Auth/LoginPage'
import RegisterPage from '@/Pages/Auth/RegisterPage'

import AdminLayout    from '@/Components/Layout/AdminLayout'
import AdminDashboard from '@/Pages/Admin/AdminDashboard'
import AdminIncidents from '@/Pages/Admin/AdminIncidents'
import AdminZones     from '@/Pages/Admin/AdminZones'
import AdminLogs      from '@/Pages/Admin/AdminLogs'
import AdminEmergency from '@/Pages/Admin/AdminEmergency'
import AdminReports   from '@/Pages/Admin/AdminReports'
import AdminAI        from '@/Pages/Admin/AdminAI'

import CitizenLayout    from '@/Components/Layout/CitizenLayout'
import CitizenHome      from '@/Pages/Citizen/CitizenHome'
import CitizenIncidents from '@/Pages/Citizen/CitizenIncidents'
import CitizenMap       from '@/Pages/Citizen/CitizenMap'
import CitizenEmergency from '@/Pages/Citizen/CitizenEmergency'
import CitizenReports   from '@/Pages/Citizen/CitizenReports'
import CitizenProfile   from '@/Pages/Citizen/CitizenProfile'

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
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/app" element={<PrivateRoute><CitizenLayout /></PrivateRoute>}>
        <Route index              element={<CitizenHome />} />
        <Route path="incidents"   element={<CitizenIncidents />} />
        <Route path="map"         element={<CitizenMap />} />
        <Route path="emergency"   element={<CitizenEmergency />} />
        <Route path="analytics"   element={<CitizenReports />} />
        <Route path="profile"     element={<CitizenProfile />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index              element={<AdminDashboard />} />
        <Route path="incidents"   element={<AdminIncidents />} />
        <Route path="zones"       element={<AdminZones />} />
        <Route path="logs"        element={<AdminLogs />} />
        <Route path="emergency"   element={<AdminEmergency />} />
        <Route path="reports"     element={<AdminReports />} />
        <Route path="ai"          element={<AdminAI />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
