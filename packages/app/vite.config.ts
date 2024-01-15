import { defineConfig } from 'vite'
import centerGraphVite from '@centergraph/sdk/centerGraphVite.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    centerGraphVite({
      apiExport: '/src/centerGraph.ts',
    }),
  ],
})
