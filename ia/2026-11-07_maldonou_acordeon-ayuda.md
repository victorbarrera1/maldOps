# Acordeón de preguntas frecuentes en Ayuda con Alpine.js

- **Fecha:** 2026-11-07
- **Integrante:** Martin Maldonado (@maldonou)
- **Herramienta y modelo:** Claude (<confirmar el modelo usado>)
- **Enlace a la conversación:** <opcional, si la herramienta permite compartirla>
- **Archivos afectados:** `ayuda.html`, `src/ayuda.js`, `src/css/dashboard.css`

## Objetivo

Reemplazar la tabla de preguntas frecuentes de la vista Ayuda por un acordeón desplegable (tercer componente de interfaz que pide la rúbrica de la Entrega 2), usando Alpine.js para ser consistentes con el resto del proyecto, y darle un estilo simple y moderno. Se consultó a la IA para decidir la técnica, entender cómo crear atributos de Alpine desde JavaScript y depurar el CSS.

## Conversación (texto completo, sin editar)

<PEGAR AQUÍ, sin editar, todos los prompts y respuestas de esta consulta, con el formato de abajo. Copiar desde el chat o desde el enlace compartido; no resumir ni corregir.>

### Prompt 1

```text
<texto exacto del prompt>
```

### Respuesta 1

```text
<texto exacto de la respuesta, incluido el código>
```

<repetir Prompt / Respuesta para cada intercambio>

## Qué se incorporó al proyecto

- **Estructura del acordeón** (`src/ayuda.js`, función `pintarPreguntas`): cada pregunta es un contenedor con `x-data`, un botón con `x-on:click` y `x-bind:aria-expanded`, y un panel con `x-show`. La IA explicó qué atributos de Alpine corresponden a cada parte y que desde JavaScript se deben usar los nombres largos (`x-on:`, `x-bind:`); el código lo escribí yo, y el nombre del estado (`abierto`) es mío.
- **Contenedor en `ayuda.html`**: se reemplazó la tabla por un contenedor con id `ayuda-lista`, y se actualizaron las referencias en `ayuda.js`.
- **Estilos** (`src/css/dashboard.css`): la IA sugirió una tabla de valores (borde claro, bordes redondeados, relleno del botón, hover, foco visible, flecha con `::after` que gira según `aria-expanded`). Los escribí yo y los ajusté: selectores con `#ayuda-lista`, corrección de `border` y `outline`, y `display: inline-block` en la flecha para que el giro se aplique.
- **Descartado:** `<details>`/`<summary>` nativos y JavaScript puro (se eligió Alpine por consistencia). <completar: indicar si se usó o no `x-transition`, `x-cloak` o `:has()`, que también se sugirieron>

## Verificación

- Se comprobó que se muestran las 8 preguntas del mock y que cada una abre y cierra de forma independiente.
- Se verificó en las herramientas de desarrollo que `aria-expanded` cambia entre `false` y `true`, y que la flecha gira al abrir.
- Se revisó que Dashboard y Clientes no cambiaron de aspecto tras agregar los estilos.
- <completar solo lo que se haya hecho de verdad: navegación con teclado y foco visible, estado de error con `ayuda.html?fallar`, vista a 375 px sin scroll horizontal, consola sin errores>
- Entiendo cómo funciona el código incorporado: cada ítem tiene su propio estado `abierto` (creado con `x-data`), el clic lo invierte, `x-show` muestra u oculta el panel según ese estado, y `x-bind:aria-expanded` refleja el mismo estado en el botón, que es lo que usa el CSS para girar la flecha.
