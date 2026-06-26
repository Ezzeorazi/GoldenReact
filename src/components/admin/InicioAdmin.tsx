import { useEffect, useState } from 'react'
import { fetchSeccion, saveSeccion } from '../../lib/content'
import type { InicioData, Slide } from '../../lib/types'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card, Input, Textarea, Btn, Field, Select, StatusMsg } from './ui'
import { ImageUpload } from './ImageUpload'

const SLIDE_VACIO: Slide = {
  desktop: '', mobile: '', alt: '',
  titulo: '', frase: '',
  ctaTexto: 'Ver productos', ctaLink: '/productos',
  waTexto: 'Consultar por WhatsApp', waMensaje: 'Hola! Quiero más información sobre Golden Horses.',
  posV: 'centro', posH: 'centro', tamMovil: 'md', tamDesktop: 'lg',
}

const OPC_POS_V = [
  { value: 'arriba', label: 'Arriba' },
  { value: 'centro', label: 'Centro' },
  { value: 'abajo',  label: 'Abajo' },
]
const OPC_POS_H = [
  { value: 'izquierda', label: 'Izquierda' },
  { value: 'centro',    label: 'Centro' },
  { value: 'derecha',   label: 'Derecha' },
]
const OPC_TAM = [
  { value: 'sm', label: 'Chico' },
  { value: 'md', label: 'Mediano' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Extra grande' },
]

export function InicioAdmin() {
  const [d, setD] = useState<InicioData | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSeccion('inicio').then(data =>
      // Completa campos nuevos en slides guardados antes de esta versión.
      setD({ ...data, slides: data.slides.map(s => ({ ...SLIDE_VACIO, ...s })) }),
    )
  }, [])

  if (!d) return <p className="font-condensed text-gold/60">Cargando…</p>

  const setSlide = (i: number, campo: keyof Slide, v: string) =>
    setD({ ...d, slides: d.slides.map((s, idx) => idx === i ? { ...s, [campo]: v } : s) })
  const addSlide = () => setD({ ...d, slides: [...d.slides, { ...SLIDE_VACIO }] })
  const delSlide = (i: number) => setD({ ...d, slides: d.slides.filter((_, idx) => idx !== i) })
  const moverSlide = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= d.slides.length) return
    const arr = [...d.slides]
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setD({ ...d, slides: arr })
  }

  const guardar = async () => {
    setGuardando(true)
    try {
      await saveSeccion('inicio', {
        ...d,
        slides: d.slides.filter(s => s.desktop || s.mobile || s.titulo || s.frase),
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
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Banner de inicio</h2>
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>
      <p className="font-condensed text-gold/60 text-base mb-6">
        Cada slide del carrusel principal. Podés editar la imagen, el título, la frase y los botones.
      </p>

      {!isSupabaseConfigured && (
        <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado: no se pueden guardar cambios.' }} />
      )}
      <StatusMsg status={status} />

      <Card className="mb-6">
        <Field label="Número de WhatsApp" hint="Solo dígitos, con código de país. Ej: 5493471621535. Se usa en el botón de WhatsApp de todos los slides.">
          <Input value={d.waNumero} onChange={e => setD({ ...d, waNumero: e.target.value })} />
        </Field>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Slides</h3>
        <Btn variant="ghost" onClick={addSlide}>+ Slide</Btn>
      </div>

      <div className="flex flex-col gap-5">
        {d.slides.map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-condensed text-gold/50 text-sm tracking-[2px] uppercase">Slide {i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moverSlide(i, -1)} disabled={i === 0}
                  className="text-gold/70 hover:text-gold disabled:opacity-30 px-2 text-lg" aria-label="Subir">↑</button>
                <button type="button" onClick={() => moverSlide(i, 1)} disabled={i === d.slides.length - 1}
                  className="text-gold/70 hover:text-gold disabled:opacity-30 px-2 text-lg" aria-label="Bajar">↓</button>
                <button type="button" onClick={() => delSlide(i)}
                  className="text-red-400/70 hover:text-red-400 px-2 text-xl" aria-label="Eliminar slide">✕</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <ImageUpload value={s.desktop} onChange={url => setSlide(i, 'desktop', url)} carpeta="banner" label="Imagen escritorio (horizontal)" />
              <ImageUpload value={s.mobile} onChange={url => setSlide(i, 'mobile', url)} carpeta="banner" label="Imagen celular (vertical)" />
            </div>

            <Field label="Texto alternativo" hint="Describe la imagen (accesibilidad). Ej: Caballo alimentándose en el campo.">
              <Input value={s.alt} onChange={e => setSlide(i, 'alt', e.target.value)} />
            </Field>

            <div className="border-t border-gold/10 my-4" />

            <Field label="Título (H1)" hint="Texto grande sobre la imagen. Dejalo vacío si no querés mostrar título.">
              <Input value={s.titulo} onChange={e => setSlide(i, 'titulo', e.target.value)} />
            </Field>
            <Field label="Frase disparadora" hint="Frase corta debajo del título.">
              <Textarea rows={2} value={s.frase} onChange={e => setSlide(i, 'frase', e.target.value)} />
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
              <Field label="Posición vertical">
                <Select options={OPC_POS_V} value={s.posV} onChange={e => setSlide(i, 'posV', e.target.value)} />
              </Field>
              <Field label="Posición horizontal">
                <Select options={OPC_POS_H} value={s.posH} onChange={e => setSlide(i, 'posH', e.target.value)} />
              </Field>
              <Field label="Tamaño en celular">
                <Select options={OPC_TAM} value={s.tamMovil} onChange={e => setSlide(i, 'tamMovil', e.target.value)} />
              </Field>
              <Field label="Tamaño en escritorio">
                <Select options={OPC_TAM} value={s.tamDesktop} onChange={e => setSlide(i, 'tamDesktop', e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Field label="Texto del botón CTA" hint="Vacío = no se muestra el botón.">
                <Input value={s.ctaTexto} onChange={e => setSlide(i, 'ctaTexto', e.target.value)} />
              </Field>
              <Field label="Destino del CTA" hint="Ruta interna (/productos, /conocenos) o un enlace (https://…).">
                <Input value={s.ctaLink} onChange={e => setSlide(i, 'ctaLink', e.target.value)} />
              </Field>
              <Field label="Texto del botón WhatsApp" hint="Vacío = no se muestra el botón.">
                <Input value={s.waTexto} onChange={e => setSlide(i, 'waTexto', e.target.value)} />
              </Field>
              <Field label="Mensaje de WhatsApp" hint="Lo que aparece escrito al abrir el chat.">
                <Input value={s.waMensaje} onChange={e => setSlide(i, 'waMensaje', e.target.value)} />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>
    </div>
  )
}
