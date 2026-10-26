import { ArrowRight } from "lucide-react";
import { posts } from "virtual:blog-posts";
import SiteChrome from "@/components/SiteChrome";
import { heroBtnOrange } from "@/components/heroButtons";
import { AUTODIAGNOSTICO_HASH } from "@/components/autodiagnostico/data";
import { BLOG_DESCRIPTION } from "@/blog/seo";
import { formatDate } from "@/blog/format";

const BlogIndex = () => (
  <SiteChrome>
    <section className="bg-[#f5f7fb] py-14 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Blog</p>
        <h1 className="mb-3 max-w-3xl text-3xl font-bold text-navy-900 md:text-4xl">
          Ideas para ordenar, automatizar y hacer crecer su empresa
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#0b2a5e]/80">{BLOG_DESCRIPTION}</p>
      </div>
    </section>

    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 p-8 text-center">
            <p className="mb-2 text-lg font-bold text-navy-900">Muy pronto publicaremos nuestros primeros artículos.</p>
            <p className="mb-6 text-sm text-[#0b2a5e]/75">Mientras tanto, descubra en 10 minutos qué tan ordenada está su empresa.</p>
            <a href={AUTODIAGNOSTICO_HASH} className={heroBtnOrange}>Hacer el autodiagnóstico gratis</a>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <a href={`/blog/${post.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
                    <img
                      src={post.image}
                      alt=""
                      width={1536}
                      height={1024}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-2 text-xs text-steel-500">
                      <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min de lectura
                    </p>
                    <h2 className="mb-2 text-lg font-bold leading-snug text-navy-900">
                      <a href={`/blog/${post.slug}`} className="hover:text-blue-600">{post.title}</a>
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-[#0b2a5e]/75">{post.description}</p>
                    <a href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800">
                      Leer artículo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  </SiteChrome>
);

export default BlogIndex;
