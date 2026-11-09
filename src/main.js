import Alpine from 'alpinejs'
import './css/app.css'
import './css/tema.css'
import './iconos.js'
import './tema.js'
// La guardia se importa antes del menú para que `window.__sesion` exista
// cuando `montarNav()` lea el nombre y el rol. En el build, los módulos de una
// página se agrupan en un solo chunk y el orden de los <script> del HTML no
// garantiza que guard.js se ejecute primero.
import './guard.js'
import api from './api.js'
import { montarNav } from './nav.js'

window.Alpine = Alpine

// El menú se monta antes de Alpine.start() para que Alpine lo inicialice.
montarNav()

// El enlace «Cerrar sesión» del menú borra la sesión simulada antes de salir.
document.addEventListener('click', async (evento) => {
    const enlace = evento.target.closest?.('[data-accion="cerrar-sesion"]')

    if (!enlace) {
        return
    }

    evento.preventDefault()
    enlace.setAttribute('aria-disabled', 'true')

    await api.auth.cerrarSesion()

    window.location.assign('index.html')
})

// Alpine.start() solo se llama aquí.
Alpine.start()
