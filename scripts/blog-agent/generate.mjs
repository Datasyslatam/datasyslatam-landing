// Asistente de blog de DataSys Latam Group (todo con la API de Gemini de Google).
// 1) Elige el siguiente tema del calendario (topics.json) que aún no tenga artículo.
// 2) Investiga con Gemini + Búsqueda de Google y redacta el artículo con salida JSON estructurada.
// 3) Otra llamada abre cada fuente y comprueba cifras y ediciones de normas; si algo no coincide, se corrige y se
//    vuelve a comprobar. Lo que siga sin confirmarse queda señalado en el PR.
// 4) Verifica los enlaces: solo quedan fuentes investigadas que responden, sin competidores ni copias de normas.
// 5) Genera la portada con Gemini y escribe content/blog/<slug>.md.
// El flujo .github/workflows/blog-agent.yml abre un PR con el resultado para revisión humana.
import { appendFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import { parse as parseYaml, stringify as toYaml } from "yaml";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const TEXT_MODEL = process.env.BLOG_TEXT_MODEL || "gemini-3.8-flash";
const IMAGE_MODEL = process.env.BLOG_IMAGE_MODEL || "gemini-nano-banana-2.1";
// Autor según el área del tema (campo "area" de topics.json).
export const AUTHORS = {
  gestion: "Armando José López González",
  tecnologia: "Fabián Florián",
  analitica: "Agustín Robledo",
};
// Lectura máxima de 5 minutos a 200 palabras por minuto, el mismo cálculo que muestra el sitio (vite-plugin-blog.ts).
export const MAX_WORDS = 1000;
export const countWords = (text) => text.split(/\s+/).filter(Boolean).length;
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

/** Área de un tema escrito a mano (BLOG_TOPIC): analítica, tecnología o, por defecto, gestión. */
export const areaFor = (text) => {
  const t = ` ${text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()} `;
  // Los temas sobre una norma (ISO, NTC, SG-SST) son de consultoría en gestión aunque mencionen tecnología.
  if (/\biso\b|\bntc\b|sg-sst/.test(t)) return "gestion";
  if (/integracion|integrar|\bapis?\b|desarrollo|sitio web|pagina web|\bweb\b|movil|\bapps?\b|aplicacion|inteligencia artificial|\bia\b|ciberseguridad|cloud|\bnube\b|devops|software|\berp\b|automatiza|\bseo\b|digital/.test(t)) {
    return "tecnologia";
  }
  if (/analitica|tablero|dashboard|indicador|kpi|power bi|\bdatos\b|\breportes?\b|inteligencia de negocios/.test(t)) return "analitica";
  return "gestion";
};

const pickTopic = async (existing) => {
  const custom = process.env.BLOG_TOPIC?.trim();
  if (custom) return { id: slugify(custom), tema: custom, palabraClave: custom, enlace: "/#autodiagnostico", area: areaFor(custom) };
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

const EXCLUDED_DOMAINS = JSON.parse(await readFile(new URL("./excluded-domains.json", import.meta.url), "utf8")).dominios;
// Solo los organismos de normalización publican el texto de sus normas; un PDF en otro sitio suele ser una copia no autorizada.
const STANDARD_PUBLISHERS = ["iso.org", "icontec.org", "iec.ch"];
const STANDARD_CODE = /(?:^|[^a-z])(?:(?:iso|iec|ntc|gtc)[\s_-]*\d{3,5}|norma[\s_-]+(?:iso|ntc|t[eé]cnica))/i;

const hostMatches = (host, domain) => host === domain || host.endsWith(`.${domain}`);

/** Motivo por el que una URL no se puede citar, o null si se puede. */
export const excludedReason = (url) => {
  let u;
  try {
    u = new URL(url);
  } catch {
    return "URL inválida";
  }
  const host = u.hostname.toLowerCase();
  if (EXCLUDED_DOMAINS.some((d) => hostMatches(host, d))) return "competidor (consultora o software de gestión)";
  const path = decodeURIComponent(u.pathname);
  const file = path.split("/").pop();
  if (/\.pdf$/i.test(file) && STANDARD_CODE.test(file) && !STANDARD_PUBLISHERS.some((d) => hostMatches(host, d))) return "posible copia de una norma";
  return null;
};

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
      const excluded = excludedReason(url);
      if (excluded) status.set(url, `excluida: ${excluded}`);
      else if (!researchedUrls.has(normalizeUrl(url))) status.set(url, "no salió de la investigación");
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

const RETRYABLE = [429, 500, 502, 503, 504];
const POLL_MS = Number(process.env.BLOG_POLL_MS) || 10_000;
const MAX_WAIT_MS = 20 * 60_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const geminiHeaders = () => ({ "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY });
const networkError = (err) => `error de red (${err?.cause?.code ?? err?.name ?? "sin detalle"})`;

/** Espera a que una interacción en segundo plano termine, consultándola cada POLL_MS. */
const waitFor = async (interaction, step) => {
  const deadline = Date.now() + MAX_WAIT_MS;
  while (interaction.status === "in_progress") {
    if (Date.now() > deadline) throw new GeminiError(`${step}: Gemini no terminó en ${MAX_WAIT_MS / 60_000} minutos.`);
    await sleep(POLL_MS);
    try {
      const res = await fetch(`${GEMINI_URL}/${interaction.id}`, { headers: geminiHeaders(), signal: AbortSignal.timeout(60_000) });
      if (res.ok) interaction = await res.json();
      else if (!RETRYABLE.includes(res.status)) throw new GeminiError(`${step} (Gemini ${res.status}): ${(await res.text()).slice(0, 400)}`);
    } catch (err) {
      // Un corte de red al consultar no pierde el trabajo: se vuelve a consultar en la siguiente vuelta.
      if (err instanceof GeminiError) throw err;
    }
  }
  if (interaction.status === "failed") {
    const detail = interaction.errors?.map((e) => e.message).join("; ") || "sin detalle";
    throw new GeminiError(`${step}: Gemini no completó la solicitud (${detail}).`);
  }
  if (interaction.status === "incomplete") {
    const u = interaction.usage ?? {};
    throw new GeminiError(
      `${step}: la respuesta de Gemini quedó incompleta (límite de tokens; salida ${u.total_output_tokens ?? "?"}, razonamiento ${u.total_thought_tokens ?? "?"}).`,
    );
  }
  if (interaction.status !== "completed") throw new GeminiError(`${step}: Gemini terminó con estado "${interaction.status}".`);
  return interaction;
};

/**
 * Llama a la Interactions API. Las solicitudes de texto van en segundo plano (background) y se consultan hasta
 * que terminan: con razonamiento alto pueden tardar más de los 5 minutos que una conexión HTTP aguarda la respuesta.
 * Reintenta una vez si el servicio está saturado, falla de forma temporal o se corta la red.
 */
const gemini = async (body, step, { background = true } = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: geminiHeaders(),
        body: JSON.stringify(background ? { ...body, background: true } : body),
        signal: AbortSignal.timeout(background ? 120_000 : 280_000),
      });
      if (res.ok) return await waitFor(await res.json(), step);
      lastError = `${step} (Gemini ${res.status}): ${(await res.text()).slice(0, 400)}`;
      // Clave inválida, sin permisos, sin facturación o solicitud mal formada: reintentar no sirve.
      if (!RETRYABLE.includes(res.status)) break;
    } catch (err) {
      if (err instanceof GeminiError) throw err;
      lastError = `${step}: ${networkError(err)} al llamar a Gemini.`;
    }
    if (attempt === 1) await sleep(20_000);
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
verificable en fuentes confiables: organismos oficiales (iso.org, icontec.org, onac.org.co, mintrabajo.gov.co, mintic.gov.co,
dane.gov.co, dian.gov.co, supersociedades.gov.co, confecamaras.org.co), universidades, gremios y medios económicos reconocidos.

Nunca usas como fuente:
- consultoras, firmas de capacitación o proveedores de software de sistemas de gestión (son competencia de la empresa);
- copias de normas técnicas (PDF de una norma ISO o NTC alojados fuera de iso.org o icontec.org); para una norma, cita su
  página oficial en iso.org o icontec.org;
- contenido sin autor o sin fecha.

Siempre confirmas en iso.org o icontec.org cuál es la edición vigente de cada norma que mencionas: las normas se revisan
y una edición anterior puede estar retirada.`;

const researchPrompt = (topic) => `Fecha de hoy: ${today()}.
Investiga con la Búsqueda de Google para un artículo de blog sobre: "${topic.tema}".
Palabra clave principal: "${topic.palabraClave}". Público: dueños y gerentes de pymes en Colombia.

Entrega un informe en español con:
- La edición vigente de cada norma relacionada con el tema (por ejemplo, ISO 9001:2026), su fecha de publicación y si hay
  un periodo de transición, según iso.org o icontec.org.
- 6 a 10 hechos clave, cada uno respaldado por la fuente donde lo encontraste y quién la publica.
- Datos o cifras solo si aparecen en una fuente: cópialos tal como los da la fuente, con su año y su base
  (por ejemplo, "94,3 % de las empresas formales activas, RUES primer semestre de 2025").
- Normativa colombiana aplicable, si la hay, con su fuente oficial.
- Preguntas frecuentes que se hace el público sobre el tema.
No inventes fuentes ni cifras: si algo no lo encontraste en una fuente, no lo incluyas.`;

const ArticleSchema = z.object({
  title: z.string().describe("Título en español, máximo 65 caracteres, con la palabra clave al inicio si suena natural"),
  slug: z.string().describe("URL corta en minúsculas con guiones, sin tildes, 3 a 7 palabras"),
  description: z.string().describe("Meta descripción de 140 a 160 caracteres que invite a leer"),
  keywords: z.array(z.string()).describe("4 a 8 palabras clave"),
  body_markdown: z.string().describe(`Cuerpo en Markdown, sin título H1, con secciones ##, de 700 a 950 palabras (máximo ${MAX_WORDS})`),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).describe("3 preguntas frecuentes con respuestas de 2 o 3 frases"),
  sources: z
    .array(z.object({ title: z.string(), url: z.string(), publisher: z.string() }))
    .describe("Fuentes citadas en el artículo, tomadas solo de la lista de fuentes investigadas"),
  image_prompt: z.string().describe("Descripción en inglés de una fotografía editorial para la portada, sin texto ni logotipos"),
  image_alt: z.string().describe("Texto alternativo de la portada en español, una frase"),
});

// Gemini acepta un subconjunto de JSON Schema; la clave $schema no forma parte de él.
const jsonSchema = (schema) => {
  const { $schema, ...rest } = z.toJSONSchema(schema);
  return rest;
};

const WRITER_SYSTEM = `Eres redactor del blog de DataSys Latam Group. Escribes en español de Colombia, tratando de "usted",
con un tono profesional, cercano y práctico, sin exageraciones ni frases vacías.

Contexto de la empresa (úsalo para los enlaces internos y el cierre; no inventes otros datos de la empresa, clientes,
casos de éxito, precios ni plazos):
${COMPANY_CONTEXT}

Reglas del artículo:
- 700 a 950 palabras en el cuerpo, nunca más de ${MAX_WORDS}: el artículo se lee en 5 minutos como máximo.
  Prioriza lo esencial y lo práctico; si sobra material, deja fuera lo secundario en lugar de resumirlo todo.
- El primer párrafo responde directamente la pregunta principal (así lo citan Google y los asistentes de IA).
- Estructura con 3 o 4 secciones ##, párrafos cortos, listas cuando ayuden y una sección final "## En resumen" con 3 o 4 viñetas.
- Toda cifra, dato o norma lleva un enlace Markdown a su fuente, usando SOLO URLs de la lista de fuentes investigadas.
  Si un dato no tiene fuente en esa lista, no lo uses.
- Las cifras se copian tal como las da la fuente, con su año y su base. No redondees, no combines datos de fuentes
  distintas en una sola cifra y no uses "se estima" para datos sin fuente.
- Cita cada norma con su edición vigente según el informe (por ejemplo, ISO 9001:2026), nunca una edición retirada.
- Los plazos y costos de implementación varían en cada empresa: no los cuantifiques salvo que una fuente oficial lo haga.
- Nunca cites consultoras, firmas de capacitación ni proveedores de software de gestión, ni copias de normas.
- Incluye 2 o 3 enlaces internos naturales, entre ellos /#autodiagnostico, y el enlace indicado para el tema.
- Cierra con un párrafo que invite a hacer el autodiagnóstico gratuito, sin sonar a anuncio.
- No incluyas el título como encabezado, ni HTML, ni imágenes dentro del cuerpo.`;

const writerPrompt = (topic, brief, sources) => `Fecha de hoy: ${today()}.
Tema: "${topic.tema}"
Palabra clave principal: "${topic.palabraClave}"
Enlace interno prioritario: ${topic.enlace}

Informe de investigación:
${brief}

Fuentes investigadas (las únicas URLs externas permitidas):
${sources.map((s) => `- ${s.title} — ${s.url}`).join("\n")}

Redacta el artículo completo siguiendo las reglas.`;

/** Fuentes citadas por Gemini, con la URL real y sin competidores ni copias de normas. */
const usableSources = async (interaction) => {
  const sources = new Map();
  const excluded = [];
  // Las redirecciones se resuelven en paralelo: una investigación puede citar más de 30 páginas.
  const resolved = await Promise.all(citedSources(interaction).map(async (cited) => ({ ...cited, url: await resolveUrl(cited.url) })));
  for (const { url, title } of resolved) {
    if (!url) continue;
    const reason = excludedReason(url);
    if (reason) excluded.push({ url, result: `excluida: ${reason}` });
    else sources.set(normalizeUrl(url), { url, title });
  }
  return { sources: [...sources.values()], excluded };
};

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
  return { brief, ...(await usableSources(interaction)), interaction };
};

const parseJson = (interaction, schema, step) => {
  let json;
  try {
    json = JSON.parse(outputText(interaction));
  } catch {
    throw new Error(`${step}: Gemini no devolvió un JSON válido.`);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new Error(`${step}: la respuesta no cumple el formato esperado (${parsed.error.message.slice(0, 300)}).`);
  return parsed.data;
};

const writeArticle = async (input, step) => {
  const interaction = await gemini(
    {
      model: TEXT_MODEL,
      system_instruction: WRITER_SYSTEM,
      input,
      response_format: { type: "text", mime_type: "application/json", schema: jsonSchema(ArticleSchema) },
      // Sin max_output_tokens: el límite incluye el razonamiento y, con muchas fuentes, 16.000 no alcanzaban para el JSON.
      generation_config: { thinking_level: "high" },
    },
    step,
  );
  return { article: parseJson(interaction, ArticleSchema, step), interaction };
};

// ---------------------------------------------------------------------------
// Verificación de cifras y normas
// ---------------------------------------------------------------------------

const VerificationSchema = z.object({
  figures: z
    .array(
      z.object({
        claim: z.string().describe("Frase del artículo que contiene la cifra o el dato, copiada textualmente"),
        url: z.string().describe("URL citada para ese dato; cadena vacía si no tiene enlace"),
        status: z.enum(["coincide", "no_coincide", "no_encontrada", "sin_fuente"]),
        source_says: z.string().describe("Lo que dice la fuente sobre ese dato, con su año; cadena vacía si no aparece"),
      }),
    )
    .describe("Una entrada por cada cifra, porcentaje, plazo o dato cuantitativo del artículo y de sus preguntas frecuentes"),
  standards: z
    .array(
      z.object({
        cited: z.string().describe("Norma tal como aparece en el artículo, p. ej. ISO 9001:2015"),
        current: z.string().describe("Edición vigente según iso.org o icontec.org, p. ej. ISO 9001:2026"),
        is_current: z.boolean(),
        evidence_url: z.string().describe("Página oficial que lo confirma"),
      }),
    )
    .describe("Una entrada por cada norma técnica citada con su edición o año"),
});

const VERIFIER_SYSTEM = `Eres verificador de datos de un blog empresarial. No reescribes el artículo: compruebas cada dato
contra la página que lo respalda y reportas el resultado con precisión. Un dato "coincide" solo si la fuente dice lo mismo
(mismo valor, mismo año y misma base). Si la fuente da otro valor es "no_coincide"; si la página no lo menciona es
"no_encontrada"; si el dato no tiene enlace es "sin_fuente". Para las normas, confirmas la edición vigente en iso.org o
icontec.org con la Búsqueda de Google.`;

const verifierPrompt = (article) => {
  const urls = [...new Set([...article.body_markdown.matchAll(MARKDOWN_LINK)].map((m) => m[2]))].slice(0, 20);
  return `Fecha de hoy: ${today()}.
Abre cada URL citada con la herramienta de contexto de URL y verifica el artículo.

URLs citadas:
${urls.map((u) => `- ${u}`).join("\n")}

Artículo (Markdown):
${article.body_markdown}

Preguntas frecuentes:
${article.faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}`;
};

const verify = async (article, step) => {
  const interaction = await gemini(
    {
      model: TEXT_MODEL,
      system_instruction: VERIFIER_SYSTEM,
      input: verifierPrompt(article),
      tools: [{ type: "url_context" }, { type: "google_search" }],
      response_format: { type: "text", mime_type: "application/json", schema: jsonSchema(VerificationSchema) },
      generation_config: { thinking_level: "high" },
    },
    step,
  );
  const report = parseJson(interaction, VerificationSchema, step);
  const issues = [...report.figures.filter((f) => f.status !== "coincide"), ...report.standards.filter((s) => !s.is_current)];
  return { report, issues, ...(await usableSources(interaction)), interaction };
};

/** El cuerpo como problema a corregir si supera los 5 minutos de lectura. */
const lengthIssues = (article) => {
  const words = countWords(article.body_markdown);
  return words > MAX_WORDS ? [{ words }] : [];
};

export const describeIssue = (issue) =>
  "words" in issue
    ? `El cuerpo tiene ${issue.words} palabras; el máximo es ${MAX_WORDS} (5 minutos de lectura)`
    : "status" in issue
    ? `«${issue.claim}» — ${issue.status.replace("_", " ")}${issue.source_says ? `; la fuente dice: ${issue.source_says}` : ""}${issue.url ? ` (${issue.url})` : ""}`
    : `${issue.cited} no es la edición vigente; la vigente es ${issue.current}${issue.evidence_url ? ` (${issue.evidence_url})` : ""}`;

const revisionPrompt = (article, issues, sources) => `Fecha de hoy: ${today()}.
Un verificador revisó este artículo contra sus fuentes y encontró estos problemas:
${issues.map((i) => `- ${describeIssue(i)}`).join("\n")}

Corrige el artículo:
- Si una cifra no coincide, usa exactamente lo que dice la fuente.
- Si una cifra no se encontró en la fuente o no tiene fuente, elimínala o reformula la frase sin ella.
- Si una norma no es la edición vigente, actualízala a la vigente y ajusta lo que dependa de ella.
- Si el artículo es demasiado largo, déjalo en 700 a 950 palabras quitando lo secundario.
- Mantén todo lo demás (estructura, tono, enlaces internos) y sigue las reglas.

Fuentes permitidas (las únicas URLs externas que puede usar):
${sources.map((s) => `- ${s.title} — ${s.url}`).join("\n")}

Artículo actual (JSON):
${JSON.stringify(article)}`;

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
    // La portada responde en segundos; se pide de forma directa, como cuando se probó el modelo de imagen.
    { background: false },
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

  const { brief, sources: researched, excluded, interaction: researchRun } = await research(topic);
  console.log(`Investigación lista: ${researched.length} fuentes citadas (${excluded.length} excluidas)`);
  if (researched.length < MIN_SOURCES) {
    throw new Error(`La investigación solo citó ${researched.length} fuentes (mínimo ${MIN_SOURCES}); no se redacta un artículo sin respaldo.`);
  }

  const runs = [researchRun];
  let { article, interaction: run } = await writeArticle(writerPrompt(topic, brief, researched), "Redacción");
  runs.push(run);

  // Las páginas oficiales que consulta el verificador (p. ej. la edición vigente en iso.org) también se pueden citar.
  const allowed = new Map(researched.map((s) => [normalizeUrl(s.url), s]));
  const check = async (step) => {
    const result = await verify(article, step);
    runs.push(result.interaction);
    excluded.push(...result.excluded);
    for (const s of result.sources) allowed.set(normalizeUrl(s.url), s);
    for (const s of result.report.standards) {
      const url = s.evidence_url && (await resolveUrl(s.evidence_url));
      const host = url ? new URL(url).hostname : "";
      if (STANDARD_PUBLISHERS.some((d) => hostMatches(host, d))) allowed.set(normalizeUrl(url), { url, title: s.current });
    }
    return result;
  };

  let verification = await check("Verificación");
  const corrected = [...verification.issues, ...lengthIssues(article)];
  if (corrected.length) {
    console.log(`Verificación: ${corrected.length} problemas; se corrige el artículo`);
    ({ article, interaction: run } = await writeArticle(revisionPrompt(article, corrected, [...allowed.values()]), "Corrección"));
    runs.push(run);
    verification = await check("Segunda verificación");
  }
  const pending = [...verification.issues, ...lengthIssues(article)];
  console.log(`Verificación final: ${verification.report.figures.length} datos revisados, ${pending.length} pendientes`);

  const { body, sources, report } = await verifyLinks(article, new Set(allowed.keys()));
  if (sources.length < MIN_SOURCES) {
    throw new Error(`Solo ${sources.length} fuentes verificadas (mínimo ${MIN_SOURCES}); no se publica un artículo sin respaldo.`);
  }

  const takenSlugs = new Set(existing.map((p) => p.slug));
  let slug = slugify(article.slug || article.title);
  if (takenSlugs.has(slug) || existsSync(`${CONTENT_DIR}/${slug}.md`)) slug = `${slug}-${today()}`;

  const { image, interaction: imageRun } = await generateImage(article.image_prompt, slug);
  runs.push(imageRun);

  const frontmatter = {
    title: article.title.trim(),
    slug,
    description: article.description.trim(),
    date: today(),
    author: AUTHORS[topic.area] ?? AUTHORS.gestion,
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
  const words = countWords(body);
  const removed = [...new Map([...excluded, ...report.filter((r) => !r.kept)].map((r) => [r.url, r])).values()];
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
    `- **Autor:** ${frontmatter.author}`,
    `- **Extensión:** ${words} palabras (${Math.max(1, Math.round(words / 200))} min de lectura) · ${article.faq.length} preguntas frecuentes · ${sources.length} fuentes verificadas`,
    `- **URL al publicar:** https://datasyslatam.com/blog/${slug}`,
    "",
    "### Fuentes",
    ...sources.map((s) => `- [${s.title}](${s.url}) — ${s.publisher}${blocked.some((b) => b.url === s.url) ? " ⚠️ no se pudo comprobar automáticamente (el sitio bloquea robots): ábrala para confirmarla" : ""}`),
    ...(removed.length
      ? ["", "### Enlaces descartados automáticamente", ...removed.map((r) => `- ${r.url} — ${r.result}`)]
      : []),
    "",
    "### Verificación automática de cifras y normas",
    `- ${verification.report.figures.length} datos y ${verification.report.standards.length} normas comprobados contra sus fuentes${corrected.length ? `; se corrigieron ${corrected.length} problemas encontrados en la primera revisión` : ""}.`,
    ...(pending.length
      ? ["", "⚠️ **Revise a mano** (el verificador no pudo confirmarlos):", ...pending.map((i) => `- ${describeIssue(i)}`)]
      : ["- Sin problemas pendientes."]),
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

  const tokens = runs.reduce(addUsage, { input: 0, output: 0 });
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
