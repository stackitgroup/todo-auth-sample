import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  base: './',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: '../../webroot',
    rollupOptions: {
      input: {
        main: './src/main.tsx'
      }
    },
    assetsDir: '',
    copyPublicDir: true
  }
})
