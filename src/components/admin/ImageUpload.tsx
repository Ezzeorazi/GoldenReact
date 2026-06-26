import { useState } from 'react'
import { uploadImagen } from '../../lib/content'
import { Btn } from './ui'

interface Props {
  value:    string
  onChange: (url: string) => void
  carpeta?: string
  label?:   string
}

/** Campo de imagen: muestra preview, permite subir un archivo o pegar una URL/ruta. */
export function ImageUpload({ value, onChange, carpeta = 'productos', label = 'Imagen' }: Props) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setSubiendo(true)
    try {
      const url = await uploadImagen(file, carpeta)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen')
    } finally {
      setSubiendo(false)
      e.target.value = ''
    }
  }

  return (
    <div className="mb-4">
      <span className="block font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase mb-1.5">{label}</span>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 flex-shrink-0 rounded-lg border border-gold/20 bg-[#f1ede6] overflow-hidden flex items-center justify-center">
          {value
            ? <img src={value} alt="preview" className="w-full h-full object-contain p-2" />
            : <span className="text-black/40 text-xs text-center px-2">Sin imagen</span>}
        </div>
        <div className="flex-1">
          <label className="inline-block cursor-pointer">
            <span className="inline-flex items-center gap-2 font-condensed font-bold tracking-[2px] uppercase text-sm
                             px-5 py-2.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-all">
              {subiendo ? 'Subiendo…' : 'Subir archivo'}
            </span>
            <input type="file" accept="image/*" onChange={handleFile} disabled={subiendo} className="hidden" />
          </label>
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="…o pegá una URL / ruta de imagen"
            className="w-full mt-2 bg-[#111] text-gold/90 font-condensed text-base
                       border border-gold/25 rounded-lg px-3 py-2 outline-none
                       placeholder-gold/40 focus:border-gold/70 transition-colors"
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
      </div>
    </div>
  )
}
