# Plan de trabajo — Entrega 2

Checklist acordado para dejar MaldOps con una capa de datos simulada, estados de
interfaz, estructura de proyecto ordenada y README de entrega.

## Reglas de ejecución

- Se trabaja una tarea a la vez y cada tarea lleva su propio commit.
- Se abre **un PR por bloque** (A, B, C, D y E), con la rama del bloque y los
  commits de sus tareas. No se acumulan bloques en una misma rama.
- Las vistas solo llaman a `js/api.js` (o `src/api.js` después de C9). Nunca usan
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
| B — Estados de interfaz | `feat/bloque-b-estados` | pendiente | En curso |
| C — Estructura del repo | pendiente | pendiente | Pendiente |
| D — README | pendiente | pendiente | Pendiente |
| E — Cierre | pendiente | pendiente | Pendiente |

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
- [ ] **B7.** Validación por campo en login y registro con mensajes en español
  (usa los 422 de la API).
- [ ] **B8.** CRUD de clientes y ventas funcionando con modal de confirmación al
  eliminar y aviso (toast) de éxito/error.

### C. Estructura del repo

- [ ] **C9.** Mover `js/` y `css/` a `src/`, `img/` a `public/img/`; actualizar
  rutas y `vite.config.js` (todas las páginas como input). `npm run build` debe
  pasar.
- [ ] **C10.** Crear `.env.example` con `VITE_API_MODO=mock` y `VITE_API_URL=`;
  crear `js/api/http.js` (fetch) que devuelva el mismo formato, elegido por
  `VITE_API_MODO`.
- [ ] **C11.** Reemplazar el CDN de Ionicons por el paquete npm.
- [ ] **C12.** Crear `ia/README.md` como índice de uso de IA.

### D. README

- [ ] **D13.** Reescribir `README.md` con: descripción, integrantes con usuario
  de GitHub, tecnologías, requisitos, instalación, credenciales de prueba (admin
  y vendedor, con rol), tabla de vistas (ruta, cómo llegar, pública/privada,
  incluye dashboard), funcionalidades, capa de datos (diagrama simple +
  endpoints), formato del backend real (`{data,meta}` / `{error,errores}`),
  tabla de mocks (archivo, registros, contenido), árbol de estructura del
  proyecto y link a `ia/README.md`. Quitar el texto que dice que `js/api.js` y
  los mocks «todavía no existen».

### E. Cierre

- [ ] **E14.** Probar en `npm run build && npm run preview` todas las vistas,
  con y sin `?fallar`. Anotar en este archivo lo que falle.

## Registro de bloqueos

_(Sin bloqueos por ahora.)_
