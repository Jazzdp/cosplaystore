import react from '@vitejs/plugin-react'

export default {
  root: '.',
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
}

