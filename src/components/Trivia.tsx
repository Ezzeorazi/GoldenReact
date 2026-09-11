// Trivia de eventos — pantalla tipo kiosco para la tablet del stand.
// Va fuera de PublicLayout (sin header ni footer) para que nadie se vaya
// navegando el sitio a mitad de partida.
//
// Fases: intro → datos → (pregunta → video) ×N → resultado → intro (reset)

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSeccion } from '../lib/content'
import { Seo } from '../lib/seo'
import {
  elegirPreguntas,
  registrarParticipante,
  finalizarPartida,
  contactoYaJugo,
  sincronizarPendientes,
  type DatosParticipante,
} from '../lib/trivia'
import type { TriviaPregunta, TriviaRespuesta } from '../lib/types'

type Fase = 'intro' | 'datos' | 'pregunta' | 'video' | 'resultado'

const DATOS_VACIOS: DatosParticipante = { nombre: '', email: '', telefono: '', consentimiento: false }

/**
 * Marco común: fondo negro con el logo arriba.
 *
 * `ajustado` fija la altura a la pantalla y no deja scroll, para que el hijo
 * reparta el alto sobrante con flex. Lo usa la fase de video: los videos son
 * verticales y, con una altura fija en `vh`, en tablet horizontal el botón de
 * avanzar quedaba debajo del pliegue.
 *
 * Se usa `dvh` en vez de `vh` porque en móvil la barra del navegador entra y
 * sale, y `vh` no la contempla.
 */
function Pantalla({ children, ajustado = false }: { children: ReactNode; ajustado?: boolean }) {
  return (
    <div
      className={`bg-black flex flex-col items-center px-5
                  ${ajustado ? 'h-[100dvh] overflow-hidden py-4' : 'min-h-[100dvh] py-8'}`}
    >
      <img
        src="/image/logo.webp"
        alt="Golden Horses"
        className={`object-contain flex-shrink-0 ${ajustado ? 'h-12 mb-3' : 'h-16 md:h-20 mb-8'}`}
      />
      <div className={`w-full max-w-2xl flex flex-col min-h-0 ${ajustado ? 'flex-1' : 'flex-1 justify-center'}`}>
        {children}
      </div>
    </div>
  )
}

export function Trivia() {
  const { data } = useSeccion('trivia')

  const [fase, setFase]     = useState<Fase>('intro')
  const [datos, setDatos]   = useState<DatosParticipante>(DATOS_VACIOS)
  const [partidaId, setPartidaId] = useState<string | null>(null)

  const [preguntas, setPreguntas]   = useState<TriviaPregunta[]>([])
  const [indice, setIndice]         = useState(0)
  const [elegida, setElegida]       = useState<number | null>(null)
  const [respuestas, setRespuestas] = useState<TriviaRespuesta[]>([])

  const [videoRoto, setVideoRoto]   = useState(false)
  const [errorForm, setErrorForm]   = useState('')
  const [avisoDup, setAvisoDup]     = useState(false)
  const [enviando, setEnviando]     = useState(false)

  const nombreRef = useRef<HTMLInputElement>(null)

  // Al abrir la página, reintenta subir lo que haya quedado de un corte de red.
  useEffect(() => { void sincronizarPendientes() }, [])

  useEffect(() => {
    if (fase === 'datos') nombreRef.current?.focus()
  }, [fase])

  const aciertos = respuestas.filter(r => r.correcta).length
  const gano     = aciertos >= data.aciertosParaGanar
  const actual   = preguntas[indice]
  const esUltima = indice >= preguntas.length - 1

  const disponibles = useMemo(
    () => data.preguntas.filter(p => p.activa && p.pregunta.trim()).length,
    [data.preguntas],
  )

  // ── Acciones ──

  const reiniciar = () => {
    setFase('intro')
    setDatos(DATOS_VACIOS)
    setPartidaId(null)
    setPreguntas([])
    setIndice(0)
    setElegida(null)
    setRespuestas([])
    setVideoRoto(false)
    setErrorForm('')
    setAvisoDup(false)
  }

  /** Editar un campo limpia los avisos: no queremos que el operador vea el
   *  cartel de duplicado mientras corrige el dato que lo disparó. */
  const cambiar = <K extends keyof DatosParticipante>(campo: K, v: DatosParticipante[K]) => {
    setDatos(d => ({ ...d, [campo]: v }))
    if (avisoDup) setAvisoDup(false)
    if (errorForm) setErrorForm('')
  }

  const comenzarPartida = async (saltearChequeoDup: boolean) => {
    const nombre = datos.nombre.trim()
    const email  = datos.email.trim()
    const tel    = datos.telefono.trim()

    if (!nombre)         { setErrorForm('Escribí tu nombre para continuar.'); return }
    if (!email && !tel)  { setErrorForm('Dejanos al menos un contacto: email o teléfono.'); return }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorForm('Revisá el email, parece incompleto.'); return
    }

    setErrorForm('')
    setEnviando(true)
    try {
      if (!saltearChequeoDup && await contactoYaJugo(email, tel)) {
        setAvisoDup(true)
        return
      }
      const id = await registrarParticipante({ ...datos, nombre, email, telefono: tel })
      setPartidaId(id)
      setPreguntas(elegirPreguntas(data.preguntas, data.preguntasPorPartida))
      setIndice(0)
      setElegida(null)
      setRespuestas([])
      setVideoRoto(false)
      setAvisoDup(false)
      setFase('pregunta')
    } finally {
      setEnviando(false)
    }
  }

  const responder = (i: number) => {
    if (elegida !== null || !actual) return
    setElegida(i)
    setRespuestas(prev => [...prev, {
      preguntaId: actual.id,
      elegida:    actual.opciones[i] ?? '',
      correcta:   i === actual.correcta,
    }])
  }

  const avanzar = () => {
    if (esUltima) {
      const total = preguntas.length
      const ok    = respuestas.filter(r => r.correcta).length
      void finalizarPartida(partidaId, datos, ok, total, ok >= data.aciertosParaGanar, respuestas)
      setFase('resultado')
    } else {
      setIndice(i => i + 1)
      setElegida(null)
      setVideoRoto(false)
      setFase('pregunta')
    }
  }

  // ── Render por fase ──

  const seo = <Seo title="Trivia Golden Horses" description="Juego de preguntas de Golden Horses para eventos." path="/trivia" noindex />

  if (fase === 'intro') {
    return (
      <Pantalla>
        {seo}
        <div className="text-center animate__animated animate__fadeIn">
          <h1 className="font-condensed font-bold text-gold tracking-[4px] uppercase text-4xl md:text-5xl mb-3">
            {data.heroTitulo}
          </h1>
          <p className="font-condensed text-gold/80 text-xl mb-8">{data.heroSubtitulo}</p>
          <div className="gold-divider mx-auto" />
          <p className="font-condensed text-gold/90 text-lg leading-relaxed max-w-lg mx-auto mb-10">
            {data.reglas}
          </p>

          {disponibles === 0 ? (
            <p className="font-condensed text-red-300 text-lg">
              Todavía no hay preguntas cargadas. Cargalas desde el panel de administración.
            </p>
          ) : (
            <button onClick={() => setFase('datos')} className="btn-gold text-base px-12 py-4">
              Comenzar
            </button>
          )}
        </div>
      </Pantalla>
    )
  }

  if (fase === 'datos') {
    return (
      <Pantalla>
        {seo}
        <form
          onSubmit={e => { e.preventDefault(); void comenzarPartida(false) }}
          className="animate__animated animate__fadeIn"
        >
          <h2 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-2xl mb-1.5 text-center">
            Tus datos
          </h2>
          <p className="font-condensed text-gold/60 text-base mb-5 text-center">
            Los necesitamos para contactarte si ganás el sorteo.
          </p>

          <label className="block mb-4">
            <span className="label-eyebrow">Nombre y apellido *</span>
            <input
              ref={nombreRef}
              className="input-gold"
              value={datos.nombre}
              onChange={e => cambiar('nombre', e.target.value)}
              autoComplete="off"
              maxLength={120}
            />
          </label>

          <label className="block mb-4">
            <span className="label-eyebrow">Email</span>
            <input
              className="input-gold"
              type="email"
              inputMode="email"
              value={datos.email}
              onChange={e => cambiar('email', e.target.value)}
              autoComplete="off"
              maxLength={160}
            />
          </label>

          <label className="block mb-4">
            <span className="label-eyebrow">Teléfono</span>
            <input
              className="input-gold"
              type="tel"
              inputMode="tel"
              value={datos.telefono}
              onChange={e => cambiar('telefono', e.target.value)}
              autoComplete="off"
              maxLength={40}
            />
          </label>

          <p className="font-condensed text-gold/50 text-sm mb-4">
            Completá al menos uno de los dos: email o teléfono.
          </p>

          <label className="flex items-start gap-3 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={datos.consentimiento}
              onChange={e => cambiar('consentimiento', e.target.checked)}
              className="mt-1 w-5 h-5 accent-gold flex-shrink-0"
            />
            <span className="font-condensed text-gold/70 text-base leading-snug">{data.legalTexto}</span>
          </label>

          {errorForm && (
            <p className="font-condensed text-red-300 text-base bg-red-500/10 border border-red-500/40 rounded-lg px-4 py-3 mb-5">
              {errorForm}
            </p>
          )}

          {avisoDup && (
            <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg px-4 py-4 mb-5">
              <p className="font-condensed text-amber-200 text-base mb-3">
                Este contacto ya participó del sorteo. Podés jugar igual, pero el registro va a quedar duplicado.
              </p>
              <button
                type="button"
                onClick={() => void comenzarPartida(true)}
                disabled={enviando}
                className="btn-ghost disabled:opacity-50"
              >
                Continuar igual
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={reiniciar} className="btn-ghost">Volver</button>
            <button type="submit" disabled={enviando} className="btn-gold text-base px-10 py-4 disabled:opacity-50">
              {enviando ? 'Un segundo…' : 'Empezar a jugar'}
            </button>
          </div>
        </form>
      </Pantalla>
    )
  }

  if (fase === 'pregunta' && actual) {
    return (
      <Pantalla ajustado>
        {seo}
        {/* Tres bloques: encabezado y pie fijos, opciones al medio con el alto
            sobrante. El botón de avanzar nunca queda debajo del pliegue, que
            en un stand es lo único imperdonable. */}
        <div className="flex flex-col h-full min-h-0 animate__animated animate__fadeIn">
          <div className="flex-shrink-0">
            <p className="font-condensed text-gold/50 tracking-[3px] uppercase text-sm text-center mb-3">
              Pregunta {indice + 1} de {preguntas.length}
            </p>

            {/* Barra de progreso */}
            <div className="flex gap-1.5 justify-center mb-5">
              {preguntas.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-12 rounded transition-colors duration-300
                              ${i < indice ? 'bg-gold' : i === indice ? 'bg-gold/60' : 'bg-gold/15'}`}
                />
              ))}
            </div>

            <h2 className="font-condensed font-bold text-gold text-2xl md:text-3xl leading-snug text-center mb-6">
              {actual.pregunta}
            </h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col justify-center gap-3">
            {actual.opciones.map((op, i) => {
              const esCorrecta = i === actual.correcta
              const respondido = elegida !== null
              // Al responder se resalta siempre la correcta en verde y, si erró,
              // la elegida en rojo. El resto se apaga.
              const estilo = !respondido
                ? 'border-gold/30 text-gold hover:border-gold hover:bg-gold/10'
                : esCorrecta
                  ? 'border-green-500 bg-green-500/15 text-green-200'
                  : i === elegida
                    ? 'border-red-500 bg-red-500/15 text-red-200'
                    : 'border-gold/10 text-gold/30'
              return (
                <button
                  key={i}
                  onClick={() => responder(i)}
                  disabled={respondido}
                  className={`w-full min-h-[4rem] px-6 py-4 rounded-xl border text-left
                              font-condensed text-lg leading-snug
                              transition-all duration-200 disabled:cursor-default ${estilo}`}
                >
                  {op}
                </button>
              )
            })}
          </div>

          {/* El pie ocupa su lugar desde el arranque aunque esté vacío: si
              apareciera recién al responder, las opciones saltarían justo
              cuando el participante acaba de tocar una. */}
          <div className="flex-shrink-0 min-h-[8.5rem] flex flex-col justify-end text-center pt-4">
            {elegida !== null && (
              <div className="animate__animated animate__fadeIn">
                <p className={`font-condensed font-bold tracking-[2px] uppercase text-lg mb-4
                               ${elegida === actual.correcta ? 'text-green-300' : 'text-red-300'}`}>
                  {elegida === actual.correcta ? '¡Correcto!' : 'Respuesta incorrecta'}
                </p>
                <button onClick={() => setFase('video')} className="btn-gold text-base px-10 py-4">
                  Ver video
                </button>
              </div>
            )}
          </div>
        </div>
      </Pantalla>
    )
  }

  if (fase === 'video' && actual) {
    return (
      <Pantalla ajustado>
        {seo}
        {/* Columna que reparte el alto: el video se queda con lo que sobra
            después del rótulo, el epígrafe y el botón. Así entra entero en
            cualquier pantalla sin que haya que adivinar una altura en vh. */}
        <div className="flex flex-col h-full min-h-0 animate__animated animate__fadeIn">
          <p className="flex-shrink-0 font-condensed text-gold/50 tracking-[3px] uppercase text-sm text-center mb-3">
            Video {indice + 1} de {preguntas.length}
          </p>

          {actual.video && !videoRoto ? (
            /* Los videos son verticales (9:16). `object-contain` con alto al
               100% del hueco disponible deja que el ancho se acomode solo. */
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <video
                key={actual.video}
                src={actual.video}
                controls
                playsInline
                preload="metadata"
                onError={() => setVideoRoto(true)}
                className="h-full max-h-full w-auto max-w-full rounded-2xl border border-gold/20 bg-black object-contain"
              />
            </div>
          ) : (
            /* Sin archivo, o la ruta no existe: en vez del reproductor roto del
               navegador, un cartel que dice qué falta. El juego sigue igual. */
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center
                            border border-dashed border-gold/25 rounded-2xl px-6 text-center">
              <p className="font-condensed text-gold/60 text-lg mb-2">
                {actual.video ? 'No se pudo cargar el video' : 'Sin video cargado para esta pregunta'}
              </p>
              {actual.video && (
                <p className="font-condensed text-gold/35 text-sm break-all">{actual.video}</p>
              )}
            </div>
          )}

          {actual.epigrafe && (
            <p className="flex-shrink-0 font-condensed text-gold/80 text-base md:text-lg leading-snug text-center mt-4">
              {actual.epigrafe}
            </p>
          )}

          <div className="flex-shrink-0 text-center mt-4">
            <button onClick={avanzar} className="btn-gold text-base px-10 py-4">
              {esUltima ? 'Ver resultado' : 'Siguiente pregunta'}
            </button>
          </div>
        </div>
      </Pantalla>
    )
  }

  if (fase === 'resultado') {
    return (
      <Pantalla>
        {seo}
        <div className="text-center animate__animated animate__fadeIn">
          <p className="label-eyebrow">Resultado</p>
          <p className="font-condensed font-bold text-gold text-6xl md:text-7xl leading-none my-4">
            {aciertos}<span className="text-gold/40 text-4xl md:text-5xl"> / {preguntas.length}</span>
          </p>

          <h2 className={`font-condensed font-bold tracking-[3px] uppercase text-2xl mb-5
                          ${gano ? 'text-green-300' : 'text-gold/70'}`}>
            {gano ? '¡Participás del sorteo!' : 'Seguí participando'}
          </h2>

          <p className="font-condensed text-gold/90 text-lg leading-relaxed max-w-lg mx-auto mb-10">
            {gano ? data.textoGana : data.textoPierde}
          </p>

          <button onClick={reiniciar} className="btn-gold text-base px-12 py-4">
            Nuevo participante
          </button>
        </div>
      </Pantalla>
    )
  }

  // Estado imposible (p. ej. banco vacío tras editar en vivo): volvemos al inicio.
  return (
    <Pantalla>
      {seo}
      <div className="text-center">
        <p className="font-condensed text-gold/70 text-lg mb-6">No se pudo cargar la partida.</p>
        <button onClick={reiniciar} className="btn-gold">Volver al inicio</button>
      </div>
    </Pantalla>
  )
}
