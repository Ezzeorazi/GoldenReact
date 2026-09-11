// Listado de participantes de la trivia: sirve para hacer el sorteo después
// del evento y para bajarse los contactos.

import { useEffect, useMemo, useState } from 'react'
import type { TriviaParticipante } from '../../lib/types'
import {
  fetchParticipantes,
  deleteParticipante,
  descargarCsvParticipantes,
  pendientesEnCola,
  sincronizarPendientes,
} from '../../lib/trivia'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card, Input, Btn, StatusMsg } from './ui'

export function TriviaParticipantes() {
  const [rows, setRows]       = useState<TriviaParticipante[]>([])
  const [cargando, setCargando] = useState(true)
  const [status, setStatus]   = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [soloGanadores, setSoloGanadores] = useState(false)
  const [pendientes, setPendientes] = useState(0)

  const cargar = async () => {
    setCargando(true)
    try {
      setRows(await fetchParticipantes())
      setStatus(null)
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'No se pudieron cargar los participantes' })
    } finally {
      setCargando(false)
      setPendientes(pendientesEnCola())
    }
  }

  useEffect(() => { void cargar() }, [])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return rows.filter(r => {
      if (soloGanadores && !r.gano) return false
      if (!q) return true
      return r.nombre.toLowerCase().includes(q)
        || r.email.toLowerCase().includes(q)
        || r.telefono.toLowerCase().includes(q)
    })
  }, [rows, busqueda, soloGanadores])

  const ganadores  = rows.filter(r => r.gano).length
  const terminados = rows.filter(r => r.finalizado).length

  const borrar = async (r: TriviaParticipante) => {
    if (!confirm(`¿Eliminar el registro de ${r.nombre}? No se puede deshacer.`)) return
    try {
      await deleteParticipante(r.id)
      setRows(prev => prev.filter(x => x.id !== r.id))
      setStatus({ type: 'ok', text: 'Registro eliminado.' })
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'No se pudo eliminar' })
    }
  }

  const sincronizar = async () => {
    const n = await sincronizarPendientes()
    setStatus({ type: 'ok', text: n > 0 ? `Se subieron ${n} registro(s) que estaban pendientes.` : 'No quedaban registros pendientes en este dispositivo.' })
    await cargar()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="hidden lg:block font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Participantes</h2>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => void cargar()} className="flex-1 sm:flex-none">Actualizar</Btn>
          <Btn onClick={() => descargarCsvParticipantes(filtrados)} disabled={filtrados.length === 0} className="flex-1 sm:flex-none">
            Descargar CSV
          </Btn>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado: no hay participantes para mostrar.' }} />
      )}
      <StatusMsg status={status} />

      {pendientes > 0 && (
        <div className="font-condensed text-base px-4 py-3 rounded-lg mb-4 border bg-amber-500/10 border-amber-500/40 text-amber-200
                        flex items-center justify-between gap-4 flex-wrap">
          <span>
            Hay {pendientes} registro(s) guardado(s) en este navegador que no llegaron a subirse (corte de conexión).
          </span>
          <Btn variant="ghost" onClick={() => void sincronizar()}>Subir ahora</Btn>
        </div>
      )}

      {/* ── Resumen ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        {[
          { label: 'Registros',  valor: rows.length },
          { label: 'Terminaron', valor: terminados },
          { label: 'Ganadores',  valor: ganadores },
        ].map(k => (
          <Card key={k.label} className="text-center py-4 px-2 sm:px-6">
            <p className="font-condensed font-bold text-gold text-2xl sm:text-3xl leading-none">{k.valor}</p>
            <p className="font-condensed text-gold/50 text-[0.7rem] sm:text-sm tracking-[0.5px] sm:tracking-[1.5px]
                          uppercase leading-tight mt-1">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div className="flex gap-4 items-center mb-4 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <Input placeholder="Buscar por nombre, email o teléfono" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px] px-1">
          <input
            type="checkbox"
            checked={soloGanadores}
            onChange={e => setSoloGanadores(e.target.checked)}
            className="w-5 h-5 accent-[#A68B67] flex-shrink-0"
          />
          <span className="font-condensed text-gold/75 text-sm tracking-[1.5px] uppercase">Solo ganadores</span>
        </label>
      </div>

      {/* ── Tabla ── */}
      {cargando ? (
        <p className="font-condensed text-gold/60">Cargando…</p>
      ) : filtrados.length === 0 ? (
        <p className="font-condensed text-gold/50 text-base">
          {rows.length === 0 ? 'Todavía no jugó nadie.' : 'Ningún participante coincide con el filtro.'}
        </p>
      ) : (
        <>
          {/* ── Tarjetas (celular): una tabla de 7 columnas en un teléfono
                obliga a scrollear de costado para leer un solo registro. ── */}
          <div className="md:hidden flex flex-col gap-3">
            {filtrados.map(r => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-condensed text-gold/95 text-lg leading-tight break-words">{r.nombre}</p>
                    <p className="font-condensed text-gold/45 text-xs mt-0.5">
                      {new Date(r.created_at).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <button
                    type="button" onClick={() => void borrar(r)} aria-label={`Eliminar a ${r.nombre}`}
                    className="flex-shrink-0 w-11 h-11 -mr-2 -mt-2 flex items-center justify-center
                               text-red-400/60 hover:text-red-400 text-xl"
                  >✕</button>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="font-condensed text-gold/75 text-base break-all underline decoration-gold/25">
                      {r.email}
                    </a>
                  )}
                  {r.telefono && (
                    <a href={`tel:${r.telefono.replace(/\s/g, '')}`} className="font-condensed text-gold/75 text-base underline decoration-gold/25">
                      {r.telefono}
                    </a>
                  )}
                  {!r.email && !r.telefono && <span className="font-condensed text-gold/40 text-base">Sin contacto</span>}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-condensed text-xs tracking-[1.5px] uppercase px-2.5 py-1 rounded
                                    ${r.gano ? 'bg-green-500/15 text-green-300' : 'bg-gold/[0.07] text-gold/50'}`}>
                    {r.gano ? 'Ganó' : 'No ganó'}
                  </span>
                  <span className="font-condensed text-gold/65 text-sm">
                    {r.finalizado ? `${r.aciertos} de ${r.total}` : 'Sin terminar'}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* ── Tabla (tablet y escritorio) ── */}
          <div className="hidden md:block overflow-x-auto border border-gold/15 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-gold/[0.06]">
                  {['Nombre', 'Email', 'Teléfono', 'Aciertos', 'Ganó', 'Fecha', ''].map(h => (
                    <th key={h} className="font-condensed text-gold/60 text-xs tracking-[1.5px] uppercase px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(r => (
                  <tr key={r.id} className="border-t border-gold/10 hover:bg-gold/[0.03] transition-colors">
                    <td className="font-condensed text-gold/95 px-4 py-3">
                      {r.nombre}
                      {!r.finalizado && (
                        <span className="ml-2 text-xs text-amber-300/80 tracking-wide uppercase">sin terminar</span>
                      )}
                    </td>
                    <td className="font-condensed text-gold/75 px-4 py-3 break-all">{r.email || '—'}</td>
                    <td className="font-condensed text-gold/75 px-4 py-3 whitespace-nowrap">{r.telefono || '—'}</td>
                    <td className="font-condensed text-gold/75 px-4 py-3 whitespace-nowrap">
                      {r.finalizado ? `${r.aciertos} / ${r.total}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-condensed text-sm tracking-[1.5px] uppercase px-2.5 py-1 rounded
                                        ${r.gano ? 'bg-green-500/15 text-green-300' : 'text-gold/40'}`}>
                        {r.gano ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="font-condensed text-gold/55 px-4 py-3 whitespace-nowrap text-sm">
                      {new Date(r.created_at).toLocaleString('es-AR')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button" onClick={() => void borrar(r)} aria-label={`Eliminar a ${r.nombre}`}
                        className="w-10 h-10 flex items-center justify-center text-red-400/60 hover:text-red-400 text-lg"
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {filtrados.length > 0 && (
        <p className="font-condensed text-gold/40 text-sm mt-3">
          Mostrando {filtrados.length} de {rows.length}. El CSV descarga lo que estás viendo con el filtro aplicado.
        </p>
      )}
    </div>
  )
}
