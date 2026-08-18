# Migraciones 009 y 010 — Salto documentado

**Fecha**: 2026-08-16
**Auditoría**: `docs/CHECKLIST-QA-COMPLETA.md` → P0-008

## Contexto

Las migraciones `009` y `010` no existen en este directorio. La numeración salta de `008_rls_policies.sql` directamente a `011_publicaciones_oficiales.sql`.

## ¿Por qué faltan?

Durante el setup inicial de la base de datos en Supabase, los archivos `009` y `010` se aplicaron **directamente en el SQL Editor del dashboard** (no como archivos versionados) porque contenían cambios administrativos posteriores al MVP:

- **009**: ajustes manuales a policies de `audit_log` que terminaron consolidados en `supabase/FIX_002.sql` (FIX ejecutado posteriormente).
- **010**: refinamiento de columnas/triggers en `verificaciones` y `reportes` que se descartaron por inviabilidad.

## Decisión

Para mantener el historial reproducible y entender el salto, este README documenta que `009` y `010` fueron **aplicaciones manuales one-shot** que NO necesitan re-ejecución en environments nuevos. Si se monta la DB desde cero, seguir estos pasos:

1. Aplicar migrations `001` → `008` en orden.
2. Aplicar `011_publicaciones_oficiales.sql`.
3. Aplicar `supabase/FIX_002.sql` (corrige las policies de `audit_log` que se habían abierto por error en algunas policies).
4. **No es necesario** recrear `009` ni `010`.

## Riesgos residuales

- Si se ejecuta `supabase db push` desde CLI, no se quejará por los huecos. Pero la DB quedará inconsistente con la documentación si se saltea `FIX_002.sql`.
- Cualquier intento de clonar la DB antes de la fecha de este README sin acceso al SQL Editor resultará en una DB incompleta.

## TODO futuro

- [ ] Cuando el equipo tenga tiempo, convertir los one-shots de `009` y `010` en migrations reales para que el historial quede completo.
- [ ] Mover `FIX_002.sql` a `migrations/009_fix_audit_log_policies.sql` y re-numerar el resto para que no quede este tipo de confusión.
