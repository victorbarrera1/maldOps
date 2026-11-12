# Detalle de cliente y panel de cuenta funcional

- **Fecha:** 2026-11-12
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Herramienta y modelo:** OpenCode — DeepSeek V4.1 Flash Free
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** `cliente.html` (nuevo), `src/cliente.js` (nuevo), `src/guard.js`, `src/clientes.js`, `configuracion.html`, `src/configuracion.js`, `src/css/dashboard.css`, `ia/PLAN.md`, `ia/README.md`

## Objetivo

Crear la vista de detalle de un cliente con sus ventas y dejar el panel de
cuenta de Configuración realmente funcional, con formulario, errores por campo
y modo oscuro persistente.

## Conversación (texto completo, sin editar)

### Prompt 3

```text
Trabaja en el repositorio MaldOps (Vite + Alpine + Tailwind v4, API simulada). Rama de trabajo: `fix/revision-final`; si no existe, créala desde `origin/main`. Antes de editar, lee los archivos y muestra un plan. No reescribas historial de git.

OBJETIVO
1. Crear `cliente.html?id=...` con el detalle del cliente y sus ventas.
2. Dejar el panel de cuenta de `configuracion.html` realmente funcional, o quitarlo si no se puede sostener.

PARTE A — DETALLE DE CLIENTE
Datos disponibles:
- `api.clientes.obtener(id)` devuelve `{ ok, status, data }`; si no existe, `status: 404`.
- `api.ventas.deCliente(clienteId)` devuelve `{ ok, data: [...] }`; si el cliente no existe, 404.
- Un cliente tiene `id`, `nombre`, `estatus`, `nota`, `favorito`.
- Una venta tiene `id`, `clienteId`, `precio`, `servicio`, `estatus` (no tiene fecha).

Tareas:
1. Crea `cliente.html` con `data-privada="true"`, `#nav-root`, `<main>`, un contenedor de estados (`#cliente-estado`) y un contenedor de contenido (`#cliente-contenido`, oculto al inicio). Incluye los scripts `guard.js`, `src/cliente.js` y `main.js`.
2. Crea `src/cliente.js`:
   - Lee `id` con `new URLSearchParams(window.location.search).get('id')`.
   - Si falta el id, muestra el estado «Cliente no encontrado» con enlace a `clientes.html`.
   - Carga en paralelo `api.clientes.obtener(id)` y `api.ventas.deCliente(id)`.
   - Si `esNoAutorizado(respuesta)`, llama a `irAlLogin()`.
   - Si el cliente no existe (404), muestra el estado no encontrado; no muestres un error genérico.
   - Si falla otra cosa, usa `crearError()` con «Reintentar».
   - Mientras carga, usa `crearCargando()`.
   - Muestra nombre, badge de estatus, nota (si existe), favorito (si existe) y una tabla de ventas con servicio, precio y estatus. Suma el total con `formatearPrecio()`.
   - Si no hay ventas, usa `crearVacio()`.
   - Actualiza `document.title`.
   - Usa `textContent`, nunca `innerHTML`.
3. Agrega `'cliente.html'` a `VISTAS_PRIVADAS` en `src/guard.js` para que `?volver=cliente.html?id=...` funcione.
4. En `src/clientes.js`, haz que el nombre del cliente sea un enlace a `cliente.html?id=<id>` (o agrega un botón «Ver detalle» en acciones). Usa `encodeURIComponent`.
5. Verifica los estados: sin id, id inexistente, cliente sin ventas, error de red, sesión vencida.

PARTE B — PANEL DE CUENTA
El panel de `configuracion.html` ya tiene `#cuenta-nombre`, `#cuenta-correo`, `#cuenta-contrasena-actual`, `#cuenta-contrasena-nueva`, `#guardar-cuenta`, `#eliminar-cuenta` y `#modo-oscuro`. `src/configuracion.js` ya implementa guardar y eliminar; `src/tema.js` maneja `#modo-oscuro`. NO lo rehagas desde cero.

Primero audita:
- ¿Guarda nombre y correo?
- ¿Cambia la contraseña pidiendo la actual?
- ¿Muestra errores por campo?
- ¿Elimina la cuenta y cierra la sesión?
- ¿El modo oscuro persiste al recargar?

Si funciona, corrígelo y prolíjalo:
- Envuelve los campos en `<form id="form-cuenta">` y usa un botón `type="submit"`; cambia el listener de `click` a `submit` con `preventDefault()`.
- Agrega un `<label for="modo-oscuro">Modo oscuro</label>` visible (hoy solo hay `aria-label`).
- Asocia `#cuenta-aviso` con `role="status"` y `aria-live="polite"`; si corresponde, agrega `aria-describedby` a los campos.
- Deshabilita el botón mientras guarda y limpia los estados de error al reintentar.
- Evita el aviso de Chrome por el campo de contraseña fuera de un formulario.

Si algo no se puede sostener, elimina el panel completo y el código muerto asociado; no dejes una UI que aparente funcionar.

PRUEBAS
- Admin y vendedor.
- Cambiar nombre y correo; recargar y verificar.
- Contraseña actual incorrecta; contraseña nueva corta; confirmación.
- Eliminar una cuenta de prueba y verificar la redirección.
- Modo oscuro: activar, recargar y comprobar.
- `npm run build`.

CIERRE
- Registra en `ia/PLAN.md` y crea `ia/2026-11-12_<tu-usuario>_cliente-detalle.md`.
- Commit: `feat(cliente): agrega detalle y ajusta la cuenta [IA]`.
```

### Respuesta 3

El panel de cuenta ya guardaba nombre/correo, cambiaba la contraseña pidiendo
la actual, eliminaba la cuenta y el modo oscuro persistía. Faltaban el
formulario, el label visible, los errores por campo y el estado de guardado.

Creé `cliente.html` y `src/cliente.js` con carga en paralelo de cliente y
ventas. La vista resuelve carga, falta de id, 404, error con «Reintentar» y
sesión vencida; muestra ficha, badge, nota, favorito, tabla de ventas y total.
El nombre de la tabla de Clientes ahora es un enlace al detalle.

En el guard agregué `cliente.html` y conservé el query string en `?volver=`,
para que al iniciar sesión se vuelva a `cliente.html?id=...` y no se pierda el
cliente pedido. En Configuración envolví el panel en `<form id="form-cuenta">`,
pasé el guardado a `submit`, agregué errores inline con `aria-describedby`,
foco en el primer campo inválido, botón deshabilitado con «Guardando…» y un
label visible para el modo oscuro.

## Cambios aplicados

```diff
diff --git a/src/guard.js b/src/guard.js
@@
 const VISTAS_PRIVADAS = [
     'dashboard.html',
     'clientes.html',
+    'cliente.html',
     'ventas.html',
     'configuracion.html',
     'ayuda.html',
@@
 export function destinoSeguro(valor, porDefecto = DESTINO_POR_DEFECTO) {
     const texto = String(valor || '').trim()
-    const archivo = texto.split('?')[0].split('#')[0]
+    const indice = texto.search(/[?#]/)
+    const archivo = indice === -1 ? texto : texto.slice(0, indice)
+    const sufijo = indice === -1 ? '' : texto.slice(indice)
 
-    return VISTAS_PRIVADAS.includes(archivo) ? archivo : porDefecto
+    return VISTAS_PRIVADAS.includes(archivo) ? `${archivo}${sufijo}` : porDefecto
 }
@@
     if (VISTAS_PRIVADAS.includes(vista)) {
-        url.searchParams.set('volver', vista)
+        url.searchParams.set('volver', `${vista}${window.location.search}`)
     }

diff --git a/src/clientes.js b/src/clientes.js
@@
-        const titulo = document.createElement('span')
-        titulo.className = 'block font-medium'
+        // [IA] inicio · ia/2026-11-12_victorbarrera1_cliente-detalle.md
+        const titulo = document.createElement('a')
+        titulo.className = 'block font-medium text-inherit hover:underline'
+        titulo.href = `cliente.html?id=${encodeURIComponent(cliente.id)}`
         titulo.textContent = cliente.nombre
         textos.append(titulo)
+        // [IA] fin

diff --git a/configuracion.html b/configuracion.html
@@
-                <table>
+                <!-- [IA] inicio · ia/2026-11-12_victorbarrera1_cliente-detalle.md -->
+                <form id="form-cuenta" novalidate>
+                <table>
@@
-                            <td><input class="input" type="text" id="cuenta-nombre" placeholder="Usuario 1" autocomplete="name"></td>
+                            <td>
+                                <input class="input" type="text" id="cuenta-nombre" placeholder="Usuario 1" autocomplete="name" aria-describedby="cuenta-error-nombre">
+                                <p class="campo-error" id="cuenta-error-nombre" hidden></p>
+                            </td>
@@
-                            <td><input class="input" type="email" id="cuenta-correo" placeholder="Correo Electronico" autocomplete="email"></td>
+                            <td>
+                                <input class="input" type="email" id="cuenta-correo" placeholder="Correo Electronico" autocomplete="email" aria-describedby="cuenta-error-correo">
+                                <p class="campo-error" id="cuenta-error-correo" hidden></p>
+                            </td>
@@
-                            <td><input class="input" type="password" id="cuenta-contrasena-actual" placeholder="Solo si vas a cambiarla" autocomplete="current-password"></td>
+                            <td>
+                                <input class="input" type="password" id="cuenta-contrasena-actual" placeholder="Solo si vas a cambiarla" autocomplete="current-password" aria-describedby="cuenta-error-contrasena-actual">
+                                <p class="campo-error" id="cuenta-error-contrasena-actual" hidden></p>
+                            </td>
@@
-                            <td><input class="input" type="password" id="cuenta-contrasena-nueva" placeholder="Contraseña nueva (mínimo 6)" autocomplete="new-password"></td>
+                            <td>
+                                <input class="input" type="password" id="cuenta-contrasena-nueva" placeholder="Contraseña nueva (mínimo 6)" autocomplete="new-password" aria-describedby="cuenta-error-contrasena-nueva">
+                                <p class="campo-error" id="cuenta-error-contrasena-nueva" hidden></p>
+                            </td>
@@
-                                <button type="button" class="btn btn-primary" id="guardar-cuenta">Guardar cambios</button>
-                                <p id="cuenta-aviso" class="text-sm" role="status" aria-live="polite"></p>
+                                <button type="submit" class="btn btn-primary" id="guardar-cuenta">Guardar cambios</button>
+                                <p id="cuenta-aviso" class="text-sm" role="status" aria-live="polite" aria-atomic="true"></p>
@@
-                            <td>Modo oscuro</td>
-                            <td><input type="checkbox" id="modo-oscuro" aria-label="Activar modo oscuro"></td>
+                            <td><label for="modo-oscuro">Modo oscuro</label></td>
+                            <td><input type="checkbox" id="modo-oscuro"></td>
@@
-                </table>
+                </table>
+                </form>
+                <!-- [IA] fin -->

diff --git a/src/configuracion.js b/src/configuracion.js
@@
-const botonGuardarCuenta = document.querySelector('#guardar-cuenta')
+const formularioCuenta = document.querySelector('#form-cuenta')
 const botonEliminarCuenta = document.querySelector('#eliminar-cuenta')
 
-if (botonGuardarCuenta && botonEliminarCuenta) {
-    const avisoCuenta = document.querySelector('#cuenta-aviso')
+if (formularioCuenta && botonEliminarCuenta) {
+    const avisoCuenta = formularioCuenta.querySelector('#cuenta-aviso')
+    const botonGuardarCuenta = formularioCuenta.querySelector('#guardar-cuenta')
     const campos = {
-        nombre: document.querySelector('#cuenta-nombre'),
-        correo: document.querySelector('#cuenta-correo'),
-        contrasenaActual: document.querySelector('#cuenta-contrasena-actual'),
-        contrasenaNueva: document.querySelector('#cuenta-contrasena-nueva'),
+        nombre: { campo: ..., error: ... },
+        correo: { campo: ..., error: ... },
+        contrasenaActual: { campo: ..., error: ... },
+        contrasenaNueva: { campo: ..., error: ... },
     }
@@
+    function limpiarErrorCuenta(clave) { ... }
     function limpiarErroresCuenta() { ... }
+    function mostrarErrorCuenta(clave, mensaje) { ... }
     function marcarErroresCuenta(errores) { ... }
 
-    botonGuardarCuenta.addEventListener('click', async () => {
+    formularioCuenta.addEventListener('submit', async (evento) => {
+        evento.preventDefault()
         limpiarErroresCuenta()
+        mostrarAvisoCuenta('')
@@
+        const textoBoton = botonGuardarCuenta.textContent
         botonGuardarCuenta.disabled = true
+        botonGuardarCuenta.textContent = 'Guardando…'
@@
-                const mensajes = marcarErroresCuenta(respuesta.errores)
+                const { mensajes, primero } = marcarErroresCuenta(respuesta.errores)
@@
+                primero?.focus()
                 return
@@
         } finally {
             botonGuardarCuenta.disabled = false
+            botonGuardarCuenta.textContent = textoBoton
         }
     })

diff --git a/src/css/dashboard.css b/src/css/dashboard.css
@@
+/* El detalle de cliente usa un solo panel: evita la columna vacía. */
+main.detalles--unico {
+    grid-template-columns: 1fr;
+}
+
+.cliente-ficha { ... }
+.cliente-ficha h3 { ... }
+.cliente-estatus { ... }
+.cliente-nota { ... }
+.cliente-favorito { ... }
+.cliente-ventas-header { ... }
+.cliente-ventas-header h3 { ... }
+html.dark .cliente-favorito { color: #fbbf24; }
```

Archivos nuevos:

- `cliente.html`: `<main class="detalles detalles--unico">`, `#cliente-estado`,
  `#cliente-contenido` oculto, ficha y tabla de ventas.
- `src/cliente.js`: carga paralela, estados, ficha, ventas y total; todo el
  texto se pinta con `textContent`/`replaceChildren`.

## Qué se incorporó

- Vista `cliente.html?id=...` con detalle del cliente y sus ventas.
- Enlace del nombre en Clientes al detalle, con `encodeURIComponent`.
- `cliente.html` como vista privada y conservación del query string en
  `?volver=`, tanto al generar el login como al volver tras autenticarse.
- Panel de cuenta con `<form>`, submit, errores inline por campo, foco en el
  primer error, limpieza al escribir, botón deshabilitado mientras guarda.
- Label visible para el modo oscuro y asociación de `#cuenta-aviso` con
  `role="status"`/`aria-live="polite"`.
- Ajuste de `main.detalles--unico` a una columna y estilos de la ficha.

## Verificación

- `node --check` pasa en `src/cliente.js`, `src/configuracion.js`,
  `src/guard.js` y `src/clientes.js`.
- `npm run build` pasa (`vite v8.3.0`).
- Detalle de cliente con admin (`victor.barrera@mail.udp.cl` / `demo1234`):
  - `cliente.html?id=cli-001`: Carlos Leoui, badge «Activo», 1 venta
    «META ADS» por `$120.000`, total «1 venta · $120.000», título
    «Carlos Leoui - MaldOps».
  - `cliente.html`: «Cliente no encontrado / Falta el id del cliente en la
    dirección.» con enlace a `clientes.html`.
  - `cliente.html?id=no-existe`: «Cliente no encontrado / El cliente que buscas
    no existe o fue eliminado.».
  - `cliente.html?id=cli-001&fallar=500`: error con «Reintentar» y sin errores
    en consola.
  - Cliente de prueba sin ventas (`cli-013`): «Sin ventas registradas» y
    «0 ventas · $0»; luego se eliminó y la lista volvió a 12 clientes.
- Sesión vencida: `cliente.html?id=cli-001` redirige a
  `index.html?volver=cliente.html%3Fid%3Dcli-001`; tras iniciar sesión vuelve a
  `cliente.html?id=cli-001`.
- Panel de cuenta:
  - Formulario `#form-cuenta`, botón `type="submit"`, labels visibles y
    `aria-describedby` en los cuatro campos.
  - Contraseña actual incorrecta: error bajo el campo, `aria-invalid` y foco en
    «Contraseña actual».
  - Contraseña nueva corta: error bajo el campo, `aria-invalid` y foco en
    «Cambiar contraseña».
  - Guardar nombre/correo: «Cambios guardados.», actualiza el menú y persiste
    tras recargar. Los datos del admin se revirtieron a `Victor Barrera` /
    `victor.barrera@mail.udp.cl`.
  - Modo oscuro: se activa, `html.dark` y el checkbox se mantienen tras
    recargar (`maldops.tema = oscuro`).
  - Cuenta temporal creada desde Registro: se eliminó desde Configuración, la
    sesión se borró y la página redirigió a `index.html`.
- Consola del navegador sin errores en las pruebas.
