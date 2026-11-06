/**
 * Ionicons desde npm, sin CDN.
 *
 * Se registra el componente `<ion-icon>` en modo no perezoso y se le entregan
 * solo los iconos que usa la app. Así el build no depende de la red y tampoco
 * descarga el paquete completo de iconos.
 */

import { addIcons } from 'ionicons/components'
import { defineCustomElement } from 'ionicons/components/ion-icon.js'
import {
    cardOutline,
    cash,
    homeOutline,
    informationCircleOutline,
    logInOutline,
    menu,
    people,
    personOutline,
    receipt,
    search,
    settingsOutline,
    trendingUp,
} from 'ionicons/icons'

defineCustomElement()

addIcons({
    'card-outline': cardOutline,
    cash,
    'home-outline': homeOutline,
    'information-circle-outline': informationCircleOutline,
    'log-in-outline': logInOutline,
    menu,
    people,
    'person-outline': personOutline,
    receipt,
    search,
    'settings-outline': settingsOutline,
    'trending-up': trendingUp,
})
