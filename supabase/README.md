# Panel /admin con Supabase — Guía de puesta en marcha

El sitio ya está preparado para administrar **Productos**, **Quiénes somos** y
**Beneficios** desde `/admin`. Mientras Supabase no esté configurado, el sitio
sigue funcionando con el contenido por defecto (no se rompe nada), pero el panel
no podrá guardar cambios. Seguí estos pasos **una sola vez** para activarlo.

---

## 1. Crear el proyecto en Supabase

1. Entrá a <https://supabase.com> → **Start your project** (es gratis).
2. Creá un proyecto nuevo. Elegí una contraseña para la base de datos y guardala.
3. Esperá ~2 minutos a que termine de aprovisionar.

## 2. Crear las tablas, permisos y el bucket de imágenes

1. En el panel de Supabase, andá a **SQL Editor** → **New query**.
2. Abrí el archivo [`schema.sql`](./schema.sql) de este repo, copiá **todo** su
   contenido y pegalo en el editor.
3. Apretá **Run**. Debería decir "Success". Esto crea:
   - la tabla `productos` (con los 2 productos actuales precargados),
   - la tabla `secciones` (con los textos actuales precargados),
   - el bucket de imágenes `media`,
   - los permisos (lectura pública, escritura solo para el usuario logueado).

> Es seguro volver a ejecutarlo: no duplica datos.

## 3. Crear el usuario del cliente (para entrar a /admin)

1. En Supabase, andá a **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Poné el **email** y una **contraseña** para el cliente.
3. Marcá **Auto Confirm User** (así puede entrar sin confirmar el email).
4. Guardá. Con ese email + contraseña va a iniciar sesión en `/admin/login`.

> Para agregar más administradores, repetí este paso. No hay registro público:
> solo entran los usuarios que crees acá.

## 4. Conectar el sitio con Supabase (credenciales)

1. En Supabase, andá a **Project Settings** → **API**. Vas a ver:
   - **Project URL** (algo como `https://abcdxyz.supabase.co`)
   - **anon public** key (una clave larga).
2. En la raíz del proyecto, copiá el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
3. Completá `.env` con esos dos valores:
   ```
   VITE_SUPABASE_URL=https://abcdxyz.supabase.co
   VITE_SUPABASE_ANON_KEY=la-anon-public-key
   ```
4. Reiniciá el servidor de desarrollo (`npm run dev`) para que tome las variables.

> El archivo `.env` está en `.gitignore`: **no se sube al repo**. La `anon key`
> es segura para el navegador — los permisos (RLS) garantizan que solo un usuario
> logueado pueda modificar datos.

## 5. Configurar las variables en producción

Cuando publiques el sitio (Netlify, Vercel, etc.), cargá las mismas dos variables
de entorno en el panel del hosting:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

En **Netlify**: *Site settings → Environment variables*. Luego volvé a desplegar.
El archivo `public/_redirects` ya está configurado para que las rutas como
`/admin` funcionen al recargar la página.

---

## Cómo se usa el panel

- Entrá a **`/admin`** (te pide login) → email y contraseña del paso 3.
- **Productos**: crear, editar y eliminar. Cada producto incluye foto (se sube a
  Supabase Storage), composición centesimal, recomendaciones de uso y beneficios.
  La sección **Info Nutricional** del sitio se arma automáticamente con estos
  productos.
- **Quiénes somos**: editar el encabezado, los párrafos de la historia y los hitos.
- **Beneficios**: editar el encabezado y cada beneficio (ícono, título, descripción).

Los cambios se ven en el sitio público apenas se recarga la página.

## Notas técnicas

- Capa de datos: [`src/lib/content.ts`](../src/lib/content.ts)
- Cliente Supabase: [`src/lib/supabase.ts`](../src/lib/supabase.ts)
- Autenticación: [`src/lib/auth.tsx`](../src/lib/auth.tsx)
- Contenido por defecto / fallback: [`src/data/defaults.ts`](../src/data/defaults.ts)
- Panel: [`src/components/admin/`](../src/components/admin/)
