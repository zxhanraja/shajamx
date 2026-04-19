import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    compression({ algorithm: 'gzip' })
  ],
  optimizeDeps: {
    exclude: ['three']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
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
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 8192,
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: true
  }
});
