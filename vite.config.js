import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const srcPath = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': srcPath,
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      contexts: fileURLToPath(new URL('./src/contexts', import.meta.url)),
      utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
      layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      router: fileURLToPath(new URL('./src/router', import.meta.url)),
      services: fileURLToPath(new URL('./src/services', import.meta.url)),
      stores: fileURLToPath(new URL('./src/stores', import.meta.url)),
      styles: fileURLToPath(new URL('./src/styles', import.meta.url)),
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },

  build: {
    chunkSizeWarningLimit: 10000,
  },
})