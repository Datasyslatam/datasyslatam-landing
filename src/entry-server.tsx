import { renderToString } from "react-dom/server";
import { loadPost, posts } from "virtual:blog-posts";
import App from "./App.tsx";
import { resolveRoute } from "./routes.ts";
import { buildHead } from "./blog/seo.ts";

export { posts };

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
