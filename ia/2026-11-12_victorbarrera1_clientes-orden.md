# Clientes: búsqueda, favoritos y orden con un solo listener

- **Fecha:** 2026-11-12
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Herramienta y modelo:** OpenCode — DeepSeek V4.1 Flash Free
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** `src/clientes.js`, `ia/PLAN.md`, `ia/README.md`; `src/css/dashboard.css` (corrección de sintaxis en commit aparte)

## Objetivo

Que en Clientes funcionen juntos la búsqueda, el filtro de favoritos y el
orden, con un solo listener y sin código duplicado.

## Conversación (texto completo, sin editar)

### Prompt 1

```text
Trabaja en el repositorio MaldOps (Vite + Alpine + Tailwind v4, API simulada en `src/api/`). Rama de trabajo: `fix/revision-final`; si no existe, créala desde `origin/main`. Antes de editar, lee los archivos indicados y muestra un plan breve. No reescribas historial de git.

OBJETIVO
Que en Clientes funcionen juntos la búsqueda, el filtro de favoritos y el orden, con un solo listener y sin código duplicado.

ESTADO ACTUAL (verifícalo antes de tocar)
- `src/clientes.js` tiene `campoBusqueda`, `filtroFavoritos` y `campoOrden`.
- `aplicarVista()` (aprox. línea 270) filtra por texto y favoritos, ordena con `ordenarClientes()` y pinta la tabla.
- `campoBusqueda` escucha `input` con `aplicarVista`; `campoOrden` escucha `change` con `aplicarVista`.
- Al final del archivo (aprox. línea 513) queda un listener duplicado:
  `filtroFavoritos?.addEventListener('change', aplicarFiltro)`.
- `aplicarFiltro()` (aprox. línea 117) solo lo usa ese listener duplicado; ignora la búsqueda y el orden.
- `clientes.html` ya tiene `<select id="clientes-orden">` con `nombre-asc`, `nombre-desc` y `favoritos`.

TAREAS
1. Deja un único listener para favoritos: `filtroFavoritos?.addEventListener('change', aplicarVista)`.
2. Elimina el listener duplicado del final del archivo.
3. Elimina `aplicarFiltro()` si queda sin uso, junto con cualquier helper o import que solo usara ella.
4. Verifica que `aplicarVista()` combine los tres criterios: texto (nombre o nota), `soloFavoritos` y `campoOrden.value`. Debe actualizar `#clientes-total`, el estado vacío y la tabla.
5. Comprueba que `aplicarVista()` se vuelva a llamar después de cargar, crear, editar, eliminar y alternar un favorito.
6. No cambies la API ni el HTML, salvo que falte el select.

PRUEBAS MANUALES
- Con los 12 clientes: busca, marca/desmarca favoritos y cambia el orden; combina los tres criterios.
- Orden A-Z, Z-A y «Favoritos primero».
- Búsqueda sin resultados y filtro de favoritos vacío: debe aparecer el mensaje vacío correcto.
- Sesión admin y sesión vendedor.
- `npm run build` debe pasar.

CIERRE
- Registra la tarea en `ia/PLAN.md`.
- Crea `ia/2026-11-12_<tu-usuario>_clientes-orden.md` con el prompt literal, la respuesta y la verificación.
- Commit pequeño en español: `fix(clientes): unifica búsqueda, favoritos y orden [IA]`.
```

### Respuesta 1

Eliminé `aplicarFiltro()` y el listener duplicado del final del archivo. Ahora
`filtroFavoritos` escucha `change` con `aplicarVista`, igual que la búsqueda y
el orden. `aplicarVista()` sigue combinando los tres criterios y actualizando
`#clientes-total`, el estado vacío y la tabla.

También ajusté el estado vacío para que distinga tres casos:

- «Aún no tienes favoritos», cuando el filtro está activo y no hay búsqueda.
- «No hay favoritos que coincidan con la búsqueda», cuando el filtro y la
  búsqueda no devuelven nada.
- «Prueba con otra búsqueda», cuando la búsqueda no devuelve nada sin el
  filtro de favoritos.

Agregué la marca `[IA] inicio` que faltaba antes de `alternarFavorito`, para
que el bloque de favoritos quede delimitado. No cambié la API ni el HTML.

El build estaba bloqueado por un error de sintaxis ajeno a esta tarea:
faltaba un `;` tras `outline: 2px solid var(--black)` y sobraba un `//` al
final de `src/css/dashboard.css`. Lo corregí y lo dejé en un commit aparte.

### Cambios aplicados

```diff
diff --git a/src/clientes.js b/src/clientes.js
index a73d0e7..bfcd700 100644
--- a/src/clientes.js
+++ b/src/clientes.js
@@ -79,6 +79,7 @@ function crearBotonFavorito(cliente) {
 }
 // [IA] fin
 
+// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
 async function alternarFavorito(cliente, boton) {
     boton.disabled = true
 
@@ -113,29 +114,6 @@ async function alternarFavorito(cliente, boton) {
 // [IA] fin
 
 
-// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
-function aplicarFiltro() {
-    const soloFavoritos = filtroFavoritos.checked
-    const lista = soloFavoritos
-        ? clientesActuales.filter((cliente) => cliente.favorito)
-        : clientesActuales
-
-    if (soloFavoritos && lista.length === 0) {
-        estado.replaceChildren(
-            crearVacio({
-                titulo: 'Aún no tienes favoritos',
-                mensaje: 'Marca una estrella para verlos aquí.',
-            }),
-        )
-    } else {
-        estado.replaceChildren()
-    }
-
-    pintarFilas(lista)
-}
-// [IA] fin
-
-
 function pintarFilas(clientes) {
     const fragmento = document.createDocumentFragment()
 
@@ -289,12 +267,16 @@ function aplicarVista() {
 
     if (visibles.length === 0) {
         pintarFilas([])
-        estado.replaceChildren(
-            crearVacio({
-                titulo: 'Sin resultados',
-                mensaje: 'Prueba con otra búsqueda o desactiva el filtro de favoritos.',
-            }),
-        )
+
+        const soloFavoritosSinBusqueda = soloFavoritos && !texto
+        const titulo = soloFavoritosSinBusqueda ? 'Aún no tienes favoritos' : 'Sin resultados'
+        const mensaje = soloFavoritosSinBusqueda
+            ? 'Marca una estrella para verlos aquí.'
+            : soloFavoritos
+              ? 'No hay favoritos que coincidan con la búsqueda.'
+              : 'Prueba con otra búsqueda.'
+
+        estado.replaceChildren(crearVacio({ titulo, mensaje }))
         return
     }
 
@@ -507,8 +489,4 @@ if (botonNuevo && dialogo && formulario) {
     botonNuevo.addEventListener('click', () => abrirFormulario())
     botonCancelar.addEventListener('click', () => dialogo.close())
     formulario.addEventListener('submit', guardarCliente)
-}
-
-// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
-filtroFavoritos?.addEventListener('change', aplicarFiltro)
-// [IA] fin
\ No newline at end of file
+}
\ No newline at end of file
```

## Qué se incorporó

- Un solo listener para favoritos: `filtroFavoritos?.addEventListener('change', aplicarVista)`.
- Eliminación de `aplicarFiltro()` y del listener duplicado del final.
- Estado vacío diferenciado para favoritos y búsqueda.
- Marca `[IA]` faltante antes de `alternarFavorito`.
- Registro de la tarea G2 en `ia/PLAN.md` y entrada en `ia/README.md`.
- Corrección aparte de la sintaxis de `src/css/dashboard.css` para que el
  build vuelva a compilar.

## Verificación

- `npm run build` pasa (`vite v8.3.0`, 38 módulos transformados).
- Sesión admin (`victor.barrera@mail.udp.cl` / `demo1234`):
  - 12 clientes en orden A-Z: Benjamin Huerta … Vicente Flores.
  - Z-A: Vicente Flores … Benjamin Huerta.
  - «Favoritos primero» con dos favoritos: Camila Rojas y Pablo Herrera.
  - Búsqueda `pablo` + favoritos + orden: solo Pablo Herrera, total 1.
  - Búsqueda `zzzz` sin favoritos: «Sin resultados / Prueba con otra búsqueda.».
  - Búsqueda `zzzz` con favoritos: «Sin resultados / No hay favoritos que coincidan con la búsqueda.».
  - Filtro de favoritos sin favoritos: «Aún no tienes favoritos / Marca una estrella para verlos aquí.».
  - Crear un cliente con búsqueda activa: aparece en la tabla y respeta el orden.
  - Editar el cliente: la fila se actualiza.
  - Eliminar los clientes de prueba: la lista vuelve a 12 y no quedan residuos.
- Sesión vendedor (`josemanuel.rodriguez@mail.udp.cl` / `demo1234`):
  - 12 filas, 12 botones «Editar» y 0 «Eliminar».
  - Búsqueda `camila`: 1 resultado.
  - Filtro de favoritos vacío: muestra el estado «Aún no tienes favoritos».
  - Orden Z-A: Vicente Flores primero.
- Consola del navegador sin errores en ambas sesiones.
