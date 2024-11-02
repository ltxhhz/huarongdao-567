import { defineConfig } from 'vite'

export default defineConfig({
  // base: process.env.NODE_ENV == 'development' ? undefined : '/huarongdao-567',
  server: {
    host: '0.0.0.0',
    port: 3001
  },
  // assetsInclude: ['**/*.html']
  esbuild: {
    pure: ['console.log']
  }
})
