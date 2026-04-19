import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip' })
  ],
  optimizeDeps: {
    exclude: ['three']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    assetsInlineLimit: 8192,
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: true
  }
});
