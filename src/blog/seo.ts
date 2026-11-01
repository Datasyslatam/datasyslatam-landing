import type { Route } from "@/routes";
import type { BlogPost } from "./types";
import { findLanding, type LandingPage } from "@/landing/pages";

export const SITE_URL = "https://datasyslatam.com";
const SITE_NAME = "DataSys Latam Group";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export const BLOG_TITLE = "Blog: ISO, transformación digital e IA para empresas";
export const BLOG_DESCRIPTION =
  "Guías prácticas sobre sistemas de gestión ISO, digitalización de procesos, software a la medida, inteligencia artificial y analítica de datos para empresas en Colombia.";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

interface PageMeta {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
  /** Medidas de la imagen al compartir; si se conocen, WhatsApp y Facebook muestran la vista previa desde el primer envío. */
  imageSize?: { width: number; height: number };
  keywords?: string[];
  type: "website" | "article";
  publishedTime?: string;
}

const renderTags = (m: PageMeta) =>
  [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    m.keywords?.length ? `<meta name="keywords" content="${esc(m.keywords.join(", "))}" />` : "",
    `<link rel="canonical" href="${esc(absolute(m.path))}" />`,
    `<meta property="og:type" content="${m.type}" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:url" content="${esc(absolute(m.path))}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${esc(absolute(m.image))}" />`,
    m.imageSize ? `<meta property="og:image:width" content="${m.imageSize.width}" />` : "",
    m.imageSize ? `<meta property="og:image:height" content="${m.imageSize.height}" />` : "",
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    m.publishedTime ? `<meta property="article:published_time" content="${m.publishedTime}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(absolute(m.image))}" />`,
    `<meta name="twitter:image:alt" content="${esc(m.imageAlt)}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

/**
 * Etiquetas de <head> propias de cada página del blog. Devuelve null en el inicio,
 * que conserva las de index.html.
 */
export const buildHead = (route: Route, post: BlogPost | null): string | null => {
  const landing = route.type === "landing" ? findLanding(route.path) : null;
  if (landing) {
    return renderTags({
      title: landing.metaTitle,
      description: landing.metaDescription,
      path: landing.path,
      image: landing.shareImage?.src ?? landing.heroImage,
      imageAlt: landing.shareImage?.alt ?? landing.heroImageAlt,
      imageSize: landing.shareImage,
      keywords: landing.metaKeywords,
      type: "website",
    });
  }
  if (route.type === "blog-index") {
    return renderTags({
      title: `${BLOG_TITLE} | ${SITE_NAME}`,
      description: BLOG_DESCRIPTION,
      path: "/blog",
      image: DEFAULT_IMAGE,
      imageAlt: `Blog de ${SITE_NAME}`,
      type: "website",
    });
  }
  if (route.type === "blog-post" && post) {
    return renderTags({
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      path: `/blog/${post.slug}`,
      image: post.image,
      imageAlt: post.imageAlt,
      type: "article",
      publishedTime: post.date,
    });
  }
  return null;
};

/** Datos estructurados del artículo: BlogPosting + migas de pan (+ FAQPage si tiene preguntas). */
export const articleJsonLd = (post: BlogPost) => {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#articulo`,
      headline: post.title,
      description: post.description,
      image: absolute(post.image),
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: "es-CO",
      keywords: post.keywords.join(", "),
      mainEntityOfPage: url,
      author: { "@type": "Person", name: post.author },
      publisher: { "@id": `${SITE_URL}/#organizacion` },
      citation: post.sources.map((s) => s.url),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
};

/** Datos estructurados de una página comercial: el servicio o el software, las migas de pan y sus preguntas frecuentes. */
export const landingJsonLd = (page: LandingPage) => {
  const url = `${SITE_URL}${page.path}`;
  const main =
    page.schema.type === "Service"
      ? {
          "@type": "Service",
          "@id": `${url}#servicio`,
          name: page.schema.name,
          serviceType: page.schema.serviceType,
          description: page.metaDescription,
          url,
          provider: { "@id": `${SITE_URL}/#organizacion` },
          areaServed: [
            { "@type": "City", name: "Barranquilla" },
            { "@type": "Country", name: "Colombia" },
            { "@type": "Place", name: "Latinoamérica" },
          ],
          ...(page.schema.offers && {
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: page.schema.name,
              itemListElement: page.schema.offers.map((o) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: o.name, description: o.description, provider: { "@id": `${SITE_URL}/#organizacion` } },
              })),
            },
          }),
        }
      : {
          "@type": "SoftwareApplication",
          "@id": `${url}#software`,
          name: page.schema.name,
          applicationCategory: page.schema.category,
          description: page.metaDescription,
          url,
          image: absolute(page.heroImage),
          publisher: { "@id": `${SITE_URL}/#organizacion` },
        };
  return {
    "@context": "https://schema.org",
    "@graph": [
      main,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: page.breadcrumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
};
