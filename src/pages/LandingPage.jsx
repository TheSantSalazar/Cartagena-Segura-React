import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Lock,
  Map,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Reportes inteligentes en segundos',
    desc: 'Crea reportes guiados con ubicación GPS y evidencia para que la respuesta sea más rápida y precisa.',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    icon: Map,
    title: 'Mapa operativo en tiempo real',
    desc: 'Visualiza incidentes activos, zonas sensibles y tendencias para tomar decisiones con mejor contexto.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Phone,
    title: 'Canal directo de emergencia',
    desc: 'Accede a contactos clave y protocolos de acción inmediata desde cualquier dispositivo.',
    color: 'bg-red-100 text-red-700',
  },
  {
    icon: Bell,
    title: 'Alertas y seguimiento',
    desc: 'Recibe notificaciones sobre el estado de tus reportes y cambios relevantes en tu zona.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Lock,
    title: 'Seguridad y privacidad',
    desc: 'Arquitectura con autenticación segura para proteger la identidad y los datos ciudadanos.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: Users,
    title: 'Colaboración ciudadana',
    desc: 'Una plataforma diseñada para conectar comunidad, líderes barriales y autoridades.',
    color: 'bg-orange-100 text-orange-700',
  },
]

const stats = [
  { value: '24/7', label: 'Monitoreo continuo' },
  { value: '< 2 min', label: 'Tiempo de reporte' },
  { value: '100%', label: 'Cobertura digital' },
  { value: 'GPS', label: 'Geolocalización precisa' },
]

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Prevención estratégica',
    desc: 'Información centralizada para anticipar riesgos y priorizar zonas críticas.',
  },
  {
    icon: Clock3,
    title: 'Respuesta coordinada',
    desc: 'Flujo operativo claro para acelerar la atención de incidentes importantes.',
  },
  {
    icon: CheckCircle2,
    title: 'Trazabilidad completa',
    desc: 'Seguimiento de punta a punta para medir resultados y fortalecer la confianza.',
  },
]

const journey = [
  {
    step: '01',
    title: 'Regístrate en minutos',
    desc: 'Crea tu cuenta con un proceso sencillo y comienza a usar la plataforma de inmediato.',
  },
  {
    step: '02',
    title: 'Informa con evidencia',
    desc: 'Describe el incidente, añade ubicación y evidencia para mejorar la priorización.',
  },
  {
    step: '03',
    title: 'Haz seguimiento',
    desc: 'Consulta el estado del caso y recibe notificaciones sobre avances y acciones tomadas.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">Cartagena Segura</p>
              <p className="text-[11px] text-slate-500">Plataforma de Seguridad Ciudadana</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-primary rounded-xl px-4 py-2 text-sm">
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-primary-950 to-primary-900 pt-28 sm:pt-32">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.2) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-primary-100">
                <Sparkles className="h-3.5 w-3.5" />
                Plataforma moderna para ciudades más seguras
              </div>
              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Tu ciudad, conectada y protegida en tiempo real.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-200 sm:text-lg">
                Cartagena Segura centraliza reportes, monitoreo y comunicación entre ciudadanía y autoridades en una sola experiencia profesional.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-primary-900 shadow-lg shadow-primary-950/30 transition hover:bg-primary-50">
                  Empezar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <p className="mb-4 text-sm font-semibold text-white">Indicadores clave de la plataforma</p>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-primary-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="-mt-6 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="mb-3 inline-flex rounded-xl bg-primary-50 p-2 text-primary-700">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Funcionalidades</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Herramientas diseñadas para operar mejor</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Una experiencia enfocada en usabilidad, velocidad y claridad para ciudadanos y equipos de respuesta.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`mb-4 inline-flex rounded-2xl p-3 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Flujo de uso</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Un proceso simple, claro y accionable</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {journey.map((item) => (
              <div key={item.step} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <span className="mb-4 inline-flex rounded-xl bg-primary-600 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                  Paso {item.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Eleva la seguridad de tu comunidad</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-200 sm:text-base">
            Únete hoy y transforma la forma en que Cartagena reporta y gestiona incidentes con una plataforma de nivel profesional.
          </p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-primary-900 shadow-lg shadow-primary-950/30 transition hover:bg-primary-50">
            Crear cuenta gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-7">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <img src="/Ctg_Seg-Logo.png" alt="Logo" className="h-5 w-5 object-contain" />
            Cartagena Segura © 2026
          </div>
          <div className="flex items-center gap-5 text-sm font-medium text-slate-500">
            <Link to="/login" className="transition hover:text-slate-900">Iniciar sesión</Link>
            <Link to="/register" className="transition hover:text-slate-900">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
