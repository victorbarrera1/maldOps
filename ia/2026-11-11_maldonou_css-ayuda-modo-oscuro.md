# Corrección de hover y foco del acordeón de Ayuda en modo oscuro

- **Fecha:** 2026-11-10
- **Integrante:** Martin Maldonado (@maldonou)
- **Herramienta y modelo:** Claude (<modelo exacto que usaste>)
- **Enlace a la conversación:** <opcional, si la herramienta permite compartirla>
- **Archivos afectados:** `src/css/dashboard.css` (reglas de `#ayuda-lista`), `src/css/tema.css` (variables `--borde` y `--hover` en `html.dark`)

## Objetivo

Al pasar el mouse sobre una pregunta del acordeón de Ayuda en modo oscuro, el texto no se leía: el hover tenía un fondo fijo claro (`#f7f7f7`) y el texto usaba una variable que en modo oscuro es clara. Se consultó a la IA para reemplazar colores fijos por variables que cambien con el tema, y para mejorar el foco visible.

## Conversación (texto completo, sin editar)

### Prompt 1
``text
quiero arreglar el css de ayuda, ya que el modo oscuro hacer q con el hover del mouse no se lea nada
      .detalles .ordenes-recientes #ayuda-lista button{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        padding: 14px 16px;
        border: none;
        background: transparent;
        font-size: 15px;
        font-weight: 600;
        color: var(--black);
        cursor: pointer;
        transition: 0.2s;
    } 
    .detalles .ordenes-recientes #ayuda-lista button:hover{
        background-color: 
#f7f7f7;
    }
    .detalles .ordenes-recientes #ayuda-lista button:focus-visible{
        outline: 2px solid black;
        outline-offset: 2px;
    }

ahi esta el codigo css de los botones, que debo cambiar
``
### Respuesta 1
``text
El problema está en el :hover: pones un fondo fijo claro (
#f7f7f7) pero el texto usa var(--black), que en modo oscuro es claro (
#e5e7eb). Resultado: texto claro sobre fondo claro. Lo mismo pasa con el outline: black, que casi no se ve en oscuro.

La solución es usar variables que cambien con el tema, igual que el resto del proyecto. En tema.css ya existe html.dark con sus variables, así que no pongas colores fijos en el hover.

Reemplaza el bloque por esto:

css
.detalles .ordenes-recientes #ayuda-lista button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 14px 16px;
    border: none;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    color: var(--black);
    cursor: pointer;
    transition: background-color 0.2s;
}

.detalles .ordenes-recientes #ayuda-lista button:hover {
    background-color: color-mix(in srgb, var(--black) 8%, transparent);
}

.detalles .ordenes-recientes #ayuda-lista button:focus-visible {
    outline: 2px solid var(--black);
    outline-offset: 2px;
}

Qué cambió y por qué:

:hover: el fondo ahora es el texto mezclado con transparencia al 8 %. En claro queda un gris suave; en oscuro, un gris claro suave. El texto siempre contrasta.
:focus-visible: el contorno usa var(--black), así se ve en ambos temas. Es el foco visible que pide la rúbrica (C4).
transition: solo anima el fondo, no todo.

Si color-mix no te funciona en algún navegador viejo, usa una variable en tema.css, por ejemplo --ayuda-hover: #e2e8f0; dentro de :root y --ayuda-hover: #1e293b; dentro de html.dark, y úsala en el :hover.

Después de cambiarlo, prueba en ayuda.html activando el modo oscuro en configuracion.html y pasando el mouse sobre cada pregunta. Si quieres, pega también el bloque de html.dark de tema.css que afecte a los botones y lo revisamos juntos.

Este cambio es código sugerido por IA: márcalo con /* [IA] inicio · ia/AAAA-MM-DD_maldonou_hover-ayuda-oscuro.md */ y /* [IA] fin */, y guarda el prompt y la respuesta en ia/.
``
### Prompt 2
``text
Falta el foco con el tab
### Respuesta 2
``text
El foco con Tab no se ve porque el `:focus-visible` que pusimos depende del navegador y de cómo llegue el foco. Hay tres causas típicas en tu caso:

1. **`outline` lo quita otra regla.** Busca en `dashboard.css`, `app.css` y `tema.css` algo como `outline: none` o `button:focus { outline: 0 }`, que gana por especificidad o por orden. Tailwind con preflight también puede quitarlo en algunos casos.
2. **El botón está dentro de un `<div>` con `x-data`** que no cambia nada, así que no es eso. Pero revisa que sea un `<button>` real y no un `<div>` con `@click`.
3. **El `outline` queda cortado** por `overflow: hidden` en el contenedor `.ordenes-recientes`, así que aunque exista no se ve.

Para comprobarlo rápido, abre `ayuda.html`, presiona Tab hasta una pregunta y en DevTools revisa la pestaña "Computed" buscando `outline`. Si el valor es `none` o `0`, el problema es la causa 1 o 3.

Para forzarlo, reemplaza el bloque de foco por uno más explícito y que no dependa de `outline` solamente:

```css
.detalles .ordenes-recientes #ayuda-lista button:focus {
    outline: none;
}

.detalles .ordenes-recientes #ayuda-lista button:focus-visible {
    outline: 2px solid var(--black);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--black) 25%, transparent);
}
```

El `box-shadow` no lo corta `overflow: hidden`, así que el foco se ve aunque el contenedor recorte el borde. Si el `:focus` anterior no se aplica, quítalo y deja solo el `:focus-visible` con `box-shadow`.

Como esto también es código sugerido por IA, agrega la marca `/* [IA] inicio · ... */` y `/* [IA] fin */` y añade el prompt y la respuesta al registro de hoy en `ia/`.
``

## Qué se incorporó al proyecto

- Hover de los botones del acordeón: se reemplazó el fondo fijo #f7f7f7 por color-mix(in srgb, var(--black) 8%, transparent). Así el fondo se adapta al tema y el texto mantiene contraste en modo oscuro.
- Focus-visible: el contorno usa var(--black) en lugar de black, para que se vea en ambos temas.
- Foco con Tab: se agregó un :focus-visible con outline y box-shadow. El box-shadow evita que overflow: hidden recorte el foco.
- Se Descartaron los colores fijos (#f7f7f7, black), porque rompían el modo oscuro. No se usó la alternativa de variables en tema.css porque color-mix funcionó en el navegador donde se probó.

## Verificación

- Revisé la vista Ayuda con modo oscuro y el mouse sobre cada pregunta.
- Revisé el foco con teclado (Tab).
- Revisé que el foco también se vea en el modo claro.
- Se comprobó en la consola que no aparecen errores de CSS.