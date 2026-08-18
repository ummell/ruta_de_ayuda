-- 002_create_centros.sql

CREATE TABLE IF NOT EXISTS centros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL CHECK (length(nombre) >= 3),
  direccion TEXT NOT NULL CHECK (length(direccion) >= 5),
  ciudad TEXT NOT NULL,
  necesidades TEXT NOT NULL CHECK (length(necesidades) >= 3),
  horarios TEXT,
  telefono TEXT CHECK (telefono IS NULL OR length(telefono) >= 7),
  whatsapp TEXT,
  reportado_por UUID REFERENCES auth.users(id),
  badge TEXT DEFAULT 'azul' CHECK (badge IN ('verde', 'amarillo', 'azul')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_centros_ciudad ON centros(ciudad);
CREATE INDEX IF NOT EXISTS idx_centros_badge ON centros(badge);
CREATE INDEX IF NOT EXISTS idx_centros_created_at ON centros(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_centros_reportado_por ON centros(reportado_por);

ALTER TABLE centros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON centros;
DROP POLICY IF EXISTS "Authenticated users can insert" ON centros;
DROP POLICY IF EXISTS "Owner can update" ON centros;

-- Lectura pública
CREATE POLICY "Public read access" ON centros
  FOR SELECT USING (true);

-- Inserción autenticada
CREATE POLICY "Authenticated users can insert" ON centros
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR reportado_por = auth.uid()
  );

-- Actualización: dueño o admin
CREATE POLICY "Owner can update" ON centros
  FOR UPDATE
  USING (reportado_por = auth.uid());

DROP TRIGGER IF EXISTS centros_updated_at ON centros;
CREATE TRIGGER centros_updated_at
  BEFORE UPDATE ON centros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE centros IS 'Centros de acopio. RLS: lectura pública, modificación solo dueño.';
