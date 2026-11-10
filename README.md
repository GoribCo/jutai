# jutai

A browser-based Ludu game built with React, TypeScript, and Vite.

## Local development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

## Deploy to GitHub Pages

1. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Commit and push the workflow and accompanying changes to `main`.
3. Open **Actions → Deploy to GitHub Pages** to monitor deployment. You can also run it manually using **Run workflow** on `main`.

The expected site URL is https://goribco.github.io/jutai/.

The workflow installs locked dependencies with `npm ci`, builds the app into `dist`, and deploys that artifact using the built-in `GITHUB_TOKEN`. No personal access token or repository secrets are required. Each push to `main` redeploys the site.

The build reads the base path from GitHub Pages configuration, so asset URLs work under the repository subpath or a configured custom domain. Local development keeps Vite's default `/` base path. The app changes screens using React state, so no SPA redirect fallback is needed.

To preview a production build under the current repository path:

```sh
npm run build -- --base /jutai/
npm run preview -- --base /jutai/
```

Open http://localhost:4173/jutai/.
