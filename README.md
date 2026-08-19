<div align="center">

# 🆘 RutaDeAyuda

**Plataforma centralizada de ayuda humanitaria para Colombia tras el terremoto del 10 de agosto de 2026**

[![Next.js](https://img.shields.io/badge/Next.js-14-1E40AF?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-1E40AF?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-0D9488?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-0D9488?logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-1E40AF?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-0D9488?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-F59E0B?logo=playwright&logoColor=white)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-1E40AF?logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)
[![Purpose](https://img.shields.io/badge/Uso-Humanitario-F59E0B?logo=hand-helping-heart&logoColor=white)](#)

Sistema de gestión de personas afectadas, centros de acopio, albergues y verificación de información para la emergencia por el terremoto del 10 de agosto de 2026 (Magnitud 7.4, San José del Palmar, Chocó).

</div>

---

## Pitch y propuesta de valor

**RutaDeAyuda** es una plataforma multiplataforma diseñada para centralizar y facilitar la ayuda humanitaria en Colombia tras el terremoto del **10 de agosto de 2026**.

El sistema permite a afectados y familiares consultar la disponibilidad de albergues en tiempo real, localizar centros de acopio cercanos, registrar personas desaparecidas, verificar información antes de compartirla y acceder a datos sismológicos oficiales. Los voluntarios y coordinadores cuentan con herramientas para gestionar recursos, actualizar estados y coordinar la ayuda de manera eficiente.

Transforma la respuesta a emergencias reemplazando procesos manuales y fragmentados por procedimientos automatizados que mejoran la organización, reducen la desinformación y aumentan la eficiencia en la entrega de ayuda a quienes más la necesitan.

---

## Paleta de diseño

| Token | Hex | Uso |
|-------|-----|-----|
| **Nexora Blue** (Primary) | `#1E40AF` | Identidad, headings, badges principales, CTAs primarios |
| **Tecno Teal** (Primary) | `#0D9488` | Componentes secundarios, badges de stack tecnológico |
| **Smart Amber** (Accent) | `#F59E0B` | Acentos, alertas, badges de emergencia |
| **Cloud Gray** (Background) | `#F3F4F6` | Fondos, secciones, contrastes suaves |
| **Slate Gray** (Text) | `#6B7280` | Texto secundario, metadata, descripciones |
| **Alert Red** (Emergency) | `#DC2626` | Estados críticos, emergencias |
| **Success Green** (Available) | `#16A34A` | Disponible, verificado |
| **Warning Yellow** (Limited) | `#CA8A04` | Limitado, precaución |

---

## Arquitectura del sistema

```mermaid
graph TD;
    A["Ciudadano / Afectado"] -->|"HTTPS"| B("Frontend: Next.js 14 App Router")
    B -->|"Server Actions / Route Handlers"| C("Supabase Edge Functions: Deno")
    B -->|"RLS + Policies"| D[("PostgreSQL 15")]
    B -->|"Auth + Sessions"| E[("Supabase Auth")]
    C -->|"Validación datos"| D
    C -->|"Envío de notificaciones"| D
    C -->|"Verificación USGS"| F["USGS Earthquake API"]
    C -->|"Recursos oficiales"| G["Defensa Civil / Cruz Roja"]
    E -->|"JWT + Cookies HTTP-only"| B
    D -->|"Audit Logging"| H["Registro de auditoría"]
```

### Capas de la solución

| Capa | Tecnología | Responsabilidad |
|------|-----------|-----------------|
| Presentación | Next.js 14 (App Router) + Tailwind + shadcn/ui | UI responsiva, mapas interactivos, modo offline consulta |
| Validación cliente | Zod + React Hook Form | Validación de formularios antes de enviar |
| API - Lógica transaccional | Supabase Edge Functions (Deno) | Personas, centros, albergues, verificación |
| Datos | PostgreSQL 15 (Supabase) | Esquema, RLS, constraints, vistas |
| Autorización | RLS policies | Control de acceso por rol en base de datos |
| Autenticación | Supabase Auth | JWT, sesiones, recuperación de contraseña |
| Maps | Leaflet + OpenStreetMap | Ubicaciones geográficas |
| Testing | Vitest + Playwright | Unit/integration + E2E |

---

## Stack tecnológico

### Frontend

- **Framework:** Next.js 14.2+ (App Router, Server Components, Streaming)
- **Lenguaje:** TypeScript 5.5 (`strict: true`)
- **Estilos:** Tailwind CSS 3.4 + shadcn/ui (componentes Radix)
- **Mapas:** Leaflet + OpenStreetMap
- **Iconografía:** `lucide-react` (sin emojis, SVG)

### Backend

- **Base de datos:** PostgreSQL 15 (Supabase) con RLS habilitado
- **Auth:** Supabase Auth (JWT + HTTP-only cookies)
- **Funciones serverless:** Supabase Edge Functions (Deno)
- **Validación:** Zod (esquemas compartidos cliente/servidor)
- **Email:** Resend (notificaciones)
- **Datos sismológicos:** USGS Earthquake API

### Testing y calidad

- **Unit/Integration:** Vitest + `@vitest/coverage-v8`
- **E2E:** Playwright (chromium, firefox, webkit)

---

## Módulos funcionales

| # | Módulo | Descripción | Funcionalidades |
|---|--------|-------------|-----------------|
| M1 | Personas Desaparecidas | Registro y búsqueda de afectados | Registro con foto, búsqueda por nombre/ubicación, estado de búsqueda |
| M2 | Centros de Acopio | Ubicación de centros de ayuda | Mapa interactivo, necesidades actuales, contacto directo |
| M3 | Albergues / Refugios | Hospedaje temporal para afectados | Badges disponibilidad (Verde/Amarillo/Azul), capacidad, registro |
| M4 | Centro de Verificación | Validación de información | Verificación antes de publicar, prevención desinformación |
| M5 | Datos USGS | Información sismológica en tiempo real | Sismogramas, réplicas, información de seguridad |
| M6 | Emergencia | Servicios de emergencia | Directorio telefónico, procedimientos, enlaces oficiales |

---

## Estructura del repositorio

```
rutadeayuda/
|
+- src/
|   +- app/                      # Next.js 14 (App Router)
|       +- (auth)/               # Autenticación
|       +- personas/             # Módulo personas desaparecidas
|       +- centros/              # Módulo centros de acopio
|       +- albergues/           # Módulo albergues
|       +- verificar/            # Centro de verificación
|       +- info/                 # Información general
|       +- api/                  # API Routes
|   +- components/
|       +- ui/                   # shadcn/ui components
|       +- layout/               # Header, footer, layouts
|   +- lib/
|       +- supabase/             # client.ts, server.ts, middleware.ts
|       +- security/             # rate-limit, validation, audit-log
|       +- email/                # Email sending
|       +- utils.ts              # Helpers
|   +- types/                    # TypeScript types
|
+- supabase/
|   +- migrations/               # SQL migrations
|   +- functions/               # Edge Functions Deno
|
+- docs/
|   +- ARCHITECTURE.md          # Diagramas y arquitectura
|   +- SECURITY.md              # Políticas de seguridad
|   +- OWASP-TOP10.md           # Checklist OWASP
|   +- CLAUDE.md                # Convenciones del proyecto
|
+- public/                      # Assets estáticos
```

---

## Inicio rápido (desarrollo)

### Requisitos previos

| Herramienta | Versión | Instalación |
|-------------|---------|-------------|
| Node.js | >=20 | [nodejs.org](https://nodejs.org) |
| npm o pnpm | latest | Ya incluido con Node.js |
| Cuenta de Supabase | - | [supabase.com](https://supabase.com) |

### Configuración

```bash
# 1) Clonar el repositorio
git clone https://github.com/ummell/ruta_de_ayuda.git
cd rutadeayuda

# 2) Variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 3) Instalar dependencias
npm install
# o si usas pnpm
pnpm install

# 4) Generar tipos de base de datos
npm run db:generate

# 5) Ejecutar migraciones
npm run db:push

# 6) (Opcional) Poblar base de datos
npm run db:seed

# 7) Iniciar servidor de desarrollo
npm run dev

# 8) Abrir en el navegador
open http://localhost:3000
```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (puerto 3000) |
| `npm run build` | Build de producción Next.js |
| `npm run start` | Serve del build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (unit + integration) |
| `npm run test:coverage` | Coverage V8 |
| `npm run test:e2e` | Playwright E2E |
| `npm run test:e2e:ui` | Playwright E2E con UI visual |
| `npm run db:generate` | Genera tipos TypeScript de Supabase |
| `npm run db:push` | Ejecuta migraciones |
| `npm run db:seed` | Pobla base de datos |

---

## Seguridad

Este proyecto sigue las guías **OWASP Top 10** para garantizar la protección de datos sensibles.

### Medidas implementadas

| Medida | Descripción |
|--------|-------------|
| Helmet.js | Headers de seguridad HTTP |
| Zod | Validación y sanitización de inputs |
| RLS | Row Level Security en PostgreSQL |
| Rate Limiting | Limitación de solicitudes por IP |
| Audit Logging | Registro de acciones sensibles |
| CSP Headers | Content Security Policy |

Documentación detallada en [`docs/SECURITY.md`](./docs/SECURITY.md) y [`docs/OWASP-TOP10.md`](./docs/OWASP-TOP10.md).

---

## Equipo

<div align="center">

**Equipo Voluntario Ciudadano**

Desarrollo y mantenimiento

</div>

---

## Créditos

Este proyecto es **MIT** y está destinado exclusivamente a **uso humanitario**.

Para más información, consulta la [documentación completa](./docs/).

---

<div align="center">

**Desarrollado con ❤️ para Colombia**

🆘 RutaDeAyuda — Uniendo fuerzas cuando más se necesita

**Sistema desarrollado para la emergencia del terremoto — Agosto 2026**

</div>
