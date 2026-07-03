import { useEffect, useState } from 'react'
import { fetchSeccion, saveSeccion } from '../../lib/content'
import type { DestacadoData, DestacadoItem } from '../../lib/types'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card, Input, Btn, Field, StatusMsg } from './ui'
import { ImageUpload } from './ImageUpload'

export function DestacadoAdmin() {
  const [d, setD] = useState<DestacadoData | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => { fetchSeccion('destacado').then(setD) }, [])

  if (!d) return <p className="font-condensed text-gold/60">Cargando…</p>

  const setItem = (i: number, campo: keyof DestacadoItem, v: DestacadoItem[keyof DestacadoItem]) =>
    setD({ ...d, items: d.items.map((it, idx) => idx === i ? { ...it, [campo]: v } : it) })
  const addItem = () => setD({ ...d, items: [...d.items, { titulo: '', imagen: '', imagenAlt: '', puntos: [''] }] })
  const delItem = (i: number) => setD({ ...d, items: d.items.filter((_, idx) => idx !== i) })

  const setPunto = (i: number, j: number, v: string) =>
    setItem(i, 'puntos', d.items[i].puntos.map((p, idx) => idx === j ? v : p))
  const addPunto = (i: number) => setItem(i, 'puntos', [...d.items[i].puntos, ''])
  const delPunto = (i: number, j: number) => setItem(i, 'puntos', d.items[i].puntos.filter((_, idx) => idx !== j))

  const guardar = async () => {
    setGuardando(true)
    try {
      await saveSeccion('destacado', {
        items: d.items
          .filter(it => it.titulo.trim() || it.imagen.trim() || it.puntos.some(p => p.trim()))
          .map(it => ({ ...it, puntos: it.puntos.filter(p => p.trim()) })),
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
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Sección destacada</h2>
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>

      {!isSupabaseConfigured && (
        <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado: no se pueden guardar cambios.' }} />
      )}
      <StatusMsg status={status} />

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Productos destacados</h3>
        <Btn variant="ghost" onClick={addItem}>+ Producto</Btn>
      </div>

      <div className="flex flex-col gap-4">
        {d.items.map((it, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-condensed text-gold/50 text-sm tracking-[2px] uppercase">Producto {i + 1}</span>
              <button type="button" onClick={() => delItem(i)} aria-label="Eliminar producto" className="text-red-400/70 hover:text-red-400 px-2 text-xl">✕</button>
            </div>

            <ImageUpload value={it.imagen} onChange={url => setItem(i, 'imagen', url)} carpeta="destacado" label="Imagen" />
            <Field label="Texto alternativo de la imagen" hint="Describe la imagen para accesibilidad y SEO.">
              <Input value={it.imagenAlt} onChange={e => setItem(i, 'imagenAlt', e.target.value)} />
            </Field>
            <Field label="Título">
              <Input value={it.titulo} onChange={e => setItem(i, 'titulo', e.target.value)} />
            </Field>

            <div className="flex items-center justify-between mt-2 mb-2">
              <span className="font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase">Puntos (con tilde)</span>
              <Btn variant="ghost" onClick={() => addPunto(i)}>+ Punto</Btn>
            </div>
            <div className="flex flex-col gap-2">
              {it.puntos.map((p, j) => (
                <div key={j} className="flex gap-2 items-center">
                  <div className="flex-1 min-w-0">
                    <Input placeholder={`Punto ${j + 1}`} value={p} onChange={e => setPunto(i, j, e.target.value)} />
                  </div>
                  <button type="button" onClick={() => delPunto(i, j)} aria-label="Eliminar punto" className="text-red-400/70 hover:text-red-400 px-2 text-xl">✕</button>
                </div>
              ))}
              {it.puntos.length === 0 && <p className="font-condensed text-gold/50 text-base">Sin puntos. Agregá uno con el botón.</p>}
            </div>
          </Card>
        ))}
        {d.items.length === 0 && <p className="font-condensed text-gold/50 text-base">Sin productos. Agregá uno con “+ Producto”.</p>}
      </div>

      <div className="flex justify-end mt-5">
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>
    </div>
  )
}
