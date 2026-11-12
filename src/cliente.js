/**
 * Detalle de un cliente: ficha y ventas asociadas.
 *
 * La vista solo usa la fachada `api.js`. El id llega por `?id=` y la carga de
 * cliente y ventas se hace en paralelo. Los estados de carga, 404, error y
 * sesión vencida se resuelven con los componentes compartidos de `ui.js`.
 */

// [IA] inicio · ia/2026-11-12_victorbarrera1_cliente-detalle.md
import api from './api.js'
import { irAlLogin, esNoAutorizado } from './guard.js'
import {
    crearCargando,
    crearVacio,
    crearError,
    crearBadgeEstatus,
    formatearPrecio,
    mensajeDeError,
} from './ui.js'

const estado = document.querySelector('#cliente-estado')
const contenido = document.querySelector('#cliente-contenido')
const nombre = document.querySelector('#cliente-nombre')
const estatus = document.querySelector('#cliente-estatus')
const nota = document.querySelector('#cliente-nota')
const favorito = document.querySelector('#cliente-favorito')
const ventasEstado = document.querySelector('#cliente-ventas-estado')
const ventasTotal = document.querySelector('#cliente-ventas-total')
const ventasTabla = document.querySelector('#cliente-ventas-tabla')
const ventasCuerpo = document.querySelector('#cliente-ventas-cuerpo')

const parametros = new URLSearchParams(window.location.search)
const id = (parametros.get('id') || '').trim()

function mostrarCargando() {
    estado.replaceChildren(
        crearCargando({ filas: 3, columnas: 3, mensaje: 'Cargando cliente…' }),
    )
    contenido.hidden = true
}

function mostrarNoEncontrado(mensaje) {
    const bloque = crearVacio({
        titulo: 'Cliente no encontrado',
        mensaje,
    })

    const enlace = document.createElement('a')
    enlace.className = 'btn'
    enlace.href = 'clientes.html'
    enlace.textContent = 'Volver a Clientes'
    bloque.append(enlace)

    estado.replaceChildren(bloque)
    contenido.hidden = true
    document.title = 'Cliente no encontrado - MaldOps'
}

function mostrarError(mensaje) {
    estado.replaceChildren(
        crearError({
            titulo: 'No se pudo cargar el cliente',
            mensaje,
            alReintentar: cargarCliente,
        }),
    )
    contenido.hidden = true
}

function pintarVentas(ventas) {
    const total = ventas.reduce((suma, venta) => suma + (Number(venta.precio) || 0), 0)
    const cantidad = ventas.length
    ventasTotal.textContent = `${cantidad} ${cantidad === 1 ? 'venta' : 'ventas'} · ${formatearPrecio(total)}`

    if (cantidad === 0) {
        ventasEstado.replaceChildren(
            crearVacio({
                titulo: 'Sin ventas registradas',
                mensaje: 'Cuando registres una venta para este cliente aparecerá aquí.',
            }),
        )
        ventasTabla.hidden = true
        return
    }

    const fragmento = document.createDocumentFragment()

    for (const venta of ventas) {
        const fila = document.createElement('tr')

        const servicio = document.createElement('td')
        servicio.textContent = venta.servicio

        const precio = document.createElement('td')
        precio.textContent = formatearPrecio(venta.precio)

        const celdaEstatus = document.createElement('td')
        celdaEstatus.append(crearBadgeEstatus(venta.estatus))

        fila.append(servicio, precio, celdaEstatus)
        fragmento.append(fila)
    }

    ventasEstado.replaceChildren()
    ventasCuerpo.replaceChildren(fragmento)
    ventasTabla.hidden = false
}

function pintarCliente(cliente, ventas) {
    nombre.textContent = cliente.nombre
    estatus.replaceChildren(crearBadgeEstatus(cliente.estatus))

    if (cliente.nota) {
        nota.textContent = cliente.nota
        nota.hidden = false
    } else {
        nota.textContent = ''
        nota.hidden = true
    }

    if (cliente.favorito === true) {
        favorito.textContent = '★ Cliente favorito'
        favorito.hidden = false
    } else {
        favorito.textContent = ''
        favorito.hidden = true
    }

    document.title = `${cliente.nombre} - MaldOps`
    pintarVentas(ventas)
    estado.replaceChildren()
    contenido.hidden = false
}

async function cargarCliente() {
    if (!id) {
        mostrarNoEncontrado('Falta el id del cliente en la dirección.')
        return
    }

    mostrarCargando()

    try {
        const [respuestaCliente, respuestaVentas] = await Promise.all([
            api.clientes.obtener(id),
            api.ventas.deCliente(id),
        ])

        if (esNoAutorizado(respuestaCliente) || esNoAutorizado(respuestaVentas)) {
            irAlLogin()
            return
        }

        if (respuestaCliente.status === 404 || respuestaVentas.status === 404) {
            mostrarNoEncontrado('El cliente que buscas no existe o fue eliminado.')
            return
        }

        if (!respuestaCliente.ok) {
            mostrarError(
                mensajeDeError(respuestaCliente, 'No se pudo cargar el cliente.'),
            )
            return
        }

        if (!respuestaVentas.ok) {
            mostrarError(
                mensajeDeError(
                    respuestaVentas,
                    'No se pudieron cargar las ventas del cliente.',
                ),
            )
            return
        }

        const cliente = respuestaCliente.data

        if (!cliente || typeof cliente !== 'object') {
            mostrarError('La respuesta del cliente no tiene el formato esperado.')
            return
        }

        const ventas = Array.isArray(respuestaVentas.data) ? respuestaVentas.data : []

        pintarCliente(cliente, ventas)
    } catch {
        mostrarError('No se pudo cargar el cliente. Revisa tu conexión e intenta de nuevo.')
    }
}

if (estado && contenido && nombre && ventasTabla && ventasCuerpo) {
    cargarCliente()
}
// [IA] fin
