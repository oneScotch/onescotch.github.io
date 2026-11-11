import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/demystifying_video_reasoning/",
  plugins: [react(), tailwindcss()],
  css: {
    // Tailwind 4 runs through its Vite plugin; do not inherit the main site's Tailwind 3 PostCSS config.
    postcss: { plugins: [] },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
