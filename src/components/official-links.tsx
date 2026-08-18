import { ExternalLink, MapPin } from 'lucide-react';

interface Contacto {
  nombre: string;
  url?: string;
  telefono?: string;
  twitter?: string;
}

interface CiudadInfo {
  slug: string;
  nombre: string;
  departamento: string;
  impacto: 'critico' | 'alto' | 'moderado';
  alcaldia: Contacto;
  gobernacion?: Contacto;
  personeria?: Contacto;
  bomberos?: Contacto;
  defensaCivil?: Contacto;
  cruzRoja?: Contacto;
  hospital?: Contacto;
  hospitalesAdicionales?: Contacto[];
  cuentaOficial?: Contacto;
  redesSociales?: Contacto[];
}

const CIUDADES: CiudadInfo[] = [
  {
    slug: 'quibdo',
    nombre: 'Quibdó',
    departamento: 'Chocó',
    impacto: 'critico',
    alcaldia: {
      nombre: 'Alcaldía de Quibdó',
      url: 'https://www.quibdo-choco.gov.co/',
      telefono: '+57 4 6711234',
      twitter: 'https://twitter.com/AlcaldiaQuibdo',
    },
    gobernacion: {
      nombre: 'Gobernación del Chocó',
      url: 'https://www.choco.gov.co/',
      telefono: '+57 4 6722222',
      twitter: 'https://twitter.com/GobChoco',
    },
    bomberos: { nombre: 'Bomberos Quibdó', telefono: '119' },
    defensaCivil: {
      nombre: 'Defensa Civil Chocó',
      telefono: '144',
    },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Chocó',
      telefono: '+57 4 6710030',
    },
    hospital: {
      nombre: 'Hospital Local Ismael Roldán Valencia',
      url: 'https://www.hospitalismaelroldan.gov.co/',
      telefono: '+57 4 6712345',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Hospital San Francisco de Asís',
        telefono: '+57 4 6714567',
      },
    ],
    cuentaOficial: {
      nombre: '@AlcaldiaQuibdo',
      twitter: 'https://twitter.com/AlcaldiaQuibdo',
    },
    redesSociales: [
      { nombre: 'Facebook', url: 'https://www.facebook.com/AlcaldiaQuibdo' },
      { nombre: 'Instagram', url: 'https://www.instagram.com/alcaldiadequibdo/' },
    ],
  },
  {
    slug: 'cali',
    nombre: 'Cali',
    departamento: 'Valle del Cauca',
    impacto: 'critico',
    alcaldia: {
      nombre: 'Alcaldía de Santiago de Cali',
      url: 'https://www.cali.gov.co/',
      telefono: '+57 602 8890000',
      twitter: 'https://twitter.com/AlcaldiaDeCali',
    },
    gobernacion: {
      nombre: 'Gobernación del Valle del Cauca',
      url: 'https://www.valledelcauca.gov.co/',
      telefono: '+57 602 6200000',
      twitter: 'https://twitter.com/GobValle',
    },
    personeria: {
      nombre: 'Personería de Cali',
      url: 'https://www.personeriacali.gov.co/',
      telefono: '+57 602 8855555',
    },
    bomberos: { nombre: 'Bomberos Cali', telefono: '119' },
    defensaCivil: {
      nombre: 'Defensa Civil Valle del Cauca',
      telefono: '144',
    },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Valle del Cauca',
      url: 'https://cruzrojavalle.org.co/',
      telefono: '+57 602 5582030',
    },
    hospital: {
      nombre: 'Hospital Universitario del Valle',
      url: 'https://www.huv.gov.co/',
      telefono: '+57 602 6206000',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Hospital San Juan de Dios',
        telefono: '+57 602 6672222',
      },
      {
        nombre: 'Centro de Acopio Icesi',
        url: 'https://www.icesi.edu.co/',
        telefono: '+57 602 5552334',
      },
    ],
    cuentaOficial: {
      nombre: '@AlcaldiaDeCali',
      twitter: 'https://twitter.com/AlcaldiaDeCali',
    },
    redesSociales: [
      { nombre: 'Facebook', url: 'https://www.facebook.com/AlcaldiaDeCali' },
      { nombre: 'Instagram', url: 'https://www.instagram.com/alcaldiadecali/' },
    ],
  },
  {
    slug: 'pereira',
    nombre: 'Pereira',
    departamento: 'Risaralda',
    impacto: 'critico',
    alcaldia: {
      nombre: 'Alcaldía de Pereira',
      url: 'https://www.pereira.gov.co/',
      telefono: '+57 606 3138800',
      twitter: 'https://twitter.com/AlcaldiaPereira',
    },
    gobernacion: {
      nombre: 'Gobernación de Risaralda',
      url: 'https://www.risaralda.gov.co/',
      telefono: '+57 606 3330000',
      twitter: 'https://twitter.com/GobRisaralda',
    },
    bomberos: { nombre: 'Bomberos Pereira', telefono: '119' },
    defensaCivil: { nombre: 'Defensa Civil Risaralda', telefono: '144' },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Risaralda',
      telefono: '+57 606 3357030',
    },
    hospital: {
      nombre: 'Hospital de San Jorge',
      url: 'https://www.husj.gov.co/',
      telefono: '+57 606 3333300',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Clínica Los Rosales',
        telefono: '+57 606 3314900',
      },
    ],
    cuentaOficial: {
      nombre: '@AlcaldiaPereira',
      twitter: 'https://twitter.com/AlcaldiaPereira',
    },
    redesSociales: [
      { nombre: 'Facebook', url: 'https://www.facebook.com/AlcaldiaPereira' },
      { nombre: 'Instagram (Alcaldía)', url: 'https://www.instagram.com/alcaldiadepereira/' },
      { nombre: 'Instagram (Cruz Roja)', url: 'https://www.instagram.com/cruzrojarisaralda/' },
    ],
  },
  {
    slug: 'manizales',
    nombre: 'Manizales',
    departamento: 'Caldas',
    impacto: 'alto',
    alcaldia: {
      nombre: 'Alcaldía de Manizales',
      url: 'https://www.manizales.gov.co/',
      telefono: '+57 606 8879700',
      twitter: 'https://twitter.com/CiudadManizales',
    },
    gobernacion: {
      nombre: 'Gobernación de Caldas',
      url: 'https://www.caldas.gov.co/',
      telefono: '+57 606 8783000',
      twitter: 'https://twitter.com/GobCaldas',
    },
    bomberos: { nombre: 'Bomberos Manizales', telefono: '119' },
    defensaCivil: { nombre: 'Defensa Civil Caldas', telefono: '144' },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Caldas',
      telefono: '+57 606 8847030',
    },
    hospital: {
      nombre: 'Hospital de Caldas',
      telefono: '+57 606 8782500',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Hospital Santa Sofía',
        telefono: '+57 606 8879100',
      },
    ],
    cuentaOficial: {
      nombre: '@CiudadManizales',
      twitter: 'https://twitter.com/CiudadManizales',
    },
    redesSociales: [
      { nombre: 'Facebook', url: 'https://www.facebook.com/AlcaldiaMnas' },
      { nombre: 'Instagram (Alcaldía)', url: 'https://www.instagram.com/alcaldiademanizales/' },
      { nombre: 'Instagram (Cruz Roja)', url: 'https://www.instagram.com/seccional_caldas/' },
    ],
  },
  {
    slug: 'armenia',
    nombre: 'Armenia',
    departamento: 'Quindío',
    impacto: 'alto',
    alcaldia: {
      nombre: 'Alcaldía de Armenia',
      url: 'https://www.armenia.gov.co/',
      telefono: '+57 606 7417100',
      twitter: 'https://twitter.com/AlcaldiaArmenia',
    },
    gobernacion: {
      nombre: 'Gobernación del Quindío',
      url: 'https://www.quindio.gov.co/',
      telefono: '+57 606 7417700',
      twitter: 'https://twitter.com/QuindioGob',
    },
    bomberos: { nombre: 'Bomberos Armenia', telefono: '119' },
    defensaCivil: { nombre: 'Defensa Civil Quindío', telefono: '144' },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Quindío',
      telefono: '+57 606 7494030',
    },
    hospital: {
      nombre: 'Hospital San Juan de Dios',
      url: 'https://www.hospitalquindio.gov.co/',
      telefono: '+57 606 7493500',
    },
    cuentaOficial: {
      nombre: '@AlcaldiaArmenia',
      twitter: 'https://twitter.com/AlcaldiaArmenia',
    },
    redesSociales: [
      { nombre: 'Instagram', url: 'https://www.instagram.com/alcaldiadearmenia/' },
    ],
  },
  {
    slug: 'buenaventura',
    nombre: 'Buenaventura',
    departamento: 'Valle del Cauca',
    impacto: 'alto',
    alcaldia: {
      nombre: 'Alcaldía de Buenaventura',
      url: 'https://www.buenaventura.gov.co/',
      telefono: '+57 602 2424100',
      twitter: 'https://twitter.com/BturaDE',
    },
    bomberos: { nombre: 'Bomberos Buenaventura', telefono: '119' },
    defensaCivil: { nombre: 'Defensa Civil Buenaventura', telefono: '144' },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Buenaventura',
      telefono: '+57 602 2424030',
    },
    hospital: {
      nombre: 'Hospital Luis Ablanque de la Plata',
      telefono: '+57 602 2424500',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Hospital San Agustín',
        telefono: '+57 602 2425500',
      },
    ],
    cuentaOficial: {
      nombre: '@BturaDE',
      twitter: 'https://twitter.com/BturaDE',
    },
  },
  {
    slug: 'medellin',
    nombre: 'Medellín',
    departamento: 'Antioquia',
    impacto: 'moderado',
    alcaldia: {
      nombre: 'Alcaldía de Medellín',
      url: 'https://www.medellin.gov.co/',
      telefono: '+57 604 3855555',
      twitter: 'https://twitter.com/AlcaldiadeMed',
    },
    gobernacion: {
      nombre: 'Gobernación de Antioquia',
      url: 'https://www.antioquia.gov.co/',
      telefono: '+57 604 3838000',
      twitter: 'https://twitter.com/GobAntioquia',
    },
    bomberos: { nombre: 'Bomberos Medellín', telefono: '119' },
    defensaCivil: { nombre: 'Defensa Civil Antioquia', telefono: '144' },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Antioquia',
      url: 'https://www.crantioquia.org.co/',
      telefono: '+57 604 3508050',
    },
    hospital: {
      nombre: 'Hospital General de Medellín',
      url: 'https://www.hgm.gov.co/',
      telefono: '+57 604 3847400',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Hospital Pablo Tobón Uribe',
        telefono: '+57 604 4459000',
      },
      {
        nombre: 'Clínica El Rosario',
        telefono: '+57 604 3541000',
      },
    ],
    cuentaOficial: {
      nombre: '@AlcaldiadeMed',
      twitter: 'https://twitter.com/AlcaldiadeMed',
    },
    redesSociales: [
      { nombre: 'Instagram', url: 'https://www.instagram.com/alcaldiademedellin/' },
    ],
  },
  {
    slug: 'bogota',
    nombre: 'Bogotá',
    departamento: 'Cundinamarca',
    impacto: 'moderado',
    alcaldia: {
      nombre: 'Alcaldía de Bogotá',
      url: 'https://www.bogota.gov.co/',
      telefono: '+57 601 3813000',
      twitter: 'https://twitter.com/Bogota',
    },
    gobernacion: {
      nombre: 'Gobernación de Cundinamarca',
      url: 'https://www.cundinamarca.gov.co/',
      telefono: '+57 601 7490000',
      twitter: 'https://twitter.com/CundinamarcaGob',
    },
    personeria: {
      nombre: 'Personería de Bogotá',
      url: 'https://www.personeriabogota.gov.co/',
      telefono: '+57 601 3830330',
    },
    bomberos: { nombre: 'Bomberos Bogotá', telefono: '119' },
    defensaCivil: { nombre: 'Defensa Civil Bogotá', telefono: '144' },
    cruzRoja: {
      nombre: 'Cruz Roja Seccional Bogotá',
      url: 'https://www.cruzrojabogota.org/',
      telefono: '+57 601 3508030',
    },
    hospital: {
      nombre: 'Secretaría de Salud Bogotá',
      url: 'https://www.saludcapital.gov.co/',
      telefono: '+57 601 3649666',
    },
    hospitalesAdicionales: [
      {
        nombre: 'Hospital de San José',
        telefono: '+57 601 3538000',
      },
      {
        nombre: 'Hospital Simón Bolívar',
        telefono: '+57 601 3534400',
      },
    ],
    cuentaOficial: {
      nombre: '@Bogota',
      twitter: 'https://twitter.com/Bogota',
    },
    redesSociales: [
      { nombre: 'Facebook', url: 'https://www.facebook.com/AlcaldiaBogota' },
      { nombre: 'Instagram', url: 'https://www.instagram.com/alcaldiabogota/' },
    ],
  },
];

interface RecursoGeneral {
  nombre: string;
  descripcion: string;
  url: string;
  telefono?: string;
  twitter?: string;
}

const RECURSOS_GENERALES: { titulo: string; icono: string; items: RecursoGeneral[] }[] = [
  {
    titulo: 'Donar dinero',
    icono: '💰',
    items: [
      {
        nombre: 'Cruz Roja Colombiana',
        descripcion: 'Donaciones para atención de emergencia',
        url: 'https://ayuda.cruzrojacolombiana.org/emergencia-colombia-terremoto',
        telefono: '01 8000 198 534',
      },
      {
        nombre: 'Banco de Alimentos',
        descripcion: 'Donaciones en especie para Bogotá',
        url: 'https://www.bancodealimentos.org.co',
      },
      {
        nombre: 'ACN Colombia',
        descripcion: 'Campaña terremoto Chocó',
        url: 'https://www.acncolombia.org/terremoto-en-colombia/',
      },
    ],
  },
  {
    titulo: 'Donar sangre',
    icono: '🩸',
    items: [
      {
        nombre: 'Cruz Roja — Banco de Sangre',
        descripcion: 'Red nacional de bancos',
        url: 'https://www.cruzrojacolombiana.org/dona-sangre/',
        telefono: '601 794 6566',
      },
    ],
  },
  {
    titulo: 'Voluntariado',
    icono: '🤝',
    items: [
      {
        nombre: 'Defensa Civil Colombiana',
        descripcion: 'Inscripción oficial de voluntarios',
        url: 'https://portal.gestiondelriesgo.gov.co/',
        telefono: '144',
      },
      {
        nombre: 'Cruz Roja — Voluntariado',
        descripcion: 'Programas y beneficios',
        url: 'https://www.cruzrojacolombiana.org/voluntariado/',
      },
    ],
  },
  {
    titulo: 'Fuentes oficiales (nivel nacional)',
    icono: '📡',
    items: [
      {
        nombre: 'UNGRD',
        descripcion: 'Boletines oficiales de emergencia',
        url: 'https://portal.gestiondelriesgo.gov.co/',
        twitter: 'https://twitter.com/UNGRD',
      },
      {
        nombre: 'SGC — Réplicas',
        descripcion: 'Datos sismológicos oficiales',
        url: 'https://www.sgc.gov.co/',
        twitter: 'https://twitter.com/sgcol',
      },
      {
        nombre: 'INVÍAS #767',
        descripcion: 'Estado de vías nacionales',
        url: 'https://hermes2.invias.gov.co/SIV/',
        telefono: '601 427 9500',
      },
    ],
  },
];

const IMPACTO_LABEL: Record<string, string> = {
  critico: 'Impacto crítico',
  alto: 'Impacto alto',
  moderado: 'Impacto moderado',
};

const IMPACTO_COLOR: Record<string, string> = {
  critico: 'bg-red-100 text-red-800 border-red-300',
  alto: 'bg-amber-100 text-amber-800 border-amber-300',
  moderado: 'bg-yellow-50 text-yellow-800 border-yellow-300',
};

function ContactoItem({ label, contacto }: { label: string; contacto: Contacto }) {
  return (
    <div className="flex items-start justify-between gap-2 text-sm py-1.5">
      <div className="min-w-0 flex-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className="font-medium text-sm truncate">{contacto.nombre}</p>
        {contacto.telefono && (
          <a
            href={`tel:${contacto.telefono.replace(/\s/g, '')}`}
            className="text-xs text-primary hover:underline block"
          >
            📞 {contacto.telefono}
          </a>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {contacto.twitter && (
          <a
            href={contacto.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground"
            title="Twitter/X"
          >
            𝕏
          </a>
        )}
        {contacto.url && (
          <a
            href={contacto.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-xs flex-shrink-0"
          >
            Web <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function CiudadCard({ ciudad }: { ciudad: CiudadInfo }) {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold truncate">{ciudad.nombre}</h3>
          </div>
          <p className="text-xs text-muted-foreground ml-6">{ciudad.departamento}</p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${IMPACTO_COLOR[ciudad.impacto]}`}
        >
          {IMPACTO_LABEL[ciudad.impacto]}
        </span>
      </div>

      <div className="divide-y">
        <ContactoItem label="Alcaldía" contacto={ciudad.alcaldia} />
        {ciudad.gobernacion && <ContactoItem label="Gobernación" contacto={ciudad.gobernacion} />}
        {ciudad.personeria && <ContactoItem label="Personería" contacto={ciudad.personeria} />}
        {ciudad.defensaCivil && <ContactoItem label="Defensa Civil" contacto={ciudad.defensaCivil} />}
        {ciudad.cruzRoja && <ContactoItem label="Cruz Roja" contacto={ciudad.cruzRoja} />}
        {ciudad.bomberos && <ContactoItem label="Bomberos" contacto={ciudad.bomberos} />}
        {ciudad.hospital && <ContactoItem label="Hospital principal" contacto={ciudad.hospital} />}
        {ciudad.hospitalesAdicionales?.map((h, i) => (
          <ContactoItem key={i} label={`Hospital ${i + 2}`} contacto={h} />
        ))}
        {ciudad.redesSociales && ciudad.redesSociales.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span className="text-muted-foreground">Redes:</span>
            {ciudad.redesSociales.map((red, i) => (
              <a
                key={i}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {red.nombre}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function OfficialLinks() {
  return (
    <div className="space-y-10">
      {/* Por ciudad */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Por ciudad afectada
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Contactos locales de alcaldías, gobernaciones, hospitales, Defensa Civil y Cruz Roja en las ciudades más afectadas.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CIUDADES.map((ciudad) => (
            <CiudadCard key={ciudad.slug} ciudad={ciudad} />
          ))}
        </div>
      </div>

      {/* Generales */}
      <div>
        <h2 className="text-xl font-bold mb-4">Por canal de ayuda</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Recursos nacionales. Cada uno tiene su propia página y verificación oficial.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {RECURSOS_GENERALES.map((recurso) => (
            <div key={recurso.titulo} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{recurso.icono}</span>
                <h3 className="font-semibold">{recurso.titulo}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {recurso.items.map((item) => (
                  <div
                    key={item.url}
                    className="flex flex-col gap-1.5 p-3 bg-card rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm leading-tight">{item.nombre}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-xs flex-shrink-0 whitespace-nowrap"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.descripcion}</p>
                    {item.telefono && (
                      <p className="text-xs text-muted-foreground">📞 {item.telefono}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}