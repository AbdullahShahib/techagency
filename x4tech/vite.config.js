import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-quill')) return 'react-quill';
          if (id.includes('three')) return 'three';
          if (id.includes('framer-motion') || id.includes('/motion/')) return 'motion';
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('lucide-react')) return 'lucide-react';
          if (id.includes('react-router-dom')) return 'router';

          return 'vendor';
        }
      }
    }
  }
})
