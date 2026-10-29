import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const root = import.meta.dirname

// Solo los .html de la raíz; el nombre del archivo (sin extensión) es la clave.
const htmlFiles = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .sort()

if (htmlFiles.length === 0) {
    throw new Error('No se encontraron archivos .html en la raíz del proyecto.')
}

const input = Object.fromEntries(
    htmlFiles.map((file) => [file.slice(0, -'.html'.length), resolve(root, file)]),
)

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        // Vite 8 usa Rolldown: la opción vigente es rolldownOptions.
        rolldownOptions: {
            input,
        },
    },
})
