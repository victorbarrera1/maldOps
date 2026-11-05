/**
 * Registro de cuenta contra la API simulada.
 *
 * Muestra un estado mientras espera y un error con «Reintentar» cuando el
 * problema no se puede resolver corrigiendo el formulario.
 */

import api from './api.js'

const formulario = document.querySelector('#form-registro')

if (formulario) {
    const nombre = formulario.querySelector('#nombre')
    const correo = formulario.querySelector('#correo')
    const contrasena = formulario.querySelector('#contrasena')
    const confirmar = formulario.querySelector('#confirmar-contrasena')
    const estado = formulario.querySelector('#registro-estado')
    const error = formulario.querySelector('#registro-error')
    const boton = formulario.querySelector('input[type="submit"]')
    const campos = [nombre, correo, contrasena, confirmar]
    let enviando = false

    function mostrarError(mensaje, { alReintentar = null } = {}) {
        error.replaceChildren()

        const texto = document.createElement('p')
        texto.className = 'login-error-texto'
        texto.textContent = mensaje
        error.append(texto)

        if (typeof alReintentar === 'function') {
            const botonReintentar = document.createElement('button')
            botonReintentar.type = 'button'
            botonReintentar.className = 'login-reintentar'
            botonReintentar.textContent = 'Reintentar'
            botonReintentar.addEventListener('click', alReintentar)
            error.append(botonReintentar)
        }

        error.hidden = false
    }

    function limpiarError() {
        error.replaceChildren()
        error.hidden = true

        for (const campo of campos) {
            campo.removeAttribute('aria-invalid')
        }
    }

    for (const campo of campos) {
        campo.addEventListener('input', limpiarError)
    }

    async function enviar() {
        if (enviando) {
            return
        }

        limpiarError()
        enviando = true
        const textoBoton = boton.value
        boton.disabled = true
        boton.value = 'Creando cuenta…'
        formulario.setAttribute('aria-busy', 'true')
        estado.textContent = 'Creando tu cuenta…'

        try {
            const respuesta = await api.auth.registrar({
                nombre: nombre.value,
                correo: correo.value,
                contrasena: contrasena.value,
                confirmarContrasena: confirmar.value,
            })

            if (!respuesta.ok) {
                if (respuesta.status === 422 || respuesta.status === 409) {
                    mostrarError(respuesta.error)
                    return
                }

                mostrarError(
                    respuesta.error || 'No se pudo crear la cuenta. Intenta de nuevo.',
                    { alReintentar: enviar },
                )
                return
            }

            window.location.assign('dashboard.html')
        } catch {
            mostrarError(
                'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
                { alReintentar: enviar },
            )
        } finally {
            enviando = false
            boton.disabled = false
            boton.value = textoBoton
            formulario.removeAttribute('aria-busy')
            estado.textContent = ''
        }
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault()
        enviar()
    })
}
