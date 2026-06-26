-- ============================================================================
-- Golden Horses — Esquema de Supabase
-- Pegá TODO este archivo en: Supabase → SQL Editor → New query → Run.
-- Es idempotente: se puede correr varias veces sin romper nada.
-- ============================================================================

-- ─────────────────────────── Tabla: productos ──────────────────────────────
create table if not exists public.productos (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  subtitulo    text        default '',
  tagline      text        default '',
  descripcion  text        default '',
  presentacion text        default '',
  imagen       text        default '',         -- URL pública de Storage
  ingredientes text        default '',
  composicion  jsonb       default '[]'::jsonb, -- [{ "label": "...", "valor": "..." }]
  uso          text        default '',
  beneficios   jsonb       default '[]'::jsonb, -- ["...", "..."]
  orden        int         default 0,
  activo       boolean     default true,
  created_at   timestamptz default now()
);

-- ─────────────────────────── Tabla: secciones ──────────────────────────────
-- Bloques de contenido editable (textos de "Quiénes somos" y "Beneficios").
create table if not exists public.secciones (
  clave      text primary key,                 -- 'conocenos' | 'beneficios'
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ─────────────────────────── Permisos de rol ───────────────────────────────
-- Los roles anon/authenticated necesitan el GRANT a nivel de tabla además de
-- las políticas RLS de más abajo. En algunos proyectos no se aplican solos.
grant usage on schema public to anon, authenticated;
grant select on public.productos, public.secciones to anon, authenticated;
grant insert, update, delete on public.productos, public.secciones to authenticated;

-- ─────────────────────────────── RLS ───────────────────────────────────────
alter table public.productos enable row level security;
alter table public.secciones enable row level security;

-- Lectura pública (cualquiera puede ver el sitio).
drop policy if exists "productos lectura pública" on public.productos;
create policy "productos lectura pública"
  on public.productos for select using (true);

drop policy if exists "secciones lectura pública" on public.secciones;
create policy "secciones lectura pública"
  on public.secciones for select using (true);

-- Escritura solo para usuarios autenticados (el admin logueado).
drop policy if exists "productos escritura autenticada" on public.productos;
create policy "productos escritura autenticada"
  on public.productos for all
  to authenticated using (true) with check (true);

drop policy if exists "secciones escritura autenticada" on public.secciones;
create policy "secciones escritura autenticada"
  on public.secciones for all
  to authenticated using (true) with check (true);

-- ─────────────────────────── Storage: media ────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media lectura pública" on storage.objects;
create policy "media lectura pública"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media subida autenticada" on storage.objects;
create policy "media subida autenticada"
  on storage.objects for insert
  to authenticated with check (bucket_id = 'media');

drop policy if exists "media actualización autenticada" on storage.objects;
create policy "media actualización autenticada"
  on storage.objects for update
  to authenticated using (bucket_id = 'media');

drop policy if exists "media borrado autenticado" on storage.objects;
create policy "media borrado autenticado"
  on storage.objects for delete
  to authenticated using (bucket_id = 'media');

-- ─────────────────────────── Seed (datos iniciales) ────────────────────────
-- Solo inserta si la tabla está vacía, para no duplicar al re-ejecutar.
insert into public.productos (nombre, subtitulo, tagline, descripcion, presentacion, imagen, ingredientes, composicion, uso, beneficios, orden, activo)
select * from (values
  (
    'Energético',
    'Concentrado energético para equinos',
    'Alto rendimiento y exigencia física',
    'Concentrado energético pelletizado que combina almidón, fibra y contenido graso para proveer de manera altamente eficiente la energía necesaria para caballos con altas exigencias físicas.',
    'Bolsa 25 kg',
    '/image/bolsa small.webp',
    '',
    '[{"label":"Prot. Bruta (mín)","valor":"18%"},{"label":"Cont. Graso (mín)","valor":"4%"},{"label":"Materia Seca (máx)","valor":"75%"},{"label":"Fibra Cruda (máx)","valor":"7,45%"},{"label":"Humedad (máx)","valor":"10%"},{"label":"Valor Energético Mcal/Kg","valor":"2.871"},{"label":"Fósforo mín / máx","valor":"0,13 – 0,23%"},{"label":"Calcio mín / máx","valor":"0,1 – 0,24%"},{"label":"Magnesio","valor":"0,017%"},{"label":"Zinc","valor":"30 ppm"},{"label":"Manganeso","valor":"20 ppm"},{"label":"Cobre","valor":"10 ppm"},{"label":"Selenio","valor":"0,065 ppm"},{"label":"Bio-Mos AR Alltech","valor":"0,1%"}]'::jsonb,
    E'Para reemplazo total de avena: 1 kg por cada 100 kg de peso vivo por día.\nPara reemplazo parcial: 0,5 kg por cada 100 kg de peso vivo por día.\n\nVariar la alimentación de forma gradual y siempre consultando a un profesional.',
    '[]'::jsonb,
    1, true
  ),
  (
    'Recría',
    'Concentrado proteico para equinos',
    'Recría y entrenamiento liviano',
    'Alimento concentrado proteico formulado específicamente para yeguas en lactancia y potrillos en pleno crecimiento. Alto contenido de Zinc y Manganeso para el desarrollo estructural.',
    'Bolsa 25 kg',
    '/image/bolsa-nueva-golden.png',
    'Maíz extrusado, soja extrusada, pellets de alfalfa, afrechillo de trigo, núcleo vitamínico mineral, prebiótico.',
    '[{"label":"Prot. Bruta (mín)","valor":"16%"},{"label":"Cont. Graso (mín)","valor":"6%"},{"label":"Fibra Bruta (máx)","valor":"12%"},{"label":"Humedad (máx)","valor":"12%"},{"label":"Valor Energético Mcal/Kg","valor":"2.810"},{"label":"Calcio mín / máx","valor":"0,48 – 0,72%"},{"label":"Fósforo mín / máx","valor":"0,40 – 0,45%"},{"label":"Magnesio","valor":"1130 ppm"},{"label":"Zinc","valor":"210 ppm"},{"label":"Manganeso","valor":"210 ppm"},{"label":"Cobre","valor":"20,25 ppm"}]'::jsonb,
    E'Yeguas preñadas / lactancia y Training: 2 a 3 kg/día.\nPotrillos: 1 a 2 kg/día.',
    '["Proporciona nutrientes esenciales para un crecimiento óptimo","Minimiza enfermedades del desarrollo","Disminuye el estrés al destete en potrillos","Favorece la producción de leche en yeguas madres"]'::jsonb,
    2, true
  )
) as seed
where not exists (select 1 from public.productos);

insert into public.secciones (clave, data)
values
  ('inicio', '{
    "waNumero": "5493471621535",
    "slides": [
      {
        "desktop": "/image/golden-horses-gana-exito-alimento.webp",
        "mobile": "/image/golden-horses-gana-exito-alimento-mobile.webp",
        "alt": "Golden Horses – Ganá con éxito",
        "titulo": "", "frase": "",
        "ctaTexto": "Ver productos", "ctaLink": "/productos",
        "waTexto": "Consultar por WhatsApp", "waMensaje": "Hola! Quiero más información sobre Golden Horses.",
        "posV": "centro", "posH": "centro", "tamMovil": "md", "tamDesktop": "lg"
      },
      {
        "desktop": "/image/golden-horses-nutricion-animal-equinos-pc.webp",
        "mobile": "/image/golden-horses-nutricion-animal-equinos.webp",
        "alt": "Golden Horses – Nutrición animal equinos",
        "titulo": "", "frase": "",
        "ctaTexto": "Ver productos", "ctaLink": "/productos",
        "waTexto": "Consultar por WhatsApp", "waMensaje": "Hola! Quiero más información sobre Golden Horses.",
        "posV": "centro", "posH": "centro", "tamMovil": "md", "tamDesktop": "lg"
      },
      {
        "desktop": "/image/golden-horses-trazabilidad-alimentos.webp",
        "mobile": "/image/golden-horses-trazabilidad-alimentos-mobile.webp",
        "alt": "Golden Horses – Trazabilidad",
        "titulo": "", "frase": "",
        "ctaTexto": "Ver productos", "ctaLink": "/productos",
        "waTexto": "Consultar por WhatsApp", "waMensaje": "Hola! Quiero más información sobre Golden Horses.",
        "posV": "centro", "posH": "centro", "tamMovil": "md", "tamDesktop": "lg"
      }
    ]
  }'::jsonb),
  ('conocenos', '{
    "heroTitulo": "Somos Golden Horses",
    "heroSubtitulo": "Nutrición equina de excelencia, desde el campo hasta el comedero",
    "histTitulo": "De la finca al alimento excepcional",
    "parrafos": [
      "Agropecuaria Los Nonos S.R.L es una firma familiar dedicada a la producción primaria de granos. En 2013 comenzamos a concretar la idea de procesar nuestros propios granos y destinarlos exclusivamente a la nutrición animal.",
      "Desarrollamos suplementos alimenticios concentrados proteicos y energéticos en nuestra planta de extrusión propia, comercializándolos con las principales empresas de nutrición animal del país.",
      "A principios de 2021, comenzó el desarrollo de Golden Horses: un producto mucho más completo y elaborado, destinado específicamente a la nutrición equina. Aprovechamos las ventajas distintivas de nuestro procesamiento de granos para crear un alimento concentrado energético verdaderamente excepcional."
    ],
    "hitos": [
      { "year": "2013", "titulo": "Fundación", "desc": "Nace Agropecuaria Los Nonos S.R.L, firma familiar dedicada a la producción primaria de granos en Armstrong, Santa Fe." },
      { "year": "2019", "titulo": "Planta propia", "desc": "Instalación de planta de extrusión propia para el procesamiento de granos y elaboración de suplementos concentrados." },
      { "year": "2021", "titulo": "Nace Golden Horses", "desc": "Desarrollo del alimento concentrado energético específico para nutrición equina, aprovechando años de experiencia en procesamiento de granos." },
      { "year": "Hoy", "titulo": "Distribución nacional", "desc": "Presencia en todo el país con certificación SENASA y compromiso con el reciclado responsable." }
    ]
  }'::jsonb),
  ('beneficios', '{
    "heroTitulo": "Beneficios Comprobados",
    "heroSubtitulo": "Ciencia y naturaleza al servicio del rendimiento equino",
    "items": [
      { "titulo": "Digestión Óptima", "icono": "/image/elementos web golden horses-09.png", "descripcion": "Elaborado con granos cosechados y procesados en nuestra propia finca, garantizando una absorción óptima de nutrientes en el sistema digestivo del caballo." },
      { "titulo": "Previene Cólicos", "icono": "/image/elementos web golden horses-10.png", "descripcion": "El almidón precocido evita fermentaciones en el ciego que provocan distensión abdominal, reduciendo la irritabilidad y los cambios de carácter en el animal." },
      { "titulo": "Alta Palatabilidad", "icono": "/image/elementos web golden horses-11.png", "descripcion": "Alta palatabilidad y provisión energética por la presencia de soja extrusada. Proteínas de alto valor biológico para máxima digestibilidad." },
      { "titulo": "Desarrollo Muscular", "icono": "/image/elementos web golden horses-12.png", "descripcion": "Los nutrientes se absorben eficientemente, estimulando el desarrollo de masa muscular magra y la vitalidad sostenida de forma natural." },
      { "titulo": "Libre de Micotoxinas", "icono": "/image/elementos web golden horses-13.png", "descripcion": "Control de calidad riguroso desde el campo: menor dependencia de granos de cereal, menor riesgo de micotoxinas y nutrición más segura." }
    ]
  }'::jsonb)
on conflict (clave) do nothing;
