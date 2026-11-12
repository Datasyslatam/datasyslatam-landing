import { renderToString } from "react-dom/server";
import { loadPost, posts } from "virtual:blog-posts";
import App from "./App.tsx";
import { loadNotFound, loadPage } from "./loadPage.tsx";
import { resolveRoute } from "./routes.ts";
import { buildHead } from "./blog/seo.ts";
import { LANDING_PATHS, type LandingPage } from "./landing/pages.ts";

// Todas las páginas comerciales, en el orden de LANDING_PATHS. Falla el build si alguna no coincide con su archivo.
const files = import.meta.glob<LandingPage>("./landing/paginas/*.ts", { eager: true, import: "default" });
const LANDING_PAGES = LANDING_PATHS.map((path) => {
  const page = files[`./landing/paginas/${path.slice(path.lastIndexOf("/") + 1)}.ts`];
  if (page?.path !== path) throw new Error(`La ruta ${path} de LANDING_PATHS no coincide con su archivo en src/landing/paginas/`);
  return page;
});
if (Object.keys(files).length !== LANDING_PATHS.length) {
  throw new Error("Hay archivos en src/landing/paginas/ que no están en LANDING_PATHS (src/landing/pages.ts)");
}

export { loadPost, posts };
export const landingPaths = LANDING_PATHS;
/** Resumen de cada página de servicio o producto para llms.txt (índice para asistentes de IA). */
export const landingSummaries = LANDING_PAGES.map((p) => {
  const product = p.schema.type !== "Service";
  return { path: p.path, title: product ? `${p.schema.name}: ${p.h1[0].toLowerCase()}${p.h1.slice(1)}` : p.h1, description: p.metaDescription, product };
});

/** Archivos fuente que cada ruta descarga aparte del JavaScript principal (prerender.mjs los precarga). */
export const routeModules = (pathname: string): string[] => {
  const route = resolveRoute(pathname);
  if (route.type === "landing") return ["src/pages/LandingPage.tsx", `src/landing/paginas/${route.path.slice(route.path.lastIndexOf("/") + 1)}.ts`];
  if (route.type === "blog-index") return ["src/pages/BlogIndex.tsx"];
  if (route.type === "blog-post") return ["src/pages/BlogPost.tsx"];
  if (route.type === "not-found") return ["src/pages/NotFound.tsx"];
  return [];
};

/**
 * Renderiza una ruta a HTML para que buscadores y asistentes de IA la lean sin ejecutar JavaScript.
 * `head` trae las etiquetas propias de la página (título, descripción, canonical, Open Graph) o null en el inicio.
 */
export const render = async (pathname: string) => {
  const route = resolveRoute(pathname);
  const post = route.type === "blog-post" ? await loadPost(route.slug) : null;
  const landing = route.type === "landing" ? (LANDING_PAGES.find((p) => p.path === route.path) ?? null) : null;
  const page = (await loadPage(route, post)) ?? (await loadNotFound());
  return {
    html: renderToString(<App>{page}</App>),
    head: buildHead(route, post, landing),
  };
};
