/**
 * Fachada única de la API de MaldOps.
 *
 * Las vistas solo importan este archivo. Ninguna vista debe usar `fetch`,
 * leer los JSON de `public/mocks/` ni tocar `localStorage` directamente.
 *
 * Todas las funciones devuelven el mismo objeto:
 * { ok, status, data, error, errores }
 */

import * as servidor from './api/servidor.js'

export const auth = {
    async iniciarSesion(datos) {
        return servidor.iniciarSesion(datos)
    },

    async registrar(datos) {
        return servidor.registrar(datos)
    },

    async cerrarSesion() {
        return servidor.cerrarSesion()
    },

    async perfil() {
        return servidor.perfil()
    },
}

export const clientes = {
    async listar() {
        return servidor.listarClientes()
    },

    async obtener(id) {
        return servidor.obtenerCliente(id)
    },

    async crear(datos) {
        return servidor.crearCliente(datos)
    },

    async actualizar(id, datos) {
        return servidor.actualizarCliente(id, datos)
    },

    async eliminar(id) {
        return servidor.eliminarCliente(id)
    },
}

export const ventas = {
    async listar() {
        return servidor.listarVentas()
    },

    async obtener(id) {
        return servidor.obtenerVenta(id)
    },

    async crear(datos) {
        return servidor.crearVenta(datos)
    },

    async actualizar(id, datos) {
        return servidor.actualizarVenta(id, datos)
    },

    async eliminar(id) {
        return servidor.eliminarVenta(id)
    },

    async deCliente(clienteId) {
        return servidor.ventasDeCliente(clienteId)
    },
}

export const preguntas = {
    async listar() {
        return servidor.listarPreguntas()
    },
}

export const simulador = {
    async obtenerConfiguracion() {
        return servidor.obtenerConfiguracionSimulador()
    },

    async configurar(cambios) {
        return servidor.configurarSimulador(cambios)
    },

    async simularFallo(status) {
        return servidor.simularSiguienteFallo(status)
    },

    async estado() {
        return servidor.obtenerEstadoSimulador()
    },

    async reiniciarDatos() {
        return servidor.reiniciarDatosDePrueba()
    },
}

const api = { auth, clientes, ventas, preguntas, simulador }

export default api
