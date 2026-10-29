# MaldOps

MaldOps es una plataforma web para gestionar campañas publicitarias. Su enfoque es el marketing digital: permite optimizar y administrar campañas en distintas plataformas.

Centraliza los principales servicios de publicidad en internet —Meta Ads (Facebook e Instagram), Google Ads (YouTube y Google Search), TikTok Ads y LinkedIn Ads— y permite analizar el rendimiento de las campañas para mejorarlas.

## Integrantes

- Victor Barrera
- Josemanuel Rodríguez
- Martin Maldonado

## Tecnologías

- HTML5 y CSS3
- JavaScript (módulos ES)
- [Vite](https://vite.dev/)
- [Ionicons](https://ionic.io/ionicons) (vía CDN)

## Requisitos

- Node.js 20.19+ o 22.12+ (incluye npm). Vite 8 no funciona con Node 18. Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org/).
- Un navegador moderno: Chrome, Firefox, Safari o Edge.
- Conexión a internet para cargar los iconos desde el CDN.

Para comprobar las versiones instaladas:

```bash
node -v
npm -v
```

## Cómo ejecutar MaldOps localmente

1. Clonar el repositorio:

```bash
git clone https://github.com/victorbarrera1/maldOps.git
cd maldOps
```

2. Instalar las dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir [http://localhost:5173/](http://localhost:5173/) en el navegador.

La terminal mostrará un mensaje como este:

```text
  VITE v8.3.0  ready in 225 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

> **Importante:** entra por `http://localhost:5173/`; no abras los archivos `.html` con doble clic. Con `file://` el navegador bloquea los módulos JavaScript.

El login es simulado: puedes entrar con cualquier usuario y contraseña.

## Datos simulados (API)

Contrato de la capa de datos simulada de MaldOps. Los campos se dedujeron de los formularios de `index.html` y `registro.html`, de las columnas de `clientes.html` y `ventas.html`, y de las preguntas de `ayuda.html`. Al cierre de esta entrega `js/api.js` y `mocks/*.json` todavía no existen; esta sección define los nombres, campos, respuestas e identificadores que debe implementar el equipo.

### Modelo de datos

#### Usuarios

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador con formato `u-001`…`u-004`. |
| `nombre` | string | Sí | Nombre de usuario que se escribe en el login y el registro. |
| `correo` | string | Sí | Correo electrónico del registro. |
| `contrasena` | string | Sí | Contraseña de demostración. Nunca se devuelve en `iniciarSesion`. |
| `rol` | string | No | Rol de acceso: `admin` o `vendedor`. Por defecto, `vendedor`. |

```json
{
  "id": "u-001",
  "nombre": "victor",
  "correo": "victor@maldops.cl",
  "contrasena": "********",
  "rol": "admin"
}
```

En el ejemplo la contraseña está redactada; en los mocks se usa una credencial de demostración y `iniciarSesion` la omite en la respuesta. `rol` no aparece en los formularios actuales; se propone `vendedor` por defecto.

#### Clientes

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador con formato `cli-001`…`cli-012`. |
| `nombre` | string | Sí | Nombre del cliente. |
| `estatus` | string | Sí | `Activo` o `Inactivo`. Por defecto, `Activo`. |

```json
{
  "id": "cli-005",
  "nombre": "Daniel Ayala",
  "estatus": "Activo"
}
```

#### Ventas

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador con formato `ven-001` en adelante (propuesto). |
| `clienteId` | string | Sí | Debe existir en `clientes` (`cli-001`…`cli-012`). |
| `precio` | number | Sí | Monto en pesos chilenos (CLP), sin separadores. |
| `servicio` | string | Sí | Servicio vendido: `META ADS`, `TIKTOK ADS`, `WHATSAPP ADS`, `GOOGLE ADS`, `YOUTUBE ADS`, `LINKEDIN ADS` o `REELS ADS`. |
| `estatus` | string | Sí | `Pendiente`, `En Progreso`, `Devuelto` o `Confirmado`. |

```json
{
  "id": "ven-001",
  "clienteId": "cli-005",
  "precio": 50000,
  "servicio": "META ADS",
  "estatus": "Pendiente"
}
```

La tabla de ventas muestra `CONFIRMADO`; el contrato normaliza ese valor a `Confirmado`.

#### Preguntas

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador con formato `preg-001` en adelante (propuesto). |
| `pregunta` | string | Sí | Texto de la pregunta frecuente. |
| `respuesta` | string | Sí | Respuesta asociada. |

```json
{
  "id": "preg-001",
  "pregunta": "¿Cómo creo una campaña?",
  "respuesta": "Dirígete a la sección \"Campaña\" y sigue los pasos para crear una."
}
```

### Endpoints simulados

| Función | Método | Ruta equivalente | Descripción | Códigos |
|---|---|---|---|---|
| `iniciarSesion` | POST | `/api/auth/login` | Valida credenciales y devuelve el usuario sin `contrasena`. | 200, 400, 401, 500 |
| `listarClientes` | GET | `/api/clientes` | Devuelve todos los clientes. | 200, 401, 500 |
| `obtenerCliente` | GET | `/api/clientes/:id` | Devuelve un cliente por su id. | 200, 401, 404, 500 |
| `crearCliente` | POST | `/api/clientes` | Crea un cliente y devuelve el registro creado. | 201, 400, 401, 500 |
| `actualizarCliente` | PUT | `/api/clientes/:id` | Actualiza un cliente existente. | 200, 400, 401, 404, 500 |
| `eliminarCliente` | DELETE | `/api/clientes/:id` | Elimina un cliente existente. | 200, 401, 404, 500 |
| `listarVentas` | GET | `/api/ventas` | Devuelve todas las ventas. | 200, 401, 500 |
| `obtenerVentasDeCliente` | GET | `/api/clientes/:id/ventas` | Devuelve las ventas de un cliente. | 200, 401, 404, 500 |
| `listarPreguntas` | GET | `/api/preguntas` | Devuelve las preguntas frecuentes. | 200, 401, 500 |
| `simularFallo` | — | — | Utilidad de pruebas: fuerza que la siguiente llamada devuelva un error (500 por defecto). No es un endpoint. | 500 (por defecto) |

`simularFallo` no documenta parámetros porque `js/api.js` todavía no existe; cuando se implemente, sus parámetros deben agregarse aquí.

- `400`: datos inválidos o faltantes.
- `401`: sin sesión o credenciales inválidas.
- `404`: id inexistente.
- `500`: fallo simulado.

### Formato de respuesta

Todas las funciones son `async` y resuelven con el mismo objeto después de una latencia simulada:

| Campo | Tipo | Descripción |
|---|---|---|
| `ok` | boolean | `true` si la operación tuvo éxito; `false` si falló. |
| `status` | number | Código HTTP equivalente de la respuesta. |
| `data` | object, array o null | Datos de la operación cuando `ok` es `true`; `null` cuando falla. |
| `error` | string o null | Mensaje en español cuando `ok` es `false`; `null` cuando hay éxito. |

- `ok: true` implica `data` con valor y `error: null`.
- `ok: false` implica `data: null` y `error` con un mensaje en español.
- `iniciarSesion` devuelve en `data` al usuario sin `contrasena`.

**Ejemplo 200 — lista de clientes**

```json
{
  "ok": true,
  "status": 200,
  "data": [
    {
      "id": "cli-005",
      "nombre": "Daniel Ayala",
      "estatus": "Activo"
    },
    {
      "id": "cli-003",
      "nombre": "Benjamin Huerta",
      "estatus": "Inactivo"
    }
  ],
  "error": null
}
```

**Ejemplo 201 — creación de cliente**

```json
{
  "ok": true,
  "status": 201,
  "data": {
    "id": "cli-012",
    "nombre": "Camila Rojas",
    "estatus": "Activo"
  },
  "error": null
}
```

**Ejemplo 404 — cliente inexistente**

```json
{
  "ok": false,
  "status": 404,
  "data": null,
  "error": "No existe un cliente con ese id."
}
```

### Convención de identificadores

| Recurso | Formato | Estado |
|---|---|---|
| Usuarios | `u-001`…`u-004` | Definido |
| Clientes | `cli-001`…`cli-012` | Definido |
| Ventas | `ven-001`… | Propuesto — por confirmar con Josemanuel |
| Preguntas | `preg-001`… | Propuesto — por confirmar con Josemanuel |

Los identificadores usan tres dígitos con ceros a la izquierda. Todo `ventas.clienteId` debe existir entre `cli-001` y `cli-012`; no se aceptan ventas con un cliente inexistente.
