/**
 * Vista de clientes: lista con estados de interfaz y CRUD completo.
 *
 * Solo usa la fachada `api.js`. El borrado queda disponible para `admin`.
 */

import api from './api.js'
import { irAlLogin, esNoAutorizado } from './guard.js'
import {
    crearCargando,
    crearVacio,
    crearError,
    crearBadgeEstatus,
    mensajeDeError,
    mostrarToast,
    confirmarAccion,
} from './ui.js'

const estado = document.querySelector('#clientes-estado')
const tabla = document.querySelector('#clientes-tabla')
const cuerpo = document.querySelector('#clientes-cuerpo')
const total = document.querySelector('#clientes-total')
const filtroFavoritos = document.querySelector('#clientes-solo-favoritos')
const campoBusqueda = document.querySelector('#clientes-busqueda')
const botonNuevo = document.querySelector('#nuevo-cliente')
const dialogo = document.querySelector('#cliente-dialogo')
const formulario = document.querySelector('#cliente-form')
const tituloDialogo = document.querySelector('#cliente-dialogo-titulo')
const campoNombre = document.querySelector('#cliente-nombre')
const campoEstatus = document.querySelector('#cliente-estatus')
const errorNombre = document.querySelector('#cliente-error-nombre')
const errorEstatus = document.querySelector('#cliente-error-estatus')
const errorGeneral = document.querySelector('#cliente-error-general')
const campoNota = document.querySelector('#cliente-nota')
const errorNota = document.querySelector('#cliente-error-nota')
const botonCancelar = document.querySelector('#cliente-cancelar')
const botonGuardar = document.querySelector('#cliente-guardar')
const esAdmin = window.__sesion?.rol === 'admin'

let clientesActuales = []
let clienteEnEdicion = null

function crearBotonAccion(texto, clase, etiqueta, alPulsar) {
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.className = `btn btn-sm ${clase}`.trim()
    boton.textContent = texto
    boton.setAttribute('aria-label', etiqueta)
    boton.addEventListener('click', alPulsar)

    return boton
}


// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
function crearBotonFavorito(cliente) {
    const boton = document.createElement('button')
    const esFavorito = cliente.favorito === true

    boton.type = 'button'
    boton.className = [
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-2xl leading-none',
        'transition hover:scale-125 hover:bg-amber-500/15',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
        'disabled:cursor-wait disabled:opacity-50',
        esFavorito ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500',
    ].join(' ')
    boton.textContent = esFavorito ? '★' : '☆'
    boton.setAttribute('aria-pressed', String(esFavorito))
    boton.setAttribute(
        'aria-label',
        esFavorito
            ? `Quitar a ${cliente.nombre} de favoritos`
            : `Marcar a ${cliente.nombre} como favorito`,
    )
    boton.addEventListener('click', () => alternarFavorito(cliente, boton))

    return boton
}
// [IA] fin

async function alternarFavorito(cliente, boton) {
    boton.disabled = true

    try {
        const respuesta = await api.clientes.actualizar(cliente.id, {
            favorito: !cliente.favorito,
        })

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            mostrarToast(mensajeDeError(respuesta, 'No se pudo actualizar el favorito.'), 'error')
            boton.disabled = false
            return
        }

        cliente.favorito = respuesta.data.favorito      
        mostrarToast(
            cliente.favorito
                ? `${cliente.nombre} se agregó a favoritos.`
                : `${cliente.nombre} se quitó de favoritos.`,
        )
        aplicarVista()
    } catch {
        mostrarToast('No se pudo actualizar el favorito. Revisa tu conexión.', 'error')
        boton.disabled = false
    }
}
// [IA] fin


// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
function aplicarFiltro() {
    const soloFavoritos = filtroFavoritos.checked
    const lista = soloFavoritos
        ? clientesActuales.filter((cliente) => cliente.favorito)
        : clientesActuales

    if (soloFavoritos && lista.length === 0) {
        estado.replaceChildren(
            crearVacio({
                titulo: 'Aún no tienes favoritos',
                mensaje: 'Marca una estrella para verlos aquí.',
            }),
        )
    } else {
        estado.replaceChildren()
    }

    pintarFilas(lista)
}
// [IA] fin


function pintarFilas(clientes) {
    const fragmento = document.createDocumentFragment()

    for (const cliente of clientes) {
        const fila = document.createElement('tr')
        fila.className = 'transition-colors duration-150 hover:bg-slate-500/10 [&>td]:py-3'

        const nombre = document.createElement('td')

        // [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
        const envoltorio = document.createElement('div')
        envoltorio.className = 'flex items-center gap-2'

        const textos = document.createElement('div')
        textos.className = 'min-w-0'

        const titulo = document.createElement('span')
        titulo.className = 'block font-medium'
        titulo.textContent = cliente.nombre
        textos.append(titulo)

        if (cliente.nota) {
            const nota = document.createElement('small')
            nota.className = 'mt-0.5 block max-w-xs break-words text-xs italic opacity-70 line-clamp-2'
            nota.textContent = cliente.nota
            nota.title = cliente.nota
            textos.append(nota)
        }

        envoltorio.append(crearBotonFavorito(cliente), textos)
        nombre.append(envoltorio)
        // [IA] fin

        const estatus = document.createElement('td')
        estatus.append(crearBadgeEstatus(cliente.estatus))

        const acciones = document.createElement('td')
        acciones.className = 'acciones-tabla'
        acciones.append(
            crearBotonAccion(
                'Editar',
                'rounded-lg border border-slate-500/40 transition hover:bg-sky-600! hover:text-white!',
                `Editar a ${cliente.nombre}`,
                () => abrirFormulario(cliente),
            ),
        )

        if (esAdmin) {
            acciones.append(
                crearBotonAccion(
                    'Eliminar',
                    'btn-danger',
                    `Eliminar a ${cliente.nombre}`,
                    () => eliminarCliente(cliente),
                ),
            )
        }

        fila.append(nombre, estatus, acciones)
        fragmento.append(fila)
    }

    cuerpo.replaceChildren(fragmento)
    tabla.hidden = clientes.length === 0
}


function mostrarCargando() {
    estado.replaceChildren(crearCargando({ filas: 6, columnas: 3 }))
    tabla.hidden = true
    total.textContent = ''

    if (botonNuevo) {
        botonNuevo.disabled = true
    }
}

function mostrarError(mensaje) {
    estado.replaceChildren(
        crearError({
            titulo: 'No se pudieron cargar los clientes',
            mensaje,
            alReintentar: cargarClientes,
        }),
    )
    tabla.hidden = true
    total.textContent = ''

    if (botonNuevo) {
        botonNuevo.disabled = false
    }
}

function mostrarVacio() {
    estado.replaceChildren(
        crearVacio({
            titulo: 'Todavía no hay clientes',
            mensaje: 'Cuando registres un cliente aparecerá en esta lista.',
        }),
    )
    tabla.hidden = true
    total.textContent = '0'

    if (botonNuevo) {
        botonNuevo.disabled = false
    }
}

// [IA] inicio · ia/2026-11-11_victorbarrera1_cuenta-orden-readme.md
const campoOrden = document.querySelector('#clientes-orden')

/** Ordena una copia de la lista según la opción del menú «Ordenar clientes». */
function ordenarClientes(lista, criterio = 'nombre-asc') {
    const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    const copia = [...lista]

    if (criterio === 'nombre-desc') {
        return copia.sort((a, b) => porNombre(b, a))
    }

    if (criterio === 'favoritos') {
        return copia.sort(
            (a, b) => Number(b.favorito === true) - Number(a.favorito === true) || porNombre(a, b),
        )
    }

    return copia.sort(porNombre)
}
// [IA] fin

// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
function aplicarVista() {
    const texto = (campoBusqueda?.value || '').trim().toLowerCase()
    const soloFavoritos = Boolean(filtroFavoritos?.checked)

    const filtrados = clientesActuales.filter((cliente) => {
        if (soloFavoritos && cliente.favorito !== true) {
            return false
        }

        return (
            !texto ||
            cliente.nombre.toLowerCase().includes(texto) ||
            (cliente.nota || '').toLowerCase().includes(texto)
        )
    })

    const visibles = ordenarClientes(filtrados, campoOrden?.value)

    total.textContent = String(visibles.length)

    if (visibles.length === 0) {
        pintarFilas([])
        estado.replaceChildren(
            crearVacio({
                titulo: 'Sin resultados',
                mensaje: 'Prueba con otra búsqueda o desactiva el filtro de favoritos.',
            }),
        )
        return
    }

    estado.replaceChildren()
    pintarFilas(visibles)
}

campoBusqueda?.addEventListener('input', aplicarVista)

// [IA] inicio · ia/2026-11-11_victorbarrera1_exportar-buscador-contactos.md
// Búsqueda de la barra superior: llega con `?q=` o con el evento `maldops:buscar`.
const consultaInicial = new URLSearchParams(window.location.search).get('q')

if (consultaInicial && campoBusqueda) {
    campoBusqueda.value = consultaInicial
}

document.addEventListener('maldops:buscar', (evento) => {
    if (!campoBusqueda) {
        return
    }

    evento.preventDefault()
    campoBusqueda.value = evento.detail.texto

    if (clientesActuales.length > 0) {
        aplicarVista()
    }
})
// [IA] fin
filtroFavoritos?.addEventListener('change', aplicarVista)
// [IA] inicio · ia/2026-11-11_victorbarrera1_cuenta-orden-readme.md
campoOrden?.addEventListener('change', aplicarVista)
// [IA] fin
// [IA] fin

async function cargarClientes() {
    mostrarCargando()

        try {
        const respuesta = await api.clientes.listar()

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            mostrarError(mensajeDeError(respuesta, 'No se pudieron cargar los clientes.'))
            return
        }

        clientesActuales = Array.isArray(respuesta.data) ? respuesta.data : []

        if (clientesActuales.length === 0) {
            mostrarVacio()
            return
        }

        aplicarVista()
        botonNuevo.disabled = false
    } catch {
        mostrarError('No se pudieron cargar los clientes. Revisa tu conexión e intenta de nuevo.')
    }
}

function limpiarErroresFormulario() {
    for (const nodo of [errorNombre, errorEstatus, errorNota, errorGeneral]) {
        if (nodo) {
            nodo.textContent = ''
            nodo.hidden = true
        }
    }

    campoNombre.removeAttribute('aria-invalid')
    campoEstatus.removeAttribute('aria-invalid')
}

function mostrarErrorCampo(clave, mensaje) {
    const mapa = {
        nombre: { nodo: errorNombre, campo: campoNombre },
        estatus: { nodo: errorEstatus, campo: campoEstatus },
        nota: { nodo: errorNota, campo: campoNota },
    }
    const entrada = mapa[clave]

    if (!entrada) {
        return null
    }

    entrada.nodo.textContent = mensaje
    entrada.nodo.hidden = false
    entrada.campo.setAttribute('aria-invalid', 'true')

    return entrada.campo
}

function mostrarErroresFormulario(errores) {
    let primero = null

    for (const clave of ['nombre', 'estatus', 'nota']) {
        if (errores[clave]) {
            const campo = mostrarErrorCampo(clave, errores[clave])
            primero = primero || campo
        }
    }

    primero?.focus()

    return Boolean(primero)
}

function abrirFormulario(cliente = null) {
    clienteEnEdicion = cliente ? cliente.id : null
    tituloDialogo.textContent = cliente ? 'Editar cliente' : 'Nuevo cliente'
    campoNombre.value = cliente ? cliente.nombre : ''
    campoEstatus.value = cliente ? cliente.estatus : 'Activo'
    // [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
    campoNota.value = cliente ? (cliente.nota ?? '') : ''
    // [IA] fin
    limpiarErroresFormulario()
    dialogo.showModal()
    campoNombre.focus()
}

async function guardarCliente(evento) {
    evento.preventDefault()

    limpiarErroresFormulario()
    botonGuardar.disabled = true
    const textoBoton = botonGuardar.textContent
    botonGuardar.textContent = 'Guardando…'

    try {
        const datos = {
            nombre: campoNombre.value,
            estatus: campoEstatus.value,
            nota: campoNota.value,
        }
        const respuesta = clienteEnEdicion
            ? await api.clientes.actualizar(clienteEnEdicion, datos)
            : await api.clientes.crear(datos)

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            const errores = respuesta.errores || {}

            if ((respuesta.status === 422 || respuesta.status === 409) && mostrarErroresFormulario(errores)) {
                return
            }

            errorGeneral.textContent = mensajeDeError(
                respuesta,
                'No se pudo guardar el cliente.',
            )
            errorGeneral.hidden = false
            return
        }

        dialogo.close()
        mostrarToast(clienteEnEdicion ? 'Cliente actualizado.' : 'Cliente creado.')
        await cargarClientes()
    } catch {
        errorGeneral.textContent = 'No se pudo guardar el cliente. Revisa tu conexión.'
        errorGeneral.hidden = false
    } finally {
        botonGuardar.disabled = false
        botonGuardar.textContent = textoBoton
    }
}

async function eliminarCliente(cliente) {
    const confirmado = await confirmarAccion(
        `¿Eliminar a «${cliente.nombre}»? Esta acción no se puede deshacer.`,
    )

    if (!confirmado) {
        return
    }

    try {
        const respuesta = await api.clientes.eliminar(cliente.id)

        if (esNoAutorizado(respuesta)) {
            irAlLogin()
            return
        }

        if (!respuesta.ok) {
            mostrarToast(mensajeDeError(respuesta, 'No se pudo eliminar el cliente.'), 'error')
            return
        }

        mostrarToast('Cliente eliminado.')
        await cargarClientes()
    } catch {
        mostrarToast('No se pudo eliminar el cliente. Revisa tu conexión.', 'error')
    }
}

if (estado && tabla && cuerpo && total) {
    cargarClientes()
}

if (botonNuevo && dialogo && formulario) {
    botonNuevo.addEventListener('click', () => abrirFormulario())
    botonCancelar.addEventListener('click', () => dialogo.close())
    formulario.addEventListener('submit', guardarCliente)
}

// [IA] inicio · ia/2026-11-09_manolodeus_favoritos-notas.md
filtroFavoritos?.addEventListener('change', aplicarFiltro)
// [IA] fin