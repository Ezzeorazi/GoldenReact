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

/** Un producto destacado del home (imagen + título + puntos con tilde). */
export interface DestacadoItem {
  titulo:    string
  imagen:    string
  imagenAlt: string
  puntos:    string[]
}

/** Sección destacada del home: uno o varios productos. */
export interface DestacadoData {
  items: DestacadoItem[]
}

// ───────────────────────────── Trivia ─────────────────────────────
// Juego para stands en eventos: el participante deja sus datos, responde unas
// pocas preguntas tomadas al azar del banco y, si acierta el mínimo, entra al
// sorteo. Cada pregunta tiene su video.

export interface TriviaPregunta {
  /** Slug estable (p01, p02…). Se guarda en las respuestas del participante. */
  id:       string
  pregunta: string
  /** Exactamente 3 opciones. */
  opciones: string[]
  /** Índice de la opción correcta (0-2). */
  correcta: number
  /** Ruta del video, p. ej. '/video/trivia-01.mp4'. */
  video:    string
  /** Texto opcional debajo del video. */
  epigrafe: string
  /** Permite sacar una pregunta del sorteo sin borrarla. */
  activa:   boolean
}

export interface TriviaData {
  heroTitulo:          string
  heroSubtitulo:       string
  /** Texto de la pantalla de bienvenida. */
  reglas:              string
  /** Cuántas preguntas se sortean por partida. */
  preguntasPorPartida: number
  /** Aciertos necesarios para entrar al sorteo. */
  aciertosParaGanar:   number
  textoGana:           string
  textoPierde:         string
  /** Leyenda del checkbox de consentimiento (opcional para el participante). */
  legalTexto:          string
  preguntas:           TriviaPregunta[]
}

/** Respuesta registrada de una partida. */
export interface TriviaRespuesta {
  preguntaId: string
  elegida:    string
  correcta:   boolean
}

/** Fila de `trivia_participantes` tal como la lee el panel /admin. */
export interface TriviaParticipante {
  id:             string
  nombre:         string
  email:          string
  telefono:       string
  consentimiento: boolean
  aciertos:       number
  total:          number
  gano:           boolean
  finalizado:     boolean
  created_at:     string
}

/** Claves de la tabla `secciones`. */
export type SeccionClave = 'inicio' | 'conocenos' | 'beneficios' | 'destacado' | 'trivia'
