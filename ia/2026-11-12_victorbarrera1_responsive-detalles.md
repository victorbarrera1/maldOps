# Responsive: una columna en `.detalles` bajo 992 px

- **Fecha:** 2026-11-12
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Herramienta y modelo:** OpenCode — DeepSeek V4.1 Flash Free
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** `src/css/dashboard.css`, `clientes.html`, `ia/PLAN.md`, `ia/README.md`

## Objetivo

Evitar el scroll horizontal de página en 375, 412, 768 y 1280 px, dejar
`.detalles` en una sola columna por debajo de 992 px y quitar la columna vacía
de Clientes en escritorio.

## Conversación (texto completo, sin editar)

### Prompt 4

```text
Trabaja en el repositorio MaldOps. Rama de trabajo: `fix/revision-final`; si no existe, créala desde `origin/main`. Antes de editar, lee `src/css/dashboard.css`, `src/css/app.css` y las vistas. Muestra un plan breve. No reescribas historial de git.

OBJETIVO
- Una sola columna en `.detalles` por debajo de 992 px.
- Sin columna vacía en Clientes.
- Sin scroll horizontal de página en 375, 412, 768 y 1280 px.

ESTADO ACTUAL
- `src/css/dashboard.css` define `.detalles { display: grid; grid-template-columns: 2fr 1fr; }`.
- En `@media (max-width: 992px)` solo se ajusta el nav; `.detalles` no cambia.
- En `@media (max-width: 768px)` se fuerza `.detalles { grid-template-columns: 1fr 1fr; }`.
- En `@media (max-width: 400px)` recién pasa a `1fr`.
- `clientes.html` tiene un solo panel dentro de `.detalles` (más los `<dialog>`), así que en escritorio queda la segunda columna vacía.
- `.ordenes-recientes` y `.nuevos-clientes` solo tienen `overflow-x: auto` desde 768 px.

TAREAS
1. En `dashboard.css`, agrega dentro de `@media (max-width: 992px)`:
   `.detalles { grid-template-columns: 1fr; }`
2. Elimina la regla `.detalles { grid-template-columns: 1fr 1fr; }` del bloque de 768 px (o déjala explícitamente en 1fr si prefieres no borrarla).
3. Para que Clientes no deje una columna vacía en escritorio, usa una de estas opciones (elige la más simple y documenta):
   - `.detalles > .ordenes-recientes:only-of-type { grid-column: 1 / -1; }`, o
   - una clase `detalles--unico` en `clientes.html` y `.detalles--unico { grid-template-columns: 1fr; }`.
   Ten en cuenta que los `<dialog>` también son hijos de `.detalles`; `:only-of-type` funciona porque solo hay un `div.ordenes-recientes`.
4. Agrega `min-width: 0` a los hijos del grid para evitar desbordes:
   `.detalles > * { min-width: 0; }`.
5. Asegura el scroll interno de tablas en pantallas angostas:
   `.ordenes-recientes, .nuevos-clientes { overflow-x: auto; }` dentro del bloque de 992 px.
6. Permite que `.header` haga wrap y no empuje el ancho:
   `.header { flex-wrap: wrap; gap: 10px; }` en el bloque de 992 px.
7. Revisa `.cards`: a 412 px sigue en 2 columnas (el breakpoint de 1 columna está en 400 px). Si se desborda o queda apretado, mueve ese breakpoint a 480 px. No lo cambies si no hace falta.

PRUEBAS (con `npm run build && npm run preview` y DevTools)
- 375, 412, 768 y 1280 px.
- En cada ancho: `document.documentElement.scrollWidth <= window.innerWidth`.
- Por debajo de 992 px, `getComputedStyle(document.querySelector('.detalles')).gridTemplateColumns` debe devolver una sola pista.
- En Clientes a 1280 px, el panel debe ocupar todo el ancho y no debe quedar una columna vacía a la derecha.
- Las tablas deben hacer scroll dentro del panel, no en la página.
- Verifica el nav: a 768–992 px el menú lateral está visible y el contenido tiene su espacio; a 412 px el menú está oculto y se abre con el botón.
- Revisa Dashboard, Clientes, Ventas, Ayuda y Configuración.

CIERRE
- Registra en `ia/PLAN.md` y crea `ia/2026-11-12_<tu-usuario>_responsive-detalles.md`.
- Commit: `fix(layout): una columna bajo 992px [IA]`.
```

### Respuesta 4

Apliqué una sola columna en `.detalles` desde 992 px y quité la regla de dos
columnas del bloque de 768 px. Para Clientes elegí la opción de la clase
`detalles--unico` en el HTML, porque es explícita y reutiliza la regla que ya
usaba el detalle de cliente; así el panel ocupa todo el ancho en escritorio.

Agregué `min-width: 0` a los hijos del grid y a las tarjetas. Las mediciones
mostraron que `.cards` desbordaba a 412 px (scrollWidth 525) y a 768 px (825)
porque las columnas `1fr` crecían con el contenido; las pasé a
`minmax(0, 1fr)` y moví el breakpoint de una columna de 400 a 480 px. También
el panel de contacto de Ayuda a 1280 px tenía una tabla de 324 px dentro de una
columna de 303 px; dejé `overflow-x: auto` en los paneles para todos los
anchos, no solo en móvil.

## Cambios aplicados

```diff
diff --git a/clientes.html b/clientes.html
@@
-        <div class="detalles">
+        <div class="detalles detalles--unico">

diff --git a/src/css/dashboard.css b/src/css/dashboard.css
@@
-    grid-template-columns: repeat(4, 1fr);
+    grid-template-columns: repeat(4, minmax(0, 1fr));
     grid-gap: 30px;
 }
 
+.cards > * {
+    min-width: 0;
+}
+
@@
-/* El detalle de cliente usa un solo panel: evita la columna vacía. */
-main.detalles--unico {
+/* Las vistas con un solo panel usan una columna: evita la columna vacía. */
+.detalles--unico {
     grid-template-columns: 1fr;
 }
 
+/* Permite que las tablas anchas encojan dentro del grid y no desborden la página. */
+.detalles > * {
+    min-width: 0;
+}
+
@@
     box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
     border-radius: 20px;
+    overflow-x: auto;
 }
@@
 @media only screen and (max-width: 1200px) {
     .cards {
-        grid-template-columns: repeat(2, 1fr);
+        grid-template-columns: repeat(2, minmax(0, 1fr));
     }
 }
@@
     .container.active {
         left: 300px;
     }
-}
 
-/* -- Tablets -- */
-@media only screen and (max-width: 768px) {
     .detalles {
-        grid-template-columns: 1fr 1fr;
+        grid-template-columns: 1fr;
     }
 
-    .ordenes-recientes,
-    .nuevos-clientes {
-        overflow-x: auto;
+    .header {
+        flex-wrap: wrap;
+        gap: 10px;
     }
+}
 
+/* -- Tablets -- */
+@media only screen and (max-width: 768px) {
     .estatus.en-progreso {
         white-space: nowrap;
     }
 }
 
 /* -- Celulares -- */
+@media only screen and (max-width: 480px) {
+    .cards {
+        grid-template-columns: 1fr;
+    }
+}
+
 @media only screen and (max-width: 400px) {
@@
-    .cards {
-        grid-template-columns: repeat(1, 1fr);
-    }
-
     .perfil-usuario {
```

## Qué se incorporó

- `.detalles` en una sola columna desde 992 px; se eliminó el `1fr 1fr` de
  768 px.
- `clientes.html` con `detalles--unico`, por lo que su panel ocupa todo el
  ancho en escritorio.
- `min-width: 0` en hijos de `.detalles` y de `.cards`.
- `.header` con `flex-wrap: wrap` y `gap: 10px` desde 992 px.
- Scroll horizontal interno en `.ordenes-recientes` y `.nuevos-clientes` en
  todos los anchos.
- `.cards` con pistas `minmax(0, 1fr)` y una columna desde 480 px.

## Verificación

- `npm run build` pasa.
- Medición automatizada de viewport con iframes del mismo origen a ancho
  exacto (las media queries se evalúan contra el viewport del iframe), en
  Dashboard, Clientes, Ventas, Ayuda y Configuración.

| Ancho | `scrollWidth` | `.detalles` | `.cards` | Nav |
|---|---|---|---|---|
| 375 | 375 = `innerWidth` | 1 pista (`335px`) | 1 columna | oculto; se abre con el botón y ocupa 375 px |
| 412 | 412 = `innerWidth` | 1 pista (`372px`) | 1 columna | oculto; se abre con el botón y ocupa 300 px |
| 768 | 768 = `innerWidth` | 1 pista (`428px`) | 2 columnas (`199px 199px`) | visible (300 px); contenido desde x=300 |
| 1280 | 1280 = `innerWidth` | 2 pistas (`606.664px 303.336px`) | 4 columnas (`212.5px` cada una) | visible (300 px) |

- Límites: 480 px deja Cards en 1 columna; 481 px vuelve a 2. 992 px deja
  `.detalles` en 1 pista; 993 px vuelve a 2.
- Clientes a 1280 px: una sola pista de `940px`; el panel mide `940px`, sin
  columna vacía a la derecha.
- Tablas: a 375/412/768 px los paneles tienen `overflow-x: auto` y
  `scrollWidth` mayor que su ancho, pero el `scrollWidth` de la página sigue
  siendo igual a `innerWidth`; el scroll queda dentro del panel.
- Ayuda a 1280 px: el panel de contacto mide 303 px y su tabla 324 px; el
  `scrollWidth` de la página se mantiene en 1280.
- Header a 375/412/768: `flex-wrap: wrap`, sin desborde interno.
- Consola del navegador sin errores en la página de prueba.
