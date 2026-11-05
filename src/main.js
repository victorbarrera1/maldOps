import Alpine from 'alpinejs'
import './css/app.css'
import api from './api.js'
import { montarNav } from './nav.js'
import { registrarStores } from './store.js'

window.Alpine = Alpine

registrarStores(Alpine)

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
