import { useEffect, useState } from 'react'
import { fetchSeccion, saveSeccion } from '../../lib/content'
import type { BeneficiosData, BeneficioItem } from '../../lib/types'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card, Input, Textarea, Btn, Field, StatusMsg } from './ui'
import { ImageUpload } from './ImageUpload'

export function BeneficiosAdmin() {
  const [d, setD] = useState<BeneficiosData | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => { fetchSeccion('beneficios').then(setD) }, [])

  if (!d) return <p className="font-condensed text-gold/60">Cargando…</p>

  const set = <K extends keyof BeneficiosData>(key: K, value: BeneficiosData[K]) => setD({ ...d, [key]: value })

  const setItem = (i: number, campo: keyof BeneficioItem, v: string) =>
    set('items', d.items.map((it, idx) => idx === i ? { ...it, [campo]: v } : it))
  const addItem = () => set('items', [...d.items, { titulo: '', descripcion: '', icono: '' }])
  const delItem = (i: number) => set('items', d.items.filter((_, idx) => idx !== i))

  const guardar = async () => {
    setGuardando(true)
    try {
      await saveSeccion('beneficios', {
        ...d,
        items: d.items.filter(it => it.titulo.trim() || it.descripcion.trim()),
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
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Beneficios</h2>
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
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Lista de beneficios</h3>
        <Btn variant="ghost" onClick={addItem}>+ Beneficio</Btn>
      </div>

      <div className="flex flex-col gap-4">
        {d.items.map((it, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-condensed text-gold/50 text-sm tracking-[2px] uppercase">Beneficio {i + 1}</span>
              <button type="button" onClick={() => delItem(i)} aria-label="Eliminar beneficio" className="text-red-400/70 hover:text-red-400 px-2 text-xl">✕</button>
            </div>
            <ImageUpload value={it.icono} onChange={url => setItem(i, 'icono', url)} carpeta="beneficios" label="Ícono" />
            <Field label="Título"><Input value={it.titulo} onChange={e => setItem(i, 'titulo', e.target.value)} /></Field>
            <Field label="Descripción"><Textarea rows={3} value={it.descripcion} onChange={e => setItem(i, 'descripcion', e.target.value)} /></Field>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>
    </div>
  )
}
