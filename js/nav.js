const ENLACES = [
    { texto: 'Dashboard', href: 'dashboard.html', icono: 'home-outline' },
    { texto: 'Clientes', href: 'clientes.html', icono: 'person-outline' },
    { texto: 'Ventas', href: 'ventas.html', icono: 'card-outline' },
    { texto: 'Ayuda', href: 'ayuda.html', icono: 'information-circle-outline' },
    { texto: 'Configuracion', href: 'configuracion.html', icono: 'settings-outline' },
]

/**
 * Normaliza una ruta para comparar la página actual con los enlaces del menú.
 * Quita query/hash, barras finales y la extensión .html.
 */
export function normalizarRuta(pathname) {
    let ruta = String(pathname || '/').split('?')[0].split('#')[0]

    if (!ruta.startsWith('/')) {
        ruta = `/${ruta}`
    }

    if (ruta.length > 1) {
        ruta = ruta.replace(/\/+$/, '')
    }

    if (ruta.toLowerCase().endsWith('.html')) {
        ruta = ruta.slice(0, -5)
    }

    if (ruta === '' || ruta === '/index') {
        return '/'
    }

    return ruta || '/'
}

/**
 * Devuelve el enlace activo para la ruta actual. Si no hay coincidencia, null.
 */
export function elegirActivo(pathname, enlaces = ENLACES) {
    const rutaActual = normalizarRuta(pathname)

    return enlaces.find((enlace) => normalizarRuta(enlace.href) === rutaActual) || null
}

function leerSesion() {
    const sesion = window.__sesion && typeof window.__sesion === 'object' ? window.__sesion : {}
    const nombre = typeof sesion.nombre === 'string' && sesion.nombre.trim() ? sesion.nombre.trim() : 'Usuario'
    const rol = typeof sesion.rol === 'string' && sesion.rol.trim() ? sesion.rol.trim() : 'Sin rol'

    return { nombre, rol }
}

function crearIcono(nombre) {
    const icono = document.createElement('ion-icon')
    icono.setAttribute('name', nombre)
    icono.setAttribute('aria-hidden', 'true')

    return icono
}

function crearEnlace({ texto, href, icono, activo = false, salir = false }) {
    const enlace = document.createElement('a')
    enlace.href = href
    enlace.className = salir ? 'nav-enlace nav-enlace-salir' : 'nav-enlace'
    enlace.setAttribute('@click', 'cerrar()')

    if (activo) {
        enlace.classList.add('nav-enlace-activo')
        enlace.setAttribute('aria-current', 'page')
    }

    enlace.append(crearIcono(icono))

    const etiqueta = document.createElement('span')
    etiqueta.textContent = texto
    enlace.append(etiqueta)

    return enlace
}

function crearBarra(sesion) {
    const barra = document.createElement('header')
    barra.className = 'nav-barra'

    const boton = document.createElement('button')
    boton.type = 'button'
    boton.className = 'btn nav-hamburguesa md:hidden'
    boton.setAttribute('aria-label', 'Abrir menú')
    boton.setAttribute('aria-controls', 'nav-principal')
    boton.setAttribute('aria-expanded', 'false')
    boton.setAttribute(':aria-label', "abierto ? 'Cerrar menú' : 'Abrir menú'")
    boton.setAttribute(':aria-expanded', 'abierto')
    boton.setAttribute('x-ref', 'boton')
    boton.setAttribute('@click', 'alternar()')
    boton.append(crearIcono('menu'))

    const buscador = document.createElement('div')
    buscador.className = 'nav-busqueda'

    const entrada = document.createElement('input')
    entrada.type = 'search'
    entrada.className = 'input'
    entrada.placeholder = 'Buscar...'
    entrada.setAttribute('aria-label', 'Buscar')

    buscador.append(entrada, crearIcono('search'))

    const usuario = document.createElement('div')
    usuario.className = 'nav-usuario'

    const avatar = document.createElement('img')
    avatar.className = 'nav-avatar'
    avatar.src = 'img/profile.png'
    avatar.alt = ''

    const datos = document.createElement('div')
    datos.className = 'nav-usuario-datos hidden md:flex'

    const nombre = document.createElement('span')
    nombre.className = 'nav-usuario-nombre'
    nombre.textContent = sesion.nombre

    const rol = document.createElement('span')
    rol.className = 'nav-usuario-rol'
    rol.textContent = sesion.rol

    datos.append(nombre, rol)
    usuario.append(avatar, datos)

    barra.append(boton, buscador, usuario)

    return barra
}

function crearMenu(activo) {
    const menu = document.createElement('nav')
    menu.id = 'nav-principal'
    menu.className = 'nav-lateral'
    menu.setAttribute('aria-label', 'Navegación principal')
    menu.setAttribute('x-show', 'abierto || escritorio')
    menu.setAttribute('x-cloak', '')

    const marca = document.createElement('a')
    marca.href = '#'
    marca.className = 'nav-logo'
    marca.setAttribute('aria-label', 'MaldOps')

    const logo = document.createElement('img')
    logo.src = 'img/logo-maldops.png'
    logo.alt = ''
    marca.append(logo)
    menu.append(marca)

    for (const enlace of ENLACES) {
        menu.append(crearEnlace({ ...enlace, activo: enlace === activo }))
    }

    const salir = crearEnlace({
        texto: 'Cerrar sesión',
        href: 'index.html',
        icono: 'log-in-outline',
        salir: true,
    })
    salir.setAttribute('data-accion', 'cerrar-sesion')
    menu.append(salir)

    return menu
}

function definirComponente() {
    window.navMaldOps = () => ({
        abierto: false,
        escritorio: false,
        mq: null,
        alCambiar: null,

        init() {
            this.mq = window.matchMedia('(min-width: 768px)')
            this.escritorio = this.mq.matches
            this.alCambiar = (evento) => {
                this.escritorio = evento.matches

                if (evento.matches) {
                    this.cerrar(false)
                }
            }
            this.mq.addEventListener('change', this.alCambiar)
        },

        destroy() {
            if (this.mq && this.alCambiar) {
                this.mq.removeEventListener('change', this.alCambiar)
            }
        },

        alternar() {
            this.abierto = !this.abierto
        },

        cerrar(enfocar = true) {
            this.abierto = false

            if (!enfocar) {
                return
            }

            const boton = this.$refs.boton

            if (boton && boton.offsetParent !== null) {
                boton.focus()
            }
        },
    })
}

/**
 * Monta la barra superior y el menú lateral en #nav-root.
 * Si el contenedor no existe, no hace nada.
 */
export function montarNav() {
    const root = document.querySelector('#nav-root')

    if (!root || root.dataset.navMontada === 'true') {
        return
    }

    definirComponente()

    root.classList.add('contents')
    root.setAttribute('x-data', 'navMaldOps()')
    root.setAttribute('@keydown.escape.window', 'cerrar()')

    const activo = elegirActivo(window.location.pathname)

    root.append(crearBarra(leerSesion()), crearMenu(activo))
    root.dataset.navMontada = 'true'
}
