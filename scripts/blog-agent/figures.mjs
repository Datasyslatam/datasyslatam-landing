// Comprobación local de cifras, sin IA: cada cifra del artículo se busca en el texto de la fuente que la acompaña.
// Es una red de seguridad independiente de Gemini: atrapa cifras inventadas o mal copiadas (p. ej. un 92 % que la
// fuente no dice) aunque la verificación con IA falle. No juzga el sentido de la frase; eso queda para la revisión.
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const USER_AGENT = "Mozilla/5.0 (compatible; DataSysBlogAgent/1.0; +https://datasyslatam.com)";
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

// Cifras con unidad (%, millones…) o números grandes con separador de miles (294.896, 36.000). Los números sueltos
// pequeños (años, días, artículos de una ley) no se comprueban: darían demasiadas coincidencias falsas.
const FIGURE = /(?<![\w.,])\$?\s?(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d{1,2})?)\s?(%|por ciento|mil millones|millones|millón|billones)?(?![\w])/gi;

const strip = (text) => text.replace(LINK, "$1").replace(/[*_`>#]/g, "");

/** Párrafos y elementos de lista del cuerpo, con sus enlaces externos; las FAQ van sin enlaces. */
export const segments = (body, faq = []) => {
  const blocks = body
    .split(/\n\s*\n|\n(?=\s*(?:[-*]|\d+[.)])\s)/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith("#"));
  return [
    ...blocks.map((block) => ({ text: strip(block), urls: [...new Set([...block.matchAll(LINK)].map((m) => m[2]))] })),
    ...faq.map((f) => ({ text: `${f.q} ${f.a}`, urls: [] })),
  ];
};

/** Formas en que una cifra puede aparecer escrita en la fuente. */
export const variants = (number, unit) => {
  const out = new Set([number]);
  const plain = number.replace(/\./g, "").replace(",", ".");
  if (number.includes(",")) out.add(number.replace(/\./g, "").replace(",", "."));
  // Decimal con punto (9.3): también con coma (9,3).
  if (/^\d+\.\d{1,2}$/.test(number)) out.add(number.replace(".", ","));
  if (/\.\d{3}/.test(number)) {
    out.add(number.replace(/\./g, ""));
    out.add(number.replace(/\./g, ","));
    // 36.000 millones también se escribe "36 mil millones".
    if (/millones/i.test(unit ?? "") && plain.endsWith("000")) out.add(`${Number(plain) / 1000} mil`);
  }
  return [...out];
};

export const extractFigures = (text) =>
  [...text.matchAll(FIGURE)]
    .map((m) => ({ raw: m[0].trim(), number: m[1], unit: (m[2] ?? "").toLowerCase() }))
    // "100 %" suele ser una expresión ("asumir el 100 % con capital propio"), no un dato.
    .filter((f) => (f.unit || /\.\d{3}/.test(f.number)) && !(f.number === "100" && f.unit === "%"));

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** ¿Aparece la cifra (con su unidad, si la tiene) en el texto de la fuente? */
export const foundIn = (figure, sourceText) => {
  const text = sourceText.replace(/\s+/g, " ").toLowerCase();
  const unit = figure.unit === "%" || figure.unit === "por ciento" ? "\\s?(%|por ciento)" : figure.unit ? "\\s?(mil millones|millones|millón|billones)" : "(?![\\d])";
  return variants(figure.number, figure.unit).some((v) => new RegExp(`(?<![\\d.,])${escapeRe(v.toLowerCase())}${unit}`).test(text));
};

const htmlToText = (html) =>
  html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&[a-z]+;/gi, " ");

/** Texto de una fuente (HTML, o PDF con pdftotext). null si no se puede leer. */
export const fetchSourceText = async (url) => {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000), headers: { "user-agent": USER_AGENT } });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (type.includes("pdf") || /\.pdf($|\?)/i.test(url)) {
      const dir = await mkdtemp(join(tmpdir(), "fuente-"));
      try {
        const file = join(dir, "fuente.pdf");
        await writeFile(file, Buffer.from(await res.arrayBuffer()));
        const { stdout } = await run("pdftotext", ["-layout", file, "-"], { maxBuffer: 50 * 1024 * 1024 });
        return stdout;
      } catch {
        return null; // Sin pdftotext (o PDF ilegible): la cifra queda como "no se pudo leer la fuente".
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    }
    return htmlToText(await res.text());
  } catch {
    return null;
  }
};

/**
 * Busca cada cifra en las fuentes enlazadas en su mismo párrafo; si el párrafo no tiene enlaces (resumen, FAQ), en
 * todas las fuentes del artículo. Devuelve las cifras no encontradas como problemas a corregir.
 */
export const checkFiguresLocally = async (article, fetchText = fetchSourceText) => {
  const allUrls = [...new Set([...article.body_markdown.matchAll(LINK)].map((m) => m[2]))];
  const texts = new Map(await Promise.all(allUrls.map(async (u) => [u, await fetchText(u)])));
  const issues = [];
  const unreadable = new Set();
  let checked = 0;
  for (const { text, urls } of segments(article.body_markdown, article.faq)) {
    const candidates = urls.length ? urls : allUrls;
    for (const figure of extractFigures(text)) {
      const readable = candidates.filter((u) => texts.get(u));
      if (!readable.length) {
        candidates.forEach((u) => unreadable.add(u));
        continue;
      }
      checked += 1;
      if (!readable.some((u) => foundIn(figure, texts.get(u)))) {
        issues.push({ local: true, figure: figure.raw, claim: text.slice(0, 220), urls: readable });
      }
    }
  }
  // La misma cifra repetida (cuerpo, resumen, FAQ) se informa una sola vez.
  const unique = [...new Map(issues.map((i) => [i.figure, i])).values()];
  return { checked, issues: unique, unreadable: [...unreadable] };
};
