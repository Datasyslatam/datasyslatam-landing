// Después del build: genera el HTML de cada página (inicio, /blog y cada artículo),
// el sitemap y el feed RSS. Así Google y los rastreadores de IA (que no ejecutan
// JavaScript) leen todo el contenido.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_URL = "https://datasyslatam.com";
const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist`;
const ssrDir = `${root}dist-ssr`;

const { render, posts } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);

const template = await readFile(`${dist}/index.html`, "utf8");
const placeholder = '<div id="root"></div>';
const headBlock = /<!-- page-meta:start[\s\S]*?<!-- page-meta:end -->/;
if (!template.includes(placeholder)) throw new Error(`No se encontró ${placeholder} en dist/index.html`);
if (!headBlock.test(template)) throw new Error("No se encontró el bloque <!-- page-meta --> en dist/index.html");

const routes = ["/", "/blog", ...posts.map((p) => `/blog/${p.slug}`)];

for (const route of routes) {
  const { html, head } = await render(route);
  let page = template.replace(placeholder, `<div id="root">${html}</div>`);
  if (head) page = page.replace(headBlock, head);
  const file = route === "/" ? `${dist}/index.html` : `${dist}${route}/index.html`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page);
}

// 404.html: serve lo entrega con estado 404 real para cualquier ruta que no exista.
const notFound = await render("/pagina-no-encontrada");
await writeFile(
  `${dist}/404.html`,
  template
    .replace(placeholder, `<div id="root">${notFound.html}</div>`)
    .replace(headBlock, "<title>Página no encontrada | DataSys Latam Group</title>")
    .replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />'),
);

const escXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const today = new Date().toISOString().slice(0, 10);
const latest = posts[0]?.date ?? today;

const sitemapUrls = [
  { loc: `${SITE_URL}/`, lastmod: today, priority: "1.0" },
  { loc: `${SITE_URL}/blog`, lastmod: latest, priority: "0.8" },
  ...posts.map((p) => ({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: p.updated ?? p.date, priority: "0.7" })),
];
await writeFile(
  `${dist}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join("\n")}\n</urlset>\n`,
);

await writeFile(
  `${dist}/blog/rss.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n  <title>Blog de DataSys Latam Group</title>\n  <link>${SITE_URL}/blog</link>\n  <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />\n  <description>Guías sobre sistemas de gestión ISO, transformación digital, software e inteligencia artificial para empresas.</description>\n  <language>es-co</language>\n${posts
    .slice(0, 30)
    .map(
      (p) =>
        `  <item>\n    <title>${escXml(p.title)}</title>\n    <link>${SITE_URL}/blog/${p.slug}</link>\n    <guid>${SITE_URL}/blog/${p.slug}</guid>\n    <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>\n    <description>${escXml(p.description)}</description>\n  </item>`,
    )
    .join("\n")}\n</channel>\n</rss>\n`,
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerender listo: ${routes.length} páginas (${posts.length} artículos), sitemap.xml y blog/rss.xml`);
