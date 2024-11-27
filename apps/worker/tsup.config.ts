import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["./src/worker.ts"],
  clean: true,
  format: ["cjs"],
  external: ["@prisma/client"],
  ...options,
}));