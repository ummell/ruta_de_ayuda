# OWASP Top 10 - Implementación

## A01: Broken Access Control
- Row Level Security en Supabase
- Verificación de ownership antes de modificar/eliminar
- Rate limiting por IP

## A02: Cryptographic Failures
- HTTPS obligatorio (TLS 1.2+)
- Variables de entorno para secrets
- Cookie flags: HttpOnly, Secure, SameSite

## A03: Injection
- Zod validation en TODOS los inputs
- Prepared statements via Supabase
- DOMPurify para sanitización HTML
- No eval() ni innerHTML

## A04: Insecure Design
- Threat modeling en diseño
- Anti-fraude: OTP, badges, moderación
- Rate limiting en registros
- Detección de duplicados

## A05: Security Misconfiguration
- Helmet.js headers
- Error handling sin stack traces
- CORS configurado

## A06: Vulnerable Components
- dependabot
- npm audit
- Versiones fijas en package.json

## A07: Auth Failures
- Supabase Auth
- OTP por SMS/email
- Account lockout
- Tokens con expiración

## A08: Data Integrity
- Validación de tipos de archivo
- Metadata extraction para fotos
- Whitelist de URLs

## A09: Logging
- Logs de auditoría
- Registro de intentos fallidos
- Alertas por patrones sospechosos

## A10: SSRF
- Whitelist de URLs (solo USGS)
- No redirects a URLs externas
- Validación de dominios