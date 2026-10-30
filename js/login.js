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

function mostrarError(nodo, campo, mensaje) {
    nodo.textContent = mensaje
    nodo.hidden = false
    campo.setAttribute('aria-invalid', 'true')
    campo.focus()
}

function limpiarError(nodo, campos) {
    nodo.textContent = ''
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

    for (const campo of [correo, contrasena]) {
        campo.addEventListener('input', () => limpiarError(error, [correo, contrasena]))
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault()
        limpiarError(error, [correo, contrasena])

        const resultado = validarCorreo(correo.value)

        if (!resultado.valido) {
            mostrarError(error, correo, resultado.error)
            return
        }

        if (!contrasena.value.trim()) {
            mostrarError(error, contrasena, 'Escribe tu contraseña.')
            return
        }

        window.location.assign('dashboard.html')
    })
}

iniciarLogin()
