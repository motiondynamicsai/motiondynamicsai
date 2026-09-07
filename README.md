# Motion Dynamics website

## Local development

```bash
npm install
npm run dev
```

## Docker

Build and run the production container locally:

```bash
docker build -t motiondynamicsai .
docker run --rm -p 8080:80 motiondynamicsai
```

Then open <http://localhost:8080>.

The container builds the Vite app in a Node stage and serves the generated static files with Nginx. Nginx is configured to fall back to `index.html` so React routes such as `/team` work on direct navigation.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` and can also be started manually. It builds the site inside the Docker builder stage, extracts `dist`, and deploys that static artifact to GitHub Pages.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
