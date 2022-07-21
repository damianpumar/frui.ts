import path from "path";
import { defineConfig } from "vite";
import packageFile from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fruits-datascreens",
      fileName: format => `fruits-datascreens.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageFile.dependencies), ...Object.keys(packageFile.peerDependencies)],
      output: {
        sourcemap: true,
      },
    },
  },
});