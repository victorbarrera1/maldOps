# Bloque E — Cierre y pruebas de la entrega

- **Fecha:** 2026-11-05
- **Integrante:** @victorbarrera1
- **Rama:** `feat/bloque-e-cierre`
- **PR:** pendiente
- **Prompt usado:** checklist de la Entrega 2, tarea E14 («Probar en
  `npm run build && npm run preview` todas las vistas, con y sin `?fallar`.
  Anotar en este archivo lo que falle»).

## E14 — Pruebas del build

Se levantó el build con `npm run preview` en `http://localhost:4173` y se
recorrieron las siete vistas con sesión `admin` y con sesión `vendedor`.

- **Dashboard:** 12 clientes, 15 ventas, `$1.825.000` de ganancias, `$121.667`
  de ticket promedio, 8 ventas recientes y 5 clientes.
- **Clientes:** 12 filas y 12 botones «Editar». Como admin se ven 12
  «Eliminar»; como vendedor, 0.
- **Ventas:** 15 filas y 15 botones «Editar». Como admin se ven 15 «Eliminar»;
  como vendedor, 0.
- **Ayuda:** 8 preguntas cargadas desde la API.
- **Configuración:** nombre y correo de la sesión, latencia `normal`,
  probabilidad de error `0` y simulador visible.
- **Login:** inicia sesión y llega al dashboard. Con `?fallar` muestra el error
  con «Reintentar»; al quitar el parámetro y reintentar, entra.
- **Registro:** crea una cuenta `vendedor` y llega al dashboard. Con `?fallar`
  muestra el error; al reintentar, crea la cuenta y entra.
- **Errores forzados:** `?fallar` devuelve 500 y `?fallar=404` devuelve 404 en
  las cinco vistas privadas, siempre con el estado de error y «Reintentar».
- **Guard:** sin sesión, `clientes.html` redirige a
  `index.html?volver=clientes.html`.
- **Iconos:** los 12 iconos del dashboard se resolvieron sin advertencias de
  Ionicons.

## Fallo encontrado y corregido

En el build, el menú se montaba antes de que `guard.js` estableciera
`window.__sesion`. Por eso, después de registrarse, el nav mostraba «Usuario» /
«Sin rol» aunque la sesión estuviera correctamente guardada en `localStorage`.
En desarrollo no se veía porque cada `<script type="module">` se ejecuta en el
orden del HTML; en el build, los módulos se agrupan en un chunk y el orden
cambia.

La corrección fue importar `./guard.js` al inicio de `src/main.js`, antes de
`montarNav()`. Así la guardia se evalúa primero en cualquier página y deja
`window.__sesion` disponible para el menú. También se verificó que el guard
sigue redirigiendo al login cuando no hay sesión.

## Verificación

- `npm run build` pasa.
- Las pruebas se repitieron después de la corrección: dashboard, clientes,
  ventas, ayuda y configuración con y sin `?fallar`; login y registro con
  `?fallar` y reintento; nav con admin, con vendedor y con una cuenta nueva.
- Consola del navegador sin errores en las cargas normales.
