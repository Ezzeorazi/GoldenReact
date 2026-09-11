import { useEffect, useState } from 'react'
import { fetchSeccion, saveSeccion } from '../../lib/content'
import type { TriviaData, TriviaPregunta } from '../../lib/types'
import { isSupabaseConfigured } from '../../lib/supabase'
import { videosDistintos } from '../../lib/trivia'
import { Card, Input, Textarea, Btn, Field, StatusMsg } from './ui'

/** Genera un id estable que no choque con los existentes. */
function nuevoId(preguntas: TriviaPregunta[]): string {
  let n = preguntas.length + 1
  const usados = new Set(preguntas.map(p => p.id))
  while (usados.has(`p${String(n).padStart(2, '0')}`)) n++
  return `p${String(n).padStart(2, '0')}`
}

export function TriviaAdmin() {
  const [d, setD] = useState<TriviaData | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => { fetchSeccion('trivia').then(setD) }, [])

  if (!d) return <p className="font-condensed text-gold/60">Cargando…</p>

  const set = <K extends keyof TriviaData>(campo: K, v: TriviaData[K]) => setD({ ...d, [campo]: v })

  const setPreg = (i: number, campo: keyof TriviaPregunta, v: TriviaPregunta[keyof TriviaPregunta]) =>
    setD({ ...d, preguntas: d.preguntas.map((p, idx) => idx === i ? { ...p, [campo]: v } : p) })

  const setOpcion = (i: number, j: number, v: string) =>
    setPreg(i, 'opciones', d.preguntas[i].opciones.map((o, idx) => idx === j ? v : o))

  const addPregunta = () => setD({
    ...d,
    preguntas: [...d.preguntas, {
      id: nuevoId(d.preguntas),
      pregunta: '',
      opciones: ['', '', ''],
      correcta: 0,
      video: '',
      epigrafe: '',
      activa: true,
    }],
  })

  const delPregunta = (i: number) => setD({ ...d, preguntas: d.preguntas.filter((_, idx) => idx !== i) })

  const activas = d.preguntas.filter(p => p.activa && p.pregunta.trim()).length
  // Varias preguntas pueden compartir video, pero el sorteo evita repetirlo
  // dentro de una partida: si hay menos videos distintos que preguntas por
  // partida, no queda otra que repetir alguno.
  const videosOk = videosDistintos(d.preguntas)

  const guardar = async () => {
    // Sin suficientes preguntas activas el juego no puede armar una partida.
    if (activas < d.preguntasPorPartida) {
      setStatus({ type: 'error', text: `Hacen falta al menos ${d.preguntasPorPartida} preguntas activas con enunciado. Ahora hay ${activas}.` })
      return
    }
    const incompleta = d.preguntas.findIndex(p => p.activa && p.opciones.filter(o => o.trim()).length < 2)
    if (incompleta >= 0) {
      setStatus({ type: 'error', text: `La pregunta ${incompleta + 1} está activa pero tiene menos de 2 opciones cargadas.` })
      return
    }

    setGuardando(true)
    try {
      await saveSeccion('trivia', {
        ...d,
        preguntasPorPartida: Math.max(1, d.preguntasPorPartida),
        aciertosParaGanar:   Math.min(Math.max(0, d.aciertosParaGanar), d.preguntasPorPartida),
        preguntas: d.preguntas
          .filter(p => p.pregunta.trim() || p.opciones.some(o => o.trim()))
          .map(p => ({ ...p, opciones: p.opciones.map(o => o.trim()) })),
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
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl">Trivia</h2>
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>

      {!isSupabaseConfigured && (
        <StatusMsg status={{ type: 'error', text: 'Supabase no está configurado: no se pueden guardar cambios.' }} />
      )}
      <StatusMsg status={status} />

      {videosOk > 0 && videosOk < d.preguntasPorPartida && (
        <div className="font-condensed text-base px-4 py-3 rounded-lg mb-4 border
                        bg-amber-500/10 border-amber-500/40 text-amber-200">
          Hay {videosOk} video(s) distinto(s) entre las preguntas activas y la partida usa {d.preguntasPorPartida}.
          El juego evita repetir video en la misma partida, pero con esta configuración va a tener que repetir alguno.
        </div>
      )}

      {/* ── Configuración general ── */}
      <Card className="mb-6">
        <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg mb-4">Pantalla de bienvenida</h3>

        <Field label="Título">
          <Input value={d.heroTitulo} onChange={e => set('heroTitulo', e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <Input value={d.heroSubtitulo} onChange={e => set('heroSubtitulo', e.target.value)} />
        </Field>
        <Field label="Reglas del juego" hint="Se muestra en la primera pantalla, antes de pedir los datos.">
          <Textarea rows={3} value={d.reglas} onChange={e => set('reglas', e.target.value)} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Preguntas por partida" hint={`Hay ${activas} preguntas activas disponibles.`}>
            <Input
              type="number" min={1} max={Math.max(1, d.preguntas.length)}
              value={d.preguntasPorPartida}
              onChange={e => set('preguntasPorPartida', Number(e.target.value) || 1)}
            />
          </Field>
          <Field label="Aciertos para ganar" hint="Mínimo de respuestas correctas para entrar al sorteo.">
            <Input
              type="number" min={0} max={d.preguntasPorPartida}
              value={d.aciertosParaGanar}
              onChange={e => set('aciertosParaGanar', Number(e.target.value) || 0)}
            />
          </Field>
        </div>

        <Field label="Mensaje al ganar">
          <Textarea rows={2} value={d.textoGana} onChange={e => set('textoGana', e.target.value)} />
        </Field>
        <Field label="Mensaje al no alcanzar los aciertos">
          <Textarea rows={2} value={d.textoPierde} onChange={e => set('textoPierde', e.target.value)} />
        </Field>
        <Field label="Texto del checkbox de consentimiento" hint="Es opcional para el participante; queda registrado si lo tildó.">
          <Textarea rows={2} value={d.legalTexto} onChange={e => set('legalTexto', e.target.value)} />
        </Field>
      </Card>

      {/* ── Banco de preguntas ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg">
          Banco de preguntas <span className="text-gold/40">({d.preguntas.length})</span>
        </h3>
        <Btn variant="ghost" onClick={addPregunta}>+ Pregunta</Btn>
      </div>

      <div className="flex flex-col gap-4">
        {d.preguntas.map((p, i) => (
          <Card key={p.id} className={p.activa ? '' : 'opacity-60'}>
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <span className="font-condensed text-gold/50 text-sm tracking-[2px] uppercase">
                Pregunta {i + 1} · {p.id}
              </span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={p.activa}
                    onChange={e => setPreg(i, 'activa', e.target.checked)}
                    className="w-4 h-4 accent-[#A68B67]"
                  />
                  <span className="font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase">Activa</span>
                </label>
                <button
                  type="button" onClick={() => delPregunta(i)} aria-label="Eliminar pregunta"
                  className="text-red-400/70 hover:text-red-400 px-2 text-xl"
                >✕</button>
              </div>
            </div>

            <Field label="Enunciado">
              <Textarea rows={2} value={p.pregunta} onChange={e => setPreg(i, 'pregunta', e.target.value)} />
            </Field>

            <span className="block font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase mb-2">
              Opciones — marcá la correcta
            </span>
            <div className="flex flex-col gap-2 mb-4">
              {p.opciones.map((o, j) => (
                <div key={j} className="flex gap-3 items-center">
                  <input
                    type="radio"
                    name={`correcta-${p.id}`}
                    checked={p.correcta === j}
                    onChange={() => setPreg(i, 'correcta', j)}
                    aria-label={`Marcar opción ${j + 1} como correcta`}
                    className="w-5 h-5 accent-[#A68B67] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Input
                      placeholder={`Opción ${j + 1}`}
                      value={o}
                      onChange={e => setOpcion(i, j, e.target.value)}
                      className={p.correcta === j ? 'border-green-500/50' : ''}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Field label="Ruta del video" hint="El archivo va en public/video/. Varias preguntas pueden usar el mismo video: el juego no repite video dentro de una partida.">
              <Input value={p.video} onChange={e => setPreg(i, 'video', e.target.value)} placeholder="/video/trivia-01.mp4" />
            </Field>
            <Field label="Epígrafe" hint="Texto opcional debajo del video.">
              <Input value={p.epigrafe} onChange={e => setPreg(i, 'epigrafe', e.target.value)} />
            </Field>
          </Card>
        ))}
        {d.preguntas.length === 0 && (
          <p className="font-condensed text-gold/50 text-base">Sin preguntas. Agregá una con “+ Pregunta”.</p>
        )}
      </div>

      <div className="flex justify-end mt-5">
        <Btn onClick={guardar} disabled={guardando || !isSupabaseConfigured}>{guardando ? 'Guardando…' : 'Guardar cambios'}</Btn>
      </div>
    </div>
  )
}
