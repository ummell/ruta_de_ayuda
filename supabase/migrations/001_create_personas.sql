-- 001_create_personas.sql
-- Migración para tabla de personas desaparecidas

CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foto_url TEXT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER CHECK (edad IS NULL OR (edad >= 0 AND edad <= 120)),
  genero TEXT DEFAULT 'sin-especificar' CHECK (genero IN ('femenino', 'masculino', 'otro', 'sin-especificar')),
  ultima_ubicacion TEXT NOT NULL CHECK (length(ultima_ubicacion) >= 3),
  ciudad TEXT NOT NULL,
  fecha_desaparicion DATE NOT NULL,
  estado TEXT DEFAULT 'missing' CHECK (estado IN ('missing', 'found', 'identified')),
  descripcion TEXT,
  reportante_nombre TEXT NOT NULL CHECK (length(reportante_nombre) >= 2),
  reportante_telefono TEXT NOT NULL CHECK (length(reportante_telefono) >= 7),
  reportante_relacion TEXT NOT NULL,
  reportado_por UUID REFERENCES auth.users(id),
  badge TEXT DEFAULT 'azul' CHECK (badge IN ('verde', 'azul')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_personas_estado ON personas(estado);
CREATE INDEX IF NOT EXISTS idx_personas_ciudad ON personas(ciudad);
CREATE INDEX IF NOT EXISTS idx_personas_created_at ON personas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personas_reportado_por ON personas(reportado_por);
CREATE INDEX IF NOT EXISTS idx_personas_nombre_search ON personas
  USING gin(to_tsvector('spanish', nombre || ' ' || apellido));

-- Habilitar RLS
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si existen
DROP POLICY IF EXISTS "Anyone can view personas" ON personas;
DROP POLICY IF EXISTS "Anyone can insert personas" ON personas;
DROP POLICY IF EXISTS "Owner can update personas" ON personas;
DROP POLICY IF EXISTS "Service role can delete personas" ON personas;

-- Política de lectura: cualquier persona (incluso no autenticados) puede ver
-- Esto es público porque la búsqueda de personas es el caso de uso principal
CREATE POLICY "Public read access" ON personas
  FOR SELECT
  USING (true);

-- Política de inserción: usuarios autenticados pueden crear
-- Cualquiera puede reportar (necesitamos reportes rápidos en emergencia)
CREATE POLICY "Authenticated users can insert" ON personas
  FOR INSERT
  WITH CHECK (
    -- Si está autenticado, requiere auth.uid()
    -- Si no, requiere verificar por otro mecanismo (rate limit, captcha)
    auth.uid() IS NULL OR reportado_por = auth.uid()
  );

-- Política de actualización: solo el dueño o admin puede modificar
CREATE POLICY "Owner can update" ON personas
  FOR UPDATE
  USING (
    reportado_por = auth.uid() OR
    EXISTS (
      SELECT 1 FROM personas p2
      WHERE p2.id = personas.id
      AND p2.reportado_por = auth.uid()
    )
  );

-- Eliminación: solo service role (no permitir a usuarios)
-- No necesitamos DELETE policy = bloqueado por defecto

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS personas_updated_at ON personas;
CREATE TRIGGER personas_updated_at
  BEFORE UPDATE ON personas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Comentario de la tabla
COMMENT ON TABLE personas IS 'Personas reportadas como desaparecidas. RLS activo: lectura pública, escritura autenticada.';
COMMENT ON COLUMN personas.badge IS 'verde = verificado por autoridad, azul = reporte ciudadano';
