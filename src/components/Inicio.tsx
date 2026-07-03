import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useSeccion } from '../lib/content'
import { Seo } from '../lib/seo'
import type { Slide, Tam } from '../lib/types'

const esExterno = (link: string) => /^https?:\/\//i.test(link)

// Destino del botón "Ver producto" de cada bloque destacado (por orden).
// Abre la ficha del producto en /productos vía el parámetro ?ver=.
const DESTACADO_LINKS = ['/productos?ver=energetico', '/productos?ver=recria']

const waLink = (numero: string, mensaje: string) =>
  `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`

// Mapas de clases (literales, para que Tailwind no las purgue).
const V_POS = { arriba: 'justify-start', centro: 'justify-center', abajo: 'justify-end' } as const
const H_POS = {
  izquierda: 'items-start text-left',
  centro:    'items-center text-center',
  derecha:   'items-end text-right',
} as const
const H1_MOVIL:   Record<Tam, string> = { sm: 'text-2xl', md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl' }
const H1_DESKTOP: Record<Tam, string> = { sm: 'md:text-3xl', md: 'md:text-5xl', lg: 'md:text-6xl', xl: 'md:text-7xl' }
const FR_MOVIL:   Record<Tam, string> = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' }
const FR_DESKTOP: Record<Tam, string> = { sm: 'md:text-lg', md: 'md:text-2xl', lg: 'md:text-3xl', xl: 'md:text-4xl' }

/** Imagen que entra con un fade suave cuando termina de descargarse,
 *  sobre el fondo negro del banner (evita parpadeos y saltos). */
function FadeImg({ src, alt, className, eager, objectPosition }: { src: string; alt: string; className: string; eager?: boolean; objectPosition?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      loading={eager ? 'eager' : 'lazy'}
      style={objectPosition ? { objectPosition } : undefined}
      className={`${className} transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

/** Capa con título, frase y botones sobre la imagen del slide. */
function SlideOverlay({ slide, waNumero }: { slide: Slide; waNumero: string }) {
  const tieneTexto = slide.titulo || slide.frase || slide.ctaTexto || (slide.waTexto && waNumero)
  if (!tieneTexto) return null

  // Fallbacks por si vienen datos guardados antes de esta función.
  const posV = slide.posV ?? 'centro'
  const posH = slide.posH ?? 'centro'
  const tamM = slide.tamMovil ?? 'md'
  const tamD = slide.tamDesktop ?? 'lg'

  return (
    <div className={`absolute inset-0 flex flex-col gap-2 px-6 pt-28 pb-10 md:px-16 md:py-16
                     bg-gradient-to-b from-black/45 via-transparent to-black/60
                     ${V_POS[posV]} ${H_POS[posH]}`}>
      {slide.titulo && (
        <h2 className={`font-condensed font-bold text-white tracking-[3px] uppercase
                       drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] mb-1 ${H1_MOVIL[tamM]} ${H1_DESKTOP[tamD]}`}>
          {slide.titulo}
        </h2>
      )}
      {slide.frase && (
        <p className={`font-condensed text-white max-w-2xl
                      drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-4 ${FR_MOVIL[tamM]} ${FR_DESKTOP[tamD]}`}>
          {slide.frase}
        </p>
      )}

      <div className="flex flex-col md:flex-row flex-wrap gap-3 items-start">
        {slide.ctaTexto && slide.ctaLink && (
          esExterno(slide.ctaLink)
            ? <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer" className="btn-gold !h-12 !py-0 !px-5 md:!px-8">{slide.ctaTexto}</a>
            : <Link to={slide.ctaLink} className="btn-gold !h-12 !py-0 !px-5 md:!px-8">{slide.ctaTexto}</Link>
        )}
        {slide.waTexto && waNumero && (
          <a href={waLink(waNumero, slide.waMensaje)} target="_blank" rel="noopener noreferrer" className="btn-wa !h-12 !py-0 !rounded-sm !px-4 md:!px-8">
            <FontAwesomeIcon icon={faWhatsapp} className="text-2xl md:text-lg" />
            <span className="hidden md:inline">{slide.waTexto}</span>
          </a>
        )}
      </div>
    </div>
  )
}

export function Inicio() {
  const { data, loading } = useSeccion('inicio')
  const { data: conocenos } = useSeccion('conocenos')
  const { data: destacado } = useSeccion('destacado')
  const slides = data.slides
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [slides.length])

  // Si cambia la cantidad de slides, evita índices fuera de rango.
  useEffect(() => {
    if (current >= slides.length) setCurrent(0)
  }, [slides.length, current])

  return (
    <div className="animate__animated animate__fadeIn">
      <Seo
        title="Golden Horses – Alimento energético para caballos de alto rendimiento"
        description="Golden Horses, alimento energético para caballos de alto rendimiento, de carrera o polo. Nutrición equina de excelencia que garantiza el mejor rendimiento."
        path="/"
      />

      {/* H1 único de la página (el carrusel usa imágenes y títulos secundarios). */}
      <h1 className="sr-only">Golden Horses – Alimento energético para caballos de alto rendimiento</h1>

      {/* ── Carousel ── */}
      {/* Fondo negro de la marca: queda reservado mientras carga y detrás del fade. */}
      <div className="relative w-full overflow-hidden h-[72vh] md:h-screen bg-black">
        {/* Mientras Supabase responde no mostramos nada (solo el negro), para
            evitar el parpadeo de contenido por defecto. La imagen entra con fade. */}
        {!loading && slides.length > 0 && (
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 relative h-full">
              <FadeImg
                src={slide.desktop}
                alt={slide.alt}
                className="hidden md:block w-full h-full object-cover"
                objectPosition={slide.objectPosition ?? 'top'}
                eager={idx === 0}
              />
              <FadeImg
                src={slide.mobile}
                alt={slide.alt}
                className="block md:hidden w-full h-full object-cover"
                objectPosition={slide.objectPosition ?? 'center'}
                eager={idx === 0}
              />
              <SlideOverlay slide={slide} waNumero={data.waNumero} />
            </div>
          ))}
        </div>
        )}

        {/* Indicadores */}
        {!loading && slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300
                            ${idx === current ? 'bg-gold w-6' : 'bg-gold/30 hover:bg-gold/60'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Historia de la marca — línea de tiempo (replicada de Quiénes somos) ── */}
      {conocenos.hitos.length > 0 && (
        <div className="border-t border-gold/10 bg-[#050505] py-14">
          <div className="max-w-5xl mx-auto px-6 mb-10 text-center">
            <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl mb-3">
              {conocenos.histTitulo}
            </h2>
            <div className="gold-divider mx-auto" />
          </div>

          {/* Timeline horizontal — desktop */}
          <div className="hidden md:flex max-w-6xl mx-auto px-6">
            {conocenos.hitos.map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center px-3">
                {/* Riel con la línea y el punto */}
                <div className="relative w-full flex items-center justify-center mb-5">
                  {idx !== 0 && (
                    <span className="absolute right-1/2 left-0 top-1/2 -translate-y-1/2 h-px bg-gold/30" />
                  )}
                  {idx !== conocenos.hitos.length - 1 && (
                    <span className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-px bg-gold/30" />
                  )}
                  <span className="relative z-10 w-4 h-4 rounded-full bg-gold ring-4 ring-[#050505]" />
                </div>
                <span className="font-condensed font-bold text-gold text-sm border border-gold/30
                                 bg-gold/10 rounded-lg px-3 py-1.5 leading-tight mb-3">
                  {h.year}
                </span>
                <h4 className="font-condensed font-bold text-gold tracking-[1.5px] uppercase text-base mb-2">
                  {h.titulo}
                </h4>
                <p className="font-condensed text-gold/85 text-sm leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Timeline vertical — mobile */}
          <div className="md:hidden max-w-md mx-auto px-6 flex flex-col">
            {conocenos.hitos.map((h, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Riel: punto + línea hacia el siguiente */}
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 rounded-full bg-gold shrink-0 mt-1.5" />
                  {idx !== conocenos.hitos.length - 1 && (
                    <span className="w-px flex-1 bg-gold/30 my-1" />
                  )}
                </div>
                {/* Contenido */}
                <div className={idx !== conocenos.hitos.length - 1 ? 'pb-8' : ''}>
                  <span className="inline-block font-condensed font-bold text-gold text-sm border border-gold/30
                                   bg-gold/10 rounded-lg px-3 py-1.5 leading-tight mb-2">
                    {h.year}
                  </span>
                  <h4 className="font-condensed font-bold text-gold tracking-[1.5px] uppercase text-base mb-1">
                    {h.titulo}
                  </h4>
                  <p className="font-condensed text-gold/85 text-base leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-6 mt-10 text-center">
            <Link to="/conocenos" className="btn-gold">
              Conocé más
            </Link>
          </div>
        </div>
      )}

      {/* ── Productos destacados (editable en /admin → Destacada) ── */}
      {destacado.items.length > 0 && (
        <div className="border-t border-gold/10 py-14 md:py-20 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-24">
            {destacado.items.map((item, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-2 gap-8 md:gap-14 items-center"
              >
                {/* Imagen (alterna de lado en desktop) */}
                {item.imagen && (
                  <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                    <img
                      src={item.imagen}
                      alt={item.imagenAlt || item.titulo}
                      className="w-full h-auto rounded-2xl"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Texto + puntos */}
                <div className={`${idx % 2 === 1 ? 'md:order-1' : ''} ${item.imagen ? '' : 'md:col-span-2 text-center'}`}>
                  {item.titulo && (
                    <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl md:text-4xl mb-4">
                      {item.titulo}
                    </h2>
                  )}
                  <div className={`gold-divider ${item.imagen ? '' : 'mx-auto'}`} />
                  <ul className="flex flex-col gap-4 mt-6">
                    {item.puntos.map((p, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 font-condensed text-gold/90 text-lg md:text-xl leading-relaxed"
                      >
                        <FontAwesomeIcon icon={faCircleCheck} className="text-gold text-xl mt-1 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-8 ${item.imagen ? '' : 'flex justify-center'}`}>
                    <Link to={DESTACADO_LINKS[idx] ?? '/productos'} className="btn-gold">
                      Ver producto
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
