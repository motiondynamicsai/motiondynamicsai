import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// GitHub Pages only serves files, so each app route gets a copy of index.html (a 200 for links and refreshes),
// and 404.html is the app too, so a mistyped address shows the site's own not-found page.
const teamIds = [...readFileSync('src/pages/TeamRoutes.jsx', 'utf8').matchAll(/^\s+id: '([a-z-]+)',$/gm)].map((m) => m[1]);
const movedIds = ['diar-karim', 'angel', 'melika', 'erfan']; // old profile addresses, redirected in TeamRoutes.jsx
const routes = ['team', ...[...teamIds, ...movedIds].map((id) => `team/${id}`)];
function spaRoutes() {
  return {
    name: 'spa-routes',
    closeBundle() {
      for (const route of routes) {
        mkdirSync(`dist/${route}`, { recursive: true });
        copyFileSync('dist/index.html', `dist/${route}/index.html`);
      }
      copyFileSync('dist/index.html', 'dist/404.html');
    },
  };
}

export default defineConfig({
  plugins: [react(), spaRoutes()],
  base: "/", // This should point to the root if using a custom domain
  server: {
    host: true,
    port: 5173,
    open: true,
    historyApiFallback: true // This ensures all routes fall back to index.html
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});

