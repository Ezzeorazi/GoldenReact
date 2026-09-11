import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

const LINKS = [
  { to: '/admin',               label: 'Inicio',         end: true },
  { to: '/admin/inicio',        label: 'Banner',         end: false },
  { to: '/admin/productos',     label: 'Productos',      end: false },
  { to: '/admin/conocenos',     label: 'Quiénes somos',  end: false },
  { to: '/admin/beneficios',    label: 'Beneficios',     end: false },
  { to: '/admin/destacado',     label: 'Destacado',      end: false },
  { to: '/admin/trivia',        label: 'Trivia',         end: false },
  { to: '/admin/participantes', label: 'Participantes',  end: false },
]

/** El corte es en `lg` (1024px) y no en `md`: con la barra fija de 240px, una
 *  tablet vertical se quedaba con 528px de ancho y las tablas no entraban. */
function Navegacion({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <nav className="flex flex-col p-3 gap-1">
      {LINKS.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={onNavegar}
          className={({ isActive }) =>
            `font-condensed tracking-[1.5px] uppercase text-sm px-4 py-3 rounded-lg transition-colors
             ${isActive ? 'bg-gold text-black font-bold' : 'text-gold/75 hover:bg-gold/10'}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}

function Pie({ email, onSalir }: { email?: string; onSalir: () => void }) {
  return (
    <div className="mt-auto p-3 border-t border-gold/15">
      {/* La trivia vive fuera del admin (es la pantalla del stand), por eso
          va como enlace aparte y se abre en otra pestaña. */}
      <a
        href="/trivia"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center font-condensed tracking-[1.5px] uppercase text-sm px-4 py-3 mb-2
                   rounded-lg border border-gold/30 text-gold/80 hover:bg-gold/10 transition-colors"
      >
        Abrir trivia ↗
      </a>
      {email && <p className="font-condensed text-gold/40 text-xs px-2 mb-2 truncate">{email}</p>}
      <button
        onClick={onSalir}
        className="w-full font-condensed tracking-[1.5px] uppercase text-sm px-4 py-3 rounded-lg
                   border border-gold/30 text-gold/80 hover:bg-gold/10 transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export function AdminLayout() {
  const { signOut, session } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [cajonAbierto, setCajonAbierto] = useState(false)

  // Cerrar el cajón al cambiar de página y con Escape.
  useEffect(() => { setCajonAbierto(false) }, [pathname])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setCajonAbierto(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // Con el cajón abierto no se scrollea el fondo.
  useEffect(() => {
    document.body.style.overflow = cajonAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cajonAbierto])

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const titulo = LINKS.find(l => (l.end ? pathname === l.to : pathname.startsWith(l.to)))?.label ?? 'Panel'

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">

      {/* ── Barra superior (celular y tablet) ── */}
      <header className="lg:hidden sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-gold/20
                         flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="font-condensed text-gold/45 text-[0.68rem] tracking-[2px] uppercase leading-tight">
            Golden Horses
          </p>
          <h1 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-base truncate">
            {titulo}
          </h1>
        </div>
        <button
          onClick={() => setCajonAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={cajonAbierto}
          className="flex-shrink-0 flex items-center gap-2 border border-gold/30 rounded-lg px-3 h-11
                     text-gold/80 hover:bg-gold/10 transition-colors"
        >
          <span className="flex flex-col gap-[3px]" aria-hidden="true">
            <span className="block w-5 h-[2px] bg-current rounded" />
            <span className="block w-5 h-[2px] bg-current rounded" />
            <span className="block w-5 h-[2px] bg-current rounded" />
          </span>
          <span className="font-condensed text-sm tracking-[1.5px] uppercase">Menú</span>
        </button>
      </header>

      {/* ── Cajón lateral (celular y tablet) ── */}
      {cajonAbierto && (
        <div className="lg:hidden fixed inset-0 z-40 flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setCajonAbierto(false)} />
          <aside className="relative w-[17rem] max-w-[85vw] h-full bg-[#0a0a0a] border-r border-gold/20
                            flex flex-col overflow-y-auto animate__animated animate__fadeInLeft animate__faster">
            <div className="flex items-start justify-between gap-2 px-5 py-4 border-b border-gold/15">
              <div>
                <h2 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-lg">Golden Horses</h2>
                <p className="font-condensed text-gold/50 text-xs tracking-[2px] uppercase">Administración</p>
              </div>
              <button
                onClick={() => setCajonAbierto(false)}
                aria-label="Cerrar menú"
                className="flex-shrink-0 w-11 h-11 -mr-2 -mt-1 flex items-center justify-center
                           text-gold/60 hover:text-gold text-2xl leading-none"
              >✕</button>
            </div>
            <Navegacion onNavegar={() => setCajonAbierto(false)} />
            <Pie email={session?.user.email} onSalir={handleLogout} />
          </aside>
        </div>
      )}

      {/* ── Barra lateral fija (escritorio) ── */}
      <aside className="hidden lg:flex lg:w-60 lg:min-h-screen border-r border-gold/20 flex-col">
        <div className="px-6 py-6 border-b border-gold/15">
          <h1 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-lg">Golden Horses</h1>
          <p className="font-condensed text-gold/50 text-sm tracking-[2px] uppercase">Panel de administración</p>
        </div>
        <Navegacion />
        <Pie email={session?.user.email} onSalir={handleLogout} />
      </aside>

      {/* `min-w-0` es imprescindible: sin él, una tabla ancha estira este flex
          item y desborda toda la página en vez de scrollear dentro de su caja. */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 lg:max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}
