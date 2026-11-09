/**
 * Dashboard: métricas y listas recientes desde la API simulada.
 *
 * Carga clientes y ventas en paralelo, muestra esqueleto mientras espera,
 * estado vacío si no hay actividad y error con «Reintentar» si falla.
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

const estado = document.querySelector('#dashboard-estado')
const contenido = document.querySelector('#dashboard-contenido')
const numeroClientes = document.querySelector('#dashboard-clientes')
const numeroVentas = document.querySelector('#dashboard-ventas')
const numeroGanancias = document.querySelector('#dashboard-ganancias')
const numeroTicket = document.querySelector('#dashboard-ticket')
const tablaVentas = document.querySelector('#dashboard-ventas-tabla')
const cuerpoVentas = document.querySelector('#dashboard-ventas-cuerpo')
const tablaClientes = document.querySelector('#dashboard-clientes-tabla')
const cuerpoClientes = document.querySelector('#dashboard-clientes-cuerpo')

function pintarMetricas(clientes, ventas) {
    const ganancias = ventas.reduce((total, venta) => total + (Number(venta.precio) || 0), 0)
    const ticket = ventas.length > 0 ? Math.round(ganancias / ventas.length) : 0

    numeroClientes.textContent = String(clientes.length)
    numeroVentas.textContent = String(ventas.length)
    numeroGanancias.textContent = formatearPrecio(ganancias)
    numeroTicket.textContent = formatearPrecio(ticket)
}

function pintarVentas(ventas, nombresPorId) {
    const recientes = ventas.slice(-8).reverse()
    const fragmento = document.createDocumentFragment()

    for (const venta of recientes) {
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

    cuerpoVentas.replaceChildren(fragmento)
    tablaVentas.hidden = recientes.length === 0
}

function pintarClientes(clientes) {
    const fragmento = document.createDocumentFragment()

    for (const cliente of clientes.slice(0, 5)) {
        const fila = document.createElement('tr')

        const nombre = document.createElement('td')
        nombre.textContent = cliente.nombre

        const estatus = document.createElement('td')
        estatus.append(crearBadgeEstatus(cliente.estatus))

        fila.append(nombre, estatus)
        fragmento.append(fila)
    }

    cuerpoClientes.replaceChildren(fragmento)
    tablaClientes.hidden = clientes.length === 0
}

function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 2, columnas: 4 }))
    contenido.hidden = true
}

function mostrarError(mensaje) {
    estado.replaceChildren(
        crearError({
            titulo: 'No se pudo cargar el dashboard',
            mensaje,
            alReintentar: cargarDashboard,
        }),
    )
    contenido.hidden = true
}

function mostrarVacio() {
    estado.replaceChildren(
        crearVacio({
            titulo: 'Todavía no hay actividad',
            mensaje: 'Cuando registres clientes y ventas verás aquí el resumen.',
        }),
    )
    contenido.hidden = true
}

async function cargarDashboard() {
    mostrarCargando()

    try {
        const [respuestaClientes, respuestaVentas] = await Promise.all([
            api.clientes.listar(),
            api.ventas.listar(),
        ])

        if (esNoAutorizado(respuestaClientes) || esNoAutorizado(respuestaVentas)) {
            irAlLogin()
            return
        }

        if (!respuestaClientes.ok) {
            mostrarError(
                mensajeDeError(respuestaClientes, 'No se pudieron cargar los clientes.'),
            )
            return
        }

        if (!respuestaVentas.ok) {
            mostrarError(mensajeDeError(respuestaVentas, 'No se pudieron cargar las ventas.'))
            return
        }

        const clientes = Array.isArray(respuestaClientes.data) ? respuestaClientes.data : []
        const ventas = Array.isArray(respuestaVentas.data) ? respuestaVentas.data : []

        if (clientes.length === 0 && ventas.length === 0) {
            mostrarVacio()
            return
        }

        const nombresPorId = new Map(
            clientes.map((cliente) => [cliente.id, cliente.nombre]),
        )

        pintarMetricas(clientes, ventas)
        pintarVentas(ventas, nombresPorId)
        pintarClientes(clientes)

        estado.replaceChildren()
        contenido.hidden = false
    } catch {
        mostrarError('No se pudo cargar el dashboard. Revisa tu conexión e intenta de nuevo.')
    }
}

if (estado && contenido && cuerpoVentas && cuerpoClientes) {
    cargarDashboard()
}

   // [IA] inicio · ia/2026-11-09_ManoloDeus_saludo-dashboard.md
   function pintarSaludo() {
       const titulo = document.querySelector('#saludo-titulo')
       const fecha = document.querySelector('#saludo-fecha')

       if (!titulo || !fecha) {
           return
       }

       const hora = new Date().getHours()
       const momento = hora < 12 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches'
       const nombre = (window.__sesion?.nombre || 'Usuario').split(' ')[0]

       titulo.textContent = `${momento}, ${nombre}`
       fecha.textContent = new Date().toLocaleDateString('es-CL', {
           weekday: 'long',
           day: 'numeric',
           month: 'long',
           year: 'numeric',
       })
   }

   pintarSaludo()
   // [IA] fin