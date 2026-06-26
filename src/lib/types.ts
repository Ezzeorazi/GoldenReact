// Tipos compartidos entre el sitio público y el panel /admin.

export interface ComposicionRow {
  label: string
  valor: string
}

export interface Producto {
  id:            string
  nombre:        string
  subtitulo:     string
  tagline:       string
  descripcion:   string
  presentacion:  string
  imagen:        string
  ingredientes:  string
  composicion:   ComposicionRow[]
  uso:           string
  beneficios:    string[]
  orden:         number
  activo:        boolean
}

export interface Hito {
  year:   string
  titulo: string
  desc:   string
}

export interface ConocenosData {
  heroTitulo:    string
  heroSubtitulo: string
  histTitulo:    string
  parrafos:      string[]
  hitos:         Hito[]
}

export interface BeneficioItem {
  titulo:      string
  descripcion: string
  icono:       string
}

export interface BeneficiosData {
  heroTitulo:    string
  heroSubtitulo: string
  items:         BeneficioItem[]
}

export type PosV = 'arriba' | 'centro' | 'abajo'
export type PosH = 'izquierda' | 'centro' | 'derecha'
export type Tam  = 'sm' | 'md' | 'lg' | 'xl'

export interface Slide {
  desktop:         string
  mobile:          string
  alt:             string
  titulo:          string  // H1 sobre la imagen
  frase:           string  // frase disparadora
  ctaTexto:        string  // texto del botón CTA (vacío = no se muestra)
  ctaLink:         string  // ruta interna (/productos) o URL externa (https://…)
  waTexto:         string  // texto del botón de WhatsApp
  waMensaje:       string  // mensaje precargado del WhatsApp
  posV:            PosV    // posición vertical del texto
  posH:            PosH    // posición horizontal del texto
  tamMovil:        Tam     // tamaño del texto en celular
  tamDesktop:      Tam     // tamaño del texto en escritorio
  objectPosition?: string  // ej: "top", "center", "50% 30%" — controla qué parte de la imagen se muestra
}

export interface InicioData {
  waNumero: string   // número de WhatsApp del negocio, solo dígitos con código de país
  slides:   Slide[]
}

/** Claves de la tabla `secciones`. */
export type SeccionClave = 'inicio' | 'conocenos' | 'beneficios'
