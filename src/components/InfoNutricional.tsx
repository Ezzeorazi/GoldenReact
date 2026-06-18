import { useState, useEffect } from 'react'
import { useProductos } from '../lib/content'
import { Seo } from '../lib/seo'

export function InfoNutricional() {
  const { data: productos } = useProductos()
  const [activeId, setActiveId] = useState<string | null>(null)

  // Selecciona el primer producto disponible cuando llegan los datos.
  useEffect(() => {
    if (productos.length && (activeId === null || !productos.some(p => p.id === activeId))) {
      setActiveId(productos[0].id)
    }
  }, [productos, activeId])

  const p = productos.find(x => x.id === activeId) ?? productos[0]
  if (!p) return null

  const usoLineas = p.uso.split('\n').filter(l => l.trim())

  return (
    <div className="animate__animated animate__fadeIn">
      <Seo
        title="Información Nutricional | Golden Horses"
        description="Composición centesimal, ingredientes y recomendaciones de uso de los alimentos Golden Horses para caballos de alto rendimiento."
        path="/infoNutricional"
      />

      {/* ── Hero ── */}
      <div className="section-hero">
        <h1 className="font-condensed font-bold text-gold tracking-[4px] uppercase text-4xl md:text-5xl mb-0">
          Información Nutricional
        </h1>
      </div>

      {/* ── Tabs ── */}
      {productos.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
          {productos.map(prod => (
            <button
              key={prod.id}
              onClick={() => setActiveId(prod.id)}
              className={`font-condensed font-bold tracking-[3px] uppercase px-8 py-3 rounded-full border transition-all duration-200
                          ${prod.id === p.id
                            ? 'bg-gold text-black border-gold shadow-[0_0_18px_rgba(166,139,103,0.35)]'
                            : 'text-gold/70 border-gold/30 tab-pulse hover:bg-gold hover:text-black hover:border-gold'}`}
              style={{ fontSize: '0.8rem' }}
            >
              {prod.nombre}
            </button>
          ))}
        </div>
      )}

      {/* ── Contenido del producto ── */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Imagen */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[380px] flex items-center justify-center bg-[#f1ede6] rounded-2xl p-6">
            <img
              key={p.id}
              src={p.imagen}
              alt={p.nombre}
              className="max-h-[460px] w-auto object-contain
                         transition-all duration-500 hover:scale-105 cursor-zoom-in
                         animate__animated animate__fadeIn"
            />
          </div>

          <div className="w-full max-w-[380px] mt-4">
            <span className="label-eyebrow">{p.subtitulo}</span>
            <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl mb-4">
              {p.nombre}
            </h2>
            <p className="font-condensed text-gold/90 text-xl leading-relaxed">
              {p.descripcion}
            </p>

            {p.ingredientes && (
              <div className="mt-6 pt-6 border-t border-gold/15">
                <p className="font-condensed font-semibold text-gold/85 text-sm tracking-[2px] uppercase mb-2">Ingredientes</p>
                <p className="font-condensed text-gold/90 text-lg leading-relaxed">
                  {p.ingredientes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabla + Uso */}
        <div>
          {p.composicion.length > 0 && (
            <>
              <h3 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-xl mb-5">
                Composición Centesimal
              </h3>
              <table className="w-full border-collapse mb-10">
                <tbody>
                  {p.composicion.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gold/[0.03]' : ''}>
                      <td className="font-condensed text-gold/90 text-lg py-3 px-3 border-b border-gold/10">
                        {row.label}
                      </td>
                      <td className="font-condensed text-gold font-bold text-lg py-3 px-3 border-b border-gold/10 text-right whitespace-nowrap">
                        {row.valor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {usoLineas.length > 0 && (
            <>
              <h3 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-xl mb-4">
                Recomendaciones de uso
              </h3>
              <ul className="flex flex-col gap-2">
                {usoLineas.map((line, i) => (
                  <li key={i} className="font-condensed text-gold/90 text-lg leading-relaxed flex items-start gap-2">
                    <span className="text-gold/80 mt-1 flex-shrink-0">—</span>
                    {line}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
