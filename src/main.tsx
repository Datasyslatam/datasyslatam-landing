import { createRoot, hydrateRoot } from "react-dom/client";
import { loadPost } from "virtual:blog-posts";
import App from "./App.tsx";
import { loadNotFound, loadPage } from "./loadPage.tsx";
import { resolveRoute } from "./routes.ts";
import { withChunkReload } from "./lib/chunkReload.ts";
import "./index.css";

const boot = async () => {
  const container = document.getElementById("root")!;
  const route = resolveRoute(window.location.pathname);
  const post = route.type === "blog-post" ? await loadPost(route.slug) : null;
  // Si el JavaScript de la página ya no existe (HTML guardado de una versión anterior), se recarga una vez.
  const page = await withChunkReload(() => loadPage(route, post))();

  // Cada página publicada trae su HTML ya renderizado (ver scripts/prerender.mjs): se hidrata.
  // Las rutas inexistentes reciben el HTML del inicio, así que se descarta y se renderiza el 404.
  if (page && container.hasChildNodes()) {
    hydrateRoot(container, <App>{page}</App>);
  } else {
    const app = <App>{page ?? (await loadNotFound())}</App>;
    container.replaceChildren();
    createRoot(container).render(app);
  }
};

void boot();
