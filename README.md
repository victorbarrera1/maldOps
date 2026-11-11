# MaldOps

MaldOps es una plataforma web para **gestionar clientes, ventas y campañas de marketing digital**. Centraliza los servicios de publicidad en internet —Meta Ads, Google Ads, YouTube Ads, TikTok Ads, LinkedIn Ads, WhatsApp Ads y Reels Ads— y permite analizar el rendimiento de las campañas desde un dashboard.

Es el proyecto de la **Entrega 2** de Desarrollo Web y Móvil (CIT2008, UDP): un frontend completo que funciona con datos simulados detrás de una capa de datos que imita una API REST. En la Entrega 3 se conecta a un backend real cambiando dos variables de entorno, sin modificar las vistas.

## Integrantes

| Integrante | Usuario de GitHub |
|---|---|
| Victor Barrera | [@victorbarrera1](https://github.com/victorbarrera1) |
| Josemanuel Rodríguez | [@ManoloDeus](https://github.com/ManoloDeus) |
| Martin Maldonado | [@maldonou](https://github.com/maldonou) |

## Tecnologías

| Tecnología | Uso | Cómo se incluye |
|---|---|---|
| HTML5 y CSS3 | Estructura y estilos de las siete vistas | Archivos del repositorio |
| JavaScript (módulos ES) | Lógica de vistas, guard de sesión y capa de datos | Archivos del repositorio |
| [Vite 8](https://vite.dev) | Servidor de desarrollo y build de producción | npm |
| [Tailwind CSS 4](https://tailwindcss.com) | Utilidades y tokens de diseño | npm (`@tailwindcss/vite`) |
| [Alpine.js 3](https://alpinejs.dev) | Estado del menú lateral y reactividad de la interfaz | npm |
| [Ionicons 8](https://ionic.io/ionicons) | Iconos del menú, buscador y métricas | npm (sin CDN) |

No se usa ningún framework de componentes ni router externo: cada vista es un `.html` propio y la navegación es entre páginas.

## Requisitos

- **Node.js 20.19 o superior** (o 22.12+). Comprobar con `node -v`.
- npm (viene con Node).
- Un navegador moderno: Chrome, Firefox, Safari o Edge actualizados.

> **Importante:** la app usa módulos ES y carga los mocks con `fetch`, así que **no funciona abriendo los `.html` con doble clic** (`file://`). Siempre hay que levantarla con `npm run dev` o `npm run preview`. Los iconos vienen incluidos en el bundle, por lo que no hace falta conexión a un CDN.

## Instalación y ejecución

```bash
git clone https://github.com/victorbarrera1/maldOps.git
cd maldOps
npm install
npm run dev
```

Abrir la URL que muestra la terminal (por defecto **http://localhost:5173**).

Otros comandos:

```bash
npm run build     # genera la versión de producción en dist/
npm run preview   # sirve dist/ para probar el build
```

### Variables de entorno

Copiar `.env.example` como `.env` solo si se quiere cambiar la fuente de datos. El archivo `.env` está en `.gitignore` y no se versiona:

```bash
cp .env.example .env
```

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `VITE_API_MODO` | `mock` | `mock` usa localStorage y los JSON de `public/mocks/`; `http` usa `fetch` contra `VITE_API_URL`. |
| `VITE_API_URL` | vacío | URL base del backend real, sin barra final. Solo se usa con `VITE_API_MODO=http`. |

## Credenciales de prueba

| Rol | Nombre | Correo | Contraseña |
|---|---|---|---|
| Administrador | Victor Barrera | `victor.barrera@mail.udp.cl` | `demo1234` |
| Vendedor | Josemanuel Rodríguez | `josemanuel.rodriguez@mail.udp.cl` | `demo1234` |
| Vendedor | Martin Maldonado | `martin.maldonado@mail.udp.cl` | `demo1234` |
| Vendedor | Camila Rojas | `camila.rojas@gmail.com` | `demo1234` |

Las cuatro cuentas están en `public/mocks/usuarios.json`. El login y el registro solo aceptan correos `@gmail.com` o `@mail.udp.cl`.

- **Administrador:** puede crear, editar y **eliminar** clientes y ventas.
- **Vendedor:** puede crear y editar clientes y ventas, pero no eliminarlos. La interfaz oculta los botones «Eliminar» y la API responde `403` si se intenta igual.

También se puede crear una cuenta nueva desde **Registro**; queda con rol `vendedor`.

Desde **Configuración** se puede editar el nombre, el correo y la contraseña de la cuenta, o eliminarla. La única cuenta de administrador no se puede eliminar (`409`). Si se elimina una cuenta de prueba, **Restablecer datos de prueba** la recupera.

## Vistas

| Vista | Ruta | Cómo llegar | Acceso |
|---|---|---|---|
| Iniciar sesión | `index.html` (o `/`) | Entrada directa al sitio | Pública |
| Registro | `registro.html` | Enlace «Crear cuenta» desde el login | Pública |
| Dashboard | `dashboard.html` | Al iniciar sesión; menú **Dashboard** | Privada |
| Clientes | `clientes.html` | Menú **Clientes** | Privada |
| Ventas | `ventas.html` | Menú **Ventas** | Privada |
| Ayuda | `ayuda.html` | Menú **Ayuda** | Privada |
| Configuración | `configuracion.html` | Menú **Configuracion** | Privada |

Las vistas privadas están marcadas con `data-privada="true"` en el `<body>`. Si no hay sesión, el guard redirige a `index.html?volver=<vista>`; después del login se vuelve a la vista pedida. El dashboard es la vista de destino por defecto.

## Funcionalidades

- **Sesión simulada:** login y registro con validación por campo, sesión persistente en `localStorage`, cierre de sesión y guard para las vistas privadas. Los errores `401` vuelven al login.
- **Roles:** `admin` y `vendedor`. Solo el administrador ve y puede ejecutar la eliminación de clientes y ventas.
- **Dashboard:** cuatro métricas calculadas con datos reales de la API —clientes totales, ventas obtenidas, ganancias y ticket promedio—, además de las últimas ocho ventas y los primeros cinco clientes.
- **Clientes:** listado con total y CRUD. Crear y editar usan un diálogo con validación por campo; el nombre duplicado responde `409`. Eliminar pide confirmación y falla con `409` si el cliente tiene ventas asociadas. Cada cliente puede marcarse como **favorito** (estrella) y tener una **nota** de hasta 300 caracteres. La lista se puede **buscar** por nombre o nota, filtrar por **solo favoritos** y ordenar.
- **Ventas:** listado con total y CRUD. El formulario carga los clientes desde la API, valida un precio entero mayor que 0 y ofrece los servicios y estatus del catálogo. Eliminar también pide confirmación. Tres botones **Exportar a Excel** descargan un archivo `.csv` (separador `;`, se abre con doble clic en Excel): reporte de ventas, campañas más vendidas e historial de ventas por cliente. Los reportes cuentan todas las ventas, incluidas las devueltas, igual que el dashboard.
- **Buscador de la barra superior:** filtra en vivo la lista de Clientes o de Ventas. Desde otra vista, al pulsar Enter abre Clientes con el texto buscado (`clientes.html?q=texto`).
- **Ayuda:** preguntas frecuentes en acordeón cargadas desde la API (ocho registros) y datos de contacto del equipo; el botón «contactar» abre el correo del integrante.
- **Configuración:** edición de la cuenta (nombre, correo, contraseña —pide la actual— y eliminar cuenta, con diálogo de confirmación), modo oscuro y **simulador de pruebas**: latencia (rápida, normal o lenta), probabilidad de error (0 %, 10 %, 25 % o 50 %), forzar el próximo fallo `500` y restablecer los datos de prueba.
- **Estados de interfaz:** cada vista con datos muestra esqueleto de carga, estado vacío y error con botón **Reintentar**. Añadir `?fallar` a la URL fuerza un `500`; `?fallar=404` fuerza ese código.
- **Avisos y accesibilidad:** toasts para éxito y error, diálogos `<dialog>` nativos y `aria-invalid` en los campos con error.

## Capa de datos (mocks como API)

### La idea

```
Vista (HTML + src/*.js)
        │  solo llama a api.*
        ▼
   src/api.js  ── fachada única ──►  VITE_API_MODO
        │                              ├─ mock: src/api/servidor.js
        │                              │        └─ src/api/db.js → localStorage
        │                              │             (se siembra desde public/mocks/*.json)
        │                              └─ http: src/api/http.js → fetch(VITE_API_URL)
        ▼
{ ok, status, data, error, errores }
```

- Las vistas **solo** llaman funciones de `src/api.js` (`api.clientes.listar()`, `api.ventas.crear()`, etc.). Ninguna vista usa `fetch`, lee los JSON de `public/mocks/` ni toca `localStorage` directamente.
- Todas las funciones son **asíncronas** y responden con el mismo objeto normalizado:

  ```js
  { ok: true,  status: 200, data: [...], error: null, errores: null }
  { ok: false, status: 422, data: null,  error: 'Revisa los datos.', errores: { nombre: 'Escribe el nombre del cliente.' } }
  ```

  `errores` solo aparece en validaciones (`422`) y conflictos (`409`). En modo HTTP, `src/api/http.js` conserva además `meta` si el backend lo envía.

- **Modo mock (por defecto):** `src/api/servidor.js` simula una API REST con latencia aleatoria de 300–800 ms y códigos reales (`200`, `201`, `401`, `403`, `404`, `409`, `422`, `500`). La primera vez copia cada recurso desde `public/mocks/` a `localStorage`; desde ahí se leen y escriben los cambios, que sobreviven a recargar la página.
- **Modo http (Entrega 3):** con `VITE_API_MODO=http` y `VITE_API_URL`, las mismas funciones usan `fetch`. Las vistas no cambian.

### Forzar errores y lentitud

- En **Configuración → Simulador de pruebas** se elige la latencia y la probabilidad de error.
- En cualquier vista, `?fallar` fuerza un `500` en las llamadas de esa página; `?fallar=404` fuerza un `404`. Por ejemplo: `clientes.html?fallar`.
- **Restablecer datos de prueba** vuelve al contenido original de `public/mocks/`, borra la sesión y regresa al login.
- En la consola del navegador también se puede ejecutar `localStorage.removeItem('maldops.db.v1')` y recargar para volver a sembrar la base.

### Endpoints simulados

Las rutas son relativas a `VITE_API_URL`. Por ejemplo, si vale `http://localhost:3000/api`, el login queda en `http://localhost:3000/api/auth/login`. 🔒 = requiere sesión.

| Función | Método | Ruta equivalente | Descripción y códigos |
|---|---|---|---|
| `api.auth.iniciarSesion(datos)` | POST | `/auth/login` | Valida correo y contraseña; devuelve el usuario sin `contrasena`. 200 · 401 · 422 · 500 |
| `api.auth.registrar(datos)` | POST | `/auth/registro` | Crea una cuenta con rol `vendedor` e inicia sesión. 201 · 409 (correo en uso) · 422 · 500 |
| `api.auth.cerrarSesion()` | POST | `/auth/logout` | Cierra la sesión. 200 · 204 |
| `api.auth.perfil()` 🔒 | GET | `/auth/perfil` | Devuelve la cuenta de la sesión. 200 · 401 · 500 |
| `api.auth.actualizarPerfil(datos)` 🔒 | PATCH | `/auth/perfil` | Edita `nombre`, `correo` y/o la contraseña (`contrasenaActual` + `contrasenaNueva`). Correo en uso: 409. 200 · 401 · 409 · 422 · 500 |
| `api.auth.eliminarCuenta()` 🔒 | DELETE | `/auth/perfil` | Elimina la cuenta de la sesión y la cierra. No deja eliminar al único administrador. 200 · 401 · 409 · 500 |
| `api.clientes.listar()` 🔒 | GET | `/clientes` | Lista todos los clientes. 200 · 401 · 500 |
| `api.clientes.obtener(id)` 🔒 | GET | `/clientes/:id` | Un cliente por id. 200 · 401 · 404 · 500 |
| `api.clientes.crear(datos)` 🔒 | POST | `/clientes` | Crea un cliente. 201 · 401 · 409 (nombre repetido) · 422 · 500 |
| `api.clientes.actualizar(id, datos)` 🔒 | PATCH | `/clientes/:id` | Edita un cliente. 200 · 401 · 404 · 409 · 422 · 500 |
| `api.clientes.eliminar(id)` 🔒 | DELETE | `/clientes/:id` | Solo `admin`; falla si tiene ventas. 200 · 401 · 403 · 404 · 409 · 500 |
| `api.ventas.listar()` 🔒 | GET | `/ventas` | Lista todas las ventas. 200 · 401 · 500 |
| `api.ventas.obtener(id)` 🔒 | GET | `/ventas/:id` | Una venta por id. 200 · 401 · 404 · 500 |
| `api.ventas.crear(datos)` 🔒 | POST | `/ventas` | Crea una venta. 201 · 401 · 422 · 500 |
| `api.ventas.actualizar(id, datos)` 🔒 | PATCH | `/ventas/:id` | Edita una venta. 200 · 401 · 404 · 422 · 500 |
| `api.ventas.eliminar(id)` 🔒 | DELETE | `/ventas/:id` | Solo `admin`. 200 · 401 · 403 · 404 · 500 |
| `api.ventas.deCliente(clienteId)` 🔒 | GET | `/clientes/:id/ventas` | Ventas de un cliente. 200 · 401 · 404 · 500 |
| `api.preguntas.listar()` 🔒 | GET | `/preguntas` | Preguntas frecuentes. 200 · 401 · 500 |
| `api.simulador.obtenerConfiguracion()` | GET | `/simulador` | Configuración del simulador (solo mock). 200 |
| `api.simulador.configurar(cambios)` | PUT | `/simulador` | Guarda latencia y probabilidad de error (solo mock). 200 |
| `api.simulador.simularFallo(status)` | POST | `/simulador/fallo` | Fuerza el próximo fallo (solo mock). 200 |
| `api.simulador.estado()` | GET | `/simulador/estado` | Estado actual del simulador (solo mock). 200 |
| `api.simulador.reiniciarDatos()` | POST | `/simulador/reiniciar` | Restablece los mocks y borra la sesión (solo mock). 200 |

Cualquier llamada puede responder `500` si el simulador o `?fallar` lo fuerza.

### Formato esperado del backend real

`src/api/http.js` adapta estas respuestas al objeto normalizado que usan las vistas:

**Éxito**

```json
{
  "data": [{ "id": "cli-001", "nombre": "Carlos Leoui", "estatus": "Activo" }],
  "meta": { "total": 12 }
}
```

**Error**

```json
{
  "error": "Revisa los datos del cliente.",
  "errores": { "nombre": "Escribe el nombre del cliente." }
}
```

- `data` y `meta` son opcionales en la respuesta; `meta` se usa para paginación y se conserva en el resultado.
- `error` es un mensaje en español; `errores` es un objeto campo → mensaje y solo acompaña a `422` y `409`.
- El código HTTP real (`response.status`) se copia a `status`. Los fallos de red se normalizan como `status: 0`.

### Datos (`public/mocks/`)

| Archivo | Registros | Contenido |
|---|---|---|
| `usuarios.json` | 4 | Cuentas con nombre, correo, contraseña de demostración y rol (`admin`/`vendedor`) |
| `clientes.json` | 12 | `id`, `nombre` y `estatus` (`Activo`/`Inactivo`). La API agrega `favorito` (`false`) y `nota` (vacía) a cada cliente; se guardan al marcarlos o editarlos |
| `ventas.json` | 15 | `id`, `clienteId`, `precio` (CLP), `servicio` y `estatus` |
| `preguntas.json` | 8 | `id`, `pregunta` y `respuesta` para la vista de ayuda |

> Las contraseñas están en texto plano **solo porque es un mock**. Un backend real las guarda con hash y nunca las devuelve.

## Estructura del proyecto

```
maldOps/
├── index.html                 # Login
├── registro.html              # Crear cuenta
├── dashboard.html             # Métricas, últimas ventas y clientes
├── clientes.html              # Listado y CRUD de clientes
├── ventas.html                # Listado y CRUD de ventas
├── ayuda.html                 # Preguntas frecuentes y contacto
├── configuracion.html         # Cuenta y simulador de pruebas
├── vite.config.js             # Todas las páginas de la raíz como input del build
├── .env.example               # VITE_API_MODO y VITE_API_URL
├── public/
│   ├── img/                   # Logo y avatar
│   └── mocks/                 # usuarios, clientes, ventas y preguntas
├── src/
│   ├── api.js                 # Fachada única que importan las vistas
│   ├── api/
│   │   ├── servidor.js        # API simulada: reglas, permisos y errores
│   │   ├── db.js              # Siembra y persiste los mocks en localStorage
│   │   ├── respuesta.js       # Formato { ok, status, data, error, errores }
│   │   ├── sesion.js          # Sesión pública en localStorage
│   │   └── http.js            # Transporte fetch para el backend real
│   ├── css/                   # app.css (tema, reset y componentes), dashboard.css y login.css
│   ├── main.js                # Alpine, iconos, menú y cierre de sesión
│   ├── nav.js                 # Menú lateral y barra superior (con buscador) compartidos
│   ├── exportar.js            # Descarga de reportes en CSV para Excel
│   ├── guard.js               # Protección de vistas privadas
│   ├── iconos.js              # Ionicons desde npm (solo los iconos usados)
│   ├── ui.js                  # Estados, badges, toasts y confirmaciones
│   ├── login.js               # Login con validación por campo
│   ├── registro.js            # Registro con validación por campo
│   ├── dashboard.js           # Métricas y listados del dashboard
│   ├── clientes.js            # Vista de clientes
│   ├── ventas.js              # Vista de ventas
│   ├── ayuda.js               # Vista de ayuda
│   └── configuracion.js       # Vista de configuración
└── ia/
    ├── README.md              # Índice de uso de IA
    └── PLAN.md                # Checklist y estado de la entrega
```

## Uso de IA

El registro de prompts, respuestas y verificaciones está en [`ia/README.md`](ia/README.md).
