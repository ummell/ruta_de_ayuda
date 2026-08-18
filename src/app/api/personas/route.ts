import { NextRequest, NextResponse } from 'next/server';
import { randomUUID, createHash } from 'crypto';
import { createServerClient, PERSONAS_PUBLIC_COLUMNS } from '@/lib/db';
import { personaSchema } from '@/lib/validations';
import { validateInput, sanitizeText } from '@/lib/security/validate-input';
import { sendEditTokenEmail } from '@/lib/email/send-edit-token-email';
import { createAuditLog } from '@/lib/security/audit-log';
import { rateLimit, getClientIdentifier } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:personas:get`, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta en un minuto.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const estado = searchParams.get('estado');
  const ciudad = searchParams.get('ciudad');
  const categoria = searchParams.get('categoria');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 100);

  const supabase = createServerClient();
  let query = supabase
    .from('personas')
    .select(PERSONAS_PUBLIC_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (estado) query = query.eq('estado', estado);
  if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`);
  if (categoria) query = query.eq('categoria', categoria);

  const { data, error, count } = await query;

  if (error) {
    console.error('[personas][GET] Error:', error);
    return NextResponse.json({ error: 'Error al consultar personas' }, { status: 500 });
  }

  return NextResponse.json({
    personas: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success: withinLimit } = rateLimit(`${getClientIdentifier(request)}:personas:post`, {
    maxRequests: 10,
    windowMs: 60000,
  });
  if (!withinLimit) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta en un minuto.' },
      { status: 429 }
    );
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

    const validation = validateInput(personaSchema.omit({ foto: true }), body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', fieldErrors: validation.errors },
        { status: 400 }
      );
    }

    const d = validation.data;

    // Token para marcar "encontrada" sin login (P0-003: nada de service_role acá).
    // Solo se guarda el hash; el token crudo va únicamente en el email, una vez.
    const editToken = randomUUID();
    const editTokenHash = createHash('sha256').update(editToken).digest('hex');

    const { data: persona, error } = await createServerClient()
      .from('personas')
      .insert({
        foto_url: fotoDataUrl,
        nombre: d.nombre,
        apellido: d.apellido,
        edad: d.edad ?? null,
        genero: d.genero,
        ultima_ubicacion: d.ultimaUbicacion,
        ciudad: d.ciudad,
        fecha_desaparicion: d.fechaDesaparicion,
        descripcion: d.descripcion ? sanitizeText(d.descripcion) : null,
        reportante_nombre: d.reportanteNombre,
        reportante_telefono: d.reportanteTelefono,
        reportante_email: d.reportanteEmail,
        reportante_relacion: d.reportanteRelacion,
        edit_token_hash: editTokenHash,
        badge: 'azul',
        estado: 'missing',
      })
      .select(PERSONAS_PUBLIC_COLUMNS)
      .single();

    if (error) {
      console.error('[personas][POST] Error:', error);
      return NextResponse.json(
        { error: 'Error al guardar el registro', detail: error.message },
        { status: 500 }
      );
    }

    await createAuditLog({
      accion: 'create',
      tabla: 'personas',
      registro_id: persona.id,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || undefined,
      datos_nuevos: { nombre: d.nombre, apellido: d.apellido, ciudad: d.ciudad, estado: 'missing' },
    });

    // No-bloqueante: si el email falla (o la key es placeholder), el reporte
    // ya está creado y la respuesta igual es 201. No perder un reporte de
    // persona desaparecida por un problema de envío de correo.
    try {
      await sendEditTokenEmail({
        to: d.reportanteEmail,
        personaNombre: `${d.nombre} ${d.apellido}`,
        editUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/reportes/marcar-encontrado?id=${persona.id}&token=${editToken}`,
      });
    } catch (emailError) {
      console.error('[personas][POST] Error enviando email de edit_token:', emailError);
    }

    return NextResponse.json(
      { success: true, persona, message: 'Registro guardado' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[personas] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        detail: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
