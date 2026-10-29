# Navegación compartida con Alpine (V4)

- **Fecha:** 2026-10-29
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Archivos afectados:** `js/nav.js` (nuevo), `js/main.js`, `css/app.css`, `dashboard.html`, `clientes.html`, `ventas.html`, `configuracion.html`, `ayuda.html` y este registro

## Objetivo

Extraer el menú lateral y la barra superior escritos a mano en las 5 páginas a un componente compartido `js/nav.js`, con Alpine para el comportamiento móvil, sesión desde `window.__sesion` y estado activo por ruta.

## Conversación (texto completo, sin editar)

### Prompt 1

```text
=== CONTEXTO Y REGLAS (comunes a todas las tareas) ===
Proyecto: MaldOps, app Vite multipágina con 7 HTML en la raíz. Soy el capitán; Josemanuel y Martin trabajan en paralelo sobre sus propios archivos, así que el alcance es estricto.

Propiedad de archivos (NO los edites salvo que "ARCHIVOS PERMITIDOS" de la tarea lo diga):
- Josemanuel: clientes.html, ventas.html, js/clientes.js, js/ventas.js, mocks/ventas.json, mocks/preguntas.json
- Martin: index.html, registro.html, configuracion.html, ayuda.html, 404.html, js/login.js, js/registro.js, js/configuracion.js, js/ayuda.js, mocks/clientes.json, mocks/usuarios.json
- Míos (los que tú tocas según la tarea): js/api.js, js/store.js, js/guard.js, js/ui.js, js/nav.js, js/main.js, css/app.css, vite.config.js, package.json, readme.md
Leer cualquier archivo está permitido; editar solo lo permitido.

Cómo trabajar:
1. Antes de empezar: `git checkout main && git pull origin main`, árbol limpio y revisa los PRERREQUISITOS de la tarea; si falta alguno, detente y dímelo. Luego crea la rama indicada.
2. Trabaja solo dentro de ARCHIVOS PERMITIDOS. Antes de commitear corre `git diff --name-only main` y `git status --short` (archivos nuevos). Si aparece algo fuera de la lista, revierte ese cambio y repórtalo; no lo "arregles" editándolo.
3. BUCLE DE VERIFICACIÓN: ejecuta todas las comprobaciones de la tarea. Si una falla, busca la causa raíz, corrige dentro del alcance y vuelve a correr TODAS desde el principio. Máximo 4 vueltas; si sigue fallando, detente y reporta qué falla, qué probaste y qué decisión necesitas de mí. Prohibido saltarse un check, usar --force o --legacy-peer-deps, o borrar lo que falla para que pase.
4. No inventes ni cambies nada fuera de lo pedido (diseño, contenido, comportamiento). Si falta un dato, usa lo que ya existe en el repo; si no existe, márcalo como "pendiente de confirmar" en tu respuesta.
5. Cierre: crea `ia/AAAA-MM-DD_victorbarrera1_<slug>.md` (fecha con `date +%F`) con: el prompt literal completo de esta tarea, tu respuesta final completa (la misma que me das en el chat), `## Qué se incorporó` y `## Verificación` (comandos corridos y resultado de cada uno). Haz UN commit con el código + ese .md, con el mensaje indicado, y `git push -u origin <rama>`. No hagas merge: yo reviso y mergeo.

TAREA V4 — Navegación compartida (js/nav.js)
Rama: feat/nav-compartida · Commit: "feat(nav): menú lateral y barra superior compartidos con Alpine" · slug: nav-compartida
PRERREQUISITOS: V2 y V3 en main (js/main.js con Alpine.start(), css/app.css con el sistema de diseño).
ARCHIVOS PERMITIDOS: js/nav.js, js/main.js, css/app.css (solo para agregar, si falta, un componente de navegación con comentario de una línea, p. ej. .nav-link / .nav-link-activo, y `[x-cloak]{display:none !important}`), dashboard.html, clientes.html, ventas.html, configuracion.html, ayuda.html (solo el bloque de menú/barra superior), ia/*.md. NO tocar index.html ni registro.html.

HACER
1. Antes de borrar nada, lee el menú y la barra superior escritos a mano en los 5 HTML: conserva textos, orden, íconos y destinos (dashboard, clientes, ventas, configuracion, ayuda) y defínelos en un arreglo dentro de nav.js.
2. js/nav.js exporta `montarNav()`: si no existe #nav-root, retorna sin error; si existe, inyecta barra superior + menú lateral usando solo clases del sistema de diseño y utilidades de Tailwind escritas completas (sin concatenar, para que Tailwind las detecte). Sin atributos style escritos a mano (el display que aplica x-show en runtime es aceptable). Semántica: <header> y <nav aria-label="Navegación principal">.
3. Vista actual: normaliza location.pathname (quita barra final; trata "/" y con/sin ".html") y compáralo con cada enlace; al activo ponle aria-current="page" y la clase de activo; solo uno.
4. Móvil (<768px) con Alpine: x-data con `abierto` y `escritorio` (matchMedia('(min-width: 768px)') con listener); el menú usa `x-show="abierto || escritorio"` más x-cloak (así md+ siempre lo muestra, porque el display inline de x-show anularía un `md:block`); botón hamburguesa con `md:hidden`, aria-label, aria-controls y :aria-expanded="abierto". Se cierra con Escape, al elegir un enlace y al pasar a escritorio, devolviendo el foco al botón.
5. Bloque de usuario: nombre y rol desde `window.__sesion` ({ nombre, rol }, placeholder); si no existe, valores neutros por defecto sin lanzar error. Inserta los textos con textContent o x-text, nunca interpolados en innerHTML (luego vendrán de la API). Enlace "Cerrar sesión" hacia index.html con data-accion="cerrar-sesion" para que guard.js lo enganche después.
6. js/main.js: importa montarNav y llámala ANTES de Alpine.start(), para que Alpine inicialice el menú inyectado.
7. En los 5 HTML reemplaza el menú y la barra hechos a mano por <div id="nav-root"></div> en el mismo lugar del DOM. Si el layout de dashboard.css depende de que el menú sea hijo directo de un contenedor, agrega la clase `contents` a #nav-root desde nav.js; si aun así el layout se rompe, repórtalo en vez de editar dashboard.css. No elimines CSS antiguo.

BUCLE DE VERIFICACIÓN
a. Cada uno de los 5 HTML tiene exactamente un #nav-root y ningún resto del menú antiguo; index.html y registro.html quedan sin cambios.
b. nav.js no contiene `style=` ni innerHTML con datos de sesión; toda clase que usa existe en app.css o es una utilidad presente en el CSS emitido.
c. `npm run build` pasa y `npm run dev` responde 200 en las 5 páginas.
d. Si hay Playwright/Chromium disponible, en cada página a 1280px y a 375px comprueba: #nav-root no vacío; exactamente un aria-current="page" y es el de esa página; hamburguesa visible solo a 375px; aria-expanded alterna false→true→false; Escape cierra; a 1280px el menú siempre se ve. Si no hay navegador headless, prueba con jsdom las funciones puras (normalización de ruta y elección del activo) y deja los pasos manuales en "Verificación".
e. `git diff --name-only main` ⊆ lista permitida.
Cierra tu respuesta recordándome que V1–V4 deben estar mergeados en main antes de avisar a Josemanuel y Martin (git pull origin main).
```

### Respuesta 1

```text
Listo. V4 implementada y verificada en `feat/nav-compartida`.

**Qué quedó**
- `js/nav.js` exporta `montarNav()`; si no hay `#nav-root` retorna sin error. Inyecta `<header>` y `<nav aria-label="Navegación principal">` en las 5 páginas.
- Menú con los mismos enlaces, textos, orden, íconos y destinos: Dashboard, Clientes, Ventas, Ayuda, Configuracion. La página actual lleva `aria-current="page"` y `.nav-enlace-activo`, y solo hay uno.
- Móvil: `abierto`/`escritorio` con `matchMedia('(min-width: 768px)')`; `x-show="abierto || escritorio"` + `x-cloak`; hamburguesa `md:hidden` con `aria-label`, `aria-controls` y `:aria-expanded`. Cierra con Escape, al elegir un enlace y al pasar a escritorio, devolviendo el foco al botón.
- Usuario desde `window.__sesion` (`nombre`, `rol`), con "Usuario"/"Sin rol" por defecto; todo con `textContent`. Probado con HTML malicioso: se muestra como texto, sin XSS. "Cerrar sesión" apunta a `index.html` con `data-accion="cerrar-sesion"`.
- `js/main.js` llama `montarNav()` antes de `Alpine.start()`.
- Navegación agregada en `css/app.css` (unlayered, porque el reset `*` de `dashboard.css` anulaba paddings/márgenes) y `[x-cloak]`. `#nav-root` recibe `contents` para que la barra quede como hijo directo del `.container` y el menú sea `position: fixed`.

**Verificación**
- a) 5/5 HTML con exactamente un `#nav-root` y sin restos del menú/topbar viejos; `index.html` y `registro.html` sin cambios.
- b) `nav.js` sin `style=` ni `innerHTML`; 13/13 clases de navegación y `.contents`, `.hidden`, `.md:hidden`, `.md:flex`, `.btn`, `.input` presentes en el CSS emitido.
- c) `npm run build`: ✓, 7 páginas, sin warnings. `dev` y `preview`: 200 en las 5 páginas.
- d) Playwright (Chromium headless): 10/10 (5 páginas × 1280/375) con activo único correcto, hamburguesa solo a 375, `aria-expanded` false→true→false, Escape, cierre por enlace, cambio a escritorio y retorno de foco. Funciones puras de ruta/activo: OK. Contraste claro/oscuro: enlaces ≥11.53:1, activo 5.01:1, salir 5.91:1/7.71:1, foco ≥3.12:1.
- e) `git diff --name-only main` ⊆ permitidos: 5 HTML, `css/app.css`, `js/main.js`, `js/nav.js` y el registro IA.

**Observación fuera de alcance**
- `js/index.js:19` sigue lanzando `TypeError: Cannot set properties of null (setting 'onclick')` en cada carga porque busca `.toggle`, que ya no existe. No está en ARCHIVOS PERMITIDOS y quitar sus `<script>` de los HTML tampoco entra en "solo el bloque de menú/barra", así que no lo toqué. La navegación funciona; dime si autorizas eliminarlo en una tarea aparte.

Commit `feat(nav): menú lateral y barra superior compartidos con Alpine` pusheado en `feat/nav-compartida`. PR abierto sin merge.

Recordatorio: V1–V4 deben estar mergeados en `main` antes de avisar a Josemanuel y Martin; después, `git pull origin main`.
```

## Qué se incorporó

- `js/nav.js` con el arreglo `ENLACES` (Dashboard, Clientes, Ventas, Ayuda, Configuracion), conservando textos, orden, íconos y destinos del menú original.
- `montarNav()`: retorna sin error si no hay `#nav-root`; marca el contenedor con `contents`, `x-data="navMaldOps()"` y `@keydown.escape.window`; inyecta un `<header>` y un `<nav aria-label="Navegación principal">`.
- Normalización de ruta (`normalizarRuta`) y elección del activo (`elegirActivo`): quita query/hash, barras finales y `.html`; `/` e `/index.html` se tratan igual. El activo recibe `aria-current="page"` y `.nav-enlace-activo`.
- Comportamiento móvil con Alpine: `abierto` y `escritorio` sincronizados con `matchMedia('(min-width: 768px)')`; `x-show="abierto || escritorio"` + `x-cloak`; hamburguesa `md:hidden` con `aria-label` dinámico, `aria-controls="nav-principal"` y `:aria-expanded`.
- Cierre con Escape, al pulsar cualquier enlace del menú y al pasar a escritorio; el foco vuelve al botón cuando corresponde.
- Bloque de usuario con `window.__sesion` (`nombre`, `rol`) y defaults "Usuario"/"Sin rol"; los textos se insertan con `textContent`, nunca con `innerHTML`.
- Enlace "Cerrar sesión" a `index.html` con `data-accion="cerrar-sesion"`.
- `js/main.js` importa y ejecuta `montarNav()` antes de `Alpine.start()`.
- CSS de navegación en `css/app.css` (`.nav-barra`, `.nav-hamburguesa`, `.nav-busqueda`, `.nav-usuario*`, `.nav-lateral`, `.nav-logo`, `.nav-enlace*`, `.nav-enlace-salir`), `[x-cloak]` y ajuste responsive 768–992 px. Se dejó fuera de `@layer components` porque el reset `*` de `dashboard.css` es unlayered y anulaba paddings/márgenes.
- Los 5 HTML conservan un solo `#nav-root` en el lugar del bloque de menú/barra; se eliminó el marcado viejo, sin borrar CSS antiguo. `index.html` y `registro.html` quedaron intactos.

## Verificación

| Check | Comando | Resultado |
|---|---|---|
| Prerrequisitos | `git fetch origin`, `git log --oneline origin/main` | V2 (`51f240a`) y V3 (`34e29c4`, merge `a928a63`) en `main`; rama `feat/nav-compartida` creada desde `a928a63`. |
| a. HTML | `node` con conteo de `id="nav-root"` y búsqueda de `.nav`, `.topbar`, `.toggle`, `.buscar`, `.perfil-usuario`, `.titulo`, `.icono` | 5/5 páginas con exactamente 1 `#nav-root` y 0 restos; `index.html`/`registro.html` sin `#nav-root` ni cambios. |
| b. JS seguro | `grep -nE 'style=\|innerHTML' js/nav.js` | Sin coincidencias. |
| b. Clases | `grep` sobre `dist/assets/main-*.css` | 13/13 clases de navegación; `.contents`, `.hidden`, `.md\:hidden`, `.md\:flex`, `.btn`, `.input`, `[x-cloak]` y `.dark .nav-enlace-salir` presentes. |
| c. Build | `npm run build` | ✓ 17 módulos, 7 páginas, sin warnings ni errores. |
| c. Dev | `curl` a `http://localhost:5174/<página>` | 200 en dashboard, clientes, ventas, configuracion y ayuda. |
| c. Preview | `curl` a `http://localhost:4173/<página>` | 200 en las 5 páginas. |
| d. Playwright | `node test-nav.js` (Chromium headless) | exit 0; 10/10 combinaciones (5 páginas × 1280/375); activo único correcto 10/10; menú visible 5/5 a 1280 y oculto 5/5 a 375; hamburguesa visible 5/5 a 375 y oculta 5/5 a 1280; `aria-expanded` false→true→false; Escape, cierre por enlace, cambio a escritorio y foco OK. |
| d. Funciones puras | `node --input-type=module` con `normalizarRuta`/`elegirActivo` | 10/10 rutas normalizadas; activo correcto para las 5 páginas; `/index.html` sin activo. |
| d. Sesión | Playwright con `window.__sesion` malicioso | El HTML se muestra como texto; 0 imágenes inyectadas; `window.__xss` falso. |
| d. Contraste | `node` con pares de tokens de navegación | Claro: enlace 11.53:1, activo 5.01:1, salir 5.91:1, foco 3.12:1. Oscuro: enlace 13.98:1, activo 5.01:1, salir 7.71:1, foco 8.77:1. |
| e. Alcance | `git diff --cached --name-only main` y `git status --short` | Solo los 5 HTML, `css/app.css`, `js/main.js`, `js/nav.js` y este registro. |

### Nota de consola

`js/index.js:19` lanza `TypeError: Cannot set properties of null (setting 'onclick')` una vez por carga porque el script antiguo busca `.toggle`, que ya no existe. `js/index.js` no está en ARCHIVOS PERMITIDOS y quitar sus `<script>` de los HTML excede "solo el bloque de menú/barra", así que no se modificó. Queda reportado para decisión del capitán; la navegación funciona con normalidad.
