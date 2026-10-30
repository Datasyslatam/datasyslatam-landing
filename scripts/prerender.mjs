// Después del build: genera el HTML de cada página (inicio, /blog y cada artículo),
// el sitemap, el feed RSS y llms.txt. Así Google y los rastreadores de IA (que no ejecutan
// JavaScript) leen todo el contenido.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_URL = "https://datasyslatam.com";
const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist`;
const ssrDir = `${root}dist-ssr`;

const { render, posts, loadPost, landingPaths, landingSummaries } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);

const template = await readFile(`${dist}/index.html`, "utf8");
const placeholder = '<div id="root"></div>';
const headBlock = /<!-- page-meta:start[\s\S]*?<!-- page-meta:end -->/;
if (!template.includes(placeholder)) throw new Error(`No se encontró ${placeholder} en dist/index.html`);
if (!headBlock.test(template)) throw new Error("No se encontró el bloque <!-- page-meta --> en dist/index.html");

const routes = ["/", ...landingPaths, "/blog", ...posts.map((p) => `/blog/${p.slug}`)];

// El catálogo de servicios de los datos estructurados de index.html debe enlazar cada página de servicio.
const missing = landingSummaries.filter((p) => !p.product && !template.includes(`"url": "${SITE_URL}${p.path}"`));
if (missing.length) throw new Error(`Agregue al hasOfferCatalog de index.html: ${missing.map((p) => p.path).join(", ")}`);

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
  ...landingPaths.map((path) => ({ loc: `${SITE_URL}${path}`, lastmod: today, priority: "0.9" })),
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

// Base de conocimiento del asistente del sitio (server/chat.mjs): el texto publicado de la página de inicio y un
// resumen de cada artículo. Se genera en cada build, así el asistente nunca responde con información vieja.
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };
const htmlToText = (html) =>
  html
    .replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<h[1-3][^>]*>/gi, "\n\n## ")
    .replace(/<h[4-6][^>]*>/gi, "\n\n### ")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|section|article|header|footer|ul|ol|h[1-6]|dd|dt|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e) =>
      e[0] === "#" ? String.fromCodePoint(e[1] === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (ENTITIES[e] ?? m),
    )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const home = await render("/");
// Las páginas de servicios y producto también alimentan al asistente: sin el menú ni el pie, que ya trae el inicio.
const landingTexts = await Promise.all(
  landingPaths.map(async (path) => {
    const { html } = await render(path);
    const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1] ?? html;
    return `### Página ${path}\n${htmlToText(main.replace(/<section id="contacto"[\s\S]*?<\/section>/, ""))}`;
  }),
);
const articles = await Promise.all(
  posts.map(async (meta) => {
    const post = await loadPost(meta.slug);
    const summary = /<h2[^>]*>\s*En resumen\s*<\/h2>([\s\S]*?)(<h2|$)/i.exec(post?.html ?? "")?.[1] ?? "";
    return [
      `### ${meta.title}`,
      `URL: /blog/${meta.slug} · Autor: ${meta.author} · Publicado: ${meta.date}`,
      meta.description,
      summary ? `Puntos clave:\n${htmlToText(summary)}` : "",
      post?.faq?.length ? `Preguntas frecuentes:\n${post.faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }),
);
const knowledge = [
  `# Sitio web de DataSys Latam Group (${SITE_URL}) — generado el ${today}`,
  "",
  "## Contenido de la página de inicio",
  htmlToText(home.html),
  "",
  "## Páginas de servicios y producto",
  landingTexts.join("\n\n"),
  "",
  "## Artículos del blog",
  articles.join("\n\n") || "Aún no hay artículos.",
].join("\n");
await mkdir(`${root}dist-server`, { recursive: true });
await writeFile(`${root}dist-server/knowledge.md`, `${knowledge}\n`);

// llms.txt (https://llmstxt.org): índice del sitio para asistentes de IA, con un enlace y una línea por página.
// llms-full.txt es el mismo texto publicado que usa el asistente del sitio, para leerlo de una sola vez.
const llmsLink = (path, title, description) => `- [${title}](${SITE_URL}${path}): ${description}`;
const llms = [
  "# DataSys Latam Group",
  "",
  "> Empresa de Barranquilla (Colombia) que ayuda a micro, pequeñas y medianas empresas de Colombia y Latinoamérica a ordenar sus procesos con criterio ISO, automatizarlos con software e inteligencia artificial y decidir con datos. Primero ordenamos, después automatizamos.",
  "",
  `Contacto: contacto@datasyslatam.com · WhatsApp +57 324 624 9237 · Barranquilla, Colombia. Autodiagnóstico gratuito de 10 minutos: ${SITE_URL}/#autodiagnostico`,
  "",
  "## Servicios",
  ...landingSummaries.filter((p) => !p.product).map((p) => llmsLink(p.path, p.title, p.description)),
  "",
  "## Producto",
  ...landingSummaries.filter((p) => p.product).map((p) => llmsLink(p.path, p.title, p.description)),
  "",
  "## Blog",
  ...posts.map((p) => llmsLink(`/blog/${p.slug}`, p.title, p.description)),
  "",
  "## Optional",
  llmsLink("/llms-full.txt", "Contenido completo del sitio", "texto de todas las páginas de servicios y resúmenes de los artículos en un solo archivo."),
].join("\n");
await writeFile(`${dist}/llms.txt`, `${llms}\n`);
await writeFile(`${dist}/llms-full.txt`, `${knowledge}\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerender listo: ${routes.length} páginas (${posts.length} artículos), sitemap.xml, blog/rss.xml y llms.txt`);
