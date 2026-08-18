-- 013_lock_down_open_update_policies.sql
-- La DB real corrió un setup distinto a los migrations numerados (001-011
-- nunca se trackearon vía supabase db push — list_migrations daba vacío).
-- Verificado vía MCP: personas/centros/albergues tenían UPDATE USING(true)
-- — cualquiera con la anon key podía modificar cualquier fila, sin dueño,
-- sin token. Esto hacía irrelevante el fix de P0-003 en el código: daba
-- igual qué key usara la API, la RLS ya estaba abierta.

DROP POLICY IF EXISTS "Anyone can update personas" ON personas;
DROP POLICY IF EXISTS "Anyone can update centros" ON centros;
DROP POLICY IF EXISTS "Anyone can update albergues" ON albergues;

-- personas: la única vía de actualizar estado pasa a ser
-- marcar_persona_encontrada() (SECURITY DEFINER, valida hash de token).
-- centros/albergues: sin UPDATE policy pública = bloqueado por defecto.
-- Ningún endpoint de la app llama UPDATE en estas tablas hoy (confirmado:
-- solo GET/POST en centros y albergues), no rompe funcionalidad existente.

-- Re-revocar edit_token_hash: algo (probablemente un GRANT ALL posterior
-- del setup ad-hoc) reabrió el SELECT de columna que la migración 012
-- ya había revocado.
REVOKE SELECT (edit_token_hash) ON personas FROM anon, authenticated;
