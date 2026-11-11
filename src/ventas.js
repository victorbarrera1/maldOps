/**
 * Vista de ventas: lista con estados de interfaz y CRUD completo.
 *
 * La API devuelve `clienteId`; para mostrar nombres y llenar el formulario se
 * carga también el listado de clientes, siempre a través de `api.js`.
 */

import api from './api.js'
import { irAlLogin, esNoAutorizado } from './guard.js'
import {
    crearCargando,
    crearVacio,
    crearError,
    crearBadgeEstatus,
    formatearPrecio,
    mensajeDeError,
    mostrarToast,
    confirmarAccion,
} from './ui.js'
// [IA] inicio · ia/2026-11-11_victorbarrera1_exportar-buscador-contactos.md
import { descargarCsv, fechaParaArchivo } from './exportar.js'
// [IA] fin

const estado = document.querySelector('#ventas-estado')
const tabla = document.querySelector('#ventas-tabla')
const cuerpo = document.querySelector('#ventas-cuerpo')
const total = document.querySelector('#ventas-total')
const botonNuevo = document.querySelector('#nueva-venta')
const dialogo = document.querySelector('#venta-dialogo')
const formulario = document.querySelector('#venta-form')
const tituloDialogo = document.querySelector('#venta-dialogo-titulo')
const campoCliente = document.querySelector('#venta-cliente')
const campoPrecio = document.querySelector('#venta-precio')
const campoServicio = document.querySelector('#venta-servicio')
const campoEstatus = document.querySelector('#venta-estatus')
const errorCliente = document.querySelector('#venta-error-cliente')
const errorPrecio = document.querySelector('#venta-error-precio')
const errorServicio = document.querySelector('#venta-error-servicio')
const errorEstatus = document.querySelector('#venta-error-estatus')
const errorGeneral = document.querySelector('#venta-error-general')
const botonCancelar = document.querySelector('#venta-cancelar')
const botonGuardar = document.querySelector('#venta-guardar')
const esAdmin = window.__sesion?.rol === 'admin'

let ventasActuales = []
let clientesActuales = []
let nombresPorId = new Map()
let ventaEnEdicion = null
let consultaVentas = ''

function crearBotonAccion(texto, clase, etiqueta, alPulsar) {
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.className = `btn btn-sm ${clase}`.trim()
    boton.textContent = texto
    boton.setAttribute('aria-label', etiqueta)
    boton.addEventListener('click', alPulsar)

    return boton
}

function pintarFilas(ventas) {
    const fragmento = document.createDocumentFragment()

    for (const venta of ventas) {
        const fila = document.createElement('tr')
        const nombreCliente = nombresPorId.get(venta.clienteId) || 'Cliente no disponible'

        const cliente = document.createElement('td')
        cliente.textContent = nombreCliente

        const precio = document.createElement('td')
        precio.textContent = formatearPrecio(venta.precio)

        const servicio = document.createElement('td')
        servicio.textContent = venta.servicio

        const estatus = document.createElement('td')
        estatus.append(crearBadgeEstatus(venta.estatus))

        const acciones = document.createElement('td')
        acciones.className = 'acciones-tabla'
        acciones.append(
            crearBotonAccion(
                'Editar',
                '',
                `Editar la venta de ${nombreCliente}`,
                () => abrirFormulario(venta),
            ),
        )

        if (esAdmin) {
            acciones.append(
                crearBotonAccion(
                    'Eliminar',
                    'btn-danger',
                    `Eliminar la venta de ${nombreCliente}`,
                    () => eliminarVenta(venta),
                ),
            )
        }

        fila.append(cliente, precio, servicio, estatus, acciones)
        fragmento.append(fila)
    }

    cuerpo.replaceChildren(fragmento)
    tabla.hidden = ventas.length === 0
}

function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 6, columnas: 5 }))
    tabla.hidden = true
    total.textContent = ''

    if (botonNuevo) {
        botonNuevo.disabled = true
    }
}

function mostrarError(mensaje) {
    estado.replaceChildren(
        crearError({
            titulo: 'No se pudieron cargar las ventas',
            mensaje,
            alReintentar: cargarVentas,
        }),
    )
    tabla.hidden = true
    total.textContent = ''

    if (botonNuevo) {
        botonNuevo.disabled = true
    }
}

function mostrarVacio() {
    estado.replaceChildren(
        crearVacio({
            titulo: 'Todavía no hay ventas',
            mensaje: 'Cuando registres una venta aparecerá en esta lista.',
        }),
    )
    tabla.hidden = true
    total.textContent = '0'

    if (botonNuevo) {
        botonNuevo.disabled = false
    }
}

// [IA] inicio · ia/2026-11-11_victorbarrera1_exportar-buscador-contactos.md
/** Muestra las ventas que coinciden con el texto de la barra superior. */
function aplicarFiltroVentas() {
    const texto = consultaVentas.trim().toLowerCase()
    const visibles = ventasActuales.filter((venta) => {
        const nombre = nombresPorId.get(venta.clienteId) || ''

        return (
            !texto ||
            `${nombre} ${venta.servicio} ${venta.estatus} ${venta.id}`
                .toLowerCase()
                .includes(texto)
        )
    })

    total.textContent = String(visibles.length)

    if (visibles.length === 0) {
        pintarFilas([])
        estado.replaceChildren(
            crearVacio({
                titulo: 'Sin resultados',
                mensaje: 'Prueba con otra búsqueda.',
            }),
        )
        return
    }

    estado.replaceChildren()
    pintarFilas(visibles)
}

document.addEventListener('maldops:buscar', (evento) => {
    if (!cuerpo) {
        return
    }

    evento.preventDefault()
    consultaVentas = evento.detail.texto

    if (ventasActuales.length > 0) {
        aplicarFiltroVentas()
    }
})
// [IA] fin

async function cargarVentas() {
    mostrarCargando()

    try {
        const [respuestaVentas, respuestaClientes] = await Promise.all([
            api.ventas.listar(),
            api.clientes.listar(),
        ])

        if (esNoAutorizado(respuestaVentas) || esNoAutorizado(respuestaClientes)) {
            irAlLogin()
            return
        }

        if (!respuestaVentas.ok) {
            mostrarError(mensajeDeError(respuestaVentas, 'No se pudieron cargar las ventas.'))
            return
        }

        if (!respuestaClientes.ok) {
            mostrarError(
                mensajeDeError(respuestaClientes, 'No se pudieron cargar los clientes.'),
            )
            return
        }

        ventasActuales = Array.isArray(respuestaVentas.data) ? respuestaVentas.data : []
        clientesActuales = Array.isArray(respuestaClientes.data) ? respuestaClientes.data : []
        nombresPorId = new Map(
            clientesActuales.map((cliente) => [cliente.id, cliente.nombre]),
        )

        if (ventasActuales.length === 0) {
            mostrarVacio()
            return
        }

        aplicarFiltroVentas()
        botonNuevo.disabled = false
    } catch {
        mostrarError('No se pudieron cargar las ventas. Revisa tu conexión e intenta de nuevo.')
    }
}

function limpiarErroresFormulario() {
    for (const nodo of [
        errorCliente,
        errorPrecio,
        errorServicio,
        errorEstatus,
        errorGeneral,
    ]) {
        if (nodo) {
            nodo.textContent = ''
            nodo.hidden = true
        }
    }

    for (const campo of [campoCliente, campoPrecio, campoServicio, campoEstatus]) {
        campo.removeAttribute('aria-invalid')
    }
}

function mostrarErrorCampo(clave, mensaje) {
    const mapa = {
        clienteId: { nodo: errorCliente, campo: campoCliente },
        precio: { nodo: errorPrecio, campo: campoPrecio },
        servicio: { nodo: errorServicio, campo: campoServicio },
        estatus: { nodo: errorEstatus, campo: campoEstatus },
    }
    const entrada = mapa[clave]

    if (!entrada) {
        return null
    }

    entrada.nodo.textContent = mensaje
    entrada.nodo.hidden = false
    entrada.campo.setAttribute('aria-invalid', 'true')

    return entrada.campo
}

function mostrarErroresFormulario(errores) {
    let primero = null

    for (const clave of ['clienteId', 'precio', 'servicio', 'estatus']) {
        if (errores[clave]) {
            const campo = mostrarErrorCampo(clave, errores[clave])
            primero = primero || campo
        }
    }

    primero?.focus()

    return Boolean(primero)
}

function pintarOpcionesClientes(clienteId = '') {
    const fragmento = document.createDocumentFragment()
    const vacio = document.createElement('option')
    vacio.value = ''
    vacio.textContent = 'Selecciona un cliente'
    fragmento.append(vacio)

    for (const cliente of clientesActuales) {
        const opcion = document.createElement('option')
        opcion.value = cliente.id
        opcion.textContent = cliente.nombre
        fragmento.append(opcion)
    }

    campoCliente.replaceChildren(fragmento)
    campoCliente.value = clienteId
}

function abrirFormulario(venta = null) {
    ventaEnEdicion = venta ? venta.id : null
    tituloDialogo.textContent = venta ? 'Editar venta' : 'Nueva venta'
    pintarOpcionesClientes(venta ? venta.clienteId : '')
    campoPrecio.value = venta ? String(venta.precio) : ''
    campoServicio.value = venta ? venta.servicio : 'META ADS'
    campoEstatus.value = venta ? venta.estatus : 'Pendiente'
    limpiarErroresFormulario()
    dialogo.showModal()
    campoCliente.focus()
}

async function guardarVenta(evento) {
    evento.preventDefault()

    limpiarErroresFormulario()
    botonGuardar.disabled = true
    const textoBoton = botonGuardar.textContent
    botonGuardar.textContent = 'Guardando…'

    try {
        const datos = {
            clienteId: campoCliente.value,
            precio: Number(campoPrecio.value),
            servicio: campoServicio.value,
            estatus: campoEstatus.value,
        }
        const respuesta = ventaEnEdicion
            ? await api.ventas.actualizar(ventaEnEdicion, datos)
            : await api.ventas.crear(datos)

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            const errores = respuesta.errores || {}

            if (respuesta.status === 422 && mostrarErroresFormulario(errores)) {
                return
            }

            errorGeneral.textContent = mensajeDeError(respuesta, 'No se pudo guardar la venta.')
            errorGeneral.hidden = false
            return
        }

        dialogo.close()
        mostrarToast(ventaEnEdicion ? 'Venta actualizada.' : 'Venta creada.')
        await cargarVentas()
    } catch {
        errorGeneral.textContent = 'No se pudo guardar la venta. Revisa tu conexión.'
        errorGeneral.hidden = false
    } finally {
        botonGuardar.disabled = false
        botonGuardar.textContent = textoBoton
    }
}

async function eliminarVenta(venta) {
    const nombre = nombresPorId.get(venta.clienteId) || 'este cliente'
    const confirmado = await confirmarAccion(
        `¿Eliminar la venta de «${nombre}» por ${formatearPrecio(venta.precio)}? Esta acción no se puede deshacer.`,
    )

    if (!confirmado) {
        return
    }

    try {
        const respuesta = await api.ventas.eliminar(venta.id)

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            mostrarToast(mensajeDeError(respuesta, 'No se pudo eliminar la venta.'), 'error')
            return
        }

        mostrarToast('Venta eliminada.')
        await cargarVentas()
    } catch {
        mostrarToast('No se pudo eliminar la venta. Revisa tu conexión.', 'error')
    }
}

// [IA] inicio · ia/2026-11-11_victorbarrera1_exportar-buscador-contactos.md
/**
 * Reportes exportables. Las ventas no tienen fecha, así que el historial se
 * ordena por cliente y luego por el orden de registro (id). Igual que el
 * dashboard, todos los reportes cuentan todas las ventas, incluidas las
 * devueltas; el estatus va como columna para poder filtrar en Excel.
 */
function filasDeVentas() {
    return ventasActuales.map((venta) => ({
        id: venta.id,
        cliente: nombresPorId.get(venta.clienteId) || 'Cliente desconocido',
        servicio: venta.servicio,
        precio: Number(venta.precio) || 0,
        estatus: venta.estatus,
    }))
}

const REPORTES = {
    ventas: {
        archivo: 'reporte-de-ventas',
        columnas: ['ID', 'Cliente', 'Servicio', 'Precio (CLP)', 'Estatus'],
        construir: () =>
            filasDeVentas().map((v) => [v.id, v.cliente, v.servicio, v.precio, v.estatus]),
    },
    campanas: {
        archivo: 'campanas-mas-vendidas',
        columnas: ['Posición', 'Servicio', 'Cantidad de ventas', 'Total vendido (CLP)'],
        construir: () => {
            const porServicio = new Map()

            for (const venta of filasDeVentas()) {
                const acumulado = porServicio.get(venta.servicio) || { cantidad: 0, total: 0 }
                acumulado.cantidad += 1
                acumulado.total += venta.precio
                porServicio.set(venta.servicio, acumulado)
            }

            return [...porServicio.entries()]
                .sort(
                    ([, a], [, b]) => b.cantidad - a.cantidad || b.total - a.total,
                )
                .map(([servicio, datos], indice) => [
                    indice + 1,
                    servicio,
                    datos.cantidad,
                    datos.total,
                ])
        },
    },
    historial: {
        archivo: 'historial-de-ventas',
        columnas: ['Cliente', 'ID de venta', 'Servicio', 'Precio (CLP)', 'Estatus'],
        construir: () =>
            filasDeVentas()
                .sort(
                    (a, b) =>
                        a.cliente.localeCompare(b.cliente, 'es') || a.id.localeCompare(b.id),
                )
                .map((v) => [v.cliente, v.id, v.servicio, v.precio, v.estatus]),
    },
}

function exportarReporte(tipo, boton) {
    const reporte = REPORTES[tipo]

    if (!reporte) {
        return
    }

    if (ventasActuales.length === 0) {
        mostrarToast('No hay ventas para exportar todavía.', 'error')
        return
    }

    try {
        descargarCsv(
            `${reporte.archivo}-${fechaParaArchivo()}.csv`,
            reporte.columnas,
            reporte.construir(),
        )
        mostrarToast('Reporte descargado. Se abre con Excel.')
    } catch {
        mostrarToast('No se pudo generar el archivo. Intenta de nuevo.', 'error')
    } finally {
        boton.blur()
    }
}

document.querySelectorAll('[data-exportar]').forEach((boton) => {
    boton.addEventListener('click', () => exportarReporte(boton.dataset.exportar, boton))
})
// [IA] fin

if (estado && tabla && cuerpo && total) {
    cargarVentas()
}

if (botonNuevo && dialogo && formulario) {
    botonNuevo.addEventListener('click', () => abrirFormulario())
    botonCancelar.addEventListener('click', () => dialogo.close())
    formulario.addEventListener('submit', guardarVenta)
}
