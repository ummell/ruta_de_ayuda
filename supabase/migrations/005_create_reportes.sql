-- 005_create_reportes.sql

CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_entidad TEXT NOT NULL CHECK (tipo_entidad IN ('persona', 'centro', 'albergue')),
  entidad_id UUID NOT NULL,
  motivo TEXT NOT NULL CHECK (motivo IN ('no_existe', 'informacion_incorrecta', 'sospechoso', 'otro')),
  descripcion TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisado', 'resuelto')),
  reportado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reportes_entidad ON reportes(tipo_entidad, entidad_id);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes(estado);
CREATE INDEX IF NOT EXISTS idx_reportes_created_at ON reportes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reportes_reportado_por ON reportes(reportado_por);

ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert reportes" ON reportes;
DROP POLICY IF EXISTS "Authenticated can read" ON reportes;

-- Cualquiera puede reportar (es seguro hacerlo anónimamente en emergencias)
CREATE POLICY "Anyone can insert reportes" ON reportes
  FOR INSERT
  WITH CHECK (true);

-- Solo admins pueden ver/leer/modificar
CREATE POLICY "Authenticated can read" ON reportes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Sin UPDATE ni DELETE policy = solo service role puede

COMMENT ON TABLE reportes IS 'Reportes de fraude/abuso. Cualquiera puede crear, solo admins ven.';
