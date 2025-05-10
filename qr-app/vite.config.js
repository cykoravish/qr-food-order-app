import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    host: 'localhost', // explicitly set to 0.0.0.0
    port: 5173,
    strictPort: true,
  }
})

