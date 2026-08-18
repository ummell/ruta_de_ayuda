# Arquitectura - RutaDeAyuda

## Vista General

```
┌──────────────────────────────────────────────────────────────┐
│                        USUARIO                               │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                     NEXT.JS APP                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   PAGES    │  │  COMPONENTS │  │      API ROUTES    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────┬──────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────────┐ ┌──────────┐ ┌──────────────────────┐
│    SUPABASE     │ │   USGS   │ │    EXTERNAL APIs    │
│  ┌───────────┐  │ │   API    │ │  (Defensa Civil,    │
│  │ Postgres  │  │ └──────────┘ │   Cruz Roja)        │
│  │   Auth    │  │              └──────────────────────┘
│  │  Storage  │  │
│  │Edge Fncts │  │
│  └───────────┘  │
└─────────────────┘
```

## Componentes Principales

### Frontend (Next.js 14)
- App Router con Server Components
- TailwindCSS para estilos
- Leaflet para mapas
- React Hook Form + Zod para validación

### Backend (Supabase)
- PostgreSQL con RLS (Row Level Security)
- Auth para autenticación
- Storage para archivos (fotos)
- Edge Functions para lógica serverless

### APIs Externas
- USGS Earthquake API (datos sismológicos)
- APIs de Defensa Civil, Cruz Roja ( según disponibilidad)

## Flujo de Datos

1. Usuario interactúa con UI
2. API Route recibe request
3. Validación Zod (input sanitization)
4. Rate limiting check
5. Query a Supabase (con RLS)
6. Respuesta al usuario

## Seguridad

- Helmet.js para headers de seguridad
- Zod para validación de inputs
- RLS en todas las tablas
- Rate limiting por IP
- Audit logging