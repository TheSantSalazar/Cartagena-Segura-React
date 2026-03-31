import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, Loader2, Brain, MapPin, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react'
import { aiService } from '@/services/services'

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor ml-0.5">&nbsp;</span>}
    </span>
  )
}

function AnimatedCounter({ value, duration = 1200 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const num = parseInt(value)
    if (isNaN(num) || num === 0) { setCount(value); return }

    let start = 0
    const startTime = performance.now()
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * num))
      if (progress < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [value, duration])

  return <>{count}</>
}

export { TypewriterText, AnimatedCounter }

export default function AdminAI() {
  const [summaryText, setSummaryText] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryTime, setSummaryTime] = useState(null)
  const [summaryError, setSummaryError] = useState(false)

  const [zones, setZones] = useState([])
  const [zonesLoading, setZonesLoading] = useState(false)
  const [zonesError, setZonesError] = useState(false)

  const generateSummary = async () => {
    setSummaryLoading(true)
    setSummaryError(false)
    setSummaryText('')
    try {
      const res = await aiService.summary()
      const text = res.data?.summary ?? res.data?.message ?? res.data ?? 'Sin respuesta.'
      setSummaryText(typeof text === 'string' ? text : JSON.stringify(text))
      setSummaryTime(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      setSummaryError(true)
      setSummaryText('')
    } finally {
      setSummaryLoading(false)
    }
  }

  const analyzeZones = async () => {
    setZonesLoading(true)
    setZonesError(false)
    setZones([])
    try {
      const res = await aiService.zonesAnalysis()
      const data = res.data?.zones ?? res.data?.data ?? res.data ?? []
      setZones(Array.isArray(data) ? data : [])
    } catch {
      setZonesError(true)
    } finally {
      setZonesLoading(false)
    }
  }

  const riskGradient = {
    LOW: 'from-green-500 to-emerald-600',
    MEDIUM: 'from-yellow-500 to-amber-600',
    HIGH: 'from-orange-500 to-red-500',
    CRITICAL: 'from-red-500 to-rose-700',
  }
  const riskBg = {
    LOW: 'bg-green-50 border-green-200',
    MEDIUM: 'bg-yellow-50 border-yellow-200',
    HIGH: 'bg-orange-50 border-orange-200',
    CRITICAL: 'bg-red-50 border-red-200',
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Asistente de Inteligencia Artificial</h1>
            <p className="text-primary-300 text-sm mt-0.5">Análisis y resúmenes potenciados por Spring AI</p>
          </div>
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-400/20 border border-primary-400/30 text-primary-200 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
            BETA
          </span>
        </div>
      </div>

      {/* Summary Section */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Resumen Inteligente del Sistema</h2>
              <p className="text-xs text-gray-400">La IA analiza todos los incidentes y genera un resumen narrativo</p>
            </div>
          </div>
          {summaryTime && (
            <span className="text-xs text-gray-400 hidden sm:block">Generado a las {summaryTime}</span>
          )}
        </div>

        <div className="p-5">
          {!summaryText && !summaryLoading && !summaryError && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-purple-500" />
              </div>
              <p className="text-gray-500 text-sm mb-4">Genera un resumen narrativo del estado actual del sistema</p>
              <button onClick={generateSummary} className="btn-primary gap-2">
                <Sparkles className="w-4 h-4" /> Generar Resumen con IA
              </button>
            </div>
          )}

          {summaryLoading && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              <span className="text-sm text-gray-500">Analizando datos del sistema...</span>
            </div>
          )}

          {summaryError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 text-sm font-medium">No se pudo conectar con el servicio de IA</p>
              <p className="text-red-400 text-xs mt-1">El backend de Spring AI no está disponible en este momento</p>
              <button onClick={generateSummary} className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 mx-auto">
                <RefreshCw className="w-3.5 h-3.5" /> Reintentar
              </button>
            </div>
          )}

          {summaryText && !summaryLoading && (
            <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 rounded-xl p-5 border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                <TypewriterText text={summaryText} />
              </p>
              <div className="flex justify-end mt-4 pt-3 border-t border-purple-100">
                <button onClick={generateSummary} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" /> Regenerar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zones Analysis Section */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Análisis de Zonas de Riesgo</h2>
              <p className="text-xs text-gray-400">La IA evalúa patrones de incidentes por zona y recomienda acciones</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {zones.length === 0 && !zonesLoading && !zonesError && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm mb-4">Analiza las zonas registradas y obtén recomendaciones de acción</p>
              <button onClick={analyzeZones} className="btn-primary gap-2">
                <Brain className="w-4 h-4" /> Analizar Zonas con IA
              </button>
            </div>
          )}

          {zonesLoading && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-sm text-gray-500">Analizando patrones de incidentes por zona...</span>
            </div>
          )}

          {zonesError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 text-sm font-medium">No se pudo conectar con el servicio de IA</p>
              <p className="text-red-400 text-xs mt-1">El backend de Spring AI no está disponible</p>
              <button onClick={analyzeZones} className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 mx-auto">
                <RefreshCw className="w-3.5 h-3.5" /> Reintentar
              </button>
            </div>
          )}

          {zones.length > 0 && !zonesLoading && (
            <div className="grid gap-3 sm:grid-cols-2">
              {zones.map((zone, i) => (
                <div
                  key={zone.name || i}
                  className={`rounded-xl border p-4 animate-slide-up-stagger ${riskBg[zone.riskLevel] ?? 'bg-gray-50 border-gray-200'}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{zone.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${riskGradient[zone.riskLevel] ?? 'from-gray-400 to-gray-500'}`}>
                      {zone.riskLevel}
                    </span>
                  </div>
                  {zone.recommendation && (
                    <p className="text-xs text-gray-600 leading-relaxed">{zone.recommendation}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <Brain className="w-3 h-3 text-primary-500" />
                    <span className="text-[10px] text-primary-600 font-medium">Analizado por IA</span>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 flex justify-end pt-2">
                <button onClick={analyzeZones} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" /> Re-analizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
