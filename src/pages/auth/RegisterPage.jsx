import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/services'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.register(data)
      toast.success('¡Cuenta creada! Ya puedes iniciar sesión')
      navigate('/login')
    } catch (err) {
  const status = err?.response?.status
  const message = err?.response?.data?.message
  if (status === 400 && message?.includes('username')) {
    toast.error('El nombre de usuario ya está en uso.')
  } else if (status === 400 && message?.includes('email')) {
    toast.error('El correo electrónico ya está registrado.')
  } else if (status === 400 && message?.includes('teléfono')) {
    toast.error('El teléfono ya está registrado.')
  } else if (status === 403 || status === 401) {
    toast.error('No autorizado. Intenta de nuevo.')
  } else if (status === 500) {
    toast.error('Error del servidor. Intenta más tarde.')
  } else {
    toast.error('Error al crear la cuenta. Intenta de nuevo.')
  }
} finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative w-full max-w-sm sm:max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 border border-white/20 rounded-2xl mb-4 backdrop-blur">
            <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Cartagena Segura</h1>
          <p className="text-primary-300 text-xs sm:text-sm mt-1">Crea tu cuenta ciudadana</p>
        </div>
        <div className="bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Crear Cuenta</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Usuario</label>
                <input className="input" placeholder="usuario123"
                  {...register('username', { required: 'Requerido' })} />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>
              <div>
                <label className="label">Nombre completo</label>
                <input className="input" placeholder="Tu nombre"
                  {...register('fullName', { required: 'Requerido' })} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="correo@ejemplo.com"
                {...register('email', { required: 'Requerido' })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Teléfono (opcional)</label>
              <input className="input" placeholder="+57 300 000 0000"
                {...register('phone')} />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input className="input" type="password" placeholder="••••••••"
                {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}