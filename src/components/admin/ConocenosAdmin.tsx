import { useEffect, useState } from 'react'
import { fetchSeccion, saveSeccion } from '../../lib/content'
import type { ConocenosData, Hito } from '../../lib/types'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card, Input, Textarea, Btn, Field, StatusMsg } from './ui'

export function ConocenosAdmin() {
  const [d, setD] = useState<ConocenosData | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => { fetchSeccion('conocenos').then(setD) }, [])

  if (!d) return <p className="font-condensed text-gold/60">Cargando…</p>

  const set = <K extends keyof ConocenosData>(key: K, value: ConocenosData[K]) => setD({ ...d, [key]: value })

  const setParr = (i: number, v: string) => set('parrafos', d.parrafos.map((p, idx) => idx === i ? v : p))
  const addParr = () => set('parrafos', [...d.parrafos, ''])
  const delParr = (i: number) => set('parrafos', d.parrafos.filter((_, idx) => idx !== i))

  const setHito = (i: number, campo: keyof Hito, v: string) =>
    set('hitos', d.hitos.map((h, idx) => idx === i ? { ...h, [campo]: v } : h))
  const addHito = () => set('hitos', [...d.hitos, { year: '', titulo: '', desc: '' }])
  const delHito = (i: number) => set('hitos', d.hitos.filter((_, idx) => idx !== i))

  const guardar = async () => {
    setGuardando(true)
    try {
      await saveSeccion('conocenos', {
        ...d,
        parrafos: d.parrafos.filter(p => p.trim()),
        hitos:    d.hitos.filter(h => h.titulo.trim() || h.desc.trim() || h.year.trim()),
      })
      setStatus({ type: 'ok', text: 'Cambios guardados.' })
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Quiénes somos</h2>
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>

      {!isSupabaseConfigured && (
        <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado: no se pueden guardar cambios.' }} />
      )}
      <StatusMsg status={status} />

      <Card className="mb-5">
        <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg mb-4">Encabezado</h3>
        <Field label="Título del hero"><Input value={d.heroTitulo} onChange={e => set('heroTitulo', e.target.value)} /></Field>
        <Field label="Subtítulo del hero"><Input value={d.heroSubtitulo} onChange={e => set('heroSubtitulo', e.target.value)} /></Field>
        <Field label="Título de la historia"><Input value={d.histTitulo} onChange={e => set('histTitulo', e.target.value)} /></Field>
      </Card>

      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Párrafos de la historia</h3>
          <Btn variant="ghost" onClick={addParr}>+ Párrafo</Btn>
        </div>
        <div className="flex flex-col gap-3">
          {d.parrafos.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Textarea className="flex-1" rows={3} value={p} onChange={e => setParr(i, e.target.value)} />
              <button type="button" onClick={() => delParr(i)} aria-label="Eliminar párrafo" className="text-red-400/70 hover:text-red-400 px-2 text-xl mt-2">✕</button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Hitos (línea de tiempo)</h3>
          <Btn variant="ghost" onClick={addHito}>+ Hito</Btn>
        </div>
        <div className="flex flex-col gap-4">
          {d.hitos.map((h, i) => (
            <div key={i} className="border border-gold/15 rounded-xl p-4">
              <div className="flex gap-2 mb-2">
                <Input className="w-28" placeholder="Año" value={h.year} onChange={e => setHito(i, 'year', e.target.value)} />
                <Input className="flex-1" placeholder="Título" value={h.titulo} onChange={e => setHito(i, 'titulo', e.target.value)} />
                <button type="button" onClick={() => delHito(i)} aria-label="Eliminar hito" className="text-red-400/70 hover:text-red-400 px-2 text-xl">✕</button>
              </div>
              <Textarea rows={2} placeholder="Descripción" value={h.desc} onChange={e => setHito(i, 'desc', e.target.value)} />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>
    </div>
  )
}
