import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, PERSONAS_PUBLIC_COLUMNS } from '@/lib/db';

export const dynamic = 'force-dynamic';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  let record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
    requestCounts.set(ip, record);
  }
  record.count++;
  return record.count <= maxRequests;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

const paramsSchema = z.object({ id: z.string().uuid() });

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const ip = getClientIP(request);
  if (!checkRateLimit(ip, 100, 60000)) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  const parsed = paramsSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('personas')
    .select(PERSONAS_PUBLIC_COLUMNS)
    .eq('id', parsed.data.id)
    .maybeSingle();

  if (error) {
    console.error('[personas/[id]][GET] Error:', error);
    return NextResponse.json({ error: 'Error al consultar persona' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 });
  }

  return NextResponse.json({ persona: data });
}
