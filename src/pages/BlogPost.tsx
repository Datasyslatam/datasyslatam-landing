import { ChevronDown, Clock, ExternalLink } from "lucide-react";
import { posts } from "virtual:blog-posts";
import SiteChrome from "@/components/SiteChrome";
import { heroBtnBlue, heroBtnOrange } from "@/components/heroButtons";
import { AUTODIAGNOSTICO_HASH } from "@/components/autodiagnostico/data";
import { articleJsonLd } from "@/blog/seo";
import { formatDate } from "@/blog/format";
import { AREAS, findAuthor } from "@/blog/authors";
import BlogCard, { AuthorAvatar } from "@/components/blog/BlogCard";
import type { BlogPost as BlogPostData } from "@/blog/types";
import { whatsappUrl } from "@/lib/whatsapp";

const BlogPost = ({ post }: { post: BlogPostData }) => {
  // Primero los de la misma categoría, luego los más recientes.
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.area === post.area) - Number(a.area === post.area))
    .slice(0, 3);
  const author = findAuthor(post.author);

  return (
    <SiteChrome>
      <article className="bg-white">
        <div className="container mx-auto max-w-3xl px-4 pb-12 pt-10 md:pt-14">
          <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-steel-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><a href="/" className="hover:text-blue-600">Inicio</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
            </ol>
          </nav>

          <header className="mb-8">
            <a
              href={`/blog?categoria=${AREAS[post.area].slug}`}
              className="mb-3 inline-block rounded-md bg-electric-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-electric-600 hover:bg-electric-500/15"
            >
              {AREAS[post.area].label}
            </a>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-navy-900 md:text-4xl">{post.title}</h1>
            <p className="mb-5 text-lg leading-relaxed text-[#0b2a5e]/80">{post.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-steel-500">
              <span className="flex items-center gap-3">
                <AuthorAvatar name={post.author} size={44} />
                <span className="leading-tight">
                  <span className="block font-semibold text-navy-900">{author.name}</span>
                  <span className="block text-xs">{author.role}</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {post.readingMinutes} min de lectura
              </span>
            </div>
          </header>

          <img
            src={post.image}
            alt={post.imageAlt}
            width={1536}
            height={1024}
            decoding="async"
            className="mb-10 aspect-[3/2] w-full rounded-2xl object-cover shadow-card"
          />

          <div
            className="prose prose-slate max-w-none prose-headings:text-navy-900 prose-a:font-semibold prose-a:text-blue-600 prose-strong:text-navy-900 md:prose-lg"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {post.faq.length > 0 && (
            <section aria-labelledby="post-faq" className="mt-12">
              <h2 id="post-faq" className="mb-4 text-2xl font-bold text-navy-900">Preguntas frecuentes</h2>
              <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200">
                {post.faq.map(({ q, a }) => (
                  <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#0b2a5e]">
                      <h3 className="text-base">{q}</h3>
                      <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-600 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[#0b2a5e]/80">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {post.sources.length > 0 && (
            <section aria-labelledby="post-sources" className="mt-12">
              <h2 id="post-sources" className="mb-4 text-xl font-bold text-navy-900">Fuentes consultadas</h2>
              <ol className="space-y-2 text-sm">
                {post.sources.map((s) => (
                  <li key={s.url} className="flex gap-2">
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
                    <span>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-800">{s.title}</a>
                      {s.publisher && <span className="text-steel-500"> — {s.publisher}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <aside className="mt-12 rounded-2xl bg-[#0b2a5e]/5 p-6">
            <p className="mb-1 text-lg font-bold text-navy-900">¿Quiere aplicar esto en su empresa?</p>
            <p className="mb-5 text-sm text-[#0b2a5e]/80">Descubra en 10 minutos qué tan ordenada está su empresa y cuál es el siguiente paso, o hable con nuestro equipo.</p>
            <div className="flex flex-wrap gap-3">
              <a href={AUTODIAGNOSTICO_HASH} className={heroBtnOrange}>Hacer el autodiagnóstico gratis</a>
              <a href={whatsappUrl(`Hola, leí el artículo "${post.title}" y quisiera más información.`)} target="_blank" rel="noopener noreferrer" className={heroBtnBlue}>
                Hablar por WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-[#f5f7fb] py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 id="related-title" className="mb-8 text-2xl font-bold text-navy-900">Siga leyendo</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }} />
    </SiteChrome>
  );
};

export default BlogPost;
