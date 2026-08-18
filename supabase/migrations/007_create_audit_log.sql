-- 007_create_audit_log.sql

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accion TEXT NOT NULL CHECK (accion IN ('create', 'read', 'update', 'delete', 'login', 'logout')),
  tabla TEXT NOT NULL,
  registro_id UUID,
  usuario_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_tabla ON audit_log(tabla);
CREATE INDEX IF NOT EXISTS idx_audit_log_accion ON audit_log(accion);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_usuario_id ON audit_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_ip_address ON audit_log(ip_address);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Solo service role puede leer/insertar audit logs
-- No se crean policies públicas
-- Esto bloquea todo acceso desde anon/key

COMMENT ON TABLE audit_log IS 'Logs de auditoría. Acceso SOLO para service role. RLS bloquea usuarios.';
