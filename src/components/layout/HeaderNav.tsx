import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',                label: 'Inicio' },
  { to: '/conocenos',       label: 'Quiénes somos' },
  { to: '/productos',       label: 'Productos' },
  { to: '/beneficios',      label: 'Beneficios' },
  { to: '/infoNutricional', label: 'Info Nutricional' },
  { to: '#footer',          label: 'Contacto' },
]

export function HeaderNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/55 backdrop-blur-md border-b border-gold/20 h-[100px] flex items-center px-5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)]">
        {/* Logo */}
        <NavLink to="/" className="flex-1">
          <img src="/image/logo.webp" alt="Golden Horses" className="h-20 md:h-24 w-auto" />
        </NavLink>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex flex-col gap-[6px] p-2.5 border border-gold/35 rounded-sm
                     hover:border-gold/70 transition-colors duration-200"
        >
          <span className="block w-7 h-[1.5px] bg-gold" />
          <span className="block w-7 h-[1.5px] bg-gold" />
          <span className="block w-5 h-[1.5px] bg-gold" />
        </button>
      </nav>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[60]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel offcanvas */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white z-[70]
                    transform transition-transform duration-300
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200">
          <span className="font-condensed text-gray-800 font-semibold tracking-widest uppercase text-sm">
            Menú
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-6 py-4 font-condensed text-xl tracking-wider border-b border-gray-100
                 transition-colors
                 ${isActive
                   ? 'text-[#A68B67] bg-amber-50'
                   : 'text-gray-700 hover:text-[#A68B67] hover:bg-amber-50'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
