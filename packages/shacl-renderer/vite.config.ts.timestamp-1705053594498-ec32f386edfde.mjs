// vite.config.ts
import { defineConfig } from "file:///home/daniel/Development/centergraph/node_modules/vite/dist/node/index.js";
import react from "file:///home/daniel/Development/centergraph/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import dts from "file:///home/daniel/Development/centergraph/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@centergraph/shacl-renderer",
  private: true,
  version: "0.0.0",
  type: "module",
  description: "A tool to render a form or a view by using SHACL",
  main: "lib/ShaclRenderer.tsx",
  types: "lib/ShaclRenderer.tsx",
  scripts: {
    dev: "vite --port=8002",
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
    "@jeswr/pretty-turtle": "^1.4.0",
    "@preact/signals-react": "^2.0.0",
    "d2l-fetch": "^2.5.0",
    "d2l-fetch-dedupe": "^2.0.0",
    "d2l-fetch-simple-cache": "^2.0.0",
    grapoi: "^1.1.0",
    "jsonld-context-parser": "^2.4.0",
    "lodash-es": "^4.17.21",
    n3: "^1.17.2",
    react: "^18.2.0",
    "react-beautiful-dnd": "^13.1.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.2",
    "shacl-engine": "^0.1.1",
    "typescript-lru-cache": "^2.0.0"
  },
  devDependencies: {
    "@astrojs/check": "^0.4.1",
    "@astrojs/mdx": "^2.0.3",
    "@preact/preset-vite": "^2.7.0",
    "@rdfjs/data-model": "^2.0.1",
    "@rdfjs/dataset": "^2.0.1",
    "@rdfjs/namespace": "^2.0.0",
    "@rdfjs/types": "^1.1.0",
    "@testing-library/react": "^14.1.2",
    "@turbo/codemod": "^1.11.3",
    "@types/express": "^4.17.21",
    "@types/lodash-es": "^4.17.12",
    "@types/n3": "^1.16.4",
    "@types/rdfjs__data-model": "^2.0.7",
    "@types/rdfjs__dataset": "^2.0.7",
    "@types/rdfjs__namespace": "^2.0.10",
    "@types/react": "^18.2.43",
    "@types/react-beautiful-dnd": "^13.1.8",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "@vitest/coverage-istanbul": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    astro: "^4.0.9",
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
    vitest: "^1.1.0",
    "wait-on": "^7.2.0"
  },
  engines: {
    node: "^20.0.0"
  },
  scripts: {
    start: "cd packages/cli && deno run -A src/index.tsx",
    dev: "turbo run dev",
    build: "turbo run build"
  },
  packageManager: "^npm@10.1.0"
};

// vite.config.ts
import viteTsconfigPaths from "file:///home/daniel/Development/centergraph/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/home/daniel/Development/centergraph/packages/shacl-renderer";
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
        resolve(__vite_injected_original_dirname, "lib/ShaclRenderer.tsx"),
        resolve(__vite_injected_original_dirname, "lib/ShaclRenderer.react.tsx"),
        resolve(__vite_injected_original_dirname, "lib/defaultSettings.ts"),
        resolve(__vite_injected_original_dirname, "lib/helpers/registerWidgets.ts")
      ]
    },
    rollupOptions: {
      external: [...Object.keys(package_default2.dependencies), ...Object.keys(package_default.dependencies)]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIiwgIi4uLy4uL3BhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2RhbmllbC9EZXZlbG9wbWVudC9jZW50ZXJncmFwaC9wYWNrYWdlcy9zaGFjbC1yZW5kZXJlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGFuaWVsL0RldmVsb3BtZW50L2NlbnRlcmdyYXBoL3BhY2thZ2VzL3NoYWNsLXJlbmRlcmVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2RhbmllbC9EZXZlbG9wbWVudC9jZW50ZXJncmFwaC9wYWNrYWdlcy9zaGFjbC1yZW5kZXJlci92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCBPd25QYWNrYWdlIGZyb20gJy4vcGFja2FnZS5qc29uJyBhc3NlcnQgeyB0eXBlOiAnanNvbicgfVxuaW1wb3J0IFBhY2thZ2UgZnJvbSAnLi4vLi4vcGFja2FnZS5qc29uJyBhc3NlcnQgeyB0eXBlOiAnanNvbicgfVxuaW1wb3J0IHZpdGVUc2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgZHRzKHsgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSB9KSwgdml0ZVRzY29uZmlnUGF0aHMoKV0sXG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2h0bWwnXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFtcbiAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvU2hhY2xSZW5kZXJlci50c3gnKSxcbiAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvU2hhY2xSZW5kZXJlci5yZWFjdC50c3gnKSxcbiAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvZGVmYXVsdFNldHRpbmdzLnRzJyksXG4gICAgICAgIHJlc29sdmUoX19kaXJuYW1lLCAnbGliL2hlbHBlcnMvcmVnaXN0ZXJXaWRnZXRzLnRzJyksXG4gICAgICBdLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsuLi5PYmplY3Qua2V5cyhQYWNrYWdlLmRlcGVuZGVuY2llcyksIC4uLk9iamVjdC5rZXlzKE93blBhY2thZ2UuZGVwZW5kZW5jaWVzKV0sXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJAY2VudGVyZ3JhcGgvc2hhY2wtcmVuZGVyZXJcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidmVyc2lvblwiOiBcIjAuMC4wXCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSB0b29sIHRvIHJlbmRlciBhIGZvcm0gb3IgYSB2aWV3IGJ5IHVzaW5nIFNIQUNMXCIsXG4gIFwibWFpblwiOiBcImxpYi9TaGFjbFJlbmRlcmVyLnRzeFwiLFxuICBcInR5cGVzXCI6IFwibGliL1NoYWNsUmVuZGVyZXIudHN4XCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlIC0tcG9ydD04MDAyXCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0XCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcInZpdGVzdCBydW4gLS1jb3ZlcmFnZVwiLFxuICAgIFwibGludFwiOiBcImVzbGludCAuIC0tZXh0IHRzLHRzeCAtLXJlcG9ydC11bnVzZWQtZGlzYWJsZS1kaXJlY3RpdmVzIC0tbWF4LXdhcm5pbmdzIDBcIixcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7fVxufVxuIiwgIntcbiAgXCJuYW1lXCI6IFwiY2VudGVyZ3JhcGhcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlRoZSBtb25vcmVwbyBmb3IgQ2VudGVyR3JhcGhcIixcbiAgXCJhdXRob3JcIjogXCJEYW5pZWwgQmVla2VcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwid29ya3NwYWNlc1wiOiBbXG4gICAgXCJwYWNrYWdlcy8qXCJcbiAgXSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGljb25pZnkvcmVhY3RcIjogXCJeNC4xLjFcIixcbiAgICBcIkBqZXN3ci9wcmV0dHktdHVydGxlXCI6IFwiXjEuNC4wXCIsXG4gICAgXCJAcHJlYWN0L3NpZ25hbHMtcmVhY3RcIjogXCJeMi4wLjBcIixcbiAgICBcImQybC1mZXRjaFwiOiBcIl4yLjUuMFwiLFxuICAgIFwiZDJsLWZldGNoLWRlZHVwZVwiOiBcIl4yLjAuMFwiLFxuICAgIFwiZDJsLWZldGNoLXNpbXBsZS1jYWNoZVwiOiBcIl4yLjAuMFwiLFxuICAgIFwiZ3JhcG9pXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJqc29ubGQtY29udGV4dC1wYXJzZXJcIjogXCJeMi40LjBcIixcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJuM1wiOiBcIl4xLjE3LjJcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtYmVhdXRpZnVsLWRuZFwiOiBcIl4xMy4xLjFcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LXJvdXRlci1kb21cIjogXCJeNi4yMS4yXCIsXG4gICAgXCJzaGFjbC1lbmdpbmVcIjogXCJeMC4xLjFcIixcbiAgICBcInR5cGVzY3JpcHQtbHJ1LWNhY2hlXCI6IFwiXjIuMC4wXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFzdHJvanMvY2hlY2tcIjogXCJeMC40LjFcIixcbiAgICBcIkBhc3Ryb2pzL21keFwiOiBcIl4yLjAuM1wiLFxuICAgIFwiQHByZWFjdC9wcmVzZXQtdml0ZVwiOiBcIl4yLjcuMFwiLFxuICAgIFwiQHJkZmpzL2RhdGEtbW9kZWxcIjogXCJeMi4wLjFcIixcbiAgICBcIkByZGZqcy9kYXRhc2V0XCI6IFwiXjIuMC4xXCIsXG4gICAgXCJAcmRmanMvbmFtZXNwYWNlXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJAcmRmanMvdHlwZXNcIjogXCJeMS4xLjBcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTQuMS4yXCIsXG4gICAgXCJAdHVyYm8vY29kZW1vZFwiOiBcIl4xLjExLjNcIixcbiAgICBcIkB0eXBlcy9leHByZXNzXCI6IFwiXjQuMTcuMjFcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2gtZXNcIjogXCJeNC4xNy4xMlwiLFxuICAgIFwiQHR5cGVzL24zXCI6IFwiXjEuMTYuNFwiLFxuICAgIFwiQHR5cGVzL3JkZmpzX19kYXRhLW1vZGVsXCI6IFwiXjIuMC43XCIsXG4gICAgXCJAdHlwZXMvcmRmanNfX2RhdGFzZXRcIjogXCJeMi4wLjdcIixcbiAgICBcIkB0eXBlcy9yZGZqc19fbmFtZXNwYWNlXCI6IFwiXjIuMC4xMFwiLFxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjIuNDNcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1iZWF1dGlmdWwtZG5kXCI6IFwiXjEzLjEuOFwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LWRvbVwiOiBcIl4xOC4yLjE3XCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl42LjE0LjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNi4xNC4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjogXCJeMy41LjBcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtaXN0YW5idWxcIjogXCJeMS4xLjBcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMS4xLjBcIixcbiAgICBcImFzdHJvXCI6IFwiXjQuMC45XCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41NS4wXCIsXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMC4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LWhvb2tzXCI6IFwiXjQuNi4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LXJlZnJlc2hcIjogXCJeMC40LjVcIixcbiAgICBcImVzbGludC1wbHVnaW4tc2ltcGxlLWltcG9ydC1zb3J0XCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi11bnVzZWQtaW1wb3J0c1wiOiBcIl4zLjAuMFwiLFxuICAgIFwiaGFwcHktZG9tXCI6IFwiXjEyLjEwLjNcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4zLjNcIixcbiAgICBcInZpdGVcIjogXCJeNS4wLjhcIixcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4zLjcuMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tcHdhXCI6IFwiXjAuMTcuNFwiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjIuM1wiLFxuICAgIFwidml0ZXN0XCI6IFwiXjEuMS4wXCIsXG4gICAgXCJ3YWl0LW9uXCI6IFwiXjcuMi4wXCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCJeMjAuMC4wXCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInN0YXJ0XCI6IFwiY2QgcGFja2FnZXMvY2xpICYmIGRlbm8gcnVuIC1BIHNyYy9pbmRleC50c3hcIixcbiAgICBcImRldlwiOiBcInR1cmJvIHJ1biBkZXZcIixcbiAgICBcImJ1aWxkXCI6IFwidHVyYm8gcnVuIGJ1aWxkXCJcbiAgfSxcbiAgXCJwYWNrYWdlTWFuYWdlclwiOiBcIl5ucG1AMTAuMS4wXCJcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUzs7O0FDSmhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixNQUFRO0FBQUEsRUFDUixPQUFTO0FBQUEsRUFDVCxTQUFXO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxNQUFRO0FBQUEsSUFDUixVQUFZO0FBQUEsSUFDWixNQUFRO0FBQUEsSUFDUixTQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsY0FBZ0IsQ0FBQztBQUNuQjs7O0FDaEJBLElBQUFBLG1CQUFBO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxZQUFjO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxrQkFBa0I7QUFBQSxJQUNsQix3QkFBd0I7QUFBQSxJQUN4Qix5QkFBeUI7QUFBQSxJQUN6QixhQUFhO0FBQUEsSUFDYixvQkFBb0I7QUFBQSxJQUNwQiwwQkFBMEI7QUFBQSxJQUMxQixRQUFVO0FBQUEsSUFDVix5QkFBeUI7QUFBQSxJQUN6QixhQUFhO0FBQUEsSUFDYixJQUFNO0FBQUEsSUFDTixPQUFTO0FBQUEsSUFDVCx1QkFBdUI7QUFBQSxJQUN2QixhQUFhO0FBQUEsSUFDYixvQkFBb0I7QUFBQSxJQUNwQixnQkFBZ0I7QUFBQSxJQUNoQix3QkFBd0I7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIsa0JBQWtCO0FBQUEsSUFDbEIsZ0JBQWdCO0FBQUEsSUFDaEIsdUJBQXVCO0FBQUEsSUFDdkIscUJBQXFCO0FBQUEsSUFDckIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsZ0JBQWdCO0FBQUEsSUFDaEIsMEJBQTBCO0FBQUEsSUFDMUIsa0JBQWtCO0FBQUEsSUFDbEIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsYUFBYTtBQUFBLElBQ2IsNEJBQTRCO0FBQUEsSUFDNUIseUJBQXlCO0FBQUEsSUFDekIsMkJBQTJCO0FBQUEsSUFDM0IsZ0JBQWdCO0FBQUEsSUFDaEIsOEJBQThCO0FBQUEsSUFDOUIsb0JBQW9CO0FBQUEsSUFDcEIsb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0IsNEJBQTRCO0FBQUEsSUFDNUIsNkJBQTZCO0FBQUEsSUFDN0IsdUJBQXVCO0FBQUEsSUFDdkIsT0FBUztBQUFBLElBQ1QsUUFBVTtBQUFBLElBQ1YsMEJBQTBCO0FBQUEsSUFDMUIsNkJBQTZCO0FBQUEsSUFDN0IsK0JBQStCO0FBQUEsSUFDL0Isb0NBQW9DO0FBQUEsSUFDcEMsZ0NBQWdDO0FBQUEsSUFDaEMsYUFBYTtBQUFBLElBQ2IsWUFBYztBQUFBLElBQ2QsTUFBUTtBQUFBLElBQ1IsbUJBQW1CO0FBQUEsSUFDbkIsbUJBQW1CO0FBQUEsSUFDbkIsdUJBQXVCO0FBQUEsSUFDdkIsUUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFXO0FBQUEsSUFDVCxPQUFTO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsZ0JBQWtCO0FBQ3BCOzs7QUZyRUEsT0FBTyx1QkFBdUI7QUFQOUIsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsa0JBQWtCLEtBQUssQ0FBQyxHQUFHLGtCQUFrQixDQUFDO0FBQUEsRUFDdkUsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxNQUFNO0FBQUEsSUFDbkM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsUUFDTCxRQUFRLGtDQUFXLHVCQUF1QjtBQUFBLFFBQzFDLFFBQVEsa0NBQVcsNkJBQTZCO0FBQUEsUUFDaEQsUUFBUSxrQ0FBVyx3QkFBd0I7QUFBQSxRQUMzQyxRQUFRLGtDQUFXLGdDQUFnQztBQUFBLE1BQ3JEO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLEdBQUcsT0FBTyxLQUFLQyxpQkFBUSxZQUFZLEdBQUcsR0FBRyxPQUFPLEtBQUssZ0JBQVcsWUFBWSxDQUFDO0FBQUEsSUFDMUY7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGFja2FnZV9kZWZhdWx0IiwgInBhY2thZ2VfZGVmYXVsdCJdCn0K
