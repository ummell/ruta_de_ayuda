-- 006_create_avales.sql

CREATE TABLE IF NOT EXISTS avales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  albergue_id UUID NOT NULL REFERENCES albergues(id) ON DELETE CASCADE,
  voluntario_nombre TEXT NOT NULL CHECK (length(voluntario_nombre) >= 3),
  voluntario_telefono TEXT NOT NULL CHECK (length(voluntario_telefono) >= 7),
  confirmado BOOLEAN DEFAULT false,
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avales_albergue ON avales(albergue_id);
CREATE INDEX IF NOT EXISTS idx_avales_confirmado ON avales(confirmado);
CREATE INDEX IF NOT EXISTS idx_avales_creado_por ON avales(creado_por);

ALTER TABLE avales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON avales;
DROP POLICY IF EXISTS "Authenticated can insert" ON avales;

-- Avales son públicos para transparencia
CREATE POLICY "Public read access" ON avales
  FOR SELECT USING (true);

-- Solo autenticados pueden avalar
CREATE POLICY "Authenticated can insert" ON avales
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    creado_por = auth.uid()
  );

COMMENT ON TABLE avales IS 'Avales comunitarios para albergues. Lectura pública, inscripción autenticada.';
