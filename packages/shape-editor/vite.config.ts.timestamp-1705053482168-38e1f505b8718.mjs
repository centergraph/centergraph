// vite.config.ts
import { defineConfig } from "file:///home/daniel/Development/centergraph/node_modules/vite/dist/node/index.js";
import react from "file:///home/daniel/Development/centergraph/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import dts from "file:///home/daniel/Development/centergraph/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@centergraph/shape-editor",
  private: true,
  version: "0.0.0",
  description: "A SHACL shape editor",
  type: "module",
  scripts: {
    dev: "vite --port=8003",
    build: "tsc && vite build",
    test: "vitest",
    lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    preview: "vite preview"
  },
  dependencies: {
    react: "^18.2.0",
    "react-dom": "^18.2.0"
  },
  devDependencies: {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    eslint: "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    typescript: "^5.2.2",
    vite: "^5.0.8"
  }
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
var __vite_injected_original_dirname = "/home/daniel/Development/centergraph/packages/shape-editor";
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
      name: "ShapeEditor",
      entry: [resolve(__vite_injected_original_dirname, "lib/ShapeEditor.tsx")]
    },
    rollupOptions: {
      external: [...Object.keys(package_default2.dependencies), ...Object.keys(package_default.dependencies)]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIiwgIi4uLy4uL3BhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2RhbmllbC9EZXZlbG9wbWVudC9jZW50ZXJncmFwaC9wYWNrYWdlcy9zaGFwZS1lZGl0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RhbmllbC9EZXZlbG9wbWVudC9jZW50ZXJncmFwaC9wYWNrYWdlcy9zaGFwZS1lZGl0b3Ivdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZGFuaWVsL0RldmVsb3BtZW50L2NlbnRlcmdyYXBoL3BhY2thZ2VzL3NoYXBlLWVkaXRvci92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCBPd25QYWNrYWdlIGZyb20gJy4vcGFja2FnZS5qc29uJyBhc3NlcnQgeyB0eXBlOiAnanNvbicgfVxuaW1wb3J0IFBhY2thZ2UgZnJvbSAnLi4vLi4vcGFja2FnZS5qc29uJyBhc3NlcnQgeyB0eXBlOiAnanNvbicgfVxuaW1wb3J0IHZpdGVUc2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgZHRzKHsgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSB9KSwgdml0ZVRzY29uZmlnUGF0aHMoKV0sXG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2h0bWwnXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgbmFtZTogJ1NoYXBlRWRpdG9yJyxcbiAgICAgIGVudHJ5OiBbcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvU2hhcGVFZGl0b3IudHN4JyldLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsuLi5PYmplY3Qua2V5cyhQYWNrYWdlLmRlcGVuZGVuY2llcyksIC4uLk9iamVjdC5rZXlzKE93blBhY2thZ2UuZGVwZW5kZW5jaWVzKV0sXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJAY2VudGVyZ3JhcGgvc2hhcGUtZWRpdG9yXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInZlcnNpb25cIjogXCIwLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBTSEFDTCBzaGFwZSBlZGl0b3JcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlIC0tcG9ydD04MDAzXCIsXG4gICAgXCJidWlsZFwiOiBcInRzYyAmJiB2aXRlIGJ1aWxkXCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0XCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC4gLS1leHQgdHMsdHN4IC0tcmVwb3J0LXVudXNlZC1kaXNhYmxlLWRpcmVjdGl2ZXMgLS1tYXgtd2FybmluZ3MgMFwiLFxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjIuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjQzXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMTdcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjYuMTQuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl42LjE0LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjUuMFwiLFxuICAgIFwiZXNsaW50XCI6IFwiXjguNTUuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1ob29rc1wiOiBcIl40LjYuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1yZWZyZXNoXCI6IFwiXjAuNC41XCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMi4yXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMC44XCJcbiAgfVxufVxuIiwgIntcbiAgXCJuYW1lXCI6IFwiY2VudGVyZ3JhcGhcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlRoZSBtb25vcmVwbyBmb3IgQ2VudGVyR3JhcGhcIixcbiAgXCJhdXRob3JcIjogXCJEYW5pZWwgQmVla2VcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwid29ya3NwYWNlc1wiOiBbXG4gICAgXCJwYWNrYWdlcy8qXCJcbiAgXSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGljb25pZnkvcmVhY3RcIjogXCJeNC4xLjFcIixcbiAgICBcIkBqZXN3ci9wcmV0dHktdHVydGxlXCI6IFwiXjEuNC4wXCIsXG4gICAgXCJAcHJlYWN0L3NpZ25hbHMtcmVhY3RcIjogXCJeMi4wLjBcIixcbiAgICBcImQybC1mZXRjaFwiOiBcIl4yLjUuMFwiLFxuICAgIFwiZDJsLWZldGNoLWRlZHVwZVwiOiBcIl4yLjAuMFwiLFxuICAgIFwiZDJsLWZldGNoLXNpbXBsZS1jYWNoZVwiOiBcIl4yLjAuMFwiLFxuICAgIFwiZ3JhcG9pXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJqc29ubGQtY29udGV4dC1wYXJzZXJcIjogXCJeMi40LjBcIixcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJuM1wiOiBcIl4xLjE3LjJcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtYmVhdXRpZnVsLWRuZFwiOiBcIl4xMy4xLjFcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LXJvdXRlci1kb21cIjogXCJeNi4yMS4yXCIsXG4gICAgXCJzaGFjbC1lbmdpbmVcIjogXCJeMC4xLjFcIixcbiAgICBcInR5cGVzY3JpcHQtbHJ1LWNhY2hlXCI6IFwiXjIuMC4wXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFzdHJvanMvY2hlY2tcIjogXCJeMC40LjFcIixcbiAgICBcIkBhc3Ryb2pzL21keFwiOiBcIl4yLjAuM1wiLFxuICAgIFwiQHByZWFjdC9wcmVzZXQtdml0ZVwiOiBcIl4yLjcuMFwiLFxuICAgIFwiQHJkZmpzL2RhdGEtbW9kZWxcIjogXCJeMi4wLjFcIixcbiAgICBcIkByZGZqcy9kYXRhc2V0XCI6IFwiXjIuMC4xXCIsXG4gICAgXCJAcmRmanMvbmFtZXNwYWNlXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJAcmRmanMvdHlwZXNcIjogXCJeMS4xLjBcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTQuMS4yXCIsXG4gICAgXCJAdHVyYm8vY29kZW1vZFwiOiBcIl4xLjExLjNcIixcbiAgICBcIkB0eXBlcy9leHByZXNzXCI6IFwiXjQuMTcuMjFcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2gtZXNcIjogXCJeNC4xNy4xMlwiLFxuICAgIFwiQHR5cGVzL24zXCI6IFwiXjEuMTYuNFwiLFxuICAgIFwiQHR5cGVzL3JkZmpzX19kYXRhLW1vZGVsXCI6IFwiXjIuMC43XCIsXG4gICAgXCJAdHlwZXMvcmRmanNfX2RhdGFzZXRcIjogXCJeMi4wLjdcIixcbiAgICBcIkB0eXBlcy9yZGZqc19fbmFtZXNwYWNlXCI6IFwiXjIuMC4xMFwiLFxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjIuNDNcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1iZWF1dGlmdWwtZG5kXCI6IFwiXjEzLjEuOFwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LWRvbVwiOiBcIl4xOC4yLjE3XCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl42LjE0LjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNi4xNC4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjogXCJeMy41LjBcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtaXN0YW5idWxcIjogXCJeMS4xLjBcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMS4xLjBcIixcbiAgICBcImFzdHJvXCI6IFwiXjQuMC45XCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41NS4wXCIsXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMC4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LWhvb2tzXCI6IFwiXjQuNi4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LXJlZnJlc2hcIjogXCJeMC40LjVcIixcbiAgICBcImVzbGludC1wbHVnaW4tc2ltcGxlLWltcG9ydC1zb3J0XCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi11bnVzZWQtaW1wb3J0c1wiOiBcIl4zLjAuMFwiLFxuICAgIFwiaGFwcHktZG9tXCI6IFwiXjEyLjEwLjNcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4zLjNcIixcbiAgICBcInZpdGVcIjogXCJeNS4wLjhcIixcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4zLjcuMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tcHdhXCI6IFwiXjAuMTcuNFwiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjIuM1wiLFxuICAgIFwidml0ZXN0XCI6IFwiXjEuMS4wXCIsXG4gICAgXCJ3YWl0LW9uXCI6IFwiXjcuMi4wXCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCJeMjAuMC4wXCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInN0YXJ0XCI6IFwiY2QgcGFja2FnZXMvY2xpICYmIGRlbm8gcnVuIC1BIHNyYy9pbmRleC50c3hcIixcbiAgICBcImRldlwiOiBcInR1cmJvIHJ1biBkZXZcIixcbiAgICBcImJ1aWxkXCI6IFwidHVyYm8gcnVuIGJ1aWxkXCJcbiAgfSxcbiAgXCJwYWNrYWdlTWFuYWdlclwiOiBcIl5ucG1AMTAuMS4wXCJcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUzs7O0FDSmhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsSUFDVCxNQUFRO0FBQUEsSUFDUixNQUFRO0FBQUEsSUFDUixTQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsY0FBZ0I7QUFBQSxJQUNkLE9BQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxpQkFBbUI7QUFBQSxJQUNqQixnQkFBZ0I7QUFBQSxJQUNoQixvQkFBb0I7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
