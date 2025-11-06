// vite.config.js — FULL UPDATED & FINAL (November 2025)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/',
  server: {
    port: 5173,
    open: true,
    host: true,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'recharts', 'lucide-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})