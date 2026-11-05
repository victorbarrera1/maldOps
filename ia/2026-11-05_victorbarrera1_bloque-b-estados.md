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
