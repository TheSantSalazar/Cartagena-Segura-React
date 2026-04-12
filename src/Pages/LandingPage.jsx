import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, ArrowRight, Bell, CheckCircle2,
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
  { icon: AlertTriangle, title: 'Reporte de incidentes', desc: 'Informa sobre robos, accidentes o vandalismo en segundos con geolocalización precisa.', accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  { icon: Map, title: 'Mapa de calor', desc: 'Visualiza las zonas con mayor actividad de incidentes para tomar decisiones informadas.', accent: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  { icon: Bell, title: 'Alertas en tiempo real', desc: 'Recibe notificaciones inmediatas sobre situaciones de riesgo en tu ubicación actual.', accent: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  { icon: ShieldCheck, title: 'Gestión de casos', desc: 'Seguimiento detallado desde el reporte hasta la resolución por parte de las autoridades.', accent: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  { icon: Sparkles, title: 'Inteligencia artificial', desc: 'Análisis predictivo y clasificación automática de reportes para priorizar emergencias.', accent: '#06B6D4', bg: 'rgba(6,182,212,0.08)' },
  { icon: Users, title: 'Participación ciudadana', desc: 'Conecta a la comunidad con los entes de control para una Cartagena más segura.', accent: '#10B981', bg: 'rgba(16,185,129,0.08)' },
]

const journey = [
  { step: '01', title: 'Regístrate ahora', desc: 'Registro rápido en menos de 2 minutos. Solo necesitas tu correo o teléfono.' },
  { step: '02', title: 'Reporta con evidencia', desc: 'Describe el incidente, adjunta fotos o videos y comparte tu ubicación GPS exacta.' },
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
      setLiveStats({ total: totalCount, resolved: rate, zones: zoneCount })
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Serif+Display&display=swap');
        @keyframes heroReveal { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatA { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #60A5FA 50%, #fff 100%);
          background-size: 200% 200%;
          animation: gradientFlow 5s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .scan-line {
          position: absolute; inset-x-0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent);
          animation: scanLine 3s linear infinite;
        }
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
                <Zap size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Plataforma activa en Cartagena ✨</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </div>
              
              <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight">
                <span className="gradient-text">Tu ciudad,</span><br/>
                <span className="text-white/95">conectada y</span><br/>
                <span className="text-white/95">protegida.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/45 leading-relaxed max-w-lg">
                Centraliza reportes, monitoreo y comunicación entre ciudadanía y autoridades para una respuesta inmediata y eficiente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link to="/register" className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 group">
                  Registrarse <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10 flex items-center justify-center">
                  Ya tengo cuenta
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-6 border-t border-white/10">
                {[['🔒', 'Datos seguros'], ['⚡', 'Tiempo real'], ['📍', 'GPS preciso']].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-xs text-white/35 font-medium uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block animate-[heroReveal_1s_ease-out]">
              <div style={{ position: 'absolute', inset: -40, background: 'url(/RegisterBg.png)', backgroundSize: 'cover', opacity: 0.15, filter: 'blur(40px)' }} />
              
              <div className="relative p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="scan-line" />
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Panel de control</p>
                    <p className="text-lg font-bold text-white">Resumen operativo</p>
                  </div>
                  <div className="flex gap-1.5">
                    {['#EF4444', '#F59E0B', '#10B981'].map(c => (
                      <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { n: '24', label: 'Activos', color: '#F59E0B' },
                    { n: '8', label: 'Críticos', color: '#EF4444' },
                    { n: '156', label: 'Resueltos', color: '#10B981' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-2xl font-black" style={{ color: s.color }}>{s.n}</p>
                      <p className="text-[9px] uppercase tracking-wider text-white/30 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    { type: 'ROBO', loc: 'Getsemaní', time: 'hace 2 min', color: '#EF4444', status: 'CRÍTICO' },
                    { type: 'ACCIDENTE', loc: 'Bocagrande', time: 'hace 8 min', color: '#F59E0B', status: 'ACTIVO' },
                    { type: 'VANDALISMO', loc: 'El Centro', time: 'hace 15 min', color: '#8B5CF6', status: 'REVISIÓN' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="w-2 h-2 rounded-full border shadow-[0_0_8px]" style={{ background: item.color, borderColor: item.color }} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white/90">{item.type}</p>
                        <p className="text-[10px] text-white/30">{item.loc}</p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: item.color, background: `${item.color}15` }}>{item.status}</span>
                      <span className="text-[9px] text-white/20">{item.time}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/5 border border-violet-500/20 flex items-center gap-3">
                  <Sparkles size={14} className="text-violet-400" />
                  <span className="text-[11px] text-white/60">IA clasificó <strong className="text-violet-400">3 incidentes</strong> automáticamente</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl flex items-center gap-3 animate-[floatA_4s_infinite]">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                 <div>
                    <p className="text-xs font-bold text-white">Sistema activo</p>
                    <p className="text-[10px] text-white/40">Monitoreo 24/7</p>
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
              { value: liveStats.zones, suffix: ' barrios', label: 'Conectados activamente', icon: Globe },
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
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Herramientas que <span className="gradient-text">transforman la seguridad</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Una experiencia enfocada en usabilidad, velocidad y claridad para ciudadanos y equipos de respuesta.
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
