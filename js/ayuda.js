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
const tabla = document.querySelector('#ayuda-tabla')
const cuerpo = document.querySelector('#ayuda-cuerpo')
const total = document.querySelector('#ayuda-total')

function pintarPreguntas(preguntas) {
    const fragmento = document.createDocumentFragment()

    for (const pregunta of preguntas) {
        const fila = document.createElement('tr')

        const titulo = document.createElement('td')
        titulo.textContent = pregunta.pregunta

        const respuesta = document.createElement('td')
        respuesta.textContent = pregunta.respuesta

        fila.append(titulo, respuesta)
        fragmento.append(fila)
    }

    cuerpo.replaceChildren(fragmento)
    tabla.hidden = preguntas.length === 0
}

function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 5, columnas: 2 }))
    tabla.hidden = true
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
    tabla.hidden = true
    total.textContent = ''
}

function mostrarVacio() {
    estado.replaceChildren(
        crearVacio({
            titulo: 'Todavía no hay preguntas frecuentes',
            mensaje: 'Cuando se publiquen aparecerán en esta sección.',
        }),
    )
    tabla.hidden = true
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

if (estado && tabla && cuerpo && total) {
    cargarPreguntas()
}
