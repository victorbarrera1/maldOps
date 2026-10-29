import Alpine from 'alpinejs'
import '../css/app.css'
import { montarNav } from './nav.js'
import { registrarStores } from './store.js'

window.Alpine = Alpine

registrarStores(Alpine)

// El menú se monta antes de Alpine.start() para que Alpine lo inicialice.
montarNav()

// Alpine.start() solo se llama aquí.
Alpine.start()
