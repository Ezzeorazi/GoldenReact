import { useEffect, useState } from 'react'
import { fetchProductos, upsertProducto, deleteProducto } from '../../lib/content'
import type { Producto, ComposicionRow } from '../../lib/types'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card, Input, Textarea, Btn, Field, StatusMsg } from './ui'
import { ImageUpload } from './ImageUpload'

const PRODUCTO_VACIO: Producto = {
  id: '', nombre: '', subtitulo: '', tagline: '', descripcion: '',
  presentacion: '', imagen: '', ingredientes: '', composicion: [],
  uso: '', beneficios: [], orden: 0, activo: true,
}

export function ProductosAdmin() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const recargar = () => {
    setLoading(true)
    fetchProductos(false).then(p => { setProductos(p); setLoading(false) })
  }

  useEffect(() => { recargar() }, [])

  const handleGuardar = async (p: Producto) => {
    try {
      await upsertProducto(p)
      setStatus({ type: 'ok', text: 'Producto guardado correctamente.' })
      setEditando(null)
      recargar()
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' })
    }
  }

  const handleEliminar = async (p: Producto) => {
    if (!confirm(`¿Eliminar el producto "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await deleteProducto(p.id)
      setStatus({ type: 'ok', text: 'Producto eliminado.' })
      recargar()
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'Error al eliminar' })
    }
  }

  if (editando) {
    return (
      <ProductoForm
        inicial={editando}
        onCancel={() => setEditando(null)}
        onSave={handleGuardar}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Productos</h2>
        <Btn onClick={() => setEditando({ ...PRODUCTO_VACIO, orden: productos.length + 1 })}>+ Nuevo producto</Btn>
      </div>

      {!isSupabaseConfigured && (
        <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado: estás viendo datos de ejemplo y no se pueden guardar cambios.' }} />
      )}
      <StatusMsg status={status} />

      {loading
        ? <p className="font-condensed text-gold/60">Cargando…</p>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productos.map(p => (
              <Card key={p.id} className="flex gap-4 items-start">
                <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-[#f1ede6] overflow-hidden flex items-center justify-center">
                  {p.imagen
                    ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-contain p-1.5" />
                    : <span className="text-black/30 text-xs">s/img</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-condensed font-bold text-gold text-xl truncate">{p.nombre}</h3>
                    {!p.activo && <span className="text-xs text-gold/50 border border-gold/30 rounded px-1.5 py-0.5">oculto</span>}
                  </div>
                  <p className="font-condensed text-gold/60 text-sm truncate">{p.subtitulo}</p>
                  <div className="flex gap-2 mt-3">
                    <Btn variant="ghost" onClick={() => setEditando(p)}>Editar</Btn>
                    <Btn variant="danger" onClick={() => handleEliminar(p)}>Eliminar</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  )
}

// ─────────────────────────── Formulario ───────────────────────────

function ProductoForm({
  inicial, onCancel, onSave,
}: {
  inicial: Producto
  onCancel: () => void
  onSave: (p: Producto) => Promise<void>
}) {
  const [p, setP] = useState<Producto>(inicial)
  const [guardando, setGuardando] = useState(false)

  const set = <K extends keyof Producto>(key: K, value: Producto[K]) => setP(prev => ({ ...prev, [key]: value }))

  // ── Composición ──
  const setComp = (i: number, campo: keyof ComposicionRow, valor: string) =>
    set('composicion', p.composicion.map((r, idx) => idx === i ? { ...r, [campo]: valor } : r))
  const addComp = () => set('composicion', [...p.composicion, { label: '', valor: '' }])
  const delComp = (i: number) => set('composicion', p.composicion.filter((_, idx) => idx !== i))

  // ── Beneficios ──
  const setBen = (i: number, valor: string) => set('beneficios', p.beneficios.map((b, idx) => idx === i ? valor : b))
  const addBen = () => set('beneficios', [...p.beneficios, ''])
  const delBen = (i: number) => set('beneficios', p.beneficios.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    // Limpia filas/items vacíos antes de guardar.
    const limpio: Producto = {
      ...p,
      composicion: p.composicion.filter(r => r.label.trim() || r.valor.trim()),
      beneficios:  p.beneficios.filter(b => b.trim()),
    }
    await onSave(limpio)
    setGuardando(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-2xl">
          {inicial.id && !inicial.id.startsWith('default-') ? 'Editar producto' : 'Nuevo producto'}
        </h2>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
          <Btn type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</Btn>
        </div>
      </div>

      <Card className="mb-5">
        <ImageUpload value={p.imagen} onChange={url => set('imagen', url)} carpeta="productos" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Nombre"><Input value={p.nombre} onChange={e => set('nombre', e.target.value)} required /></Field>
          <Field label="Presentación" hint="Ej: Bolsa 25 kg"><Input value={p.presentacion} onChange={e => set('presentacion', e.target.value)} /></Field>
          <Field label="Subtítulo"><Input value={p.subtitulo} onChange={e => set('subtitulo', e.target.value)} /></Field>
          <Field label="Tagline" hint="Frase corta en la ficha"><Input value={p.tagline} onChange={e => set('tagline', e.target.value)} /></Field>
        </div>

        <Field label="Descripción"><Textarea rows={3} value={p.descripcion} onChange={e => set('descripcion', e.target.value)} /></Field>
        <Field label="Ingredientes" hint="Opcional"><Textarea rows={2} value={p.ingredientes} onChange={e => set('ingredientes', e.target.value)} /></Field>
        <Field label="Recomendaciones de uso" hint="Una recomendación por línea"><Textarea rows={4} value={p.uso} onChange={e => set('uso', e.target.value)} /></Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Orden" hint="Menor = aparece primero">
            <Input type="number" value={p.orden} onChange={e => set('orden', Number(e.target.value))} />
          </Field>
          <Field label="Visible en el sitio">
            <label className="flex items-center gap-3 mt-2 cursor-pointer">
              <input type="checkbox" checked={p.activo} onChange={e => set('activo', e.target.checked)} className="w-5 h-5 accent-[#A68B67]" />
              <span className="font-condensed text-gold/85">{p.activo ? 'Sí, visible' : 'No, oculto'}</span>
            </label>
          </Field>
        </div>
      </Card>

      {/* Composición centesimal */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Composición centesimal</h3>
          <Btn variant="ghost" onClick={addComp}>+ Fila</Btn>
        </div>
        {p.composicion.length === 0 && <p className="font-condensed text-gold/50 text-base mb-2">Sin filas. Agregá una con el botón.</p>}
        <div className="flex flex-col gap-2">
          {p.composicion.map((row, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input className="flex-1" placeholder="Nutriente (ej: Prot. Bruta)" value={row.label} onChange={e => setComp(i, 'label', e.target.value)} />
              <Input className="w-32" placeholder="Valor" value={row.valor} onChange={e => setComp(i, 'valor', e.target.value)} />
              <button type="button" onClick={() => delComp(i)} aria-label="Eliminar fila" className="text-red-400/70 hover:text-red-400 px-2 text-xl">✕</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Beneficios del producto */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">Beneficios del producto</h3>
          <Btn variant="ghost" onClick={addBen}>+ Beneficio</Btn>
        </div>
        {p.beneficios.length === 0 && <p className="font-condensed text-gold/50 text-base mb-2">Opcional. Aparecen en la ficha del producto.</p>}
        <div className="flex flex-col gap-2">
          {p.beneficios.map((b, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input className="flex-1" placeholder="Beneficio" value={b} onChange={e => setBen(i, e.target.value)} />
              <button type="button" onClick={() => delBen(i)} aria-label="Eliminar beneficio" className="text-red-400/70 hover:text-red-400 px-2 text-xl">✕</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2 justify-end">
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar producto'}</Btn>
      </div>
    </form>
  )
}
