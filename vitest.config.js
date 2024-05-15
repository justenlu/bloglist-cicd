import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude:[
      ...configDefaults.exclude,
      'backend-tests/*',
      'e2e-tests/*'
    ]
  }
})