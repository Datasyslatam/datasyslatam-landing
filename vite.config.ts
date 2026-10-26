import { defineConfig } from "vite";
// Plugin oficial basado en Oxc (incluido en Vite 8): no depende del binario nativo de SWC.
import react from "@vitejs/plugin-react";
import { blogPlugin } from "./vite-plugin-blog.ts";

export default defineConfig({
  plugins: [react(), blogPlugin()],
  resolve: {
    alias: { "@": `${import.meta.dirname}/src` },
  },
});
