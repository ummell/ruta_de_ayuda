-- 014_fix_edit_token_rpc_and_column_grants.sql
-- Corrige dos bugs de 012/013 encontrados al verificar contra la DB real vía MCP:
--
-- 1. marcar_persona_encontrada() estaba rota: pgcrypto vive en el schema
--    "extensions" en Supabase (no en "public"), y la función tenía
--    SET search_path = public — digest() nunca se resolvía. Se schema-
--    califica la llamada en vez de ensanchar el search_path.
--
-- 2. REVOKE SELECT (edit_token_hash) ... no tenía efecto: anon/authenticated
--    tenían SELECT a nivel de TABLA sobre personas (típico GRANT ALL de un
--    setup script), y un REVOKE de columna no puede pisar eso. Hay que
--    revocar la tabla completa y regrantear columna por columna.

CREATE OR REPLACE FUNCTION marcar_persona_encontrada(p_persona_id UUID, p_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_match BOOLEAN;
BEGIN
  SELECT (edit_token_hash = encode(extensions.digest(p_token::text, 'sha256'), 'hex'))
    INTO v_match
    FROM personas
    WHERE id = p_persona_id;

  IF v_match IS NOT TRUE THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token inválido');
  END IF;

  UPDATE personas SET estado = 'found' WHERE id = p_persona_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE SELECT ON personas FROM anon, authenticated;
GRANT SELECT (
  id, foto_url, nombre, apellido, edad, genero, documento, ultima_ubicacion,
  ciudad, fecha_desaparicion, estado, categoria, descripcion,
  reportante_nombre, reportante_telefono, reportante_relacion, badge,
  created_at, updated_at
) ON personas TO anon, authenticated;
-- edit_token_hash y reportante_email quedan fuera: el hash es el secreto de
-- la RPC (que lo lee como SECURITY DEFINER, sin pasar por estos grants);
-- reportante_email nunca fue parte de la lectura pública de personas.
