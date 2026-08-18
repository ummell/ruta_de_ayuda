export type BadgeCentro = 'verde' | 'amarillo' | 'azul';

export interface Centro {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  necesidades: string;
  horarios: string | null;
  telefono: string | null;
  whatsapp: string | null;
  badge: BadgeCentro;
  created_at: string;
  updated_at: string;
}

export interface CentroFormData {
  nombre: string;
  direccion: string;
  ciudad: string;
  necesidades: string;
  horarios?: string;
  telefono?: string;
  whatsapp?: string;
}
