// Panel para el operador del stand, dentro de la propia página /trivia.
//
// Deja bajar el CSV de contactos sin salir del juego ni entrar a /admin.
// Como /trivia es una URL pública, el panel solo muestra datos si hay sesión
// de Supabase: sin login no se ve ni un contacto. La sesión queda guardada en
// el navegador, así que en la tablet del stand se entra una vez y listo.

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import type { TriviaParticipante } from '../lib/types'
import {
  fetchParticipantes,
  descargarCsvParticipantes,
  deHoy,
  pendientesEnCola,
  sincronizarPendientes,
} from '../lib/trivia'

function Dato({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="text-center bg-gold/[0.06] rounded-xl py-3">
      <p className="font-condensed font-bold text-gold text-2xl leading-none">{valor}</p>
      <p className="font-condensed text-gold/50 text-xs tracking-[1.5px] uppercase mt-1">{label}</p>
    </div>
  )
}

export function TriviaStaff({ onCerrar }: { onCerrar: () => void }) {
  const { session, signIn, signOut } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [error, setError]       = useState('')

  const [rows, setRows]         = useState<TriviaParticipante[]>([])
  const [cargando, setCargando] = useState(false)
  const [aviso, setAviso]       = useState('')
  const [pendientes, setPendientes] = useState(0)

  const cargar = async () => {
    setCargando(true)
    try {
      setRows(await fetchParticipantes())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los participantes')
    } finally {
      setCargando(false)
      setPendientes(pendientesEnCola())
    }
  }

  useEffect(() => {
    if (session) void cargar()
    else setRows([])
    setPendientes(pendientesEnCola())
  }, [session])

  // Cerrar con Escape: en la tablet no hay teclado, pero en una notebook sí.
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCerrar])

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEntrando(true)
    setError('')
    try {
      await signIn(email.trim(), password)
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setEntrando(false)
    }
  }

  const hoy        = deHoy(rows)
  const ganadores  = rows.filter(r => r.gano)
  const ganHoy     = hoy.filter(r => r.gano)
  const ultimo     = rows[0]

  const bajar = (lista: TriviaParticipante[], sufijo: string, etiqueta: string) => {
    if (lista.length === 0) { setAviso(`No hay ${etiqueta} para descargar.`); return }
    descargarCsvParticipantes(lista, sufijo)
    setAviso(`Descargado: ${lista.length} ${etiqueta}.`)
  }

  const sincronizar = async () => {
    const n = await sincronizarPendientes()
    setAviso(n > 0 ? `Se subieron ${n} registro(s) pendientes.` : 'No quedaban registros pendientes.')
    await cargar()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-start justify-center overflow-y-auto p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-md bg-[#0a0a0a] border border-gold/25 rounded-2xl p-5 my-auto
                   animate__animated animate__fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">
            Panel del stand
          </h2>
          <button
            onClick={onCerrar}
            aria-label="Cerrar panel"
            className="text-gold/50 hover:text-gold px-2 text-2xl leading-none"
          >✕</button>
        </div>

        {!isSupabaseConfigured ? (
          <p className="font-condensed text-red-300 text-base">
            Supabase no está configurado en este sitio.
          </p>
        ) : !session ? (
          /* ── Sin sesión: login ── */
          <form onSubmit={entrar}>
            <p className="font-condensed text-gold/60 text-base mb-4">
              Entrá con el mismo usuario del panel de administración para ver y
              descargar los participantes.
            </p>

            <label className="block mb-3">
              <span className="block font-condensed text-gold/70 text-xs tracking-[1.5px] uppercase mb-1.5">Email</span>
              <input
                type="email" inputMode="email" autoComplete="username" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#111] text-gold/95 font-condensed text-lg border border-gold/25
                           rounded-lg px-4 py-2.5 outline-none focus:border-gold/70 transition-colors"
              />
            </label>

            <label className="block mb-4">
              <span className="block font-condensed text-gold/70 text-xs tracking-[1.5px] uppercase mb-1.5">Contraseña</span>
              <input
                type="password" autoComplete="current-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#111] text-gold/95 font-condensed text-lg border border-gold/25
                           rounded-lg px-4 py-2.5 outline-none focus:border-gold/70 transition-colors"
              />
            </label>

            {error && (
              <p className="font-condensed text-red-300 text-sm bg-red-500/10 border border-red-500/40
                            rounded-lg px-3 py-2 mb-3">{error}</p>
            )}

            <button type="submit" disabled={entrando} className="btn-gold w-full py-3 disabled:opacity-50">
              {entrando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        ) : (
          /* ── Con sesión: resumen y descargas ── */
          <>
            {error && (
              <p className="font-condensed text-red-300 text-sm bg-red-500/10 border border-red-500/40
                            rounded-lg px-3 py-2 mb-3">{error}</p>
            )}

            <div className="grid grid-cols-4 gap-2 mb-4">
              <Dato valor={hoy.length}       label="Hoy" />
              <Dato valor={ganHoy.length}    label="Ganan hoy" />
              <Dato valor={rows.length}      label="Total" />
              <Dato valor={ganadores.length} label="Ganadores" />
            </div>

            {ultimo && (
              <p className="font-condensed text-gold/45 text-sm mb-4 text-center">
                Último: {ultimo.nombre} · {new Date(ultimo.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}

            {pendientes > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg px-3 py-3 mb-4">
                <p className="font-condensed text-amber-200 text-sm mb-2">
                  {pendientes} registro(s) guardado(s) en esta tablet sin subir (se cortó la conexión).
                </p>
                <button onClick={() => void sincronizar()} className="btn-ghost w-full py-2">
                  Subir ahora
                </button>
              </div>
            )}

            <p className="font-condensed text-gold/70 text-xs tracking-[1.5px] uppercase mb-2">
              Descargar CSV
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <button onClick={() => bajar(hoy, 'hoy', 'registros de hoy')}
                      className="btn-gold w-full py-3">
                Los de hoy ({hoy.length})
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => bajar(rows, '', 'registros')} className="btn-ghost py-2.5">
                  Todos ({rows.length})
                </button>
                <button onClick={() => bajar(ganadores, 'ganadores', 'ganadores')} className="btn-ghost py-2.5">
                  Ganadores ({ganadores.length})
                </button>
              </div>
            </div>

            {aviso && (
              <p className="font-condensed text-green-300 text-sm bg-green-500/10 border border-green-500/40
                            rounded-lg px-3 py-2 mb-3">{aviso}</p>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gold/15">
              <button onClick={() => void cargar()} disabled={cargando}
                      className="font-condensed text-gold/70 hover:text-gold text-sm tracking-[1.5px] uppercase disabled:opacity-50">
                {cargando ? 'Actualizando…' : 'Actualizar'}
              </button>
              <button onClick={() => void signOut()}
                      className="font-condensed text-gold/40 hover:text-gold/70 text-sm tracking-[1.5px] uppercase">
                Cerrar sesión
              </button>
            </div>
            <p className="font-condensed text-gold/30 text-xs mt-2 truncate">{session.user.email}</p>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
