/**
 * Base de datos simulada.
 *
 * La primera vez copia los cuatro JSON de `public/mocks/` a localStorage.
 * A partir de ahí todas las lecturas y escrituras pasan por este módulo.
 * Si localStorage no está disponible, mantiene una copia en memoria para que
 * la aplicación siga funcionando durante la sesión.
 */

const CLAVE = 'maldops.db.v1'
const VERSION = 1
const COLECCIONES = ['usuarios', 'clientes', 'ventas', 'preguntas']

let memoria = null
let promesaInicializacion = null

export function clonar(valor) {
    if (typeof structuredClone === 'function') {
        return structuredClone(valor)
    }

    return JSON.parse(JSON.stringify(valor))
}

function almacen() {
    try {
        return globalThis.localStorage || null
    } catch {
        return null
    }
}

function baseUrl() {
    const base = (import.meta.env && import.meta.env.BASE_URL) || '/'

    return base.endsWith('/') ? base : `${base}/`
}

function esColeccionValida(colecciones) {
    return Boolean(
        colecciones &&
            typeof colecciones === 'object' &&
            COLECCIONES.every((nombre) => Array.isArray(colecciones[nombre])),
    )
}

function leerCrudo() {
    const storage = almacen()

    if (!storage) {
        return memoria ? clonar(memoria) : null
    }

    try {
        const texto = storage.getItem(CLAVE)

        if (!texto) {
            return null
        }

        const guardado = JSON.parse(texto)

        if (guardado.version !== VERSION || !esColeccionValida(guardado.colecciones)) {
            return null
        }

        return guardado.colecciones
    } catch {
        return null
    }
}

export function guardarDb(colecciones) {
    if (!esColeccionValida(colecciones)) {
        throw new Error('La base de datos simulada no tiene el formato esperado.')
    }

    const copia = clonar(colecciones)
    memoria = copia

    const storage = almacen()

    if (!storage) {
        return copia
    }

    try {
        storage.setItem(
            CLAVE,
            JSON.stringify({
                version: VERSION,
                actualizadoEn: new Date().toISOString(),
                colecciones: copia,
            }),
        )
    } catch {
        // Sin almacenamiento persistente: la copia en memoria evita romper la
        // aplicación en modo privado o cuando la cuota está llena.
    }

    return copia
}

export function leerDb() {
    const colecciones = leerCrudo()

    return colecciones ? clonar(colecciones) : null
}

async function cargarMocks() {
    const entradas = await Promise.all(
        COLECCIONES.map(async (nombre) => {
            const url = `${baseUrl()}mocks/${nombre}.json`
            const respuesta = await fetch(url, { cache: 'no-store' })

            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar ${url} (HTTP ${respuesta.status}).`)
            }

            const datos = await respuesta.json()

            if (!Array.isArray(datos)) {
                throw new Error(`El mock ${nombre}.json no contiene una lista.`)
            }

            return [nombre, datos]
        }),
    )

    return Object.fromEntries(entradas)
}

/**
 * Devuelve la base simulada. Si es la primera vez (o si se pidió reiniciar),
 * copia los mocks a localStorage.
 */
export async function inicializarDb() {
    const guardada = leerCrudo()

    if (guardada) {
        return clonar(guardada)
    }

    if (promesaInicializacion) {
        return promesaInicializacion
    }

    promesaInicializacion = cargarMocks()
        .then((colecciones) => guardarDb(colecciones))
        .catch((error) => {
            promesaInicializacion = null
            throw error
        })

    return promesaInicializacion
}

export async function reiniciarDb() {
    memoria = null
    promesaInicializacion = null

    try {
        globalThis.localStorage?.removeItem(CLAVE)
    } catch {
        // Si no se puede limpiar el almacenamiento, la copia en memoria ya se
        // descartó y se vuelve a cargar desde los mocks.
    }

    return inicializarDb()
}

/**
 * Genera el siguiente id de una colección respetando el formato `prefijo-000`.
 */
export function siguienteId(coleccion, prefijo) {
    const numeros = coleccion
        .map((elemento) => String(elemento.id || ''))
        .filter((id) => id.startsWith(`${prefijo}-`))
        .map((id) => Number.parseInt(id.slice(prefijo.length + 1), 10))
        .filter((numero) => Number.isInteger(numero) && numero > 0)

    const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1

    return `${prefijo}-${String(siguiente).padStart(3, '0')}`
}
