// Contenido por defecto. Cumple tres funciones:
//   1. El sitio sigue funcionando aunque Supabase no esté configurado todavía.
//   2. Se muestra mientras cargan los datos remotos (sin parpadeos vacíos).
//   3. Es la misma información que se inserta como seed en supabase/schema.sql.

import type { Producto, ConocenosData, BeneficiosData, InicioData } from '../lib/types'

export const INICIO_DEFAULT: InicioData = {
  waNumero: '5493471621535',
  // Sin slides precargados: el banner sale desde la base (panel /admin).
  // Mientras carga, el Inicio muestra el fondo negro de la marca.
  slides: [],
}

export const PRODUCTOS_DEFAULT: Producto[] = [
  {
    id:           'default-energetico',
    nombre:       'Energético',
    subtitulo:    'Concentrado energético para equinos',
    tagline:      'Alto rendimiento y exigencia física',
    descripcion:  'Concentrado energético pelletizado que combina almidón, fibra y contenido graso para proveer de manera altamente eficiente la energía necesaria para caballos con altas exigencias físicas.',
    presentacion: 'Bolsa 25 kg',
    imagen:       '/image/bolsa small.webp',
    ingredientes: '',
    composicion: [
      { label: 'Prot. Bruta (mín)',       valor: '18%' },
      { label: 'Cont. Graso (mín)',        valor: '4%' },
      { label: 'Materia Seca (máx)',       valor: '75%' },
      { label: 'Fibra Cruda (máx)',        valor: '7,45%' },
      { label: 'Humedad (máx)',            valor: '10%' },
      { label: 'Valor Energético Mcal/Kg', valor: '2.871' },
      { label: 'Fósforo mín / máx',       valor: '0,13 – 0,23%' },
      { label: 'Calcio mín / máx',        valor: '0,1 – 0,24%' },
      { label: 'Magnesio',                 valor: '0,017%' },
      { label: 'Zinc',                     valor: '30 ppm' },
      { label: 'Manganeso',                valor: '20 ppm' },
      { label: 'Cobre',                    valor: '10 ppm' },
      { label: 'Selenio',                  valor: '0,065 ppm' },
      { label: 'Bio-Mos AR Alltech',       valor: '0,1%' },
    ],
    uso: 'Para reemplazo total de avena: 1 kg por cada 100 kg de peso vivo por día.\nPara reemplazo parcial: 0,5 kg por cada 100 kg de peso vivo por día.\n\nVariar la alimentación de forma gradual y siempre consultando a un profesional.',
    beneficios: [
      'Aporte energético altamente eficiente para caballos de alta exigencia',
      'Almidón precocido que evita fermentaciones y reduce el riesgo de cólicos',
      'Alta palatabilidad y energía sostenida por la soja extrusada',
      'Favorece el desarrollo muscular magro y la vitalidad',
      'Elaborado con granos de producción propia, con menor riesgo de micotoxinas',
    ],
    orden:  1,
    activo: true,
  },
  {
    id:           'default-recria',
    nombre:       'Recría',
    subtitulo:    'Concentrado proteico para equinos',
    tagline:      'Recría y entrenamiento liviano',
    descripcion:  'Alimento concentrado proteico formulado específicamente para yeguas en lactancia y potrillos en pleno crecimiento. Alto contenido de Zinc y Manganeso para el desarrollo estructural.',
    presentacion: 'Bolsa 25 kg',
    imagen:       '/image/bolsa-nueva-golden.png',
    ingredientes: 'Maíz extrusado, soja extrusada, pellets de alfalfa, afrechillo de trigo, núcleo vitamínico mineral, prebiótico.',
    composicion: [
      { label: 'Prot. Bruta (mín)',       valor: '16%' },
      { label: 'Cont. Graso (mín)',        valor: '6%' },
      { label: 'Fibra Bruta (máx)',        valor: '12%' },
      { label: 'Humedad (máx)',            valor: '12%' },
      { label: 'Valor Energético Mcal/Kg', valor: '2.810' },
      { label: 'Calcio mín / máx',        valor: '0,48 – 0,72%' },
      { label: 'Fósforo mín / máx',       valor: '0,40 – 0,45%' },
      { label: 'Magnesio',                 valor: '1130 ppm' },
      { label: 'Zinc',                     valor: '210 ppm' },
      { label: 'Manganeso',                valor: '210 ppm' },
      { label: 'Cobre',                    valor: '20,25 ppm' },
    ],
    uso: 'Yeguas preñadas / lactancia y Training: 2 a 3 kg/día.\nPotrillos: 1 a 2 kg/día.',
    beneficios: [
      'Proporciona nutrientes esenciales para un crecimiento óptimo',
      'Minimiza enfermedades del desarrollo',
      'Disminuye el estrés al destete en potrillos',
      'Favorece la producción de leche en yeguas madres',
    ],
    orden:  2,
    activo: true,
  },
]

export const CONOCENOS_DEFAULT: ConocenosData = {
  heroTitulo:    'Somos Golden Horses',
  heroSubtitulo: '',
  histTitulo:    'De la semilla al alimento excepcional',
  parrafos: [
    'Agropecuaria Los Nonos S.R.L es una firma familiar dedicada a la producción primaria de granos. En 2013 comenzamos a concretar la idea de procesar nuestros propios granos y destinarlos exclusivamente a la nutrición animal.',
    'Desarrollamos suplementos alimenticios concentrados proteicos y energéticos en nuestra planta de extrusión propia, comercializándolos con las principales empresas de nutrición animal del país.',
    'A principios de 2021, comenzó el desarrollo de Golden Horses: un producto mucho más completo y elaborado, destinado específicamente a la nutrición equina. Aprovechamos las ventajas distintivas de nuestro procesamiento de granos para crear un alimento concentrado energético verdaderamente excepcional.',
  ],
  hitos: [
    { year: '2013', titulo: 'Fundación',             desc: 'Nace Agropecuaria Los Nonos S.R.L, firma familiar dedicada a la producción primaria de granos en Armstrong, Santa Fe.' },
    { year: '2019', titulo: 'Planta propia',         desc: 'Instalación de planta de extrusión propia para el procesamiento de granos y elaboración de suplementos concentrados.' },
    { year: '2021', titulo: 'Nace Golden Horses',    desc: 'Desarrollo del alimento concentrado energético específico para nutrición equina, aprovechando años de experiencia en procesamiento de granos.' },
    { year: 'Hoy',  titulo: 'Distribución nacional', desc: 'Presencia en todo el país con certificación SENASA y compromiso con el reciclado responsable.' },
  ],
}

export const BENEFICIOS_DEFAULT: BeneficiosData = {
  heroTitulo:    'Beneficios Comprobados',
  heroSubtitulo: 'Ciencia y naturaleza al servicio del rendimiento equino',
  items: [
    { titulo: 'Digestión Óptima',      icono: '/image/elementos web golden horses-09.png', descripcion: 'Elaborado con granos cosechados y procesados en nuestra propia finca, garantizando una absorción óptima de nutrientes en el sistema digestivo del caballo.' },
    { titulo: 'Previene Cólicos',      icono: '/image/elementos web golden horses-10.png', descripcion: 'El almidón precocido evita fermentaciones en el ciego que provocan distensión abdominal, reduciendo la irritabilidad y los cambios de carácter en el animal.' },
    { titulo: 'Alta Palatabilidad',    icono: '/image/elementos web golden horses-11.png', descripcion: 'Alta palatabilidad y provisión energética por la presencia de soja extrusada. Proteínas de alto valor biológico para máxima digestibilidad.' },
    { titulo: 'Desarrollo Muscular',   icono: '/image/elementos web golden horses-12.png', descripcion: 'Los nutrientes se absorben eficientemente, estimulando el desarrollo de masa muscular magra y la vitalidad sostenida de forma natural.' },
    { titulo: 'Libre de Micotoxinas',  icono: '/image/elementos web golden horses-13.png', descripcion: 'Control de calidad riguroso desde el campo: menor dependencia de granos de cereal, menor riesgo de micotoxinas y nutrición más segura.' },
  ],
}
