# Datos simulados (API) en el README (V5)

- **Fecha:** 2026-10-29
- **Integrante:** Victor Barrera (@victorbarrera1)
- **Archivos afectados:** `README.md` y este registro

## Objetivo

Documentar en el README el contrato de la capa de datos simulada: modelos de usuarios, clientes, ventas y preguntas; endpoints, formato de respuesta e identificadores, sin implementar todavía `js/api.js` ni los mocks.

## Conversación (texto completo, sin editar)

### Prompt 1

```text
TAREA V5 — README: sección "Datos simulados (API)"
Rama: docs/datos-simulados-api · Commit: "docs(readme): sección Datos simulados (API)" · slug: datos-simulados-api
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
```

### Respuesta 1

```text
Listo. V5 documentada y verificada en `docs/datos-simulados-api`.

**Qué quedó**
- Sección `## Datos simulados (API)` al final de `README.md`, sin modificar el resto.
- Modelos de usuarios, clientes, ventas y preguntas con tablas Campo | Tipo | Obligatorio | Descripción y un JSON de ejemplo por recurso.
- Contrato de respuesta `{ ok, status, data, error }`, funciones `async` con latencia simulada y ejemplos 200, 201 y 404.
- Tabla de los 10 endpoints solicitados, con método, ruta y códigos exactos; `simularFallo` queda como utilidad y sin parámetros porque `js/api.js` no existe.
- Convención de ids `u-001…u-004`, `cli-001…cli-012`, y `ven-001…`/`preg-001…` marcadas "Propuesto — por confirmar con Josemanuel"; regla de integridad de `ventas.clienteId`.
- No había `mocks/*.json` ni `js/api.js` en `main`: no hubo exports que contrastar ni mocks que contradijeran el contrato. El archivo trackeado es `README.md` (mayúsculas), no `readme.md`.

**Verificación**
- a) 10/10 nombres exactos, sin funciones inventadas; tabla de endpoints 10 filas × 5 columnas; códigos usados: 200, 201, 400, 401, 404, 500.
- b) 7/7 bloques JSON parsean; ids `cli-*` y `u-*` cumplen sus regex; `ven-001` y `preg-001` son válidos.
- c) La venta de ejemplo usa `cli-005`, el mismo id del cliente de ejemplo; clientes, ventas y preguntas usan los campos de las tablas/formularios existentes. `rol` queda marcado como propuesto.
- d) `git diff --unified=0 main -- README.md`: 178 líneas agregadas, 0 eliminadas.

Separé en 2 commits para que se vea el desarrollo: el registro IA y la sección del README; el HEAD es `docs(readme): sección Datos simulados (API)`. Rama `docs/datos-simulados-api`, PR abierto sin merge.

Recordatorio: V1–V4 deben estar mergeados en `main` antes de avisar a Josemanuel y Martin; después, `git pull origin main`.
```

## Qué se incorporó

- Sección nueva `## Datos simulados (API)` al final de `README.md`; el contenido anterior quedó intacto.
- Modelo de usuarios (`id`, `nombre`, `correo`, `contrasena`, `rol`), clientes (`id`, `nombre`, `estatus`), ventas (`id`, `clienteId`, `precio`, `servicio`, `estatus`) y preguntas (`id`, `pregunta`, `respuesta`), cada uno con su tabla Campo | Tipo | Obligatorio | Descripción y un registro JSON de ejemplo.
- Nota explícita de que `contrasena` nunca se devuelve en `iniciarSesion`; `ventas.clienteId` referencia a `clientes`.
- Tabla de 10 endpoints con los nombres, métodos, rutas y códigos exactos pedidos; `simularFallo` documentado como utilidad y sin parámetros porque `js/api.js` no existe.
- Significado de `400`, `401`, `404` y `500` debajo de la tabla.
- Formato uniforme `{ ok, status, data, error }`, reglas de `ok`/`data`/`error`, mención de `async` con latencia simulada y ejemplos 200 (lista), 201 (creación) y 404.
- Convención de ids: `u-001…u-004`, `cli-001…cli-012`, `ven-001…` y `preg-001…`; estas dos últimas marcadas "Propuesto — por confirmar con Josemanuel". Regla de integridad de `ventas.clienteId` contra `cli-001…cli-012`.
- Notas de contexto: no existen `mocks/*.json` ni `js/api.js` en `main`; el archivo del repo es `README.md` (mayúsculas); `rol` se propone porque no aparece en los formularios; `CONFIRMADO` se normaliza a `Confirmado`.

## Verificación

| Check | Comando | Resultado |
|---|---|---|
| a. Funciones | `node /private/var/folders/1n/wypy1b2j35gfv909xzvfj4zh0000gn/T/opencode/v5-verify.mjs` | 10/10 nombres exactos; 0 funciones inventadas. |
| a. Tabla de endpoints | mismo script | 10/10 filas y 5/5 columnas en cada una. |
| a. Códigos | mismo script | Solo 200, 201, 400, 401, 404 y 500. |
| b. JSON | mismo script | 7/7 bloques parsean con `JSON.parse`. |
| b. Ids | mismo script | `cli-005`, `cli-003`, `cli-012` cumplen `/^cli-0(0[1-9]|1[0-2])$/`; `u-001` cumple `/^u-00[1-4]$/`; `ven-001` y `preg-001` cumplen su formato propuesto. |
| c. Coherencia | mismo script | `ventas.clienteId = cli-005` coincide con el cliente de ejemplo; no hay mocks que contradigan los campos. |
| d. Diff | `git diff --unified=0 main -- README.md` | 178 líneas agregadas, 0 eliminadas. |
| d. Alcance | `git diff --name-only main` | Solo `README.md` y este registro. |

Nota: el archivo trackeado es `README.md` (mayúsculas), no `readme.md`; `git diff main -- readme.md` no devuelve cambios por la sensibilidad a mayúsculas de Git. La verificación se hizo sobre `README.md`.
