// [IA] inicio · ia/2026-11-11_victorbarrera1_exportar-buscador-contactos.md
/**
 * Exportación de reportes a archivos que abre Excel.
 *
 * Genera un CSV con separador `;` y BOM UTF-8: es lo que Excel en español
 * (Chile) abre con doble clic, con tildes y columnas bien separadas. Solo
 * construye el archivo y lo descarga; no accede a datos ni a localStorage.
 */

const SEPARADOR = ';'
const SALTO = '\r\n'

/**
 * Escapa una celda. Los números se escriben tal cual para que Excel pueda
 * sumarlos. El texto que empieza con `=`, `+`, `-` o `@` se antepone con `'`
 * para que Excel no lo ejecute como fórmula.
 */
function celda(valor) {
    if (typeof valor === 'number' && Number.isFinite(valor)) {
        return String(valor)
    }

    let texto = String(valor ?? '')

    if (/^[=+\-@\t\r]/.test(texto)) {
        texto = `'${texto}`
    }

    if (/[;"\r\n]/.test(texto)) {
        texto = `"${texto.replace(/"/g, '""')}"`
    }

    return texto
}

/** Arma el contenido del CSV a partir de encabezados y filas. */
export function construirCsv(columnas, filas) {
    const lineas = [columnas, ...filas].map((fila) => fila.map(celda).join(SEPARADOR))

    return `﻿${lineas.join(SALTO)}${SALTO}`
}

/** Descarga un CSV con el nombre indicado. */
export function descargarCsv(nombreArchivo, columnas, filas) {
    const blob = new Blob([construirCsv(columnas, filas)], {
        type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')

    enlace.href = url
    enlace.download = nombreArchivo
    document.body.append(enlace)
    enlace.click()
    enlace.remove()

    setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Fecha local en formato AAAA-MM-DD para el nombre del archivo. */
export function fechaParaArchivo(fecha = new Date()) {
    const dos = (n) => String(n).padStart(2, '0')

    return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`
}
// [IA] fin
