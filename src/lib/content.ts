// Capa de datos: lee productos y secciones desde Supabase con fallback al
// contenido por defecto. Expone tanto funciones (para el admin) como hooks
// (para el sitio público).

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured, BUCKET } from './supabase'
import type {
  Producto,
  ConocenosData,
  BeneficiosData,
  InicioData,
  DestacadoData,
  SeccionClave,
} from './types'
import {
  PRODUCTOS_DEFAULT,
  CONOCENOS_DEFAULT,
  BENEFICIOS_DEFAULT,
  INICIO_DEFAULT,
  DESTACADO_DEFAULT,
} from '../data/defaults'

// ───────────────────────── Productos ─────────────────────────

/** Normaliza una fila de la DB al tipo Producto (rellena nulls). */
function rowToProducto(r: Record<string, unknown>): Producto {
  return {
    id:           String(r.id),
    nombre:       (r.nombre as string) ?? '',
    subtitulo:    (r.subtitulo as string) ?? '',
    tagline:      (r.tagline as string) ?? '',
    descripcion:  (r.descripcion as string) ?? '',
    presentacion: (r.presentacion as string) ?? '',
    imagen:       (r.imagen as string) ?? '',
    ingredientes: (r.ingredientes as string) ?? '',
    composicion:  Array.isArray(r.composicion) ? (r.composicion as Producto['composicion']) : [],
    uso:          (r.uso as string) ?? '',
    beneficios:   Array.isArray(r.beneficios) ? (r.beneficios as string[]) : [],
    orden:        (r.orden as number) ?? 0,
    activo:       (r.activo as boolean) ?? true,
  }
}

/** Lista de productos (solo activos por defecto). */
export async function fetchProductos(soloActivos = true): Promise<Producto[]> {
  if (!supabase) return PRODUCTOS_DEFAULT
  let query = supabase.from('productos').select('*').order('orden', { ascending: true })
  if (soloActivos) query = query.eq('activo', true)
  const { data, error } = await query
  if (error) {
    console.error('[Supabase] fetchProductos:', error.message)
    return PRODUCTOS_DEFAULT
  }
  if (!data || data.length === 0) return PRODUCTOS_DEFAULT
  return data.map(rowToProducto)
}

/** Inserta o actualiza un producto. `id` que empieza con "default-" se trata como nuevo. */
export async function upsertProducto(p: Partial<Producto> & { id?: string }): Promise<void> {
  if (!supabase) throw new Error('Supabase no configurado')
  const { id, ...campos } = p
  const esNuevo = !id || id.startsWith('default-')
  if (esNuevo) {
    const { error } = await supabase.from('productos').insert(campos)
    if (error) throw error
  } else {
    const { error } = await supabase.from('productos').update(campos).eq('id', id)
    if (error) throw error
  }
}

export async function deleteProducto(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw error
}

// ───────────────────────── Secciones ─────────────────────────

const SECCION_DEFAULT = {
  inicio:     INICIO_DEFAULT,
  conocenos:  CONOCENOS_DEFAULT,
  beneficios: BENEFICIOS_DEFAULT,
  destacado:  DESTACADO_DEFAULT,
}

type SeccionData = InicioData | ConocenosData | BeneficiosData | DestacadoData

export async function fetchSeccion(clave: 'inicio'): Promise<InicioData>
export async function fetchSeccion(clave: 'conocenos'): Promise<ConocenosData>
export async function fetchSeccion(clave: 'beneficios'): Promise<BeneficiosData>
export async function fetchSeccion(clave: 'destacado'): Promise<DestacadoData>
export async function fetchSeccion(clave: SeccionClave): Promise<SeccionData> {
  const fallback = SECCION_DEFAULT[clave]
  if (!supabase) return fallback
  const { data, error } = await supabase.from('secciones').select('data').eq('clave', clave).maybeSingle()
  if (error) {
    console.error('[Supabase] fetchSeccion:', error.message)
    return fallback
  }
  if (!data?.data) return fallback
  // Merge con el default para tolerar campos faltantes tras cambios de esquema.
  return { ...fallback, ...(data.data as object) } as SeccionData
}

export async function saveSeccion(clave: SeccionClave, data: SeccionData): Promise<void> {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase
    .from('secciones')
    .upsert({ clave, data, updated_at: new Date().toISOString() }, { onConflict: 'clave' })
  if (error) throw error
}

// ───────────────────────── Storage ─────────────────────────

/** Sube una imagen al bucket y devuelve su URL pública. */
export async function uploadImagen(file: File, carpeta = 'productos'): Promise<string> {
  if (!supabase) throw new Error('Supabase no configurado')
  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ───────────────────────── Hooks ─────────────────────────

interface AsyncState<T> {
  data:    T
  loading: boolean
}

export function useProductos(): AsyncState<Producto[]> & { reload: () => void } {
  const [data, setData] = useState<Producto[]>(PRODUCTOS_DEFAULT)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let activo = true
    if (!isSupabaseConfigured) return
    setLoading(true)
    fetchProductos().then(p => {
      if (activo) { setData(p); setLoading(false) }
    })
    return () => { activo = false }
  }, [tick])

  return { data, loading, reload: () => setTick(t => t + 1) }
}

export function useSeccion(clave: 'inicio'): AsyncState<InicioData>
export function useSeccion(clave: 'conocenos'): AsyncState<ConocenosData>
export function useSeccion(clave: 'beneficios'): AsyncState<BeneficiosData>
export function useSeccion(clave: 'destacado'): AsyncState<DestacadoData>
export function useSeccion(clave: SeccionClave): AsyncState<SeccionData> {
  const [data, setData] = useState<SeccionData>(SECCION_DEFAULT[clave])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    let activo = true
    if (!isSupabaseConfigured) return
    setLoading(true)
    // @ts-expect-error — la sobrecarga se resuelve en runtime por la clave
    fetchSeccion(clave).then(d => {
      if (activo) { setData(d); setLoading(false) }
    })
    return () => { activo = false }
  }, [clave])

  return { data, loading }
}
