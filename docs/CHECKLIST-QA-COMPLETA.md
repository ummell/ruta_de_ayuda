# Auditoría QA — Proyecto RutaDeAyuda

**Fecha**: 2026-08-16
**Stack**: Next.js 14 (App Router) + Supabase + Tailwind + TypeScript + Playwright + Vitest
**Veredicto**: ❌ **NO listo para producción** — maneja datos sensibles de damnificados.

---

## Resumen

| Severidad | Cantidad |
|---|---|
| **P0** (bloqueantes) | 9 |
| **P1** (importantes) | 11 |
| **P2** (mejoras) | 7 |
| **P3** (nice-to-have) | 5 |
| **Total** | **32** |

---

## 🔴 P0 — Bloqueantes (corregir ANTES de deploy)

### P0-001 — `.env` con secrets commiteado
- **Archivo**: `.env` (líneas 4-6)
- **Problema**: contiene `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en disco.
- **Riesgo**: service role key tiene bypass total de RLS; comprometido = lectura/escritura total de la DB real.
- **Fix**:
  1. Rotar anon key y service role key en Supabase dashboard **HOY**.
  2. Borrar `.env` del disco.
  3. Mantener solo `.env.example`.

### P0-002 — `supabase/SETUP_FINAL.sql` corrupto
- **Archivo**: `supabase/SETUP_FINAL.sql` (líneas 226-463)
- **Problema**: línea 226 truncada a `'N================================`; bloque `CREATE TABLE audit_log` (227-263) insertado entre policies; segunda copia duplicada (341-463); dos mensajes "setup complete".
- **Riesgo**: ejecutar tal cual → error de sintaxis. El check "[x] Aplicar SETUP_FINAL.sql" del checklist es **falso**.
- **Fix**: eliminar líneas 226-336 y 340-463; ejecutar las migrations numeradas en su lugar.

### P0-003 — `createServerClient()` usa service role y bypassa TODAS las RLS
- **Archivo**: `src/lib/db.ts:11-18`
- **Problema**: server client usa `SUPABASE_SERVICE_ROLE_KEY` → RLS no se evalúa en ninguna ruta API.
- **Riesgo**: vandalismo masivo, fuga de teléfonos de reportantes, sin audit trail real.
- **Fix**: usar `@supabase/ssr` `createServerClient` con `cookies()` + anon key. Reservar service_role solo para seed/cron.

### P0-004 — `audit_log` nunca se escribe desde las rutas API
- **Archivo**: `src/lib/security/audit-log.ts` + ausencia de uso en `src/app/api/**`
- **Problema**: `grep -rn createAuditLog src/app/api` = 0 hits. La función existe pero no se llama.
- **Riesgo**: OWASP "Logs de auditoría" incumplido. Sin trazabilidad en emergencia.
- **Fix**: llamar `createAuditLog({accion, tabla, registro_id, ip, ua})` después de cada insert exitoso en `/api/personas`, `/api/centros`, `/api/albergues`, `/api/verificar`.

### P0-005 — `/api/verificar` lee de `/tmp` pero los POST escriben en Supabase
- **Archivo**: `src/app/api/verificar/route.ts:2, 66-87`
- **Problema**: importa `getPersonasStore` etc. de `@/lib/store` (JSON en `/tmp`) → siempre devuelve "no_encontrado". Además en serverless `/tmp` se borra entre invocaciones.
- **Riesgo**: feature crítica de "verificar si alguien está reportado" rota en producción, genera desconfianza activa.
- **Fix**: reescribir con `supabase.from('personas').select(...).or('nombre.ilike...,apellido.ilike...')` previa sanitización. Actualizar UI en `src/app/verificar/page.tsx`.

### P0-006 — `src/lib/store.ts` es código muerto en producción
- **Archivo**: `src/lib/store.ts` (todo, 113 líneas)
- **Problema**: `fs.writeFileSync('/tmp/rutadeayuda-data/...')` no funciona en serverless.
- **Riesgo**: persistencia falsa que puede engañar a devs.
- **Fix**: eliminar el archivo completo. Mantener solo si se usa explícitamente para demo local con Node persistente, marcado claramente.

### P0-007 — Directorio literal `src/lib/{security}` huérfano
- **Archivo**: `src/lib/{security}/` (directorio con llaves literales en el nombre)
- **Problema**: directorio vacío de 4KB. Artefacto de template literal o creación accidental. **Peligroso**: comandos como `rm -rf src/lib/{security}` sin quoting borran `src/lib/security` por brace expansion.
- **Fix**: `rm -rf 'src/lib/{security}'`.

### P0-008 — Migraciones 009 y 010 faltan; salto a 011
- **Archivo**: `supabase/migrations/`
- **Problema**: existen 001-008 y 011, faltan 009 y 010.
- **Riesgo**: historial de migrations no reproducible. `supabase db push` salta sin avisar.
- **Fix**: crear `009_README.md` explicando el salto, o renombrar la 011 para numeración continua.

### P0-009 — Tres archivos SQL de setup con políticas RLS conflictivas
- **Archivos**: `supabase/SETUP_FINAL.sql`, `supabase/COMBINED_SETUP.sql`, `supabase/FIX_002.sql`
- **Problema**:
  - `migrations/001_*.sql` y `008_rls_policies.sql`: insert requiere dueño, update solo dueño.
  - `COMBINED_SETUP.sql`: `WITH CHECK (true)` para insert, `USING (true)` para update en `personas` → **anon puede modificar cualquier registro**.
  - `FIX_002.sql` corrige `audit_log` pero el checklist marca "PENDIENTE CONFIRMAR".
- **Riesgo**: dependiendo de cuál se aplicó, cualquiera puede poner badge "verde" (verificado) a personas desaparecidas y hacer pasar reportes falsos.
- **Fix**: borrar `SETUP_FINAL.sql` y `COMBINED_SETUP.sql`. Mantener solo migrations numeradas + `FIX_002.sql` ejecutado. Documentar en `docs/SECURITY.md` el flujo `supabase db push`.

---

## 🟠 P1 — Importantes (esta semana)

### P1-001 — URL de comunicado UNGRD inventada
- **Archivo**: `src/components/publicaciones-section.tsx:12`
- **Problema**: `https://portal.gestiondelriesgo.gov.co/Paginas/Noticias/2026/Gobierno-nacional-despliega-...aspx` no existe; fue marcada como inventada en el checklist y corregida en DB, pero el **mock fallback en cliente sigue con la URL falsa**.
- **Fix**: cambiar a `https://portal.gestiondelriesgo.gov.co/`.

### P1-002 — `gabotrix.com` listado como fuente oficial
- **Archivo**: `supabase/migrations/011_publicaciones_oficiales.sql:82`, `publicaciones-section.tsx:77`, `SETUP_FINAL.sql:333,457`
- **Problema**: `https://comision.tecnica.gabotrix.com` como URL de CAMACOL/MinVivienda. Dominio de terceros.
- **Riesgo**: presentar dominio de terceros como "oficial" en emergencia → phishing/reputación.
- **Fix**: reemplazar por `https://www.camacol.co/` o eliminar la publicación.

### P1-003 — `publicaciones-section.tsx` usa `@supabase/supabase-js` directo en server component
- **Archivo**: `src/components/publicaciones-section.tsx:86-91`
- **Problema**: debería usar `@supabase/ssr` con `cookies()`.
- **Riesgo**: si se cambia policy de `publicaciones_oficiales` para requerir auth, falla silenciosa y muestra solo el mock.
- **Fix**: usar el helper de `@/lib/db.ts`.

### P1-004 — `/api/estado-operativo` referencia tabla que no existe
- **Archivo**: `src/app/api/estado-operativo/route.ts:14`
- **Problema**: `supabase.from('estado_operativo')` — no hay migration que cree esa tabla.
- **Riesgo**: sección de la home siempre vacía.
- **Fix**: crear `migrations/009_create_estado_operativo.sql` o eliminar el endpoint + componente.

### P1-005 — Faltan endpoints `GET/PATCH /api/personas/[id]`
- **SPEC**:60-61 los define, **no existen**.
- **Riesgo**: sin GET individual no se pueden compartir links directos; sin PATCH no se puede marcar "encontrada" a una persona.
- **Fix**: implementar `GET /api/personas/[id]` (SELECT) y `PATCH` con `edit_token` siguiendo el plan del checklist.

### P1-006 — Rate limiter in-memory es decorativo
- **Archivos**: `src/app/api/personas/route.ts:8-19`, `centros/...`, `albergues/...`, `verificar/...`
- **Problema**: cada ruta declara su propio `Map` → en serverless se resetea por invocación. 4 Maps distintos = un atacante puede hacer 40 req/min por IP.
- **Riesgo**: OWASP A04 incumplido.
- **Fix**: extraer a `src/lib/security/rate-limit.ts` (que existe pero no se usa) + Redis/Upstash. Mientras tanto, un solo `Map` global compartido.

### P1-007 — `helmet.ts` no se aplica
- **Archivo**: `src/lib/security/helmet.ts`
- **Problema**: `cspHeaders()` nunca se llama. `next.config.js` aplica headers estáticos pero **no CSP**.
- **Riesgo**: sin CSP, XSS queda abierto (defensa en profundidad ausente).
- **Fix**: aplicar `cspHeaders()` en `next.config.js headers()` o eliminar `helmet.ts`.

### P1-008 — `file-validation.ts` no se usa; validación duplicada
- **Archivo**: `src/lib/security/file-validation.ts`
- **Problema**: `validateImageFile()` nunca se importa; cada ruta reimplementa la validación inline (personas:90-101, albergues:75-86).
- **Riesgo**: cualquier ruta nueva de upload queda vulnerable.
- **Fix**: centralizar y borrar la duplicación.

### P1-009 — Servicios en `src/lib/services/*.ts` son código muerto
- **Archivos**: `src/lib/services/personas.service.ts`, `usgs.service.ts`
- **Problema**: usan `createClient()` (browser, anon key); ningún componente/page los importa. Componentes UI hacen `fetch('/api/usgs')` directo.
- **Riesgo**: capa de servicios es fachada vacía.
- **Fix**: usarlos desde server components o eliminarlos.

### P1-010 — ESLint no detecta `: any` en 18 lugares
- **Críticos**:
  - `src/app/api/personas/route.ts:82` `let body: any = {};`
  - `src/app/api/centros/route.ts:65, 80`
  - `src/app/api/albergues/route.ts:67`
  - `src/app/verificar/page.tsx:14-16, 136, 154, 172`
  - `src/app/personas/nuevo/page.tsx:379` `e.target.value as any`
- **Riesgo**: pierde validación runtime; campos `__proto__`/`constructor` pasan.
- **Fix**: tipar como `Record<string, FormDataEntryValue>` o `unknown` + narrowing.

### P1-011 — HSTS con `preload` activado
- **Archivo**: `next.config.js:23`
- **Problema**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. `preload` es **irreversible** y requiere registro en hstspreload.org.
- **Riesgo**: si hay subdominios sin HTTPS, los rompe para todos los usuarios para siempre.
- **Fix**: quitar `preload` hasta confirmar deploy HTTPS-only en todos los subdominios.

---

## 🟡 P2 — Mejoras (este mes)

### P2-001 — 16 `console.error` olvidados en producción
- **Archivos**: `src/app/api/*/route.ts` y `src/app/{personas,centros,albergues}/page.tsx`
- **Fix**: logger real (pino) o `if (process.env.NODE_ENV === 'development')` antes de cada console cliente.

### P2-002 — `validations.ts` desincronizado del schema DB
- **Archivo**: `src/lib/validations.ts:24-41` vs `supabase/migrations/001_create_personas.sql:18`
- **Problema**: Zod permite 16 valores para `reportanteRelacion`; columna DB permite 3 (`familiar`, `vecino`, `otro`). Si FIX_002 no se ejecutó → check constraint violation.
- **Fix**: ejecutar `FIX_002.sql` en SQL Editor y marcar check del checklist.

### P2-003 — `src/lib/db.ts` mezcla cliente browser y server con mismo nombre
- **Archivo**: `src/lib/db.ts`
- **Problema**: `createServerClient()` con service_role key puede importarse accidentalmente en componente `'use client'` → filtra service_role al bundle.
- **Riesgo**: si pasa, **compromiso total de la DB**.
- **Fix**: separar `src/lib/db.server.ts` y `src/lib/db.client.ts`. ESLint `no-restricted-imports`.

### P2-004 — `tailwind.config.ts` define `badge-green/yellow/blue` que no se usan
- **Fix**: eliminar las 3 custom colors o unificarlas con el resto de badges.

### P2-005 — Páginas filtran en cliente; paginación rota
- **Archivos**: `src/app/personas/page.tsx:53-57`, `centros/page.tsx:46-50`, `albergues/page.tsx:50-55`
- **Problema**: traen todos los registros y filtran con `.filter()` en cliente. `/api/personas` soporta `page`/`limit` y la UI nunca los usa.
- **Fix**: server components + searchParams, o pasar `search` como query param.

### P2-006 — Archivos grandes (>300 líneas) con lógica duplicada
- **Archivos**:
  - `src/components/official-links.tsx` (633 líneas, 8 ciudades hardcoded)
  - `src/app/personas/nuevo/page.tsx` (424 líneas)
  - `src/components/image-editor.tsx` (341 líneas)
- **Fix**: extraer `CIUDADES` a `data/contactos.ts`; separar `image-editor` en canvas + controls.

### P2-007 — Falta tests unitarios para endpoints y servicios
- **Tests faltantes**: `file-validation.test.ts`, `rate-limit.test.ts`, tests de cada ruta API (400 con body inválido), tests de servicios.
- **Riesgo**: suite de seguridad es cobertura falsa.

---

## 🟢 P3 — Nice-to-have

### P3-001 — `playwright-report/` y `test-results/` commiteados
- `test-results/.last-run.json` muestra `status: failed` con 2 tests fallidos.
- **Fix**: `rm -rf playwright-report test-results` (ya están en .gitignore).

### P3-002 — `CIIDADES_PRINCIPALES` con "Chocó" mal
- **Archivo**: `src/lib/constants.ts:49-60`
- Chocó es departamento, no ciudad. La capital es Quibdó.
- **Fix**: reemplazar por `'Quibdó'` o eliminar la constante si no se usa.

### P3-003 — `lucide-react: ^0.400.0` desactualizado
- **Archivo**: `package.json:38`
- Actual está en 0.460+.
- **Fix**: `pnpm update lucide-react`.

### P3-004 — Typo en `public/logo_ruta_ayuda_tranparente.png`
- "tranparente" → "transparente". Referenciado en `src/app/page.tsx:29` y `src/components/layout/header.tsx:26`.

### P3-005 — `tsconfig.tsbuildinfo` no ignorado explícitamente
- **Fix**: agregar `*.tsbuildinfo` a `.gitignore`.

---

## ✅ Observaciones positivas

- Headers de seguridad en `next.config.js:17-30` (HSTS, X-Frame-Options DENY, Referrer-Policy).
- `docs/CHECKLIST-AUDITORIA.md` demuestra honestidad sobre lo que falta.
- Componentes `src/components/ui/` consistentes con shadcn/ui + `cn()` correcto.
- `image-editor.tsx` es UX notable (crop, zoom, rotación) para fotos de desaparecidos.
- `publicaciones-section.tsx` tiene fallback a mock si Supabase falla.
- Tipos en `src/types/` bien definidos (albergue, persona, centro).
- `playwright.config.ts` con `webServer: 'npm run dev'` para CI.
- UUIDs en PKs de todas las tablas.
- `reportado_por UUID REFERENCES auth.users(id)` — modelado correcto (aunque no se aprovecha, ver P0-003).
- `DisclaimerBanner` + `EmergencyBanner` siempre visibles en layout.
- Tests de sanitización cubren XSS y SQL injection patterns.

---

## 🚀 Plan de acción priorizado

| # | Acción | Cuándo |
|---|---|---|
| 1 | Rotar keys de Supabase (P0-001) | **HOY** |
| 2 | Borrar `src/lib/{security}/` (P0-007) | **HOY** |
| 3 | Arreglar `SETUP_FINAL.sql`, consolidar migrations (P0-002, P0-008, P0-009) | Esta semana |
| 4 | Cambiar `createServerClient()` a cliente con sesión real (P0-003) | Esta semana |
| 5 | Implementar audit log en las 4 rutas POST (P0-004) | Esta semana |
| 6 | Reescribir `/api/verificar` para usar Supabase (P0-005) | Esta semana |
| 7 | Ejecutar FIX_002 en SQL Editor (P2-002) | Esta semana |
| 8 | Implementar `GET /api/personas/[id]` y planear PATCH con token (P1-005) | Esta semana |
| 9 | Corregir URLs inventadas (P1-001, P1-002) | Próxima semana |
| 10 | Rate limit compartido + Redis (P1-006) | Próxima semana |
| 11 | Eliminar código muerto, consolidar validaciones, tests de endpoints | Este mes |

---

## Comandos para reproducir

```bash
# Estructura
find . -type f -not -path '*/node_modules/*' -not -path '*/.next/*' | sort

# Directorio literal
ls -la src/lib/ | grep '{'

# TS check (puede dar timeout por tsbuildinfo corrupto)
pnpm exec tsc --noEmit --incremental false

# Lint
pnpm lint

# Unit tests
pnpm test --run

# Verificar uso de security helpers (debería estar vacío si todo OK)
grep -rn "from '@/lib/security/" src

# Verificar que audit_log se llama en cada POST
grep -rn "createAuditLog" src/app/api

# Verificar que store.ts no se use (debería dar 1 hit solo en verificar)
grep -rn "from '@/lib/store'" src

# Inspección del archivo corrupto (P0-002)
sed -n '220,230p' supabase/SETUP_FINAL.sql
sed -n '336,346p' supabase/SETUP_FINAL.sql

# Validar migrations
ls supabase/migrations/

# URLs rotas
grep -rn "gabotrix\|Gobierno-nacional-despliega" src/

# Tamaño de archivos grandes
wc -l src/components/official-links.tsx src/app/personas/nuevo/page.tsx src/components/image-editor.tsx
```