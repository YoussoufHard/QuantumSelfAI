import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/supabase': {
        target: 'https://xtkaoknuzfmvdyxyhlrr.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
      },
      '/lingo': {
        target: 'https://api.lingo.translate/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lingo/, ''),
      },
    },
  },
});
