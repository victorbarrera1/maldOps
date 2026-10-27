# MaldOps

MaldOps es una plataforma web para gestionar campañas publicitarias. Su enfoque es el marketing digital: permite optimizar y administrar campañas en distintas plataformas.

Centraliza los principales servicios de publicidad en internet —Meta Ads (Facebook e Instagram), Google Ads (YouTube y Google Search), TikTok Ads y LinkedIn Ads— y permite analizar el rendimiento de las campañas para mejorarlas.

## Integrantes

- Victor Barrera
- Josemanuel Rodríguez
- Martin Maldonado

## Tecnologías

- HTML5 y CSS3
- JavaScript (módulos ES)
- [Vite](https://vite.dev/)
- [Ionicons](https://ionic.io/ionicons) (vía CDN)

## Requisitos

- Node.js 20.19+ o 22.12+ (incluye npm). Vite 8 no funciona con Node 18. Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org/).
- Un navegador moderno: Chrome, Firefox, Safari o Edge.
- Conexión a internet para cargar los iconos desde el CDN.

Para comprobar las versiones instaladas:

```bash
node -v
npm -v
```

## Cómo ejecutar MaldOps localmente

1. Clonar el repositorio:

```bash
git clone https://github.com/victorbarrera1/maldOps.git
cd maldOps
```

2. Instalar las dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir [http://localhost:5173/](http://localhost:5173/) en el navegador.

La terminal mostrará un mensaje como este:

```text
  VITE v8.3.0  ready in 225 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

> **Importante:** entra por `http://localhost:5173/`; no abras los archivos `.html` con doble clic. Con `file://` el navegador bloquea los módulos JavaScript.

El login es simulado: puedes entrar con cualquier usuario y contraseña.
