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
        manualChunks: {
          three: ['three']
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
