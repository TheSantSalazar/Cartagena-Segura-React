import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import useAuthStore from '@/store/authStore'

import LandingPage from '@/pages/LandingPage'
import LoginPage    from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import AdminLayout    from '@/components/layout/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminIncidents from '@/pages/admin/AdminIncidents'
import AdminZones     from '@/pages/admin/AdminZones'
import AdminLogs      from '@/pages/admin/AdminLogs'
import AdminEmergency from '@/pages/admin/AdminEmergency'
import AdminReports   from '@/pages/admin/AdminReports'

import CitizenLayout    from '@/components/layout/CitizenLayout'
import CitizenHome      from '@/pages/citizen/CitizenHome'
import CitizenIncidents from '@/pages/citizen/CitizenIncidents'
import CitizenMap       from '@/pages/citizen/CitizenMap'
import CitizenEmergency from '@/pages/citizen/CitizenEmergency'
import CitizenReports   from '@/pages/citizen/CitizenReports'
import CitizenProfile   from '@/pages/citizen/CitizenProfile'

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const PageTransition = ({ children }) => (
  <Motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </Motion.div>
)

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
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login"    element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

        <Route path="/app" element={<PrivateRoute><PageTransition><CitizenLayout /></PageTransition></PrivateRoute>}>
          <Route index              element={<CitizenHome />} />
          <Route path="incidents"   element={<CitizenIncidents />} />
          <Route path="map"         element={<CitizenMap />} />
          <Route path="emergency"   element={<CitizenEmergency />} />
          <Route path="analytics"   element={<CitizenReports />} />
          <Route path="profile"     element={<CitizenProfile />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><PageTransition><AdminLayout /></PageTransition></AdminRoute>}>
          <Route index              element={<AdminDashboard />} />
          <Route path="incidents"   element={<AdminIncidents />} />
          <Route path="zones"       element={<AdminZones />} />
          <Route path="logs"        element={<AdminLogs />} />
          <Route path="emergency"   element={<AdminEmergency />} />
          <Route path="reports"     element={<AdminReports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
