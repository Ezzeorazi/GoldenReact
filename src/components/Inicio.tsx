import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useSeccion } from '../lib/content'
import { Seo } from '../lib/seo'
import type { Slide, Tam } from '../lib/types'

const NAV_BUTTONS = [
  { to: '/conocenos',  img: '/image/boton quienes somos-14.png', alt: 'Quiénes somos' },
  { to: '/beneficios', img: '/image/botones iconos-15.png',      alt: 'Beneficios' },
  { to: '/productos',  img: '/image/botones iconos-16.png',      alt: 'Productos' },
]

const esExterno = (link: string) => /^https?:\/\//i.test(link)

const waLink = (numero: string, mensaje: string) =>
  `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`

// Mapas de clases (literales, para que Tailwind no las purgue).
const V_POS = { arriba: 'justify-start', centro: 'justify-center', abajo: 'justify-end' } as const
const H_POS = {
  izquierda: 'items-start text-left',
  centro:    'items-center text-center',
  derecha:   'items-end text-right',
} as const
const H1_MOVIL:   Record<Tam, string> = { sm: 'text-2xl', md: 'text-3xl', lg: 'text-4xl', xl: 'text-5xl' }
const H1_DESKTOP: Record<Tam, string> = { sm: 'md:text-3xl', md: 'md:text-5xl', lg: 'md:text-6xl', xl: 'md:text-7xl' }
const FR_MOVIL:   Record<Tam, string> = { sm: 'text-base', md: 'text-lg', lg: 'text-xl', xl: 'text-2xl' }
const FR_DESKTOP: Record<Tam, string> = { sm: 'md:text-lg', md: 'md:text-2xl', lg: 'md:text-3xl', xl: 'md:text-4xl' }

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
    <div className={`absolute inset-0 flex flex-col gap-2 px-6 py-10 md:px-16 md:py-16
                     bg-gradient-to-b from-black/45 via-transparent to-black/60
                     ${V_POS[posV]} ${H_POS[posH]}`}>
      {slide.titulo && (
        <h2 className={`font-condensed font-bold text-gold tracking-[3px] uppercase
                       drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] mb-1 ${H1_MOVIL[tamM]} ${H1_DESKTOP[tamD]}`}>
          {slide.titulo}
        </h2>
      )}
      {slide.frase && (
        <p className={`font-condensed text-gold/95 max-w-2xl
                      drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-4 ${FR_MOVIL[tamM]} ${FR_DESKTOP[tamD]}`}>
          {slide.frase}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {slide.ctaTexto && slide.ctaLink && (
          esExterno(slide.ctaLink)
            ? <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer" className="btn-gold">{slide.ctaTexto}</a>
            : <Link to={slide.ctaLink} className="btn-gold">{slide.ctaTexto}</Link>
        )}
        {slide.waTexto && waNumero && (
          <a href={waLink(waNumero, slide.waMensaje)} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <FontAwesomeIcon icon={faWhatsapp} />
            {slide.waTexto}
          </a>
        )}
      </div>
    </div>
  )
}

export function Inicio() {
  const { data } = useSeccion('inicio')
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
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 relative">
              <img
                src={slide.desktop}
                alt={slide.alt}
                className="hidden md:block w-full h-auto"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              <img
                src={slide.mobile}
                alt={slide.alt}
                className="block md:hidden w-full h-auto"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              <SlideOverlay slide={slide} waNumero={data.waNumero} />
            </div>
          ))}
        </div>

        {/* Indicadores */}
        {slides.length > 1 && (
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

      {/* ── Botones de navegación ── */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NAV_BUTTONS.map(({ to, img, alt }) => (
            <Link key={to} to={to} className="block group overflow-hidden rounded-xl">
              <img
                src={img}
                alt={alt}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
