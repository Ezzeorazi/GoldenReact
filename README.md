# Golden Horses Web

Sitio web desarrollado en React para la empresa **Golden Horses**, un concentrado energético para la nutrición equina. Incluye información sobre el producto, beneficios, datos nutricionales y un formulario de contacto.

## Características principales

- Navegación SPA con **React Router**.
- Estilos y componentes visuales basados en **Bootstrap 5** y **animate.css**.
- Páginas disponibles:
  - **Inicio**: Carrusel de imágenes y presentación del producto.
  - **Quiénes somos**: Detalles de la empresa y su trayectoria.
  - **Beneficios**: Tarjetas con ventajas del alimento.
  - **Información nutricional**: Tabla detallada de composición y recomendaciones de uso.
  - **Contacto**: Formulario que envía datos mediante [FormSubmit](https://formsubmit.co/).
- Componentes reutilizables de cabecera (HeaderNav), pie de página (Footer) y utilidades como ScrollToTop.

## Requisitos

- Node.js 16 o superior
- npm

## Instalación

1. Clona este repositorio y entra en la carpeta del proyecto.
2. Ejecuta:

```bash
npm install
```

para instalar las dependencias.

## Uso en desarrollo

Lanza el modo de desarrollo con:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000/` y recargará automáticamente al modificar los archivos.

## Construir para producción

Para generar los archivos optimizados en la carpeta `build` ejecuta:

```bash
npm run build
```

Luego puedes desplegar los archivos contenidos en `build` en el servidor de tu preferencia.

## Estructura del proyecto

- `src/` contiene todo el código fuente de React.
- `public/` incluye archivos estáticos e imágenes utilizadas por el sitio.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
