-- 003_create_albergues.sql

CREATE TABLE IF NOT EXISTS albergues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_voluntario TEXT NOT NULL CHECK (length(nombre_voluntario) >= 3),
  telefono TEXT NOT NULL CHECK (length(telefono) >= 7),
  whatsapp TEXT,
  direccion TEXT NOT NULL CHECK (length(direccion) >= 5),
  ciudad TEXT NOT NULL,
  capacidad INTEGER NOT NULL DEFAULT 1 CHECK (capacidad > 0 AND capacidad <= 10000),
  servicios TEXT,
  reglas TEXT,
  foto_url TEXT,
  reportado_por UUID REFERENCES auth.users(id),
  badge TEXT DEFAULT 'azul' CHECK (badge IN ('verde', 'amarillo', 'azul')),
  estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'cerrado', 'lleno')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_albergues_ciudad ON albergues(ciudad);
CREATE INDEX IF NOT EXISTS idx_albergues_badge ON albergues(badge);
CREATE INDEX IF NOT EXISTS idx_albergues_estado ON albergues(estado);
CREATE INDEX IF NOT EXISTS idx_albergues_created_at ON albergues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_albergues_reportado_por ON albergues(reportado_por);

ALTER TABLE albergues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON albergues;
DROP POLICY IF EXISTS "Authenticated users can insert" ON albergues;
DROP POLICY IF EXISTS "Owner can update" ON albergues;

CREATE POLICY "Public read access" ON albergues
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert" ON albergues
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR reportado_por = auth.uid()
  );

CREATE POLICY "Owner can update" ON albergues
  FOR UPDATE
  USING (reportado_por = auth.uid());

DROP TRIGGER IF EXISTS albergues_updated_at ON albergues;
CREATE TRIGGER albergues_updated_at
  BEFORE UPDATE ON albergues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE albergues IS 'Albergues y refugios. RLS: lectura pública, modificación solo dueño.';
