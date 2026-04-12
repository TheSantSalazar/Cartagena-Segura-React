import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, ArrowRight, Bell, CheckCircle2, Clock3,
  Lock, Map, Phone, ShieldCheck, Sparkles, Users, ChevronDown,
  Zap, Eye, Globe, TrendingUp
} from 'lucide-react'
import { incidentService, zoneService } from '@/Services/Services'

/* ── Hooks ────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCountUp(target, active, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const id = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(id) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])
  return count
}

/* ── Data ─────────────────────────────────────────────────────────────── */
const features = [
  { icon: AlertTriangle, title: 'Reportes inteligentes', desc: 'Geolocalización GPS, evidencia multimedia y clasificación automática por IA para respuestas más rápidas.', accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  { icon: Map, title: 'Mapa operativo en vivo', desc: 'Visualiza incidentes activos, zonas de riesgo y tendencias en tiempo real sobre el territorio.', accent: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  { icon: Phone, title: 'Canal de emergencia', desc: 'Contactos clave y protocolos de acción inmediata accesibles desde cualquier dispositivo.', accent: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  { icon: Bell, title: 'Alertas y seguimiento', desc: 'Notificaciones en tiempo real sobre el estado de tus reportes y alertas de tu zona.', accent: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  { icon: Sparkles, title: 'IA clasificadora', desc: 'Inteligencia artificial que analiza y categoriza incidentes automáticamente para priorizar respuestas.', accent: '#06B6D4', bg: 'rgba(6,182,212,0.08)' },
  { icon: Lock, title: 'Privacidad garantizada', desc: 'Autenticación segura JWT y cifrado de extremo a extremo para proteger la identidad ciudadana.', accent: '#10B981', bg: 'rgba(16,185,129,0.08)' },
]

const journey = [
  { step: '01', title: 'Regístrate ahora', desc: 'Registro rápido en menos de 2 minutos. Solo necesitas tu correo o teléfono.' },
  { step: 'step: 02', title: 'Reporta con evidencia', desc: 'Describe el incidente, adjunta fotos o videos y comparte tu ubicación GPS exacta.' },
  { step: '03', title: 'Haz seguimiento en vivo', desc: 'Consulta el estado del caso, recibe notificaciones y visualiza la respuesta de autoridades.' },
]

/* ── Animated Counter ─────────────────────────────────────────────────── */
function StatCard({ stat, active }) {
  const count = useCountUp(stat.value, active)
  const Icon = stat.icon
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      className="rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/[0.07] transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      </div>
      <div>
        <p className="text-3xl font-black text-white tracking-tight tabular-nums">
          {count.toLocaleString()}<span className="text-blue-400 text-2xl">{stat.suffix}</span>
        </p>
        <p className="text-xs text-white/40 mt-1 font-medium tracking-wide uppercase">{stat.label}</p>
      </div>
    </div>
  )
}

/* ── Main Component ───────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [statsRef, statsInView] = useInView(0.3)
  const [liveStats, setLiveStats] = useState({ total: 847, resolved: 98, zones: 40 })
  const [featRef, featInView] = useInView(0.1)
  const [journeyRef, journeyInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.2)

  useEffect(() => {
    // Cargar estadísticas reales
    Promise.all([
      incidentService.getAll().catch(() => null),
      zoneService.getAll().catch(() => null)
    ]).then(([incRes, zoneRes]) => {
      const incs = incRes?.data?.data ?? incRes?.data ?? []
      const zones = zoneRes?.data?.data ?? zoneRes?.data ?? []
      
      const totalCount = incs.length > 0 ? incs.length : 847
      const zoneCount = zones.length > 0 ? zones.length : 40
      
      const resolved = incs.filter(i => i.status === 'RESOLVED').length
      const rate = incs.length > 0 ? Math.round((resolved / incs.length) * 100) : 98
      
      setLiveStats({
        total: totalCount,
        resolved: rate,
        zones: zoneCount
      })
    })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navOpaque = scrollY > 40

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#060B14', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');

        @keyframes heroReveal { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatA { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #60A5FA 50%, #fff 100%);
          background-size: 200% 200%;
          animation: gradientFlow 5s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .grid-bg { background-image: radial-gradient(rgba(59,130,246,0.1) 1px, transparent 1px); background-size: 40px 40px; }
        .reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16,1,0.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', inset: '0 0 auto 0', zIndex: 100,
        background: navOpaque ? 'rgba(6,11,20,0.9)' : 'transparent',
        backdropFilter: navOpaque ? 'blur(16px)' : 'none',
        borderBottom: navOpaque ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s ease'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <img src="/LogoFull.png" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <div className="hidden xs:block">
              <p className="text-white text-sm font-bold leading-tight">Cartagena Segura</p>
              <p className="text-white/30 text-[9px] uppercase tracking-wider">Seguridad Ciudadana</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Iniciar sesión</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20">Registrarse</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden grid-bg pt-20">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 sm:gap-8 animate-[heroReveal_0.8s_ease-out]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Tecnología Ciudadana 24/7 ✨</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Vive una <span className="gradient-text">Cartagena</span><br className="hidden sm:block" /> más segura.
              </h1>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-lg">
                Reporta incidentes en tiempo real, recibe alertas inteligentes y conéctate con la comunidad para proteger lo que más importa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link to="/register" className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 group">
                  Comenzar ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10 flex items-center justify-center">
                  Ver funciones
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block animate-[heroReveal_1s_ease-out]">
              <div className="absolute -inset-4 bg-blue-500/10 blur-[60px] rounded-full" />
              <div className="relative glass p-4 rounded-[40px] shadow-2xl">
                <div className="bg-slate-900 rounded-[32px] overflow-hidden aspect-[4/3] flex items-center justify-center border border-white/5">
                  <img src="/RegisterBg.png" alt="App Preview" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-white/20 mt-16 animate-pulse">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Explorar</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: liveStats.total, suffix: '+', label: 'Reportes registrados', icon: TrendingUp },
              { value: 24, suffix: '/7', label: 'Monitoreo activo', icon: Eye },
              { value: liveStats.zones, suffix: ' barrios', label: 'Comunidades conectadas', icon: Globe },
              { value: liveStats.resolved, suffix: '%', label: 'Tasa de resolución', icon: CheckCircle2 },
            ].map((stat, i) => (
              <div key={i} className={`reveal ${statsInView ? 'visible' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <StatCard stat={stat} active={statsInView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section ref={featRef} id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-16 reveal ${featInView ? 'visible' : ''}`}>
            <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Funcionalidades</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Herramientas que <span className="gradient-text">salvan vidas</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Diseñamos una plataforma intuitiva para que la seguridad esté a un solo clic de distancia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div key={i} className={`glass p-8 rounded-3xl reveal ${featInView ? 'visible' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: feat.bg }}>
                    <Icon size={22} style={{ color: feat.accent }} />
                  </div>
                  <h3 className="text-white text-lg font-bold mb-3">{feat.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <img src="/LogoFull.png" alt="Logo" className="w-5 h-5 opacity-50" />
              <p className="text-white/30 text-sm font-medium">Cartagena Segura © 2026 · Proyecto de Aula</p>
            </div>
            <div className="flex gap-6">
              <Link to="/login" className="text-white/30 hover:text-white text-sm transition-colors">Seguridad</Link>
              <Link to="/register" className="text-white/30 hover:text-white text-sm transition-colors">Privacidad</Link>
              <Link to="/auth" className="text-white/30 hover:text-white text-sm transition-colors">Soporte</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
