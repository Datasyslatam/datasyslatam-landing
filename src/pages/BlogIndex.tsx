import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ClipboardCheck, Search, X } from "lucide-react";
import { buildDate, posts } from "virtual:blog-posts";
import SiteChrome from "@/components/SiteChrome";
import BlogCard from "@/components/blog/BlogCard";
import { heroBtnOrange } from "@/components/heroButtons";
import { AUTODIAGNOSTICO_HASH } from "@/components/autodiagnostico/data";
import { BLOG_DESCRIPTION } from "@/blog/seo";
import { AREAS, findAuthor } from "@/blog/authors";
import type { BlogArea, BlogPostMeta } from "@/blog/types";

const NEW_DAYS = 14;
const MAX_TAGS = 14;

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// "ISO 9001:2026" e "ISO 9001 2026" son la misma etiqueta.
const tagKey = (text: string) => normalize(text).replace(/[^a-z0-9]+/g, " ").trim();

const daysBetween =(from: string, to: string) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
const isNew = (post: BlogPostMeta) => daysBetween(post.date, buildDate) <= NEW_DAYS;

const searchText = (post: BlogPostMeta) =>
  normalize([post.title, post.description, post.keywords.join(" "), findAuthor(post.author).name, AREAS[post.area].label].join(" "));

/** Etiquetas: las palabras clave más repetidas entre los artículos (las cortas, que funcionan como etiqueta). */
const TAGS = (() => {
  const counts = new Map<string, { label: string; count: number }>();
  for (const post of posts) {
    for (const keyword of post.keywords) {
      const label = keyword.trim();
      if (!label || label.length > 32) continue;
      const key = tagKey(label);
      const entry = counts.get(key) ?? { label, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"))
    .slice(0, MAX_TAGS)
    .map((t) => t.label);
})();

const AREA_KEYS = Object.keys(AREAS) as BlogArea[];
const areaFromSlug = (slug: string | null) => AREA_KEYS.find((key) => AREAS[key].slug === slug) ?? null;

interface Filters {
  q: string;
  area: BlogArea | null;
  tag: string | null;
}

const EMPTY: Filters = { q: "", area: null, tag: null };

/** La tarjeta del autodiagnóstico (null) va en el cuarto lugar, o al final si hay menos artículos. */
const withCta = (list: BlogPostMeta[]): (BlogPostMeta | null)[] => {
  const at = Math.min(3, list.length);
  return [...list.slice(0, at), null, ...list.slice(at)];
};

const BlogIndex = () => {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [draft, setDraft] = useState("");

  // Los filtros viven en la URL (?q=, ?categoria=, ?etiqueta=) para poder compartir una búsqueda. Se leen después de
  // hidratar: el HTML prerenderizado siempre muestra todos los artículos.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = { q: params.get("q") ?? "", area: areaFromSlug(params.get("categoria")), tag: params.get("etiqueta") };
    setFilters(initial);
    setDraft(initial.q);
  }, []);

  const update = (next: Filters) => {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.area) params.set("categoria", AREAS[next.area].slug);
    if (next.tag) params.set("etiqueta", next.tag);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/blog?${query}` : "/blog");
  };

  const results = useMemo(() => {
    const terms = normalize(filters.q).split(/\s+/).filter(Boolean);
    return posts.filter(
      (post) =>
        (!filters.area || post.area === filters.area) &&
        (!filters.tag || post.keywords.some((k) => tagKey(k) === tagKey(filters.tag!))) &&
        terms.every((term) => searchText(post).includes(term)),
    );
  }, [filters]);

  const filtering = Boolean(filters.q || filters.area || filters.tag);
  const counts = useMemo(() => Object.fromEntries(AREA_KEYS.map((a) => [a, posts.filter((p) => p.area === a).length])), []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    update({ ...filters, q: draft.trim() });
  };

  const clear = () => {
    setDraft("");
    update(EMPTY);
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition ${
      active ? "border-electric-600 bg-electric-600 text-white" : "border-electric-500/30 bg-electric-500/5 text-electric-600 hover:bg-electric-500/10"
    }`;

  return (
    <SiteChrome>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-navy-600 pb-28 pt-14 text-white md:pt-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-electric-500/25 blur-3xl" />
        <div className="container relative mx-auto max-w-7xl px-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF8024]">Blog</p>
          <h1 className="mb-3 max-w-3xl font-heading text-3xl font-bold md:text-4xl">Ideas para ordenar, automatizar y hacer crecer su empresa</h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/80">{BLOG_DESCRIPTION}</p>
        </div>
      </section>

      <section className="bg-[#f5f7fb] pb-16">
        <div className="container mx-auto -mt-20 grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Barra lateral: en móvil va primero para que la búsqueda quede a mano */}
          <aside className="relative z-10 space-y-5 lg:order-last">
            <div className="lg:sticky lg:top-24 space-y-5">
              <form onSubmit={submit} role="search" className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(11,42,94,0.10)]">
                <label htmlFor="blog-search" className="mb-2 block text-sm font-bold text-navy-900">
                  Buscar artículos
                </label>
                <div className="flex gap-2">
                  <input
                    id="blog-search"
                    type="search"
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      update({ ...filters, q: e.target.value.trim() });
                    }}
                    placeholder="Escriba un tema…"
                    className="min-w-0 flex-1 rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-electric-500"
                  />
                  <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Buscar
                  </button>
                </div>
              </form>

              {/* En móvil, solo las categorías en una fila; el bloque completo ocuparía la pantalla antes de los artículos */}
              {posts.length > 0 && (
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" role="group" aria-label="Categorías">
                  {AREA_KEYS.filter((area) => counts[area] > 0 || filters.area === area).map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => update({ ...filters, area: filters.area === area ? null : area })}
                      aria-pressed={filters.area === area}
                      className={`shrink-0 ${chip(filters.area === area)} ${filters.area === area ? "" : "bg-white"}`}
                    >
                      {AREAS[area].label} ({counts[area]})
                    </button>
                  ))}
                </div>
              )}

              {posts.length > 0 && (
                <div className="hidden rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(11,42,94,0.06)] lg:block">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-navy-900">Categorías</h2>
                  <ul className="space-y-1">
                    {AREA_KEYS.map((area) => (
                      <li key={area}>
                        <button
                          type="button"
                          onClick={() => update({ ...filters, area: filters.area === area ? null : area })}
                          aria-pressed={filters.area === area}
                          disabled={counts[area] === 0 && filters.area !== area}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition disabled:cursor-default disabled:opacity-50 ${
                            filters.area === area ? "bg-electric-600 font-semibold text-white" : "text-navy-800 enabled:hover:bg-navy-900/5"
                          }`}
                        >
                          {AREAS[area].label}
                          <span className={`text-xs ${filters.area === area ? "text-white/80" : "text-steel-400"}`}>{counts[area]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {TAGS.length > 0 && (
                    <>
                      <h2 className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.15em] text-navy-900">Etiquetas</h2>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => update({ ...filters, tag: filters.tag === tag ? null : tag })}
                            aria-pressed={filters.tag === tag}
                            className={chip(filters.tag === tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </aside>

          <div className="relative z-10">
            {posts.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="mb-2 text-lg font-bold text-navy-900">Muy pronto publicaremos nuestros primeros artículos.</p>
                <p className="mb-6 text-sm text-[#0b2a5e]/75">Mientras tanto, descubra en 10 minutos qué tan ordenada está su empresa.</p>
                <a href={AUTODIAGNOSTICO_HASH} className={heroBtnOrange}>
                  Hacer el autodiagnóstico gratis
                </a>
              </div>
            ) : (
              <>
                {filtering && (
                  <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-navy-800 shadow-sm" aria-live="polite">
                    <span>
                      {results.length === 1 ? "1 artículo" : `${results.length} artículos`}
                      {filters.q && <> para «{filters.q}»</>}
                      {filters.area && <> en {AREAS[filters.area].label}</>}
                      {filters.tag && <> con la etiqueta «{filters.tag}»</>}
                    </span>
                    <button type="button" onClick={clear} className="ml-auto inline-flex items-center gap-1 font-semibold text-electric-600 hover:text-electric-500">
                      <X className="h-4 w-4" aria-hidden="true" /> Limpiar
                    </button>
                  </div>
                )}

                {results.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="mb-2 text-lg font-bold text-navy-900">No encontramos artículos con esa búsqueda.</p>
                    <p className="mb-5 text-sm text-[#0b2a5e]/75">Pruebe con otra palabra o pregúntele a nuestro asistente, en el botón de abajo a la derecha.</p>
                    <button type="button" onClick={clear} className="text-sm font-semibold text-electric-600 hover:text-electric-500">
                      Ver todos los artículos
                    </button>
                  </div>
                ) : (
                  <ul className="grid gap-x-6 gap-y-9 pt-3 sm:grid-cols-2 xl:grid-cols-3">
                    {withCta(results).map((post) => (
                      <li key={post?.slug ?? "cta"}>{post ? <BlogCard post={post} isNew={isNew(post)} /> : <CtaCard />}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
};

/** Tarjeta del autodiagnóstico dentro de la cuadrícula, como la de "Investiga a tu competencia" del modelo. */
const CtaCard = () => (
  <div className="flex h-full flex-col rounded-2xl border-2 border-navy-900/10 bg-white p-6">
    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF8024]/15 text-[#e06a10]">
      <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
    </span>
    <p className="mb-2 font-heading text-xl font-bold text-navy-900">¿Qué tan ordenada está su empresa?</p>
    <p className="mb-6 text-sm leading-relaxed text-[#0b2a5e]/75">
      Responda el autodiagnóstico gratuito y en 10 minutos sabrá en qué etapa está, sus principales riesgos y el siguiente paso.
    </p>
    <a href={AUTODIAGNOSTICO_HASH} className={`${heroBtnOrange} mt-auto`}>
      Hacer el autodiagnóstico
    </a>
  </div>
);

export default BlogIndex;
