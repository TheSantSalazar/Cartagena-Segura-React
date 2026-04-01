import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, ArrowRight, Bell, CheckCircle2, Clock3,
  Lock, Map, Phone, ShieldCheck, Sparkles, Users, ChevronDown,
  Zap, Eye, Globe, TrendingUp
} from 'lucide-react'

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

const stats = [
  { value: 847, suffix: '+', label: 'Reportes gestionados', icon: TrendingUp },
  { value: 24, suffix: '/7', label: 'Monitoreo continuo', icon: Eye },
  { value: 40, suffix: ' barrios', label: 'Conectados activamente', icon: Globe },
  { value: 98, suffix: '%', label: 'Tasa de resolución', icon: CheckCircle2 },
]

const journey = [
  { step: '01', title: 'Crea tu cuenta', desc: 'Registro rápido en menos de 2 minutos. Solo necesitas tu correo o teléfono.' },
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
  const [featRef, featInView] = useInView(0.1)
  const [journeyRef, journeyInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.2)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navOpaque = scrollY > 40

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#060B14', fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%     { transform: translateY(-18px) rotate(1.5deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%     { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes scanLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes gradientFlow {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineExpand {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes shimmerSlow {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .hero-tag    { animation: heroReveal 700ms ease-out 100ms both; }
        .hero-title  { animation: heroReveal 700ms ease-out 250ms both; }
        .hero-sub    { animation: heroReveal 700ms ease-out 380ms both; }
        .hero-cta    { animation: heroReveal 700ms ease-out 500ms both; }
        .hero-right  { animation: heroReveal 900ms ease-out 300ms both; }

        .float-a { animation: floatA 6s ease-in-out infinite; }
        .float-b { animation: floatB 8s ease-in-out infinite; }

        .scan-line {
          position: absolute; inset-x-0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent);
          animation: scanLine 3s linear infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #93C5FD 40%, #60A5FA 70%, #fff 100%);
          background-size: 300% 300%;
          animation: gradientFlow 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .accent-gradient {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4);
          background-size: 200% 200%;
          animation: gradientFlow 3s ease infinite;
        }

        .feat-card { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .feat-card:hover { transform: translateY(-6px); }

        .reveal { opacity: 0; transform: translateY(28px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        .stagger-1 { transition-delay: 0.05s; }
        .stagger-2 { transition-delay: 0.12s; }
        .stagger-3 { transition-delay: 0.19s; }
        .stagger-4 { transition-delay: 0.26s; }
        .stagger-5 { transition-delay: 0.33s; }
        .stagger-6 { transition-delay: 0.40s; }

        .pulse-ring::after {
          content: '';
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(59,130,246,0.4);
          animation: pulseRing 2s ease-out infinite;
        }

        .shimmer-text {
          background: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.4) 80%);
          background-size: 200% auto;
          animation: shimmerSlow 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
          pointer-events: none;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060B14; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 4px; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', inset: '0 0 auto 0', zIndex: 100,
        background: navOpaque ? 'rgba(6,11,20,0.92)' : 'transparent',
        backdropFilter: navOpaque ? 'blur(20px)' : 'none',
        borderBottom: navOpaque ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }} className="pulse-ring">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/Ctg_Seg-Logo.png" alt="Logo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              </div>
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Cartagena Segura</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Plataforma de Seguridad</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 10, transition: 'all 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
              Iniciar sesión
            </Link>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,99,235,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.35)' }}>
              Crear cuenta <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0 }} className="grid-bg" />
        <div className="noise-overlay" style={{ position: 'absolute', inset: 0 }} />

        {/* Radial glows */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Decorative orbs */}
        <div className="float-a" style={{ position: 'absolute', top: '15%', right: '8%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.2), rgba(139,92,246,0.05))', border: '1px solid rgba(59,130,246,0.15)', backdropFilter: 'blur(8px)', pointerEvents: 'none' }} />
        <div className="float-b" style={{ position: 'absolute', bottom: '20%', left: '3%', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)', border: '1px solid rgba(6,182,212,0.2)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 60px', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
            className="hero-grid">
            <style>{`@media(max-width:768px){.hero-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>

            {/* Left */}
            <div>
              <div className="hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', marginBottom: 24 }}>
                <Zap size={12} style={{ color: '#60A5FA' }} />
                <span style={{ fontSize: 12, color: '#93C5FD', fontWeight: 600, letterSpacing: '0.05em' }}>Plataforma activa en Cartagena</span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} className="animate-pulse" />
              </div>

              <h1 className="hero-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 20, fontFamily: "'DM Serif Display', serif" }}>
                <span className="gradient-text">Tu ciudad,</span><br />
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>conectada y</span><br />
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>protegida.</span>
              </h1>

              <p className="hero-sub" style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
                Centraliza reportes, monitoreo y comunicación entre ciudadanía y autoridades en una sola experiencia de nivel profesional.
              </p>

              <div className="hero-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, fontWeight: 700, fontSize: 15, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', boxShadow: '0 8px 32px rgba(29,78,216,0.4), 0 0 0 1px rgba(59,130,246,0.3)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(29,78,216,0.5), 0 0 0 1px rgba(59,130,246,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(29,78,216,0.4), 0 0 0 1px rgba(59,130,246,0.3)' }}>
                  Empezar gratis <ArrowRight size={16} />
                </Link>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 14, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                  Ya tengo cuenta
                </Link>
              </div>

              {/* Trust badges */}
              <div className="hero-cta" style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {[['🔒', 'Datos seguros'], ['⚡', 'Tiempo real'], ['📍', 'GPS preciso']].map(([icon, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div className="hero-right" style={{ position: 'relative' }}>
              {/* Main card */}
              <div style={{ borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', padding: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                <div className="scan-line" />

                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Panel de control</p>
                    <p style={{ fontSize: 16, color: '#fff', fontWeight: 700 }}>Resumen operativo</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#EF4444', '#F59E0B', '#10B981'].map(c => (
                      <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.8 }} />
                    ))}
                  </div>
                </div>

                {/* Mini stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                  {[
                    { n: '24', label: 'Activos', color: '#F59E0B' },
                    { n: '8', label: 'Críticos', color: '#EF4444' },
                    { n: '156', label: 'Resueltos', color: '#10B981' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.n}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Activity feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { type: 'ROBO', loc: 'Getsemaní', time: 'hace 2 min', color: '#EF4444', status: 'CRÍTICO' },
                    { type: 'ACCIDENTE', loc: 'Bocagrande', time: 'hace 8 min', color: '#F59E0B', status: 'ACTIVO' },
                    { type: 'VANDALISMO', loc: 'El Centro', time: 'hace 15 min', color: '#8B5CF6', status: 'REVISIÓN' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 8px ${item.color}` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{item.type}</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{item.loc}</p>
                      </div>
                      <span style={{ fontSize: 9, color: item.color, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${item.color}18`, border: `1px solid ${item.color}30`, whiteSpace: 'nowrap' }}>{item.status}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>{item.time}</span>
                    </div>
                  ))}
                </div>

                {/* AI badge */}
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={14} style={{ color: '#A78BFA' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>IA clasificó <strong style={{ color: '#A78BFA' }}>3 incidentes</strong> automáticamente</span>
                </div>
              </div>

              {/* Floating badge */}
              <div style={{ position: 'absolute', bottom: -20, left: -20, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }} className="float-b">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }} className="animate-pulse" />
                <div>
                  <p style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>Sistema activo</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Monitoreo 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <span>Explorar</span>
              <ChevronDown size={16} style={{ animation: 'floatA 2s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(37,99,235,0.03), transparent)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="stats-grid">
            <style>{`@media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
            {stats.map((stat, i) => (
              <div key={i} className={`reveal stagger-${i + 1} ${statsInView ? 'visible' : ''}`}>
                <StatCard stat={stat} active={statsInView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section ref={featRef} style={{ padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className={`reveal ${featInView ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Funcionalidades</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, fontFamily: "'DM Serif Display', serif" }}>
              Herramientas que<br /><span className="gradient-text">transforman la seguridad</span>
            </h2>
            <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.35)', fontSize: 16, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.7 }}>
              Una experiencia enfocada en usabilidad, velocidad y claridad para ciudadanos y equipos de respuesta.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="feat-grid">
            <style>{`@media(max-width:900px){.feat-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:600px){.feat-grid{grid-template-columns:1fr!important}}`}</style>
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div key={i}
                  className={`feat-card reveal stagger-${(i % 3) + 1} ${featInView ? 'visible' : ''}`}
                  style={{ padding: 28, borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${feat.accent}30`; e.currentTarget.style.background = feat.bg }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: feat.bg, border: `1px solid ${feat.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon size={20} style={{ color: feat.accent }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>{feat.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>{feat.desc}</p>

                  {/* Hover accent line */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${feat.accent}, transparent)`, opacity: 0, transition: 'opacity 0.3s' }}
                    className="feat-line" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── JOURNEY ─────────────────────────────────────────────────────── */}
      <section ref={journeyRef} style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className={`reveal ${journeyInView ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Flujo de uso</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', serif" }}>
              Simple, claro y <span className="gradient-text">accionable</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }} className="journey-grid">
            <style>{`@media(max-width:768px){.journey-grid{grid-template-columns:1fr!important}}`}</style>

            {/* Connector line */}
            <div style={{ position: 'absolute', top: 32, left: '17%', right: '17%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(59,130,246,0.3), transparent)', pointerEvents: 'none' }} className="journey-line" />
            <style>{`@media(max-width:768px){.journey-line{display:none}}`}</style>

            {journey.map((item, i) => (
              <div key={i} className={`reveal stagger-${i + 1} ${journeyInView ? 'visible' : ''}`}
                style={{ padding: 28, borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', transition: 'all 0.4s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(59,130,246,0.1))', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#60A5FA' }}>{item.step}</span>
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'rgba(59,130,246,0.15)' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section ref={ctaRef} style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className={`reveal ${ctaInView ? 'visible' : ''}`}>
            {/* Glow behind CTA */}
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(37,99,235,0.2), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

              <p style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Únete hoy</p>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20, fontFamily: "'DM Serif Display', serif" }}>
                Eleva la seguridad<br /><span className="gradient-text">de tu comunidad</span>
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
                Únete y transforma la forma en que Cartagena reporta y gestiona incidentes con tecnología de nivel profesional.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 16, fontWeight: 700, fontSize: 16, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', boxShadow: '0 8px 40px rgba(29,78,216,0.4)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 56px rgba(29,78,216,0.55)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(29,78,216,0.4)' }}>
                  Crear cuenta gratis <ArrowRight size={16} />
                </Link>
                <Link to="/login"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 28px', borderRadius: 16, fontWeight: 600, fontSize: 16, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/Ctg_Seg-Logo.png" alt="Logo" style={{ width: 20, height: 20, objectFit: 'contain', opacity: 0.6 }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Cartagena Segura © 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['Iniciar sesión', '/login'], ['Registrarse', '/register']].map(([label, to]) => (
              <Link key={to} to={to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}