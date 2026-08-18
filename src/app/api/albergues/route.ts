import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { albergueSchema } from '@/lib/validations';
import { validateInput, sanitizeText } from '@/lib/security/validate-input';
import { createAuditLog } from '@/lib/security/audit-log';
import { rateLimit, getClientIdentifier } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:albergues:get`, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get('ciudad');
  const badge = searchParams.get('badge');

  const supabase = createServerClient();
  let query = supabase.from('albergues').select('*').order('created_at', { ascending: false }).limit(100);
  if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`);
  if (badge) query = query.eq('badge', badge);

  const { data, error } = await query;

  if (error) {
    console.error('[albergues][GET] Error:', error);
    return NextResponse.json({ error: 'Error al consultar albergues' }, { status: 500 });
  }

  return NextResponse.json({
    albergues: data || [],
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
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:albergues:post`, {
    maxRequests: 5,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let body: Record<string, unknown> = {};
    let fotoDataUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (key === 'foto') {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(value.type)) {
              return NextResponse.json(
                { error: 'Tipo de archivo no permitido. Solo JPG, PNG o WebP.' },
                { status: 400 }
              );
            }
            if (value.size > 5 * 1024 * 1024) {
              return NextResponse.json(
                { error: 'La imagen es muy grande. Máximo 5MB.' },
                { status: 400 }
              );
            }
            const buffer = Buffer.from(await value.arrayBuffer());
            fotoDataUrl = `data:${value.type};base64,${buffer.toString('base64')}`;
          }
        } else {
          body[key] = value;
        }
      }
    } else if (contentType.includes('application/json')) {
      body = await request.json();
    }

    // El formulario de /albergues/nuevo manda "voluntarioNombre"; schema/DB usan "nombreVoluntario".
    const normalized = {
      ...body,
      nombreVoluntario: body.nombreVoluntario || body.voluntarioNombre,
    };

    const validation = validateInput(albergueSchema.omit({ foto: true }), normalized);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', fieldErrors: validation.errors },
        { status: 400 }
      );
    }

    const d = validation.data;

    const { data: albergue, error } = await createServerClient()
      .from('albergues')
      .insert({
        nombre_voluntario: d.nombreVoluntario,
        telefono: d.telefono,
        whatsapp: d.whatsapp || null,
        direccion: d.direccion,
        ciudad: d.ciudad,
        capacidad: d.capacidad,
        servicios: d.servicios ? sanitizeText(d.servicios) : null,
        reglas: d.reglas ? sanitizeText(d.reglas) : null,
        foto_url: fotoDataUrl,
        badge: 'azul',
        estado: 'abierto',
      })
      .select()
      .single();

    if (error) {
      console.error('[albergues][POST] Error:', error);
      return NextResponse.json(
        { error: 'Error al guardar el registro', detail: error.message },
        { status: 500 }
      );
    }

    await createAuditLog({
      accion: 'create',
      tabla: 'albergues',
      registro_id: albergue.id,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || undefined,
      datos_nuevos: { nombre_voluntario: d.nombreVoluntario, ciudad: d.ciudad },
    });

    return NextResponse.json(
      { success: true, albergue, message: 'Albergue guardado' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[albergues] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        detail: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
