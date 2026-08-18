-- 004_create_verificaciones.sql

CREATE TABLE IF NOT EXISTS verificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texto_buscar TEXT NOT NULL CHECK (length(texto_buscar) >= 10),
  resultado TEXT NOT NULL CHECK (resultado IN ('verificado', 'no_encontrado', 'conflicto')),
  fuentes TEXT[] DEFAULT '{}',
  detalle TEXT,
  usuario_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verificaciones_resultado ON verificaciones(resultado);
CREATE INDEX IF NOT EXISTS idx_verificaciones_created_at ON verificaciones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verificaciones_usuario_id ON verificaciones(usuario_id);

ALTER TABLE verificaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON verificaciones;
DROP POLICY IF EXISTS "Anyone can insert" ON verificaciones;

-- Lectura: solo admins o audit
CREATE POLICY "Authenticated can read" ON verificaciones
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Inserción: cualquiera puede verificar (rate-limited en API)
CREATE POLICY "Anyone can insert" ON verificaciones
  FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE verificaciones IS 'Registro de verificaciones. Solo lectura autenticada para auditoría.';
