import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * `true` cuando las variables de entorno están presentes.
 * Si es `false`, el sitio sigue funcionando con el contenido por defecto
 * (ver src/data/defaults.ts) y el panel /admin muestra un aviso de configuración.
 */
export const isSupabaseConfigured = Boolean(url && anon)

/**
 * Cliente de Supabase. Es `null` mientras no estén configuradas las env vars,
 * por eso siempre conviene chequear `isSupabaseConfigured` antes de usarlo.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anon as string)
  : null

/** Nombre del bucket de Storage para imágenes (productos, íconos). */
export const BUCKET = 'media'
