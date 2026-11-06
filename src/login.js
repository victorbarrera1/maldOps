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
    const campos = {
        correo: { campo: correo, nodo: formulario.querySelector('#error-correo') },
        contrasena: { campo: contrasena, nodo: formulario.querySelector('#error-contrasena') },
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

    function mostrarErrorCampo(clave, mensaje) {
        const entrada = campos[clave]

        if (!entrada) {
            return null
        }

        entrada.nodo.textContent = mensaje
        entrada.nodo.hidden = false
        entrada.campo.setAttribute('aria-invalid', 'true')

        return entrada.campo
    }

    function mostrarErroresCampos(errores) {
        let primero = null

        for (const clave of Object.keys(campos)) {
            if (errores[clave]) {
                const campo = mostrarErrorCampo(clave, errores[clave])
                primero = primero || campo
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

        const resultado = validarCorreo(correo.value)

        if (!resultado.valido) {
            const campo = mostrarErrorCampo('correo', resultado.error)
            campo?.focus()
            return
        }

        if (!contrasena.value.trim()) {
            const campo = mostrarErrorCampo('contrasena', 'Escribe tu contraseña.')
            campo?.focus()
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

                    if (mostrarErroresCampos(errores)) {
                        return
                    }

                    mostrarErrorGeneral(respuesta.error)
                    return
                }

                if (respuesta.status === 401) {
                    mostrarErrorGeneral(respuesta.error)
                    return
                }

                mostrarErrorGeneral(
                    respuesta.error || 'No se pudo iniciar sesión. Intenta de nuevo.',
                    { alReintentar: reintentar },
                )
                return
            }

            const parametros = new URLSearchParams(window.location.search)
            window.location.assign(destinoSeguro(parametros.get('volver')))
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

iniciarLogin()
