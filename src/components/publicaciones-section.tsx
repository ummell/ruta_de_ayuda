import { PublicacionesCarousel, type Publicacion } from './publicaciones-carousel';
import { createServerClient } from '@/lib/db';

const PUBLICACIONES_MOCK: Publicacion[] = [
  {
    id: 'mock-1',
    titulo: 'Gobierno nacional despliega respuesta ante sismo en Chocó',
    descripcion:
      'Presidente Abelardo De La Espriella lidera respuesta institucional. Sismo M7.4 con epicentro en San José del Palmar.',
    imagen_url: null,
    fuente_nombre: 'UNGRD',
    fuente_url: 'https://portal.gestiondelriesgo.gov.co/',
    categoria: 'comunicado',
    ciudades: ['Quibdó', 'Cali', 'Pereira', 'Manizales'],
    prioridad: 2,
    created_at: '2026-08-10T11:00:00Z',
  },
  {
    id: 'mock-2',
    titulo: 'Cruz Roja Colombiana activa respuesta',
    descripcion:
      'Capacidades de respuesta y alistamiento activadas tras sismo M7.4. Donaciones abiertas por canal oficial.',
    imagen_url: 'https://www.cruzrojacolombiana.org/wp-content/uploads/2026/08/BANNER-TODOS-POR-COLOMBIA-web-3-2-scaled.webp',
    fuente_nombre: 'Cruz Roja Colombiana',
    fuente_url: 'https://www.cruzrojacolombiana.org/cruz-roja-colombiana-despliega-capacidades-para-dar-respuesta-tras-las-afectaciones-por-sismo-en-colombia/',
    categoria: 'operativo',
    ciudades: ['Quibdó', 'Cali', 'Pereira'],
    prioridad: 2,
    created_at: '2026-08-10T14:30:00Z',
  },
  {
    id: 'mock-3',
    titulo: 'Bancos de sangre habilitados en Bogotá',
    descripcion:
      'Ocho puntos de donación. Demanda de hemoderivados en Cali, Quibdó y Manizales supera la reposición.',
    imagen_url: null,
    fuente_nombre: 'Secretaría de Salud Bogotá',
    fuente_url: 'https://www.saludcapital.gov.co/',
    categoria: 'convocatoria',
    ciudades: ['Bogotá', 'Cali', 'Quibdó', 'Manizales'],
    prioridad: 1,
    created_at: '2026-08-11T09:15:00Z',
  },
  {
    id: 'mock-4',
    titulo: 'No se desplace a la zona afectada por su cuenta',
    descripcion:
      'El voluntariado espontáneo sin coordinación satura corredores viales. Inscríbase y espere activación en el portal oficial.',
    imagen_url: null,
    fuente_nombre: 'UNGRD',
    fuente_url: 'https://portal.gestiondelriesgo.gov.co/',
    categoria: 'alerta',
    ciudades: [],
    prioridad: 2,
    created_at: '2026-08-11T08:00:00Z',
  },
  {
    id: 'mock-5',
    titulo: 'INVÍAS: Cali-Loboguerrero cerrada (PR 55)',
    descripcion:
      'La Línea abierta con restricción de carriles. Para información vial en tiempo real, llame al #767.',
    imagen_url: null,
    fuente_nombre: 'INVÍAS',
    fuente_url: 'https://www.invias.gov.co/publicaciones/8709/reporte-de-emergencias/',
    categoria: 'operativo',
    ciudades: ['Cali', 'Buenaventura'],
    prioridad: 1,
    created_at: '2026-08-11T05:30:00Z',
  },
  {
    id: 'mock-6',
    titulo: 'Se buscan ingenieros y arquitectos para evaluación estructural',
    descripcion:
      'CAMACOL, MinVivienda y UNGRD convocan a profesionales para acompañar evaluación post-sismo.',
    imagen_url: null,
    fuente_nombre: 'CAMACOL',
    fuente_url: 'https://www.camacol.co/',
    categoria: 'convocatoria',
    ciudades: [],
    prioridad: 0,
    created_at: '2026-08-11T12:00:00Z',
  },
];

async function fetchPublicaciones(): Promise<Publicacion[]> {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('publicaciones_oficiales')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return PUBLICACIONES_MOCK;
    }

    return data as Publicacion[];
  } catch {
    return PUBLICACIONES_MOCK;
  }
}

export async function PublicacionesSection() {
  const publicaciones = await fetchPublicaciones();

  return <PublicacionesCarousel publicaciones={publicaciones} />;
}