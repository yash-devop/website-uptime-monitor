import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom"
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@repo/db": path.resolve(__dirname, "../../packages/db/dist/client.d.ts"),      // we resolve the @repo/db imported from packages/db.
      "@repo/common": path.resolve(__dirname, "../../packages/common/src/index.ts")     
    },
  },
})