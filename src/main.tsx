import { createRoot, hydrateRoot } from "react-dom/client";
import App, { isHomePath } from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// index.html trae la página de inicio ya renderizada (ver scripts/prerender.mjs):
// en "/" se hidrata ese HTML; en otras rutas (404) se descarta y se renderiza desde cero.
if (container.hasChildNodes() && isHomePath(window.location.pathname)) {
  hydrateRoot(container, <App />);
} else {
  container.replaceChildren();
  createRoot(container).render(<App />);
}
