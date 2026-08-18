# RutaDeAyuda

Plataforma centralizada de ayuda humanitaria para Colombia tras el terremoto del 10 de agosto de 2026.

## Módulos

- **Personas Desaparecidas**: Registro y búsqueda de personas afectadas
- **Centros de Acopio**: Ubicación de centros de ayuda
- **Albergues/Refugios**: Hospedaje para afectados
- **Centro de Verificación**: Verificar información antes de compartir
- **Datos en Tiempo Real**: Información sismológica USGS
- **Emergencia**: Teléfonos y recursos oficiales

## Stack Tecnológico

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Maps**: Leaflet + OpenStreetMap
- **Testing**: Vitest, Playwright

## Requisitos

- Node.js 20+
- npm o pnpm
- Cuenta de Supabase

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd rutadeayuda

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migraciones de base de datos
npx supabase db push

# Iniciar desarrollo
npm run dev
```

## Seguridad

Este proyecto sigue las guías OWASP Top 10. Ver [SECURITY.md](./SECURITY.md) y [OWASP-TOP10.md](./OWASP-TOP10.md).

## Licencia

MIT - Uso exclusivamente humanitario.