# Jutai (জুতাই)

A tap-reaction game: someone spits out of the vehicle window, and you give them a **jutai** (a shoe slap) in time. Built with React, TypeScript and Vite. Installable as a PWA, with scores stored in localStorage.

See [docs/src/requirements.md](docs/src/requirements.md) and [docs/tasks/tasks-version-1.md](docs/tasks/tasks-version-1.md).

## Local development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
npm test
```

## Deploy to GitHub Pages

1. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The **Deploy to GitHub Pages** workflow builds and publishes `dist`.

The expected site URL is https://goribco.github.io/jutai/.
