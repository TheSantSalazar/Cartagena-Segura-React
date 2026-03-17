import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Shield, Loader2 } from 'lucide-react'
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
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl mb-4 backdrop-blur">
            <img src="/Ctg_Seg-Logo.png" alt="Cartagena Segura" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white">Cartagena Segura</h1>
          <p className="text-primary-300 text-sm mt-1">Crea tu cuenta ciudadana</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Registro</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Usuario</label>
                <input className="input" placeholder="usuario123"
                  {...register('username', { required: 'Requerido', minLength: { value: 3, message: 'Min 3 chars' } })} />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>
              <div>
                <label className="label">Nombre completo</label>
                <input className="input" placeholder="Juan Pérez"
                  {...register('fullName', { required: 'Requerido' })} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Correo electrónico</label>
              <input type="email" className="input" placeholder="correo@email.com"
                {...register('email', { required: 'Requerido', pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' } })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Teléfono</label>
              <input type="tel" className="input" placeholder="3001234567"
                {...register('phone')} />
            </div>

            <div>
              <label className="label">Contraseña</label>
              <input type="password" className="input" placeholder="••••••••"
                {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Min 6 caracteres' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}