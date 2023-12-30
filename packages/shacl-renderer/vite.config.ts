/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import OwnPackage from './package.json' assert { type: 'json' }
import Package from '../../package.json' assert { type: 'json' }
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), viteTsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './lib'),
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/ShaclRenderer.tsx'),
      name: 'ShaclRenderer',
      fileName: 'shacl-renderer',
    },
    rollupOptions: {
      external: [...Object.keys(Package.dependencies), ...Object.keys(OwnPackage.dependencies)],
    },
  },
})
