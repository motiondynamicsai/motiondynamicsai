import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
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

