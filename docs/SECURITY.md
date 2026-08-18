# Política de Seguridad - RutaDeAyuda

## Divulgación Responsable

Para reportar vulnerabilidades, contacta a: [email por definir]

Respondemos en máximo 48 horas.

## Credenciales y Secrets

- NUNCA hacer commit de archivos .env
- NUNCA hardcodear API keys en código
- Usar exclusivamente variables de entorno
- Rotar credenciales cada 90 días

## Control de Acceso

- Row Level Security (RLS) en todas las tablas de Supabase
- Principio de menor privilegio
- Lectura pública, escritura autenticada para algunos módulos

## Datos Personales

- Solo recopilamos datos necesarios
- Consentimiento explícito antes de publicar
- Derecho al olvido (eliminación de datos)
- No vendemos datos a terceros

## Dependencias

- dependabot habilitado
- npm audit en CI/CD
- Actualizaciones de seguridad en <7 días

## Cumplimiento

- GDPR: consentimiento explícito
- Derecho al olvido
- No venta de datos