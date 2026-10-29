# Sistema de diseño MaldOps en css/app.css (Tailwind v4)

- **Fecha:** 2026-10-29
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Archivos afectados:** `css/app.css` y este registro

## Objetivo

Definir el sistema de diseño de MaldOps sobre Tailwind v4: tokens en español, modo oscuro por clase, componentes base y contraste WCAG AA, sin migrar HTML ni estilos existentes.

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
```

### Respuesta 1

```text
Listo. V3 implementada y verificada en `feat/sistema-diseno`.

**Qué quedó**
- `@theme static` con `--color-primario-50…900` (500 anclado al `--color-accent` de V2), `--color-acento`, estados, superficies, borde, textos, `--font-sans` con fallback de sistema, escala `--text-xs…2xl`, radios y sombras.
- `.dark` redefine superficie, superficie-2, borde, texto, texto-suave, acento y estados de éxito/alerta; `@custom-variant dark` queda listo para `dark:`.
- `@layer components` con los 12 componentes pedidos y un comentario de una línea por clase.
- Hover, focus-visible (anillo de 2px con offset de 2px) y disabled/`[aria-disabled="true"]` en botones e input; tabla con hover y encabezado diferenciado; skeleton con pulso desactivado por `prefers-reduced-motion`.
- Sin preflight: `box-sizing`, bordes y `font: inherit` declarados donde corresponde. No toqué HTML ni otros archivos.

**Verificación**
- a) `npm run build`: ✓, 7 páginas, sin warnings.
- b) CSS emitido: 12/12 selectores, todos los tokens y `.dark`.
- c) Contraste: 30/30 pares OK; textos ≥5.01:1 y foco/borde ≥3.07:1. Tabla completa en `ia/2026-10-29_victorbarrera1_sistema-diseno.md`.
- d) Un comentario por clase y `git diff --name-only main` solo `css/app.css` y el registro.

Commit `feat(ui): sistema de diseño MaldOps en css/app.css [IA]` pusheado en `feat/sistema-diseno`. Sin merge.
```

## Qué se incorporó

- `@theme static` con la escala azul `--color-primario-50` a `--color-primario-900`, anclada en `--color-accent` para el 500, y los tokens `--color-acento`, `--color-exito`, `--color-alerta`, `--color-peligro`, `--color-superficie`, `--color-superficie-2`, `--color-borde`, `--color-texto` y `--color-texto-suave`.
- Tokens de tipografía `--font-sans` (Roboto Slab con fallback de sistema), escala `--text-xs` a `--text-2xl`, radios `--radius-sm/md/lg` y sombras `--shadow-sm/md/lg`.
- Bloque `.dark` con la redefinición de superficies, borde, textos, acento y estados de éxito/alerta, más `@custom-variant dark` para la clase `.dark` en `<html>`.
- `@layer components` con `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.card`, `.input`, `.label`, `.badge`, `.badge-exito`, `.badge-alerta`, `.tabla` y `.skeleton`, cada uno con su comentario de una línea.
- Estados hover, focus-visible y disabled/`[aria-disabled="true"]` en los botones y el input; anillo de foco de 2px con offset de 2px; tabla con hover y encabezado diferenciado; skeleton con pulso desactivado por `prefers-reduced-motion`.
- Sin preflight: `box-sizing`, bordes y `font: inherit` declarados donde corresponde. No se tocó ningún HTML ni otro archivo del proyecto.

## Verificación

| Check | Comando | Resultado |
|---|---|---|
| a. Build | `npm run build` | ✓ built; 7/7 páginas; sin warnings de recursos sin resolver. |
| b. CSS emitido | `dist/assets/main-*.css` + búsqueda de selectores, tokens y `.dark` | 12/12 selectores presentes; todos los tokens requeridos presentes; `.dark` presente. |
| c. Contraste | `node /tmp/contraste-v3.mjs` | 30/30 pares OK; exit 0. Tabla completa abajo. |
| d. Comentarios | `grep -cE '^\s*/\* \.<clase>: ' css/app.css` para las 12 clases | 1 comentario por clase; 12/12. |
| d. Alcance | `git diff --name-only main` | Solo `css/app.css` y este registro. |

### Contraste WCAG AA

| Modo | Par | Colores | Ratio | Mínimo | Resultado |
|---|---|---|---|---|---|
| claro | texto / superficie | #333 sobre #ffffff | 12.63:1 | 4.5:1 | OK |
| claro | texto / superficie-2 | #333 sobre #f1f5f9 | 11.53:1 | 4.5:1 | OK |
| claro | texto suave / superficie | #475569 sobre #ffffff | 7.58:1 | 4.5:1 | OK |
| claro | texto suave / superficie-2 | #475569 sobre #f1f5f9 | 6.92:1 | 4.5:1 | OK |
| claro | .btn / fondo | #333 sobre #f1f5f9 | 11.53:1 | 4.5:1 | OK |
| claro | .btn-primary / fondo | #ffffff sobre #1b74b3 | 5.01:1 | 4.5:1 | OK |
| claro | .btn-secondary / fondo | #333 sobre #f1f5f9 | 11.53:1 | 4.5:1 | OK |
| claro | .btn-danger / fondo | #ffffff sobre #b91c1c | 6.47:1 | 4.5:1 | OK |
| claro | .badge / fondo | #333 sobre #f1f5f9 | 11.53:1 | 4.5:1 | OK |
| claro | .badge-exito / fondo | #166534 sobre #dcfce7 | 6.49:1 | 4.5:1 | OK |
| claro | .badge-alerta / fondo | #92400e sobre #fef3c7 | 6.37:1 | 4.5:1 | OK |
| claro | foco / superficie | #2691d9 sobre #ffffff | 3.42:1 | 3:1 | OK |
| claro | foco / superficie-2 | #2691d9 sobre #f1f5f9 | 3.12:1 | 3:1 | OK |
| claro | borde .input / superficie | #64748b sobre #ffffff | 4.76:1 | 3:1 | OK |
| claro | borde .input / superficie-2 | #64748b sobre #f1f5f9 | 4.34:1 | 3:1 | OK |
| oscuro | texto / superficie | #f8fafc sobre #0f172a | 17.06:1 | 4.5:1 | OK |
| oscuro | texto / superficie-2 | #f8fafc sobre #1e293b | 13.98:1 | 4.5:1 | OK |
| oscuro | texto suave / superficie | #cbd5e1 sobre #0f172a | 12.02:1 | 4.5:1 | OK |
| oscuro | texto suave / superficie-2 | #cbd5e1 sobre #1e293b | 9.85:1 | 4.5:1 | OK |
| oscuro | .btn / fondo | #f8fafc sobre #1e293b | 13.98:1 | 4.5:1 | OK |
| oscuro | .btn-primary / fondo | #ffffff sobre #1b74b3 | 5.01:1 | 4.5:1 | OK |
| oscuro | .btn-secondary / fondo | #f8fafc sobre #1e293b | 13.98:1 | 4.5:1 | OK |
| oscuro | .btn-danger / fondo | #ffffff sobre #b91c1c | 6.47:1 | 4.5:1 | OK |
| oscuro | .badge / fondo | #f8fafc sobre #1e293b | 13.98:1 | 4.5:1 | OK |
| oscuro | .badge-exito / fondo | #4ade80 sobre #14532d | 5.23:1 | 4.5:1 | OK |
| oscuro | .badge-alerta / fondo | #fbbf24 sobre #78350f | 5.43:1 | 4.5:1 | OK |
| oscuro | foco / superficie | #7dd3fc sobre #0f172a | 10.71:1 | 3:1 | OK |
| oscuro | foco / superficie-2 | #7dd3fc sobre #1e293b | 8.77:1 | 3:1 | OK |
| oscuro | borde .input / superficie | #64748b sobre #0f172a | 3.75:1 | 3:1 | OK |
| oscuro | borde .input / superficie-2 | #64748b sobre #1e293b | 3.07:1 | 3:1 | OK |
