/**
 * Vista de clientes: estados de carga, vacío, error y tabla.
 *
 * Solo usa la fachada `api.js`. En 401 vuelve al login con el guard.
 */

import api from './api.js'
import { irAlLogin, esNoAutorizado } from './guard.js'
import {
    crearCargando,
    crearVacio,
    crearError,
    crearBadgeEstatus,
    mensajeDeError,
} from './ui.js'

const estado = document.querySelector('#clientes-estado')
const tabla = document.querySelector('#clientes-tabla')
const cuerpo = document.querySelector('#clientes-cuerpo')
const total = document.querySelector('#clientes-total')

function pintarFilas(clientes) {
    const fragmento = document.createDocumentFragment()

    for (const cliente of clientes) {
        const fila = document.createElement('tr')

        const nombre = document.createElement('td')
        nombre.textContent = cliente.nombre

        const estatus = document.createElement('td')
        estatus.append(crearBadgeEstatus(cliente.estatus))

        fila.append(nombre, estatus)
        fragmento.append(fila)
    }

    cuerpo.replaceChildren(fragmento)
    tabla.hidden = clientes.length === 0
}

function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 6, columnas: 2 }))
    tabla.hidden = true
    total.textContent = ''
}

function mostrarError(mensaje) {
    estado.replaceChildren(
        crearError({
            titulo: 'No se pudieron cargar los clientes',
            mensaje,
            alReintentar: cargarClientes,
        }),
    )
    tabla.hidden = true
    total.textContent = ''
}

function mostrarVacio() {
    estado.replaceChildren(
        crearVacio({
            titulo: 'Todavía no hay clientes',
            mensaje: 'Cuando registres un cliente aparecerá en esta lista.',
        }),
    )
    tabla.hidden = true
    total.textContent = '0'
}

async function cargarClientes() {
    mostrarCargando()

    try {
        const respuesta = await api.clientes.listar()

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            mostrarError(mensajeDeError(respuesta, 'No se pudieron cargar los clientes.'))
            return
        }

        const clientes = Array.isArray(respuesta.data) ? respuesta.data : []

        if (clientes.length === 0) {
            mostrarVacio()
            return
        }

        estado.replaceChildren()
        total.textContent = String(clientes.length)
        pintarFilas(clientes)
    } catch {
        mostrarError('No se pudieron cargar los clientes. Revisa tu conexión e intenta de nuevo.')
    }
}

if (estado && tabla && cuerpo && total) {
    cargarClientes()
}
