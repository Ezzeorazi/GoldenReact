import { Link } from 'react-router-dom'
import { Seo } from '../lib/seo'

export function NotFound() {
  return (
    <div className="animate__animated animate__fadeIn min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <Seo
        title="Página no encontrada | Golden Horses"
        description="La página que buscás no existe o fue movida."
        path="/404"
        noindex
      />
      <h1 className="font-condensed font-bold text-gold tracking-[5px] uppercase text-6xl md:text-8xl mb-4">
        404
      </h1>
      <div className="w-14 h-0.5 bg-gold rounded mb-6" />
      <p className="font-condensed text-gold/90 text-xl max-w-md mb-8">
        La página que buscás no existe o fue movida.
      </p>
      <Link to="/" className="btn-gold">
        Volver al inicio
      </Link>
    </div>
  )
}
