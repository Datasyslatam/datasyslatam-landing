// Servidor de producción (Railway): entrega el sitio prerenderizado de dist/ igual que antes lo hacía `serve`
// (mismo motor serve-handler, mismas cabeceras de public/serve.json y 404.html con estado 404) y atiende
// el asistente del sitio en /api/chat (y su diagnóstico de latencia en /api/diagnostico).
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import compression from "compression";
import serveHandler from "serve-handler";
import { handleChat } from "./chat.mjs";
import { handleDiagnostic } from "./diagnostic.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = `${root}dist`;
const config = { ...JSON.parse(await readFile(`${publicDir}/serve.json`, "utf8")), public: publicDir };
const compress = compression();
const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  compress(req, res, () => {
    const path = (req.url ?? "/").split("?")[0];
    const handled =
      path === "/api/chat" ? handleChat(req, res) : path === "/api/diagnostico" ? handleDiagnostic(req, res) : serveHandler(req, res, config);
    handled.catch((err) => {
      console.error(`[server] ${req.method} ${path}: ${err?.message ?? err}`);
      if (!res.headersSent) res.writeHead(500);
      res.end();
    });
  });
});

server.listen(port, () => console.log(`Sitio en http://localhost:${port} (asistente: ${process.env.GEMINI_API_KEY ? "activo" : "sin GEMINI_API_KEY"})`));
