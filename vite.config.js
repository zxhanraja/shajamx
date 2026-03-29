import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('@react-three')) return 'react-three';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react-helmet')) return 'react-core';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    assetsInlineLimit: 4096, // Inline small assets
    minify: 'esbuild',
    reportCompressedSize: true
  }
});
