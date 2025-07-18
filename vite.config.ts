import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/x5/",
  build: {
    outDir: "docs",
    assetsDir: "assets",
  },
});
