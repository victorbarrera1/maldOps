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

## B6.5 — Configuración

- `configuracion.html`: el simulador ahora usa `#simulador-estado` para los
  estados y `#simulador-contenido` para el formulario. Los campos de nombre y
  correo de la cuenta tienen ids para reflejar el perfil.
- `js/configuracion.js`: carga en paralelo `api.simulador.obtenerConfiguracion()`
  y `api.auth.perfil()`. Muestra esqueleto mientras espera, estado vacío si no
  hay configuración guardada, error con «Reintentar» si falla alguna llamada y
  en 401 usa `irAlLogin()`. Al cargar, completa nombre, correo, latencia y
  probabilidad.
- Se mantienen las acciones de guardar, simular el siguiente error y
  restablecer los datos.

Verificación en `npm run dev`: nombre «Victor Barrera», correo
`victor.barrera@mail.udp.cl`, latencia y probabilidad guardadas; «Guardar
configuración» actualiza `maldops.simulador.v1`; con
`configuracion.html?fallar` aparece el error y «Reintentar»; consola sin
errores. `npm run build` pasa.

## B6.6 — Login

- `index.html`: se agregó `#login-estado` (`role="status"`) para el texto
  «Verificando credenciales…» y `#login-error` pasó de `<p>` a `<div>` para
  poder incluir el botón «Reintentar».
- `css/login.css`: estilos del estado de carga, del mensaje y del botón de
  reintento.
- `js/login.js`: el envío se centralizó en `enviar()`, que deshabilita el botón
  y marca `aria-busy` mientras espera. Un 422 resalta el campo correspondiente,
  un 401 muestra «Correo o contraseña incorrectos.» sin reintento y un 500 o un
  error de red muestran «Reintentar». El reintento conserva los valores del
  formulario y vuelve a llamar a la API.

Verificación en `npm run dev`: contraseña incorrecta muestra el 401 sin botón;
`index.html?fallar` muestra el 500 con «Reintentar»; al quitar `?fallar` y
pulsar «Reintentar» inicia sesión y vuelve a `clientes.html`; consola sin
errores. `npm run build` pasa.
