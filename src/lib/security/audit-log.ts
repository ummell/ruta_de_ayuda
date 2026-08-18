import { createServiceRoleClient } from '@/lib/db';

interface AuditEntry {
  accion: 'create' | 'update' | 'delete' | 'read';
  tabla: string;
  registro_id?: string;
  usuario_id?: string;
  ip_address?: string;
  user_agent?: string;
  datos_anteriores?: Record<string, unknown>;
  datos_nuevos?: Record<string, unknown>;
}

// audit_log no tiene policies públicas a propósito (ver 007_create_audit_log.sql):
// nadie debe poder leer ni forjar entradas de auditoría con la anon key.
// Este es el único uso legítimo de service_role fuera de scripts/cron: es
// metadata SOBRE la acción del usuario, no acceso a datos por el usuario.
export async function createAuditLog(entry: AuditEntry): Promise<void> {
  try {
    const supabase = createServiceRoleClient();
    await supabase.from('audit_log').insert({
      accion: entry.accion,
      tabla: entry.tabla,
      registro_id: entry.registro_id,
      usuario_id: entry.usuario_id,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      datos_anteriores: entry.datos_anteriores,
      datos_nuevos: entry.datos_nuevos,
    });
  } catch (error) {
    // Silent fail - don't block user actions for audit failures
    console.error('Failed to create audit log:', error);
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}
