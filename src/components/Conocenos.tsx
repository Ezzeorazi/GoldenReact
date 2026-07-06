import { useSeccion } from '../lib/content'
import { Seo } from '../lib/seo'

export function Conocenos() {
  const { data } = useSeccion('conocenos')

  return (
    <div className="animate__animated animate__fadeIn">
      <Seo
        title="Quiénes somos | Golden Horses"
        description="Conocé la historia de Golden Horses: producción propia y trazabilidad para ofrecer alimento energético de excelencia para caballos de alto rendimiento."
        path="/conocenos"
      />

      {/* ── Hero con banner ── */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src="image/banner3.webp"
          alt="Golden Horses campo"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.3]"
        />
        {/* pt-[100px] compensa el navbar fijo para que el H1 no quede pisado. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-[100px]">
          <h1 className="font-condensed font-bold text-gold tracking-[5px] uppercase text-4xl md:text-5xl mb-4">
            {data.heroTitulo}
          </h1>
          <div className="w-14 h-0.5 bg-gold rounded mb-4" />
          <p className="font-condensed text-gold/90 text-lg max-w-md">
            {data.heroSubtitulo}
          </p>
        </div>
      </div>

      {/* ── Historia — texto centrado full width ── */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl mb-3">
          {data.histTitulo}
        </h2>
        <div className="gold-divider" />

        {data.parrafos.map((p, idx) => (
          <p key={idx} className="font-condensed text-gold/90 text-xl leading-relaxed mb-5 last:mb-0">
            {p}
          </p>
        ))}
      </div>

      {/* ── Timeline (igual que el home: horizontal en desktop, vertical en mobile) ── */}
      {data.hitos.length > 0 && (
        <div className="border-t border-gold/10 bg-[#050505] py-14">
          {/* Timeline horizontal — desktop */}
          <div className="hidden md:flex max-w-6xl mx-auto px-6">
            {data.hitos.map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center px-3">
                {/* Riel con la línea y el punto */}
                <div className="relative w-full flex items-center justify-center mb-5">
                  {idx !== 0 && (
                    <span className="absolute right-1/2 left-0 top-1/2 -translate-y-1/2 h-px bg-gold/30" />
                  )}
                  {idx !== data.hitos.length - 1 && (
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
            {data.hitos.map((h, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Riel: punto + línea hacia el siguiente */}
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 rounded-full bg-gold shrink-0 mt-1.5" />
                  {idx !== data.hitos.length - 1 && (
                    <span className="w-px flex-1 bg-gold/30 my-1" />
                  )}
                </div>
                {/* Contenido */}
                <div className={idx !== data.hitos.length - 1 ? 'pb-8' : ''}>
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
        </div>
      )}

    </div>
  )
}
