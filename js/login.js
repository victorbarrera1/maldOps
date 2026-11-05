import api from './api.js'
import { destinoSeguro } from './guard.js'

const DOMINIOS_PERMITIDOS = ['gmail.com', 'mail.udp.cl']

/**
 * Valida el correo del login y lo devuelve normalizado (sin espacios y en
 * minúsculas). Solo acepta dominios @gmail.com y @mail.udp.cl.
 */
export function validarCorreo(valor) {
    const correo = String(valor || '').trim().toLowerCase()

    if (!correo) {
        return { valido: false, correo, error: 'Escribe tu correo electrónico.' }
    }

    const arroba = correo.indexOf('@')
    const usuario = correo.slice(0, arroba)
    const dominio = correo.slice(arroba + 1)
    const otroArroba = correo.indexOf('@', arroba + 1)

    if (arroba <= 0 || otroArroba !== -1 || !usuario || !dominio || /\s/.test(correo)) {
        return { valido: false, correo, error: 'Escribe un correo válido.' }
    }

    if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
        return {
            valido: false,
            correo,
            error: 'Solo puedes entrar con un correo @gmail.com o @mail.udp.cl.',
        }
    }

    return { valido: true, correo, error: '' }
}

function mostrarError(nodo, mensaje, { campo = null, alReintentar = null } = {}) {
    nodo.replaceChildren()

    const texto = document.createElement('p')
    texto.className = 'login-error-texto'
    texto.textContent = mensaje
    nodo.append(texto)

    if (typeof alReintentar === 'function') {
        const boton = document.createElement('button')
        boton.type = 'button'
        boton.className = 'login-reintentar'
        boton.textContent = 'Reintentar'
        boton.addEventListener('click', alReintentar)
        nodo.append(boton)
    }

    nodo.hidden = false

    if (campo) {
        campo.setAttribute('aria-invalid', 'true')
        campo.focus()
    }
}

function limpiarError(nodo, campos) {
    nodo.replaceChildren()
    nodo.hidden = true

    for (const campo of campos) {
        campo.removeAttribute('aria-invalid')
    }
}

function iniciarLogin() {
    const formulario = document.querySelector('#form-login')

    if (!formulario) {
        return
    }

    const correo = formulario.querySelector('#correo')
    const contrasena = formulario.querySelector('#contrasena')
    const error = formulario.querySelector('#login-error')
    const estado = formulario.querySelector('#login-estado')
    const boton = formulario.querySelector('input[type="submit"]')
    let enviando = false

    for (const campo of [correo, contrasena]) {
        campo.addEventListener('input', () => limpiarError(error, [correo, contrasena]))
    }

    async function enviar() {
        if (enviando) {
            return
        }

        limpiarError(error, [correo, contrasena])

        const resultado = validarCorreo(correo.value)

        if (!resultado.valido) {
            mostrarError(error, resultado.error, { campo: correo })
            return
        }

        if (!contrasena.value.trim()) {
            mostrarError(error, 'Escribe tu contraseña.', { campo: contrasena })
            return
        }

        enviando = true
        const textoBoton = boton.value
        boton.disabled = true
        boton.value = 'Ingresando…'
        formulario.setAttribute('aria-busy', 'true')
        estado.textContent = 'Verificando credenciales…'

        try {
            const respuesta = await api.auth.iniciarSesion({
                correo: resultado.correo,
                contrasena: contrasena.value,
            })

            if (!respuesta.ok) {
                if (respuesta.status === 422) {
                    const errores = respuesta.errores || {}
                    const campo = errores.contrasena && !errores.correo ? contrasena : correo
                    const mensaje = errores.correo || errores.contrasena || respuesta.error

                    mostrarError(error, mensaje, { campo })
                    return
                }

                if (respuesta.status === 401) {
                    mostrarError(error, respuesta.error)
                    return
                }

                mostrarError(
                    error,
                    respuesta.error || 'No se pudo iniciar sesión. Intenta de nuevo.',
                    { alReintentar: enviar },
                )
                return
            }

            const parametros = new URLSearchParams(window.location.search)
            window.location.assign(destinoSeguro(parametros.get('volver')))
        } catch {
            mostrarError(
                error,
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

iniciarLogin()
