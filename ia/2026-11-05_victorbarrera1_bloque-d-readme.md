# Bloque D — README de la entrega

- **Fecha:** 2026-11-05
- **Integrante:** @victorbarrera1
- **Rama:** `feat/bloque-d-readme`
- **PR:** pendiente
- **Prompt usado:** checklist de la Entrega 2, tarea D13 («Reescribir `README.md`
  con descripción, integrantes, tecnologías, requisitos, instalación,
  credenciales, vistas, funcionalidades, capa de datos, formato del backend
  real, mocks, estructura y enlace a `ia/README.md`»), con el estilo del README
  de referencia `skadecl/DW-2026-2`.

## D13 — README

- Se reescribió `README.md` completo:
  - Descripción del proyecto y su relación con la Entrega 2/3.
  - Integrantes con sus usuarios de GitHub (@victorbarrera1, @ManoloDeus y
    @martinmldndr-wq).
  - Tabla de tecnologías (Vite, Alpine, Tailwind, Ionicons npm) y requisitos.
  - Instalación, comandos y variables de entorno.
  - Credenciales de prueba de las cuatro cuentas, con rol y permisos.
  - Tabla de las siete vistas con ruta, acceso y forma de llegar, incluido el
    dashboard.
  - Funcionalidades por vista y estados de interfaz.
  - Diagrama de la capa de datos, contrato normalizado y endpoints simulados.
  - Formato esperado del backend real (`{data, meta}` / `{error, errores}`).
  - Tabla de mocks con archivo, cantidad de registros y contenido.
  - Árbol de estructura del proyecto y enlace a `ia/README.md`.
- Se quitaron las afirmaciones antiguas de que `js/api.js` y los mocks no
  existían, el uso del CDN y el login con cualquier contraseña.

### Ajustes necesarios

Mientras se documentaba el contrato real se corrigieron dos detalles:

- `src/api/http.js` ahora acepta el formato `{ data, meta }` en éxitos y
  `{ error, errores }` en errores, además del formato ya normalizado con `ok`.
  Así el README describe el comportamiento real del transporte.
- `src/iconos.js` registra los iconos con `addIcons` **antes** de definir el
  componente `<ion-icon>`, para que los iconos estáticos del dashboard se
  resuelvan en la primera carga sin avisos de Ionicons.

## Verificación

- `npm run build` pasa.
- Se revisó el README contra el código: rutas, credenciales, conteos de mocks,
  endpoints, estados y estructura.
- Se probó `src/api/http.js` con un backend temporal que responde
  `{ data, meta }` y `{ error, errores }`: el login guardó la sesión, el listado
  de clientes devolvió un array con `meta.total`, y el 422 conservó
  `errores.nombre`.
- En `npm run dev`, el dashboard cargó los 12 iconos con `svgContent` completo y
  sin advertencias de Ionicons.
