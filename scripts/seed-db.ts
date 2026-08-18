/**
 * Script to seed the database with sample data
 * Run: npx tsx scripts/seed-db.ts
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Seeding database...');

  // Sample centros
  const centros: {
    nombre: string;
    direccion: string;
    ciudad: string;
    necesidades: string;
    horarios: string;
    telefono?: string;
    badge: string;
  }[] = [
    {
      nombre: 'Centro Comunitario San Antonio',
      direccion: 'Calle 5 #12-34',
      ciudad: 'Cali',
      necesidades: 'Agua, alimentos no perecederos, medicamentos, cobijas',
      horarios: '8:00 AM - 8:00 PM',
      telefono: '6025551234',
      badge: 'verde',
    },
    {
      nombre: 'Iglesia Santa María',
      direccion: 'Carrera 10 #5-20',
      ciudad: 'Cali',
      necesidades: 'Agua, alimentos, ropa',
      horarios: '24 horas',
      badge: 'amarillo',
    },
  ];

  // Sample albergues
  const albergues = [
    {
      nombre_voluntario: 'María García',
      telefono: '3001234567',
      whatsapp: '573001234567',
      direccion: 'Carrera 15 #8-23, San Juan Bosco',
      ciudad: 'Cali',
      capacidad: 12,
      servicios: 'Hospedaje, alimentación básica',
      reglas: 'No fumar dentro de la casa',
      badge: 'azul',
      estado: 'abierto',
    },
  ];

  // Insert sample data
  for (const centro of centros) {
    const { error } = await supabase.from('centros').insert(centro);
    if (error) console.error('Error inserting centro:', error);
  }

  for (const albergue of albergues) {
    const { error } = await supabase.from('albergues').insert(albergue);
    if (error) console.error('Error inserting albergue:', error);
  }

  console.log('Database seeded!');
}

seedDatabase().catch(console.error);
