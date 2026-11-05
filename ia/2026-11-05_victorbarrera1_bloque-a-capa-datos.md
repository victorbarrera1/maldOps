# Bloque A — Capa de datos

- **Fecha:** 2026-11-05
- **Integrante:** @victorbarrera1
- **Rama:** `feat/bloque-a-capa-datos`
- **PR:** [#8](https://github.com/victorbarrera1/maldOps/pull/8)
- **Prompt usado:** instrucción de la Entrega 2 (checklist A–E), con la regla de
  un PR por bloque y un commit por tarea. Para este bloque: crear los mocks en
  `public/mocks/`, la capa `js/api/`, la fachada `js/api.js`, la sesión con
  redirecciones y el simulador de errores.

## A1 — Mocks

Se crearon los cuatro archivos de datos simulados en `public/mocks/`. El
checklist de la Entrega 2 asigna los cuatro mocks a este bloque, por lo que se
crean acá y no en ramas separadas de Martin o Josemanuel.

- `usuarios.json`: 4 usuarios (`u-001`…`u-004`), roles `admin` y `vendedor`.
- `clientes.json`: 12 clientes (`cli-001`…`cli-012`).
- `ventas.json`: 15 ventas (`ven-001`…`ven-015`), todas con `clienteId` válido.
- `preguntas.json`: 8 preguntas (`preg-001`…`preg-008`).

Verificación: los cuatro JSON parsean con `JSON.parse`; los conteos, ids,
roles, servicios, estatus y relaciones `clienteId` son válidos.

## A2 — Núcleo de la API simulada

Se crearon `js/api/respuesta.js`, `js/api/db.js`, `js/api/sesion.js` y
`js/api/servidor.js`.

- `respuesta.js` centraliza `ok()` y `fallo()` con el formato
  `{ ok, status, data, error, errores }`.
- `db.js` copia los cuatro mocks a `localStorage` la primera vez, permite
  reiniciar los datos y genera ids con `siguienteId()`.
- `sesion.js` guarda solo los datos públicos del usuario.
- `servidor.js` simula latencia de 300–800 ms, errores forzados con `?fallar`,
  probabilidad de error configurable y los códigos 200/201/400/401/403/404/409/422/500.

Verificación: prueba de humo en Node con `localStorage` y `fetch` simulados;
login, listados, CRUD, validaciones 422, conflicto 409, permisos 403, sesión 401
y fallo forzado 500 devolvieron el status esperado.

## A3 — Fachada `js/api.js`

Se creó `js/api.js` con `auth`, `clientes`, `ventas`, `preguntas` y
`simulador`. Todos los métodos son `async` y devuelven el mismo formato de
respuesta. Las vistas solo necesitan importar este archivo.

Verificación: la fachada se importó en Node con los mocks servidos desde
`public/`; login 200, 12 clientes, 15 ventas, 2 ventas de `cli-005`, 8 preguntas
y perfil del usuario autenticado.

## A4 — Sesión y redirecciones

- Se creó `js/guard.js`: detecta las páginas con `data-privada="true"`, redirige
  a `index.html?volver=<vista>` cuando no hay sesión y deja la sesión en
  `window.__sesion` para que `nav.js` pinta nombre y rol.
- `js/login.js` ahora llama a `api.auth.iniciarSesion`, muestra el error de la
  API y vuelve a la vista pedida con `destinoSeguro()`.
- `js/main.js` cierra la sesión con `api.auth.cerrarSesion()` antes de salir.
- Se agregó el guard a `dashboard.html`, `clientes.html`, `ventas.html`,
  `configuracion.html` y `ayuda.html`.
- Se corrigió el error de consola de `js/index.js` cuando la página no tiene el
  menú antiguo (`.toggle`).

Verificación en `npm run dev`: sin sesión, `clientes.html` redirige a
`index.html?volver=clientes.html`; al ingresar con `victor.barrera@mail.udp.cl`
/ `demo1234` vuelve a `clientes.html` y el menú muestra «Victor Barrera» y
«admin». «Cerrar sesión» borra `maldops.sesion.v1` y vuelve al login. Consola
sin errores. `npm run build` pasa.

## A5 — Simulador de errores

- El servidor simulado ya interpreta `?fallar` (500) y `?fallar=<código>`
  (400/401/403/404/409/422/500).
- `configuracion.html` incluye un panel con latencia (normal/rápida/lenta),
  probabilidad de error (0/10/25/50 %), botón para guardar, botón para forzar
  el siguiente error y botón para restablecer los datos de prueba.
- `js/configuracion.js` usa solo `api.simulador.*`; no toca `localStorage`.

Verificación en `npm run dev`: se guardó `{ latencia: "rapida",
probabilidadError: 10 }`; «Simular siguiente error» hizo que
`clientes.listar()` devolviera 500; `configuracion.html?fallar=404` hizo que
`clientes.listar()` devolviera 404; «Restablecer datos de prueba» borró la
sesión y volvió al login. `npm run build` pasa.
