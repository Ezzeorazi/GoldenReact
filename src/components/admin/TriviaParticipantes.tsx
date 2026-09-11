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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Participantes</h2>
        <div className="flex gap-2 flex-wrap">
          <Btn variant="ghost" onClick={() => void cargar()}>Actualizar</Btn>
          <Btn onClick={() => descargarCsvParticipantes(filtrados)} disabled={filtrados.length === 0}>Descargar CSV</Btn>
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
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Registros',  valor: rows.length },
          { label: 'Terminaron', valor: terminados },
          { label: 'Ganadores',  valor: ganadores },
        ].map(k => (
          <Card key={k.label} className="text-center py-4">
            <p className="font-condensed font-bold text-gold text-3xl leading-none">{k.valor}</p>
            <p className="font-condensed text-gold/50 text-sm tracking-[1.5px] uppercase mt-1">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div className="flex gap-4 items-center mb-4 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <Input placeholder="Buscar por nombre, email o teléfono" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={soloGanadores}
            onChange={e => setSoloGanadores(e.target.checked)}
            className="w-4 h-4 accent-[#A68B67]"
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
        <div className="overflow-x-auto border border-gold/15 rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[720px]">
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
                      className="text-red-400/60 hover:text-red-400 px-1 text-lg"
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtrados.length > 0 && (
        <p className="font-condensed text-gold/40 text-sm mt-3">
          Mostrando {filtrados.length} de {rows.length}. El CSV descarga lo que estás viendo con el filtro aplicado.
        </p>
      )}
    </div>
  )
}
