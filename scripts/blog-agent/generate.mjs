// Asistente de blog de DataSys Latam Group.
// 1) Elige el siguiente tema del calendario (topics.json) que aún no tenga artículo.
// 2) Investiga con Claude + búsqueda web y redacta el artículo con salida estructurada.
// 3) Verifica los enlaces: solo quedan fuentes encontradas en la investigación que responden.
// 4) Genera la portada con Gemini (API de Google) y escribe content/blog/<slug>.md.
// El flujo .github/workflows/blog-agent.yml abre un PR con el resultado para revisión humana.
import { appendFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { parse as parseYaml, stringify as toYaml } from "yaml";

const MODEL = "claude-opus-5-5";
const FALLBACK_BETA = "server-side-fallback-2026-07-01";
const IMAGE_MODEL = process.env.BLOG_IMAGE_MODEL || "gemini-nano-banana-2.1";
const AUTHOR = "Armando José López González";
const MAX_CONTINUATIONS = 5;
const MIN_SOURCES = 2;

const root = fileURLToPath(new URL("../../", import.meta.url));
const CONTENT_DIR = `${root}content/blog`;
const IMAGE_DIR = `${root}public/blog`;
const OUT_DIR = `${root}.blog-agent`;

const COMPANY_CONTEXT = `
DataSys Latam Group S.A.S. (Barranquilla, Colombia) ayuda a micro, pequeñas y medianas empresas a:
1) ordenar sus procesos con criterio ISO (consultoría en ISO 9001, 14001, 45001, 27001, 22301 y 21001, formación y talleres),
2) automatizarlos con software, ERP y web a la medida, integración de sistemas e inteligencia artificial,
3) decidir con datos (analítica, tableros de indicadores).
Producto propio: Governex, plataforma que simplifica el sistema de gestión ISO con IA.
Fundador: Armando José López González, ingeniero industrial, magíster en Gerencia de Empresas, especialista en Gerencia
del Talento Humano, 26 años de experiencia en ingeniería y sistemas de gestión, profesional en educación de ICONTEC desde 2016
y conferencista del posgrado en Gerencia de la Calidad de la Universidad del Norte.
Enlaces internos permitidos: /#autodiagnostico (autodiagnóstico gratuito de 10 minutos), /#consultoria, /#servicios, /#contacto, /blog.
`.trim();

// ---------------------------------------------------------------------------
// Utilidades de archivos
// ---------------------------------------------------------------------------

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

export const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");

const readExistingPosts = async () => {
  if (!existsSync(CONTENT_DIR)) return [];
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  return Promise.all(
    files.map(async (file) => {
      const raw = (await readFile(`${CONTENT_DIR}/${file}`, "utf8")).replace(/\r\n/g, "\n");
      const match = /^---\n([\s\S]*?)\n---/.exec(raw);
      return match ? parseYaml(match[1]) ?? {} : {};
    }),
  );
};

const pickTopic = async (existing) => {
  const custom = process.env.BLOG_TOPIC?.trim();
  if (custom) return { id: slugify(custom), tema: custom, palabraClave: custom, enlace: "/#autodiagnostico" };
  const topics = JSON.parse(await readFile(new URL("./topics.json", import.meta.url), "utf8"));
  const used = new Set(existing.map((p) => p.topic).filter(Boolean));
  const next = topics.find((t) => !used.has(t.id));
  if (!next) {
    throw new Error("Ya hay artículo para todos los temas de scripts/blog-agent/topics.json. Agregue temas nuevos al calendario.");
  }
  return next;
};

// ---------------------------------------------------------------------------
// Enlaces
// ---------------------------------------------------------------------------

export const normalizeUrl = (url) => {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
};

const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/** "ok" si responde; "bloqueado" si existe pero rechaza robots (401/403/405/429); "error ..." si no. */
export const checkUrl = async (url) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; DataSysBlogAgent/1.0; +https://datasyslatam.com)", accept: "text/html,*/*" },
    });
    await res.body?.cancel();
    if (res.ok) return "ok";
    if ([401, 403, 405, 429].includes(res.status)) return "bloqueado";
    return `error ${res.status}`;
  } catch (err) {
    return `error ${err?.name ?? "de red"}`;
  }
};

/**
 * Deja solo enlaces que salieron de la investigación (no inventados) y que existen.
 * Los enlaces descartados del cuerpo se convierten en texto plano.
 */
export const verifyLinks = async (article, researchedUrls) => {
  const urls = new Set([...article.body_markdown.matchAll(MARKDOWN_LINK)].map((m) => m[2]));
  for (const s of article.sources) urls.add(s.url);

  const status = new Map();
  await Promise.all(
    [...urls].map(async (url) => {
      if (!researchedUrls.has(normalizeUrl(url))) status.set(url, "no salió de la investigación");
      else status.set(url, await checkUrl(url));
    }),
  );
  const keep = (url) => ["ok", "bloqueado"].includes(status.get(url));

  const body = article.body_markdown.replace(MARKDOWN_LINK, (full, text, url) => (keep(url) ? full : text));
  const sources = article.sources.filter((s) => keep(s.url));
  const report = [...status].map(([url, result]) => ({ url, result, kept: keep(url) }));
  return { body, sources, report };
};

// ---------------------------------------------------------------------------
// Claude: investigación y redacción
// ---------------------------------------------------------------------------

const RESEARCH_SYSTEM = `Eres un investigador para el blog de una consultora colombiana. Buscas información actual y
verificable en fuentes confiables: organismos oficiales (iso.org, icontec.org, mintrabajo.gov.co, mintic.gov.co, dane.gov.co,
dian.gov.co, supersociedades.gov.co, confecamaras.org.co), universidades, gremios y medios económicos reconocidos.
Evitas blogs comerciales de competidores y contenido sin autor.`;

const researchPrompt = (topic) => `Investiga para un artículo de blog sobre: "${topic.tema}".
Palabra clave principal: "${topic.palabraClave}". Público: dueños y gerentes de pymes en Colombia.

Entrega un informe en español con:
- 6 a 10 hechos clave, cada uno con la URL exacta de la fuente donde lo encontraste y quién la publica.
- Datos o cifras solo si aparecen en una fuente; indica el año del dato.
- Normativa colombiana aplicable, si la hay, con su fuente oficial.
- Preguntas frecuentes que se hace el público sobre el tema.
No inventes URLs ni cifras: si algo no lo encontraste en una fuente, no lo incluyas.`;

const ArticleSchema = z.object({
  title: z.string().describe("Título en español, máximo 65 caracteres, con la palabra clave al inicio si suena natural"),
  slug: z.string().describe("URL corta en minúsculas con guiones, sin tildes, 3 a 7 palabras"),
  description: z.string().describe("Meta descripción de 140 a 160 caracteres que invite a leer"),
  keywords: z.array(z.string()).describe("4 a 8 palabras clave"),
  body_markdown: z.string().describe("Cuerpo en Markdown, sin título H1, con secciones ##"),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).describe("3 o 4 preguntas frecuentes con respuestas de 2 a 4 frases"),
  sources: z
    .array(z.object({ title: z.string(), url: z.string(), publisher: z.string() }))
    .describe("Fuentes citadas en el artículo, tomadas solo de la lista de fuentes investigadas"),
  image_prompt: z.string().describe("Descripción en inglés de una fotografía editorial para la portada, sin texto ni logotipos"),
  image_alt: z.string().describe("Texto alternativo de la portada en español, una frase"),
});

const WRITER_SYSTEM = `Eres redactor del blog de DataSys Latam Group. Escribes en español de Colombia, tratando de "usted",
con un tono profesional, cercano y práctico, sin exageraciones ni frases vacías.

Contexto de la empresa (úsalo para los enlaces internos y el cierre; no inventes otros datos de la empresa, clientes,
casos de éxito, precios ni plazos):
${COMPANY_CONTEXT}

Reglas del artículo:
- 900 a 1.400 palabras. El primer párrafo responde directamente la pregunta principal (así lo citan Google y los asistentes de IA).
- Estructura con ## y ###, listas cuando ayuden y una sección final "## En resumen" con 3 a 5 viñetas.
- Toda cifra, dato o norma lleva un enlace Markdown a su fuente, usando SOLO URLs de la lista de fuentes investigadas.
  Si un dato no tiene fuente en esa lista, no lo uses.
- Incluye 2 o 3 enlaces internos naturales, entre ellos /#autodiagnostico, y el enlace indicado para el tema.
- Cierra con un párrafo que invite a hacer el autodiagnóstico gratuito, sin sonar a anuncio.
- No incluyas el título como encabezado, ni HTML, ni imágenes dentro del cuerpo.`;

const writerPrompt = (topic, brief, sources) => `Tema: "${topic.tema}"
Palabra clave principal: "${topic.palabraClave}"
Enlace interno prioritario: ${topic.enlace}

Informe de investigación:
${brief}

Fuentes investigadas (las únicas URLs externas permitidas):
${sources.map((s) => `- ${s.title} — ${s.url}`).join("\n")}

Redacta el artículo completo siguiendo las reglas.`;

const assertUsable = (response, step) => {
  if (response.stop_reason === "refusal") {
    throw new Error(`${step}: el modelo rechazó la solicitud (${response.stop_details?.category ?? "sin categoría"}).`);
  }
  if (response.stop_reason === "max_tokens") throw new Error(`${step}: la respuesta se cortó por max_tokens.`);
};

const collectSources = (content, found) => {
  for (const block of content) {
    if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      for (const r of block.content) if (r.type === "web_search_result") found.set(normalizeUrl(r.url), { url: r.url, title: r.title });
    }
    if (block.type === "web_fetch_tool_result" && block.content?.type === "web_fetch_result") {
      const url = block.content.url;
      if (url) found.set(normalizeUrl(url), { url, title: block.content.content?.title ?? url });
    }
    if (block.type === "text" && Array.isArray(block.citations)) {
      for (const c of block.citations) if (c.url) found.set(normalizeUrl(c.url), { url: c.url, title: c.title ?? c.url });
    }
  }
};

const research = async (client, topic) => {
  const messages = [{ role: "user", content: researchPrompt(topic) }];
  const found = new Map();
  const usage = [];
  let response;
  for (let i = 0; i <= MAX_CONTINUATIONS; i++) {
    response = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 32000,
        betas: [FALLBACK_BETA],
        fallbacks: "default",
        output_config: { effort: "high" },
        system: RESEARCH_SYSTEM,
        tools: [
          {
            type: "web_search_20260209",
            name: "web_search",
            max_uses: 8,
            user_location: { type: "approximate", city: "Barranquilla", region: "Atlántico", country: "CO", timezone: "America/Bogota" },
          },
          { type: "web_fetch_20260209", name: "web_fetch", max_uses: 6 },
        ],
        messages,
      })
      .finalMessage();
    usage.push(response.usage);
    collectSources(response.content, found);
    if (response.stop_reason !== "pause_turn") break;
    // La búsqueda en el servidor pausó el turno: se reenvía para que continúe.
    messages.push({ role: "assistant", content: response.content });
  }
  assertUsable(response, "Investigación");
  const brief = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!brief) throw new Error("Investigación: no se obtuvo informe.");
  return { brief, sources: [...found.values()], usage };
};

const write = async (client, topic, brief, sources) => {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "high", format: zodOutputFormat(ArticleSchema) },
    system: WRITER_SYSTEM,
    messages: [{ role: "user", content: writerPrompt(topic, brief, sources) }],
  });
  assertUsable(response, "Redacción");
  if (!response.parsed_output) throw new Error("Redacción: la respuesta no cumple el formato esperado.");
  return { article: response.parsed_output, usage: response.usage };
};

// ---------------------------------------------------------------------------
// Imagen de portada
// ---------------------------------------------------------------------------

const IMAGE_STYLE =
  "Editorial photograph for a business blog in Colombia, natural light, realistic, modern professional setting, " +
  "Latin American professionals, calm and trustworthy mood, 3:2 composition. No text, no letters, no numbers, no logos, no watermarks.";

/**
 * Busca la imagen generada en la respuesta de la Interactions API de Gemini: un bloque
 * { type: "image", data: <base64>, mime_type } en cualquier nivel (steps → content), o output_image.
 */
export const findImageBlock = (node) => {
  if (!node || typeof node !== "object") return null;
  if (node.output_image?.data) return node.output_image;
  if (node.type === "image" && typeof node.data === "string" && node.data.length > 100) return node;
  for (const value of Object.values(node)) {
    const found = findImageBlock(value);
    if (found) return found;
  }
  return null;
};

const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Genera la portada con Gemini y devuelve su ruta pública (p. ej. /blog/<slug>.jpg). */
const generateImage = async (prompt, slug) => {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        input: [{ type: "text", text: `${prompt}. ${IMAGE_STYLE}` }],
        // JPEG a 1K mantiene la portada liviana para la web.
        response_format: { type: "image", mime_type: "image/jpeg", aspect_ratio: "3:2", image_size: "1K" },
      }),
    });
    if (res.ok) {
      const json = await res.json();
      const block = findImageBlock(json);
      if (!block) throw new Error(`Imagen: la respuesta de Gemini no trae ninguna imagen (campos: ${Object.keys(json).join(", ")}).`);
      const extension = EXTENSIONS[block.mime_type ?? block.mimeType] ?? "jpg";
      await writeFile(`${IMAGE_DIR}/${slug}.${extension}`, Buffer.from(block.data, "base64"));
      return `/blog/${slug}.${extension}`;
    }
    lastError = `Imagen (Gemini ${res.status}): ${(await res.text()).slice(0, 400)}`;
    // Clave inválida, sin permisos o sin facturación: reintentar no sirve.
    if ([400, 401, 403, 404].includes(res.status)) break;
  }
  throw new Error(lastError);
};

// ---------------------------------------------------------------------------
// Principal
// ---------------------------------------------------------------------------

const requireEnv = (name) => {
  if (!process.env[name]) throw new Error(`Falta la variable de entorno ${name} (configúrela como secreto del repositorio en GitHub).`);
};

const main = async () => {
  requireEnv("ANTHROPIC_API_KEY");
  requireEnv("GEMINI_API_KEY");
  await mkdir(CONTENT_DIR, { recursive: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const existing = await readExistingPosts();
  const topic = await pickTopic(existing);
  console.log(`Tema: ${topic.tema}`);

  const client = new Anthropic();
  const { brief, sources: researched, usage: researchUsage } = await research(client, topic);
  console.log(`Investigación lista: ${researched.length} fuentes encontradas`);

  const { article, usage: writeUsage } = await write(client, topic, brief, researched);
  const researchedUrls = new Set(researched.map((s) => normalizeUrl(s.url)));
  const { body, sources, report } = await verifyLinks(article, researchedUrls);
  if (sources.length < MIN_SOURCES) {
    throw new Error(`Solo ${sources.length} fuentes verificadas (mínimo ${MIN_SOURCES}); no se publica un artículo sin respaldo.`);
  }

  const takenSlugs = new Set(existing.map((p) => p.slug));
  let slug = slugify(article.slug || article.title);
  if (takenSlugs.has(slug) || existsSync(`${CONTENT_DIR}/${slug}.md`)) slug = `${slug}-${today()}`;

  const image = await generateImage(article.image_prompt, slug);

  const frontmatter = {
    title: article.title.trim(),
    slug,
    description: article.description.trim(),
    date: today(),
    author: AUTHOR,
    topic: topic.id,
    keywords: article.keywords,
    image,
    imageAlt: article.image_alt.trim(),
    faq: article.faq,
    sources,
  };
  await writeFile(`${CONTENT_DIR}/${slug}.md`, `---\n${toYaml(frontmatter, { lineWidth: 0 })}---\n\n${body.trim()}\n`);

  const repo = process.env.GITHUB_REPOSITORY ?? "Datasyslatam/datasyslatam-landing";
  const imageUrl = `https://github.com/${repo}/blob/blog/${slug}/public${image}?raw=true`;
  const words = body.split(/\s+/).filter(Boolean).length;
  const removed = report.filter((r) => !r.kept);
  const blocked = report.filter((r) => r.result === "bloqueado");
  const prBody = [
    `## ${frontmatter.title}`,
    "",
    `> ${frontmatter.description}`,
    "",
    `![${frontmatter.imageAlt}](${imageUrl})`,
    "",
    `- **Tema del calendario:** ${topic.tema}`,
    `- **Palabra clave:** ${topic.palabraClave}`,
    `- **Extensión:** ${words} palabras · ${article.faq.length} preguntas frecuentes · ${sources.length} fuentes verificadas`,
    `- **URL al publicar:** https://datasyslatam.com/blog/${slug}`,
    "",
    "### Fuentes",
    ...sources.map((s) => `- [${s.title}](${s.url}) — ${s.publisher}${blocked.some((b) => b.url === s.url) ? " ⚠️ no se pudo comprobar automáticamente (el sitio bloquea robots): ábrala para confirmarla" : ""}`),
    ...(removed.length
      ? ["", "### Enlaces descartados automáticamente", ...removed.map((r) => `- ${r.url} — ${r.result}`)]
      : []),
    "",
    "### Antes de aprobar",
    "- [ ] El contenido es correcto y coherente con lo que hacemos.",
    "- [ ] Las cifras y normas citadas coinciden con sus fuentes.",
    "- [ ] La imagen es adecuada para la marca.",
    "",
    "Al hacer **Merge**, Railway publica el artículo en unos minutos. Para descartarlo, cierre el PR.",
    "",
    "🤖 Generado por el asistente de blog (`scripts/blog-agent`) con Claude y revisión humana obligatoria.",
  ].join("\n");
  await writeFile(`${OUT_DIR}/pr-body.md`, prBody);

  const tokens = [...researchUsage, writeUsage].reduce(
    (acc, u) => ({ input: acc.input + (u?.input_tokens ?? 0), output: acc.output + (u?.output_tokens ?? 0) }),
    { input: 0, output: 0 },
  );
  console.log(`Artículo listo: content/blog/${slug}.md (${words} palabras, ${sources.length} fuentes)`);
  console.log(`Tokens: ${tokens.input} de entrada, ${tokens.output} de salida`);

  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `slug=${slug}\ntitle=${frontmatter.title.replace(/\n/g, " ")}\n`);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    if (err instanceof Anthropic.APIError) {
      console.error(`Error de la API de Claude (${err.status}): ${err.message}`);
    } else {
      console.error(err instanceof Error ? err.message : err);
    }
    process.exit(1);
  });
}
