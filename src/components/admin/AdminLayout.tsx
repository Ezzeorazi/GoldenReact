import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

const LINKS = [
  { to: '/admin',            label: 'Inicio',        end: true },
  { to: '/admin/inicio',     label: 'Banner',        end: false },
  { to: '/admin/productos',  label: 'Productos',     end: false },
  { to: '/admin/conocenos',  label: 'Quiénes somos', end: false },
  { to: '/admin/beneficios', label: 'Beneficios',    end: false },
]

export function AdminLayout() {
  const { signOut, session } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* ── Sidebar ── */}
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-gold/20 flex flex-col">
        <div className="px-6 py-6 border-b border-gold/15">
          <h1 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-lg">Golden Horses</h1>
          <p className="font-condensed text-gold/50 text-sm tracking-[2px] uppercase">Panel de administración</p>
        </div>

        <nav className="flex md:flex-col p-3 gap-1 overflow-x-auto">
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `font-condensed tracking-[1.5px] uppercase text-sm px-4 py-3 rounded-lg whitespace-nowrap transition-colors
                 ${isActive ? 'bg-gold text-black font-bold' : 'text-gold/75 hover:bg-gold/10'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-gold/15 hidden md:block">
          <p className="font-condensed text-gold/40 text-xs px-2 mb-2 truncate">{session?.user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full font-condensed tracking-[1.5px] uppercase text-sm px-4 py-2.5 rounded-lg
                       border border-gold/30 text-gold/80 hover:bg-gold/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Logout móvil */}
        <button
          onClick={handleLogout}
          className="md:hidden m-3 font-condensed tracking-[1.5px] uppercase text-sm px-4 py-2.5 rounded-lg
                     border border-gold/30 text-gold/80 hover:bg-gold/10 transition-colors"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* ── Contenido ── */}
      <main className="flex-1 p-5 md:p-10 max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}
