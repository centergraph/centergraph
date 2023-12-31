// vite.config.ts
import { defineConfig } from "file:///home/daniel/Development/centergraph/centergraph/node_modules/vite/dist/node/index.js";
import react from "file:///home/daniel/Development/centergraph/centergraph/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { resolve } from "path";
import dts from "file:///home/daniel/Development/centergraph/centergraph/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@centergraph/shacl-renderer",
  private: true,
  version: "0.0.0",
  type: "module",
  main: "./dist/shacl-renderer.umd.cjs",
  module: "./dist/shacl-renderer.js",
  types: "./dist/shacl-renderer.d.ts",
  scripts: {
    dev: "vite --port=8002",
    build: "tsc && vite build",
    test: "vitest",
    coverage: "vitest run --coverage",
    lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    preview: "vite preview"
  },
  dependencies: {}
};

// ../../package.json
var package_default2 = {
  name: "centergraph",
  version: "1.0.0",
  description: "The monorepo for CenterGraph",
  author: "Daniel Beeke",
  license: "MIT",
  workspaces: [
    "packages/*"
  ],
  dependencies: {
    "@iconify/react": "^4.1.1",
    "@preact/signals-react": "^2.0.0",
    "d2l-fetch": "^2.5.0",
    "d2l-fetch-dedupe": "^2.0.0",
    "d2l-fetch-simple-cache": "^2.0.0",
    grapoi: "^1.1.0",
    "jsonld-context-parser": "^2.4.0",
    "lodash-es": "^4.17.21",
    n3: "^1.17.2",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "shacl-engine": "^0.1.1",
    swr: "^2.2.4"
  },
  devDependencies: {
    "@rdfjs/data-model": "^2.0.1",
    "@rdfjs/dataset": "^2.0.1",
    "@rdfjs/namespace": "^2.0.0",
    "@rdfjs/types": "^1.1.0",
    "@testing-library/react": "^14.1.2",
    "@types/express": "^4.17.21",
    "@types/lodash-es": "^4.17.12",
    "@types/n3": "^1.16.4",
    "@types/rdfjs__data-model": "^2.0.7",
    "@types/rdfjs__dataset": "^2.0.7",
    "@types/rdfjs__namespace": "^2.0.10",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "@vitest/coverage-istanbul": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    eslint: "^8.55.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "eslint-plugin-simple-import-sort": "^10.0.0",
    "eslint-plugin-unused-imports": "^3.0.0",
    "happy-dom": "^12.10.3",
    typescript: "^5.3.3",
    vite: "^5.0.8",
    "vite-plugin-dts": "^3.7.0",
    "vite-plugin-pwa": "^0.17.4",
    "vite-tsconfig-paths": "^4.2.3",
    vitest: "^1.1.0"
  },
  engines: {
    node: "^20.0.0"
  },
  scripts: {
    dev: "turbo run dev",
    build: "turbo run build"
  },
  packageManager: "^npm@10.1.0"
};

// vite.config.ts
import viteTsconfigPaths from "file:///home/daniel/Development/centergraph/centergraph/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/home/daniel/Development/centergraph/centergraph/packages/shacl-renderer";
var vite_config_default = defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), viteTsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./lib")
    }
  },
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"]
    }
  },
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "lib/ShaclRenderer.tsx"),
      name: "ShaclRenderer",
      fileName: "shacl-renderer"
    },
    rollupOptions: {
      external: [...Object.keys(package_default2.dependencies), ...Object.keys(package_default.dependencies)]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIiwgIi4uLy4uL3BhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2RhbmllbC9EZXZlbG9wbWVudC9jZW50ZXJncmFwaC9jZW50ZXJncmFwaC9wYWNrYWdlcy9zaGFjbC1yZW5kZXJlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGFuaWVsL0RldmVsb3BtZW50L2NlbnRlcmdyYXBoL2NlbnRlcmdyYXBoL3BhY2thZ2VzL3NoYWNsLXJlbmRlcmVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2RhbmllbC9EZXZlbG9wbWVudC9jZW50ZXJncmFwaC9jZW50ZXJncmFwaC9wYWNrYWdlcy9zaGFjbC1yZW5kZXJlci92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgT3duUGFja2FnZSBmcm9tICcuL3BhY2thZ2UuanNvbicgYXNzZXJ0IHsgdHlwZTogJ2pzb24nIH1cbmltcG9ydCBQYWNrYWdlIGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbicgYXNzZXJ0IHsgdHlwZTogJ2pzb24nIH1cbmltcG9ydCB2aXRlVHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGR0cyh7IGluc2VydFR5cGVzRW50cnk6IHRydWUgfSksIHZpdGVUc2NvbmZpZ1BhdGhzKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vbGliJyksXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGVudmlyb25tZW50OiAnaGFwcHktZG9tJyxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCddLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvU2hhY2xSZW5kZXJlci50c3gnKSxcbiAgICAgIG5hbWU6ICdTaGFjbFJlbmRlcmVyJyxcbiAgICAgIGZpbGVOYW1lOiAnc2hhY2wtcmVuZGVyZXInLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsuLi5PYmplY3Qua2V5cyhQYWNrYWdlLmRlcGVuZGVuY2llcyksIC4uLk9iamVjdC5rZXlzKE93blBhY2thZ2UuZGVwZW5kZW5jaWVzKV0sXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJAY2VudGVyZ3JhcGgvc2hhY2wtcmVuZGVyZXJcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidmVyc2lvblwiOiBcIjAuMC4wXCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcIm1haW5cIjogXCIuL2Rpc3Qvc2hhY2wtcmVuZGVyZXIudW1kLmNqc1wiLFxuICBcIm1vZHVsZVwiOiBcIi4vZGlzdC9zaGFjbC1yZW5kZXJlci5qc1wiLFxuICBcInR5cGVzXCI6IFwiLi9kaXN0L3NoYWNsLXJlbmRlcmVyLmQudHNcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcInZpdGUgLS1wb3J0PTgwMDJcIixcbiAgICBcImJ1aWxkXCI6IFwidHNjICYmIHZpdGUgYnVpbGRcIixcbiAgICBcInRlc3RcIjogXCJ2aXRlc3RcIixcbiAgICBcImNvdmVyYWdlXCI6IFwidml0ZXN0IHJ1biAtLWNvdmVyYWdlXCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC4gLS1leHQgdHMsdHN4IC0tcmVwb3J0LXVudXNlZC1kaXNhYmxlLWRpcmVjdGl2ZXMgLS1tYXgtd2FybmluZ3MgMFwiLFxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHt9XG59XG4iLCAie1xuICBcIm5hbWVcIjogXCJjZW50ZXJncmFwaFwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiVGhlIG1vbm9yZXBvIGZvciBDZW50ZXJHcmFwaFwiLFxuICBcImF1dGhvclwiOiBcIkRhbmllbCBCZWVrZVwiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJ3b3Jrc3BhY2VzXCI6IFtcbiAgICBcInBhY2thZ2VzLypcIlxuICBdLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaWNvbmlmeS9yZWFjdFwiOiBcIl40LjEuMVwiLFxuICAgIFwiQHByZWFjdC9zaWduYWxzLXJlYWN0XCI6IFwiXjIuMC4wXCIsXG4gICAgXCJkMmwtZmV0Y2hcIjogXCJeMi41LjBcIixcbiAgICBcImQybC1mZXRjaC1kZWR1cGVcIjogXCJeMi4wLjBcIixcbiAgICBcImQybC1mZXRjaC1zaW1wbGUtY2FjaGVcIjogXCJeMi4wLjBcIixcbiAgICBcImdyYXBvaVwiOiBcIl4xLjEuMFwiLFxuICAgIFwianNvbmxkLWNvbnRleHQtcGFyc2VyXCI6IFwiXjIuNC4wXCIsXG4gICAgXCJsb2Rhc2gtZXNcIjogXCJeNC4xNy4yMVwiLFxuICAgIFwibjNcIjogXCJeMS4xNy4yXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInNoYWNsLWVuZ2luZVwiOiBcIl4wLjEuMVwiLFxuICAgIFwic3dyXCI6IFwiXjIuMi40XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHJkZmpzL2RhdGEtbW9kZWxcIjogXCJeMi4wLjFcIixcbiAgICBcIkByZGZqcy9kYXRhc2V0XCI6IFwiXjIuMC4xXCIsXG4gICAgXCJAcmRmanMvbmFtZXNwYWNlXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJAcmRmanMvdHlwZXNcIjogXCJeMS4xLjBcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTQuMS4yXCIsXG4gICAgXCJAdHlwZXMvZXhwcmVzc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJAdHlwZXMvbG9kYXNoLWVzXCI6IFwiXjQuMTcuMTJcIixcbiAgICBcIkB0eXBlcy9uM1wiOiBcIl4xLjE2LjRcIixcbiAgICBcIkB0eXBlcy9yZGZqc19fZGF0YS1tb2RlbFwiOiBcIl4yLjAuN1wiLFxuICAgIFwiQHR5cGVzL3JkZmpzX19kYXRhc2V0XCI6IFwiXjIuMC43XCIsXG4gICAgXCJAdHlwZXMvcmRmanNfX25hbWVzcGFjZVwiOiBcIl4yLjAuMTBcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjQzXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMTdcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjYuMTQuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl42LjE0LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjUuMFwiLFxuICAgIFwiQHZpdGVzdC9jb3ZlcmFnZS1pc3RhbmJ1bFwiOiBcIl4xLjEuMFwiLFxuICAgIFwiQHZpdGVzdC9jb3ZlcmFnZS12OFwiOiBcIl4xLjEuMFwiLFxuICAgIFwiZXNsaW50XCI6IFwiXjguNTUuMFwiLFxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl45LjAuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1ob29rc1wiOiBcIl40LjYuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1yZWZyZXNoXCI6IFwiXjAuNC41XCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXNpbXBsZS1pbXBvcnQtc29ydFwiOiBcIl4xMC4wLjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tdW51c2VkLWltcG9ydHNcIjogXCJeMy4wLjBcIixcbiAgICBcImhhcHB5LWRvbVwiOiBcIl4xMi4xMC4zXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMy4zXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMC44XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1kdHNcIjogXCJeMy43LjBcIixcbiAgICBcInZpdGUtcGx1Z2luLXB3YVwiOiBcIl4wLjE3LjRcIixcbiAgICBcInZpdGUtdHNjb25maWctcGF0aHNcIjogXCJeNC4yLjNcIixcbiAgICBcInZpdGVzdFwiOiBcIl4xLjEuMFwiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiXjIwLjAuMFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ0dXJibyBydW4gZGV2XCIsXG4gICAgXCJidWlsZFwiOiBcInR1cmJvIHJ1biBidWlsZFwiXG4gIH0sXG4gIFwicGFja2FnZU1hbmFnZXJcIjogXCJebnBtQDEwLjEuMFwiXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTOzs7QUNMaEI7QUFBQSxFQUNFLE1BQVE7QUFB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
