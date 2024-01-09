import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import centerGraphVite from '@centergraph/sdk/centerGraphVite.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2022',
  },
  plugins: [
    react(),
    centerGraphVite({
      apiExport: '/src/centerGraph.ts',
    }),
    viteTsconfigPaths(),
  ],
})
