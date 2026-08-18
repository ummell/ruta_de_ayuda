# Checklist — Resolución auditoría (2026-08-12)

Orden por impacto. Marcar `[x]` al completar.

## 1. Base de datos (crítico — bloquea todo lo demás)

- [x] Aplicar `supabase/SETUP_FINAL.sql` (8 tablas, URLs ya corregidas) al proyecto real `cwexghcdpzfsfxrkomlj.supabase.co`
- [x] Verificar tablas creadas: `personas`, `centros`, `albergues`, `verificaciones`, `reportes`, `avales`, `audit_log`, `publicaciones_oficiales` (las 8 responden 200)
- [x] Migrar `src/app/api/personas/route.ts` de `src/lib/store.ts` (JSON en `/tmp`) a cliente Supabase real
- [x] Migrar `src/app/api/centros/route.ts` igual (de paso: bug `queNecesitan`→`necesidades` que rompía el registro, corregido)
- [x] Migrar `src/app/api/albergues/route.ts` igual (de paso: bug `voluntarioNombre`→`nombreVoluntario` que rompía el registro, corregido)
- [x] Conectar `personaSchema` (Zod, `src/lib/validations.ts`) a la ruta POST — se agregó también `ciudad` que faltaba en el schema
- [ ] **PENDIENTE CONFIRMAR:** `supabase/FIX_002.sql` (amplía constraint `reportante_relacion` de 3 a 16 valores + cierra RLS pública de `audit_log`) fue copiado al portapapeles con instrucciones pero nunca se confirmó su ejecución en el SQL Editor
- [ ] Correr `scripts/seed-db.ts` contra la DB real — **decisión pendiente de aprobación:** no se corrió porque es la base de producción de una herramienta de emergencia real; sembrar personas/albergues de ejemplo ahí sería engañoso. Alternativas: proyecto Supabase de staging separado, o correr igual si el usuario lo pide explícitamente

## 2. Links rotos — dominios muertos (`src/components/official-links.tsx`)

- [ ] `cruzrojavalledelcauca.org` → `cruzrojavalle.org.co` (línea ~102)
- [ ] `cruzrojaantioquia.org` → `crantioquia.org.co` (línea ~300)
- [ ] `hospitalsanjorge.gov.co` → `husj.gov.co` (línea ~155, Pereira)
- [ ] `hospitalsanjuandediosarmenia.gov.co` → `hospitalquindio.gov.co` (línea ~239)
- [ ] `hospitcaldas.gov.co` → `seshospitaluniversitariodecaldas.com` (línea ~197)
- [ ] `huv.gov.co` → revisar manualmente (no resolvía al momento de la auditoría, puede ser caída temporal)

## 3. Handles Twitter/X incorrectos (mismo archivo)

- [ ] Manizales: `@AlcaldiaMnas` → `@CiudadManizales`
- [ ] Buenaventura: `@AlcBuenaventura` → `@BturaDE`
- [ ] Cundinamarca: `@GobCundi` → `@CundinamarcaGob`
- [ ] Quindío: `@GobernacionQuindio` → `@QuindioGob`
- [ ] Valle del Cauca: `@GobernacionValle` → `@GobValle`

## 4. Contenido inventado

- [ ] `src/components/publicaciones-section.tsx:12` y `supabase/migrations/011_publicaciones_oficiales.sql:47` — URL de comunicado UNGRD es inventada (404). Reemplazar por `https://portal.gestiondelriesgo.gov.co/` o buscar URL real del comunicado
- [ ] Verificar vigencia de `comision.tecnica.gabotrix.com` antes de mantenerlo como fuente "oficial" (dominio de terceros, no camacol.co)

## 5. Fuentes oficiales de personas desaparecidas — agregar

- [ ] Agregar sección "Buscar en registros oficiales" en `/personas` y `/info`
- [ ] Link: UBPD — `https://unidadbusqueda.gov.co/`
- [ ] Link: Sistema Nacional de Búsqueda — `https://snb.unidadbusqueda.gov.co/`
- [ ] Link: Medicina Legal, consulta RND/SIRDEC — `https://siclico.medicinalegal.gov.co/consultasPublicas/SeguimientoDesap.xhtml`
- [ ] Link: Cruz Roja — Restoring Family Links — `https://familylinks.icrc.org/es`
- [ ] Actualizar `src/app/api/verificar/route.ts` para que el mensaje no implique que busca en fuentes externas (hoy solo busca en store local, pese a lo que dice `docs/SPEC.md`)

## 6. Marcar "encontrado" sin login (nueva feature)

- [ ] Agregar columna `edit_token_hash` a tabla `personas` (nueva migración `012_add_edit_token.sql`)
- [ ] Generar `edit_token` (UUID) en `POST /api/personas`, guardar hash, devolver token una sola vez en la respuesta
- [ ] Mostrar el token/link en pantalla al reportante tras publicar + opción de compartir por WhatsApp
- [ ] Crear `src/app/api/personas/[id]/route.ts` con `PATCH` que valide `?token=` contra el hash guardado
- [ ] Rate-limit en el nuevo PATCH (mismo patrón que las otras rutas)
- [ ] Crear página `src/app/personas/[id]/gestionar/page.tsx` con botón "Marcar como encontrada"
- [ ] Actualizar `docs/SPEC.md` con el endpoint real (ya lo menciona pero sin este flujo de token)

## 7. Verificación final

- [x] `npm run build` sin errores (arreglados: target ES2017 faltante en tsconfig, tipos implícitos en `verificar/route.ts`, `@vitejs/plugin-react` faltante, y bug real de bundling: `isomorphic-dompurify`/jsdom rompía las rutas API — excluido vía `serverComponentsExternalPackages`)
- [x] `npm test` (unit) pasa — 18/18. Arreglados 2 tests con asserts incorrectos y 2 gaps reales en `hasSQLInjection`/`sanitizeSearchInput` (código muerto, no usado en ningún endpoint, pero se corrigió igual)
- [ ] `npm run test:e2e` pasa
- [ ] Re-correr chequeo de links tras los cambios (curl / navegador) para confirmar 200 en todos
