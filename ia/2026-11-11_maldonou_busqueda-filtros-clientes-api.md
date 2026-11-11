# Búsqueda, filtro por estatus y orden en clientes.listar (API simulada)

- **Fecha:** 2026-11-11
- **Integrante:** Martin Maldonado (@maldonou)
- **Herramienta y modelo:** Claude (Sonnet 5.5)
- **Archivos afectados:** `src/api.js` (`clientes.listar`), `src/api/servidor.js` (`listarClientes` y la función de comparación sin tildes). 

## Objetivo

Hacer que `clientes.listar` acepte búsqueda por texto, filtro por estatus y orden, como primer paso del bloque de búsqueda, filtro y ordenamiento, manteniendo la regla del proyecto de que las vistas solo llaman a `src/api.js`. Se consultó a la IA para decidir qué parte va en la API y cuál en la vista, si conviene filtrar en el servidor simulado o en el cliente, y para revisar paso a paso el código escrito.

## Conversación (texto completo, sin editar)

> **Nota de contexto (no forma parte del texto copiado):** esta consulta es el tramo de una conversación más larga. Empieza con el mensaje "Ya terminé el acordeón de Ayuda...". Lo anterior (el acordeón de Ayuda y su registro) está documentado en `2026-11-07_maldonou_acordeon-ayuda.md`.

### Prompt 1
```Ya terminé el acordeón de Ayuda (ayuda.html y ayuda.js). Quiero continuar con el bloque principal: búsqueda, filtro y ordenamiento.

Alcance: en clientes.html / src/clientes.js y ventas.html / src/ventas.js, agregar un buscador por texto, al menos un filtro y un ordenamiento. Todo debe seguir usando src/api.js, y los datos deben venir de los mocks a través de la capa de servicios.

Antes de escribir código, quiero que me digas: 

1. Qué parte va en la API (api.js y servidor.js/http.js) y qué parte va en la vista, con la razón.
2. Si la búsqueda y el filtro deben hacerse en el servidor simulado o en el cliente, y por qué.
3. Qué campos de clientes y ventas sirven para filtrar y ordenar (revisa public/mocks/).
4. El orden de los pasos, en pequeños commits con mensajes descriptivos.
5. Cómo se ve el estado vacío cuando el filtro no encuentra nada, usando los componentes de src/ui.js.


Sigue el PLAN.md: una rama para este bloque, sin tocar archivos de otros bloques sin avisarme. No me des el código completo todavía; espera mi confirmación del plan.
```
### Respuesta 1
```
Sigo con el plan: ya leí `api.js`, `servidor.js`, `http.js`, los mocks, `ui.js` y las vistas de clientes y ventas. Todavía no escribo ni te doy código.

**1. Qué va en la API y qué en la vista**

- **`api.js`:** `clientes.listar()` y `ventas.listar()` aceptan un objeto de opciones (búsqueda, filtro, orden) y lo pasan a la fuente. Sin opciones se comportan igual que hoy, lo que protege a `dashboard.js`, que las llama sin parámetros.
- **`servidor.js`:** filtra y ordena los datos y responde con el mismo `{ ok, status, data, error }`. Un valor inválido devuelve error con los códigos que ya usa.
- **`http.js`:** envía las mismas opciones como parámetros de la URL, por ejemplo `/clientes?busqueda=...&estatus=...&orden=...`.
- **La vista:** los controles, leer sus valores, esperar a que el usuario deje de escribir, ignorar respuestas atrasadas y pintar tabla y estados.

La razón es que el PLAN pide que las vistas no sepan de dónde vienen los datos. Así, en la E3 solo cambia la fuente.

**2. ¿Servidor simulado o cliente?**

Recomiendo el **servidor simulado**:
- El enunciado pide que la capa imite una API real, y su tabla de endpoints es la base de la E3. Una API real filtra con parámetros en la URL.
- En Ventas, buscar por nombre de cliente exige cruzar ventas con clientes, y el servidor ya tiene ambas tablas.

El costo es real: cada cambio es una petición con 300 a 800 ms de latencia. Se mitiga esperando a que termine de escribir, sin reemplazar la tabla por el esqueleto en cada cambio y descartando respuestas viejas. Además, la vista no sabría el total sin filtrar, así que el contador mostraría solo los resultados.

La alternativa es filtrar en el cliente sobre la lista ya cargada. Es instantáneo y más simple, pero esa lógica se pierde en la E3 y la capa de servicios no tendría nada que documentar.

**3. Campos disponibles en `public/mocks/`**

| Recurso | Campos | Búsqueda | Filtro | Orden |
|---|---|---|---|---|
| Clientes (12) | `nombre`, `estatus` (Activo, Inactivo) | `nombre` | `estatus` | nombre A-Z y Z-A |
| Ventas (15) | `clienteId`, `precio`, `servicio` (7 valores), `estatus` (Confirmado, Devuelto, En Progreso, Pendiente) | nombre del cliente y `servicio` | `estatus` y `servicio` | precio ascendente y descendente, cliente A-Z |

Ninguno de los dos recursos tiene fecha, así que no se puede ordenar por "más recientes". La búsqueda debería ignorar mayúsculas y tildes.

**4. Pasos, en commits pequeños** (una rama, por ejemplo `feat/bloque-g-busqueda-filtros`)

1. Agrega el bloque al `PLAN.md`.
2. Acepta opciones de búsqueda, filtro y orden en `clientes.listar` (`api.js` y `servidor.js`). Se puede probar desde la consola del navegador antes de tocar la vista.
3. Lo mismo para `ventas.listar`, con búsqueda por cliente y servicio.
4. `http.js` envía las opciones como parámetros de la URL.
5. Barra de controles en Clientes (HTML y estilos, con `label` en cada campo y sin comportamiento todavía).
6. Conecta esa barra con la API.
7. Estado "sin resultados" en Clientes.
8. Repite 5, 6 y 7 en Ventas, en tres commits.
9. Documenta los parámetros en la tabla de endpoints del README.

Dos detalles de las vistas:
- Tras crear, editar o eliminar, la recarga debe conservar los filtros activos.
- Ventas debe seguir pidiendo todos los clientes sin filtrar, para su formulario y el mapa de nombres.

El código asistido por IA debe subir con su registro en el mismo commit, así que conviene registrar cada consulta de este bloque y subirla con el commit que le corresponde.

**5. Estado vacío cuando el filtro no encuentra nada**

Con `crearVacio`, con un título como "Sin resultados" y un mensaje que nombre la búsqueda y el filtro aplicados. La barra de controles queda visible y activa para poder cambiar la búsqueda. Como `crearVacio` no acepta un botón, la vista le agrega el suyo de "Limpiar filtros", sin tocar `ui.js`.

Se distingue del vacío actual ("Todavía no hay clientes"): ese solo aparece cuando no hay ningún filtro activo. El contador pasa a 0 y el error con "Reintentar" repite la consulta con los mismos filtros.

**Archivos de otros bloques**

- **Bloque A, capa de datos:** `src/api.js`, `src/api/servidor.js` y `src/api/http.js`.
- **Bloque B, vistas:** `clientes.html`, `ventas.html`, `src/clientes.js` y `src/ventas.js`. Están en tu alcance, pero según el registro de IA de Victor figuraban asignados a Josemanuel, así que conviene avisarle.
- **Bloque D:** `README.md`, por la tabla de endpoints.
- **Compartidos:** `src/css/dashboard.css` (solo agregar reglas al final, fuera de cualquier `@media`) y `PLAN.md`.
- **No se tocan:** `src/ui.js`, `dashboard.js` (solo comprobar que sigue funcionando), `ayuda.*` y `nav.js`.

Si no hay reasignación, el PLAN pide anotar `BLOQUEADO` y seguir con otra tarea. Antes de empezar, conviene que el equipo dé el visto bueno a los archivos de los bloques A, B y D.

Dime si vamos con el servidor simulado y si das el aviso para esos archivos, y arrancamos por el paso 1.
```
### Prompt 2
```
Josemanuel esta haciendo un apartado de clientes favoritos y notas, eso interfiere con que yo avance en el bloque B?.
```
### Respuesta 2
```
No te bloquea, pero cambia el plan. Su trabajo ya está en `main` (se unió hoy, 10 de noviembre), así que no hay una rama suya pendiente con la que vayas a chocar. Parte de `main` actualizado y asegúrate de crear tu rama después de un `git pull`. Una aclaración: en el `PLAN.md` el bloque B (estados de interfaz) ya está cerrado, así que asumo que hablas de tu bloque de búsqueda, filtro y orden.

**Lo que tocó Josemanuel y te afecta**
- **`clientes.html` y `src/clientes.js`:** agregó una barra de filtros (`.barra-filtros`) con un checkbox "Solo favoritos". Ese filtro se hace **en el cliente**, sobre la lista ya cargada, y tiene su propio estado vacío ("Aún no tienes favoritos").
- **`src/api/servidor.js`:** los clientes ahora tienen `favorito` y `nota`, con validación al crear y actualizar. No modificó `listarClientes()`, que es donde entrarías tú.
- **`src/css/tema.css` y `src/tema.js`:** estilos y modo oscuro, que tus controles nuevos deberán respetar.

**Cómo cambia tu plan**
1. **Un solo lugar para los controles.** El buscador, el filtro de estatus y el orden van dentro de su `.barra-filtros`, junto a su checkbox, no en una barra nueva.
2. **Dos filtros de naturaleza distinta.** Lo más simple es dejar "Solo favoritos" como está, aplicado sobre el resultado que devuelve la API. Pasarlo al servidor (un parámetro `favorito`) sería más coherente, pero implica cambiar código suyo.
3. **El estado vacío tiene que unificarse.** Hoy el suyo asume que no hay favoritos, y con tu búsqueda activa ese mensaje sería engañoso. Habría que definir una prioridad entre "Todavía no hay clientes", "Sin resultados" y "Aún no tienes favoritos". Eso toca su código.
4. **La búsqueda puede incluir la nota**, además del nombre, ahora que existe ese campo. Es opcional.

**Qué hacer ahora**
- Avísale qué partes vas a tocar de `clientes.html` y `clientes.js`, y propónle dejar su filtro del lado del cliente. Así dejas de depender de que él tenga nuevos cambios en esos archivos.
- En `servidor.js` tu cambio queda en otra zona (`listarClientes`), así que no debería generar conflicto.

**Aparte, sobre tu acordeón:** el registro `ia/2026-11-07_maldonou_acordeon-ayuda.md` ya está en `main`, pero busqué `[IA]` en `src/ayuda.js`, `src/css/dashboard.css` y `ayuda.html`, tanto en `main` como en tu rama, y no encontré las marcas de inicio y fin. Revisa si las pusiste en otro archivo; si no, falta agregarlas.
```
### Prompt 3
```
Comencemos, dejaremos el filtro al lado del cliente, al final del commit agregare las marcas de [IA] en los archivos que corresponda.
```
### Respuesta 3
```
Partimos. Primero la preparación y luego el commit 1, que es solo el `PLAN.md`.

**Preparación**
1. En la terminal de Ubuntu (o la integrada de VS Code en WSL), corre `git checkout main` y `git pull`. Con `git log --oneline -3` deberías ver arriba "Clientes favoritos y notas".
2. Crea tu rama con `git checkout -b feat/bloque-g-busqueda-filtros`.
3. Levanta `npm run dev` y revisa Clientes: debe aparecer el checkbox "Solo favoritos". Ese es tu punto de partida, y conviene saber cómo se ve antes de tocar nada.
4. Avisa a Victor y a Josemanuel qué archivos vas a tocar. A Victor, `src/api.js`, `src/api/servidor.js`, `src/api/http.js` y el README. A Josemanuel, `clientes.html` y `src/clientes.js`, y que su filtro de favoritos queda como está. Si quieres, te redacto ese mensaje.

**Commit 1: `ia/PLAN.md`**
- En la tabla "Estado de los bloques", agrega una fila G con tu rama y el estado "En curso". El PR queda vacío por ahora.
- En el "Checklist", agrega una sección "G. Búsqueda, filtros y orden" con las tareas del plan, en el mismo formato que usan las otras (`- [ ] **G1.** ...`). Cópiales el estilo mirando cómo están escritas las del bloque A: verbo al inicio y rutas de archivos.
- Marca solo G1 como hecha, porque este commit la cumple.
- Escribe las tareas con tus palabras y no pegues mi texto. Así el texto es tuyo y este commit no necesita registro de IA.
- Revisa con `git status` que el único cambio sea `ia/PLAN.md`, agrégalo por nombre y haz el commit con este mensaje: `Agrega bloque G (búsqueda, filtros y orden) al PLAN`.
- Puedes hacer `git push -u origin feat/bloque-g-busqueda-filtros`, porque los commits periódicos suman en la rúbrica. El Pull Request lo abres al final del bloque.

Cuando lo tengas, dime qué muestra `git log --oneline -3` y seguimos con el commit 2: `clientes.listar` con opciones, en `api.js` y `servidor.js`.
```
### Prompt 4
```
git log muestra el commit Agrega el bloque G... en el head
```
### Respuesta 4
```1. En api.js, deja pasar las opciones
La función 'llamar' ya reenvía todos los argumentos extra a la fuente. Solo falta que 'clientes.listar' reciba un parámetro de opciones, con un objeto vacío como valor por defecto, y se lo pase a 'llamar'. Así 'dashboard.js', que llama a listar sin nada, sigue recibiendo todos los clientes.

2. Lee y valida las opciones en servidor.js
En 'listarClientes' de servidor.js, recibe las opciones también con un objeto vacío por defecto y lee tres cosas: busqueda, estatus y orden. Define tus valores válidos de orden, por ejemplo 'nombre-asc' y 'nombre-desc'. Para estatus reutiliza la constante ESTATUS_CLIENTE que ya existe, y trata el texto vacío como 'sin filtro'. Si llega un estatus u orden que no está en la lista, responde con 'fallo' y el código 400, que ya está en MENSAJES_STATUS.

3. Crea una función para comparar sin tildes
La función 'normalizarTexto' que ya existe solo recorta espacios, así que no sirve para esto. Necesitas una función propia que deje el texto en minúsculas y sin tildes, para que 'sepulveda' encuentre a 'Sepúlveda' y al revés. La técnica es String.prototype.normalize('NFD') seguida de quitar las marcas de tilde; busca ambas en MDN. Aplícala al texto buscado y al texto de cada cliente.

4. Filtra primero y ordena después
Parte de la lista que ya devuelve la función (la copia con conExtras), filtra por búsqueda y por estatus, y recién después ordena. Para el orden usa localeCompare con 'es', para que las tildes y la ñ queden bien. Ordena solo la copia, nunca db.clientes. Sin 'orden' se mantiene el orden original, así nada cambia por defecto. Yo incluiría la nota en la búsqueda, además del nombre, porque se ve bajo cada cliente; tú decides.

5. Sin resultados no es un error
Si ningún cliente coincide, la respuesta sigue siendo ok con un arreglo vacío; no es un 404. El estado vacío es cosa de la vista, que ya lo maneja.

6. Pruébalo desde la consola
Con 'npm run dev' y la sesión iniciada, abre la consola del navegador y corre: const { default: api } = await import('/src/api.js'). Luego llama a await api.clientes.listar({ ... }) con distintas opciones. Prueba: sin opciones (deben ser los mismos 12), busqueda 'carlos' y 'CARLOS', 'sepulveda' y 'sepúlveda', estatus 'Inactivo', un estatus inválido (debe dar 400), orden 'nombre-desc', y una combinación de búsqueda con estatus. Después recarga Dashboard y Clientes para confirmar que siguen igual.

7. Haz el commit
Haz 'git status' y agrega solo src/api.js y src/api/servidor.js. Mensaje sugerido: Acepta búsqueda, filtro por estatus y orden en clientes.listar. Como esta consulta aportó código, en este mismo commit van las marcas [IA] inicio y fin en ambos archivos, el registro en ia/ y la etiqueta [IA] al final del mensaje.

Escribe tú los pasos 1 a 4. Cuando tengas tu versión de listarClientes, pégamela y la reviso antes de probarla en la consola.
```
### Prompt 5
```
```javascript
export async function listarClientes() {
    const { busqueda = '', estatus = '', orden = 'nombre-asc' } = opciones;

    const ordenes_validos = ['nombre-asc', 'nombre desc'];
}
```

no logro completar listarClientes, como valido el estatus y entrego el fallo 400
```
### Respuesta 5
```
Tu idea va bien encaminada, pero la función está incompleta y hay cuatro detalles que corregir antes de seguir.

**Lo que hay que arreglar en lo que escribiste**
1. **Falta el parámetro.** La firma sigue siendo `listarClientes()` y adentro usas `opciones`, que no existe. Debe recibirlo, con un objeto vacío como valor por defecto.
2. **Falta el envoltorio.** La función original devuelve `conSesion(async () => { ... })`. Si lo quitas, pierdes la comprobación de sesión y la latencia simulada. Todo tu código va **dentro** de ese callback, antes de leer `db`.
3. **Typo en el orden.** Escribiste `'nombre desc'` con espacio; debe ser `'nombre-desc'`, igual que el otro valor. Además, el estilo del proyecto es camelCase, así que `ordenesValidos` y no `ordenes_validos`.
4. **El valor por defecto de `orden`.** Con `'nombre-asc'` por defecto, todas las llamadas quedarían ordenadas, incluso las de `dashboard.js`. Para que sin opciones nada cambie, déjalo vacío y que "sin orden" signifique "mantener el orden original".

**Cómo validar y devolver el 400**

El patrón es una condición que dice "si llegó un valor y no está en la lista de permitidos", y en ese caso sales de la función con `fallo`:
- `fallo` recibe primero un mensaje y luego el código: `fallo('tu mensaje', 400)`.
- Para estatus, la lista de permitidos es `ESTATUS_CLIENTE`, que ya existe arriba en el archivo. El "si llegó un valor" importa: como vacío significa "sin filtro", la condición debe ignorar el texto vacío y solo mirar cuando haya algo.
- Para orden es la misma idea, con tu lista `ordenesValidos`.

El `return fallo(...)` va dentro del callback de `conSesion`, y como `conSesion` devuelve lo que devuelva ese callback, la respuesta de error llega tal cual a la vista. Solo tienes que escribir un mensaje en español que diga qué valor no es válido; por ejemplo, mencionando los que sí se aceptan.

Corrige esos puntos, escribe las dos validaciones y pégame la versión nueva. Con eso vemos la parte de filtrar y ordenar.
```
### Prompt 6
```
```javascript
export async function listarClientes() {
   return conSesion(async () => {
    const { busqueda = '', estatus = '', orden = 'nombre-asc' } = opciones;
    const ordenesValidos = ['nombre-asc', 'nombre-desc'];
   
    if(estatus && !ESTATUS_CLIENTE.includes(estatus)) {
        return fallo('Estatus inválido.', 400);
    }
    if(orden && !ordenesValidos.includes(orden)) {
        return fallo('Orden inválido.', 400);
    }
//[IA] inicio · ia/2026-11-maldonou-ordenes-filtros.md
    const db = await inicializarDb();
    let clientesFiltrados = db.clientes;

   });
//[IA] fin

}
```
```
### Respuesta 6
```
Las dos validaciones están bien: se leen en el orden correcto, antes de tocar `db`, y la lógica de `estatus && !ESTATUS_CLIENTE.includes(estatus)` es la que buscábamos. Quedan cuatro correcciones y lo que falta de la función.

**Correcciones**
1. **La firma sigue sin el parámetro.** Es `listarClientes()` y adentro usas `opciones`, que no existe, así que fallaría con un `ReferenceError`. Agrégalo, con un objeto vacío como valor por defecto.
2. **El orden por defecto sigue siendo `'nombre-asc'`.** Con eso, todas las llamadas quedan ordenadas, incluida la de `dashboard.js`. Déjalo como texto vacío, y entonces tu validación `orden && ...` ya lo deja pasar.
3. **`let clientesFiltrados = db.clientes` trae un problema.** Es una referencia a los datos guardados, no una copia, y pierde el `conExtras` que agregó Josemanuel (`favorito` y `nota`). Si luego ordenas esa lista, reordenas la base en memoria. Parte de lo mismo que devolvía la función original: `clonar(db.clientes).map(conExtras)`.
4. **La marca `[IA]` está mal ubicada.** El `//[IA] fin` quedó afuera del bloque, y el nombre del registro no coincide con el formato del enunciado, que es `AAAA-MM-DD_usuario_tema.md`. Escribe `// [IA] inicio · ia/<nombre exacto del archivo>`, con un espacio después de `//` y el mismo nombre que le pongas al archivo en `ia/`. Las marcas envuelven el código completo que agregues, dentro de la función.

Un detalle de estilo: el resto del proyecto no usa punto y coma y usa 4 espacios de indentación, así que conviene igualarlo.

**Lo que falta**

Mientras la función no devuelva un `ok(...)`, Clientes y Dashboard no van a cargar, así que prueba solo cuando esté completa. Faltan, en este orden:
1. La función de comparación sin tildes, **fuera** de `listarClientes`, junto a `normalizarTexto`.
2. Filtrar por búsqueda, solo si el texto no queda vacío después de recortar y normalizar. Sobre nombre y nota, si decides incluirla.
3. Filtrar por estatus, solo si viene con valor.
4. Ordenar, solo si hay `orden`, con `localeCompare` y la opción `'es'`. Para `'nombre-desc'` usa el mismo comparador invirtiendo el sentido.
5. Devolver el resultado con `ok(...)`.

Escribe esos cinco pasos y pégame la función completa.
```
### Prompt 7
```
puedes darme la funcion de comparacion sin tildes
```
### Respuesta 7
```
Sí, es una función corta y sirve tal cual en tu proyecto. Va en `servidor.js`, justo debajo de `normalizarTexto`, que es la que ya existe y recorta los espacios:

```javascript
function paraComparar(valor) {
    return normalizarTexto(valor)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}
```

Cómo funciona, para que puedas explicarla:
- `normalizarTexto` ya convierte a texto, maneja `null` y recorta espacios, así que se reutiliza como primer paso.
- `normalize('NFD')` separa cada letra con tilde en dos partes: la letra base y la marca de la tilde. Por ejemplo, `ú` queda como `u` más la marca.
- El `replace` con el rango `\u0300-\u036f` borra esas marcas, y `toLowerCase()` pasa todo a minúsculas.
- El resultado: `paraComparar('Sepúlveda')` da `'sepulveda'`. La `ñ` también pierde su marca, así que `Nuñez` se encuentra buscando `nunez`, que en una búsqueda suele ser lo deseado.

En `listarClientes` la aplicas **al texto buscado una sola vez**, antes de recorrer los clientes, y **a cada campo del cliente** (el nombre, y la nota si la incluyes) dentro del filtro. Ambos lados tienen que pasar por la misma función, si no la comparación falla.

Antes de seguir:
- Esta función vino de mi respuesta, así que va envuelta en las marcas `[IA] inicio` y `[IA] fin` y aparece en el registro de este commit.
- Prueba rápido desde la consola del navegador cuando tengas la función completa: buscar `sepulveda` y `sepúlveda` debe devolver al mismo cliente.

Pégame `listarClientes` completa cuando la tengas, con el filtro por búsqueda, el de estatus, el orden y el `ok(...)` final.
```
### Prompt 8
``````javascript
export async function listarClientes(opciones = {}) {
   return conSesion(async () => {
    const { busqueda = '', estatus = '', orden = 'nombre-asc' } = opciones
    const ordenesValidos = ['nombre-asc', 'nombre-desc']
   
    if(estatus && !ESTATUS_CLIENTE.includes(estatus)) {
        return fallo('Estatus inválido.', 400)
    }
    if(orden && !ordenesValidos.includes(orden)) {
        return fallo('Orden inválido.', 400)
    }
    const db = await inicializarDb()
    let clientes = clonar(db.clientes).map(conExtras) // [IA]

    const busquedaNormalizada = normalizarSinTildes(busqueda)
    if (busquedaNormalizada){
        clientes = clientes.filter((cliente) => {
            const nombreValido = normalizarSinTildes(cliente.nombre)
            const notaValida = normalizarSinTildes(cliente.nota)
            return nombreValido.includes(busquedaNormalizada) || notaValida.includes(busquedaNormalizada)
        })
    }

    if (estatus) {
        clientes = clientes.filter((cliente) => mismoTexto(cliente.estatus, estatus))
    }

    if (orden === 'nombre-asc') {
        clientes.sort((a, b) => normalizarSinTildes(a.nombre).localeCompare(normalizarSinTildes(b.nombre)))
    } else if (orden === 'nombre-desc') {
        clientes.sort((a, b) => normalizarSinTildes(b.nombre).localeCompare(normalizarSinTildes(a.nombre)))
    }
    return ok(clientes)
   })
}
```

```
### Respuesta 8
```
Está muy bien armada: las validaciones van antes de tocar `db`, partes de `clonar(...).map(conExtras)`, buscas por nombre y nota, y terminas con `ok(clientes)`. Además reutilizaste `mismoTexto`, que ya existía en el archivo. Quedan unos ajustes.

**Ajustes**
1. **El orden por defecto sigue en `'nombre-asc'`.** Con eso, cualquier llamada sin opciones, como la de `dashboard.js`, recibe los clientes ordenados. Déjalo como `''`: tu `if (orden === ...)` ya no ordena cuando viene vacío. El orden inicial que ve el usuario lo decide el `select` de la vista, no la API.
2. **`localeCompare` sin idioma.** Sin `'es'` usa el idioma del navegador de cada persona, y el resultado puede cambiar de un computador a otro. Con `'es'` explícito, la ñ y las tildes se ordenan siempre igual. Y como `localeCompare` ya maneja tildes, no hace falta pasar los nombres por `normalizarSinTildes` al ordenar: compara los nombres directamente.
3. **Las dos líneas de `sort` repiten lo mismo.** Funciona, pero puedes escribir un solo comparador e invertirlo para `'nombre-desc'`.
4. **`normalizarSinTildes`:** le cambiaste el nombre a mi `paraComparar`, y está bien. Solo confirma que la función existe con ese nombre en el archivo, porque no la pegaste.
5. **Estilo:** `if (` con espacio, y la misma sangría de 4 espacios en toda la función, como el resto del archivo.

Tu validación de estatus es sensible a mayúsculas (`'activo'` da 400), pero el filtro con `mismoTexto` no. No es un problema, porque el `select` enviará valores exactos.

**Antes de probar**
- Comprueba que `clientes.listar` en `api.js` ya recibe `opciones` y se las pasa a `llamar`. Si no, en la consola los filtros parecerán no hacer nada.
- Pruebas clave: sin opciones, `sepulveda` y `sepúlveda`, `'Inactivo'`, un estatus inválido (400) y `'nombre-desc'`. Después recarga Dashboard y Clientes.

**Commit:** cuando todo funcione, agrega solo `src/api.js` y `src/api/servidor.js`, con el registro y las marcas. Las marcas son un par, `// [IA] inicio · ia/<nombre exacto del registro>` y `// [IA] fin`, alrededor del código asistido, que incluye `normalizarSinTildes` y la función `listarClientes`. Un `// [IA]` suelto al final de una línea no cumple el formato. Pon `[IA]` al final del mensaje del commit.

Cuéntame cómo salen las pruebas y pasamos a Ventas, que sigue el mismo patrón con la diferencia de que cruza con los nombres de clientes.
```
### Prompt 9
```
no me queda claro como arreglar lo del idioma en el orden, puedes darme las lineas de la condicion if
```
### Respuesta 9
```
Cambian solo las dos líneas del `sort`. El idioma va como **segundo argumento** de `localeCompare`, y los nombres se comparan directamente, sin pasarlos por `normalizarSinTildes`:

```javascript
if (orden === 'nombre-asc') {
    clientes.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
} else if (orden === 'nombre-desc') {
    clientes.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'))
}
```

- `a.nombre.localeCompare(b.nombre, 'es')` compara los dos nombres usando las reglas del español. `'es'` es el idioma, y con eso la ñ y las tildes se ordenan igual en cualquier computador.
- Para el orden descendente solo se intercambian `a` y `b`, así que el comparador es el mismo.
- `normalizarSinTildes` queda solo para la búsqueda, que es donde sí se necesita.

Estas líneas salieron de mi respuesta, así que van dentro del par de marcas `[IA]` junto con el resto del código asistido.
```
### Prompt 10
```
como hago las comprobaciones previas al commit
```
### Respuesta 10
```
1. Revisa tus dos archivos
Abre api.js y confirma que clientes.listar recibe 'opciones' (con {} por defecto) y se las pasa a 'llamar'. Revisa también que en servidor.js el orden por defecto ahora sea '' y los dos sort lleven 'es'. Si api.js no pasa las opciones, en la consola los filtros parecerán no hacer nada.

2. Prepara la consola
Con 'npm run dev' corriendo y la sesión iniciada, abre la consola del navegador (F12) en cualquier página de la app y corre: const { default: api } = await import('/src/api.js'). Cada llamada tarda entre 300 y 800 ms, es normal.

3. Prueba búsqueda y sin opciones
Corre estas y compara con lo esperado. Sin opciones: (await api.clientes.listar()).data.length debe coincidir con los clientes que ves en la tabla (12 si no has creado ni borrado). Con búsqueda: (await api.clientes.listar({ busqueda: 'carlos' })).data.map(c => c.nombre) debe dar Carlos Leoui, y con 'CARLOS' lo mismo. Con tilde: 'sepulveda' y 'sepúlveda' deben dar el mismo cliente.

4. Prueba filtro por estatus, orden y combinaciones
Estatus: con { estatus: 'Inactivo' } corre .data.every(c => c.estatus === 'Inactivo'), que debe dar true. Orden: con { orden: 'nombre-asc' } y luego 'nombre-desc', compara los nombres con map; el segundo debe ser el inverso del primero. Combinación: { busqueda: 'a', estatus: 'Activo', orden: 'nombre-asc' } debe cumplir las tres condiciones a la vez.

5. Prueba los casos de error y sin resultados
Estatus inválido: { estatus: 'Foo' } debe devolver ok false y status 400. Orden inválido: { orden: 'zzz' } igual, con 400. Sin coincidencias: { busqueda: 'zzzz' } debe devolver ok true y data como arreglo vacío, no un error.

6. Comprueba que nada se rompió
Recarga Dashboard, Clientes y Ventas. Todos deben cargar igual que antes, con la consola sin errores rojos. En Clientes, edita un cliente y marca un favorito para confirmar que lo de Josemanuel sigue funcionando. Luego corre 'npm run build': el PLAN pide que siga pasando.

7. Revísalo todo y haz el commit
Haz 'git status' y 'git diff'. Debe cambiar solo src/api.js y src/api/servidor.js, más tu registro en ia/ y la fila en ia/README.md. Busca restos de depuración (console.log, código comentado). Verifica que las marcas [IA] inicio y fin rodeen tu código y que la ruta que nombran sea exactamente el archivo del registro. Luego 'git add' con esos cuatro archivos por nombre y haz el commit con el mensaje 'Acepta búsqueda, filtro por estatus y orden en clientes.listar [IA]'.

Lo más importante es que la consola te dé exactamente lo esperado en los casos de error: un estatus u orden inválido debe responder 400, y una búsqueda sin coincidencias debe responder ok con una lista vacía. Si esos dos se comportan así, el resto del commit suele salir sin sorpresas.

Si alguna prueba no da lo esperado, pégame la llamada que hiciste y lo que devolvió, y lo revisamos antes de commitear.
```
### Prompt 11
```
[Captura de pantalla de eror de consola]
```
### Respuesta 11
```
Ese error significa que la consola no conoce la variable `api`. La línea de importación no se ejecutó antes, o se ejecutó y la página se recargó después. Las variables de la consola se pierden al recargar o al cambiar de página.

1. En la consola, con la sesión iniciada y sin recargar, corre primero solo esta línea y pulsa Enter:
   `const { default: api } = await import('/src/api.js')`
2. Debería responder `undefined`, sin error. Entonces ya puedes correr `(await api.clientes.listar()).data.length` y las demás.
3. Si navegas a otra página de la app, por ejemplo con el menú, o recargas, repite el paso 1.
4. Si al repetirlo aparece `Identifier 'api' has already been declared`, recarga la página y corre la línea una sola vez.

Si el paso 1 mismo da un error, pégame lo que dice.
```
### Prompt 12
```
Todo esta en orden, hagamos el commit paso a paso para no perder archivos y debo hacer el registro de ia
```
### Respuesta 12
```
Dejé el registro armado en `2026-11-11_maldonou_busqueda-filtros-clientes-api.md`, con la misma estructura del anterior. La sección de la conversación queda vacía a propósito, porque tiene que ser tu copia literal, y en su nota de contexto indica desde qué mensaje empieza. Léelo antes de commitear: "Qué se incorporó" y "Verificación" describen lo que me contaste, y si algo no lo hiciste, bórralo.

**Una corrección al paso 5:** el comando de verificación debe llevar `-F`: `git grep -nF "[IA]" src/api.js src/api/servidor.js`. Sin esa opción, `[IA]` se interpreta como una expresión regular y devuelve casi todas las líneas del archivo.

**Dos hallazgos que conviene tener presentes**
- En `ia/README.md` de `main` no existe la fila del acordeón, aunque su registro sí está. Por eso el paso 2 es un commit aparte, para no mezclarlo con el de la API.
- La marca que tenías puesta apuntaba a `ia/2026-11-maldonou-ordenes-filtros.md`, que no coincide con ningún archivo. Si una marca nombra un registro que no existe, es lo mismo que no haberla puesto.

Cuando termines el push, avísame con lo que muestra `git show --stat HEAD`. El siguiente es el commit 3, `ventas.listar` con las mismas opciones, más la búsqueda por nombre de cliente.
```

## Qué se incorporó al proyecto

- **Decisiones de diseño:** el filtrado y el orden se hacen en el servidor simulado y no en la vista, para que la capa de servicios se parezca a una API real. El filtro "Solo favoritos" de Josemanuel se dejó del lado del cliente, tal como estaba.
- **`clientes.listar` en `src/api.js`:** recibe un objeto de opciones y lo pasa a la fuente. Sin opciones devuelve todos los clientes, como antes.
- **`listarClientes` en `src/api/servidor.js`:** el integrante escribió la validación de estatus y de orden (error 400), el filtro por búsqueda sobre nombre y nota, el filtro por estatus y el orden. La IA propuso la estructura, revisó el código y señaló correcciones (parámetro `opciones` faltante, uso de `conSesion`, orden por defecto, partir de `clonar(db.clientes).map(conExtras)`).
- **Código tomado de la IA:** la función de comparación sin tildes (`normalizarSinTildes`, basada en una función que propuso la IA con otro nombre) y las dos líneas de `sort` con `localeCompare(..., 'es')`.
- **Reutilizado del proyecto:** `mismoTexto`, `ESTATUS_CLIENTE`, `conSesion`, `fallo`, `ok` y `conExtras`.
- **Descartado:** filtrar solo en la vista, y dejar `'nombre-asc'` como orden por defecto de la API (se dejó vacío para no cambiar las llamadas existentes, como la de Dashboard).

## Verificación

- Se probó desde la consola del navegador, con la sesión iniciada y sin opciones: devuelve los mismos clientes que muestra la tabla.
- Búsqueda: `carlos` y `CARLOS` dan el mismo resultado, y `sepulveda` y `sepúlveda` encuentran al mismo cliente.
- Filtro por estatus `Inactivo`: devuelve solo clientes inactivos.
- Orden: `nombre-desc` devuelve la lista inversa de `nombre-asc`.
- Combinación de búsqueda, estatus y orden: se cumplen las tres condiciones a la vez.
- Casos de error: un estatus o un orden inválido responde con status 400.
- Sin coincidencias: la respuesta es `ok` con una lista vacía, no un error.
- Se recargaron Dashboard, Clientes y Ventas: cargan igual que antes y la consola no muestra errores. En Clientes se comprobó que editar y marcar favoritos sigue funcionando.
- El funcionamiento es este: la vista pasa un objeto de opciones a `api.clientes.listar`, que lo reenvía a la fuente. `listarClientes` valida las opciones, parte de una copia de los clientes con `favorito` y `nota`, filtra por texto (sin importar mayúsculas ni tildes) y por estatus, ordena con `localeCompare` en español y responde con el mismo formato `{ ok, status, data, error }` que el resto de la API.
