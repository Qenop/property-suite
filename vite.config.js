import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/property-suite',
  plugins: [react()],
  build: {
    // Manual chunking to split large dependencies
    rollupOptions: {
      output: {
        manualChunks: {
          // Splitting vendor dependencies (React, React DOM, etc.)
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // You can add more libraries or components to separate chunks
        },
      },
    },
    // Optional: Increase chunk size warning limit if needed
    chunkSizeWarningLimit: 1000, // Increase the limit to 1MB (1000 KB)
  },
});
