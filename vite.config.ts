import { defineConfig } from "vite";
// Plugin oficial basado en Oxc (incluido en Vite 8): no depende del binario nativo de SWC.
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": `${import.meta.dirname}/src` },
  },
});
