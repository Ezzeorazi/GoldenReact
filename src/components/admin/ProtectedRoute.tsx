import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

/** Permite el paso solo si hay sesión activa; si no, redirige al login. */
export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="font-condensed text-gold/70 tracking-[3px] uppercase animate-pulse">Cargando…</span>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
