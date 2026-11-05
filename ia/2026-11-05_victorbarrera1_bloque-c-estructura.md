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
