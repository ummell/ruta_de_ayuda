export const EMERGENCY_PHONES = [
  { number: '123', name: 'Línea de Emergencia', icon: 'phone' },
  { number: '144', name: 'Defensa Civil', icon: 'shield' },
  { number: '132', name: 'Cruz Roja Colombiana', icon: 'heart' },
  { number: '119', name: 'Bomberos', icon: 'flame' },
  { number: '112', name: 'Policía Nacional', icon: 'badge' },
] as const;

export const CATEGORIAS_PERSONA = [
  { value: 'terremoto', label: 'Terremoto' },
  { value: 'inundacion', label: 'Inundación' },
  { value: 'deslizamiento', label: 'Deslizamiento' },
  { value: 'emergencia_hospitalaria', label: 'Emergencia Hospitalaria' },
  { value: 'persona_extraviada', label: 'Persona Extraviada' },
  { value: 'adulto_mayor', label: 'Adulto Mayor Desorientado' },
  { value: 'menor_desaparecido', label: 'Menor de Edad Desaparecido' },
  { value: 'discapacidad', label: 'Persona con Discapacidad' },
  { value: 'conflicto_familiar', label: 'Conflicto Familiar' },
  { value: 'otra', label: 'Otra' },
] as const;

export const ESTADOS_PERSONA = [
  { value: 'missing', label: 'Por Localizar', color: 'destructive' },
  { value: 'found', label: 'Localizada', color: 'success' },
  { value: 'identified', label: 'Identificada', color: 'secondary' },
] as const;

export const BADGES = {
  VERDE: {
    value: 'verde',
    label: 'Verificado Alto',
    description: 'Verificado por autoridad oficial',
    color: 'badge-verde',
  },
  AMARILLO: {
    value: 'amarillo',
    label: 'Avalado',
    description: 'Confirmado por voluntario local',
    color: 'badge-amarillo',
  },
  AZUL: {
    value: 'azul',
    label: 'Voluntario Hogar',
    description: 'Persona ofreciendo su hogar para ayudar',
    color: 'badge-azul',
  },
} as const;

export const CIUDADES_PRINCIPALES = [
  'Cali',
  'Chocó',
  'Valle del Cauca',
  'Risaralda',
  'Pereira',
  'Quindío',
  'Bogotá',
  'Medellín',
  'Barranquilla',
  'Cartagena',
] as const;
