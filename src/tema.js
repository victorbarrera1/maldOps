// [IA] inicio · ia/2026-11-09_ManoloDeus_modo-oscuro.md
const CLAVE = 'maldops.tema'

function leerGuardado() {
    try {
        return localStorage.getItem(CLAVE)
    } catch {
        return null
    }
}

function aplicar(oscuro) {
    document.documentElement.classList.toggle('dark', oscuro)

    try {
        localStorage.setItem(CLAVE, oscuro ? 'oscuro' : 'claro')
    } catch {
        // Sin almacenamiento: el tema dura solo mientras la página esté abierta.
    }
}

const guardado = leerGuardado()
const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches

document.documentElement.classList.toggle(
    'dark',
    guardado ? guardado === 'oscuro' : prefiereOscuro,
)

const interruptor = document.querySelector('#modo-oscuro')

if (interruptor) {
    interruptor.checked = document.documentElement.classList.contains('dark')
    interruptor.addEventListener('change', () => aplicar(interruptor.checked))
}
