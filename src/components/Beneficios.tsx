import { useSeccion } from '../lib/content'
import { Seo } from '../lib/seo'

export function Beneficios() {
  const { data } = useSeccion('beneficios')

  return (
    <div className="animate__animated animate__fadeIn">
      <Seo
        title="Beneficios | Golden Horses"
        description="Descubrí los beneficios del alimento Golden Horses para el rendimiento, la salud y la energía de tus caballos de alto rendimiento."
        path="/beneficios"
      />

      {/* ── Hero ── */}
      <div className="section-hero">
        <h1 className="font-condensed font-bold text-gold tracking-[4px] uppercase text-4xl mb-3">
          {data.heroTitulo}
        </h1>
        <p className="font-condensed text-gold/90 text-lg max-w-sm mx-auto">
          {data.heroSubtitulo}
        </p>
      </div>

      {/* ── Lista de beneficios ── */}
      <div className="max-w-3xl mx-auto px-4">
        {data.items.map((b, idx) => (
          <div
            key={idx}
            className={`relative flex items-center gap-6 px-6 py-8
                       border-b border-gold/10 overflow-hidden
                       group transition-colors duration-300
                       hover:bg-gold/[0.03]
                       before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px]
                       before:bg-transparent before:transition-colors before:duration-300
                       hover:before:bg-gold
                       ${idx === 0 ? 'border-t border-gold/10' : ''}`}
          >
            {/* Ícono */}
            {b.icono && (
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gold/[0.07] flex items-center justify-center
                              transition-colors duration-300 group-hover:bg-gold/[0.13]">
                <img src={b.icono} alt={b.titulo} className="w-12 h-12 object-contain" />
              </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-lg mb-2">
                {b.titulo}
              </h3>
              <p className="font-condensed text-gold/90 text-lg leading-relaxed">
                {b.descripcion}
              </p>
            </div>

            {/* Número decorativo */}
            <span
              aria-hidden="true"
              className="absolute right-5 font-condensed font-bold text-[5rem] leading-none
                         text-gold/[0.04] pointer-events-none select-none
                         group-hover:text-gold/[0.07] transition-colors duration-300"
            >
              {String(idx + 1).padStart(2, '0')}
            </span>
          </div>
        ))}

      </div>

    </div>
  )
}
