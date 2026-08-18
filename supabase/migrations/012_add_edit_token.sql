-- 012_add_edit_token.sql
-- Edit token: permite a reportantes anónimos marcar una persona como
-- encontrada sin login, vía token entregado por email (una sola vez).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE personas
  ADD COLUMN IF NOT EXISTS reportante_email TEXT,
  ADD COLUMN IF NOT EXISTS edit_token_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_personas_edit_token_hash ON personas(edit_token_hash);

-- El hash no debe quedar legible vía la política pública de SELECT (USING (true)).
-- Defensa en profundidad: aunque el hash no es reversible, no hay razón para
-- que sea visible vía GET /api/personas.
REVOKE SELECT (edit_token_hash) ON personas FROM anon, authenticated;

-- Valida el token por hash y marca la persona como encontrada.
-- SECURITY DEFINER: único bypass de RLS permitido, acotado a esta acción
-- puntual (ya validada por el hash), en vez de service_role en toda la API.
CREATE OR REPLACE FUNCTION marcar_persona_encontrada(p_persona_id UUID, p_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_match BOOLEAN;
BEGIN
  SELECT (edit_token_hash = encode(digest(p_token::text, 'sha256'), 'hex'))
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

REVOKE ALL ON FUNCTION marcar_persona_encontrada(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION marcar_persona_encontrada(UUID, UUID) TO anon, authenticated;

COMMENT ON FUNCTION marcar_persona_encontrada IS
  'SECURITY DEFINER: valida token por hash y actualiza estado. Único bypass de RLS permitido, acotado a esta acción.';
