import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Detect files copied into media even when filesystem events are missed.
      usePolling: true,
      interval: 300,
      binaryInterval: 300,
    },
  },
  resolve: {
    alias: {
      '@teaching-resources': '/src/data/teachingResources',
    },
  },
})
