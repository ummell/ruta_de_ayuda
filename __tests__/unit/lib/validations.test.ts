import { describe, it, expect } from 'vitest';
import { personaSchema, centroSchema, albergueSchema, verificacionSchema } from '@/lib/validations';

describe('personaSchema', () => {
  it('validates a correct persona', () => {
    const validPersona = {
      nombre: 'María',
      apellido: 'García',
      edad: 30,
      genero: 'femenino' as const,
      ultimaUbicacion: 'Cali, Valle',
      ciudad: 'Cali',
      fechaDesaparicion: '2026-08-10',
      categoria: 'terremoto' as const,
      reportanteNombre: 'Juan Pérez',
      reportanteTelefono: '3001234567',
      reportanteEmail: 'juan@example.com',
      reportanteRelacion: 'familiar' as const,
    };

    const result = personaSchema.safeParse(validPersona);
    expect(result.success).toBe(true);
  });

  it('rejects short names', () => {
    const invalidPersona = {
      nombre: 'M',
      apellido: 'García',
      genero: 'femenino' as const,
      ultimaUbicacion: 'Cali',
      ciudad: 'Cali',
      fechaDesaparicion: '2026-08-10',
      categoria: 'terremoto' as const,
      reportanteNombre: 'Juan',
      reportanteTelefono: '3001234567',
      reportanteRelacion: 'familiar' as const,
    };

    const result = personaSchema.safeParse(invalidPersona);
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone numbers', () => {
    const invalidPersona = {
      nombre: 'María',
      apellido: 'García',
      genero: 'femenino' as const,
      ultimaUbicacion: 'Cali',
      ciudad: 'Cali',
      fechaDesaparicion: '2026-08-10',
      categoria: 'terremoto' as const,
      reportanteNombre: 'Juan',
      reportanteTelefono: '123', // too short
      reportanteRelacion: 'familiar' as const,
    };

    const result = personaSchema.safeParse(invalidPersona);
    expect(result.success).toBe(false);
  });
});

describe('centroSchema', () => {
  it('validates a correct centro', () => {
    const validCentro = {
      nombre: 'Centro de Acopio San Antonio',
      direccion: 'Calle 5 #12-34',
      ciudad: 'Cali',
      necesidades: 'Agua, alimentos',
    };

    const result = centroSchema.safeParse(validCentro);
    expect(result.success).toBe(true);
  });

  it('rejects short addresses', () => {
    const invalidCentro = {
      nombre: 'Centro',
      direccion: 'Cll', // too short
      ciudad: 'Cali',
      necesidades: 'Agua',
    };

    const result = centroSchema.safeParse(invalidCentro);
    expect(result.success).toBe(false);
  });
});

describe('albergueSchema', () => {
  it('validates a correct albergue', () => {
    const validAlbergue = {
      nombreVoluntario: 'María García',
      telefono: '3001234567',
      direccion: 'Carrera 15 #8-23',
      ciudad: 'Cali',
      capacidad: 10,
    };

    const result = albergueSchema.safeParse(validAlbergue);
    expect(result.success).toBe(true);
  });

  it('rejects zero capacity', () => {
    const invalidAlbergue = {
      nombreVoluntario: 'María',
      telefono: '3001234567',
      direccion: 'Carrera 15',
      ciudad: 'Cali',
      capacidad: 0,
    };

    const result = albergueSchema.safeParse(invalidAlbergue);
    expect(result.success).toBe(false);
  });
});

describe('verificacionSchema', () => {
  it('validates correct verificacion text', () => {
    const validVerificacion = {
      texto: 'Centro de acopio en el parque central de Cali',
    };

    const result = verificacionSchema.safeParse(validVerificacion);
    expect(result.success).toBe(true);
  });

  it('rejects short text', () => {
    const invalidVerificacion = {
      texto: 'Cali',
    };

    const result = verificacionSchema.safeParse(invalidVerificacion);
    expect(result.success).toBe(false);
  });
});
