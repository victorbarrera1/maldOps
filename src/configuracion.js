/**
 * Panel de configuración: simulador de latencia y errores.
 *
 * La vista solo usa la fachada `api.js`; nunca toca localStorage.
 */

import api from './api.js'
import { irAlLogin, esNoAutorizado } from './guard.js'
import {
    crearCargando,
    crearVacio,
    crearError,
    mensajeDeError,
    mostrarToast,
    confirmarAccion,
} from './ui.js'

const formulario = document.querySelector('#form-simulador')

if (formulario) {
    const estado = formulario.querySelector('#simulador-estado')
    const contenido = formulario.querySelector('#simulador-contenido')
    const aviso = formulario.querySelector('#simulador-aviso')
    const latencia = formulario.querySelector('#latencia')
    const probabilidad = formulario.querySelector('#probabilidad-error')
    const botonGuardar = formulario.querySelector('#guardar-simulador')
    const botonFallo = formulario.querySelector('#simular-fallo')
    const botonReiniciar = formulario.querySelector('#reiniciar-datos')
    const nombreCuenta = document.querySelector('#cuenta-nombre')
    const correoCuenta = document.querySelector('#cuenta-correo')

    function mostrarAviso(mensaje, tipo = 'info') {
        aviso.textContent = mensaje
        aviso.style.color =
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

    function mostrarError(mensaje) {
        estado.replaceChildren(
            crearError({
                titulo: 'No se pudo cargar la configuración',
                mensaje,
                alReintentar: cargarConfiguracion,
            }),
        )
        contenido.hidden = true
    }

    async function cargarConfiguracion() {
        estado.replaceChildren(crearCargando({ filas: 2, columnas: 2 }))
        contenido.hidden = true
        aviso.textContent = ''

        try {
            const [respuesta, respuestaPerfil] = await Promise.all([
                api.simulador.obtenerConfiguracion(),
                api.auth.perfil(),
            ])

            if (esNoAutorizado(respuesta) || esNoAutorizado(respuestaPerfil)) {
                irAlLogin()
                return
            }

            if (!respuestaPerfil.ok) {
                mostrarError(
                    mensajeDeError(respuestaPerfil, 'No se pudo cargar el perfil de la cuenta.'),
                )
                return
            }

            if (!respuesta.ok) {
                mostrarError(
                    mensajeDeError(
                        respuesta,
                        'No se pudo cargar la configuración del simulador.',
                    ),
                )
                return
            }

            const perfil = respuestaPerfil.data

            if (perfil && nombreCuenta && correoCuenta) {
                nombreCuenta.value = perfil.nombre || ''
                correoCuenta.value = perfil.correo || ''
            }

            const configuracion = respuesta.data

            if (!configuracion || typeof configuracion !== 'object' || !configuracion.latencia) {
                estado.replaceChildren(
                    crearVacio({
                        titulo: 'No hay configuración guardada',
                        mensaje: 'Se usarán los valores por defecto hasta que guardes cambios.',
                    }),
                )
                latencia.value = 'normal'
                probabilidad.value = '0'
                contenido.hidden = false
                return
            }

            pintarConfiguracion(configuracion)
            estado.replaceChildren()
            contenido.hidden = false
        } catch {
            mostrarError(
                'No se pudo cargar la configuración del simulador. Revisa tu conexión e intenta de nuevo.',
            )
        }
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault()
        botonGuardar.disabled = true
        mostrarAviso('Guardando configuración…')

        try {
            const respuesta = await api.simulador.configurar({
                latencia: latencia.value,
                probabilidadError: Number(probabilidad.value),
            })

            if (esNoAutorizado(respuesta)) {
                irAlLogin()
                return
            }

            if (!respuesta.ok) {
                mostrarAviso(
                    mensajeDeError(respuesta, 'No se pudo guardar la configuración.'),
                    'error',
                )
                return
            }

            pintarConfiguracion(respuesta.data)
            estado.replaceChildren()
            mostrarAviso('Configuración guardada.', 'exito')
        } catch {
            mostrarAviso('No se pudo guardar la configuración.', 'error')
        } finally {
            botonGuardar.disabled = false
        }
    })

    botonFallo.addEventListener('click', async () => {
        botonFallo.disabled = true

        try {
            const respuesta = await api.simulador.simularFallo(500)

            if (!respuesta.ok) {
                mostrarAviso(respuesta.error, 'error')
                return
            }

            mostrarAviso(
                'El próximo llamado a la API fallará con 500. Navega a otra vista para verlo.',
                'exito',
            )
        } catch {
            mostrarAviso('No se pudo activar el fallo simulado.', 'error')
        } finally {
            botonFallo.disabled = false
        }
    })

    botonReiniciar.addEventListener('click', async () => {
        // [IA] inicio · ia/2026-11-11_victorbarrera1_cuenta-orden-readme.md
        const confirmado = await confirmarAccion(
            '¿Restablecer los datos de prueba? Se borrarán los cambios y la sesión actual.',
            { titulo: 'Restablecer datos de prueba', textoConfirmar: 'Restablecer' },
        )
        // [IA] fin

        if (!confirmado) {
            return
        }

        botonReiniciar.disabled = true
        mostrarAviso('Restableciendo datos…')

        try {
            const respuesta = await api.simulador.reiniciarDatos()

            if (!respuesta.ok) {
                mostrarAviso(respuesta.error, 'error')
                return
            }

            mostrarAviso('Datos restablecidos. Vuelve a iniciar sesión.', 'exito')
            window.setTimeout(() => window.location.assign('index.html'), 700)
        } catch {
            mostrarAviso('No se pudieron restablecer los datos de prueba.', 'error')
        } finally {
            botonReiniciar.disabled = false
        }
    })

    cargarConfiguracion()
}

// [IA] inicio · ia/2026-11-11_victorbarrera1_cuenta-orden-readme.md
/* ------------------------------------------------------------------------- */
/* Cuenta: guardar cambios y eliminar                                         */
/* ------------------------------------------------------------------------- */

const botonGuardarCuenta = document.querySelector('#guardar-cuenta')
const botonEliminarCuenta = document.querySelector('#eliminar-cuenta')

if (botonGuardarCuenta && botonEliminarCuenta) {
    const avisoCuenta = document.querySelector('#cuenta-aviso')
    const campos = {
        nombre: document.querySelector('#cuenta-nombre'),
        correo: document.querySelector('#cuenta-correo'),
        contrasenaActual: document.querySelector('#cuenta-contrasena-actual'),
        contrasenaNueva: document.querySelector('#cuenta-contrasena-nueva'),
    }

    function mostrarAvisoCuenta(mensaje, tipo = 'info') {
        avisoCuenta.textContent = mensaje
        avisoCuenta.style.color =
            tipo === 'error'
                ? 'var(--color-peligro, #b91c1c)'
                : tipo === 'exito'
                  ? 'var(--color-exito, #166534)'
                  : 'var(--color-texto-suave, #475569)'
    }

    function limpiarErroresCuenta() {
        for (const campo of Object.values(campos)) {
            campo?.removeAttribute('aria-invalid')
        }
    }

    function marcarErroresCuenta(errores) {
        const mensajes = []

        for (const [clave, mensaje] of Object.entries(errores || {})) {
            campos[clave]?.setAttribute('aria-invalid', 'true')
            mensajes.push(mensaje)
        }

        return mensajes
    }

    botonGuardarCuenta.addEventListener('click', async () => {
        limpiarErroresCuenta()

        const datos = {
            nombre: campos.nombre.value,
            correo: campos.correo.value,
        }

        if (campos.contrasenaActual.value || campos.contrasenaNueva.value) {
            if (!campos.contrasenaNueva.value) {
                campos.contrasenaNueva.setAttribute('aria-invalid', 'true')
                mostrarAvisoCuenta('Escribe la contraseña nueva.', 'error')
                return
            }

            datos.contrasenaActual = campos.contrasenaActual.value
            datos.contrasenaNueva = campos.contrasenaNueva.value
        }

        botonGuardarCuenta.disabled = true
        mostrarAvisoCuenta('Guardando cambios…')

        try {
            const respuesta = await api.auth.actualizarPerfil(datos)

            if (esNoAutorizado(respuesta)) {
                irAlLogin()
                return
            }

            if (!respuesta.ok) {
                const mensajes = marcarErroresCuenta(respuesta.errores)

                mostrarAvisoCuenta(
                    mensajes.length > 0
                        ? mensajes.join(' ')
                        : mensajeDeError(respuesta, 'No se pudieron guardar los cambios.'),
                    'error',
                )
                return
            }

            const perfil = respuesta.data

            campos.nombre.value = perfil.nombre || ''
            campos.correo.value = perfil.correo || ''
            campos.contrasenaActual.value = ''
            campos.contrasenaNueva.value = ''

            const nombreEnMenu = document.querySelector('.nav-usuario-nombre')

            if (nombreEnMenu) {
                nombreEnMenu.textContent = perfil.nombre || ''
            }

            mostrarAvisoCuenta('Cambios guardados.', 'exito')
            mostrarToast('Los datos de tu cuenta se guardaron.')
        } catch {
            mostrarAvisoCuenta('No se pudieron guardar los cambios. Revisa tu conexión.', 'error')
        } finally {
            botonGuardarCuenta.disabled = false
        }
    })

    botonEliminarCuenta.addEventListener('click', async () => {
        const confirmado = await confirmarAccion(
            '¿Eliminar tu cuenta? Se cerrará tu sesión y no podrás volver a entrar con este correo. Esta acción no se puede deshacer.',
            { titulo: 'Eliminar cuenta', textoConfirmar: 'Eliminar cuenta' },
        )

        if (!confirmado) {
            return
        }

        botonEliminarCuenta.disabled = true

        try {
            const respuesta = await api.auth.eliminarCuenta()

            if (esNoAutorizado(respuesta)) {
                irAlLogin()
                return
            }

            if (!respuesta.ok) {
                mostrarToast(mensajeDeError(respuesta, 'No se pudo eliminar la cuenta.'), 'error')
                return
            }

            mostrarToast('Cuenta eliminada.')
            window.setTimeout(() => window.location.assign('index.html'), 700)
        } catch {
            mostrarToast('No se pudo eliminar la cuenta. Revisa tu conexión.', 'error')
        } finally {
            botonEliminarCuenta.disabled = false
        }
    })
}
// [IA] fin
