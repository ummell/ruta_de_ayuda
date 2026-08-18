import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/db';
import { rateLimit, getClientIdentifier } from '@/lib/security/rate-limit';
import { createAuditLog, getClientIP } from '@/lib/security/audit-log';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  id: z.string().uuid(),
  token: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const { success: withinLimit } = rateLimit(identifier, { maxRequests: 20, windowMs: 60000 });
  if (!withinLimit) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta en un minuto.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enlace inválido' }, { status: 400 });
  }

  const { id, token } = parsed.data;

  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('marcar_persona_encontrada', {
    p_persona_id: id,
    p_token: token,
  });

  if (error) {
    console.error('[marcar-encontrado] Error RPC:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }

  if (!data?.success) {
    return NextResponse.json({ error: data?.error || 'Token inválido' }, { status: 403 });
  }

  await createAuditLog({
    accion: 'update',
    tabla: 'personas',
    registro_id: id,
    ip_address: getClientIP(request),
    user_agent: request.headers.get('user-agent') || undefined,
    datos_nuevos: { estado: 'found' },
  });

  return NextResponse.json({ success: true });
}
