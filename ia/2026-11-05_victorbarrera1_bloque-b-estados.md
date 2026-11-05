# Bloque B — Estados de interfaz

- **Fecha:** 2026-11-05
- **Integrante:** @victorbarrera1
- **Rama:** `feat/bloque-b-estados`
- **PR:** pendiente
- **Prompt usado:** instrucción de la Entrega 2 (checklist A–E), con la regla de
  un PR por bloque y un commit por tarea. Para este bloque: agregar estados de
  carga, vacío y error con «Reintentar» en cada vista, validación por campo en
  login y registro, y el CRUD de clientes y ventas con modal y toasts.

## B6.1 — Clientes

- `js/ui.js`: helpers compartidos `crearCargando`, `crearVacio`, `crearError`,
  `crearBadgeEstatus`, `formatearPrecio` y `mensajeDeError`. Solo construyen
  nodos; no leen datos ni `localStorage`.
- `css/app.css`: estilos de esqueleto, estado vacío y estado de error.
- `clientes.html`: se reemplazaron las filas fijas por `#clientes-estado`,
  `#clientes-tabla`, `#clientes-cuerpo` y el contador `#clientes-total`.
- `js/clientes.js`: llama a `api.clientes.listar()`, muestra esqueleto mientras
  carga, estado vacío sin registros, error con botón «Reintentar» y una fila por
  cliente con su badge de estatus. En 401 usa `irAlLogin()`.

Verificación en `npm run dev`: la vista muestra 12 clientes y el contador;
con la base sin clientes aparece el estado vacío; con `clientes.html?fallar`
aparece el error y «Reintentar»; consola sin errores. `npm run build` pasa.

## B6.2 — Ventas

- `ventas.html`: se reemplazaron las filas fijas por `#ventas-estado`,
  `#ventas-tabla`, `#ventas-cuerpo` y el contador `#ventas-total`.
- `js/ventas.js`: carga en paralelo `api.ventas.listar()` y
  `api.clientes.listar()`, arma un mapa de `clienteId` a nombre y pinta una fila
  por venta con precio formateado en CLP y badge de estatus. En 401 usa
  `irAlLogin()`. Si falla cualquiera de las dos llamadas muestra el error con
  «Reintentar».

Verificación en `npm run dev`: 15 ventas y contador; primera fila «Daniel
Ayala / $50.000 / META ADS / PENDIENTE»; con la base sin ventas aparece el
estado vacío; con `ventas.html?fallar` aparece el error y «Reintentar»;
consola sin errores. `npm run build` pasa.

## B6.3 — Dashboard

- `dashboard.html`: se reemplazaron las tarjetas y tablas fijas por
  `#dashboard-estado` y `#dashboard-contenido` (oculto durante la carga).
- Las tarjetas ahora muestran datos reales de la API: clientes, ventas,
  ganancias y ticket promedio.
- `js/dashboard.js`: carga `api.clientes.listar()` y `api.ventas.listar()` en
  paralelo; pinta las últimas 8 ventas y los primeros 5 clientes con sus
  badges. Estado vacío si no hay clientes ni ventas; error con «Reintentar» si
  falla alguna llamada; en 401 usa `irAlLogin()`.
- El enlace «Ver todas» apunta a `ventas.html`.

Verificación en `npm run dev`: 12 clientes, 15 ventas, ganancias
`$1.825.000`, ticket `$121.667`, 8 ventas y 5 clientes en las listas; con la
base vacía aparece el estado vacío; con `dashboard.html?fallar` aparece el
error y «Reintentar»; consola sin errores. `npm run build` pasa.

## B6.4 — Ayuda

- `ayuda.html`: la tabla de preguntas frecuentes ahora usa `#ayuda-estado`,
  `#ayuda-tabla`, `#ayuda-cuerpo` y el contador `#ayuda-total`. La sección de
  contacto con soporte se mantiene.
- `js/ayuda.js`: llama a `api.preguntas.listar()`, muestra esqueleto, estado
  vacío, error con «Reintentar» y una fila por pregunta/respuesta. En 401 usa
  `irAlLogin()`.

Verificación en `npm run dev`: 8 preguntas y contador; con la base sin
preguntas aparece el estado vacío; con `ayuda.html?fallar` aparece el error y
«Reintentar»; consola sin errores. `npm run build` pasa.
