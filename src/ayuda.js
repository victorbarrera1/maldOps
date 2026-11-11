/**
 * Vista de ayuda: preguntas frecuentes desde la API simulada.
 *
 * Solo usa `api.js`; muestra esqueleto, vacío y error con «Reintentar».
 */

import api from './api.js'
import { irAlLogin, esNoAutorizado } from './guard.js'
import {
    crearCargando,
    crearVacio,
    crearError,
    mensajeDeError,
} from './ui.js'

const estado = document.querySelector('#ayuda-estado')
const lista = document.querySelector('#ayuda-lista')
const total = document.querySelector('#ayuda-total')

function pintarPreguntas(preguntas) {
    const fragmento = document.createDocumentFragment()

    for (const pregunta of preguntas) {
        const item = document.createElement('div')
        item.setAttribute('x-data', '{ abierto: false }')
        
        const titulo = document.createElement('button')
        titulo.textContent = pregunta.pregunta
        titulo.setAttribute('x-on:click', 'abierto = !abierto')
        titulo.setAttribute('x-bind:aria-expanded', 'abierto')
        const respuesta = document.createElement('p')
        respuesta.textContent = pregunta.respuesta
        respuesta.setAttribute('x-show', 'abierto')
        
        item.append(titulo, respuesta)
        fragmento.append(item)
    }

    lista.replaceChildren(fragmento)
    lista.hidden = preguntas.length === 0
}

function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 5, columnas: 1 }))
    lista.hidden = false
    total.textContent = ''
}

function mostrarError(mensaje) {
    estado.replaceChildren(
        crearError({
            titulo: 'No se pudieron cargar las preguntas',
            mensaje,
            alReintentar: cargarPreguntas,
        }),
    )
    lista.hidden = true
    total.textContent = ''
}

function mostrarVacio() {
    estado.replaceChildren(
        crearVacio({
            titulo: 'Todavía no hay preguntas frecuentes',
            mensaje: 'Cuando se publiquen aparecerán en esta sección.',
        }),
    )
    lista.hidden = true
    total.textContent = '0'
}

async function cargarPreguntas() {
    mostrarCargando()

    try {
        const respuesta = await api.preguntas.listar()

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            mostrarError(
                mensajeDeError(respuesta, 'No se pudieron cargar las preguntas frecuentes.'),
            )
            return
        }

        const preguntas = Array.isArray(respuesta.data) ? respuesta.data : []

        if (preguntas.length === 0) {
            mostrarVacio()
            return
        }

        estado.replaceChildren()
        total.textContent = String(preguntas.length)
        pintarPreguntas(preguntas)
    } catch {
        mostrarError(
            'No se pudieron cargar las preguntas. Revisa tu conexión e intenta de nuevo.',
        )
    }
}

if (estado && lista && total) {
    cargarPreguntas()
}
