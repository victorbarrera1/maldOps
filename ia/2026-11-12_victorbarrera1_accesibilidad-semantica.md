# Accesibilidad: labels, foco, contraste y semántica

- **Fecha:** 2026-11-12
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Herramienta y modelo:** OpenCode — DeepSeek V4.1 Flash Free
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** `index.html`, `registro.html`, `dashboard.html`, `clientes.html`, `ventas.html`, `ayuda.html`, `configuracion.html`, `src/css/login.css`, `src/css/tema.css`, `ia/PLAN.md`, `ia/README.md`

## Objetivo

Dejar los labels de la cuenta correctamente asociados, mejorar el contraste y
el foco visible de login y registro, y asegurar un solo `<main>` por vista con
el HTML bien cerrado.

## Conversación (texto completo, sin editar)

### Prompt 5

```text
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
```

### Respuesta 5

Primero verifiqué la Parte A: los cuatro `for` coinciden con sus `id`, el label
de `#modo-oscuro` ya era visible, `#cuenta-aviso` ya tenía `role="status"` y
`aria-live="polite"`, y `#form-cuenta` ya se enviaba con un botón
`type="submit"` cuyo manejador llama a `preventDefault()`. No hizo falta
rehacer el panel.

En login y registro cambié los labels de `#ccc` a `#475569`, el color de foco,
válido, borde inferior y enlaces de `#2691d9` a `#0369a1`, y agregué
`outline: 2px solid #0369a1` con `outline-offset: 2px` en inputs, botón de
envío y enlaces. Mantuve el label flotante. Además, como el tema oscuro es una
preferencia real, añadí en `tema.css` un override del outline a `#38bdf8` para
que el foco también sea visible sobre la tarjeta oscura.

Para la Parte C puse `<main class="formulario">` en login y registro, envolví
el contenido del Dashboard con `<main>` (dejando el nav fuera), y cambié
`.detalles` por `<main class="detalles">` en Clientes, Ventas, Ayuda y
Configuración. Cerré `.detalles` y `.container`, y quité los `</section>`
sueltos de Ventas y Ayuda. `cliente.html` ya tenía su `<main>`.

## Cambios aplicados

```diff
diff --git a/index.html b/index.html
@@
-    <div class="formulario">
+    <main class="formulario">
@@
-    </div>
+    </main>

diff --git a/registro.html b/registro.html
@@
-    <div class="formulario">
+    <main class="formulario">
@@
-    </div>
+    </main>

diff --git a/dashboard.html b/dashboard.html
@@
         <div class="container">
             <div id="nav-root"></div>
+            <main>
@@
             </div>
+            </main>
         </div>

diff --git a/clientes.html b/clientes.html
@@
-        <div class="detalles detalles--unico">
+        <main class="detalles detalles--unico">
@@
             </dialog>
-
+        </main>
+    </div>

diff --git a/ventas.html b/ventas.html
@@
-        <div class="detalles">
+        <main class="detalles">
@@
-            </section>
+        </main>
+    </div>

diff --git a/ayuda.html b/ayuda.html
@@
-        <div class="detalles">
+        <main class="detalles">
@@
-        </div>
+        </main>
@@
-    </section>

diff --git a/configuracion.html b/configuracion.html
@@
-        <div class="detalles">
+        <main class="detalles">
@@
             <!-- Fin Simulador de pruebas -->
 
+        </main>
+    </div>

diff --git a/src/css/login.css b/src/css/login.css
@@
-    color: #ccc;
+    color: #475569;
@@
-    color: #2691d9;
+    color: #0369a1;
@@
-    border-bottom-color: #2691d9;
+    border-bottom-color: #0369a1;
+    outline: 2px solid #0369a1;
+    outline-offset: 2px;
@@
+.formulario input[type="submit"]:focus-visible,
+.registro a:focus-visible {
+    outline: 2px solid #0369a1;
+    outline-offset: 2px;
+}
+
@@
-    color: #2691d9;
+    color: #0369a1;
@@
-    outline: 2px solid #2691d9;
+    outline: 2px solid #0369a1;
@@
-    color: #2691d9;
+    color: #0369a1;

diff --git a/src/css/tema.css b/src/css/tema.css
@@
 html.dark .formulario .campo-error { color: #fca5a5; }
+html.dark .formulario input:focus,
+html.dark .formulario input[type="submit"]:focus-visible,
+html.dark .formulario .registro a:focus-visible,
+html.dark .login-reintentar:focus-visible {
+    outline-color: #38bdf8;
+}
```

## Qué se incorporó

- Un `<main>` por vista, sin anidamientos: login, registro, dashboard,
  clientes, cliente, ventas, ayuda y configuración.
- Cierre correcto de `.detalles` y `.container` en Clientes, Ventas, Ayuda y
  Configuración; eliminados los `</section>` sueltos de Ventas y Ayuda.
- Labels de cuenta visibles y asociados; `#modo-oscuro` con label visible;
  `#cuenta-aviso` como `role="status"` con `aria-live="polite"`.
- Labels de login/registro en `#475569`; foco, borde y enlaces en `#0369a1`;
  outline de 2 px con 2 px de separación en inputs, submit y enlaces.
- Override de foco para modo oscuro (`#38bdf8`) en `tema.css`.

## Verificación

- Script de balance con `html.parser` de la biblioteca estándar (sin
  dependencias nuevas): las ocho vistas quedan `OK`, con un solo `<main>` y
  cero `<main>` anidados.

| Vista | `<main>` | Anidados | `<div>` | `<section>` |
|---|---:|---:|---:|---:|
| `index.html` | 1 | 0 | 4 | 0 |
| `registro.html` | 1 | 0 | 6 | 0 |
| `dashboard.html` | 1 | 0 | 23 | 1 |
| `clientes.html` | 1 | 0 | 14 | 0 |
| `cliente.html` | 1 | 0 | 9 | 0 |
| `ventas.html` | 1 | 0 | 13 | 0 |
| `ayuda.html` | 1 | 0 | 8 | 0 |
| `configuracion.html` | 1 | 0 | 12 | 0 |

- `npm run build` pasa.
- Recorrido de las ocho vistas con sesión `admin`: sin errores de consola,
  `scrollWidth === innerWidth` a 320 px y un solo `<main>` por página.
- Layout sin cambios: `.detalles` conserva `display: grid` y las mismas pistas
  que antes de cambiar el contenedor. A 1280 px, Dashboard, Ventas, Ayuda y
  Configuración mantienen `606.664px 303.336px`; Clientes mantiene una pista
  de `940px`. A 375/412/768 px las cinco vistas siguen con una pista de
  335/372/428 px.
- `cliente.html?id=cli-003` conserva `main.detalles--unico` con una pista a
  375/412/768/1280 px.
- Login y registro: `main.formulario` mide 380 px y queda centrado a 1280 px;
  343 px a 375 px y 288 px a 320 px, sin scroll horizontal.
- Tab en login: correo → contraseña → «Iniciar sesión» → «Regístrate», con
  `outline: 2px solid #0369a1` y `outline-offset: 2px` en los cuatro.
- Tab en registro: nombre → correo → contraseña → confirmar → «Registrarse» →
  «Inicia sesión», con el mismo foco visible.
- Tab en Configuración: los cuatro campos, «Guardar cambios», «Modo oscuro» y
  «Eliminar», con outline visible; hacer clic en cada label enfoca su campo.
- Árbol de accesibilidad de Configuración (profundidad completa): los nombres
  son «Editar nombre de la cuenta», «Cambiar correo», «Contraseña actual»,
  «Cambiar contraseña», «Guardar cambios», «Modo oscuro» y «Eliminar»; el
  aviso aparece como `status`. Lighthouse: accesibilidad 100.
- Contraste calculado: label claro `#475569` sobre blanco = **7.58:1**; foco
  claro `#0369a1` sobre blanco = **5.93:1**; label oscuro `#94a3b8` sobre
  `#111827` = **6.92:1**; foco oscuro `#38bdf8` sobre `#111827` = **8.28:1**.
- Lighthouse de login y registro en tema claro y oscuro: accesibilidad 100,
  sin fallos de contraste ni de labels.
