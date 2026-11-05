# Bloque A — Capa de datos

- **Fecha:** 2026-11-05
- **Integrante:** @victorbarrera1
- **Rama:** `feat/bloque-a-capa-datos`
- **Prompt usado:** instrucción de la Entrega 2 (checklist A–E), con la regla de
  un PR por bloque y un commit por tarea. Para este bloque: crear los mocks en
  `public/mocks/`, la capa `js/api/`, la fachada `js/api.js`, la sesión con
  redirecciones y el simulador de errores.

## A1 — Mocks

Se crearon los cuatro archivos de datos simulados en `public/mocks/`. El
checklist de la Entrega 2 asigna los cuatro mocks a este bloque, por lo que se
crean acá y no en ramas separadas de Martin o Josemanuel.

- `usuarios.json`: 4 usuarios (`u-001`…`u-004`), roles `admin` y `vendedor`.
- `clientes.json`: 12 clientes (`cli-001`…`cli-012`).
- `ventas.json`: 15 ventas (`ven-001`…`ven-015`), todas con `clienteId` válido.
- `preguntas.json`: 8 preguntas (`preg-001`…`preg-008`).

Verificación: los cuatro JSON parsean con `JSON.parse`; los conteos, ids,
roles, servicios, estatus y relaciones `clienteId` son válidos.
