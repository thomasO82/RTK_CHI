import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const source = (folder) => fileURLToPath(new URL('./src/' + folder, import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
  resolve: {
    alias: {
      '@': source(''),
      '@components': source('components'),
      '@hooks': source('hooks'),
      '@pages': source('pages'),
      '@features': source('features'),
      '@services': source('services'),
    },
  },
})
