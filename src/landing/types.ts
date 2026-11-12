// Tipos de las páginas comerciales (landing pages) y textos comunes a varias de ellas.

// Respuesta común sobre el precio: el brochure establece que no hay cotizaciones estandarizadas, sino diagnóstico a la medida.
export const PRICE_ANSWER =
  "No trabajamos con cotizaciones estandarizadas: cada empresa es distinta. Tras un diagnóstico a la medida de su operación le presentamos una ruta de acción clara, con alcance, etapas y plazos, sin ningún compromiso comercial, para que invierta solo en lo que realmente le genera retorno.";

/** Iconos disponibles para tarjetas y servicios (LandingPage.tsx los traduce a íconos de lucide). */
export type LandingIcon =
  | "web"
  | "ai"
  | "software"
  | "process"
  | "automation"
  | "search"
  | "platform"
  | "integration"
  | "portal"
  | "fit"
  | "layers"
  | "checklist"
  | "user"
  | "support"
  | "growth"
  | "commercial"
  | "operations"
  | "inventory"
  | "documents"
  | "form"
  | "database"
  | "approval"
  | "dashboard"
  | "idea"
  | "finance"
  | "customers"
  | "shield"
  | "lock"
  | "eye"
  | "leaf"
  | "hardhat"
  | "continuity"
  | "education";

/** Campo adicional del formulario: lista desplegable si trae `options`; si no, texto libre. */
export interface LeadField {
  name: string;
  label: string;
  options?: string[];
  placeholder?: string;
}

export interface LandingCard {
  title: string;
  text: string;
  /** Sin ícono, la tarjeta muestra una marca de verificación. */
  icon?: LandingIcon;
  href?: string;
  linkLabel?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  city: string;
}

export type LandingSection =
  | { kind: "cards"; id: string; eyebrow?: string; title: string; intro?: string; items: LandingCard[]; note?: string }
  /** `layout: "line"` las muestra como una línea de proceso horizontal en escritorio; `flow` resume el recorrido en una franja (A → B → C). */
  | { kind: "steps"; id: string; eyebrow?: string; title: string; intro?: string; items: LandingCard[]; layout?: "line"; flow?: string[]; note?: string }
  | { kind: "chips"; id: string; eyebrow?: string; title: string; intro: string; chips: string[] }
  | { kind: "text"; id: string; eyebrow?: string; title: string; paragraphs: string[]; link?: { label: string; href: string } }
  /** Captura de pantalla del producto con sus puntos clave; `reverse` pone la imagen a la izquierda. */
  | {
      kind: "showcase";
      id: string;
      eyebrow?: string;
      title: string;
      intro?: string;
      points: string[];
      image: string;
      imageAlt: string;
      width: number;
      height: number;
      reverse?: boolean;
    }
  /** Líneas de servicio en tarjetas destacadas, cada una con sus puntos clave y un enlace a su detalle. */
  | {
      kind: "services";
      id: string;
      eyebrow?: string;
      title: string;
      intro?: string;
      /** `benefits` y `note` por tarjeta son para líneas de servicio con más detalle; se ven mejor con `wide` (dos columnas). */
      items: {
        icon: LandingIcon;
        title: string;
        text: string;
        points: string[];
        benefits?: string[];
        note?: string;
        href?: string;
        linkLabel?: string;
        /** Ancla de la tarjeta, para los accesos rápidos de `quickNav`. */
        id?: string;
        /** Rótulo corto sobre el título (p. ej. la edición de la norma). */
        badge?: string;
        /** Mensaje destacado bajo el título. */
        kicker?: string;
        /** Ocupa todo el ancho de la cuadrícula. */
        featured?: boolean;
      }[];
      wide?: boolean;
      /** Títulos de las dos listas de cada tarjeta. Por defecto, «Ejemplos» y «Beneficios». */
      pointsLabel?: string;
      benefitsLabel?: string;
      /** Accesos rápidos a cada tarjeta: pares [ancla, texto]. */
      quickNav?: [string, string][];
      /** Aclaración debajo de las tarjetas. */
      note?: string;
    }
  /** Preguntas en las que el visitante reconoce los problemas de su negocio, con un mensaje de cierre destacado. */
  /** `affirmative` muestra una marca de verificación en vez de un signo de interrogación, para listas de capacidades. */
  | { kind: "problems"; id: string; eyebrow?: string; title: string; intro?: string; questions: string[]; closing: string; affirmative?: boolean; note?: string }
  /** Comparaciones «Antes / Después» de un mismo proceso. */
  | {
      kind: "compare";
      id: string;
      eyebrow?: string;
      title: string;
      intro?: string;
      items: { icon: LandingIcon; title: string; before: string; after: string }[];
      note?: string;
    }
  /** Lista breve de beneficios con marcas de verificación. */
  | { kind: "benefits"; id: string; eyebrow?: string; title: string; intro?: string; items: string[]; note?: string }
  /** Niveles progresivos de intervención (inicial, intermedio, avanzado). */
  | {
      kind: "levels";
      id: string;
      eyebrow?: string;
      title: string;
      intro?: string;
      items: { name: string; title: string; text: string; points?: string[]; href?: string; linkLabel?: string }[];
      note?: string;
    }
  /** Detalle de una línea de servicio: qué se puede desarrollar, una imagen real y sus beneficios. */
  | {
      kind: "service";
      id: string;
      eyebrow?: string;
      title: string;
      intro: string;
      examplesTitle: string;
      examples: string[];
      benefitsTitle: string;
      benefits: string[];
      /** Aclaración sobre el alcance (p. ej. de qué dependen las capacidades de un asistente de IA). */
      note?: string;
      /** Sin imagen, el detalle ocupa una sola columna. */
      image?: string;
      imageAlt?: string;
      width?: number;
      height?: number;
      caption?: string;
      reverse?: boolean;
      link?: { label: string; href: string };
    }
  /** Franja de llamado a la acción: el botón principal lleva al formulario y el secundario a WhatsApp. `points` resume lo que recibe el visitante. */
  | { kind: "cta"; id: string; eyebrow?: string; title: string; text: string; points?: string[]; primary: string; secondary: string; footnote?: string }
  | {
      kind: "profile";
      id: string;
      eyebrow?: string;
      title: string;
      name: string;
      paragraphs: string[];
      image: string;
      imageAlt: string;
    }
  | {
      kind: "case";
      id: string;
      eyebrow?: string;
      title: string;
      name: string;
      challenge: string;
      solution: string;
      tech: string;
      result: string;
    };

export interface LandingPage {
  path: string;
  /** Etiqueta <title> (palabra clave al inicio, máximo ~60 caracteres). */
  metaTitle: string;
  metaDescription: string;
  /** Términos objetivo de la página (meta keywords). Google no los usa para posicionar; sirven de referencia y para otros buscadores. */
  metaKeywords?: string[];
  /** Imagen propia para compartir en redes (1200×630, en /public). Si falta, se comparte la foto del héroe. */
  shareImage?: { src: string; alt: string; width: number; height: number };
  eyebrow: string;
  h1: string;
  lead: string;
  /** Foto de fondo del héroe (se funde con el azul hacia el texto) y miniatura al compartir la página. */
  heroImage: string;
  /** Versión liviana de la foto del héroe para el celular (*-movil.webp). */
  heroImageMobile?: string;
  heroImageAlt: string;
  /** Punto de la foto que debe quedar a la vista al recortarla (object-position de CSS). Por defecto, el centro. */
  heroImagePosition?: string;
  /** Captura del producto sin fondo: si existe, el héroe la muestra flotando sobre un fondo difuminado en vez de la foto. */
  heroMockup?: string;
  /** Datos breves y verificables que se muestran bajo los botones del héroe. */
  heroHighlights?: string[];
  primaryCta: string;
  /** Segundo botón del héroe. Por defecto, «Hablar por WhatsApp». */
  secondaryCta?: { label: string; href: string };
  whatsappText: string;
  /** Asunto del correo cuando alguien llena el formulario de esta página. */
  leadSubject: string;
  /** Opciones de «¿Qué necesita?» en el formulario; la elegida se suma al asunto para clasificar el prospecto. */
  leadNeeds?: string[];
  /** Pregunta que acompaña a leadNeeds. Por defecto, «¿Qué necesita?». */
  leadNeedsLabel?: string;
  /** El formulario pide también el teléfono (obligatorio). */
  leadAskPhone?: boolean;
  /** Texto del botón de envío del formulario. Por defecto, «Solicitar asesoría». */
  leadSubmitLabel?: string;
  /** Título y texto junto al formulario. Por defecto, «¿Tiene en mente un desafío tecnológico?». */
  leadTitle?: string;
  leadText?: string;
  /** Campos obligatorios adicionales del formulario. */
  leadFields?: LeadField[];
  breadcrumb: string;
  schema:
    | { type: "Service"; name: string; serviceType: string; offers?: { name: string; description: string }[] }
    | { type: "SoftwareApplication"; name: string; category: string };
  sections: LandingSection[];
  /** Solo testimonios reales y autorizados por el cliente. Vacío = la sección no se muestra. */
  testimonials: Testimonial[];
  faq: { q: string; a: string }[];
  related: { label: string; href: string }[];
}
