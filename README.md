# datasyslatam-landing

Sitio corporativo de DataSys Latam Group: React 18, TypeScript, Vite y Tailwind CSS. Las páginas se prerenderizan en el build (HTML completo, legible sin JavaScript para Google y asistentes de IA) y se sirven con `serve` en Railway.

## Desarrollo local

```bash
npm ci
cp .env.example .env.local   # y completar VITE_WEB3FORMS_ACCESS_KEY
npm run dev                  # http://localhost:5173
```

Build de producción servido igual que en Railway (con las cabeceras de `public/serve.json`):

```bash
npm run build
npm run start                # http://localhost:3000
```

`npm run build` hace tres pasos: build del cliente, build SSR de `src/entry-server.tsx` y `scripts/prerender.mjs`, que genera el HTML de `/`, `/blog`, cada artículo, `404.html`, `sitemap.xml` y `blog/rss.xml`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | Clave de Web3Forms del formulario de contacto. Vite la inserta en el build, así que en Railway debe existir **antes** de construir. |

## Blog

- Cada artículo es `content/blog/<slug>.md` (frontmatter YAML + Markdown) con portada en `public/blog/<slug>.jpg`. `vite-plugin-blog.ts` los convierte en HTML al compilar.
- **Asistente** (`scripts/blog-agent/generate.mjs`): toma el siguiente tema de `scripts/blog-agent/topics.json`, investiga con Gemini y la Búsqueda de Google, redacta, comprueba cada cifra y la edición vigente de cada norma contra su fuente (y corrige lo que no coincida), conserva solo enlaces encontrados en la investigación que responden y genera la portada. Nunca cita competidores ni copias de normas: la lista de dominios excluidos está en `scripts/blog-agent/excluded-domains.json`.
- **Programación** (`.github/workflows/blog-agent.yml`): dos artículos por semana: martes y viernes a las 6:00 a. m. (Colombia) abre un PR `Blog: ...`. Se publica al hacer **Merge**; para descartarlo, se cierra el PR. También se puede lanzar a mano desde *Actions → Blog — artículo para revisión → Run workflow*, con un tema opcional.

Configuración necesaria en GitHub (una sola vez):

1. *Settings → Secrets and variables → Actions*: secreto `GEMINI_API_KEY` (Google AI Studio). Con ella se investiga y redacta (`gemini-3.8-flash`, se cambia con la variable `BLOG_TEXT_MODEL`, p. ej. `gemini-4-argon`) y se generan las portadas (`gemini-nano-banana-2.1`, variable `BLOG_IMAGE_MODEL`). Puede requerir facturación activa en el proyecto de Google.
2. *Settings → Actions → General → Workflow permissions*: activar **Allow GitHub Actions to create and approve pull requests**.

## Despliegue (Railway)

- Builder: Railpack (`railway.toml`, `railpack.json`). Node 22 según `.nvmrc` / `engines`.
- `.npmrc` (`include=dev`) mantiene las devDependencies necesarias para `npm run build`.
- `public/serve.json`: cabeceras de seguridad (CSP, HSTS, etc.) y caché inmutable para `/assets/*`. Las rutas inexistentes reciben `404.html` con estado 404.
