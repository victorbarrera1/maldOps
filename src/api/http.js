/**
 * Cliente HTTP de la API.
 *
 * Se activa con `VITE_API_MODO=http`. Habla con el backend definido en
 * `VITE_API_URL` y normaliza todas las respuestas al mismo formato que la capa
 * simulada:
 * { ok, status, data, error, errores }
 *
 * Las vistas nunca importan este archivo: siempre pasan por `src/api.js`.
 */

import { guardarSesion, borrarSesion } from './sesion.js'

const BASE_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const CABECERAS = {
    Accept: 'application/json',
}

function url(ruta) {
    return `${BASE_URL}${ruta}`
}

function ok(data, status = 200) {
    return { ok: true, status, data, error: null, errores: null }
}

function fallo(error, status = 500, errores = null) {
    return { ok: false, status, data: null, error, errores }
}

function normalizar(respuesta, cuerpo) {
    if (cuerpo && typeof cuerpo === 'object' && typeof cuerpo.ok === 'boolean') {
        return {
            ok: cuerpo.ok,
            status: Number(cuerpo.status) || respuesta.status,
            data: cuerpo.data ?? null,
            error: cuerpo.error ?? null,
            errores: cuerpo.errores ?? null,
        }
    }

    if (respuesta.ok) {
        return ok(cuerpo, respuesta.status)
    }

    return fallo(
        (cuerpo && cuerpo.error) || `La API respondió con el código ${respuesta.status}.`,
        respuesta.status,
        (cuerpo && cuerpo.errores) || null,
    )
}

async function solicitar(ruta, { metodo = 'GET', cuerpo } = {}) {
    const opciones = {
        method: metodo,
        headers: { ...CABECERAS },
        credentials: 'include',
    }

    if (cuerpo !== undefined) {
        opciones.headers['Content-Type'] = 'application/json'
        opciones.body = JSON.stringify(cuerpo)
    }

    try {
        const respuesta = await fetch(url(ruta), opciones)
        const texto = await respuesta.text()
        let datos = null

        if (texto) {
            try {
                datos = JSON.parse(texto)
            } catch {
                datos = texto
            }
        }

        return normalizar(respuesta, datos)
    } catch {
        return fallo(
            'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
            0,
        )
    }
}

function guardarSesionSiCorresponde(respuesta) {
    if (respuesta.ok && respuesta.data && respuesta.data.id) {
        try {
            guardarSesion(respuesta.data)
        } catch {
            // Si el backend devuelve un usuario incompleto, la sesión local no se toca.
        }
    }

    return respuesta
}

export async function iniciarSesion(datos = {}) {
    const respuesta = await solicitar('/auth/login', {
        metodo: 'POST',
        cuerpo: {
            correo: datos.correo,
            contrasena: datos.contrasena,
        },
    })

    return guardarSesionSiCorresponde(respuesta)
}

export async function registrar(datos = {}) {
    const respuesta = await solicitar('/auth/registro', {
        metodo: 'POST',
        cuerpo: {
            nombre: datos.nombre,
            correo: datos.correo,
            contrasena: datos.contrasena,
            confirmarContrasena: datos.confirmarContrasena,
        },
    })

    return guardarSesionSiCorresponde(respuesta)
}

export async function cerrarSesion() {
    const respuesta = await solicitar('/auth/logout', { metodo: 'POST' })

    borrarSesion()

    return respuesta
}

export async function perfil() {
    const respuesta = await solicitar('/auth/perfil')

    if (respuesta.ok && respuesta.data) {
        try {
            guardarSesion(respuesta.data)
        } catch {
            // El perfil puede no traer todos los campos de la sesión.
        }
    } else if (respuesta.status === 401) {
        borrarSesion()
    }

    return respuesta
}

export async function listarClientes() {
    return solicitar('/clientes')
}

export async function obtenerCliente(id) {
    return solicitar(`/clientes/${encodeURIComponent(id)}`)
}

export async function crearCliente(datos = {}) {
    return solicitar('/clientes', { metodo: 'POST', cuerpo: datos })
}

export async function actualizarCliente(id, datos = {}) {
    return solicitar(`/clientes/${encodeURIComponent(id)}`, {
        metodo: 'PATCH',
        cuerpo: datos,
    })
}

export async function eliminarCliente(id) {
    return solicitar(`/clientes/${encodeURIComponent(id)}`, { metodo: 'DELETE' })
}

export async function listarVentas() {
    return solicitar('/ventas')
}

export async function obtenerVenta(id) {
    return solicitar(`/ventas/${encodeURIComponent(id)}`)
}

export async function crearVenta(datos = {}) {
    return solicitar('/ventas', { metodo: 'POST', cuerpo: datos })
}

export async function actualizarVenta(id, datos = {}) {
    return solicitar(`/ventas/${encodeURIComponent(id)}`, {
        metodo: 'PATCH',
        cuerpo: datos,
    })
}

export async function eliminarVenta(id) {
    return solicitar(`/ventas/${encodeURIComponent(id)}`, { metodo: 'DELETE' })
}

export async function ventasDeCliente(clienteId) {
    return solicitar(`/clientes/${encodeURIComponent(clienteId)}/ventas`)
}

export async function listarPreguntas() {
    return solicitar('/preguntas')
}

export async function obtenerConfiguracionSimulador() {
    return solicitar('/simulador')
}

export async function configurarSimulador(cambios = {}) {
    return solicitar('/simulador', { metodo: 'PUT', cuerpo: cambios })
}

export async function simularSiguienteFallo(status = 500) {
    return solicitar('/simulador/fallo', { metodo: 'POST', cuerpo: { status } })
}

export async function obtenerEstadoSimulador() {
    return solicitar('/simulador/estado')
}

export async function reiniciarDatosDePrueba() {
    const respuesta = await solicitar('/simulador/reiniciar', { metodo: 'POST' })

    if (respuesta.ok) {
        borrarSesion()
    }

    return respuesta
}
