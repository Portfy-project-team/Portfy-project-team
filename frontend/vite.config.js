import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5173,
    // En dev local (hors Docker) : redirige /api vers le backend
    // Évite les erreurs CORS pendant le développement
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});