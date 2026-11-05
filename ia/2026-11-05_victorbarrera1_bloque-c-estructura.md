# Bloque C — Estructura del repositorio

- **Fecha:** 2026-11-05
- **Integrante:** @victorbarrera1
- **Rama:** `feat/bloque-c-estructura`
- **PR:** pendiente
- **Prompt usado:** instrucción de la Entrega 2 (checklist A–E), con la regla de
  un PR por bloque y un commit por tarea. Para este bloque: mover el código a
  `src/`, los estáticos a `public/`, preparar el modo HTTP, reemplazar el CDN de
  Ionicons y cerrar el índice de IA.

## C9 — Mover código y estáticos

- `js/` se movió a `src/` (incluida la capa `src/api/`).
- `css/` se movió a `src/css/`.
- `img/` se movió a `public/img/`.
- Las siete páginas HTML actualizaron sus rutas: las hojas de estilo ahora
  apuntan a `src/css/…` y los módulos a `/src/…`.
- `src/main.js` importa `./css/app.css`; `src/nav.js` usa `/img/profile.png` y
  `/img/logo-maldops.png` para que Vite sirva los estáticos desde `public/`.
- `vite.config.js` mantiene todas las páginas de la raíz como `input` del build
  y declara `publicDir: 'public'`.

Verificación en `npm run dev`: `clientes.html` carga 12 filas, el CSS se aplica,
el logo y el avatar se sirven desde `/img/` y la consola queda sin errores.
`npm run build` genera las siete páginas y pasa.

## C10 — Modo HTTP y `.env.example`

- `.env.example` documenta `VITE_API_MODO=mock|http` y `VITE_API_URL` (sin barra
  final).
- `src/api/http.js` implementa el cliente `fetch` con la misma forma de
  respuesta que la capa simulada: `{ ok, status, data, error, errores }`.
  Normaliza también respuestas que ya vienen envueltas y convierte los fallos de
  red en `status: 0` con un mensaje en español.
- Los endpoints usados son `/auth/login`, `/auth/registro`, `/auth/logout`,
  `/auth/perfil`, `/clientes`, `/clientes/:id`, `/clientes/:id/ventas`,
  `/ventas`, `/ventas/:id`, `/preguntas` y `/simulador`.
- `src/api.js` elige la fuente con `VITE_API_MODO` mediante import dinámico. El
  valor por defecto sigue siendo `mock`, así que las vistas no cambian.
- En modo HTTP, login, registro y perfil guardan la sesión pública en
  `maldops.sesion.v1` para que el guard siga funcionando; el logout y el 401 la
  borran.

Verificación: `npm run build` pasa con `VITE_API_MODO=mock` y con
`VITE_API_MODO=http`. Se levantó un segundo servidor con modo HTTP apuntando a
un backend inexistente: el login mostró el error de conexión con «Reintentar» y
no guardó sesión. Los errores de CORS en consola son esperables al no existir el
backend.

