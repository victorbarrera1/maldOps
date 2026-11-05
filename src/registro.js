/**
 * Registro de cuenta contra la API simulada.
 *
 * Muestra un estado mientras espera, errores por campo con los 422/409 de la
 * API y un error con «Reintentar» cuando el problema no se corrige editando.
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
    const campos = {
        nombre: { campo: nombre, nodo: formulario.querySelector('#error-nombre') },
        correo: { campo: correo, nodo: formulario.querySelector('#error-correo') },
        contrasena: { campo: contrasena, nodo: formulario.querySelector('#error-contrasena') },
        confirmarContrasena: {
            campo: confirmar,
            nodo: formulario.querySelector('#error-confirmar'),
        },
    }
    let enviando = false

    function limpiarGeneral() {
        error.replaceChildren()
        error.hidden = true
    }

    function limpiarCampo(clave) {
        const entrada = campos[clave]

        if (!entrada) {
            return
        }

        entrada.nodo.textContent = ''
        entrada.nodo.hidden = true
        entrada.campo.removeAttribute('aria-invalid')
    }

    function limpiarErrores() {
        limpiarGeneral()

        for (const clave of Object.keys(campos)) {
            limpiarCampo(clave)
        }
    }

    function mostrarErrorGeneral(mensaje, { alReintentar = null } = {}) {
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

    function mostrarErroresCampos(errores) {
        let primero = null

        for (const clave of Object.keys(campos)) {
            const entrada = campos[clave]

            if (errores[clave]) {
                entrada.nodo.textContent = errores[clave]
                entrada.nodo.hidden = false
                entrada.campo.setAttribute('aria-invalid', 'true')
                primero = primero || entrada.campo
            }
        }

        if (primero) {
            primero.focus()
        }

        return Boolean(primero)
    }

    function reintentar() {
        limpiarErrores()
        enviar()
    }

    for (const [clave, entrada] of Object.entries(campos)) {
        entrada.campo.addEventListener('input', () => {
            limpiarCampo(clave)
            limpiarGeneral()
        })
    }

    async function enviar() {
        if (enviando) {
            return
        }

        limpiarErrores()
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
                    const errores = respuesta.errores || {}

                    if (mostrarErroresCampos(errores)) {
                        return
                    }

                    mostrarErrorGeneral(respuesta.error)
                    return
                }

                mostrarErrorGeneral(
                    respuesta.error || 'No se pudo crear la cuenta. Intenta de nuevo.',
                    { alReintentar: reintentar },
                )
                return
            }

            window.location.assign('dashboard.html')
        } catch {
            mostrarErrorGeneral(
                'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
                { alReintentar: reintentar },
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
