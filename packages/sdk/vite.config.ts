import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import Package from '../../package.json' assert { type: 'json' }
import dts from 'vite-plugin-dts'
import OwnPackage from './package.json' assert { type: 'json' }
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), viteTsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/CenterGraph.ts'),
      name: 'CenterGraph',
      fileName: 'center-graph',
    },
    rollupOptions: {
      external: [...Object.keys(Package.dependencies), ...Object.keys(OwnPackage.dependencies)],
    },
  },
})
