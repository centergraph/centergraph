// vite.config.ts
import { defineConfig } from "file:///home/daniel/Development/centergraph/centergraph/node_modules/vite/dist/node/index.js";
import react from "file:///home/daniel/Development/centergraph/centergraph/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";

// ../../package.json
var package_default = {
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
import dts from "file:///home/daniel/Development/centergraph/centergraph/node_modules/vite-plugin-dts/dist/index.mjs";
import viteTsconfigPaths from "file:///home/daniel/Development/centergraph/centergraph/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/home/daniel/Development/centergraph/centergraph/packages/shared";
var vite_config_default = defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), viteTsconfigPaths()],
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"]
    }
  },
  build: {
    lib: {
      entry: [
        resolve(__vite_injected_original_dirname, "lib/namespaces.ts"),
        resolve(__vite_injected_original_dirname, "lib/QueryBuilder.ts"),
        resolve(__vite_injected_original_dirname, "lib/jsonLdNester.ts"),
        resolve(__vite_injected_original_dirname, "lib/quadsToShapeObject.ts"),
        resolve(__vite_injected_original_dirname, "lib/shaclToType.ts")
      ]
    },
    rollupOptions: {
      external: Object.keys(package_default.dependencies)
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiLi4vLi4vcGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGFuaWVsL0RldmVsb3BtZW50L2NlbnRlcmdyYXBoL2NlbnRlcmdyYXBoL3BhY2thZ2VzL3NoYXJlZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGFuaWVsL0RldmVsb3BtZW50L2NlbnRlcmdyYXBoL2NlbnRlcmdyYXBoL3BhY2thZ2VzL3NoYXJlZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kYW5pZWwvRGV2ZWxvcG1lbnQvY2VudGVyZ3JhcGgvY2VudGVyZ3JhcGgvcGFja2FnZXMvc2hhcmVkL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCBQYWNrYWdlIGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbicgYXNzZXJ0IHsgdHlwZTogJ2pzb24nIH1cbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHZpdGVUc2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgZHRzKHsgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSB9KSwgdml0ZVRzY29uZmlnUGF0aHMoKV0sXG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2h0bWwnXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFtcbiAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvbmFtZXNwYWNlcy50cycpLFxuICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ2xpYi9RdWVyeUJ1aWxkZXIudHMnKSxcbiAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvanNvbkxkTmVzdGVyLnRzJyksXG4gICAgICAgIHJlc29sdmUoX19kaXJuYW1lLCAnbGliL3F1YWRzVG9TaGFwZU9iamVjdC50cycpLFxuICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ2xpYi9zaGFjbFRvVHlwZS50cycpLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cyhQYWNrYWdlLmRlcGVuZGVuY2llcyksXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJjZW50ZXJncmFwaFwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiVGhlIG1vbm9yZXBvIGZvciBDZW50ZXJHcmFwaFwiLFxuICBcImF1dGhvclwiOiBcIkRhbmllbCBCZWVrZVwiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJ3b3Jrc3BhY2VzXCI6IFtcbiAgICBcInBhY2thZ2VzLypcIlxuICBdLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaWNvbmlmeS9yZWFjdFwiOiBcIl40LjEuMVwiLFxuICAgIFwiQHByZWFjdC9zaWduYWxzLXJlYWN0XCI6IFwiXjIuMC4wXCIsXG4gICAgXCJkMmwtZmV0Y2hcIjogXCJeMi41LjBcIixcbiAgICBcImQybC1mZXRjaC1kZWR1cGVcIjogXCJeMi4wLjBcIixcbiAgICBcImQybC1mZXRjaC1zaW1wbGUtY2FjaGVcIjogXCJeMi4wLjBcIixcbiAgICBcImdyYXBvaVwiOiBcIl4xLjEuMFwiLFxuICAgIFwianNvbmxkLWNvbnRleHQtcGFyc2VyXCI6IFwiXjIuNC4wXCIsXG4gICAgXCJsb2Rhc2gtZXNcIjogXCJeNC4xNy4yMVwiLFxuICAgIFwibjNcIjogXCJeMS4xNy4yXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInNoYWNsLWVuZ2luZVwiOiBcIl4wLjEuMVwiLFxuICAgIFwic3dyXCI6IFwiXjIuMi40XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHJkZmpzL2RhdGEtbW9kZWxcIjogXCJeMi4wLjFcIixcbiAgICBcIkByZGZqcy9kYXRhc2V0XCI6IFwiXjIuMC4xXCIsXG4gICAgXCJAcmRmanMvbmFtZXNwYWNlXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJAcmRmanMvdHlwZXNcIjogXCJeMS4xLjBcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTQuMS4yXCIsXG4gICAgXCJAdHlwZXMvZXhwcmVzc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJAdHlwZXMvbG9kYXNoLWVzXCI6IFwiXjQuMTcuMTJcIixcbiAgICBcIkB0eXBlcy9uM1wiOiBcIl4xLjE2LjRcIixcbiAgICBcIkB0eXBlcy9yZGZqc19fZGF0YS1tb2RlbFwiOiBcIl4yLjAuN1wiLFxuICAgIFwiQHR5cGVzL3JkZmpzX19kYXRhc2V0XCI6IFwiXjIuMC43XCIsXG4gICAgXCJAdHlwZXMvcmRmanNfX25hbWVzcGFjZVwiOiBcIl4yLjAuMTBcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjQzXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMTdcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjYuMTQuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl42LjE0LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjUuMFwiLFxuICAgIFwiQHZpdGVzdC9jb3ZlcmFnZS1pc3RhbmJ1bFwiOiBcIl4xLjEuMFwiLFxuICAgIFwiQHZpdGVzdC9jb3ZlcmFnZS12OFwiOiBcIl4xLjEuMFwiLFxuICAgIFwiZXNsaW50XCI6IFwiXjguNTUuMFwiLFxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl45LjAuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1ob29rc1wiOiBcIl40LjYuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1yZWZyZXNoXCI6IFwiXjAuNC41XCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXNpbXBsZS1pbXBvcnQtc29ydFwiOiBcIl4xMC4wLjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tdW51c2VkLWltcG9ydHNcIjogXCJeMy4wLjBcIixcbiAgICBcImhhcHB5LWRvbVwiOiBcIl4xMi4xMC4zXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMy4zXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMC44XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1kdHNcIjogXCJeMy43LjBcIixcbiAgICBcInZpdGUtcGx1Z2luLXB3YVwiOiBcIl4wLjE3LjRcIixcbiAgICBcInZpdGUtdHNjb25maWctcGF0aHNcIjogXCJeNC4yLjNcIixcbiAgICBcInZpdGVzdFwiOiBcIl4xLjEuMFwiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiXjIwLjAuMFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ0dXJibyBydW4gZGV2XCIsXG4gICAgXCJidWlsZFwiOiBcInR1cmJvIHJ1biBidWlsZFwiXG4gIH0sXG4gIFwicGFja2FnZU1hbmFnZXJcIjogXCJebnBtQDEwLjEuMFwiXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTs7O0FDSHhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxZQUFjO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxrQkFBa0I7QUFBQSxJQUNsQix5QkFBeUI7QUFBQSxJQUN6QixhQUFhO0FBQUEsSUFDYixvQkFBb0I7QUFBQSxJQUNwQiwwQkFBMEI7QUFBQSxJQUMxQixRQUFVO0FBQUEsSUFDVix5QkFBeUI7QUFBQSxJQUN6QixhQUFhO0FBQUEsSUFDYixJQUFNO0FBQUEsSUFDTixPQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixnQkFBZ0I7QUFBQSxJQUNoQixLQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIscUJBQXFCO0FBQUEsSUFDckIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsZ0JBQWdCO0FBQUEsSUFDaEIsMEJBQTBCO0FBQUEsSUFDMUIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsYUFBYTtBQUFBLElBQ2IsNEJBQTRCO0FBQUEsSUFDNUIseUJBQXlCO0FBQUEsSUFDekIsMkJBQTJCO0FBQUEsSUFDM0IsZ0JBQWdCO0FBQUEsSUFDaEIsb0JBQW9CO0FBQUEsSUFDcEIsb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0IsNEJBQTRCO0FBQUEsSUFDNUIsNkJBQTZCO0FBQUEsSUFDN0IsdUJBQXVCO0FBQUEsSUFDdkIsUUFBVTtBQUFBLElBQ1YsMEJBQTBCO0FBQUEsSUFDMUIsNkJBQTZCO0FBQUEsSUFDN0IsK0JBQStCO0FBQUEsSUFDL0Isb0NBQW9DO0FBQUEsSUFDcEMsZ0NBQWdDO0FBQUEsSUFDaEMsYUFBYTtBQUFBLElBQ2IsWUFBYztBQUFBLElBQ2QsTUFBUTtBQUFBLElBQ1IsbUJBQW1CO0FBQUEsSUFDbkIsbUJBQW1CO0FBQUEsSUFDbkIsdUJBQXVCO0FBQUEsSUFDdkIsUUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFXO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsZ0JBQWtCO0FBQ3BCOzs7QUQ1REEsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sdUJBQXVCO0FBTjlCLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLGtCQUFrQixLQUFLLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztBQUFBLEVBQ3ZFLE1BQU07QUFBQSxJQUNKLGFBQWE7QUFBQSxJQUNiLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFVBQVUsQ0FBQyxRQUFRLFFBQVEsTUFBTTtBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0wsUUFBUSxrQ0FBVyxtQkFBbUI7QUFBQSxRQUN0QyxRQUFRLGtDQUFXLHFCQUFxQjtBQUFBLFFBQ3hDLFFBQVEsa0NBQVcscUJBQXFCO0FBQUEsUUFDeEMsUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxRQUM5QyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLE1BQ3pDO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxPQUFPLEtBQUssZ0JBQVEsWUFBWTtBQUFBLElBQzVDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
