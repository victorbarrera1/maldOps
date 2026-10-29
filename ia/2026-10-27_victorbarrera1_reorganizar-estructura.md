# Reorganización de la estructura de carpetas (css/, js/, img/)

- **Fecha:** 2026-10-27
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Archivos afectados:** `css/login.css`, `css/dashboard.css`, `js/index.js`, `img/logo-maldops.png`, `img/profile.png` (movidos); `index.html`, `registro.html`, `dashboard.html`, `clientes.html`, `ventas.html`, `configuracion.html`, `ayuda.html` (atributos `href`/`src`)

## Objetivo

Ordenar el proyecto en carpetas `css/`, `js/` e `img/`, renombrar el logo para eliminar el espacio en el nombre y actualizar todas las referencias, sin cambiar diseño, contenido ni comportamiento. Es el primer paso de la Entrega 2 y va antes de que el resto del equipo abra sus ramas, porque toca los 7 HTML.

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
TAREA V1 — Reorganizar proyecto Vite multipágina (solo rutas y ubicación)
Rama: chore/reorganizar-estructura · Commit: "chore(estructura): ordenar css/js/img y renombrar logo" · slug: reorganizar-estructura
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
```

### Respuesta 1

```text
V1 listo, sin merge. Antes de empezar tuve que sincronizar la copia local: estaba en una
historia huérfana (`999ed74`, sin ancestro común con `origin/main`), así que `git pull`
no aplicaba. Creé `backup/local-2026-09-13` apuntando a `999ed74` y luego
`git reset --hard origin/main` (quedó en `5034b4e`). El backup es local, no se subió.

COMMIT: chore(estructura): ordenar css/js/img y renombrar logo
RAMA: chore/reorganizar-estructura

1) Archivos movidos (git mv, historial conservado — R100)

  login.css              → css/login.css
  dashboard.css          → css/dashboard.css
  index.js               → js/index.js
  "logo maldops.png"     → img/logo-maldops.png
  profile.png            → img/profile.png

2) Líneas cambiadas por HTML (git diff -U0)

index.html
-    <link rel="stylesheet" href="login.css">
+    <link rel="stylesheet" href="css/login.css">

registro.html
-    <link rel="stylesheet" href="login.css">
+    <link rel="stylesheet" href="css/login.css">

dashboard.html
-    <link rel="stylesheet" href="dashboard.css">
+    <link rel="stylesheet" href="css/dashboard.css">
-                        <span class="icono"><img src="logo maldops.png"></span>
+                        <span class="icono"><img src="img/logo-maldops.png"></span>
-                    <img src="profile.png" alt="">
+                    <img src="img/profile.png" alt="">
-    <script type="module" src="index.js"></script>
+    <script type="module" src="js/index.js"></script>

clientes.html
-    <link rel="stylesheet" href="dashboard.css">
+    <link rel="stylesheet" href="css/dashboard.css">
-                    <span class="icono"><img src="logo maldops.png"></span>
+                    <span class="icono"><img src="img/logo-maldops.png"></span>
-                <img src="profile.png" alt="">
+                <img src="img/profile.png" alt="">
-            <script type="module" src="index.js"></script>
+            <script type="module" src="js/index.js"></script>

ventas.html
-    <link rel="stylesheet" href="dashboard.css">
+    <link rel="stylesheet" href="css/dashboard.css">
-                    <span class="icono"><img src="logo maldops.png"></span>
+                    <span class="icono"><img src="img/logo-maldops.png"></span>
-                <img src="profile.png" alt="">
+                <img src="img/profile.png" alt="">
-            <script type="module" src="index.js"></script>
+            <script type="module" src="js/index.js"></script>

configuracion.html
-    <link rel="stylesheet" href="dashboard.css">
+    <link rel="stylesheet" href="css/dashboard.css">
-                    <span class="icono"><img src="logo maldops.png"></span>
+                    <span class="icono"><img src="img/logo-maldops.png"></span>
-                <img src="profile.png" alt="">
+                <img src="img/profile.png" alt="">
-            <script type="module" src="index.js"></script>
+            <script type="module" src="js/index.js"></script>

ayuda.html
-    <link rel="stylesheet" href="dashboard.css">
+    <link rel="stylesheet" href="css/dashboard.css">
-                    <span class="icono"><img src="logo maldops.png"></span>
+                    <span class="icono"><img src="img/logo-maldops.png"></span>
-                <img src="profile.png" alt="">
+                <img src="img/profile.png" alt="">
-    <script type="module" src="index.js"></script>
+    <script type="module" src="js/index.js"></script>

3) Referencias fuera de los HTML

Ninguna. `css/dashboard.css` solo tiene un @import a Google Fonts
(https://fonts.googleapis.com/css2?family=Roboto+Slab...), que es externo y no depende de
la ubicación. `js/index.js` no contiene rutas a archivos: solo selectores DOM
('.nav li', '.toggle', '.nav', '.container'). Por eso el paso 3 no requirió cambios.

INCIDENCIAS

- Check a: el grep devuelve 1 coincidencia que NO es una referencia, es un comentario HTML:
  dashboard.html:247  <!-- script index.js-->
  No lo toqué porque el alcance permite solo atributos href/src. Si quieres que diga
  js/index.js, lo cambio en V2 (una línea).

- Check c: el build pasa, pero dist/ contiene 3 páginas (index, registro, dashboard), no 7.
  Causa raíz: vite.config.js declara input solo para esas 3. Es un problema preexistente
  (hoy ventas/clientes/ayuda/configuración caen al login en producción) y vite.config.js
  está fuera de ARCHIVOS PERMITIDOS, así que no lo toqué: V2 lo arregla con el input
  multipágina. Las 7 páginas sí las verifiqué por dev server (200).

- No creé ia/README.md (índice) para no salirme del alcance. Queda pendiente para cuando
  definas en qué commit va.

VERIFICACIÓN (comandos y resultados)

a) grep de referencias antiguas
   grep -rnE "logo maldops|logo%20maldops|profile\.png|login\.css|dashboard\.css|index\.js"
     --include="*.html" --include="*.css" --include="*.js" .
   → 1 resultado, y es el comentario de dashboard.html:247 (ver incidencias).
   → 0 referencias reales con rutas o nombres antiguos.

b) script de referencias locales (check-refs.mjs)
   → HTML revisados: 7
   → Referencias locales: 52
   → Referencias rotas: 0
   → exit 0

c) build y dev server
   npm run build
   → ✓ 8 modules transformed / ✓ built in 74ms
   → dist/assets/logo-maldops-MYOWvx58.png (el rename llega al build)
   → dist/: index.html, registro.html, dashboard.html (3 páginas, ver incidencias)
   npm run dev -- --port 5199 --strictPort + curl
   → 200 en /, /index.html, /registro.html, /dashboard.html, /clientes.html,
     /ventas.html, /configuracion.html, /ayuda.html, /css/login.css,
     /css/dashboard.css, /js/index.js, /img/logo-maldops.png, /img/profile.png
     (13/13 en 200)

d) alcance
   git status --short
   → R  dashboard.css -> css/dashboard.css
     R  login.css -> css/login.css
     R  "logo maldops.png" -> img/logo-maldops.png
     R  profile.png -> img/profile.png
     R  index.js -> js/index.js
     M  index.html, registro.html, dashboard.html, clientes.html, ventas.html,
        configuracion.html, ayuda.html
   → 5 renames R100 (no delete+add) + 7 HTML modificados.
   git diff --name-only main ⊆ {7 HTML, css/*.css, js/index.js, img/logo-maldops.png,
     img/profile.png}
   → sin archivos fuera de la lista permitida.
```

## Qué se incorporó al proyecto

- Las 5 reubicaciones (`git mv`, historial conservado).
- El renombre de `logo maldops.png` a `img/logo-maldops.png`.
- Las 22 referencias actualizadas en los 7 HTML (1 en `index.html`, 1 en `registro.html`, 4 en cada una de las otras 5 páginas).
- Sin cambios de diseño, contenido ni comportamiento; no se ajustaron rutas dentro de CSS ni JS porque no las necesitaban.

## Verificación

| Check | Comando | Resultado |
|---|---|---|
| a. Sin referencias antiguas | `grep -rnE "logo maldops\|logo%20maldops\|profile\.png\|login\.css\|dashboard\.css\|index\.js" --include="*.html" --include="*.css" --include="*.js" .` | 1 coincidencia, que es un comentario HTML (`dashboard.html:247`), no una referencia. 0 rutas/nombres antiguos reales. |
| b. Referencias locales existen | `node check-refs.mjs <raíz>` | 7 HTML, 52 referencias locales, 0 rotas, exit 0. |
| c1. Build | `npm run build` | ✓ built in 74ms. `dist/` con 3 páginas (limitación preexistente de `vite.config.js`, fuera de alcance; V2 la corrige). |
| c2. Dev server | `npm run dev -- --port 5199 --strictPort` + `curl` | 13/13 rutas en 200 (7 páginas + 6 assets). |
| d1. Renames | `git status --short` | 5 renames R100 + 7 HTML modificados. |
| d2. Alcance | `git diff --name-status main` | Solo archivos de la lista permitida. |
