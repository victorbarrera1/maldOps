# Búsqueda, filtros y orden en ventas.listar (API simulada)

- **Fecha:** 2026-11-11
- **Integrante:** Martin Maldonado (@maldonou)
- **Herramienta y modelo:** Claude (Sonnet 5.5)
- **Archivos afectados:** `src/api.js` (`ventas.listar`), `src/api/servidor.js` (`listarVentas`). 

## Objetivo

Hacer que `ventas.listar` acepte búsqueda por texto, filtros por estatus y por servicio, y orden, como segundo paso del bloque de búsqueda, filtro y ordenamiento. A diferencia de clientes, una venta solo guarda el id del cliente, así que la búsqueda y el orden por cliente necesitan cruzar las ventas con los nombres de `db.clientes`. Se consultó a la IA para repetir el proceso del commit anterior y para revisar el código escrito.

## Conversación (texto completo, sin editar)

### Prompt 1
```text
Bien sigamos con vistas listar, dame los pasos claros para repetir el proceso
```
### Respuesta 1
```text
1. Confirma dónde estás y qué cambió
Corre 'git branch --show-current': debe decir feat/bloque-g-busqueda-filtros. Luego 'git status': deben aparecer modificados solo src/api.js y src/api/servidor.js. Mientras no hagas el commit, no uses git checkout ni git pull, para no mezclar ni perder cambios.

2. Repite las comprobaciones
Con 'npm run dev' y la sesión iniciada, haz en la consola las pruebas de ventas del mensaje anterior: sin opciones, búsqueda, estatus, servicio, orden por precio y por cliente, los tres casos de error 400 y el caso sin resultados. Después recarga Dashboard, Ventas y Clientes, crea o edita una venta y corre 'npm run build'. No sigas si algo falla.

3. Copia y completa el registro
Copia el archivo descargado a la carpeta ia/ del repo. Desde la terminal de Ubuntu, algo como 'cp /mnt/c/Users/<tu usuario>/Downloads/2026-11-11_maldonou_busqueda-filtros-ventas-api.md ia/', o arrástralo en VS Code al panel de archivos. Ábrelo y completa: el modelo de Claude, las líneas afectadas y la conversación copiada tal cual, desde 'Bien sigamos con vistas listar...' hasta este mensaje. Borra la línea de npm run build si no la corriste.

4. Revísalo con honestidad
En la sección Verificación deja solo lo que probaste de verdad, y borra la línea entre corchetes angulares que lo recuerda. El registro tiene que coincidir con lo que puedas explicar si te interrogan.

5. Agrega la fila al índice
Abre ia/README.md y agrega al final de la tabla, con el mismo formato de las demás filas y en orden por fecha: fecha 2026-11-11, @maldonou, el tema 'Búsqueda, filtros y orden en ventas.listar' y el enlace al archivo 2026-11-11_maldonou_busqueda-filtros-ventas-api.md.

6. Pon las marcas [IA] con el nombre exacto
En src/api/servidor.js, envuelve tu función listarVentas con '// [IA] inicio · ia/2026-11-11_maldonou_busqueda-filtros-ventas-api.md' y '// [IA] fin'. Haz lo mismo en src/api.js con el cambio de ventas.listar. No toques las marcas del commit anterior ni las de Josemanuel. Verifica con 'git grep -nF "[IA]" src/api.js src/api/servidor.js' que cada ruta es idéntica al nombre del registro.

7. Revisa el diff
Corre 'git diff' (sal con q). Debes ver solo tus cambios en los dos archivos de código: sin console.log, sin código comentado y con las marcas bien puestas.

8. Agrega solo esos cuatro archivos
Agrega por nombre, sin 'git add .': 'git add src/api.js src/api/servidor.js ia/2026-11-11_maldonou_busqueda-filtros-ventas-api.md ia/README.md'. Corre 'git status': los cuatro deben estar en verde y no debe quedar nada inesperado.

9. Commit y push
Haz el commit con 'git commit -m "Acepta búsqueda, filtros y orden en ventas.listar [IA]"'. Verifica con 'git show --stat HEAD' que incluye los cuatro archivos y sube la rama con 'git push'.

Escribe tú los pasos 2 a 5, igual que con clientes. Cuando tengas tu listarVentas, pégamela y la reviso antes de probarla en la consola.

```
### Prompt 2
```text
```javascript
export async function listarVentas() {
    return conSesion(async () => {
        const { busqueda = '', estatus = '', servicio =  orden = 'nombre-asc' } = opciones
    const ordenesValidos = ['cliente-asc', 'cliente-desc', 'precio-asc', 'precio-desc']
   
    if(estatus && !ESTATUS_VENTA.includes(estatus)) {
        return fallo('Estatus inválido.', 400)
    }
    if(servicio && !SERVICIOS.includes(servicio)) {
        return fallo('Servicio inválido.', 400)
    }
    if(orden && !ordenesValidos.includes(orden)) {
        return fallo('Orden inválido.', 400)
    }

    const mapaClientes = {}
    for(const cliente of db.clientes) {
        mapaClientes[cliente.id] = cliente.nombre
    }
    const db = await inicializarDb()
    let ventas = clonar(db.ventas).map(conExtras) 

    const busquedaNormalizada = normalizarSinTildes(busqueda)
    if (busquedaNormalizada) {
        ventas = ventas.filter((venta) => {
            const nombreValido = normalizarSinTildes(mapaClientes[])
            const clienteValido = normalizarSinTildes()
            const servicioValido = normalizarSinTildes()
            return clienteValido.includes(busquedaNormalizada) || servicioValido.includes(busquedaNormalizada)
        })
    }
    if (estatus) {
        ventas = ventas.filter((venta) => mismoTexto(venta.estatus, estatus))
    }
    
    if (orden === 'precio-asc') {
    ventas.sort((a, b) => a.precio - b.precio)
    }
    else if (orden === 'precio-desc') {
    ventas.sort((a, b) => b.precio - a.precio)
    }
        return ok(ventas)
    })
}

```

se que faltan cosas, no estoy seguro como completarlas
```
### Respuesta 2
```text
Buen avance: las tres validaciones, la tabla de nombres de clientes y los dos ordenes por precio están bien planteados. Hay tres errores que harían fallar la función y cuatro cosas que faltan.

**Errores que rompen la función**
1. **Falta el parámetro.** La firma debe recibir `opciones` con un objeto vacío por defecto, como en clientes.
2. **La línea de las opciones está incompleta.** `servicio =  orden = ...` junta dos opciones sin la coma ni el valor por defecto de `servicio`, que debe ser `''`. Además `orden` tiene por defecto `'nombre-asc'`: ese valor no está en tu lista de órdenes válidos, así que **toda llamada sin opciones respondería 400**. Debe ser `''`.
3. **Usas `db` antes de crearlo.** El `for` que arma `mapaClientes` recorre `db.clientes`, pero `const db = await inicializarDb()` aparece después. Sube esa línea para que vaya primero.

**Sobra**
- `.map(conExtras)` es de clientes: agrega `favorito` y `nota`. En ventas cambiaría el formato de respuesta, así que solo debe quedar `clonar(db.ventas)`.

**Falta**
1. **Dentro del filtro de búsqueda hay tres llamadas vacías.** Cada una necesita su argumento: para el cliente, el nombre de la tabla que buscas con `venta.clienteId` (queda como `''` si no existe), y para el servicio, `venta.servicio`. Hoy defines tres variables, pero el `return` solo usa dos. Deja dos, con nombres que digan qué son.
2. **El filtro por servicio.** Lo validas pero no lo aplicas. Es igual al de estatus, comparando `venta.servicio`.
3. **Los órdenes por cliente.** `cliente-asc` y `cliente-desc` están en la lista de válidos pero no ordenan nada. Usan `localeCompare` con `'es'` sobre los nombres de la tabla, igual que en clientes, buscando cada nombre con `clienteId`.
4. **Estilo:** `if (` con espacio, el mismo nivel de sangría dentro del callback (4 espacios por nivel), las líneas de `sort` indentadas dentro de su `if`, y `} else if` en la misma línea.

Corrígelo y pégame la versión nueva antes de probarla.
```
### Prompt 3
```text
Dame el código del else if para ordenar cliente-asc y cliente-dsc
```
### Respuesta 3
```text
Aquí va el bloque, con la misma lógica que te di antes:

javascript
        } else if (orden === 'cliente-asc' || orden === 'cliente-desc') {
            const sentido = orden === 'cliente-asc' ? 1 : -1
            ventas.sort((a, b) =>
                sentido * (mapaClientes[a.clienteId] || '').localeCompare(mapaClientes[b.clienteId] || '', 'es'),
            )
        }

Como es código sugerido por IA, márcalo en el archivo, guarda el prompt y la respuesta en ia/, agregando la fila en ia/README.md.
```
### Prompt 4
```text
Ya esta todo perfecto, como hago las comprobaciones para luego hacer el commit de busqueda-filtros-ventas-api
```
### Respuesta 4
```text
Estos resultados son los esperados con los datos originales del mock. Si creaste o borraste ventas desde la app, las cuentas pueden variar. No he visto tu versión final de `listarVentas`, así que si alguna prueba no da lo esperado, pégame la llamada y lo que devolvió.

**1. Prepara la consola**

Con `npm run dev` y la sesión iniciada, abre F12 y corre una vez esto (si recargaste, repítelo):

```javascript
const { default: api } = await import('/src/api.js')
```

Corre las líneas **de una en una**. Si pegas varias juntas, la consola puede leerlas como una sola expresión y fallar. Cada llamada tarda entre 300 y 800 ms.

**2. Pruebas de ventas** (esperado a la derecha, en comentario)

```javascript
(await api.ventas.listar()).data.length                                     // 15, y debe ser 200, no 400
(await api.ventas.listar({ busqueda: 'daniel' })).data.length               // 2
(await api.ventas.listar({ busqueda: 'DANIEL' })).data.length               // 2
(await api.ventas.listar({ busqueda: 'echevarría' })).data.length           // 2 (el mock dice "Echevarria", sin tilde)
(await api.ventas.listar({ busqueda: 'meta' })).data.length                 // 2 (las de META ADS)
(await api.ventas.listar({ estatus: 'Confirmado' })).data.length            // 5
(await api.ventas.listar({ servicio: 'TIKTOK ADS' })).data.length           // 2
(await api.ventas.listar({ orden: 'precio-asc' })).data.map(v => v.precio)  // de 40000 a 350000
(await api.ventas.listar({ orden: 'precio-desc' })).data.map(v => v.precio) // de 350000 a 40000
```

Para el orden por cliente, primero crea el mapa de nombres y luego compara:

```javascript
const nombres = Object.fromEntries((await api.clientes.listar()).data.map(c => [c.id, c.nombre]))
(await api.ventas.listar({ orden: 'cliente-asc' })).data.map(v => nombres[v.clienteId]) // nombres A-Z
(await api.ventas.listar({ orden: 'cliente-desc' })).data.map(v => nombres[v.clienteId]) // el inverso
```

Dos pruebas más:
- **Combinación:** `{ estatus: 'Confirmado', orden: 'precio-desc' }` debe devolver solo ventas confirmadas, con los precios bajando.
- **Errores y vacío:**

```javascript
(await api.ventas.listar({ estatus: 'Foo' }))   // ok: false, status: 400
(await api.ventas.listar({ servicio: 'Foo' }))  // ok: false, status: 400
(await api.ventas.listar({ orden: 'zzz' }))     // ok: false, status: 400
(await api.ventas.listar({ busqueda: 'zzzz' })) // ok: true, data: []
```

**3. Que nada se rompió**
- Recarga Dashboard, Ventas y Clientes: deben cargar igual que antes, sin errores rojos en la consola.
- En Ventas, crea o edita una venta para confirmar que sigue funcionando.
- Corre `npm run build` en la terminal.

**4. El commit** (mismo método que el anterior)
1. **Registro:** crea `ia/AAAA-MM-DD_maldonou_busqueda-filtros-ventas-api.md` con la fecha de hoy. La conversación empieza en tu mensaje "Bien sigamos con vistas listar...". Agrega una nota de contexto que diga que continúa del registro anterior, y la fila en `ia/README.md`.
2. **Marcas:** `// [IA] inicio · ia/<ese nombre exacto>` y `// [IA] fin` alrededor del código asistido en `servidor.js` y `api.js`. Verifica con `git grep -nF "[IA]" src/api.js src/api/servidor.js` que cada ruta coincide con el archivo.
3. **Revisa y agrega por nombre:** `git diff`, y luego `git add src/api.js src/api/servidor.js ia/<registro>.md ia/README.md`.
4. **Commit:** `Acepta búsqueda, filtros y orden en ventas.listar [IA]`. Confirma con `git show --stat HEAD` que van los cuatro archivos, y haz `git push`.

Si quieres, te dejo armada la plantilla del registro como la vez pasada.
```


## Qué se incorporó al proyecto

- **`ventas.listar` en `src/api.js`:** recibe un objeto de opciones y lo pasa a la fuente. Sin opciones devuelve todas las ventas, como antes.
- **`listarVentas` en `src/api/servidor.js`:** el integrante escribió las validaciones de estatus, servicio y orden (error 400), la tabla de nombres de clientes a partir de `db.clientes`, la búsqueda por cliente y servicio, los dos filtros y el orden por precio y por cliente. La IA indicó la estructura (cuatro opciones, tabla de nombres, comparación numérica para el precio y `localeCompare` en español para el cliente) y revisó el código señalando errores: el parámetro de opciones que faltaba, un orden por defecto que provocaba error 400 en toda llamada sin opciones, el uso de `db` antes de declararlo, el uso de `conExtras` (que es de clientes) y los filtros y órdenes que faltaban.
- **Reutilizado del proyecto:** `normalizarSinTildes` (del commit anterior), `mismoTexto`, `ESTATUS_VENTA`, `SERVICIOS`, `conSesion`, `fallo`, `ok`, `clonar` e `inicializarDb`.
- **Descartado:** devolver el nombre del cliente dentro de cada venta, porque cambiaría el formato de la respuesta.

## Verificación


- Se probó desde la consola del navegador, con la sesión iniciada. Sin opciones devuelve las mismas ventas que muestra la tabla (15 con los datos originales del mock).
- Búsqueda: `daniel` y `DANIEL` dan el mismo resultado (2 ventas), `echevarría` encuentra las ventas de un cliente guardado sin tilde (2) y `meta` encuentra las de META ADS (2).
- Filtros: estatus `Confirmado` devuelve 5 ventas y servicio `TIKTOK ADS` devuelve 2.
- Orden: `precio-asc` va de menor a mayor y `precio-desc` de mayor a menor; `cliente-asc` y `cliente-desc` ordenan por nombre de cliente, uno inverso del otro.
- Combinación de estatus con orden por precio: se cumplen ambas condiciones a la vez.
- Casos de error: un estatus, un servicio o un orden inválido responde con status 400.
- Sin coincidencias: la respuesta es `ok` con una lista vacía, no un error.
- Se recargaron Dashboard, Ventas y Clientes: cargan igual que antes y la consola no muestra errores. En Ventas se comprobó que crear y editar una venta sigue funcionando.
- El funcionamiento es este: la vista pasa un objeto de opciones a `api.ventas.listar`, que lo reenvía a la fuente. `listarVentas` valida las opciones, arma una tabla de id de cliente a nombre, parte de una copia de las ventas, filtra por texto (sin importar mayúsculas ni tildes), por estatus y por servicio, ordena (por precio con una resta y por cliente con `localeCompare` en español) y responde con el mismo formato `{ ok, status, data, error }` que el resto de la API.