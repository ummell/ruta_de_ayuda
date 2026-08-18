# Especificación Técnica - RutaDeAyuda

## 1. Visión General

Plataforma web para conectar personas afectadas por el terremoto en Colombia con recursos de ayuda. Permite registrar y buscar personas desaparecidas, localizar centros de acopio y albergues, y verificar información antes de compartirla.

## 2. Módulos

### 2.1 Personas Desaparecidas
- Registro con: foto, nombre, edad, género, última ubicación, fecha de desaparición
- Estados: Buscando | Localizada | Identificada
- Compartir por WhatsApp, Facebook, X
- Badges: Verde (oficial), Azul (ciudadano)

### 2.2 Centros de Acopio
- Registro: nombre, dirección, necesidades, horarios, contacto
- Mapa interactivo con filtros por ciudad
- Badges de confianza

### 2.3 Albergues/Refugios
- Registro con nombre público obligatorio del voluntario
- Badges:
  - 🟢 Verde: Oficial (gobierno)
  - 🟡 Amarillo: Avalado por voluntario
  - 🔵 Azul: Voluntario hogar (precaución respetuosa)
- Verificación OTP + foto

### 2.4 Centro de Verificación
- Input: texto, enlace o captura
- Busca en: DB propia, USGS, Defensa Civil, Cruz Roja, redes
- Resultados: ✅Verificado / ⚠️No puedo verificar / ❌Conflicto

### 2.5 Datos en Tiempo Real
- Feed USGS: último terremoto + réplicas
- Mapa de intensidad sísmica

### 2.6 Info y Emergencia
- Guía post-terremoto
- Teléfonos: 123, 144, 132, 119
- Enlaces: Defensa Civil, UNGRD, SGC

## 3. Modelo de Datos

### Tablas Principales
- `personas`: id, foto_url, nombre, apellido, edad, genero, documento, ultima_ubicacion, fecha_desaparicion, estado, categoria, reportante_nombre, reportante_telefono, created_at
- `centros`: id, nombre, direccion, ciudad, necesidades, horarios, contacto, badge, created_at
- `albergues`: id, nombre_voluntario, telefono, whatsapp, direccion, ciudad, capacidad, servicios, reglas, foto_url, badge, created_at
- `verificaciones`: id, texto_buscar, resultado, fuentes, created_at
- `reportes`: id, tipo_entidad, entidad_id, motivo, created_at

## 4. Seguridad

Ver OWASP-TOP10.md para implementación detallada.

## 5. API Endpoints

### Personas
- `GET /api/personas` - Listar (filtros: estado, ciudad, categoria)
- `POST /api/personas` - Crear
- `GET /api/personas/[id]` - Detalle
- `PATCH /api/personas/[id]` - Actualizar estado

### Centros
- `GET /api/centros` - Listar (filtros: ciudad)
- `POST /api/centros` - Crear

### Albergues
- `GET /api/albergues` - Listar (filtros: ciudad, badge)
- `POST /api/albergues` - Crear
- `POST /api/albergues/[id]/reportar` - Reportar

### Verificación
- `POST /api/verificar` - Verificar texto/enlace

### USGS
- `GET /api/usgs` - Proxy a USGS feed