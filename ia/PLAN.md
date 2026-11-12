# Plan de trabajo — Entrega 2

Checklist acordado para dejar MaldOps con una capa de datos simulada, estados de
interfaz, estructura de proyecto ordenada y README de entrega.

## Reglas de ejecución

- Se trabaja una tarea a la vez y cada tarea lleva su propio commit.
- Se abre **un PR por bloque** (A, B, C, D y E), con la rama del bloque y los
  commits de sus tareas. No se acumulan bloques en una misma rama.
- Las vistas solo llaman a `src/api.js` (antes `js/api.js`). Nunca usan
  `fetch`, leen JSON o tocan `localStorage` directamente.
- No se agregan frameworks nuevos. Solo Vite, módulos ES, Alpine y Tailwind.
- Si una tarea exige editar archivos asignados a otro integrante y no hay
  reasignación, se anota `BLOQUEADO: <motivo>` y se continúa con la siguiente.
- Al cerrar cada tarea se actualiza este archivo, se registra el trabajo en
  `ia/` y se hace un commit en español.

## Estado de los bloques

| Bloque | Rama | PR | Estado |
|---|---|---|---|
| A — Capa de datos | `feat/bloque-a-capa-datos` | [#8](https://github.com/victorbarrera1/maldOps/pull/8) | Completado |
| B — Estados de interfaz | `feat/bloque-b-estados` | [#9](https://github.com/victorbarrera1/maldOps/pull/9) | Completado |
| C — Estructura del repo | `feat/bloque-c-estructura` | [#10](https://github.com/victorbarrera1/maldOps/pull/10) | Completado |
| D — README | `feat/bloque-d-readme` | [#11](https://github.com/victorbarrera1/maldOps/pull/11) | Completado |
| E — Cierre | `feat/bloque-e-cierre` | [#12](https://github.com/victorbarrera1/maldOps/pull/12) | Completado |
| F — Limpieza | `fix/limpieza-entrega` | [#14](https://github.com/victorbarrera1/maldOps/pull/14) | Completado |
| G — Busqueda, filtros y orden | `feat/bloque-g-busqueda-filtros` |  | En curso |

## Checklist

### A. Capa de datos

- [x] **A1.** Crear `public/mocks/{usuarios,clientes,ventas,preguntas}.json` con
  los ids ya definidos (`u-001`, `cli-001`…`cli-012`, `ven-001`…, `preg-001`…).
  Al menos 10 clientes y 15 ventas. Roles `admin`/`vendedor`.
- [x] **A2.** Crear `js/api/` con `respuesta.js` (formato
  `{ ok, status, data, error }`), `db.js` (copia `public/mocks` a
  `localStorage` la primera vez; lee y escribe ahí) y `servidor.js` (latencia
  aleatoria 300–800 ms, errores forzados, códigos 200/201/400/401/403/404/409/422/500).
- [x] **A3.** Crear `js/api.js` como única puerta con:
  `auth.iniciarSesion`, `auth.registrar`, `auth.cerrarSesion`,
  `clientes.listar/obtener/crear/actualizar/eliminar`,
  `ventas.listar/obtener/crear/actualizar/eliminar/deCliente` y
  `preguntas.listar`. Todas async y con el mismo formato de respuesta.
- [x] **A4.** Sesión simulada en `localStorage`; las vistas privadas redirigen
  al login y vuelven a la vista pedida.
- [x] **A5.** Simulador de errores: `?fallar` en la URL y selector de
  latencia/probabilidad de error en `configuracion.html`. Botón
  «Restablecer datos de prueba».

### B. Estados de interfaz

Una vista por tarea:

- [x] **B6.1.** `clientes.html`: cargando (esqueleto), vacío y error con botón
  «Reintentar», usando `api.js`.
- [x] **B6.2.** `ventas.html`: cargando (esqueleto), vacío y error con botón
  «Reintentar», usando `api.js`.
- [x] **B6.3.** `dashboard.html`: cargando, vacío y error con «Reintentar»,
  usando `api.js`.
- [x] **B6.4.** `ayuda.html`: cargando, vacío y error con «Reintentar», usando
  `api.js`.
- [x] **B6.5.** `configuracion.html`: cargando, vacío y error con «Reintentar»,
  usando `api.js`.
- [x] **B6.6.** `index.html` (login): estados de carga y error de la API, con
  «Reintentar» cuando corresponda.
- [x] **B6.7.** `registro.html`: estados de carga y error de la API, con
  «Reintentar» cuando corresponda.
- [x] **B7.** Validación por campo en login y registro con mensajes en español
  (usa los 422 de la API).
- [x] **B8.** CRUD de clientes y ventas funcionando con modal de confirmación al
  eliminar y aviso (toast) de éxito/error.

### C. Estructura del repo

- [x] **C9.** Mover `js/` y `css/` a `src/`, `img/` a `public/img/`; actualizar
  rutas y `vite.config.js` (todas las páginas como input). `npm run build` debe
  pasar.
- [x] **C10.** Crear `.env.example` con `VITE_API_MODO=mock` y `VITE_API_URL=`;
  crear `js/api/http.js` (fetch) que devuelva el mismo formato, elegido por
  `VITE_API_MODO`.
- [x] **C11.** Reemplazar el CDN de Ionicons por el paquete npm.
- [x] **C12.** Crear `ia/README.md` como índice de uso de IA.

### D. README

- [x] **D13.** Reescribir `README.md` con: descripción, integrantes con usuario
  de GitHub, tecnologías, requisitos, instalación, credenciales de prueba (admin
  y vendedor, con rol), tabla de vistas (ruta, cómo llegar, pública/privada,
  incluye dashboard), funcionalidades, capa de datos (diagrama simple +
  endpoints), formato del backend real (`{data,meta}` / `{error,errores}`),
  tabla de mocks (archivo, registros, contenido), árbol de estructura del
  proyecto y link a `ia/README.md`. Quitar el texto que dice que `js/api.js` y
  los mocks «todavía no existen».

### E. Cierre

- [x] **E14.** Probar en `npm run build && npm run preview` todas las vistas,
  con y sin `?fallar`. Anotar en este archivo lo que falle.

#### Resultado de E14

Pruebas sobre `npm run build && npm run preview` (`http://localhost:4173`), con
sesión `admin` (`victor.barrera@mail.udp.cl` / `demo1234`), con `vendedor`
(`Prueba Nav`) y con una cuenta recién creada desde el registro.

| Vista | Sin `?fallar` | `?fallar` (500) | `?fallar=404` |
|---|---|---|---|
| Dashboard | 12 clientes, 15 ventas, `$1.825.000` de ganancias, `$121.667` de ticket, 8 ventas recientes y 5 clientes | Error con «Reintentar» | Error 404 con «Reintentar» |
| Clientes | 12 filas; 12 «Editar»; 12 «Eliminar» como admin y 0 como vendedor | Error con «Reintentar» | Error 404 con «Reintentar» |
| Ventas | 15 filas; 15 «Editar»; 15 «Eliminar» como admin y 0 como vendedor | Error con «Reintentar» | Error 404 con «Reintentar» |
| Ayuda | 8 preguntas | Error con «Reintentar» | Error 404 con «Reintentar» |
| Configuración | Nombre y correo de la sesión, latencia `normal`, probabilidad `0` y simulador visible | Error con «Reintentar» | Error 404 con «Reintentar» |
| Login | Entra al dashboard y el menú muestra el nombre y el rol | Error con «Reintentar»; al reintentar sin el parámetro entra al dashboard | — |
| Registro | Crea una cuenta `vendedor` y entra al dashboard con el nombre en el menú | Error con «Reintentar»; al reintentar crea la cuenta y entra | — |

- El guard sigue redirigiendo: sin sesión, `clientes.html` va a
  `index.html?volver=clientes.html`.
- Los 12 iconos del dashboard se resolvieron sin advertencias de Ionicons.
- Consola del navegador sin errores en las vistas sin `?fallar`.

**Fallo detectado y corregido:** en el build, el menú podía montarse antes de
que `guard.js` estableciera `window.__sesion`, así que después del registro el
nav mostraba «Usuario» / «Sin rol» aunque la sesión estuviera guardada.
`main.js` ahora importa `./guard.js` antes de llamar a `montarNav()`. Se
verificó con admin, con vendedor y con una cuenta nueva.

## F. Limpieza de entrega

- [x] **F15.** Retirar `src/index.js` y `src/store.js`, y quitar sus referencias
  de las vistas y de `main.js`.
- [x] **F16.** Activar el preflight de Tailwind, eliminar el reset duplicado de
  `dashboard.css` y unificar botones, inputs y el modal.
- [x] **F17.** Respetar `BASE_URL` en imágenes y favicons; adaptar login y
  registro a móvil.
- [x] **F18.** Ignorar `.env*` y actualizar el README (variables de entorno y
  estructura del proyecto).
- [x] **F19.** Indexar los registros de IA pendientes y documentar la limpieza y
  el PR.

#### Verificación F

- `npm run build` pasa.
- `npx vite build --base=/maldops/` pasa.
- Revisión visual de las siete vistas en 1280 px y de login, registro y modal en
  390 px.
- Consola sin errores; solo queda el aviso verbose de Chrome por el campo de
  contraseña de Configuración, que se resolverá al cablear esa sección.

### G. Búsqueda, filtros y orden

- [x] G1. Implementar funciones de listar con opciones de búsqueda, filtro y orden en `src/api.js` y `src/servidor.js`.
- [x] **G2.** Unificar búsqueda, favoritos y orden en Clientes: un solo
  listener `filtroFavoritos → aplicarVista`, eliminar `aplicarFiltro()` y
  distinguir los estados vacíos «Aún no tienes favoritos», «No hay favoritos
  que coincidan con la búsqueda» y «Prueba con otra búsqueda». Verificado con
  admin y vendedor; `npm run build` pasa.

  Nota: el build estaba bloqueado por un `;` faltante y un `//` suelto en
  `src/css/dashboard.css` (regla de foco del acordeón). Se corrigió en el
  commit aparte `fix(css): corrige sintaxis del foco del acordeón`.

## Registro de bloqueos

_(Sin bloqueos por ahora.)_
