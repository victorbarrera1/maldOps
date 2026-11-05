/**
 * Sesión simulada en localStorage.
 *
 * Solo guarda los datos públicos del usuario: nunca la contraseña.
 */

const CLAVE = 'maldops.sesion.v1'

function almacen() {
    try {
        return globalThis.localStorage || null
    } catch {
        return null
    }
}

function esUsuario(valor) {
    return Boolean(
        valor &&
            typeof valor === 'object' &&
            typeof valor.id === 'string' &&
            typeof valor.nombre === 'string' &&
            typeof valor.correo === 'string' &&
            typeof valor.rol === 'string',
    )
}

export function leerSesion() {
    const storage = almacen()

    if (!storage) {
        return null
    }

    try {
        const texto = storage.getItem(CLAVE)

        if (!texto) {
            return null
        }

        const sesion = JSON.parse(texto)

        return esUsuario(sesion) ? sesion : null
    } catch {
        return null
    }
}

export function guardarSesion(usuario) {
    if (!esUsuario(usuario)) {
        throw new Error('La sesión no tiene el formato esperado.')
    }

    const storage = almacen()

    if (!storage) {
        return usuario
    }

    try {
        storage.setItem(
            CLAVE,
            JSON.stringify({
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            }),
        )
    } catch {
        // Sin almacenamiento persistente la sesión dura lo que dure la página.
    }

    return usuario
}

export function borrarSesion() {
    try {
        globalThis.localStorage?.removeItem(CLAVE)
    } catch {
        // No hay nada más que limpiar.
    }
}

export function haySesion() {
    return Boolean(leerSesion())
}
