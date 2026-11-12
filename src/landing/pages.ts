// Páginas comerciales (landing pages) orientadas a palabras clave de compra. Cada una genera su HTML prerenderizado,
// sus metadatos, sus datos estructurados (Service o SoftwareApplication, migas de pan y FAQPage) y entra al sitemap.
// Todo el contenido sale de información ya publicada en el sitio: no se inventan cifras, clientes ni testimonios.
//
// Cada página vive en paginas/<último segmento de la ruta>.ts y se descarga solo al visitarla: así su contenido no
// pesa en el JavaScript del inicio ni de las demás páginas.
import type { LandingPage } from "./types";

export type * from "./types";

/** Rutas de las páginas comerciales. El build (entry-server.tsx) comprueba que coincidan con los archivos de paginas/. */
export const LANDING_PATHS = [
  "/servicios/consultoria-iso-9001",
  "/servicios/desarrollo-software-medida",
  "/servicios/inteligencia-artificial-empresas",
  "/servicios/analitica-de-datos",
  "/servicios/digitalizacion-de-procesos",
  "/servicios/transformacion-digital",
  "/servicios/gobernanza-ti",
  "/producto/novix-erp",
  "/producto/governex",
];

export const isLandingPath = (path: string) => LANDING_PATHS.includes(path);

const LOADERS = import.meta.glob<LandingPage>("./paginas/*.ts", { import: "default" });

/** Descarga los datos de una página comercial; null si la ruta no es una de ellas. */
export const loadLanding = async (path: string): Promise<LandingPage | null> => {
  const load = isLandingPath(path) ? LOADERS[`./paginas/${path.slice(path.lastIndexOf("/") + 1)}.ts`] : undefined;
  return load ? load() : null;
};
