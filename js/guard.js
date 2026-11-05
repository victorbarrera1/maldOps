/**
 * Protección de vistas privadas y destinos de navegación.
 *
 * El guard se ejecuta solo en páginas marcadas con `data-privada="true"` en el
 * <body>. Las funciones también se exportan para que login.js pueda reutilizar
 * el destino seguro sin activar el guard.
 */

import { leerSesion } from './api/sesion.js'

const VISTAS_PRIVADAS = [
    'dashboard.html',
    'clientes.html',
    'ventas.html',
    'configuracion.html',
    'ayuda.html',
]

const DESTINO_POR_DEFECTO = 'dashboard.html'

function baseUrl() {
    const base = (import.meta.env && import.meta.env.BASE_URL) || '/'

    return base.endsWith('/') ? base : `${base}/`
}

export function rutaActual() {
    const partes = String(window.location.pathname || '/').split('/')
    const archivo = partes[partes.length - 1]

    return archivo || 'index.html'
}

export function destinoSeguro(valor, porDefecto = DESTINO_POR_DEFECTO) {
    const texto = String(valor || '').trim()
    const archivo = texto.split('?')[0].split('#')[0]

    return VISTAS_PRIVADAS.includes(archivo) ? archivo : porDefecto
}

export function urlLogin() {
    const url = new URL(`${baseUrl()}index.html`, window.location.origin)
    const vista = rutaActual()

    if (VISTAS_PRIVADAS.includes(vista)) {
        url.searchParams.set('volver', vista)
    }

    return url
}

export function irAlLogin() {
    window.location.replace(urlLogin().toString())
}

export function esNoAutorizado(respuesta) {
    return Boolean(respuesta && respuesta.status === 401)
}

/**
 * Verifica la sesión. Si no existe, redirige al login con `?volver=`.
 * Devuelve la sesión cuando la vista puede mostrarse.
 */
export function protegerVista() {
    const sesion = leerSesion()

    if (!sesion) {
        irAlLogin()

        return null
    }

    // nav.js lo usa para pintar nombre y rol sin leer localStorage.
    window.__sesion = sesion

    return sesion
}

if (typeof document !== 'undefined' && document.body?.dataset.privada === 'true') {
    protegerVista()
}
