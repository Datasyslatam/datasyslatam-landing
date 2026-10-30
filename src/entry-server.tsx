import { renderToString } from "react-dom/server";
import { loadPost, posts } from "virtual:blog-posts";
import App from "./App.tsx";
import { resolveRoute } from "./routes.ts";
import { buildHead } from "./blog/seo.ts";
import { LANDING_PAGES } from "./landing/pages.ts";

export { loadPost, posts };
export const landingPaths = LANDING_PAGES.map((p) => p.path);
/** Resumen de cada página de servicio o producto para llms.txt (índice para asistentes de IA). */
export const landingSummaries = LANDING_PAGES.map((p) => {
  const product = p.schema.type !== "Service";
  return { path: p.path, title: product ? `${p.schema.name}: ${p.h1[0].toLowerCase()}${p.h1.slice(1)}` : p.h1, description: p.metaDescription, product };
});

/**
 * Renderiza una ruta a HTML para que buscadores y asistentes de IA la lean sin ejecutar JavaScript.
 * `head` trae las etiquetas propias de la página (título, descripción, canonical, Open Graph) o null en el inicio.
 */
export const render = async (pathname: string) => {
  const route = resolveRoute(pathname);
  const post = route.type === "blog-post" ? await loadPost(route.slug) : null;
  return {
    html: renderToString(<App route={route} post={post} />),
    head: buildHead(route, post),
  };
};
