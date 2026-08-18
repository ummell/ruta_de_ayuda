import { createBrowserClient } from '@supabase/ssr';

// anon/authenticated solo tienen SELECT por columna en personas (edit_token_hash
// y reportante_email quedan afuera, ver migración 014). PostgREST exige que
// select=* tenga privilegio de TABLA completa aunque tengas todas las columnas
// por separado — select('*') devuelve 42501 "permission denied". Hay que listar
// columnas explícitas en cualquier .select() (incluyendo el .select() vacío
// después de un .insert(), que también resuelve a *) contra esta tabla.
export const PERSONAS_PUBLIC_COLUMNS =
  'id,foto_url,nombre,apellido,edad,genero,documento,ultima_ubicacion,ciudad,fecha_desaparicion,estado,categoria,descripcion,reportante_nombre,reportante_telefono,reportante_relacion,badge,created_at,updated_at' as const;
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Cliente para uso en rutas API normales (server-side). Usa anon key: respeta RLS.
// No hay sesión de usuario en esta app (ver P0-003) — el contexto de auth.uid()
// siempre es NULL, cubierto por las políticas "auth.uid() IS NULL OR ...".
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Bypassa RLS. Reservado para scripts/cron aislados sin JWT de usuario final
// (seed, migraciones manuales). Nunca invocar desde rutas API de usuarios
// finales ni importar en código que corra en el browser.
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
