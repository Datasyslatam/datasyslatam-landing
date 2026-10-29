# datasyslatam-landing

Sitio corporativo de DataSys Latam Group: React 18, TypeScript, Vite y Tailwind CSS. Las páginas se prerenderizan en el build (HTML completo, legible sin JavaScript para Google y asistentes de IA) y se sirven con un pequeño servidor Node (`server/`) en Railway.

## Desarrollo local

```bash
npm ci
cp .env.example .env.local   # y completar VITE_WEB3FORMS_ACCESS_KEY
npm run dev                  # http://localhost:5173
npm run dev:api              # en otra terminal: /api/chat del asistente (requiere un npm run build previo)
```

Build de producción servido igual que en Railway (con las cabeceras de `public/serve.json`):

```bash
npm run build
npm run start                # http://localhost:3000
```

`npm run build` hace tres pasos: build del cliente, build SSR de `src/entry-server.tsx` y `scripts/prerender.mjs`, que genera el HTML de `/`, `/blog`, cada artículo, `404.html`, `sitemap.xml`, `blog/rss.xml` y la base de conocimiento del asistente (`dist-server/knowledge.md`).

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | Clave de Web3Forms del formulario de contacto. Vite la inserta en el build, así que en Railway debe existir **antes** de construir. |
| `GEMINI_API_KEY` | Clave de Gemini del asistente del sitio (`/api/chat`). Solo la lee el servidor; sin ella el asistente ofrece WhatsApp y el formulario. |
| `CHAT_MODEL`, `CHAT_THINKING` | Opcionales. Modelo y nivel de razonamiento del asistente (por defecto `gemini-3.1-flash-lite` y `minimal`, para responder en segundos; compare modelos con `/api/diagnostico`). |
| `CHAT_SERVICE_TIER` | Opcional. `priority` para la cola prioritaria de Gemini (respuesta en segundos aun con carga; cuesta 75–100 % más y requiere cuenta de nivel 2 o 3 en Google). |

## Blog

- Cada artículo es `content/blog/<slug>.md` (frontmatter YAML + Markdown) con portada en `public/blog/<slug>.jpg` (el asistente la comprime a 1200 px, unos 120 KB, con `sharp`). `vite-plugin-blog.ts` los convierte en HTML al compilar.
- La página `/blog` tiene búsqueda (título, resumen, palabras clave y autor, sin distinguir tildes), filtros por categoría y etiqueta compartibles por URL (`?q=`, `?categoria=`, `?etiqueta=`) y la marca "Nuevo" para los artículos de los últimos 14 días. La categoría sale del campo `area` del artículo (o de su tema en `topics.json`); autores, fotos y categorías se definen en `src/blog/authors.ts` y `src/assets/authors/`.
- **Asistente** (`scripts/blog-agent/generate.mjs`): toma el siguiente tema de `scripts/blog-agent/topics.json`, investiga con Gemini y la Búsqueda de Google, redacta, comprueba cada cifra y la edición vigente de cada norma contra su fuente (y corrige lo que no coincida) de dos formas independientes: Gemini lee las fuentes, y una comprobación local sin IA (`scripts/blog-agent/figures.mjs`) busca cada cifra en el texto de su fuente, HTML o PDF; conserva solo enlaces encontrados en la investigación que responden y genera la portada. Nunca cita competidores ni copias de normas: la lista de dominios excluidos está en `scripts/blog-agent/excluded-domains.json`.
- **Extensión y autores:** cada artículo se lee en 5 minutos como máximo (hasta 1.000 palabras; si se pasa, el asistente lo recorta). El autor depende del campo `area` de cada tema en `topics.json`: `tecnologia` (integración de sistemas, desarrollo web y móvil, IA, ciberseguridad, cloud y DevOps) → Fabián Florián; `analitica` (analítica de datos, tableros) → Agustín Robledo; `gestion` (normas ISO y consultoría) → Armando José López González. Para un tema escrito a mano en *Run workflow*, el área se deduce del texto.
- **Programación** (`.github/workflows/blog-agent.yml`): dos artículos por semana. Martes y viernes, antes de las 8:00 a. m. (Colombia), abre un PR `Blog: ...` (se lanza a las 5:17 y, si GitHub omitió esa ejecución, a las 6:47; nunca genera dos el mismo día). Se publica al hacer **Merge**; para descartarlo, se cierra el PR. También se puede lanzar a mano desde *Actions → Blog — artículo para revisión → Run workflow*, con un tema opcional.

Configuración necesaria en GitHub (una sola vez):

1. *Settings → Secrets and variables → Actions*: secreto `GEMINI_API_KEY` (Google AI Studio). Con ella se investiga y redacta (`gemini-3.8-flash`, se cambia con la variable `BLOG_TEXT_MODEL`, p. ej. `gemini-4-argon`) y se generan las portadas (`gemini-nano-banana-2.1`, variable `BLOG_IMAGE_MODEL`). Puede requerir facturación activa en el proyecto de Google.
2. *Settings → Actions → General → Workflow permissions*: activar **Allow GitHub Actions to create and approve pull requests**.

## Asistente del sitio

- Botón flotante (`src/components/assistant/`) con pestañas Inicio y Mensajes: responde preguntas, abre el autodiagnóstico, WhatsApp, y envía mensajes o solicitudes de reunión por Web3Forms con la conversación adjunta. Reemplaza al antiguo botón de WhatsApp.
- `server/chat.mjs` atiende `POST /api/chat`: valida el origen y el tamaño, limita a 20 preguntas cada 10 minutos y 120 al día por IP, y llama a Gemini con la base de conocimiento generada en el build. Responde solo con el contenido del sitio y del blog; no registra el contenido de las conversaciones.
- Latencia: si Gemini no responde en 7 s (o falla de forma pasajera) se lanza una segunda solicitud y gana la primera en llegar, con un plazo total de 25 s; las preguntas sueltas repetidas se responden desde memoria durante 6 horas. Cada respuesta trae la cabecera `Server-Timing` y cada error su causa (`reason`: `timeout`, `gemini_503`, `invalid_json`…).
- Diagnóstico: `GET /api/diagnostico` mide en paralelo la clave y la conexión, el modelo con una pregunta mínima, la solicitud real (con y sin salida JSON), la API `generateContent` y otros modelos (`CHAT_DIAG_MODELS`), con el nivel de servicio que informa Google. Como mucho una medición cada 2 minutos; no expone la clave.

## Despliegue (Railway)

- Builder: Railpack (`railway.toml`, `railpack.json`). Node 22 según `.nvmrc` / `engines`.
- `.npmrc` (`include=dev`) mantiene las devDependencies necesarias para `npm run build`.
- `server/index.mjs` (`npm run start`) sirve `dist/` con `serve-handler` y compresión gzip, y atiende `/api/chat`.
- `public/serve.json`: cabeceras de seguridad (CSP, HSTS, etc.) y caché inmutable para `/assets/*`. Las rutas inexistentes reciben `404.html` con estado 404.
