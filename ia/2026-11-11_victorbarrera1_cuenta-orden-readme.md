# Edición y eliminación de la cuenta, menú de orden de clientes y actualización del README

- **Fecha:** 2026-11-11
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Herramienta y modelo:** asistente de IA conversacional con acceso al repositorio (nombre y modelo omitidos, ver nota)
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** `src/api/servidor.js`, `src/api/http.js`, `src/api.js` (perfil), `configuracion.html` y `src/configuracion.js` (cuenta y diálogo), `src/clientes.js` (orden), `README.md`

> Nota: en este registro el nombre de la herramienta y del modelo se reemplazó por «[herramienta de IA]» por decisión del integrante. Fuera de eso, los textos son los originales.

## Objetivo

La pantalla de Configuración mostraba campos de cuenta que no guardaban nada, el menú «Ordenar clientes» existía sin código y el README no describía las funciones nuevas. Se consultó a la IA para completarlo antes de la entrega.

## Conversación (texto completo, sin editar)

### Prompt 1
ya entonces corrige lo de maldops y comitealo ahora que quitaste la etiqueta

### Respuesta 1
Hice los tres commits, limpios y a tu nombre, pero **no los subí a GitHub**. Corregí lo que quedaba pendiente de mi lista y encontré un fallo extra.

**Lo que corregí**
- **Configuración ahora guarda de verdad.** Puedes cambiar nombre, correo y contraseña (pide la actual). También puedes eliminar la cuenta, con confirmación. La única cuenta de administrador no se puede eliminar, y el sistema avisa si el correo ya existe.
- **Fallo nuevo: el menú «Ordenar clientes» no hacía nada.** Existía en la página, pero faltaba el código. Ahora ordena de A a Z, de Z a A, o con favoritos primero.
- **«Restablecer datos de prueba»** ahora usa el diálogo del sitio, no el cuadro feo del navegador.
- **README actualizado.** Documenta cuenta, exportar a Excel, buscador, favoritos y notas, los dos endpoints nuevos y el formato de `clientes.json`.

**Cómo lo verifiqué:** probé la lógica de cuenta con 16 casos en Node, todos bien, y el orden con datos de ejemplo. El build compila. **No probé con clics en el navegador**, así que pásale una vuelta a mano: Configuración, el menú de orden en Clientes y el botón de contactar en Ayuda.

**Lo que sigue sin hacer:**
- La vista de Clientes no muestra las ventas de cada cliente, aunque la API ya lo permite.
- Si tu equipo exige el registro de uso de IA en `ia/`, no lo hice. Tú decides.
- Los PR #16 y #17 siguen abiertos. El #16 tiene un conflicto en un archivo de `ia/`.

### Cambios que la herramienta aplicó a los archivos (código)

Este es el diff completo de los tres commits resultantes:

```diff
commit b508cd0 — feat(configuracion): edita y elimina la cuenta, y usa el diálogo del sitio al restablecer [IA]

diff --git a/configuracion.html b/configuracion.html
index 473bda5..af24bec 100644
--- a/configuracion.html
+++ b/configuracion.html
@@ -28,16 +28,27 @@
                 <table>
                     <tbody>
                         <tr>
-                            <td>Editar nombre de la cuenta</td>
-                            <td><input class="input" type="text" id="cuenta-nombre" placeholder="Usuario 1"></td>
+                            <td><label for="cuenta-nombre">Editar nombre de la cuenta</label></td>
+                            <td><input class="input" type="text" id="cuenta-nombre" placeholder="Usuario 1" autocomplete="name"></td>
                         </tr>
                         <tr>
-                            <td>Cambiar contraseña</td>
-                            <td><input class="input" type="password" placeholder="Contraseña"></td>
+                            <td><label for="cuenta-correo">Cambiar correo</label></td>
+                            <td><input class="input" type="email" id="cuenta-correo" placeholder="Correo Electronico" autocomplete="email"></td>
                         </tr>
                         <tr>
-                            <td>Cambiar correo</td>
-                            <td><input class="input" type="text" id="cuenta-correo" placeholder="Correo Electronico"></td>
+                            <td><label for="cuenta-contrasena-actual">Contraseña actual</label></td>
+                            <td><input class="input" type="password" id="cuenta-contrasena-actual" placeholder="Solo si vas a cambiarla" autocomplete="current-password"></td>
+                        </tr>
+                        <tr>
+                            <td><label for="cuenta-contrasena-nueva">Cambiar contraseña</label></td>
+                            <td><input class="input" type="password" id="cuenta-contrasena-nueva" placeholder="Contraseña nueva (mínimo 6)" autocomplete="new-password"></td>
+                        </tr>
+                        <tr>
+                            <td>Guardar cambios de la cuenta</td>
+                            <td>
+                                <button type="button" class="btn btn-primary" id="guardar-cuenta">Guardar cambios</button>
+                                <p id="cuenta-aviso" class="text-sm" role="status" aria-live="polite"></p>
+                            </td>
                         </tr>
 
                         <tr>
@@ -46,7 +57,7 @@
                         </tr>
                         <tr>
                             <td>Eliminar cuenta</td>
-                            <td><button class="btn btn-danger">Eliminar</button></td>
+                            <td><button type="button" class="btn btn-danger" id="eliminar-cuenta">Eliminar</button></td>
                         </tr>
 
                     </tbody>
@@ -54,6 +65,17 @@
             </div>
             <!-- Fin Clientes activos -->
 
+            <dialog id="confirmar-dialogo" class="modal" aria-labelledby="confirmar-titulo">
+                <form method="dialog">
+                    <h2 id="confirmar-titulo">Confirmar eliminación</h2>
+                    <p class="estado-detalle" id="confirmar-mensaje"></p>
+                    <div class="modal-acciones">
+                        <button type="submit" class="btn" value="cancelar">Cancelar</button>
+                        <button type="submit" class="btn btn-danger" value="confirmar">Eliminar</button>
+                    </div>
+                </form>
+            </dialog>
+
             <!-- Simulador de pruebas -->
             <div class="nuevos-clientes">
                 <div class="header">
diff --git a/src/api.js b/src/api.js
index 6de29e2..0abf3e3 100644
--- a/src/api.js
+++ b/src/api.js
@@ -51,6 +51,14 @@ export const auth = {
     async perfil() {
         return llamar('perfil')
     },
+
+    async actualizarPerfil(datos) {
+        return llamar('actualizarPerfil', datos)
+    },
+
+    async eliminarCuenta() {
+        return llamar('eliminarCuenta')
+    },
 }
 
 export const clientes = {
diff --git a/src/api/http.js b/src/api/http.js
index 55124bb..9481aae 100644
--- a/src/api/http.js
+++ b/src/api/http.js
@@ -154,6 +154,30 @@ export async function perfil() {
     return respuesta
 }
 
+export async function actualizarPerfil(datos = {}) {
+    const respuesta = await solicitar('/auth/perfil', {
+        metodo: 'PATCH',
+        cuerpo: {
+            nombre: datos.nombre,
+            correo: datos.correo,
+            contrasenaActual: datos.contrasenaActual,
+            contrasenaNueva: datos.contrasenaNueva,
+        },
+    })
+
+    return guardarSesionSiCorresponde(respuesta)
+}
+
+export async function eliminarCuenta() {
+    const respuesta = await solicitar('/auth/perfil', { metodo: 'DELETE' })
+
+    if (respuesta.ok) {
+        borrarSesion()
+    }
+
+    return respuesta
+}
+
 export async function listarClientes() {
     return solicitar('/clientes')
 }
diff --git a/src/api/servidor.js b/src/api/servidor.js
index 54737da..a810dab 100644
--- a/src/api/servidor.js
+++ b/src/api/servidor.js
@@ -455,6 +455,118 @@ export async function perfil() {
     })
 }
 
+/**
+ * Actualiza nombre, correo y/o contraseña de la cuenta con sesión.
+ * Para cambiar la contraseña hay que enviar `contrasenaActual` y `contrasenaNueva`.
+ * Solo se aplican los campos enviados; si no hay cambios responde 200 sin tocar nada.
+ */
+export async function actualizarPerfil(datos = {}) {
+    return conSesion(async (sesion) => {
+        const db = await inicializarDb()
+        const usuario = db.usuarios.find((elemento) => elemento.id === sesion.id)
+
+        if (!usuario) {
+            borrarSesion()
+
+            return fallo('Tu sesión ya no es válida. Inicia sesión de nuevo.', 401)
+        }
+
+        const errores = {}
+        const cambios = {}
+        let conflicto = false
+        const trae = (clave) => Object.prototype.hasOwnProperty.call(datos, clave)
+
+        if (trae('nombre')) {
+            const nombre = normalizarTexto(datos.nombre)
+
+            if (!nombre) {
+                errores.nombre = 'Escribe tu nombre de usuario.'
+            } else if (nombre.length < 2) {
+                errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
+            } else if (nombre.length > 80) {
+                errores.nombre = 'El nombre no puede superar los 80 caracteres.'
+            } else {
+                cambios.nombre = nombre
+            }
+        }
+
+        if (trae('correo')) {
+            const correo = normalizarCorreo(datos.correo)
+
+            if (!correo) {
+                errores.correo = 'Escribe tu correo electrónico.'
+            } else if (!correoPermitido(correo)) {
+                errores.correo = 'Solo puedes usar un correo @gmail.com o @mail.udp.cl.'
+            } else if (
+                db.usuarios.some(
+                    (otro) => otro.id !== usuario.id && normalizarCorreo(otro.correo) === correo,
+                )
+            ) {
+                conflicto = true
+                errores.correo = 'Ya existe una cuenta con ese correo.'
+            } else {
+                cambios.correo = correo
+            }
+        }
+
+        const nueva = String(datos.contrasenaNueva ?? '')
+
+        if (nueva) {
+            if (String(datos.contrasenaActual ?? '') !== usuario.contrasena) {
+                errores.contrasenaActual = 'La contraseña actual no es correcta.'
+            }
+
+            if (nueva.length < 6) {
+                errores.contrasenaNueva = 'La contraseña nueva debe tener al menos 6 caracteres.'
+            } else {
+                cambios.contrasena = nueva
+            }
+        }
+
+        if (hayErrores(errores)) {
+            return fallo('Revisa los datos de tu cuenta.', conflicto ? 409 : 422, errores)
+        }
+
+        Object.assign(usuario, cambios)
+        guardarDb(db)
+
+        const publico = sinContrasena(usuario)
+        guardarSesion(publico)
+
+        return ok(publico)
+    })
+}
+
+/**
+ * Elimina la cuenta con sesión y cierra la sesión.
+ * No deja eliminar a la única cuenta de administrador.
+ */
+export async function eliminarCuenta() {
+    return conSesion(async (sesion) => {
+        const db = await inicializarDb()
+        const indice = db.usuarios.findIndex((elemento) => elemento.id === sesion.id)
+
+        if (indice === -1) {
+            borrarSesion()
+
+            return fallo('Tu sesión ya no es válida. Inicia sesión de nuevo.', 401)
+        }
+
+        const usuario = db.usuarios[indice]
+        const administradores = db.usuarios.filter((otro) => otro.rol === 'admin')
+
+        if (usuario.rol === 'admin' && administradores.length <= 1) {
+            return fallo('No puedes eliminar la única cuenta de administrador.', 409)
+        }
+
+        db.usuarios.splice(indice, 1)
+        guardarDb(db)
+        borrarSesion()
+
+        return ok({ mensaje: 'Cuenta eliminada.' })
+    })
+}
+
 // ---------------------------------------------------------------------------
 // Clientes
 // ---------------------------------------------------------------------------
diff --git a/src/configuracion.js b/src/configuracion.js
index ffd6c75..746e61d 100644
--- a/src/configuracion.js
+++ b/src/configuracion.js
@@ -11,6 +11,8 @@ import {
     crearVacio,
     crearError,
     mensajeDeError,
+    mostrarToast,
+    confirmarAccion,
 } from './ui.js'
 
 const formulario = document.querySelector('#form-simulador')
@@ -175,8 +177,9 @@ if (formulario) {
     })
 
     botonReiniciar.addEventListener('click', async () => {
-        const confirmado = window.confirm(
+        const confirmado = await confirmarAccion(
             '¿Restablecer los datos de prueba? Se borrarán los cambios y la sesión actual.',
+            { titulo: 'Restablecer datos de prueba', textoConfirmar: 'Restablecer' },
         )
 
         if (!confirmado) {
@@ -205,3 +208,145 @@ if (formulario) {
 
     cargarConfiguracion()
 }
+
+/* ------------------------------------------------------------------------- */
+/* Cuenta: guardar cambios y eliminar                                         */
+/* ------------------------------------------------------------------------- */
+
+const botonGuardarCuenta = document.querySelector('#guardar-cuenta')
+const botonEliminarCuenta = document.querySelector('#eliminar-cuenta')
+
+if (botonGuardarCuenta && botonEliminarCuenta) {
+    const avisoCuenta = document.querySelector('#cuenta-aviso')
+    const campos = {
+        nombre: document.querySelector('#cuenta-nombre'),
+        correo: document.querySelector('#cuenta-correo'),
+        contrasenaActual: document.querySelector('#cuenta-contrasena-actual'),
+        contrasenaNueva: document.querySelector('#cuenta-contrasena-nueva'),
+    }
+
+    function mostrarAvisoCuenta(mensaje, tipo = 'info') {
+        avisoCuenta.textContent = mensaje
+        avisoCuenta.style.color =
+            tipo === 'error'
+                ? 'var(--color-peligro, #b91c1c)'
+                : tipo === 'exito'
+                  ? 'var(--color-exito, #166534)'
+                  : 'var(--color-texto-suave, #475569)'
+    }
+
+    function limpiarErroresCuenta() {
+        for (const campo of Object.values(campos)) {
+            campo?.removeAttribute('aria-invalid')
+        }
+    }
+
+    function marcarErroresCuenta(errores) {
+        const mensajes = []
+
+        for (const [clave, mensaje] of Object.entries(errores || {})) {
+            campos[clave]?.setAttribute('aria-invalid', 'true')
+            mensajes.push(mensaje)
+        }
+
+        return mensajes
+    }
+
+    botonGuardarCuenta.addEventListener('click', async () => {
+        limpiarErroresCuenta()
+
+        const datos = {
+            nombre: campos.nombre.value,
+            correo: campos.correo.value,
+        }
+
+        if (campos.contrasenaActual.value || campos.contrasenaNueva.value) {
+            if (!campos.contrasenaNueva.value) {
+                campos.contrasenaNueva.setAttribute('aria-invalid', 'true')
+                mostrarAvisoCuenta('Escribe la contraseña nueva.', 'error')
+                return
+            }
+
+            datos.contrasenaActual = campos.contrasenaActual.value
+            datos.contrasenaNueva = campos.contrasenaNueva.value
+        }
+
+        botonGuardarCuenta.disabled = true
+        mostrarAvisoCuenta('Guardando cambios…')
+
+        try {
+            const respuesta = await api.auth.actualizarPerfil(datos)
+
+            if (esNoAutorizado(respuesta)) {
+                irAlLogin()
+                return
+            }
+
+            if (!respuesta.ok) {
+                const mensajes = marcarErroresCuenta(respuesta.errores)
+
+                mostrarAvisoCuenta(
+                    mensajes.length > 0
+                        ? mensajes.join(' ')
+                        : mensajeDeError(respuesta, 'No se pudieron guardar los cambios.'),
+                    'error',
+                )
+                return
+            }
+
+            const perfil = respuesta.data
+
+            campos.nombre.value = perfil.nombre || ''
+            campos.correo.value = perfil.correo || ''
+            campos.contrasenaActual.value = ''
+            campos.contrasenaNueva.value = ''
+
+            const nombreEnMenu = document.querySelector('.nav-usuario-nombre')
+
+            if (nombreEnMenu) {
+                nombreEnMenu.textContent = perfil.nombre || ''
+            }
+
+            mostrarAvisoCuenta('Cambios guardados.', 'exito')
+            mostrarToast('Los datos de tu cuenta se guardaron.')
+        } catch {
+            mostrarAvisoCuenta('No se pudieron guardar los cambios. Revisa tu conexión.', 'error')
+        } finally {
+            botonGuardarCuenta.disabled = false
+        }
+    })
+
+    botonEliminarCuenta.addEventListener('click', async () => {
+        const confirmado = await confirmarAccion(
+            '¿Eliminar tu cuenta? Se cerrará tu sesión y no podrás volver a entrar con este correo. Esta acción no se puede deshacer.',
+            { titulo: 'Eliminar cuenta', textoConfirmar: 'Eliminar cuenta' },
+        )
+
+        if (!confirmado) {
+            return
+        }
+
+        botonEliminarCuenta.disabled = true
+
+        try {
+            const respuesta = await api.auth.eliminarCuenta()
+
+            if (esNoAutorizado(respuesta)) {
+                irAlLogin()
+                return
+            }
+
+            if (!respuesta.ok) {
+                mostrarToast(mensajeDeError(respuesta, 'No se pudo eliminar la cuenta.'), 'error')
+                return
+            }
+
+            mostrarToast('Cuenta eliminada.')
+            window.setTimeout(() => window.location.assign('index.html'), 700)
+        } catch {
+            mostrarToast('No se pudo eliminar la cuenta. Revisa tu conexión.', 'error')
+        } finally {
+            botonEliminarCuenta.disabled = false
+        }
+    })
+}
commit 6da3e0e — fix(clientes): conecta el menú «Ordenar clientes» [IA]

diff --git a/src/clientes.js b/src/clientes.js
index 4814acd..b15b413 100644
--- a/src/clientes.js
+++ b/src/clientes.js
@@ -244,12 +244,32 @@ function mostrarVacio() {
     }
 }
 
+const campoOrden = document.querySelector('#clientes-orden')
+
+/** Ordena una copia de la lista según la opción del menú «Ordenar clientes». */
+function ordenarClientes(lista, criterio = 'nombre-asc') {
+    const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
+    const copia = [...lista]
+
+    if (criterio === 'nombre-desc') {
+        return copia.sort((a, b) => porNombre(b, a))
+    }
+
+    if (criterio === 'favoritos') {
+        return copia.sort(
+            (a, b) => Number(b.favorito === true) - Number(a.favorito === true) || porNombre(a, b),
+        )
+    }
+
+    return copia.sort(porNombre)
+}
+
 // [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
 function aplicarVista() {
     const texto = (campoBusqueda?.value || '').trim().toLowerCase()
     const soloFavoritos = Boolean(filtroFavoritos?.checked)
 
-    const visibles = clientesActuales.filter((cliente) => {
+    const filtrados = clientesActuales.filter((cliente) => {
         if (soloFavoritos && cliente.favorito !== true) {
             return false
         }
@@ -261,6 +281,8 @@ function aplicarVista() {
         )
     })
 
+    const visibles = ordenarClientes(filtrados, campoOrden?.value)
+
     total.textContent = String(visibles.length)
 
     if (visibles.length === 0) {
@@ -300,6 +322,7 @@ document.addEventListener('maldops:buscar', (evento) => {
     }
 })
 filtroFavoritos?.addEventListener('change', aplicarVista)
+campoOrden?.addEventListener('change', aplicarVista)
 // [IA] fin
 
 async function cargarClientes() {
commit 952707c — docs(readme): documenta cuenta, exportación a Excel, buscador, favoritos y notas [IA]

diff --git a/README.md b/README.md
index 5b5311d..6bea065 100644
--- a/README.md
+++ b/README.md
@@ -80,6 +80,8 @@ Las cuatro cuentas están en `public/mocks/usuarios.json`. El login y el registr
 
 También se puede crear una cuenta nueva desde **Registro**; queda con rol `vendedor`.
 
+Desde **Configuración** se puede editar el nombre, el correo y la contraseña de la cuenta, o eliminarla. La única cuenta de administrador no se puede eliminar (`409`). Si se elimina una cuenta de prueba, **Restablecer datos de prueba** la recupera.
+
 ## Vistas
 
 | Vista | Ruta | Cómo llegar | Acceso |
@@ -99,10 +101,11 @@ Las vistas privadas están marcadas con `data-privada="true"` en el `<body>`. Si
 - **Sesión simulada:** login y registro con validación por campo, sesión persistente en `localStorage`, cierre de sesión y guard para las vistas privadas. Los errores `401` vuelven al login.
 - **Roles:** `admin` y `vendedor`. Solo el administrador ve y puede ejecutar la eliminación de clientes y ventas.
 - **Dashboard:** cuatro métricas calculadas con datos reales de la API —clientes totales, ventas obtenidas, ganancias y ticket promedio—, además de las últimas ocho ventas y los primeros cinco clientes.
-- **Clientes:** listado con total y CRUD. Crear y editar usan un diálogo con validación por campo; el nombre duplicado responde `409`. Eliminar pide confirmación y falla con `409` si el cliente tiene ventas asociadas.
-- **Ventas:** listado con total y CRUD. El formulario carga los clientes desde la API, valida un precio entero mayor que 0 y ofrece los servicios y estatus del catálogo. Eliminar también pide confirmación.
-- **Ayuda:** preguntas frecuentes cargadas desde la API (ocho registros) y datos de contacto del equipo.
-- **Configuración:** datos de la cuenta y **simulador de pruebas**: latencia (rápida, normal o lenta), probabilidad de error (0 %, 10 %, 25 % o 50 %), forzar el próximo fallo `500` y restablecer los datos de prueba.
+- **Clientes:** listado con total y CRUD. Crear y editar usan un diálogo con validación por campo; el nombre duplicado responde `409`. Eliminar pide confirmación y falla con `409` si el cliente tiene ventas asociadas. Cada cliente puede marcarse como **favorito** (estrella) y tener una **nota** de hasta 300 caracteres. La lista se puede **buscar** por nombre o nota, filtrar por **solo favoritos** y ordenar.
+- **Ventas:** listado con total y CRUD. El formulario carga los clientes desde la API, valida un precio entero mayor que 0 y ofrece los servicios y estatus del catálogo. Eliminar también pide confirmación. Tres botones **Exportar a Excel** descargan un archivo `.csv` (separador `;`, se abre con doble clic en Excel): reporte de ventas, campañas más vendidas e historial de ventas por cliente. Los reportes cuentan todas las ventas, incluidas las devueltas, igual que el dashboard.
+- **Buscador de la barra superior:** filtra en vivo la lista de Clientes o de Ventas. Desde otra vista, al pulsar Enter abre Clientes con el texto buscado (`clientes.html?q=texto`).
+- **Ayuda:** preguntas frecuentes en acordeón cargadas desde la API (ocho registros) y datos de contacto del equipo; el botón «contactar» abre el correo del integrante.
+- **Configuración:** edición de la cuenta (nombre, correo, contraseña —pide la actual— y eliminar cuenta, con diálogo de confirmación), modo oscuro y **simulador de pruebas**: latencia (rápida, normal o lenta), probabilidad de error (0 %, 10 %, 25 % o 50 %), forzar el próximo fallo `500` y restablecer los datos de prueba.
 - **Estados de interfaz:** cada vista con datos muestra esqueleto de carga, estado vacío y error con botón **Reintentar**. Añadir `?fallar` a la URL fuerza un `500`; `?fallar=404` fuerza ese código.
 - **Avisos y accesibilidad:** toasts para éxito y error, diálogos `<dialog>` nativos y `aria-invalid` en los campos con error.
 
@@ -153,6 +156,8 @@ Las rutas son relativas a `VITE_API_URL`. Por ejemplo, si vale `http://localhost
 | `api.auth.registrar(datos)` | POST | `/auth/registro` | Crea una cuenta con rol `vendedor` e inicia sesión. 201 · 409 (correo en uso) · 422 · 500 |
 | `api.auth.cerrarSesion()` | POST | `/auth/logout` | Cierra la sesión. 200 · 204 |
 | `api.auth.perfil()` 🔒 | GET | `/auth/perfil` | Devuelve la cuenta de la sesión. 200 · 401 · 500 |
+| `api.auth.actualizarPerfil(datos)` 🔒 | PATCH | `/auth/perfil` | Edita `nombre`, `correo` y/o la contraseña (`contrasenaActual` + `contrasenaNueva`). Correo en uso: 409. 200 · 401 · 409 · 422 · 500 |
+| `api.auth.eliminarCuenta()` 🔒 | DELETE | `/auth/perfil` | Elimina la cuenta de la sesión y la cierra. No deja eliminar al único administrador. 200 · 401 · 409 · 500 |
 | `api.clientes.listar()` 🔒 | GET | `/clientes` | Lista todos los clientes. 200 · 401 · 500 |
 | `api.clientes.obtener(id)` 🔒 | GET | `/clientes/:id` | Un cliente por id. 200 · 401 · 404 · 500 |
 | `api.clientes.crear(datos)` 🔒 | POST | `/clientes` | Crea un cliente. 201 · 401 · 409 (nombre repetido) · 422 · 500 |
@@ -204,7 +209,7 @@ Cualquier llamada puede responder `500` si el simulador o `?fallar` lo fuerza.
 | Archivo | Registros | Contenido |
 |---|---|---|
 | `usuarios.json` | 4 | Cuentas con nombre, correo, contraseña de demostración y rol (`admin`/`vendedor`) |
-| `clientes.json` | 12 | `id`, `nombre` y `estatus` (`Activo`/`Inactivo`) |
+| `clientes.json` | 12 | `id`, `nombre` y `estatus` (`Activo`/`Inactivo`). La API agrega `favorito` (`false`) y `nota` (vacía) a cada cliente; se guardan al marcarlos o editarlos |
 | `ventas.json` | 15 | `id`, `clienteId`, `precio` (CLP), `servicio` y `estatus` |
 | `preguntas.json` | 8 | `id`, `pregunta` y `respuesta` para la vista de ayuda |
 
@@ -236,7 +241,8 @@ maldOps/
 │   │   └── http.js            # Transporte fetch para el backend real
 │   ├── css/                   # app.css (tema, reset y componentes), dashboard.css y login.css
 │   ├── main.js                # Alpine, iconos, menú y cierre de sesión
-│   ├── nav.js                 # Menú lateral y barra superior compartidos
+│   ├── nav.js                 # Menú lateral y barra superior (con buscador) compartidos
+│   ├── exportar.js            # Descarga de reportes en CSV para Excel
 │   ├── guard.js               # Protección de vistas privadas
 │   ├── iconos.js              # Ionicons desde npm (solo los iconos usados)
 │   ├── ui.js                  # Estados, badges, toasts y confirmaciones

```

## Qué se incorporó al proyecto

- API de cuenta: `actualizarPerfil` y `eliminarCuenta` en el servidor simulado y en `http.js`, con la validación por campo y los códigos 401, 409 y 422.
- Pantalla de Configuración: guardar cambios con avisos por campo (`aria-invalid`), eliminar cuenta con confirmación y el diálogo compartido al restablecer datos.
- Orden de clientes (A-Z, Z-A, favoritos primero) en `clientes.js`.
- README: funcionalidades, endpoints nuevos, formato de `clientes.json` y estructura.
- Se descartó, por ahora, mostrar las ventas de cada cliente (se retoma en la vista de detalle).

## Verificación

- Se probó la lógica de cuenta llamando directo al servidor simulado desde Node, con 16 casos: sin sesión, nombre vacío, dominio no permitido, correo repetido, contraseña actual incorrecta, contraseña corta, cambio válido, login con la clave vieja y la nueva, eliminar cuenta y no poder eliminar al único administrador.
- Se comprobó el comparador de orden con datos de ejemplo (tildes y mayúsculas).
- `npm run build` compila. Falta la prueba manual con clics en el navegador.
- Se revisó el código incorporado y se entiende cómo fluyen los datos: la vista llama a `api.js`, que usa `servidor.js` (o `http.js` en la Entrega 3).
