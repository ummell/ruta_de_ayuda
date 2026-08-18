# Proyecto: RutaDeAyuda

## Contexto
Plataforma de ayuda humanitaria para Colombia tras el terremoto del 10 de agosto de 2026 (Magnitud 7.4, San José del Palmar, Chocó).

## Equipo
Equipo Voluntario Ciudadano

## Módulos
1. Personas Desaparecidas
2. Centros de Acopio
3. Albergues/Refugios (badges Verde/Amarillo/Azul)
4. Centro de Verificación
5. Datos USGS en tiempo real
6. Info y Emergencia

## Stack
- Next.js 14 (App Router)
- Supabase (PostgreSQL)
- TailwindCSS
- Leaflet (mapas)

## Seguridad
OWASP Top 10 compliant - ver docs/OWASP-TOP10.md

## Comandos
- `npm run dev` - desarrollo
- `npm run build` - producción
- `npm test` - tests unitarios
- `npm run test:e2e` - tests E2E con Playwright