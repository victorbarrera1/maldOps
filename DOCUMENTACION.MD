Registros de uso de IA dentro del proyecto, primeramente prompts utilizados y desplegados dentro de un entorno local de DeepSeek v4.1 flash.
Pese a el uso dentro de la terminal y no tener una forma de recuperar el registro completo, le adjunto cada prompt utilizado dentro de la entrega 2.
No obstante, dentro de cada prompt utilizado con un checklist y tareas por realizar segun exigencia de la rubrica, todo uso de ia queda documentado con la etiqueta /IA.
Escrito y documentado por Victor Barrera post evaluacion de proyecto entrega 2 13 de Noviembre 2026 14:30 hrs.

Cabe recalcar que con el tiempo dado para la segunda entrega, utilice los plazos y tiempo determinado para hacer el trabajo, nada de este trabajo fue hecho a medias o a ultimo momento, queda en evidencia commits desde el 27 de octubre el desarrollo de la entrega 2.
Tambien sumado a un previo avance a lo que se espera de la entrega 3 sobre un backend real, con un esquema de un http.js con un fetch real y una maqueta de el backend real para la build del proyecto.

Como tengo los prompts si es que no puedo tener acceso al historial de la terminal?
Me vi en la situacion de poder tener alguna forma de respaldar mis consultas frente a cualquier modelo utilizado, de mi persona todo fue hecho de manera local.

R:
## p1:
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
TAREA V1 — Reorganizar proyecto Vite multipágina (solo rutas y ubicación)
Rama: chore/reorganizar-estructura · Commit: "chore(estructura): ordenar css/js/img y renombrar logo [IA]" · slug: reorganizar-estructura
PRERREQUISITOS: ninguno.
ARCHIVOS PERMITIDOS: los 7 HTML (solo atributos href/src), login.css, dashboard.css, index.js, "logo maldops.png", profile.png (mover/renombrar), ia/*.md.

Estado inicial en la raíz: index.html, registro.html, dashboard.html, clientes.html, ventas.html, configuracion.html, ayuda.html, login.css, dashboard.css, index.js, "logo maldops.png", profile.png.

HACER
0. Línea base: `npm run build` (si hay package.json) y guarda el resultado. Inventario de referencias: grep -rnE "logo maldops|logo%20maldops|profile\.png|login\.css|dashboard\.css|index\.js" --include=*.html --include=*.css --include=*.js . (excluye node_modules y dist).
1. Crea css/, js/, img/ y mueve con `git mv` (conserva historial): *.css → css/, *.js → js/, imágenes → img/. Renombra "logo maldops.png" → img/logo-maldops.png.
2. Actualiza todas las referencias en los 7 HTML (link, script, img, favicon, og:image, etc.), manteniendo el estilo de ruta que el proyecto ya usa. Cubre también la forma URL-encoded "logo%20maldops.png".
3. Los archivos movidos pueden tener rutas que dependen de su ubicación (url(...) en CSS, imports o strings con rutas en JS): ajústalas solo si dejan de resolver. Es el único cambio permitido fuera de los HTML.
No cambies diseño, contenido ni comportamiento.

BUCLE DE VERIFICACIÓN
a. El grep del paso 0 da 0 resultados con rutas/nombres antiguos.
b. Con un script, cada href/src local de cada HTML apunta a un archivo que existe.
c. `npm run build` pasa y dist/ contiene las 7 páginas; con `npm run dev` cada página y cada asset referenciado responde 200 (curl).
d. `git status` muestra renames (R), no delete+add; `git diff --name-only main` ⊆ lista permitida.

RESPUESTA EN EL CHAT
1) archivos movidos (origen → destino); 2) por cada HTML, las líneas cambiadas (`git diff -U0 -- <html>`); 3) cualquier referencia fuera de los HTML que hayas tenido que ajustar y por qué.


## p2:
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

## p3:
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
TAREA V3 — Sistema de diseño MaldOps en css/app.css (Tailwind v4)
Rama: feat/sistema-diseno · Commit: "feat(ui): sistema de diseño MaldOps en css/app.css [IA]" · slug: sistema-diseno
PRERREQUISITOS: V2 en main (css/app.css con imports de Tailwind y @theme, vite.config.js, js/main.js).
ARCHIVOS PERMITIDOS: css/app.css, ia/*.md. No toques ningún HTML ni otro archivo.

HACER (todo en css/app.css, con secciones comentadas: Tema · Dark · Componentes)
1. @theme, nombres en español: --color-primario-50…900 (azul), --color-acento, --color-exito, --color-alerta, --color-peligro (lo necesita .btn-danger), --color-superficie, --color-superficie-2, --color-borde, --color-texto, --color-texto-suave; tipografía (--font-sans con fallback de sistema y escala --text-xs…2xl), radios (--radius-sm/md/lg) y sombras (--shadow-sm/md/lg). Reutiliza los tokens que V2 trajo de los CSS existentes en vez de duplicarlos.
2. Dark: `@custom-variant dark (&:where(.dark, .dark *));` para que `dark:` funcione con la clase .dark en <html>, y bajo `.dark` redefine los tokens de superficie, borde, texto y los de estado que lo necesiten, para que los componentes cambien solos sin repetir `dark:` en cada regla.
3. @layer components con UN comentario de una línea sobre cada clase: .btn, .btn-primary, .btn-secondary, .btn-danger, .card, .input, .label, .badge, .badge-exito, .badge-alerta, .tabla, .skeleton.
4. Estados en todos los interactivos (.btn*, .input): hover, focus-visible con anillo visible (≥2px y con offset, contraste suficiente en claro y oscuro) y disabled (también [aria-disabled="true"]: cursor not-allowed y opacidad reducida). .tabla: fila con hover y encabezado diferenciado. .skeleton: animación pulse desactivada con motion-reduce.
5. No asumas preflight (V2 lo omite): declara en cada componente lo que necesite (box-sizing, border-style, font: inherit en .btn/.input).

BUCLE DE VERIFICACIÓN
a. `npm run build` pasa (un @apply de utilidad inexistente rompe el build, esa es la prueba).
b. El CSS emitido (dist/assets/*.css) contiene los 12 selectores, los tokens y la variante dark.
c. Contraste WCAG AA con un script de node sin dependencias guardado en /tmp (no en el repo): texto sobre superficie y superficie-2, texto de cada .btn-* sobre su fondo, texto de cada badge sobre su fondo, en claro y oscuro: ≥4.5:1; anillo de foco y borde de .input contra su fondo: ≥3:1. Si algo falla, ajusta el token y repite desde (a). Pega la tabla de resultados en "Verificación".
d. Cada clase tiene exactamente un comentario de una línea (grep) y `git diff --name-only main` solo muestra css/app.css y el .md.

## p4:
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

TAREA V4 — Navegación compartida (js/nav.js)
Rama: feat/nav-compartida · Commit: "feat(nav): menú lateral y barra superior compartidos con Alpine [IA]" · slug: nav-compartida
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

## p5:
TAREA V5 — README: sección "Datos simulados (API)"
Rama: docs/datos-simulados-api · Commit: "docs(readme): sección Datos simulados (API) [IA]" · slug: datos-simulados-api
PRERREQUISITOS: ninguno (independiente de V1–V4).
ARCHIVOS PERMITIDOS: readme.md (agregar la sección sin modificar el resto), ia/*.md. No crees ni edites js/api.js ni los mocks: esto es el contrato que el equipo seguirá.

FUENTES (solo lectura) para deducir los campos: columnas y formularios de clientes.html y ventas.html, formularios de index.html y registro.html, preguntas de ayuda.html y, si existen, mocks/*.json. Si un mock existente contradice una decisión tuya, gana el mock y lo reportas. Si js/api.js ya existe, los nombres del README deben coincidir exactamente con sus exports; si difieren, repórtalo sin editarlo.

CONTENIDO — sección "## Datos simulados (API)" con:
1. Modelo de datos por recurso (usuarios, clientes, ventas, preguntas): tabla Campo | Tipo | Obligatorio | Descripción, más un registro de ejemplo en JSON válido. Las contraseñas de demostración nunca aparecen en la respuesta de iniciarSesion. ventas referencia a clientes por clienteId.
2. Tabla de endpoints simulados (Función | Método | Ruta equivalente | Descripción | Códigos), con exactamente estos nombres y este mapeo (no agregues ni renombres funciones):
   - iniciarSesion — POST /api/auth/login — 200, 400, 401, 500
   - listarClientes — GET /api/clientes — 200, 401, 500
   - obtenerCliente — GET /api/clientes/:id — 200, 401, 404, 500
   - crearCliente — POST /api/clientes — 201, 400, 401, 500
   - actualizarCliente — PUT /api/clientes/:id — 200, 400, 401, 404, 500
   - eliminarCliente — DELETE /api/clientes/:id — 200, 401, 404, 500
   - listarVentas — GET /api/ventas — 200, 401, 500
   - obtenerVentasDeCliente — GET /api/clientes/:id/ventas — 200, 401, 404, 500
   - listarPreguntas — GET /api/preguntas — 200, 401, 500
   - simularFallo — utilidad de pruebas (no es endpoint): fuerza que la siguiente llamada devuelva un error (por defecto 500); documenta sus parámetros solo si api.js ya los define.
   Debajo, una línea por código con su significado aquí: 400 datos inválidos o faltantes, 401 sin sesión o credenciales inválidas, 404 id inexistente, 500 fallo simulado.
3. Formato de respuesta uniforme { ok, status, data, error }: tipos y regla (ok=true ⇒ data con valor y error=null; ok=false ⇒ data=null y error con mensaje en español); indica que todas las funciones son async con latencia simulada; 3 ejemplos (200 lista, 201 creación, 404).
4. Convención de ids: clientes cli-001…cli-012 y usuarios u-001…u-004 (3 dígitos con ceros). Para ventas y preguntas no hay convención definida: propón ven-001… y preg-001… marcadas "Propuesto — por confirmar con Josemanuel". Incluye la regla de integridad: todo ventas.clienteId existe entre cli-001…cli-012.

BUCLE DE VERIFICACIÓN (script en /tmp, no en el repo)
a. En readme.md aparecen los 10 nombres de función tal cual; no hay otros nombres tipo función inventados (p. ej. listarUsuarios); la tabla tiene 10 filas de 5 columnas; solo aparecen los códigos 200, 201, 400, 401, 404 y 500.
b. Todos los bloques JSON de ejemplo pasan JSON.parse; los ids cumplen /^cli-0(0[1-9]|1[0-2])$/ y /^u-00[1-4]$/.
c. Los ejemplos son coherentes entre sí (el clienteId del ejemplo de venta es el id del ejemplo de cliente) y con los campos de los mocks existentes.
d. `git diff main -- readme.md`: solo líneas agregadas (las eliminadas, si hay, pertenecen a un esqueleto previo de esta misma sección).

## p6:
ROL
Eres un agente de desarrollo trabajando en MaldOps (Vite multipágina, HTML/CSS/JS vanilla, equipo de 3). Objetivo: dejar el repo listo para la Entrega 2 de Desarrollo Web, siguiendo la estructura del repo de referencia https://github.com/skadecl/DW-2026-2 (app "Sazón").

REGLAS
- Trabaja UNA tarea por vuelta. Nunca más.
- No toques páginas o archivos que no estén en la tarea. Si una tarea exige cambiar vistas asignadas a otro integrante, no las edites: déjalo anotado en ia/PLAN.md como "BLOQUEADO: <motivo>".
- Las vistas NUNCA usan fetch, leen JSON ni tocan localStorage directamente: solo llaman a js/api.js.
- No inventes archivos ni rutas: lee el repo antes de editar.
- No agregues frameworks nuevos. Solo lo que ya hay (Vite, JS módulos ES).
- Una rama por tarea (feat/<tarea>), commits pequeños en español, y registra el uso de IA en ia/.

PASO 0 (solo la primera vez)
Lee README.md, package.json, vite.config.js, la estructura de carpetas y todos los .html. Crea ia/PLAN.md con el checklist de abajo (todo sin marcar) y haz commit.

LOOP (repite hasta que no queden tareas sin marcar)
1. Lee ia/PLAN.md y elige la primera tarea sin marcar y no bloqueada.
2. Lee solo los archivos que esa tarea necesita.
3. Implementa solo esa tarea.
4. Verifica: `npm run build` sin errores. Si la tarea es de UI, revisa en `npm run dev` que la vista cargue y la consola no tenga errores.
5. Si falla, corrige (máx. 3 intentos). Si sigue fallando, márcala BLOQUEADO con el error y pasa a la siguiente.
6. Marca la tarea en ia/PLAN.md, agrega una línea en ia/ (qué hiciste y qué prompt usaste) y haz commit.
7. Responde en máx. 5 líneas: tarea hecha, archivos tocados, siguiente tarea. Luego continúa.

CHECKLIST (en este orden)
A. Capa de datos
 1. Crear public/mocks/{usuarios,clientes,ventas,preguntas}.json con los ids ya definidos (u-001, cli-001…cli-012, ven-001…, preg-001…). Al menos 10 clientes y 15 ventas. Roles admin/vendedor.
 2. Crear js/api/ con respuesta.js (formato { ok, status, data, error }), db.js (copia public/mocks a localStorage la primera vez; lee y escribe ahí), servidor.js (latencia aleatoria 300–800 ms, errores forzados, códigos 200/201/400/401/403/404/409/422/500).
 3. Crear js/api.js (o js/api/index.js) como única puerta con: auth.iniciarSesion, auth.registrar, auth.cerrarSesion, clientes (listar, obtener, crear, actualizar, eliminar), ventas (listar, obtener, crear, actualizar, eliminar, deCliente), preguntas.listar. Todas async y con el mismo formato de respuesta.
 4. Sesión simulada guardada en localStorage; las vistas privadas redirigen al login y vuelven a la vista pedida.
 5. Simulador de errores: `?fallar` en la URL y selector de latencia/probabilidad de error en configuracion.html. Botón "Restablecer datos de prueba".
B. Estados de interfaz (una vista por tarea: clientes, ventas, dashboard, ayuda, configuracion, login, registro)
 6. Cada vista que muestre datos usa api.js y muestra: cargando (esqueleto), vacío, y error con botón Reintentar.
 7. Validación por campo en login y registro con mensajes en español (usa los 422 de la API).
 8. CRUD de clientes y ventas funcionando con modal de confirmación al eliminar y aviso (toast) de éxito/error.
C. Estructura del repo
 9. Mover js/ y css/ a src/, img/ a public/img/; actualizar rutas y vite.config.js (todas las páginas como input). `npm run build` debe pasar.
 10. Crear .env.example con VITE_API_MODO=mock y VITE_API_URL=; crear js/api/http.js (fetch) que devuelva el mismo formato, elegido por VITE_API_MODO.
 11. Reemplazar el CDN de Ionicons por el paquete npm.
 12. Crear ia/README.md como índice de uso de IA.
D. README
 13. Reescribir README.md con: descripción, integrantes con usuario de GitHub, tecnologías, requisitos, instalación, credenciales de prueba (admin y vendedor, con rol), tabla de vistas (ruta, cómo llegar, pública/privada, incluye dashboard), funcionalidades, capa de datos (diagrama simple + endpoints), formato del backend real ({data,meta} / {error,errores}), tabla de mocks (archivo, registros, contenido), árbol de estructura del proyecto y link a ia/README.md. Quitar el texto que dice que js/api.js y mocks "todavía no existen".
E. Cierre
 14. Probar en `npm run build && npm run preview` todas las vistas, con y sin `?fallar`. Anotar en ia/PLAN.md lo que falle.

CONDICIÓN DE TÉRMINO
Cuando todas las tareas estén marcadas o BLOQUEADAS, entrega un resumen final: qué quedó listo, qué quedó bloqueado y por qué, y qué debe revisar cada integrante antes de la entrega.

## p7:

Revision de stack completo por partes, desplegar agente por cada punto pendiente para hacer una previa evaluacion y responder frente a cada problema planteado, cada punto debe ser punto a punto explicado como ser resuelto previo a desplegar el plan de ejecucion
1 . Conectar el select «Ordenar clientes» en src/clientes.js (aplicarVista + listener 'change') y borrar el listener duplicado de la línea 484 para que búsqueda, filtro y orden funcionen juntos.
2 . Regularizar la documentación de IA: agregar marcas [IA] inicio/fin en todo el código generado con IA (src/api/*, nav.js, ui.js, guard.js, vistas, exportar.js, app.css), completar los registros del 5–7 nov y el de Martín con los prompts y respuestas literales, restaurar el registro vaciado, crear los registros a los que apuntan tema.css, tema.js y dashboard.js, sumar la columna Herramienta al índice y usar [IA] en los commits.
3 . Agregar la vista de detalle de cliente (cliente.html?id=… con api.clientes.obtener y api.ventas.deCliente), la página o mensaje de no encontrado, y hacer funcional (o quitar) el panel de cuenta de configuracion.html.
4 . Corregir el layout responsive en src/css/dashboard.css y src/css/app.css: una sola columna en .detalles bajo 992 px y sin columna vacía en Clientes; probar a 375, 412, 768 y 1280 px.
5 . Accesibilidad y semántica: labels en los campos de cuenta de configuracion.html, foco visible y labels con contraste en login/registro, <main> en cada vista y cerrar los <div>/<section> mal anidados.

## p8:
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


## p9:
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


## p10:
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

## p11:
Trabaja en el repositorio MaldOps. Rama de trabajo: `fix/revision-final`; si no existe, créala desde `origin/main`. Antes de editar, lee todas las vistas y `src/css/login.css`, `src/css/app.css` y `src/css/dashboard.css`. Muestra un plan breve. No reescribas historial de git.

OBJETIVO
- Labels correctos en los campos de cuenta.
- Foco visible y contraste suficiente en login/registro.
- Un `<main>` por vista.
- Cerrar bien los `<div>`/`<section>` mal anidados.

PARTE A — LABELS DE CUENTA
Archivo: `configuracion.html`.
- Los campos `#cuenta-nombre`, `#cuenta-correo`, `#cuenta-contrasena-actual` y `#cuenta-contrasena-nueva` ya tienen `<label for>`. Verifica que cada `for` coincida con el `id` y que el label sea visible.
- `#modo-oscuro` solo tiene `aria-label`. Agrega un `<label for="modo-oscuro">Modo oscuro</label>` visible y quita el texto suelto de la celda si queda duplicado.
- `#cuenta-aviso` debe tener `role="status"` y `aria-live="polite"`.
- Si conviertes la sección en `<form>`, usa `<button type="submit">` y `preventDefault()`.

PARTE B — CONTRASTE Y FOCO EN LOGIN/REGISTRO
Archivo: `src/css/login.css`.
- Los labels usan `#ccc` sobre blanco (contraste ~1.6:1). Cámbialos a `#475569` (contraste ~7.5:1).
- El color de foco/valid usa `#2691d9` (~3:1). Cámbialo a `#0369a1` (~5.9:1) en labels, borde inferior y enlaces.
- Los inputs tienen `outline: none`. Agrega un foco visible:
  `outline: 2px solid #0369a1; outline-offset: 2px;`
  para inputs, botón de envío y enlaces `.registro a`.
- Actualiza también las reglas específicas de `#form-login` que repiten `#2691d9`.
- Mantén el efecto de label flotante; no lo reemplaces por placeholders.
- Verifica el contraste con DevTools (mínimo 4.5:1 para texto normal).

PARTE C — `<main>` Y HTML MAL CERRADO
Estado actual:
- `clientes.html`: 15 `<div>` abiertos y 13 cerrados. Faltan los cierres de `.detalles` y `.container`.
- `configuracion.html`: 13 abiertos y 11 cerrados. Faltan los mismos dos cierres.
- `ventas.html`: 14 abiertos y 12 cerrados, y sobra un `</section>`.
- `ayuda.html`: los `<div>` están balanceados, pero sobra un `</section>`.
- `dashboard.html`: el `<section>` está balanceado, pero no hay `<main>`.
- `index.html` y `registro.html`: no hay `<main>`.

Tareas:
1. Agrega exactamente un `<main>` por vista:
   - `index.html` y `registro.html`: cambia `<div class="formulario">` por `<main class="formulario">` y su cierre por `</main>`.
   - `dashboard.html`: envuelve el contenido principal con `<main>` (por ejemplo, desde `#dashboard-estado` hasta `#dashboard-contenido`) o cambia el `<section>` externo por `<main>`; conserva las clases y el CSS.
   - `clientes.html`, `configuracion.html`, `ventas.html`, `ayuda.html`: envuelve `.detalles` con `<main>` o cambia `<div class="detalles">` por `<main class="detalles">`. Los `<dialog>` pueden quedar dentro o fuera; si los mueves, verifica el CSS.
   - `cliente.html` (si ya existe): debe nacer con `<main>`.
2. Cierra los `<div>` faltantes antes de los `<script>`: `.detalles` y `.container`.
3. Elimina los `</section>` sueltos de `ventas.html` y `ayuda.html`.
4. Verifica el balance con un script o con `npx html-validate` si está disponible. No agregues dependencias nuevas solo para esto.
5. Comprueba que cada vista tenga un solo `<main>` y que ningún `<main>` quede dentro de otro.

PRUEBAS
- Navega con Tab por login, registro y Configuración: el foco debe verse en inputs, botones y enlaces.
- Revisa los labels con el árbol de accesibilidad del navegador.
- Verifica que el layout no cambie al agregar `<main>` (el `<main>` debe ser transparente para el CSS).
- `npm run build` y recorrido de las 7 vistas + `cliente.html` si existe.

CIERRE
- Registra en `ia/PLAN.md` y crea `ia/2026-11-12_<tu-usuario>_accesibilidad-semantica.md`.
- Commit: `fix(a11y): mejora foco, contraste y semántica [IA]`.

FINAL.
