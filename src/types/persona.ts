export type Genero = 'femenino' | 'masculino' | 'otro' | 'sin-especificar';

export type Categoria =
  | 'terremoto'
  | 'inundacion'
  | 'deslizamiento'
  | 'emergencia_hospitalaria'
  | 'persona_extraviada'
  | 'adulto_mayor'
  | 'menor_desaparecido'
  | 'discapacidad'
  | 'conflicto_familiar'
  | 'otra';

export type EstadoPersona = 'missing' | 'found' | 'identified';

export type BadgePersona = 'verde' | 'azul';

export interface Persona {
  id: string;
  foto_url: string | null;
  nombre: string;
  apellido: string;
  edad: number | null;
  genero: Genero;
  documento: string | null;
  ultima_ubicacion: string;
  ciudad: string;
  fecha_desaparicion: string;
  estado: EstadoPersona;
  categoria: Categoria;
  descripcion: string | null;
  reportante_nombre: string;
  reportante_telefono: string;
  reportante_relacion: 'familiar' | 'vecino' | 'otro';
  badge: BadgePersona;
  created_at: string;
  updated_at: string;
}

export interface PersonaFormData {
  foto?: File;
  nombre: string;
  apellido: string;
  edad?: number;
  genero: Genero;
  documento?: string;
  ultima_ubicacion: string;
  ciudad: string;
  fecha_desaparicion: string;
  categoria: Categoria;
  descripcion?: string;
  reportante_nombre: string;
  reportante_telefono: string;
  reportante_relacion: 'familiar' | 'vecino' | 'otro';
}
