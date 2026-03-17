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
      const { token, username, roles } = res.data.data
      login({ username, roles }, token)
      toast.success(`¡Bienvenido, ${username}!`)
      navigate(roles?.includes('ROLE_ADMIN') ? '/admin' : '/app')
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl mb-4 backdrop-blur">
            <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cartagena Segura</h1>
          <p className="text-primary-300 text-sm mt-1">Sistema de Seguridad Ciudadana</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Usuario</label>
              <input className="input" placeholder="tu_usuario"
                {...register('username', { required: 'Campo requerido' })} />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-10" placeholder="••••••••"
                  {...register('password', { required: 'Campo requerido' })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}