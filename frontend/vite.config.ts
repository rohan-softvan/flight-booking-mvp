import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // npm workspaces symlink @flight-booking/shared outside node_modules;
    // without this, Rollup's CJS interop can't see its named exports.
    preserveSymlinks: true,
  },
  server: {
    host: true,
    port: 5173,
  },
});
