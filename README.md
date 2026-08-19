# 🆘 RutaDeAyuda

> Plataforma centralizada de ayuda humanitaria para Colombia tras el terremoto del 10 de agosto de 2026.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-45B0E5?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/Purpose-Humanitarian- green?logo=hand-helping-heart&logoColor=white)](https://github.com/your-repo/rutadeayuda)

---

## 📋 Tabla de Contenidos

- [🎯 Acerca del Proyecto](#-acerca-del-proyecto)
- [📦 Módulos](#-módulos)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🧪 Testing](#-testing)
- [🔒 Seguridad](#-seguridad)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

---

## 🎯 Acerca del Proyecto

**RutaDeAyuda** es una plataforma desarrollada para centralizar y facilitar la ayuda humanitaria en Colombia tras el terremoto del **10 de agosto de 2026** (Magnitud 7.4, San José del Palmar, Chocó).

Esta herramienta permite:

- 🔍 **Buscar y registrar** personas afectadas
- 📍 **Ubicar centros de acopio** y albergues cercanos
- ✅ **Verificar información** antes de compartirla
- 📊 **Acceder a datos sismológicos** en tiempo real
- 🆘 **Contactar servicios de emergencia** oficiales

---

## 📦 Módulos

| Módulo | Descripción | Icono |
|--------|-------------|-------|
| **Personas Desaparecidas** | Registro y búsqueda de personas afectadas por el terremoto | 👥 |
| **Centros de Acopio** | Ubicación de centros de ayuda y recolección de suministros | 📦 |
| **Albergues / Refugios** | Hospedaje temporal para afectados (badges Verde/Amarillo/Azul) | 🏠 |
| **Centro de Verificación** | Verificar información antes de compartirla | ✅ |
| **Datos USGS** | Información sismológica en tiempo real | 🌎 |
| **Emergencia** | Teléfonos y recursos oficiales de emergencia | 🆘 |

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Uso | Badge |
|------------|-----|-------|
| [Next.js 14](https://nextjs.org/) | Framework React con App Router | ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) |
| [React 18](https://react.dev/) | Librería UI | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) |
| [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático | ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript) |
| [TailwindCSS](https://tailwindcss.com/) | Estilos utility-first | ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss) |
| [Leaflet](https://leafletjs.com/) | Mapas interactivos | ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet) |

### Backend & Database

| Tecnología | Uso | Badge |
|------------|-----|-------|
| [Supabase](https://supabase.com/) | Backend completo (Postgres, Auth, Storage) | ![Supabase](https://img.shields.io/badge/Supabase-45B0E5?logo=supabase&logoColor=white) |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos relacional | ![Postgres](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql) |
| [Zod](https://zod.dev/) | Validación de esquemas | ![Zod](https://img.shields.io/badge/Zod-3.23-3E68FF?logo=zod) |

### Testing & Quality

| Tecnología | Uso | Badge |
|------------|-----|-------|
| [Vitest](https://vitest.dev/) | Tests unitarios | ![Vitest](https://img.shields.io/badge/Vitest-1.6-6E9F18?logo=vitest) |
| [Playwright](https://playwright.dev/) | Tests E2E | ![Playwright](https://img.shields.io/badge/Playwright-1.45-45DAFF?logo=playwright) |

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 20+
- **npm** o **pnpm**
- **Cuenta de Supabase** (gratuita en [supabase.com](https://supabase.com))

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/your-username/rutadeayuda.git
cd rutadeayuda

# 2. Instalar dependencias
npm install
# o si usas pnpm
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Generar tipos de base de datos
npm run db:generate

# 5. Ejecutar migraciones
npm run db-push

# 6. (Opcional) Poblar base de datos
npm run db:seed

# 7. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Variables de Entorno Requeridas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Opcional
NEXT_PUBLIC_USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1
```

---

## 📁 Estructura del Proyecto

```
rutadeayuda/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── personas/          # Módulo personas desaparecidas
│   │   ├── centros/           # Módulo centros de acopio
│   │   ├── albergues/         # Módulo albergues
│   │   ├── verificar/         # Centro de verificación
│   │   └── info/              # Información general
│   ├── components/
│   │   ├── ui/                # Componentes UI reutilizables
│   │   └── layout/            # Layout general (header, footer)
│   ├── lib/
│   │   ├── security/          # Seguridad (rate-limit, validation)
│   │   └── email/            # Envío de emails
│   └── types/                 # Tipos TypeScript
├── docs/                      # Documentación
├── supabase/                  # Migraciones de BD
├── scripts/                   # Scripts de utilidad
└── public/                    # Assets estáticos
```

### Estructura de Página Principal

```
/                    → Página de inicio
/personas            → Listado de personas desaparecidas
/personas/nuevo      → Registrar nueva persona
/centros             → Listado de centros de acopio
/centros/nuevo       → Registrar nuevo centro
/albergues           → Listado de albergues
/albergues/nuevo     → Registrar nuevo albergue
/verificar           → Centro de verificación
/info                → Información y recursos
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e

# Tests E2E con UI visual
npm run test:e2e:ui
```

---

## 🔒 Seguridad

Este proyecto sigue las guías **OWASP Top 10** para garantizar la protección de datos sensibles.

📄 Documentación:
- [SECURITY.md](./docs/SECURITY.md) — Políticas de seguridad
- [OWASP-TOP10.md](./docs/OWASP-TOP10.md) — Checklist OWASP

### Medidas Implementadas

- ✅ **Helmet.js** — Headers de seguridad HTTP
- ✅ **Zod** — Validación y sanitización de inputs
- ✅ **RLS (Row Level Security)** — Seguridad a nivel de fila en PostgreSQL
- ✅ **Rate Limiting** — Limitación de solicitudes por IP
- ✅ **Audit Logging** — Registro de acciones sensibles
- ✅ **CSP Headers** — Content Security Policy

---

## 🤝 Contribuir

¡Toda ayuda es bienvenida! Este es un proyecto humanitario y cada contribución cuenta.

```bash
# 1. Fork el repositorio

# 2. Crear una rama para tu feature
git checkout -b feature/nueva-funcionalidad

# 3. Realizar los cambios y commit
git commit -m "feat: descripción de la funcionalidad"

# 4. Push a tu rama
git push origin feature/nueva-funcionalidad

# 5. Abrir un Pull Request
```

Por favor, lee [docs/CLAUDE.md](./docs/CLAUDE.md) para conocer las convenciones del proyecto.

---

## 📄 Licencia

Este proyecto es **MIT** y está destinado exclusivamente a **uso humanitario**.

> **MIT License** — Uso exclusivamente humanitario. No se permite uso comercial sin autorización.

---

## 🙏 Créditos

**Equipo Voluntario Ciudadano** — Desarrollo y mantenimiento.

Para más información, consulta la [documentación completa](./docs/).

---

<p align="center">
  <strong>Hecho con ❤️ para Colombia</strong>
  <br>
  🆘 RutaDeAyuda — Uniendo fuerzas cuando más se necesita
</p>
