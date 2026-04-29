import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
        // Keep three.js + R3F + postprocessing + leva in their own chunk that
        // is only fetched when the lazy-loaded HeroScene is mounted. Other
        // node_modules go in a generic vendor chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('postprocessing') ||
            id.includes('leva') ||
            id.includes('simplex-noise')
          ) {
            return 'three';
          }
          if (id.includes('gsap')) return 'gsap';
          return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  }
});
