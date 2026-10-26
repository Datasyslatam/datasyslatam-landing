// Inserta el HTML de la página de inicio en dist/index.html después del build.
// Así Google y los rastreadores de IA (que no ejecutan JavaScript) leen todo el contenido.
import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const indexPath = `${root}dist/index.html`;
const ssrDir = `${root}dist-ssr`;

const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
const appHtml = render();

const template = await readFile(indexPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!template.includes(placeholder)) {
  throw new Error(`No se encontró ${placeholder} en dist/index.html`);
}
await writeFile(indexPath, template.replace(placeholder, `<div id="root">${appHtml}</div>`));
await rm(ssrDir, { recursive: true, force: true });

console.log(`Prerender listo: ${appHtml.length} caracteres de HTML en dist/index.html`);
