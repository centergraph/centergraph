/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import OwnPackage from './package.json' assert { type: 'json' }
import Package from '../../package.json' assert { type: 'json' }
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), viteTsconfigPaths()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'lib/ShaclRenderer.tsx'),
        resolve(__dirname, 'lib/ShaclRenderer.react.tsx'),
        resolve(__dirname, 'lib/defaultSettings.ts'),
        resolve(__dirname, 'lib/helpers/registerWidgets.ts'),
      ],
    },
    rollupOptions: {
      external: [...Object.keys(Package.dependencies), ...Object.keys(OwnPackage.dependencies)],
    },
  },
})
