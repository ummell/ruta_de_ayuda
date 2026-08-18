-- 011_publicaciones_oficiales.sql
-- Tabla de publicaciones oficiales curadas por el equipo

CREATE TABLE IF NOT EXISTS publicaciones_oficiales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL CHECK (length(titulo) >= 5),
  descripcion TEXT NOT NULL CHECK (length(descripcion) >= 10),
  imagen_url TEXT,
  fuente_nombre TEXT NOT NULL,
  fuente_url TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('alerta', 'comunicado', 'convocatoria', 'operativo')),
  ciudades TEXT[] DEFAULT '{}',
  prioridad INTEGER NOT NULL DEFAULT 0 CHECK (prioridad >= 0 AND prioridad <= 2),
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publicaciones_created_at ON publicaciones_oficiales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_publicaciones_activo ON publicaciones_oficiales(activo);
CREATE INDEX IF NOT EXISTS idx_publicaciones_prioridad ON publicaciones_oficiales(prioridad DESC);
CREATE INDEX IF NOT EXISTS idx_publicaciones_categorias ON publicaciones_oficiales(categoria);

-- RLS: lectura pública
ALTER TABLE publicaciones_oficiales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read publicaciones" ON publicaciones_oficiales;
CREATE POLICY "Public read publicaciones" ON publicaciones_oficiales
  FOR SELECT USING (activo = true);

-- Inserción/update solo service_role (admin vía SQL o futura admin UI)
-- No hay INSERT/UPDATE policy = solo service_role puede escribir

DROP TRIGGER IF EXISTS publicaciones_updated_at ON publicaciones_oficiales;
CREATE TRIGGER publicaciones_updated_at
  BEFORE UPDATE ON publicaciones_oficiales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE publicaciones_oficiales IS 'Publicaciones oficiales curadas a mano por el equipo. Lectura pública activa=true. Escritura solo service_role.';

-- Seed inicial con datos mock para que funcione desde el primer día
INSERT INTO publicaciones_oficiales (titulo, descripcion, fuente_nombre, fuente_url, categoria, ciudades, prioridad) VALUES
('Gobierno nacional despliega respuesta ante sismo en Chocó',
 'Presidente Abelardo De La Espriella lidera respuesta institucional. Sismo M7.4 con epicentro en San José del Palmar.',
 'UNGRD',
 'https://portal.gestiondelriesgo.gov.co/',
 'comunicado',
 ARRAY['Quibdó','Cali','Pereira','Manizales'], 2),

('Cruz Roja Colombiana activa respuesta',
 'Capacidades de respuesta y alistamiento activadas tras sismo M7.4. Donaciones abiertas por canal oficial.',
 'Cruz Roja Colombiana',
 'https://www.cruzrojacolombiana.org/cruz-roja-colombiana-despliega-capacidades-para-dar-respuesta-tras-las-afectaciones-por-sismo-en-colombia/',
 'operativo',
 ARRAY['Quibdó','Cali','Pereira'], 2),

('Bancos de sangre habilitados en Bogotá',
 'Ocho puntos de donación. Demanda de hemoderivados en Cali, Quibdó y Manizales supera la reposición.',
 'Secretaría de Salud Bogotá',
 'https://www.saludcapital.gov.co/',
 'convocatoria',
 ARRAY['Bogotá','Cali','Quibdó','Manizales'], 1),

('No se desplace a la zona afectada por su cuenta',
 'El voluntariado espontáneo sin coordinación satura corredores viales. Inscríbase y espere activación en el portal oficial.',
 'UNGRD',
 'https://portal.gestiondelriesgo.gov.co/',
 'alerta',
 ARRAY[]::TEXT[], 2),

('INVÍAS: Cali-Loboguerrero cerrada (PR 55)',
 'La Línea abierta con restricción de carriles. Para información vial en tiempo real, llame al #767.',
 'INVÍAS',
 'https://www.invias.gov.co/publicaciones/8709/reporte-de-emergencias/',
 'operativo',
 ARRAY['Cali','Buenaventura'], 1),

('Se buscan ingenieros y arquitectos para evaluación estructural',
 'CAMACOL, MinVivienda y UNGRD convocan a profesionales para acompañar evaluación post-sismo.',
 'CAMACOL',
 'https://www.camacol.co/',
 'convocatoria',
 ARRAY[]::TEXT[], 0);