/**
 * Panel de configuración: simulador de latencia y errores.
 *
 * La vista solo usa la fachada `api.js`; nunca toca localStorage.
 */

import api from './api.js'

const formulario = document.querySelector('#form-simulador')

if (formulario) {
    const latencia = formulario.querySelector('#latencia')
    const probabilidad = formulario.querySelector('#probabilidad-error')
    const estado = formulario.querySelector('#simulador-estado')
    const botonGuardar = formulario.querySelector('#guardar-simulador')
    const botonFallo = formulario.querySelector('#simular-fallo')
    const botonReiniciar = formulario.querySelector('#reiniciar-datos')

    function mostrarEstado(mensaje, tipo = 'info') {
        estado.textContent = mensaje
        estado.style.color =
            tipo === 'error'
                ? 'var(--color-peligro, #b91c1c)'
                : tipo === 'exito'
                  ? 'var(--color-exito, #166534)'
                  : 'var(--color-texto-suave, #475569)'
    }

    function pintarConfiguracion(configuracion) {
        latencia.value = configuracion.latencia
        probabilidad.value = String(configuracion.probabilidadError)
    }

    async function cargarConfiguracion() {
        mostrarEstado('Cargando configuración…')

        try {
            const respuesta = await api.simulador.obtenerConfiguracion()

            if (!respuesta.ok) {
                mostrarEstado(respuesta.error, 'error')
                return
            }

            pintarConfiguracion(respuesta.data)
            mostrarEstado('')
        } catch {
            mostrarEstado('No se pudo cargar la configuración del simulador.', 'error')
        }
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault()
        botonGuardar.disabled = true
        mostrarEstado('Guardando configuración…')

        try {
            const respuesta = await api.simulador.configurar({
                latencia: latencia.value,
                probabilidadError: Number(probabilidad.value),
            })

            if (!respuesta.ok) {
                mostrarEstado(respuesta.error, 'error')
                return
            }

            pintarConfiguracion(respuesta.data)
            mostrarEstado('Configuración guardada.', 'exito')
        } catch {
            mostrarEstado('No se pudo guardar la configuración.', 'error')
        } finally {
            botonGuardar.disabled = false
        }
    })

    botonFallo.addEventListener('click', async () => {
        botonFallo.disabled = true

        try {
            const respuesta = await api.simulador.simularFallo(500)

            if (!respuesta.ok) {
                mostrarEstado(respuesta.error, 'error')
                return
            }

            mostrarEstado(
                'El próximo llamado a la API fallará con 500. Navega a otra vista para verlo.',
                'exito',
            )
        } catch {
            mostrarEstado('No se pudo activar el fallo simulado.', 'error')
        } finally {
            botonFallo.disabled = false
        }
    })

    botonReiniciar.addEventListener('click', async () => {
        const confirmado = window.confirm(
            '¿Restablecer los datos de prueba? Se borrarán los cambios y la sesión actual.',
        )

        if (!confirmado) {
            return
        }

        botonReiniciar.disabled = true
        mostrarEstado('Restableciendo datos…')

        try {
            const respuesta = await api.simulador.reiniciarDatos()

            if (!respuesta.ok) {
                mostrarEstado(respuesta.error, 'error')
                return
            }

            mostrarEstado('Datos restablecidos. Vuelve a iniciar sesión.', 'exito')
            window.setTimeout(() => window.location.assign('index.html'), 700)
        } catch {
            mostrarEstado('No se pudieron restablecer los datos de prueba.', 'error')
        } finally {
            botonReiniciar.disabled = false
        }
    })

    cargarConfiguracion()
}
