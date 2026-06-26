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

      {/* ── Timeline horizontal ── */}
      {data.hitos.length > 0 && (
        <div className="border-t border-gold/10 bg-[#050505] py-14">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {data.hitos.map((h, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 p-6 border border-gold/10 rounded-xl
                           hover:border-gold/30 hover:bg-gold/[0.02] transition-all duration-300"
              >
                <span className="font-condensed font-bold text-gold text-sm border border-gold/30
                                 bg-gold/10 rounded-lg px-3 py-1.5 self-start leading-tight">
                  {h.year}
                </span>
                <h4 className="font-condensed font-bold text-gold tracking-[1.5px] uppercase text-base">
                  {h.titulo}
                </h4>
                <p className="font-condensed text-gold/85 text-base leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
