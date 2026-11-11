/**
 * Servidor simulado de MaldOps.
 *
 * No hay backend real: cada operación pasa por una latencia aleatoria y
 * devuelve el mismo formato de respuesta que la API (`ok`, `status`, `data`,
 * `error`). Los datos viven en localStorage a través de `db.js`.
 */

import { clonar, guardarDb, inicializarDb, reiniciarDb, siguienteId } from './db.js'
import { borrarSesion, guardarSesion, leerSesion } from './sesion.js'
import { fallo, ok } from './respuesta.js'

const CLAVE_SIMULADOR = 'maldops.simulador.v1'

const LATENCIAS = {
    normal: [300, 800],
    rapida: [0, 150],
    lenta: [1200, 1800],
}

const SIMULADOR_DEFECTO = {
    latencia: 'normal',
    probabilidadError: 0,
}

const DOMINIOS_PERMITIDOS = ['gmail.com', 'mail.udp.cl']
const ESTATUS_CLIENTE = ['Activo', 'Inactivo']
// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
const MAX_NOTA = 300

// Los clientes antiguos no tienen estos campos: se completan al leerlos.
function conExtras(cliente) {
    return {
        ...cliente,
        favorito: cliente.favorito === true,
        nota: typeof cliente.nota === 'string' ? cliente.nota : '',
    }
}
// [IA] fin
const SERVICIOS = [
    'META ADS',
    'TIKTOK ADS',
    'WHATSAPP ADS',
    'GOOGLE ADS',
    'YOUTUBE ADS',
    'LINKEDIN ADS',
    'REELS ADS',
]
const ESTATUS_VENTA = ['Pendiente', 'En Progreso', 'Devuelto', 'Confirmado']
const STATUS_SIMULABLES = [400, 401, 403, 404, 409, 422, 500]

const MENSAJES_STATUS = {
    400: 'La solicitud no es válida.',
    401: 'Tu sesión expiró. Inicia sesión de nuevo.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'No se encontró el registro solicitado.',
    409: 'La operación entra en conflicto con los datos existentes.',
    422: 'Revisa los datos del formulario.',
    500: 'No se pudieron cargar los datos. Intenta de nuevo.',
}

let configuracionMemoria = null
let falloForzado = null

function almacen() {
    try {
        return globalThis.localStorage || null
    } catch {
        return null
    }
}

function normalizarTexto(valor) {
    return String(valor ?? '').trim()
}

function normalizarCorreo(valor) {
    return normalizarTexto(valor).toLowerCase()
}

function normalizarMinusculas(valor) {
    return normalizarTexto(valor).toLowerCase()
}

function mismoTexto(a, b) {
    return normalizarMinusculas(a) === normalizarMinusculas(b)
}

function normalizarEstatusCliente(valor) {
    return ESTATUS_CLIENTE.find((estatus) => mismoTexto(estatus, valor)) || ''
}

function normalizarServicio(valor) {
    return SERVICIOS.find((servicio) => mismoTexto(servicio, valor)) || ''
}

function normalizarEstatusVenta(valor) {
    return ESTATUS_VENTA.find((estatus) => mismoTexto(estatus, valor)) || ''
}

function normalizarConfiguracion(valor = {}) {
    const latencia = Object.prototype.hasOwnProperty.call(LATENCIAS, valor.latencia)
        ? valor.latencia
        : SIMULADOR_DEFECTO.latencia
    const probabilidad = Number(valor.probabilidadError)

    return {
        latencia,
        probabilidadError: Number.isFinite(probabilidad)
            ? Math.min(100, Math.max(0, Math.round(probabilidad)))
            : SIMULADOR_DEFECTO.probabilidadError,
    }
}

function leerConfiguracion() {
    const storage = almacen()

    if (!storage) {
        return configuracionMemoria || { ...SIMULADOR_DEFECTO }
    }

    try {
        const texto = storage.getItem(CLAVE_SIMULADOR)

        if (!texto) {
            return { ...SIMULADOR_DEFECTO }
        }

        return normalizarConfiguracion(JSON.parse(texto))
    } catch {
        return { ...SIMULADOR_DEFECTO }
    }
}

function guardarConfiguracion(configuracion) {
    const normalizada = normalizarConfiguracion(configuracion)
    configuracionMemoria = normalizada

    try {
        globalThis.localStorage?.setItem(CLAVE_SIMULADOR, JSON.stringify(normalizada))
    } catch {
        // Sin persistencia, la configuración queda en memoria.
    }

    return normalizada
}

function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function latenciaAleatoria(configuracion) {
    const [minimo, maximo] = LATENCIAS[configuracion.latencia] || LATENCIAS.normal

    return Math.round(minimo + Math.random() * (maximo - minimo))
}

/**
 * Devuelve el status que pide `?fallar` o `?fallar=404`; null si no está.
 */
function statusDeUrl() {
    if (typeof window === 'undefined') {
        return null
    }

    let parametros

    try {
        parametros = new URL(window.location.href).searchParams
    } catch {
        return String(window.location.search || '').includes('fallar') ? 500 : null
    }

    if (!parametros.has('fallar')) {
        return null
    }

    const status = Number.parseInt(parametros.get('fallar'), 10)

    return STATUS_SIMULABLES.includes(status) ? status : 500
}

function mensajeDeStatus(status) {
    return MENSAJES_STATUS[status] || MENSAJES_STATUS[500]
}

async function responder(operacion) {
    const configuracion = leerConfiguracion()

    await esperar(latenciaAleatoria(configuracion))

    if (falloForzado) {
        const { status, mensaje } = falloForzado
        falloForzado = null

        return fallo(mensaje || mensajeDeStatus(status), status)
    }

    const statusUrl = statusDeUrl()

    if (statusUrl) {
        return fallo(`Fallo simulado por el parámetro ?fallar (${statusUrl}).`, statusUrl)
    }

    if (configuracion.probabilidadError > 0 && Math.random() * 100 < configuracion.probabilidadError) {
        return fallo('Error simulado por la configuración de pruebas.', 500)
    }

    try {
        return await operacion()
    } catch (error) {
        console.error('[api] Error al acceder a los datos simulados:', error)

        return fallo(MENSAJES_STATUS[500], 500)
    }
}

function conSesion(operacion) {
    return responder(async () => {
        const sesion = leerSesion()

        if (!sesion) {
            return fallo(MENSAJES_STATUS[401], 401)
        }

        return operacion(sesion)
    })
}

function sinContrasena(usuario) {
    const { contrasena, ...publico } = usuario

    return clonar(publico)
}

function correoPermitido(correo) {
    const arroba = correo.indexOf('@')

    if (arroba <= 0 || correo.indexOf('@', arroba + 1) !== -1) {
        return false
    }

    const usuario = correo.slice(0, arroba)
    const dominio = correo.slice(arroba + 1)

    return Boolean(usuario) && DOMINIOS_PERMITIDOS.includes(dominio) && !/\s/.test(correo)
}

function validarLogin(datos) {
    const errores = {}
    const correo = normalizarCorreo(datos.correo)
    const contrasena = String(datos.contrasena ?? '')

    if (!correo) {
        errores.correo = 'Escribe tu correo electrónico.'
    } else if (!correoPermitido(correo)) {
        errores.correo = 'Solo puedes entrar con un correo @gmail.com o @mail.udp.cl.'
    }

    if (!contrasena.trim()) {
        errores.contrasena = 'Escribe tu contraseña.'
    }

    return { errores, correo, contrasena }
}

function validarRegistro(datos) {
    const errores = {}
    const nombre = normalizarTexto(datos.nombre)
    const correo = normalizarCorreo(datos.correo)
    const contrasena = String(datos.contrasena ?? '')
    const confirmar = datos.confirmarContrasena

    if (!nombre) {
        errores.nombre = 'Escribe tu nombre de usuario.'
    } else if (nombre.length < 2) {
        errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
    } else if (nombre.length > 80) {
        errores.nombre = 'El nombre no puede superar los 80 caracteres.'
    }

    if (!correo) {
        errores.correo = 'Escribe tu correo electrónico.'
    } else if (!correoPermitido(correo)) {
        errores.correo = 'Solo puedes registrarte con un correo @gmail.com o @mail.udp.cl.'
    }

    if (!contrasena.trim()) {
        errores.contrasena = 'Escribe una contraseña.'
    } else if (contrasena.length < 6) {
        errores.contrasena = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (confirmar !== undefined && String(confirmar) !== contrasena) {
        errores.confirmarContrasena = 'Las contraseñas no coinciden.'
    }

    return { errores, nombre, correo, contrasena }
}

function validarCliente(datos, { parcial = false } = {}) {
    const errores = {}

    if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'nombre')) {
        const nombre = normalizarTexto(datos.nombre)

        if (!nombre) {
            errores.nombre = 'Escribe el nombre del cliente.'
        } else if (nombre.length < 2) {
            errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
        } else if (nombre.length > 80) {
            errores.nombre = 'El nombre no puede superar los 80 caracteres.'
        }
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'estatus')) {
        if (!normalizarEstatusCliente(datos.estatus)) {
            errores.estatus = 'Selecciona Activo o Inactivo.'
        }
    }
    // [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
    if (Object.prototype.hasOwnProperty.call(datos, 'favorito')) {
        if (typeof datos.favorito !== 'boolean') {
            errores.favorito = 'El favorito debe ser verdadero o falso.'
        }
    }

    if (Object.prototype.hasOwnProperty.call(datos, 'nota')) {
        if (normalizarTexto(datos.nota).length > MAX_NOTA) {
            errores.nota = `La nota no puede superar los ${MAX_NOTA} caracteres.`
        }
    }
    // [IA] fin
    return errores
}

function validarVenta(datos, db, { parcial = false } = {}) {
    const errores = {}

    if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'clienteId')) {
        const clienteId = normalizarTexto(datos.clienteId)

        if (!clienteId) {
            errores.clienteId = 'Selecciona un cliente.'
        } else if (!db.clientes.some((cliente) => cliente.id === clienteId)) {
            errores.clienteId = 'El cliente seleccionado no existe.'
        }
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'precio')) {
        const precio = Number(datos.precio)

        if (!Number.isInteger(precio) || precio <= 0) {
            errores.precio = 'Escribe un precio entero mayor que 0.'
        }
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'servicio')) {
        if (!normalizarServicio(datos.servicio)) {
            errores.servicio = 'Selecciona un servicio válido.'
        }
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(datos, 'estatus')) {
        if (!normalizarEstatusVenta(datos.estatus)) {
            errores.estatus = 'Selecciona un estatus válido.'
        }
    }

    return errores
}

function hayErrores(errores) {
    return Object.keys(errores).length > 0
}

// ---------------------------------------------------------------------------
// Autenticación
// ---------------------------------------------------------------------------

export async function iniciarSesion(datos = {}) {
    return responder(async () => {
        const { errores, correo, contrasena } = validarLogin(datos)

        if (hayErrores(errores)) {
            return fallo('Revisa los datos del formulario.', 422, errores)
        }

        const db = await inicializarDb()
        const usuario = db.usuarios.find((elemento) => normalizarCorreo(elemento.correo) === correo)

        if (!usuario || usuario.contrasena !== contrasena) {
            return fallo('Correo o contraseña incorrectos.', 401)
        }

        const publico = sinContrasena(usuario)
        guardarSesion(publico)

        return ok(publico, 200)
    })
}

export async function registrar(datos = {}) {
    return responder(async () => {
        const { errores, nombre, correo, contrasena } = validarRegistro(datos)

        if (hayErrores(errores)) {
            return fallo('Revisa los datos del formulario.', 422, errores)
        }

        const db = await inicializarDb()

        if (db.usuarios.some((usuario) => normalizarCorreo(usuario.correo) === correo)) {
            return fallo('Ya existe una cuenta con ese correo.', 409, {
                correo: 'Ya existe una cuenta con ese correo.',
            })
        }

        const usuario = {
            id: siguienteId(db.usuarios, 'u'),
            nombre,
            correo,
            contrasena,
            rol: 'vendedor',
        }

        db.usuarios.push(usuario)
        guardarDb(db)

        const publico = sinContrasena(usuario)
        guardarSesion(publico)

        return ok(publico, 201)
    })
}

export async function cerrarSesion() {
    borrarSesion()

    return ok({ mensaje: 'Sesión cerrada.' })
}

export async function perfil() {
    return conSesion(async (sesion) => {
        const db = await inicializarDb()
        const usuario = db.usuarios.find((elemento) => elemento.id === sesion.id)

        if (!usuario) {
            borrarSesion()

            return fallo('Tu sesión ya no es válida. Inicia sesión de nuevo.', 401)
        }

        return ok(sinContrasena(usuario))
    })
}

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------

export async function listarClientes() {
    return conSesion(async () => {
        const db = await inicializarDb()

        return ok(clonar(db.clientes).map(conExtras)) 
    })
}

export async function obtenerCliente(id) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const cliente = db.clientes.find((elemento) => elemento.id === id)

        if (!cliente) {
            return fallo('No existe un cliente con ese id.', 404)
        }

           // [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
   return ok(conExtras(clonar(cliente)))
   // [IA] fin
    })
}

export async function crearCliente(datos = {}) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const errores = validarCliente(datos)

        if (hayErrores(errores)) {
            return fallo('Revisa los datos del cliente.', 422, errores)
        }

        const nombre = normalizarTexto(datos.nombre)

        if (db.clientes.some((cliente) => mismoTexto(cliente.nombre, nombre))) {
            return fallo('Ya existe un cliente con ese nombre.', 409, {
                nombre: 'Ya existe un cliente con ese nombre.',
            })
        }

        const cliente = {
            id: siguienteId(db.clientes, 'cli'),
            nombre,
            estatus: normalizarEstatusCliente(datos.estatus),
            favorito: datos.favorito === true, // [IA]
            nota: normalizarTexto(datos.nota), // [IA]
        }

        db.clientes.push(cliente)
        guardarDb(db)

        return ok(clonar(cliente), 201)
    })
}

export async function actualizarCliente(id, datos = {}) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const cliente = db.clientes.find((elemento) => elemento.id === id)

        if (!cliente) {
            return fallo('No existe un cliente con ese id.', 404)
        }

        const errores = validarCliente(datos, { parcial: true })

        if (hayErrores(errores)) {
            return fallo('Revisa los datos del cliente.', 422, errores)
        }

        const nombre = Object.prototype.hasOwnProperty.call(datos, 'nombre')
            ? normalizarTexto(datos.nombre)
            : cliente.nombre
        const estatus = Object.prototype.hasOwnProperty.call(datos, 'estatus')
            ? normalizarEstatusCliente(datos.estatus)
            : cliente.estatus

        if (db.clientes.some((elemento) => elemento.id !== id && mismoTexto(elemento.nombre, nombre))) {
            return fallo('Ya existe un cliente con ese nombre.', 409, {
                nombre: 'Ya existe un cliente con ese nombre.',
            })
        }

        cliente.nombre = nombre
        cliente.estatus = estatus
         // [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
        if (Object.prototype.hasOwnProperty.call(datos, 'favorito')) {
            cliente.favorito = datos.favorito
        }

        if (Object.prototype.hasOwnProperty.call(datos, 'nota')) {
            cliente.nota = normalizarTexto(datos.nota)
        }
        // [IA] fin

        guardarDb(db)

        return ok(conExtras(clonar(cliente))) // [IA]

        
    })
}

export async function eliminarCliente(id) {
    return conSesion(async (sesion) => {
        if (sesion.rol !== 'admin') {
            return fallo('Solo un administrador puede eliminar clientes.', 403)
        }

        const db = await inicializarDb()
        const indice = db.clientes.findIndex((elemento) => elemento.id === id)

        if (indice === -1) {
            return fallo('No existe un cliente con ese id.', 404)
        }

        const ventasAsociadas = db.ventas.filter((venta) => venta.clienteId === id).length

        if (ventasAsociadas > 0) {
            return fallo(
                `No puedes eliminar un cliente con ${ventasAsociadas} venta(s) asociada(s).`,
                409,
            )
        }

        const [eliminado] = db.clientes.splice(indice, 1)
        guardarDb(db)

        return ok(clonar(eliminado))
    })
}

// ---------------------------------------------------------------------------
// Ventas
// ---------------------------------------------------------------------------

export async function listarVentas() {
    return conSesion(async () => {
        const db = await inicializarDb()

        return ok(clonar(db.ventas))
    })
}

export async function obtenerVenta(id) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const venta = db.ventas.find((elemento) => elemento.id === id)

        if (!venta) {
            return fallo('No existe una venta con ese id.', 404)
        }

        return ok(clonar(venta))
    })
}

export async function crearVenta(datos = {}) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const errores = validarVenta(datos, db)

        if (hayErrores(errores)) {
            return fallo('Revisa los datos de la venta.', 422, errores)
        }

        const venta = {
            id: siguienteId(db.ventas, 'ven'),
            clienteId: normalizarTexto(datos.clienteId),
            precio: Number(datos.precio),
            servicio: normalizarServicio(datos.servicio),
            estatus: normalizarEstatusVenta(datos.estatus),
        }

        db.ventas.push(venta)
        guardarDb(db)

        return ok(clonar(venta), 201)
    })
}

export async function actualizarVenta(id, datos = {}) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const venta = db.ventas.find((elemento) => elemento.id === id)

        if (!venta) {
            return fallo('No existe una venta con ese id.', 404)
        }

        const errores = validarVenta(datos, db, { parcial: true })

        if (hayErrores(errores)) {
            return fallo('Revisa los datos de la venta.', 422, errores)
        }

        if (Object.prototype.hasOwnProperty.call(datos, 'clienteId')) {
            venta.clienteId = normalizarTexto(datos.clienteId)
        }

        if (Object.prototype.hasOwnProperty.call(datos, 'precio')) {
            venta.precio = Number(datos.precio)
        }

        if (Object.prototype.hasOwnProperty.call(datos, 'servicio')) {
            venta.servicio = normalizarServicio(datos.servicio)
        }

        if (Object.prototype.hasOwnProperty.call(datos, 'estatus')) {
            venta.estatus = normalizarEstatusVenta(datos.estatus)
        }

        guardarDb(db)

        return ok(clonar(venta))
    })
}

export async function eliminarVenta(id) {
    return conSesion(async (sesion) => {
        if (sesion.rol !== 'admin') {
            return fallo('Solo un administrador puede eliminar ventas.', 403)
        }

        const db = await inicializarDb()
        const indice = db.ventas.findIndex((elemento) => elemento.id === id)

        if (indice === -1) {
            return fallo('No existe una venta con ese id.', 404)
        }

        const [eliminada] = db.ventas.splice(indice, 1)
        guardarDb(db)

        return ok(clonar(eliminada))
    })
}

export async function ventasDeCliente(clienteId) {
    return conSesion(async () => {
        const db = await inicializarDb()
        const cliente = db.clientes.find((elemento) => elemento.id === clienteId)

        if (!cliente) {
            return fallo('No existe un cliente con ese id.', 404)
        }

        return ok(clonar(db.ventas.filter((venta) => venta.clienteId === clienteId)))
    })
}

// ---------------------------------------------------------------------------
// Preguntas frecuentes
// ---------------------------------------------------------------------------

export async function listarPreguntas() {
    return conSesion(async () => {
        const db = await inicializarDb()

        return ok(clonar(db.preguntas))
    })
}

// ---------------------------------------------------------------------------
// Simulador de pruebas
// ---------------------------------------------------------------------------

export async function obtenerConfiguracionSimulador() {
    return ok(clonar(leerConfiguracion()))
}

export async function configurarSimulador(cambios = {}) {
    const configuracion = guardarConfiguracion({
        ...leerConfiguracion(),
        ...cambios,
    })

    return ok(clonar(configuracion))
}

export async function simularSiguienteFallo(status = 500) {
    const codigo = STATUS_SIMULABLES.includes(Number(status)) ? Number(status) : 500
    falloForzado = {
        status: codigo,
        mensaje: mensajeDeStatus(codigo),
    }

    return ok({ status: codigo, mensaje: falloForzado.mensaje })
}

export async function obtenerEstadoSimulador() {
    return ok({
        configuracion: clonar(leerConfiguracion()),
        falloForzado: falloForzado ? { ...falloForzado } : null,
        fallarEnUrl: statusDeUrl(),
    })
}

export async function reiniciarDatosDePrueba() {
    try {
        await reiniciarDb()
        borrarSesion()
        falloForzado = null

        return ok({ mensaje: 'Datos de prueba restablecidos.' })
    } catch (error) {
        console.error('[api] No se pudieron restablecer los datos:', error)

        return fallo('No se pudieron restablecer los datos de prueba.', 500)
    }
}
