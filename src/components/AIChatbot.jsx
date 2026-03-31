import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Sparkles, Bot, User, AlertCircle } from 'lucide-react'
import { aiService } from '@/services/services'

const WELCOME_MSG = {
  role: 'assistant',
  content: '¡Hola! 👋 Soy el asistente virtual de **Cartagena Segura**. Puedo ayudarte con:\n\n• Información sobre cómo reportar incidentes\n• Protocolos de emergencia\n• Estado general de seguridad en tu zona\n• Preguntas sobre la plataforma\n\n¿En qué puedo ayudarte?',
}

function generateSessionId() {
  return 'cs-' + crypto.randomUUID()
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/• /g, '&bull; ')
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [open, messages, scrollToBottom])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiService.chat({ message: text, sessionId })
      const reply = res.data?.reply ?? res.data?.message ?? res.data ?? 'Sin respuesta del servidor.'
      setMessages(prev => [...prev, { role: 'assistant', content: typeof reply === 'string' ? reply : JSON.stringify(reply) }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Lo siento, no pude conectarme con el servicio de IA en este momento. El servidor puede estar temporalmente no disponible. Intenta de nuevo en unos segundos.',
        error: true,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* FAB - Floating Action Button with glow */}
      {!open && (
        <button
          id="ai-chatbot-fab"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-xl animate-glow-pulse hover:scale-110 transition-transform duration-200 sm:bottom-6 sm:right-6"
          aria-label="Abrir asistente IA"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Chat Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end sm:p-4" onClick={() => setOpen(false)}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:w-[400px] h-full sm:h-[calc(100vh-32px)] sm:rounded-2xl overflow-hidden flex flex-col animate-drawer-slide"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,247,255,0.98) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,112,191,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.15), 0 0 40px rgba(0,112,191,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary-100/50 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Asistente IA</p>
                  <p className="text-primary-200 text-xs">Cartagena Segura · Spring AI</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 animate-chat-slide-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                    ${msg.role === 'user'
                      ? 'bg-primary-100 text-primary-600'
                      : msg.error
                        ? 'bg-red-100 text-red-500'
                        : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                    }`}
                  >
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5" />
                      : msg.error
                        ? <AlertCircle className="w-3.5 h-3.5" />
                        : <Bot className="w-3.5 h-3.5" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : msg.error
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-md'
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5 animate-chat-slide-in">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white/80">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1 border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 py-2.5 focus:outline-none"
                  placeholder="Escribe tu mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                Potenciado por Spring AI · Las respuestas pueden ser imprecisas
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
