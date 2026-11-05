import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const root = import.meta.dirname

// Los .html siguen en la raíz; el código vive en src/ y los estáticos en public/.
// El nombre del archivo (sin extensión) es la clave de cada página del build.
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
    publicDir: 'public',
    build: {
        // Vite 8 usa Rolldown: la opción vigente es rolldownOptions.
        rolldownOptions: {
            input,
        },
    },
})
