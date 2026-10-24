# datasyslatam-landing

Landing corporativa de DataSys Latam Group: SPA estática con React 18, TypeScript, Vite y Tailwind CSS, servida con `serve` en Railway.

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

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | Clave de Web3Forms del formulario de contacto. Vite la inserta en el build, así que en Railway debe existir **antes** de construir. |

## Despliegue (Railway)

- Builder: Railpack (`railway.toml`, `railpack.json`). Node 22 según `.nvmrc` / `engines`.
- `.npmrc` (`include=dev`) mantiene las devDependencies necesarias para `npm run build`.
- `public/serve.json`: fallback SPA, cabeceras de seguridad (CSP, HSTS, etc.) y caché inmutable para `/assets/*`.
