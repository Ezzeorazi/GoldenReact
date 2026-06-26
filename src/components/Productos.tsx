import { useState } from 'react'
import { createPortal } from 'react-dom'
import Zoom from 'react-medium-image-zoom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faMagnifyingGlass, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useProductos } from '../lib/content'
import { Seo } from '../lib/seo'
import type { Producto, ComposicionRow } from '../lib/types'

const WP_NUMERO = '5493471621535'

const waLink = (p: Producto) => {
  const msg = `Hola! Me interesa el producto *${p.nombre}* (${p.presentacion}). ¿Pueden darme más información?`
  return `https://wa.me/${WP_NUMERO}?text=${encodeURIComponent(msg)}`
}

/** Imagen de producto que entra con un fade suave al terminar de cargar. */
function FadeImg({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-[opacity,transform] duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

function TablaComposicion({ filas }: { filas: ComposicionRow[] }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {filas.map((f, idx) => (
          <tr key={idx} className={idx % 2 === 0 ? 'bg-gold/[0.03]' : ''}>
            <td className="font-condensed text-gold/90 text-base py-1.5 px-2 border-b border-gold/10">
              {f.label}
            </td>
            <td className="font-condensed text-gold font-bold text-base py-1.5 px-2 border-b border-gold/10 text-right whitespace-nowrap">
              {f.valor}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Productos() {
  const { data: productos, loading } = useProductos()
  const [modal, setModal] = useState<Producto | null>(null)

  const abrirModal  = (p: Producto) => setModal(p)
  const cerrarModal = ()            => setModal(null)

  return (
    <div className="animate__animated animate__fadeIn">
      <Seo
        title="Productos | Golden Horses"
        description="Nutrición equina de excelencia procesada en nuestra propia finca. Conocé los alimentos Golden Horses para caballos de carrera y polo."
        path="/productos"
      />

      {/* ── Hero ── */}
      <div className="section-hero">
        <h2 className="font-condensed font-bold text-gold tracking-[5px] uppercase text-4xl mb-3">
          Nuestros Productos
        </h2>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        {/* Mientras carga desde Supabase no mostramos productos por defecto. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
          {!loading && productos.map(p => (
            <div
              key={p.id}
              className="w-full max-w-sm flex flex-col bg-[#0a0a0a]
                         border border-gold/[0.16] rounded-2xl overflow-hidden
                         transition-all duration-300
                         hover:border-gold/60 hover:shadow-[0_0_28px_rgba(166,139,103,0.12)]"
            >
              {/* Imagen */}
              <div
                className="relative overflow-hidden bg-[#f1ede6] aspect-[4/3] cursor-zoom-in group"
                onClick={() => abrirModal(p)}
              >
                <FadeImg
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-full object-contain p-8 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2.5
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gold text-3xl" />
                  <span className="font-condensed text-gold text-sm tracking-[2px] uppercase">Ver ficha</span>
                </div>
              </div>

              {/* Cuerpo */}
              <div className="flex flex-col flex-1 p-6">
                <span className="font-condensed font-semibold text-gold/85 text-sm tracking-[2px] uppercase mb-1">
                  {p.subtitulo}
                </span>
                <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-2xl mb-1">
                  {p.nombre}
                </h3>
                <span className="font-condensed font-semibold text-gold/75 text-sm tracking-[2px] uppercase mb-4">
                  {p.presentacion}
                </span>
                <p className="font-condensed text-gold/90 text-lg leading-relaxed flex-1 mb-5">
                  {p.descripcion}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => abrirModal(p)} className="btn-ghost flex-1">
                    Ver ficha técnica
                  </button>
                  <a href={waLink(p)} target="_blank" rel="noopener noreferrer" className="btn-wa">
                    <FontAwesomeIcon icon={faWhatsapp} />
                    Consultar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal (portal → escapa del stacking context del padre) ── */}
      {modal && createPortal(
        <div
          className="fixed inset-0 bg-black/[0.97] z-[1050] flex items-center justify-center p-3 animate-fade-in"
          onClick={cerrarModal}
        >
          <div
            className="bg-[#0d0d0d] border border-gold/25 rounded-[18px]
                       w-full max-w-[960px] flex flex-col md:flex-row
                       relative overflow-hidden h-[92vh] animate-modal-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={cerrarModal}
              aria-label="Cerrar"
              className="absolute top-3.5 right-3.5 z-10
                         w-9 h-9 rounded-full border border-gold/30 bg-gold/10
                         flex items-center justify-center text-gold text-sm
                         hover:bg-gold/25 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            {/* Col imagen — 50% */}
            <div className="md:w-1/2 flex-shrink-0 bg-[#f1ede6] flex flex-col items-center justify-center p-8 md:p-10 border-b md:border-b-0 md:border-r border-gold/10">
              <Zoom
                zoomMargin={40}
                classDialog="bg-black/95"
              >
                <img
                  src={modal.imagen}
                  alt={modal.nombre}
                  className="max-w-full max-h-[380px] object-contain cursor-zoom-in"
                />
              </Zoom>
              <p className="font-condensed text-black/55 text-xs tracking-[2px] uppercase mt-4 text-center">
                Clic en la imagen para hacer zoom
              </p>
            </div>

            {/* Col info — scrolleable sin barra visible */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-7 md:p-9 pt-12 md:pt-9 flex flex-col">
              <span className="font-condensed font-semibold text-gold/85 text-sm tracking-[2px] uppercase mb-1">
                {modal.subtitulo}
              </span>
              <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl mb-1">
                {modal.nombre}
              </h2>
              <p className="font-condensed font-semibold text-gold/75 text-sm tracking-[2px] uppercase mb-4">
                {modal.tagline}
              </p>
              <p className="font-condensed text-gold/90 text-lg leading-relaxed">
                {modal.descripcion}
              </p>

              {/* Ingredientes */}
              {modal.ingredientes && (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <h4 className="font-condensed font-bold text-gold/85 text-[0.8rem] tracking-[2px] uppercase mb-2">
                    Ingredientes
                  </h4>
                  <p className="font-condensed text-gold/90 text-base leading-relaxed">
                    {modal.ingredientes}
                  </p>
                </div>
              )}

              {/* Composición */}
              {modal.composicion.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <h4 className="font-condensed font-bold text-gold/85 text-[0.8rem] tracking-[2px] uppercase mb-3">
                    Composición Centesimal
                  </h4>
                  <TablaComposicion filas={modal.composicion} />
                </div>
              )}

              {/* Uso */}
              {modal.uso && (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <h4 className="font-condensed font-bold text-gold/85 text-[0.8rem] tracking-[2px] uppercase mb-2">
                    Recomendaciones de uso
                  </h4>
                  {modal.uso.split('\n').map((line, i) =>
                    line
                      ? <p key={i} className="font-condensed text-gold/90 text-base leading-relaxed mb-1">{line}</p>
                      : <br key={i} />
                  )}
                </div>
              )}

              {/* Beneficios */}
              {modal.beneficios.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <h4 className="font-condensed font-bold text-gold/85 text-[0.8rem] tracking-[2px] uppercase mb-3">
                    Beneficios
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {modal.beneficios.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-condensed text-gold/90 text-base leading-relaxed">
                        <FontAwesomeIcon icon={faCheck} className="text-gold text-xs mt-1 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={waLink(modal)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full mt-6"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
