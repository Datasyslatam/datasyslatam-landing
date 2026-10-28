import { defineConfig } from "vite";
// Plugin oficial basado en Oxc (incluido en Vite 8): no depende del binario nativo de SWC.
import react from "@vitejs/plugin-react";
import { blogPlugin } from "./vite-plugin-blog.ts";

export default defineConfig({
  plugins: [react(), blogPlugin()],
  resolve: {
    alias: { "@": `${import.meta.dirname}/src` },
  },
  // En desarrollo, el asistente (/api/chat) lo atiende el servidor de producción: npm run dev:api (puerto 3000).
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
});
