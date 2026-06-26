import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth, isSupabaseConfigured } from '../../lib/auth'
import { Input, Btn, StatusMsg } from './ui'

export function Login() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (session) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? traducirError(err.message) : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-2xl">Golden Horses</h1>
          <p className="font-condensed text-gold/55 tracking-[2px] uppercase text-sm mt-1">Acceso al panel</p>
        </div>

        {!isSupabaseConfigured && (
          <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado. Completá el archivo .env con tus credenciales.' }} />
        )}

        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-gold/15 rounded-2xl p-7">
          <StatusMsg status={error ? { type: 'error', text: error } : null} />

          <label className="block mb-4">
            <span className="block font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase mb-1.5">Email</span>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </label>

          <label className="block mb-6">
            <span className="block font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase mb-1.5">Contraseña</span>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>

          <Btn type="submit" disabled={loading || !isSupabaseConfigured} className="w-full">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Btn>
        </form>
      </div>
    </div>
  )
}

function traducirError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'Email o contraseña incorrectos.'
  if (/email not confirmed/i.test(msg))        return 'El email aún no fue confirmado.'
  return msg
}
