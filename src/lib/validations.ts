import { z } from 'zod';

// Persona Schema
export const personaSchema = z.object({
  foto: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Máximo 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Solo JPG, PNG o WebP'
    )
    .optional(),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  apellido: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  edad: z.coerce.number().min(0).max(120).optional(),
  genero: z.enum(['femenino', 'masculino', 'otro', 'sin-especificar']),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  ultimaUbicacion: z.string().min(5, 'Especifica ciudad y zona'),
  fechaDesaparicion: z.string().min(1, 'Fecha requerida'),
  descripcion: z.string().max(500).optional(),
  // Datos del reportante
  reportanteNombre: z.string().min(2, 'Tu nombre es requerido'),
  reportanteTelefono: z.string().min(10, 'Teléfono inválido'),
  reportanteEmail: z.string().email('Email inválido'),
  reportanteRelacion: z.enum([
    'familiar',
    'madre-padre',
    'hijo-hija',
    'hermano-hermana',
    'abuelo-abuela',
    'nieto-nieta',
    'tio-tia',
    'sobrino-sobrina',
    'primo-prima',
    'esposo-esposa',
    'pareja',
    'amigo-amiga',
    'vecino',
    'conocido',
    'colega-trabajo',
    'otro',
  ]),
});

export type PersonaInput = z.infer<typeof personaSchema>;

// Centro Schema
export const centroSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  direccion: z.string().min(5, 'Dirección requerida').max(300),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  necesidades: z.string().max(500),
  horarios: z.string().max(200).optional(),
  telefono: z.string().min(10).optional(),
  whatsapp: z.string().min(10).optional(),
});

export type CentroInput = z.infer<typeof centroSchema>;

// Albergue Schema
export const albergueSchema = z.object({
  nombreVoluntario: z.string().min(3, 'Nombre requerido').max(100),
  telefono: z.string().min(10, 'Teléfono requerido'),
  whatsapp: z.string().optional(),
  direccion: z.string().min(5, 'Dirección requerida').max(300),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  capacidad: z.coerce.number().min(1).max(10000),
  servicios: z.string().max(500).optional(),
  reglas: z.string().max(500).optional(),
  foto: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Máximo 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Solo JPG, PNG o WebP'
    )
    .optional(),
});

export type AlbergueInput = z.infer<typeof albergueSchema>;

// Verificacion Schema
export const verificacionSchema = z.object({
  texto: z.string().min(10, 'Mínimo 10 caracteres').max(1000),
});

export type VerificacionInput = z.infer<typeof verificacionSchema>;
