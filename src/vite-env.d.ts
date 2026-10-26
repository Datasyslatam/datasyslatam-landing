/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Generado por vite-plugin-blog.ts a partir de content/blog/*.md
declare module "virtual:blog-posts" {
  import type { BlogPost, BlogPostMeta } from "@/blog/types";
  export const posts: BlogPostMeta[];
  export const loadPost: (slug: string) => Promise<BlogPost | null>;
}
