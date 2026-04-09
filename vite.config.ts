import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? '/FrederickRadius/' : '/',
  server: {
    proxy: {
      '/api/chart/incidents': {
        target: 'https://chartexp1.sha.maryland.gov',
        changeOrigin: true,
        rewrite: () => '/CHARTExportClientService/getEventMapDataJSON.do',
      },
    },
  },
}))
