# Base Tailwind CSS v4 + Alpine.js en Vite 8

- **Fecha:** 2026-10-27
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Archivos afectados:** `package.json`, `package-lock.json`, `vite.config.js`, `css/app.css`, `js/main.js`, `js/store.js`, `index.html`, `registro.html`, `dashboard.html`, `clientes.html`, `ventas.html`, `configuracion.html`, `ayuda.html`

## Objetivo

Incorporar la base de Tailwind CSS v4 y Alpine.js sobre Vite 8, sin migrar los estilos existentes y con entrada multipágina generada automáticamente desde los HTML de la raíz.

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
5. Cierre: crea `ia/AAAA-MM-DD_victorbarrera1_<slug>.md` (fecha con `date +%F`) con: el prompt literal completo de esta tarea, tu respuesta final completa (la misma que me das en el chat), `## Qué se incorporó` y `## Verificación` (comandos corridos y resultado de cada uno). Haz UN commit con el código + ese .md, con el mensaje indicado (termina en `[IA]`), y `git push -u origin <rama>`. No hagas merge: yo reviso y mergeo.
TAREA V2 — Base Tailwind CSS v4 + Alpine.js en Vite 8
Rama: feat/base-tailwind-alpine · Commit: "feat(build): base Tailwind v4 + Alpine y entrada multipágina automática [IA]" · slug: base-tailwind-alpine
PRERREQUISITOS: V1 ya en main (existen css/, js/, img/ y los HTML apuntan a ellos); package.json con vite 8 y scripts dev/build/preview.
ARCHIVOS PERMITIDOS: package.json, package-lock.json, vite.config.js, css/app.css, js/main.js, js/store.js, los 7 HTML (solo agregar UNA línea `<script type="module" src="/js/main.js"></script>` antes de </body>), ia/*.md.

HACER
1. `npm install tailwindcss @tailwindcss/vite alpinejs`. Si hay conflicto de peer dependencies con Vite 8, no fuerces: busca la versión compatible de @tailwindcss/vite y repórtalo.
2. css/app.css: `@import "tailwindcss"` completo incluye preflight (reset) y alteraría las páginas que aún usan su CSS propio. Importa las capas equivalentes SIN preflight:
   @layer theme, base, components, utilities;
   @import "tailwindcss/theme.css" layer(theme);
   @import "tailwindcss/utilities.css" layer(utilities);
   Deja un comentario arriba: "al migrar estilos, reemplazar por @import "tailwindcss" para activar preflight". Después agrega un bloque @theme con las variables de tema del proyecto, tomadas de los colores/tipografías que ya existen en css/login.css y css/dashboard.css (no inventes valores); si no hay, deja @theme con un comentario. V3 lo completa.
3. vite.config.js: plugin tailwindcss() y `input` multipágina generado con fs.readdirSync sobre la raíz: solo *.html, clave = nombre sin extensión, ruta absoluta con path.resolve, orden alfabético, error claro si no hay ninguno. Usa la opción de build que corresponda a la versión instalada (en Vite 8 puede ser `rolldownOptions`, con `rollupOptions` como alias deprecado): confírmalo en node_modules/vite o en su documentación y deja un comentario con lo elegido.
4. js/store.js: exporta `registrarStores(Alpine)` con un único store esqueleto `sesion` ({ usuario: null }). js/main.js: importa Alpine, `../css/app.css` y registrarStores; `window.Alpine = Alpine`; registrarStores(Alpine); Alpine.start() (comentario: Alpine.start() solo se llama aquí).
5. Agrega la línea del script a los 7 HTML (único cambio en ellos).
No migres estilos existentes a Tailwind.

BUCLE DE VERIFICACIÓN
a. `npm ls vite tailwindcss @tailwindcss/vite alpinejs` sin ERESOLVE ni "invalid".
b. `npm run dev` (en segundo plano, con timeout): las 7 páginas y /js/main.js responden 200 sin errores en el log; ciérralo.
c. `npm run build` pasa sin warnings de recursos sin resolver; dist/ contiene exactamente las 7 páginas (compara con `ls *.html`).
d. Auto-descubrimiento: crea temporalmente `_prueba.html` en la raíz, corre el build, confirma que aparece en dist/, bórralo y confirma con git status que no queda rastro.
e. El CSS emitido contiene las variables del tema y NO el reset universal de preflight (`*, ::after, ::before { margin: 0; padding: 0 ... }`).
f. `git diff main -- '*.html'` muestra exactamente 1 línea agregada por HTML.
```

### Respuesta 1

```text
Listo. V2 implementada y verificada en `feat/base-tailwind-alpine`.

**Qué quedó**
- `tailwindcss@4.3.3`, `@tailwindcss/vite@4.3.3` y `alpinejs@3.17.5`, sin conflictos de peer dependencies con Vite 8.3.0.
- `css/app.css`: capas `theme`/`utilities` sin preflight y `@theme static` con los colores y la fuente que ya estaban en `css/login.css` y `css/dashboard.css`.
- `vite.config.js`: descubre los `*.html` de la raíz, los ordena y genera el `input` con `rolldownOptions` (opción vigente en Vite 8; `rollupOptions` figura como deprecado en los tipos de Vite).
- `js/store.js` registra el store `sesion`; `js/main.js` importa Alpine y el CSS, expone `window.Alpine`, registra los stores y llama `Alpine.start()` una sola vez.
- Los 7 HTML solo agregan la línea de `/js/main.js` antes de `</body>`. No migré estilos existentes.

**Verificación**
- a) `npm ls vite tailwindcss @tailwindcss/vite alpinejs`: exit 0, sin `invalid` ni `ERESOLVE`.
- b) Dev: las 7 páginas y `/js/main.js` responden 200, sin errores en el log; servidor cerrado.
- c) Build: 7/7 páginas en `dist/`, sin warnings.
- d) `_prueba.html` apareció en `dist/` con el build automático y se eliminó; `git status` no muestra rastro.
- e) CSS emitido: todas las variables de tema presentes y sin reset de preflight.
- f) Los 7 HTML: exactamente +1/−0 líneas.

Commit `feat(build): base Tailwind v4 + Alpine y entrada multipágina automática [IA]` pusheado en `feat/base-tailwind-alpine`. Sin merge.
```

## Qué se incorporó

- Las dependencias `tailwindcss`, `@tailwindcss/vite` y `alpinejs` con sus versiones registradas en `package.json` y `package-lock.json`.
- `css/app.css` con las capas `theme`, `base`, `components` y `utilities`; importa `tailwindcss/theme.css` y `tailwindcss/utilities.css` sin preflight, y define en `@theme static` los colores y la tipografía tomados de `css/login.css` y `css/dashboard.css`.
- `vite.config.js` con el plugin `tailwindcss()` y el `input` multipágina generado por `readdirSync`, ordenado alfabéticamente, con `path.resolve` y error explícito si no hay HTML. Usa `rolldownOptions`, la opción vigente de Vite 8.
- `js/store.js` con `registrarStores(Alpine)` y el store `sesion` (`{ usuario: null }`).
- `js/main.js` con la importación de Alpine, `css/app.css` y `registrarStores`, la exposición de `window.Alpine`, el registro de stores y una única llamada a `Alpine.start()`.
- Una línea `<script type="module" src="/js/main.js"></script>` antes de `</body>` en los 7 HTML.
- Sin migración de estilos existentes a Tailwind.

## Verificación

| Check | Comando | Resultado |
|---|---|---|
| a. Dependencias | `npm ls vite tailwindcss @tailwindcss/vite alpinejs` | exit 0; `vite@8.3.0`, `tailwindcss@4.3.3`, `@tailwindcss/vite@4.3.3`, `alpinejs@3.17.5`; sin `invalid` ni `ERESOLVE`. |
| b. Dev | `npm run dev -- --port 5173 --strictPort` + `curl` a las 7 páginas y `/js/main.js` | VITE v8.3.0; 9/9 rutas en 200; sin errores en el log; servidor cerrado. |
| c. Build | `npm run build`; comparación `ls *.html` con `ls dist/*.html` | ✓ built; 7/7 páginas idénticas; sin warnings de recursos sin resolver. |
| d. Auto-descubrimiento | Crear `_prueba.html`, `npm run build`, borrarlo, `git status --short` y rebuild final | `dist/_prueba.html` generado; eliminado sin rastro en git; rebuild final con 7 páginas y sin `_prueba.html`. |
| e. CSS emitido | `grep` de variables y del reset universal en `dist/assets/main-*.css` | Las 8 variables de tema presentes; reset `*, ::after, ::before` ausente. |
| f. HTML | `git diff main --numstat -- '*.html'` | `+1 −0` en cada uno de los 7 HTML. |
| Alcance | `git diff --name-only main` y `git status --short` | Solo los archivos permitidos: 7 HTML, `package.json`, `package-lock.json`, `vite.config.js`, `css/app.css`, `js/main.js`, `js/store.js` y este registro. |
