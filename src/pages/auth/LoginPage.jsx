import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/services'
import useAuthStore from '@/store/authStore'

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authService.login(data)
      const { token, username, roles, fullName, email, phone } = res.data.data
      login({ username, roles, fullName, email, phone }, token)
      toast.success(`¡Bienvenido, ${username}!`)
      navigate(roles?.includes('ROLE_ADMIN') ? '/admin' : '/app')
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        toast.error('Credenciales incorrectas. Verifica tu usuario y contraseña.')
      } else if (status === 500) {
        toast.error('Error del servidor. Intenta más tarde.')
      } else {
        toast.error('Error al iniciar sesión. Intenta de nuevo.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundImage: 'url(/login_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-sm sm:max-w-md animate-slide-up">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 border border-white/20 rounded-2xl mb-4 backdrop-blur">
            <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Cartagena Segura</h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1">Sistema de Seguridad Ciudadana</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Usuario, correo o teléfono</label>
              <input className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                placeholder="usuario / correo@email.com / 300..."
                {...register('username', { required: 'Campo requerido' })} />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 pr-10"
                  placeholder="••••••••"
                  {...register('password', { required: 'Campo requerido' })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p className="text-center text-sm text-white/60 mt-5 sm:mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}