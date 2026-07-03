import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Card } from './ui'

const ACCESOS = [
  { to: '/admin/inicio',     titulo: 'Banner',        desc: 'Editar los slides del inicio: imagen, título, frase, botón CTA y botón de WhatsApp.' },
  { to: '/admin/productos',  titulo: 'Productos',     desc: 'Crear, editar y eliminar productos. Cada producto alimenta también la sección de Info Nutricional.' },
  { to: '/admin/conocenos',  titulo: 'Quiénes somos', desc: 'Editar los textos, párrafos e hitos de la historia de la empresa.' },
  { to: '/admin/beneficios', titulo: 'Beneficios',    desc: 'Editar los beneficios del producto: título, descripción e ícono.' },
  { to: '/admin/destacado',  titulo: 'Destacada',     desc: 'Sección del home debajo de la historia: imagen, título y puntos con tilde.' },
]

export function Dashboard() {
  return (
    <div>
      <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-3xl mb-2">Bienvenido</h2>
      <p className="font-condensed text-gold/70 text-lg mb-8">
        Desde acá administrás el contenido del sitio. Elegí una sección para empezar
        o leé la guía de uso más abajo.
      </p>

      {/* ── Accesos rápidos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {ACCESOS.map(a => (
          <Link key={a.to} to={a.to}>
            <Card className="h-full hover:border-gold/50 transition-colors">
              <h3 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-xl mb-2">{a.titulo}</h3>
              <p className="font-condensed text-gold/70 text-base leading-relaxed">{a.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Guía de uso ── */}
      <h2 className="font-condensed font-bold text-gold tracking-[2px] uppercase text-2xl mb-1">Guía de uso</h2>
      <p className="font-condensed text-gold/60 text-base mb-5">Tocá cada título para ver el detalle.</p>

      <div className="flex flex-col gap-3">

        <Seccion titulo="Cómo funciona (importante)">
          <Ul items={[
            <><B>Guardá siempre.</B> Los cambios se aplican recién cuando tocás el botón <B>Guardar</B>. Si salís de una pantalla sin guardar, se pierden.</>,
            <><B>Dónde se ven.</B> Los cambios aparecen en el sitio público al <B>recargar la página</B> (F5). Puede tardar unos segundos.</>,
            <><B>Cerrar sesión.</B> Usá el botón <B>Cerrar sesión</B> (abajo a la izquierda) cuando termines, sobre todo en computadoras compartidas.</>,
            <><B>Sin miedo a romper nada.</B> Si borrás un texto y guardás, simplemente deja de mostrarse esa parte. Podés volver a completarlo cuando quieras.</>,
          ]} />
        </Seccion>

        <Seccion titulo="Banner de inicio — los slides del carrusel">
          <P>Es el carrusel grande que se ve al entrar al sitio. Cada <B>slide</B> es una imagen con, opcionalmente, un título, una frase y botones encima.</P>
          <H>Cómo se maneja</H>
          <Ul items={[
            <>Agregá un slide con <B>+ Slide</B> o eliminá uno con la <B>✕</B>.</>,
            <>Cambiá el orden con las flechas <B>↑ ↓</B> de cada slide.</>,
            <>El carrusel va pasando solo. Si dejás un solo slide, queda fijo.</>,
          ]} />
          <H>Qué se completa en cada slide</H>
          <Campos items={[
            ['Imagen escritorio', 'La versión horizontal (computadora). Se ve en pantallas grandes.'],
            ['Imagen celular', 'La versión vertical (celular). Se ve en pantallas chicas. Conviene cargar las dos.'],
            ['Texto alternativo', 'Describe la imagen para accesibilidad. Ej: "Caballo alimentándose en el campo".'],
            ['Título (H1)', 'El texto grande sobre la imagen. Dejalo vacío si la imagen ya trae el texto y no querés superponer.'],
            ['Frase disparadora', 'Frase corta debajo del título.'],
            ['Texto del botón CTA', 'El texto del botón principal (ej: "Ver productos"). Si lo dejás vacío, el botón no aparece.'],
            ['Destino del CTA', 'A dónde lleva el botón: una ruta interna (/productos, /conocenos, /beneficios) o un enlace completo (https://…).'],
            ['Texto del botón WhatsApp', 'El texto del botón verde de WhatsApp. Vacío = no aparece.'],
            ['Mensaje de WhatsApp', 'El mensaje que aparece ya escrito cuando el cliente abre el chat.'],
            ['Posición vertical / horizontal', 'Dónde se ubica el texto sobre la imagen: arriba/centro/abajo e izquierda/centro/derecha.'],
            ['Tamaño en celular / escritorio', 'El tamaño del texto (chico a extra grande), por separado para cada pantalla. Así podés achicarlo en celular si tapa la foto.'],
          ]} />
          <P className="mt-3 text-gold/55 text-base">El <B>número de WhatsApp</B> se configura una sola vez arriba de todo (campo "Número de WhatsApp") y se usa en todos los slides. Va con código de país y solo dígitos: ej. <B>5493471621535</B>.</P>
        </Seccion>

        <Seccion titulo="Productos — crear, editar y borrar">
          <P>Es la sección principal. Cada producto que cargás acá aparece automáticamente en <B>Productos</B> y en <B>Información Nutricional</B> del sitio.</P>
          <H>Para crear uno nuevo</H>
          <Ul items={[
            <>Entrá a <B>Productos</B> y tocá <B>+ Nuevo producto</B>.</>,
            <>Completá los campos (ver abajo) y tocá <B>Guardar producto</B>.</>,
          ]} />
          <H>Para editar o borrar</H>
          <Ul items={[
            <>En la lista, tocá <B>Editar</B> en la tarjeta del producto.</>,
            <>Para eliminarlo, tocá <B>Eliminar</B> (te pide confirmación). Es permanente.</>,
          ]} />
          <H>Qué se completa en cada producto</H>
          <Campos items={[
            ['Imagen', 'Foto del producto. Subí un archivo desde tu compu (recomendado) o pegá una URL. Se ve en la tarjeta, la ficha y la info nutricional.'],
            ['Nombre', 'El nombre del producto. Ej: "Energético". Es lo único obligatorio.'],
            ['Presentación', 'El formato de venta. Ej: "Bolsa 25 kg".'],
            ['Subtítulo', 'Bajada corta. Ej: "Concentrado energético para equinos".'],
            ['Tagline', 'Frase corta que aparece en la ficha. Ej: "Alto rendimiento y exigencia física".'],
            ['Descripción', 'Texto que explica el producto. Aparece en la tarjeta y la ficha.'],
            ['Ingredientes', 'Opcional. Listado de ingredientes en un solo texto.'],
            ['Recomendaciones de uso', 'Una recomendación por línea (Enter para separar). Cada línea se muestra como un punto.'],
            ['Orden', 'Número que define en qué posición aparece. Menor número = aparece primero.'],
            ['Visible en el sitio', 'Si lo destildás, el producto queda oculto al público pero no se borra. Útil para preparar uno antes de publicarlo.'],
            ['Composición centesimal', 'La tabla de nutrientes. Agregá filas con "+ Fila", completá nutriente y valor (ej: "Prot. Bruta (mín)" → "18%"). Borrá una fila con la ✕.'],
            ['Beneficios del producto', 'Opcional. Lista de beneficios que se muestran en la ficha. Agregá con "+ Beneficio".'],
          ]} />
        </Seccion>

        <Seccion titulo="Quiénes somos — editar la historia">
          <P>Edita la página "Quiénes somos" del sitio.</P>
          <Campos items={[
            ['Título del hero', 'El título grande arriba. Ej: "Somos Golden Horses".'],
            ['Subtítulo del hero', 'La frase debajo del título.'],
            ['Título de la historia', 'El encabezado de la sección de texto. Ej: "De la finca al alimento excepcional".'],
            ['Párrafos de la historia', 'Cada bloque de texto es un párrafo. Agregá con "+ Párrafo", borrá con la ✕. El orden de arriba hacia abajo es el que se muestra.'],
            ['Hitos (línea de tiempo)', 'Las tarjetas con años. Cada hito tiene Año (ej: "2013" o "Hoy"), Título (ej: "Fundación") y Descripción. Agregá con "+ Hito".'],
          ]} />
          <P className="mt-3 text-gold/55 text-base">No te olvides de tocar <B>Guardar cambios</B> al terminar.</P>
        </Seccion>

        <Seccion titulo="Beneficios — editar los beneficios del producto">
          <P>Edita la página "Beneficios".</P>
          <Campos items={[
            ['Título del hero', 'El título grande arriba. Ej: "Beneficios Comprobados".'],
            ['Subtítulo del hero', 'La frase debajo del título.'],
            ['Lista de beneficios', 'Cada beneficio tiene un Ícono (imagen), un Título y una Descripción. Agregá con "+ Beneficio" o eliminá con la ✕. El orden es el que se muestra.'],
          ]} />
          <P className="mt-3 text-gold/55 text-base">No te olvides de tocar <B>Guardar cambios</B> al terminar.</P>
        </Seccion>

        <Seccion titulo="Destacada — productos del home">
          <P>Es la sección que aparece en el inicio, <B>debajo de la línea histórica</B>. Sirve para destacar productos con una imagen, un título y una lista de puntos con tilde dorado.</P>
          <Campos items={[
            ['Producto', 'Agregá uno con "+ Producto" o eliminá con la ✕. En la web los productos se muestran uno debajo del otro, alternando la imagen de lado.'],
            ['Imagen', 'La foto del producto. Subí un archivo o pegá una URL. Si la dejás vacía, ese producto se muestra solo con el texto centrado.'],
            ['Texto alternativo', 'Describe la imagen para accesibilidad y SEO.'],
            ['Título', 'El nombre del producto. Ej: "Alta Potencia", "Golden Recría".'],
            ['Puntos', 'Cada punto se muestra con un tilde dorado. Agregá con "+ Punto" y borrá con la ✕.'],
          ]} />
          <P className="mt-3 text-gold/55 text-base">No te olvides de tocar <B>Guardar cambios</B> al terminar.</P>
        </Seccion>

        <Seccion titulo="Imágenes — recomendaciones">
          <H>Formatos soportados</H>
          <P>El panel acepta <B>WEBP</B>, <B>PNG</B>, <B>JPG/JPEG</B> y <B>SVG</B>. Para subir, en el campo de imagen tocá <B>Subir archivo</B> y elegí el archivo: se guarda solo y queda lista (vas a ver la miniatura). Si te equivocaste, subí otra y reemplaza a la anterior.</P>

          <H>Fotos de productos — fondo transparente</H>
          <Ul items={[
            <>Las fotos de producto se muestran sobre un recuadro claro, así que tienen que ir con <B>fondo transparente</B> (recortado, sin fondo blanco ni de color).</>,
            <>Usá <B>PNG-24</B> o <B>WEBP</B>, que son los únicos que conservan la transparencia. <B>JPG no sirve para esto</B> porque no soporta transparencia (le mete fondo blanco).</>,
            <>Encuadrá el producto centrado y con un poco de aire alrededor (que no quede pegado a los bordes).</>,
          ]} />

          <H>Formato recomendado y cómo exportarlo en Photoshop</H>
          <Ul items={[
            <><B>Recomendado: WEBP</B> (pesa menos manteniendo la calidad). En Photoshop: <B>Archivo → Exportar → Exportar como…</B>, en "Formato" elegí <B>WEBP</B>, calidad ~<B>80%</B>, y dejá tildado <B>Transparencia</B>.</>,
            <><B>Alternativa: PNG-24.</B> Mismo camino (<B>Exportar como…</B>), elegí <B>PNG</B> y tildá <B>Transparencia</B>. Es 100% seguro para fondos transparentes aunque pese un poco más.</>,
            <>Para <B>banners o imágenes a fondo completo</B> (sin transparencia), usá <B>WEBP</B> o <B>JPG</B> con calidad ~80%.</>,
          ]} />

          <H>Tamaño</H>
          <P>Con <B>1000–1500 px de ancho</B> alcanza. Evitá archivos enormes (varios MB): hacen lento el sitio sin mejorar lo que se ve en pantalla.</P>
        </Seccion>

        <Seccion titulo="Preguntas frecuentes">
          <H>Hice un cambio y no lo veo en el sitio</H>
          <P>Asegurate de haber tocado <B>Guardar</B> y después <B>recargá</B> la página del sitio (F5).</P>
          <H>Me equivoqué, ¿puedo deshacer?</H>
          <P>No hay un botón de "deshacer". Mientras no hayas guardado, podés tocar <B>Cancelar</B>. Si ya guardaste, volvé a editar y corregilo a mano.</P>
          <H>Olvidé mi contraseña</H>
          <P>Contactá a quien administra el sitio para restablecerla desde el panel de Supabase.</P>
        </Seccion>

      </div>
    </div>
  )
}

// ─────────────────────── Componentes de la guía ───────────────────────

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <details className="bg-[#0a0a0a] border border-gold/15 rounded-2xl overflow-hidden group">
      <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between
                          font-condensed font-bold text-gold tracking-[1.5px] uppercase text-base
                          hover:bg-gold/[0.04] transition-colors">
        {titulo}
        <span className="text-gold/60 text-sm transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="px-6 pb-6 pt-1 border-t border-gold/10">{children}</div>
    </details>
  )
}

function P({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-condensed text-gold/80 text-lg leading-relaxed mb-3 ${className}`}>{children}</p>
}

function H({ children }: { children: ReactNode }) {
  return <h4 className="font-condensed font-bold text-gold/90 tracking-[1px] uppercase text-sm mt-4 mb-2">{children}</h4>
}

function B({ children }: { children: ReactNode }) {
  return <strong className="text-gold font-bold">{children}</strong>
}

function Ul({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 mb-1">
      {items.map((it, i) => (
        <li key={i} className="font-condensed text-gold/80 text-lg leading-relaxed flex items-start gap-2.5">
          <span className="text-gold/60 mt-1 flex-shrink-0">•</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function Campos({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-col gap-2.5 mt-1">
      {items.map(([campo, desc], i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-gold/10 pb-2.5 last:border-0">
          <span className="font-condensed font-bold text-gold text-base sm:w-52 flex-shrink-0">{campo}</span>
          <span className="font-condensed text-gold/75 text-base leading-relaxed">{desc}</span>
        </div>
      ))}
    </div>
  )
}
