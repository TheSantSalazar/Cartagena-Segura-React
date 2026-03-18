import { Link } from 'react-router-dom'
import { AlertTriangle, Map, Phone, Bell, Lock, Users, ChevronRight } from 'lucide-react'

const features = [
  { icon: AlertTriangle, title: 'Reporta Incidentes', desc: 'Reporta robos, accidentes y más desde tu celular en segundos.', color: 'bg-yellow-50 text-yellow-600' },
  { icon: Map, title: 'Mapa en Tiempo Real', desc: 'Visualiza todos los incidentes en Cartagena en un mapa interactivo.', color: 'bg-blue-50 text-blue-600' },
  { icon: Phone, title: 'Contactos de Emergencia', desc: 'Accede rápido a policía, bomberos, ambulancias y más.', color: 'bg-red-50 text-red-600' },
  { icon: Bell, title: 'Notificaciones', desc: 'Recibe actualizaciones sobre el estado de tus reportes.', color: 'bg-purple-50 text-purple-600' },
  { icon: Lock, title: 'Seguro y Privado', desc: 'Tus datos están protegidos con autenticación JWT.', color: 'bg-green-50 text-green-600' },
  { icon: Users, title: 'Para Toda la Ciudad', desc: 'Plataforma colaborativa donde cada ciudadano contribuye.', color: 'bg-orange-50 text-orange-600' },
]

const stats = [
  { value: '24/7', label: 'Disponibilidad' },
  { value: '15+', label: 'Tipos de incidentes' },
  { value: '100%', label: 'Gratuito' },
  { value: 'GPS', label: 'Ubicación exacta' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            <span className="font-bold text-gray-900 text-sm">Cartagena Segura</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-1.5">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 sm:pt-24 pb-16 sm:pb-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl mb-5 sm:mb-6 backdrop-blur">
            <img src="/Ctg_Seg-Logo.png" alt="Logo" className="w-10 h-10 sm:w-16 sm:h-16 object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Cartagena Segura
          </h1>
          <p className="text-lg sm:text-xl text-primary-300 mb-2 sm:mb-3">Sistema de Seguridad Ciudadana</p>
          <p className="text-primary-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            Conecta a los ciudadanos de Cartagena con las autoridades para reportar, monitorear y responder a incidentes en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-primary-900 font-bold rounded-2xl hover:bg-primary-50 transition-colors shadow-lg text-sm">
              Crear cuenta gratis <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-colors text-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary-900 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-400 text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Todo lo que necesitas</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Herramientas diseñadas para mantener segura a la comunidad de Cartagena.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{f.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Crea tu cuenta', desc: 'Regístrate gratis como ciudadano en menos de un minuto.' },
              { step: '02', title: 'Reporta un incidente', desc: 'Describe lo que ocurrió, adjunta tu ubicación GPS y envía.' },
              { step: '03', title: 'Las autoridades actúan', desc: 'El equipo recibe el reporte y coordina la respuesta.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-primary-600 font-bold text-base sm:text-lg">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">¿Listo para unirte?</h2>
          <p className="text-primary-300 text-sm sm:text-base mb-7 sm:mb-8">
            Sé parte de la comunidad que hace de Cartagena una ciudad más segura.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-primary-900 font-bold rounded-2xl hover:bg-primary-50 transition-colors shadow-lg text-sm">
            Crear cuenta gratis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <img src="/Ctg_Seg-Logo.png" alt="Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            <span className="text-gray-400 text-xs sm:text-sm">Cartagena Segura © 2026</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Iniciar Sesión</Link>
            <Link to="/register" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}