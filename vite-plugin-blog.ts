// Convierte los artículos de content/blog/*.md (frontmatter YAML + Markdown) en módulos
// virtuales durante el build. El listado solo lleva metadatos; cada artículo es un chunk
// aparte que se carga bajo demanda, así el JavaScript del sitio no crece con el blog.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { Marked } from "marked";
import { parse as parseYaml } from "yaml";
import type { Plugin } from "vite";
import type { BlogArea, BlogPost } from "./src/blog/types.ts";

const INDEX_ID = "virtual:blog-posts";
const POST_PREFIX = "virtual:blog-post/";
const RESOLVED_PREFIX = "\0";
const WORDS_PER_MINUTE = 200;
const SITE_HOST = "datasyslatam.com";

const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const markdown = new Marked({ gfm: true });
markdown.use({
  renderer: {
    // Enlaces externos en pestaña nueva; los internos (/#autodiagnostico, /blog/...) normales.
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href) && !href.includes(SITE_HOST);
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      const externalAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeAttr(href)}"${titleAttr}${externalAttrs}>${text}</a>`;
    },
    // La página ya tiene el H1 (título del artículo): cualquier # del cuerpo baja a H2.
    heading({ tokens, depth }) {
      const level = Math.max(depth, 2);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
  },
});

// El contenido pasa por revisión humana, pero se bloquea cualquier HTML ejecutable por si acaso.
const FORBIDDEN = /<script|<iframe|<object|<embed|javascript:|\son[a-z]+\s*=/i;

const required = (data: Record<string, unknown>, key: string, file: string) => {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`[blog] ${file}: falta el campo "${key}" en el frontmatter`);
  }
  return value.trim();
};

const AREAS: BlogArea[] = ["gestion", "tecnologia", "analitica"];

/** Área del artículo: la del frontmatter o, si no la tiene, la de su tema en el calendario del asistente. */
const areaOf = (data: Record<string, unknown>, topicAreas: Map<string, BlogArea>): BlogArea => {
  if (AREAS.includes(data.area as BlogArea)) return data.area as BlogArea;
  return topicAreas.get(String(data.topic ?? "")) ?? "gestion";
};

const readTopicAreas = (file: string) => {
  const areas = new Map<string, BlogArea>();
  if (!existsSync(file)) return areas;
  for (const t of JSON.parse(readFileSync(file, "utf8")) as { id: string; area?: BlogArea }[]) {
    if (t.area && AREAS.includes(t.area)) areas.set(t.id, t.area);
  }
  return areas;
};

const toDate = (value: unknown) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? ""));

export const loadPosts = (dir: string, topicsFile = resolve("scripts/blog-agent/topics.json")): BlogPost[] => {
  if (!existsSync(dir)) return [];
  const topicAreas = readTopicAreas(topicsFile);
  const posts = readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .map((file): BlogPost => {
      const raw = readFileSync(join(dir, file), "utf8").replace(/\r\n/g, "\n");
      const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
      if (!match) throw new Error(`[blog] ${file}: falta el bloque de frontmatter (--- ... ---)`);
      const data = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
      const body = match[2];
      if (FORBIDDEN.test(body)) throw new Error(`[blog] ${file}: el artículo contiene HTML no permitido`);

      const slug = required(data, "slug", file);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`[blog] ${file}: slug inválido "${slug}"`);
      const date = toDate(data.date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`[blog] ${file}: fecha inválida "${date}"`);

      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        slug,
        title: required(data, "title", file),
        description: required(data, "description", file),
        date,
        updated: data.updated ? toDate(data.updated) : undefined,
        author: typeof data.author === "string" ? data.author : "DataSys Latam Group",
        area: areaOf(data, topicAreas),
        keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
        image: required(data, "image", file),
        imageAlt: required(data, "imageAlt", file),
        readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        html: markdown.parse(body, { async: false }) as string,
        faq: Array.isArray(data.faq) ? (data.faq as BlogPost["faq"]).filter((f) => f?.q && f?.a) : [],
        sources: Array.isArray(data.sources) ? (data.sources as BlogPost["sources"]).filter((s) => s?.url && s?.title) : [],
      };
    });

  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`[blog] slug repetido: ${post.slug}`);
    slugs.add(post.slug);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
};

export const blogPlugin = (): Plugin => {
  // BLOG_CONTENT_DIR permite probar el build con artículos de prueba sin tocar content/blog.
  const dir = resolve(process.env.BLOG_CONTENT_DIR ?? "content/blog");
  let posts: BlogPost[] = [];

  return {
    name: "datasys-blog",
    buildStart() {
      posts = loadPosts(dir);
      if (existsSync(dir)) {
        for (const file of readdirSync(dir)) this.addWatchFile(join(dir, file));
      }
    },
    resolveId(id) {
      if (id === INDEX_ID || id.startsWith(POST_PREFIX)) return RESOLVED_PREFIX + id;
      return null;
    },
    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return null;
      const virtualId = id.slice(RESOLVED_PREFIX.length);

      if (virtualId === INDEX_ID) {
        const meta = posts.map(({ html: _html, faq: _faq, sources: _sources, ...rest }) => rest);
        const loaders = posts
          .map((p) => `  ${JSON.stringify(p.slug)}: () => import(${JSON.stringify(POST_PREFIX + p.slug)}),`)
          .join("\n");
        return [
          `export const posts = ${JSON.stringify(meta)};`,
          `export const buildDate = ${JSON.stringify(new Date().toISOString().slice(0, 10))};`,
          `const loaders = {\n${loaders}\n};`,
          `export const loadPost = (slug) => (loaders[slug] ? loaders[slug]().then((m) => m.default) : Promise.resolve(null));`,
        ].join("\n");
      }

      if (virtualId.startsWith(POST_PREFIX)) {
        const post = posts.find((p) => p.slug === virtualId.slice(POST_PREFIX.length));
        if (!post) return null;
        return `export default ${JSON.stringify(post)};`;
      }
      return null;
    },
  };
};
