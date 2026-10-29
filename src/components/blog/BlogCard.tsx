import { Clock } from "lucide-react";
import type { BlogPostMeta } from "@/blog/types";
import { AREAS, findAuthor } from "@/blog/authors";
import { formatDate } from "@/blog/format";

export const AuthorAvatar = ({ name, size = 28 }: { name: string; size?: number }) => {
  const author = findAuthor(name);
  return author.photo ? (
    <img src={author.photo} alt="" width={size} height={size} loading="lazy" decoding="async" className="shrink-0 rounded-full object-cover ring-2 ring-white" style={{ width: size, height: size }} />
  ) : (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white" style={{ width: size, height: size }} aria-hidden="true">
      {author.short.charAt(0)}
    </span>
  );
};

/** Tarjeta de artículo del blog: portada, categoría, fecha, título, resumen, autor y tiempo de lectura. */
const BlogCard = ({ post, isNew = false }: { post: BlogPostMeta; isNew?: boolean }) => {
  const author = findAuthor(post.author);
  const href = `/blog/${post.slug}`;
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border-b-4 border-[#FF8024] bg-white shadow-[0_8px_30px_rgba(11,42,94,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(11,42,94,0.14)]">
      {isNew && (
        <span className="absolute -top-3 left-5 z-10 rounded-md bg-[#FF8024] px-3 py-1 text-xs font-semibold text-navy-900 shadow-sm">Nuevo</span>
      )}
      <a href={href} className="block overflow-hidden rounded-t-2xl" tabIndex={-1} aria-hidden="true">
        <img
          src={post.image}
          alt=""
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </a>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-wider">
          <a href={`/blog?categoria=${AREAS[post.area].slug}`} className="text-electric-600 hover:text-electric-500">
            {AREAS[post.area].label}
          </a>
          <span className="font-normal normal-case tracking-normal text-steel-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
        </p>
        <h2 className="mb-2 text-lg font-bold leading-snug text-navy-900">
          <a href={href} className="hover:text-electric-600">
            {post.title}
          </a>
        </h2>
        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-[#0b2a5e]/75">{post.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4 text-xs text-steel-500">
          <span className="flex min-w-0 items-center gap-2">
            <AuthorAvatar name={post.author} />
            <span className="truncate font-medium text-navy-800">{author.short}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingMinutes} min
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
