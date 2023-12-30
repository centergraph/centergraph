import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import Package from '../../package.json' assert { type: 'json' }
import dts from 'vite-plugin-dts'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), viteTsconfigPaths()],
  build: {
    lib: {
      entry: [resolve(__dirname, 'lib/namespaces.ts'), resolve(__dirname, 'lib/QueryBuilder.ts')],
    },
    rollupOptions: {
      external: Object.keys(Package.dependencies),
    },
  },
})
