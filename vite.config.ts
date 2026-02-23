/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths(), flowbiteReact()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5026',
        changeOrigin: true,
        secure: false,
      },
      '/server': {
        target: 'http://127.0.0.1:5026',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    force: true
  }
})