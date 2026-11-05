/**
 * Componentes de interfaz compartidos por las vistas.
 *
 * Solo construyen nodos y aplican clases del sistema de diseño. No acceden a
 * datos ni a localStorage.
 */

const CLASES_ESTATUS = {
    Activo: 'entregado',
    Confirmado: 'entregado',
    Inactivo: 'devuelto',
    Devuelto: 'devuelto',
    Pendiente: 'pendiente',
    'En Progreso': 'en-progreso',
}

export function crearCargando({ filas = 5, columnas = 3, mensaje = 'Cargando…' } = {}) {
    const contenedor = document.createElement('div')
    contenedor.className = 'estado-carga'
    contenedor.setAttribute('role', 'status')
    contenedor.setAttribute('aria-live', 'polite')

    const texto = document.createElement('p')
    texto.className = 'sr-only'
    texto.textContent = mensaje
    contenedor.append(texto)

    const esqueleto = document.createElement('div')
    esqueleto.className = 'skeleton-tabla'
    esqueleto.setAttribute('aria-hidden', 'true')
    esqueleto.style.setProperty('--columnas', String(columnas))

    for (let fila = 0; fila < filas; fila += 1) {
        const linea = document.createElement('div')
        linea.className = 'skeleton-fila'

        for (let columna = 0; columna < columnas; columna += 1) {
            const barra = document.createElement('span')
            barra.className = 'skeleton'
            barra.style.width = `${70 + ((fila + columna) % 3) * 10}%`
            linea.append(barra)
        }

        esqueleto.append(linea)
    }

    contenedor.append(esqueleto)

    return contenedor
}

export function crearVacio({
    titulo = 'Todavía no hay datos',
    mensaje = 'Cuando se registre información aparecerá aquí.',
} = {}) {
    const contenedor = document.createElement('div')
    contenedor.className = 'estado-vacio'
    contenedor.setAttribute('role', 'status')

    const encabezado = document.createElement('h3')
    encabezado.className = 'estado-titulo'
    encabezado.textContent = titulo

    const detalle = document.createElement('p')
    detalle.className = 'estado-detalle'
    detalle.textContent = mensaje

    contenedor.append(encabezado, detalle)

    return contenedor
}

export function crearError({
    titulo = 'No se pudieron cargar los datos',
    mensaje = 'Ocurrió un error inesperado. Intenta de nuevo.',
    alReintentar,
} = {}) {
    const contenedor = document.createElement('div')
    contenedor.className = 'estado-error'
    contenedor.setAttribute('role', 'alert')

    const encabezado = document.createElement('h3')
    encabezado.className = 'estado-titulo'
    encabezado.textContent = titulo

    const detalle = document.createElement('p')
    detalle.className = 'estado-detalle'
    detalle.textContent = mensaje

    contenedor.append(encabezado, detalle)

    if (typeof alReintentar === 'function') {
        const boton = document.createElement('button')
        boton.type = 'button'
        boton.className = 'btn btn-primary'
        boton.textContent = 'Reintentar'
        boton.addEventListener('click', alReintentar)
        contenedor.append(boton)
    }

    return contenedor
}

export function crearBadgeEstatus(estatus) {
    const badge = document.createElement('span')
    const clase = CLASES_ESTATUS[estatus]

    badge.className = clase ? `estatus ${clase}` : 'estatus'
    badge.textContent = estatus

    return badge
}

export function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(Number(precio) || 0)
}

export function mensajeDeError(respuesta, porDefecto = 'Ocurrió un error inesperado.') {
    return respuesta && respuesta.error ? respuesta.error : porDefecto
}

/**
 * Muestra un aviso flotante durante unos segundos.
 */
export function mostrarToast(mensaje, tipo = 'exito') {
    if (typeof document === 'undefined') {
        return
    }

    let contenedor = document.querySelector('.toasts')

    if (!contenedor) {
        contenedor = document.createElement('div')
        contenedor.className = 'toasts'
        contenedor.setAttribute('aria-live', 'polite')
        document.body.append(contenedor)
    }

    const toast = document.createElement('div')
    toast.className = `toast toast-${tipo}`
    toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status')
    toast.textContent = mensaje
    contenedor.append(toast)

    window.setTimeout(() => {
        toast.remove()

        if (contenedor && contenedor.childElementCount === 0) {
            contenedor.remove()
        }
    }, 4500)
}

/**
 * Pide confirmación con el <dialog> compartido de la página.
 * Devuelve true solo si se pulsa el botón de confirmar.
 */
export function confirmarAccion(
    mensaje,
    { titulo = 'Confirmar eliminación', textoConfirmar = 'Eliminar' } = {},
) {
    const dialogo = document.querySelector('#confirmar-dialogo')

    if (!dialogo || typeof dialogo.showModal !== 'function') {
        return Promise.resolve(window.confirm(mensaje))
    }

    dialogo.querySelector('#confirmar-titulo').textContent = titulo
    dialogo.querySelector('#confirmar-mensaje').textContent = mensaje

    const boton = dialogo.querySelector('[value="confirmar"]')
    boton.textContent = textoConfirmar
    dialogo.returnValue = ''
    dialogo.showModal()

    return new Promise((resolver) => {
        dialogo.addEventListener(
            'close',
            () => resolver(dialogo.returnValue === 'confirmar'),
            { once: true },
        )
    })
}
