import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      screen:{
        'xs':'280px'
      }
    })
  ],
  server: {
    host: 'localhost', // explicitly set to 0.0.0.0
    port: 5173,
    strictPort: true,
  }
})

