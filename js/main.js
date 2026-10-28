import Alpine from 'alpinejs'
import '../css/app.css'
import { registrarStores } from './store.js'

window.Alpine = Alpine

registrarStores(Alpine)

// Alpine.start() solo se llama aquí.
Alpine.start()
