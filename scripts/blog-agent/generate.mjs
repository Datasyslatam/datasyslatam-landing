// Asistente de blog de DataSys Latam Group (todo con la API de Gemini de Google).
// 1) Elige el siguiente tema del calendario (topics.json) que aún no tenga artículo.
// 2) Investiga con Gemini + Búsqueda de Google y redacta el artículo con salida JSON estructurada.
// 3) Verifica los enlaces: solo quedan fuentes citadas en la investigación que responden.
// 4) Genera la portada con Gemini y escribe content/blog/<slug>.md.
// El flujo .github/workflows/blog-agent.yml abre un PR con el resultado para revisión humana.
import { appendFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import { parse as parseYaml, stringify as toYaml } from "yaml";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const TEXT_MODEL = process.env.BLOG_TEXT_MODEL || "gemini-3.8-flash";
const IMAGE_MODEL = process.env.BLOG_IMAGE_MODEL || "gemini-nano-banana-2.1";
const AUTHOR = "Armando José López González";
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
const USER_AGENT = "Mozilla/5.0 (compatible; DataSysBlogAgent/1.0; +https://datasyslatam.com)";

/** "ok" si responde; "bloqueado" si existe pero rechaza robots (401/403/405/429); "error ..." si no. */
export const checkUrl = async (url) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*" },
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

/** Las citas de la Búsqueda de Google pueden llegar como enlaces de redirección; se usa la página real. */
const isGroundingRedirect = (url) => {
  try {
    return new URL(url).hostname.endsWith("vertexaisearch.cloud.google.com");
  } catch {
    return false;
  }
};

const resolveUrl = async (url) => {
  if (!isGroundingRedirect(url)) return url;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": USER_AGENT },
    });
    await res.body?.cancel();
    return isGroundingRedirect(res.url) ? null : res.url;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Gemini (Interactions API)
// ---------------------------------------------------------------------------

export class GeminiError extends Error {}

/** Llama a la Interactions API. Reintenta una vez si el servicio está saturado o falla de forma temporal. */
const gemini = async (body, step) => {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(600_000),
    });
    if (res.ok) {
      const interaction = await res.json();
      if (interaction.status === "failed") {
        const detail = interaction.errors?.map((e) => e.message).join("; ") || "sin detalle";
        throw new GeminiError(`${step}: Gemini no completó la solicitud (${detail}).`);
      }
      if (interaction.status === "incomplete") throw new GeminiError(`${step}: la respuesta de Gemini quedó incompleta (límite de tokens).`);
      return interaction;
    }
    lastError = `${step} (Gemini ${res.status}): ${(await res.text()).slice(0, 400)}`;
    // Clave inválida, sin permisos, sin facturación o solicitud mal formada: reintentar no sirve.
    if (![429, 500, 502, 503, 504].includes(res.status)) break;
    if (attempt === 1) await new Promise((r) => setTimeout(r, 20_000));
  }
  throw new GeminiError(lastError);
};

const textBlocks = (interaction) =>
  (interaction.steps ?? [])
    .filter((s) => s.type === "model_output")
    .flatMap((s) => s.content ?? [])
    .filter((c) => c.type === "text" && typeof c.text === "string");

export const outputText = (interaction) =>
  interaction.output_text ?? textBlocks(interaction).map((c) => c.text).join("").trim();

/** Fuentes que el modelo citó al responder con la Búsqueda de Google (anotaciones url_citation). */
export const citedSources = (interaction) => {
  const found = new Map();
  for (const block of textBlocks(interaction)) {
    for (const a of block.annotations ?? []) {
      if (a.type === "url_citation" && a.url) found.set(a.url, { url: a.url, title: a.title ?? a.url });
    }
  }
  return [...found.values()];
};

const addUsage = (total, interaction) => ({
  input: total.input + (interaction.usage?.total_input_tokens ?? 0),
  output: total.output + (interaction.usage?.total_output_tokens ?? 0) + (interaction.usage?.total_thought_tokens ?? 0),
});

// ---------------------------------------------------------------------------
// Investigación y redacción
// ---------------------------------------------------------------------------

const RESEARCH_SYSTEM = `Eres un investigador para el blog de una consultora colombiana. Buscas información actual y
verificable en fuentes confiables: organismos oficiales (iso.org, icontec.org, mintrabajo.gov.co, mintic.gov.co, dane.gov.co,
dian.gov.co, supersociedades.gov.co, confecamaras.org.co), universidades, gremios y medios económicos reconocidos.
Evitas blogs comerciales de competidores y contenido sin autor.`;

const researchPrompt = (topic) => `Investiga con la Búsqueda de Google para un artículo de blog sobre: "${topic.tema}".
Palabra clave principal: "${topic.palabraClave}". Público: dueños y gerentes de pymes en Colombia.

Entrega un informe en español con:
- 6 a 10 hechos clave, cada uno respaldado por la fuente donde lo encontraste y quién la publica.
- Datos o cifras solo si aparecen en una fuente; indica el año del dato.
- Normativa colombiana aplicable, si la hay, con su fuente oficial.
- Preguntas frecuentes que se hace el público sobre el tema.
No inventes fuentes ni cifras: si algo no lo encontraste en una fuente, no lo incluyas.`;

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

// Gemini acepta un subconjunto de JSON Schema; la clave $schema no forma parte de él.
const { $schema, ...ARTICLE_JSON_SCHEMA } = z.toJSONSchema(ArticleSchema);

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

const research = async (topic) => {
  const interaction = await gemini(
    {
      model: TEXT_MODEL,
      system_instruction: RESEARCH_SYSTEM,
      input: researchPrompt(topic),
      tools: [{ type: "google_search" }],
      generation_config: { thinking_level: "high" },
    },
    "Investigación",
  );
  const brief = outputText(interaction);
  if (!brief) throw new Error("Investigación: no se obtuvo informe.");

  const sources = new Map();
  for (const cited of citedSources(interaction)) {
    const url = await resolveUrl(cited.url);
    if (url) sources.set(normalizeUrl(url), { url, title: cited.title });
  }
  return { brief, sources: [...sources.values()], interaction };
};

const write = async (topic, brief, sources) => {
  const interaction = await gemini(
    {
      model: TEXT_MODEL,
      system_instruction: WRITER_SYSTEM,
      input: writerPrompt(topic, brief, sources),
      response_format: { type: "text", mime_type: "application/json", schema: ARTICLE_JSON_SCHEMA },
      generation_config: { thinking_level: "high", max_output_tokens: 16000 },
    },
    "Redacción",
  );
  let json;
  try {
    json = JSON.parse(outputText(interaction));
  } catch {
    throw new Error("Redacción: Gemini no devolvió un JSON válido.");
  }
  const parsed = ArticleSchema.safeParse(json);
  if (!parsed.success) throw new Error(`Redacción: la respuesta no cumple el formato esperado (${parsed.error.message.slice(0, 300)}).`);
  return { article: parsed.data, interaction };
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
  const interaction = await gemini(
    {
      model: IMAGE_MODEL,
      input: [{ type: "text", text: `${prompt}. ${IMAGE_STYLE}` }],
      // JPEG a 1K mantiene la portada liviana para la web.
      response_format: { type: "image", mime_type: "image/jpeg", aspect_ratio: "3:2", image_size: "1K" },
    },
    "Imagen",
  );
  const block = findImageBlock(interaction);
  if (!block) throw new Error(`Imagen: la respuesta de Gemini no trae ninguna imagen (campos: ${Object.keys(interaction).join(", ")}).`);
  const extension = EXTENSIONS[block.mime_type ?? block.mimeType] ?? "jpg";
  await writeFile(`${IMAGE_DIR}/${slug}.${extension}`, Buffer.from(block.data, "base64"));
  return { image: `/blog/${slug}.${extension}`, interaction };
};

// ---------------------------------------------------------------------------
// Principal
// ---------------------------------------------------------------------------

const requireEnv = (name) => {
  if (!process.env[name]) throw new Error(`Falta la variable de entorno ${name} (configúrela como secreto del repositorio en GitHub).`);
};

const main = async () => {
  requireEnv("GEMINI_API_KEY");
  await mkdir(CONTENT_DIR, { recursive: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const existing = await readExistingPosts();
  const topic = await pickTopic(existing);
  console.log(`Tema: ${topic.tema} (modelo ${TEXT_MODEL})`);

  const { brief, sources: researched, interaction: researchRun } = await research(topic);
  console.log(`Investigación lista: ${researched.length} fuentes citadas`);
  if (researched.length < MIN_SOURCES) {
    throw new Error(`La investigación solo citó ${researched.length} fuentes (mínimo ${MIN_SOURCES}); no se redacta un artículo sin respaldo.`);
  }

  const { article, interaction: writeRun } = await write(topic, brief, researched);
  const researchedUrls = new Set(researched.map((s) => normalizeUrl(s.url)));
  const { body, sources, report } = await verifyLinks(article, researchedUrls);
  if (sources.length < MIN_SOURCES) {
    throw new Error(`Solo ${sources.length} fuentes verificadas (mínimo ${MIN_SOURCES}); no se publica un artículo sin respaldo.`);
  }

  const takenSlugs = new Set(existing.map((p) => p.slug));
  let slug = slugify(article.slug || article.title);
  if (takenSlugs.has(slug) || existsSync(`${CONTENT_DIR}/${slug}.md`)) slug = `${slug}-${today()}`;

  const { image, interaction: imageRun } = await generateImage(article.image_prompt, slug);

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
    `🤖 Generado por el asistente de blog (\`scripts/blog-agent\`) con Gemini (${TEXT_MODEL}) y revisión humana obligatoria.`,
  ].join("\n");
  await writeFile(`${OUT_DIR}/pr-body.md`, prBody);

  const tokens = [researchRun, writeRun, imageRun].reduce(addUsage, { input: 0, output: 0 });
  console.log(`Artículo listo: content/blog/${slug}.md (${words} palabras, ${sources.length} fuentes)`);
  console.log(`Tokens: ${tokens.input} de entrada, ${tokens.output} de salida`);

  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `slug=${slug}\ntitle=${frontmatter.title.replace(/\n/g, " ")}\n`);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
