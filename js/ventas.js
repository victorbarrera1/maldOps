/**
 * Vista de ventas: estados de carga, vacío, error y tabla.
 *
 * La API devuelve `clienteId`; para mostrar el nombre se carga también el
 * listado de clientes, siempre a través de la fachada `api.js`.
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
} from './ui.js'

const estado = document.querySelector('#ventas-estado')
const tabla = document.querySelector('#ventas-tabla')
const cuerpo = document.querySelector('#ventas-cuerpo')
const total = document.querySelector('#ventas-total')

function pintarFilas(ventas, nombresPorId) {
    const fragmento = document.createDocumentFragment()

    for (const venta of ventas) {
        const fila = document.createElement('tr')

        const cliente = document.createElement('td')
        cliente.textContent = nombresPorId.get(venta.clienteId) || 'Cliente no disponible'

        const precio = document.createElement('td')
        precio.textContent = formatearPrecio(venta.precio)

        const servicio = document.createElement('td')
        servicio.textContent = venta.servicio

        const estatus = document.createElement('td')
        estatus.append(crearBadgeEstatus(venta.estatus))

        fila.append(cliente, precio, servicio, estatus)
        fragmento.append(fila)
    }

    cuerpo.replaceChildren(fragmento)
    tabla.hidden = ventas.length === 0
}

function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 6, columnas: 4 }))
    tabla.hidden = true
    total.textContent = ''
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
}

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

        const ventas = Array.isArray(respuestaVentas.data) ? respuestaVentas.data : []
        const clientes = Array.isArray(respuestaClientes.data) ? respuestaClientes.data : []
        const nombresPorId = new Map(
            clientes.map((cliente) => [cliente.id, cliente.nombre]),
        )

        if (ventas.length === 0) {
            mostrarVacio()
            return
        }

        estado.replaceChildren()
        total.textContent = String(ventas.length)
        pintarFilas(ventas, nombresPorId)
    } catch {
        mostrarError('No se pudieron cargar las ventas. Revisa tu conexión e intenta de nuevo.')
    }
}

if (estado && tabla && cuerpo && total) {
    cargarVentas()
}
