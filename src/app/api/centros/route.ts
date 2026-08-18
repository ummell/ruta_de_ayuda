import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { centroSchema } from '@/lib/validations';
import { validateInput } from '@/lib/security/validate-input';
import { createAuditLog } from '@/lib/security/audit-log';
import { rateLimit, getClientIdentifier } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:centros:get`, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get('ciudad');

  const supabase = createServerClient();
  let query = supabase.from('centros').select('*').order('created_at', { ascending: false }).limit(100);
  if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`);

  const { data, error } = await query;

  if (error) {
    console.error('[centros][GET] Error:', error);
    return NextResponse.json({ error: 'Error al consultar centros' }, { status: 500 });
  }

  return NextResponse.json({
    centros: data || [],
    pagination: {
      page: 1,
      limit: 100,
      total: data?.length || 0,
      totalPages: 1,
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:centros:post`, {
    maxRequests: 5,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let body: Record<string, unknown> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (!(value instanceof File)) {
          body[key] = value;
        }
      }
    } else if (contentType.includes('application/json')) {
      body = await request.json();
    }

    // El formulario de /centros/nuevo manda "queNecesitan"; la tabla/schema usan "necesidades".
    // Los campos opcionales vacíos llegan como null (JSON) — Zod optional() no acepta null, solo undefined.
    const normalized: Record<string, unknown> = {
      ...body,
      necesidades: body.necesidades || body.queNecesitan,
    };
    for (const key of ['horarios', 'telefono', 'whatsapp']) {
      if (normalized[key] === null) delete normalized[key];
    }

    const validation = validateInput(centroSchema, normalized);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', fieldErrors: validation.errors },
        { status: 400 }
      );
    }

    const d = validation.data;

    const { data: centro, error } = await createServerClient()
      .from('centros')
      .insert({
        nombre: d.nombre,
        direccion: d.direccion,
        ciudad: d.ciudad,
        necesidades: d.necesidades,
        horarios: d.horarios || null,
        telefono: d.telefono || null,
        whatsapp: d.whatsapp || null,
        badge: 'azul',
      })
      .select()
      .single();

    if (error) {
      console.error('[centros][POST] Error:', error);
      return NextResponse.json(
        { error: 'Error al guardar el registro', detail: error.message },
        { status: 500 }
      );
    }

    await createAuditLog({
      accion: 'create',
      tabla: 'centros',
      registro_id: centro.id,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || undefined,
      datos_nuevos: { nombre: d.nombre, ciudad: d.ciudad },
    });

    return NextResponse.json(
      { success: true, centro, message: 'Centro guardado' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[centros] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        detail: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
