export interface BlogSource {
  title: string;
  url: string;
  publisher?: string;
}

export interface BlogFaq {
  q: string;
  a: string;
}

/** Datos de un artículo que se usan en el listado (sin el cuerpo). */
export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** Fecha de publicación, AAAA-MM-DD. */
  date: string;
  updated?: string;
  author: string;
  keywords: string[];
  /** Ruta pública de la portada, p. ej. /blog/mi-articulo.webp */
  image: string;
  imageAlt: string;
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  /** Cuerpo ya convertido de Markdown a HTML en el build. */
  html: string;
  faq: BlogFaq[];
  sources: BlogSource[];
}
