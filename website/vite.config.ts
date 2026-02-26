import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5174,
    proxy: {
      '/wilayah': {
        target: 'https://wilayah.id',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/wilayah/, ''),
      },
    },
  }
})
