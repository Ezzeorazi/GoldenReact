// Lógica de la trivia de eventos, aislada del componente:
// sorteo de preguntas, alta/cierre del participante y export para el admin.
//
// El público juega sin loguearse, así que nunca toca la tabla directamente:
// todo pasa por los RPC `security definer` definidos en supabase/schema.sql.

import { supabase, isSupabaseConfigured } from './supabase'
import type { TriviaPregunta, TriviaParticipante, TriviaRespuesta } from './types'

// ───────────────────── Sorteo de preguntas ─────────────────────

/** Fisher-Yates sobre una copia (no muta el array original). */
function barajar<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

/** Preguntas jugables: activas, con enunciado y con opciones cargadas. */
function activas(preguntas: TriviaPregunta[]): TriviaPregunta[] {
  return preguntas.filter(p => p.activa && p.pregunta.trim() && p.opciones.length > 0)
}

/** Cuántos videos distintos hay entre las preguntas jugables. */
export function videosDistintos(preguntas: TriviaPregunta[]): number {
  return new Set(activas(preguntas).map(p => p.video.trim()).filter(Boolean)).size
}

/**
 * Elige `n` preguntas activas al azar, **sin repetir video dentro de la misma
 * partida**: varias preguntas pueden compartir el mismo archivo, y no tiene
 * sentido mostrarle dos veces el mismo video al participante.
 *
 * También baraja las opciones de cada pregunta recalculando el índice correcto,
 * para que la respuesta buena no quede siempre en la misma posición.
 */
export function elegirPreguntas(preguntas: TriviaPregunta[], n: number): TriviaPregunta[] {
  const pool    = activas(preguntas)
  const cupo    = Math.max(1, n)
  const elegidas: TriviaPregunta[] = []
  const usadas  = new Set<TriviaPregunta>()
  const videos  = new Set<string>()

  // Primera pasada: una pregunta por video. Las que no tienen video cargado no
  // compiten entre sí (no hay nada que repetir).
  for (const p of barajar(pool)) {
    if (elegidas.length >= cupo) break
    const video = p.video.trim()
    if (video && videos.has(video)) continue
    elegidas.push(p)
    usadas.add(p)
    if (video) videos.add(video)
  }

  // Segunda pasada: si no hay tantos videos distintos como preguntas por
  // partida, se completa igual antes que dejar la partida corta.
  if (elegidas.length < cupo) {
    for (const p of barajar(pool)) {
      if (elegidas.length >= cupo) break
      if (usadas.has(p)) continue
      elegidas.push(p)
      usadas.add(p)
    }
  }

  return elegidas.map(p => {
    const correctaTexto = p.opciones[p.correcta]
    const opciones      = barajar(p.opciones)
    const correcta      = opciones.indexOf(correctaTexto)
    return { ...p, opciones, correcta: correcta >= 0 ? correcta : 0 }
  })
}

// ───────────────────── Cola offline ─────────────────────
// El wifi de un evento se cae. Si el alta falla, el contacto se guarda acá y
// se reintenta al abrir la página; sin esto perderíamos leads en silencio.

const COLA_KEY = 'trivia_pendientes'

interface Pendiente {
  nombre:         string
  email:          string
  telefono:       string
  consentimiento: boolean
  aciertos:       number
  total:          number
  gano:           boolean
  finalizado:     boolean
  respuestas:     TriviaRespuesta[]
}

function leerCola(): Pendiente[] {
  try {
    const raw = localStorage.getItem(COLA_KEY)
    return raw ? (JSON.parse(raw) as Pendiente[]) : []
  } catch {
    return []
  }
}

function escribirCola(items: Pendiente[]): void {
  try {
    localStorage.setItem(COLA_KEY, JSON.stringify(items))
  } catch {
    /* modo privado o storage lleno: no hay nada mejor que hacer */
  }
}

function encolar(p: Pendiente): void {
  escribirCola([...leerCola(), p])
}

/** Cantidad de registros esperando sincronizar (se muestra en el admin). */
export function pendientesEnCola(): number {
  return leerCola().length
}

/** Reintenta subir los registros que quedaron guardados en el navegador. */
export async function sincronizarPendientes(): Promise<number> {
  if (!supabase) return 0
  const cola = leerCola()
  if (cola.length === 0) return 0

  const quedan: Pendiente[] = []
  let subidos = 0

  for (const p of cola) {
    try {
      const { data, error } = await supabase.rpc('trivia_registrar', {
        p_nombre:         p.nombre,
        p_email:          p.email,
        p_telefono:       p.telefono,
        p_consentimiento: p.consentimiento,
      })
      if (error || !data) throw error ?? new Error('sin id')

      if (p.finalizado) {
        await supabase.rpc('trivia_finalizar', {
          p_id:         data as string,
          p_aciertos:   p.aciertos,
          p_total:      p.total,
          p_gano:       p.gano,
          p_respuestas: p.respuestas,
        })
      }
      subidos++
    } catch {
      quedan.push(p)
    }
  }

  escribirCola(quedan)
  return subidos
}

// ───────────────────── Partida ─────────────────────

export interface DatosParticipante {
  nombre:         string
  email:          string
  telefono:       string
  consentimiento: boolean
}

/** `true` si el mail o el teléfono ya figuran en la base. Ante duda, `false`. */
export async function contactoYaJugo(email: string, telefono: string): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('trivia_existe_contacto', {
    p_email:    email.trim(),
    p_telefono: telefono.trim(),
  })
  if (error) {
    console.error('[Trivia] contactoYaJugo:', error.message)
    return false
  }
  return Boolean(data)
}

/**
 * Da de alta al participante apenas completa el formulario, para no perder el
 * contacto si abandona a mitad de partida. Devuelve el id de la partida, o
 * `null` si no se pudo guardar (queda encolado y la partida sigue igual).
 */
export async function registrarParticipante(d: DatosParticipante): Promise<string | null> {
  const pendiente: Pendiente = {
    ...d, aciertos: 0, total: 0, gano: false, finalizado: false, respuestas: [],
  }

  if (!supabase) {
    // Sin Supabase configurado no hay a dónde subirlo; encolar sería basura.
    if (isSupabaseConfigured) encolar(pendiente)
    return null
  }

  const { data, error } = await supabase.rpc('trivia_registrar', {
    p_nombre:         d.nombre.trim(),
    p_email:          d.email.trim(),
    p_telefono:       d.telefono.trim(),
    p_consentimiento: d.consentimiento,
  })

  if (error || !data) {
    console.error('[Trivia] registrarParticipante:', error?.message)
    encolar(pendiente)
    return null
  }
  return data as string
}

/**
 * Cierra la partida con el resultado. Si el alta inicial había fallado
 * (`id === null`), se encola el registro completo para subirlo después.
 */
export async function finalizarPartida(
  id: string | null,
  datos: DatosParticipante,
  aciertos: number,
  total: number,
  gano: boolean,
  respuestas: TriviaRespuesta[],
): Promise<void> {
  if (!id) {
    // El alta no llegó a la base: reemplazamos el pendiente incompleto por el
    // registro completo, así el mismo contacto no queda duplicado en la cola.
    const cola = leerCola()
    const i = cola.findIndex(p =>
      !p.finalizado && p.nombre === datos.nombre && p.email === datos.email && p.telefono === datos.telefono)
    const completo: Pendiente = { ...datos, aciertos, total, gano, finalizado: true, respuestas }
    if (i >= 0) cola[i] = completo
    else if (isSupabaseConfigured) cola.push(completo)
    escribirCola(cola)
    return
  }

  if (!supabase) return

  const { error } = await supabase.rpc('trivia_finalizar', {
    p_id:         id,
    p_aciertos:   aciertos,
    p_total:      total,
    p_gano:       gano,
    p_respuestas: respuestas,
  })
  if (error) console.error('[Trivia] finalizarPartida:', error.message)
}

// ───────────────────── Admin ─────────────────────

export async function fetchParticipantes(): Promise<TriviaParticipante[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('trivia_participantes')
    .select('id, nombre, email, telefono, consentimiento, aciertos, total, gano, finalizado, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[Trivia] fetchParticipantes:', error.message)
    throw error
  }
  return (data ?? []) as TriviaParticipante[]
}

export async function deleteParticipante(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('trivia_participantes').delete().eq('id', id)
  if (error) throw error
}

/** Escapa un valor para CSV (comillas dobles, punto y coma, saltos de línea). */
function celda(v: string | number | boolean): string {
  const s = String(v)
  return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

/** CSV separado por `;`, que es lo que espera Excel en español. */
export function participantesToCsv(rows: TriviaParticipante[]): string {
  const head = ['Nombre', 'Email', 'Teléfono', 'Aciertos', 'Total', 'Ganó', 'Finalizó', 'Consentimiento', 'Fecha']
  const body = rows.map(r => [
    celda(r.nombre),
    celda(r.email),
    celda(r.telefono),
    celda(r.aciertos),
    celda(r.total),
    celda(r.gano ? 'Sí' : 'No'),
    celda(r.finalizado ? 'Sí' : 'No'),
    celda(r.consentimiento ? 'Sí' : 'No'),
    celda(new Date(r.created_at).toLocaleString('es-AR')),
  ].join(';'))
  return [head.join(';'), ...body].join('\r\n')
}

/** Fecha local en formato AAAA-MM-DD, para comparar días y nombrar archivos. */
export function diaLocal(fecha: Date | string = new Date()): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Participantes registrados hoy (hora local del dispositivo del stand). */
export function deHoy(rows: TriviaParticipante[]): TriviaParticipante[] {
  const hoy = diaLocal()
  return rows.filter(r => diaLocal(r.created_at) === hoy)
}

/**
 * Dispara la descarga del CSV. El BOM inicial hace que Excel lo abra como
 * UTF-8 y no rompa los acentos.
 */
export function descargarCsvParticipantes(rows: TriviaParticipante[], sufijo = ''): void {
  const blob = new Blob(['﻿' + participantesToCsv(rows)], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `trivia-participantes${sufijo ? '-' + sufijo : ''}-${diaLocal()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
