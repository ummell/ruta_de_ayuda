import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('estado_operativo')
      .select('sector, estado, detalle, fuente_url, fuente_nombre, corte')
      .order('estado', { ascending: false });

    if (error || !data) {
      return NextResponse.json({ sectores: [] });
    }

    return NextResponse.json({ sectores: data });
  } catch {
    return NextResponse.json({ sectores: [] });
  }
}
