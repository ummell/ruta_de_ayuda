export type BadgeAlbergue = 'verde' | 'amarillo' | 'azul';

export interface Albergue {
  id: string;
  nombre_voluntario: string;
  telefono: string;
  whatsapp: string | null;
  direccion: string;
  ciudad: string;
  capacidad: number;
  servicios: string | null;
  reglas: string | null;
  foto_url: string | null;
  badge: BadgeAlbergue;
  estado: 'abierto' | 'cerrado' | 'lleno';
  created_at: string;
  updated_at: string;
}

export interface AlbergueFormData {
  nombreVoluntario: string;
  telefono: string;
  whatsapp?: string;
  direccion: string;
  ciudad: string;
  capacidad: number;
  servicios?: string;
  reglas?: string;
  foto?: File;
}
