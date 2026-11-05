/**
 * Formato único de respuesta de la API simulada.
 *
 * Éxito:  { ok: true,  status, data, error: null, errores: null }
 * Error:  { ok: false, status, data: null, error: "mensaje", errores }
 *
 * `errores` solo lleva contenido en las respuestas 422 y es un objeto
 * { campo: "mensaje" } para que los formularios puedan pintar el error bajo
 * cada campo.
 */

export function ok(data = null, status = 200) {
    return {
        ok: true,
        status,
        data,
        error: null,
        errores: null,
    }
}

export function fallo(mensaje, status = 500, errores = null) {
    return {
        ok: false,
        status,
        data: null,
        error: mensaje || 'Ocurrió un error inesperado.',
        errores: errores && typeof errores === 'object' ? errores : null,
    }
}

export function esRespuesta(valor) {
    return Boolean(
        valor &&
            typeof valor === 'object' &&
            typeof valor.ok === 'boolean' &&
            typeof valor.status === 'number' &&
            'data' in valor &&
            'error' in valor,
    )
}
