import type { ReactElement } from "react";
import Index from "./pages/Index.tsx";
import { loadLanding } from "./landing/pages.ts";
import type { Route } from "./routes.ts";
import type { BlogPost as BlogPostData } from "./blog/types.ts";

/**
 * Página de cada ruta. El inicio va en el JavaScript principal; las páginas de servicios, el blog y el 404 se
 * descargan solo al visitarlos (prerender.mjs los precarga con <link rel="modulepreload"> en el HTML de cada ruta).
 * Devuelve null si la ruta no existe: entonces se muestra loadNotFound().
 */
export const loadPage = async (route: Route, post: BlogPostData | null): Promise<ReactElement | null> => {
  switch (route.type) {
    case "home":
      return <Index />;
    case "landing": {
      const [page, { default: LandingPage }] = await Promise.all([loadLanding(route.path), import("./pages/LandingPage.tsx")]);
      return page && <LandingPage page={page} />;
    }
    case "blog-index": {
      const { default: BlogIndex } = await import("./pages/BlogIndex.tsx");
      return <BlogIndex />;
    }
    case "blog-post": {
      if (!post) return null;
      const { default: BlogPost } = await import("./pages/BlogPost.tsx");
      return <BlogPost post={post} />;
    }
    default:
      return null;
  }
};

export const loadNotFound = async () => {
  const { default: NotFound } = await import("./pages/NotFound.tsx");
  return <NotFound />;
};
