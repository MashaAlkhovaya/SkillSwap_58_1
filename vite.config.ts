import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Мок-сервер из server/: фронт ходит по относительному /api и не знает про порт
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
