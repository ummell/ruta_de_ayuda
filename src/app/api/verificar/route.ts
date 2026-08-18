import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { sanitizeSearchInput } from '@/lib/security/validate-input';
import { rateLimit, getClientIdentifier } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para verificar información. Use POST con { texto: "..." }',
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:verificar:post`, {
    maxRequests: 20,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  try {
    const body = await request.json();

    if (!body.texto || typeof body.texto !== 'string' || body.texto.length < 10) {
      return NextResponse.json(
        { error: 'Texto requerido (mínimo 10 caracteres)' },
        { status: 400 }
      );
    }

    if (body.texto.length > 1000) {
      return NextResponse.json(
        { error: 'Texto demasiado largo (máximo 1000 caracteres)' },
        { status: 400 }
      );
    }

    const texto = body.texto.trim();
    // sanitizeSearchInput saca comillas/keywords SQL; ()/, además, porque
    // rompen la sintaxis de filtros .or() de PostgREST si se interpolan.
    const safeTexto = sanitizeSearchInput(texto).replace(/[(),]/g, ' ').trim();

    if (!safeTexto) {
      return NextResponse.json(
        { error: 'Texto requerido (mínimo 10 caracteres)' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const pattern = `%${safeTexto}%`;

    const [personasRes, centrosRes, alberguesRes] = await Promise.all([
      supabase
        .from('personas')
        .select('id,nombre,apellido,ultima_ubicacion')
        .or(`nombre.ilike.${pattern},apellido.ilike.${pattern},ultima_ubicacion.ilike.${pattern}`)
        .limit(5),
      supabase
        .from('centros')
        .select('id,nombre,direccion,ciudad')
        .or(`nombre.ilike.${pattern},direccion.ilike.${pattern},ciudad.ilike.${pattern}`)
        .limit(5),
      supabase
        .from('albergues')
        .select('id,nombre_voluntario,direccion,ciudad')
        .or(`nombre_voluntario.ilike.${pattern},direccion.ilike.${pattern},ciudad.ilike.${pattern}`)
        .limit(5),
    ]);

    if (personasRes.error || centrosRes.error || alberguesRes.error) {
      console.error(
        '[verificar] Error consultando Supabase:',
        personasRes.error || centrosRes.error || alberguesRes.error
      );
      return NextResponse.json({ error: 'Error al procesar la verificación' }, { status: 500 });
    }

    const personas = personasRes.data || [];
    const centros = centrosRes.data || [];
    const albergues = alberguesRes.data || [];
    const totalResultados = personas.length + centros.length + albergues.length;

    let resultado: 'verificado' | 'no_encontrado' | 'conflicto' = 'no_encontrado';
    let detalle = '';
    let mensaje = '';

    if (totalResultados > 0) {
      resultado = 'verificado';
      mensaje = `✅ Encontramos ${totalResultados} coincidencia(s) en nuestra base de datos.`;
      detalle = `Personas: ${personas.length} | Centros: ${centros.length} | Albergues: ${albergues.length}`;
    } else {
      mensaje = '⚠️ No encontramos esta información en nuestra base de datos.';
      detalle = 'Te recomendamos verificar con fuentes oficiales antes de compartir.';
    }

    // Registro de auditoría. No bloquea la respuesta si falla.
    try {
      await supabase.from('verificaciones').insert({
        texto_buscar: texto.slice(0, 1000),
        resultado,
        fuentes: ['personas', 'centros', 'albergues'],
        detalle,
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || null,
      });
    } catch (auditError) {
      console.error('[verificar] Error registrando verificación:', auditError);
    }

    return NextResponse.json({
      resultado,
      mensaje,
      detalle,
      data: { personas, centros, albergues },
      fuentes: ['base_datos_supabase'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[verificar] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la verificación',
        detail: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
