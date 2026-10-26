export type Route =
  | { type: "home" }
  | { type: "blog-index" }
  | { type: "blog-post"; slug: string }
  | { type: "not-found" };

/** Rutas del sitio: inicio, blog y artículos; todo lo demás es 404. */
export const resolveRoute = (pathname: string): Route => {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html") return { type: "home" };
  if (path === "/blog") return { type: "blog-index" };
  const match = /^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
  if (match) return { type: "blog-post", slug: match[1] };
  return { type: "not-found" };
};
