import { useState, type FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons'

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/1d57691f4369fd9d543ddb9cb2604cd9'

export function Footer() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: 'Nuevo contacto desde la web — Golden Horses',
          _template: 'box',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('ok')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer id="footer" className="bg-[#070707]">

      {/* Línea dorada superior */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />



      {/* Separador */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="h-px bg-gold/10" />
      </div>

      {/* Grid principal */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-28">

        {/* ── Formulario ── */}
        <div>
          <h3 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-2xl mb-1">
            Contactanos
          </h3>
          <p className="font-condensed text-gold/85 text-base mb-8 leading-relaxed">
            Te asesoramos para elegir el mejor alimento para tus caballos.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Honeypot anti-spam: invisible para humanos, los bots lo completan */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                required
                autoComplete="off"
                className="input-gold"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                autoComplete="off"
                className="input-gold"
              />
            </div>

            <textarea
              name="mensaje"
              placeholder="Mensaje"
              rows={4}
              required
              autoComplete="off"
              className="input-gold resize-none"
            />

            <div>
              <button type="submit" className="btn-gold" disabled={status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </div>

            {status === 'ok' && (
              <p className="font-condensed text-gold text-base" role="status">
                ¡Gracias! Tu mensaje fue enviado. Te vamos a responder a la brevedad.
              </p>
            )}
            {status === 'error' && (
              <p className="font-condensed text-red-400 text-base" role="alert">
                Hubo un problema al enviar. Probá de nuevo o escribinos a somosgoldenhorses@gmail.com.
              </p>
            )}
          </form>
        </div>

        {/* ── Datos de contacto ── */}
        <div>
          <h3 className="font-condensed font-bold text-gold tracking-[3px] uppercase text-2xl mb-1">
            Encontranos
          </h3>
          {/* Espaciador para alinear con el subtítulo del formulario */}
          <p className="font-condensed text-transparent text-lg mb-8 select-none" aria-hidden="true">.</p>

          <ul className="flex flex-col gap-6">
            <li>
              <a href="https://wa.me/5493471621535" className="flex items-center gap-4 group">
                <span className="w-11 h-11 rounded-full border border-gold/25 flex items-center justify-center
                                  transition-colors duration-200 group-hover:border-gold/60 group-hover:bg-gold/10 flex-shrink-0">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-gold text-lg" />
                </span>
                <div>
                  <p className="font-condensed font-semibold text-gold/80 text-sm tracking-[2px] uppercase mb-0.5">WhatsApp</p>
                  <p className="font-condensed text-gold/85 text-base group-hover:text-gold transition-colors">
                    +54 9 3471 621535
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a href="mailto:somosgoldenhorses@gmail.com" className="flex items-center gap-4 group">
                <span className="w-11 h-11 rounded-full border border-gold/25 flex items-center justify-center
                                  transition-colors duration-200 group-hover:border-gold/60 group-hover:bg-gold/10 flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gold text-lg" />
                </span>
                <div>
                  <p className="font-condensed font-semibold text-gold/80 text-sm tracking-[2px] uppercase mb-0.5">Email</p>
                  <p className="font-condensed text-gold/85 text-base group-hover:text-gold transition-colors">
                    somosgoldenhorses@gmail.com
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a
                href="https://www.google.com/maps/search/Flotron+1923+Armstrong+Santa+Fe+Argentina"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <span className="w-11 h-11 rounded-full border border-gold/25 flex items-center justify-center
                                  transition-colors duration-200 group-hover:border-gold/60 group-hover:bg-gold/10 flex-shrink-0 mt-0.5">
                  <FontAwesomeIcon icon={faLocationDot} className="text-gold text-lg" />
                </span>
                <div>
                  <p className="font-condensed font-semibold text-gold/80 text-sm tracking-[2px] uppercase mb-0.5">Dirección</p>
                  <p className="font-condensed text-gold/85 text-base leading-relaxed group-hover:text-gold transition-colors">
                    Agropecuaria Los Nonos S.R.L<br />
                    Flotron 1923 — Armstrong<br />
                    Santa Fe, Argentina
                  </p>
                </div>
              </a>
            </li>


            <li>
              <a
                href="https://www.instagram.com/goldenhorses1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="w-11 h-11 rounded-full border border-gold/25 flex items-center justify-center
                                  transition-colors duration-200 group-hover:border-gold/60 group-hover:bg-gold/10 flex-shrink-0">
                  <FontAwesomeIcon icon={faInstagram} className="text-gold text-lg" />
                </span>
                <div>
                  <p className="font-condensed font-semibold text-gold/80 text-sm tracking-[2px] uppercase mb-0.5">Instagram</p>
                  <p className="font-condensed text-gold/85 text-base group-hover:text-gold transition-colors">
                    @goldenhorses1
                  </p>
                </div>
              </a>
            </li>

          </ul>
        </div>
      </div>

      {/* Separador */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="h-px bg-gold/10" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-gold/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <img
              src="/image/Reciclaje.png"
              alt="Reciclado responsable"
              className="h-6"
            />
            <img
              src="/image/Senasa_Logo.png"
              alt="SENASA"
              className="h-6"
            />
          </div>
          <p className="font-condensed text-gold/80 tracking-widest" style={{ fontSize: '0.72rem' }}>
            © {new Date().getFullYear()} GOLDEN HORSES — TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>
      </div>

    </footer>
  )
}
