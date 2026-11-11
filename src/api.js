/**
 * Fachada única de la API de MaldOps.
 *
 * Las vistas solo importan este archivo. Ninguna vista debe usar `fetch`,
 * leer los JSON de `public/mocks/` ni tocar `localStorage` directamente.
 *
 * La fuente se elige con `VITE_API_MODO`:
 * - `mock` (por defecto): `src/api/servidor.js` sobre localStorage.
 * - `http`: `src/api/http.js` contra `VITE_API_URL`.
 *
 * Todas las funciones devuelven el mismo objeto:
 * { ok, status, data, error, errores }
 */

const MODO = String(import.meta.env.VITE_API_MODO || 'mock').toLowerCase() === 'http'
    ? 'http'
    : 'mock'

const cargarFuente =
    MODO === 'http' ? () => import('./api/http.js') : () => import('./api/servidor.js')

let fuentePromesa = null

function fuente() {
    if (!fuentePromesa) {
        fuentePromesa = cargarFuente()
    }

    return fuentePromesa
}

async function llamar(nombre, ...argumentos) {
    const modulo = await fuente()

    return modulo[nombre](...argumentos)
}

export const auth = {
    async iniciarSesion(datos) {
        return llamar('iniciarSesion', datos)
    },

    async registrar(datos) {
        return llamar('registrar', datos)
    },

    async cerrarSesion() {
        return llamar('cerrarSesion')
    },

    async perfil() {
        return llamar('perfil')
    },

    // [IA] inicio · ia/2026-11-11_victorbarrera1_cuenta-orden-readme.md
    async actualizarPerfil(datos) {
        return llamar('actualizarPerfil', datos)
    },

    async eliminarCuenta() {
        return llamar('eliminarCuenta')
    },
    // [IA] fin
}

export const clientes = {
//[IA] inicio · ia/2026-11-09_maldonou_busqueda-filtros-clientes-api.md
    async listar(opciones = {}) {
        return llamar('listarClientes', opciones)
    },
//[IA] fin
    async obtener(id) {
        return llamar('obtenerCliente', id)
    },

    async crear(datos) {
        return llamar('crearCliente', datos)
    },

    async actualizar(id, datos) {
        return llamar('actualizarCliente', id, datos)
    },

    async eliminar(id) {
        return llamar('eliminarCliente', id)
    },
}

export const ventas = {
    async listar(opciones = {}) {
        return llamar('listarVentas', opciones)
    },

    async obtener(id) {
        return llamar('obtenerVenta', id)
    },

    async crear(datos) {
        return llamar('crearVenta', datos)
    },

    async actualizar(id, datos) {
        return llamar('actualizarVenta', id, datos)
    },

    async eliminar(id) {
        return llamar('eliminarVenta', id)
    },

    async deCliente(clienteId) {
        return llamar('ventasDeCliente', clienteId)
    },
}

export const preguntas = {
    async listar() {
        return llamar('listarPreguntas')
    },
}

export const simulador = {
    async obtenerConfiguracion() {
        return llamar('obtenerConfiguracionSimulador')
    },

    async configurar(cambios) {
        return llamar('configurarSimulador', cambios)
    },

    async simularFallo(status) {
        return llamar('simularSiguienteFallo', status)
    },

    async estado() {
        return llamar('obtenerEstadoSimulador')
    },

    async reiniciarDatos() {
        return llamar('reiniciarDatosDePrueba')
    },
}

const api = { auth, clientes, ventas, preguntas, simulador }

export default api
