// Páginas comerciales (landing pages) orientadas a palabras clave de compra. Cada una genera su HTML prerenderizado,
// sus metadatos, sus datos estructurados (Service o SoftwareApplication, migas de pan y FAQPage) y entra al sitemap.
// Todo el contenido sale de información ya publicada en el sitio: no se inventan cifras, clientes ni testimonios.
import fundador from "@/assets/consultoria-fundador.webp";
import fundadorMovil from "@/assets/consultoria-fundador-movil.webp";
import desarrolloSoftwareHeroMovil from "@/assets/banners/desarrollo-software-hero-movil.webp";
import digitalizacionProcesosHeroMovil from "@/assets/banners/digitalizacion-procesos-hero-movil.webp";
import analiticaDatosHeroMovil from "@/assets/banners/analitica-datos-hero-movil.webp";
import inteligenciaMovil from "@/assets/banners/inteligencia-artificial-hero-movil.webp";
import transformacionMovil from "@/assets/banners/transformacion-corporativo-movil.webp";
import redesMovil from "@/assets/hero-evolucion-digital-movil.webp";
import desarrolloSoftwareHero from "@/assets/banners/desarrollo-software-hero.webp";
import asistenteNovaMovil from "@/assets/banners/asistente-nova-movil.webp";
import digitalizacionProcesosHero from "@/assets/banners/digitalizacion-procesos-hero.webp";
import analiticaDatosHero from "@/assets/banners/analitica-datos-hero.webp";
import analiticaDashboardEjecutivo from "@/assets/banners/analitica-dashboard-ejecutivo.webp";
import inteligencia from "@/assets/banners/inteligencia-artificial-hero.webp";
import tecnologia from "@/assets/banners/tecnologia-corporativo.webp";
import gestion from "@/assets/banners/gestion-corporativo.webp";
import transformacion from "@/assets/banners/transformacion-corporativo.webp";
import redes from "@/assets/hero-evolucion-digital.webp";
import novixDashboard from "@/assets/novix/novix-dashboard.webp";
import novixEquiposSinFondo from "@/assets/novix/novix-equipos-sin-fondo.webp";
import novixPlanCuentas from "@/assets/novix/novix-plan-cuentas.webp";
import novixRoles from "@/assets/novix/novix-roles.webp";
import governexDashboard from "@/assets/governex/governex-dashboard.webp";
import appGovernexSinFondo from "@/assets/banners/app-governex-sin-fondo.webp";
import governexMapaProcesos from "@/assets/governex/governex-mapa-procesos.webp";
import governexRiesgos from "@/assets/governex/governex-riesgos.webp";
import governexRoles from "@/assets/governex/governex-roles.webp";

// Respuesta común sobre el precio: el brochure establece que no hay cotizaciones estandarizadas, sino diagnóstico a la medida.
const PRICE_ANSWER =
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

export const LANDING_PAGES: LandingPage[] = [
  {
    path: "/servicios/consultoria-iso-9001",
    metaTitle: "Consultoría ISO para pymes en Colombia | DataSys Latam",
    metaDescription:
      "Consultoría e implementación de normas ISO 9001, 14001, 45001, 27001, 22301 y 21001 para pymes en Barranquilla, Colombia y LATAM. Solicite su diagnóstico.",
    metaKeywords: [
      "consultoría ISO para pymes",
      "consultoría en sistemas de gestión",
      "implementación ISO 9001",
      "consultoría ISO 14001",
      "implementación ISO 45001",
      "consultoría ISO 27001",
      "implementación ISO 22301",
      "consultoría ISO 21001",
      "sistemas integrados de gestión",
      "estandarización de procesos empresariales",
      "consultoría de calidad para empresas",
      "asesoría para certificación ISO",
      "implementación de normas ISO en Colombia",
      "implementación de normas ISO en Barranquilla",
      "implementación de normas ISO en Latinoamérica",
      "consultoría de normas ISO en Colombia",
      "consultoría de normas ISO en Barranquilla",
    ],
    shareImage: {
      src: "/og-consultoria-iso.jpg",
      alt: "DataSys Latam Group: consultoría en normas ISO para pymes de Barranquilla, Colombia y Latinoamérica",
      width: 1200,
      height: 630,
    },
    eyebrow: "Consultoría en normas ISO para pymes",
    h1: "Estandarice sus procesos. Fortalezca su empresa",
    lead: "Implementamos y fortalecemos sistemas de gestión ISO para ayudarle a organizar sus procesos, gestionar riesgos, mejorar la calidad y construir una empresa más eficiente, confiable y preparada para crecer.",
    heroImage: fundador,
    heroImageMobile: fundadorMovil,
    heroImageAlt: "Armando José López González, consultor de DataSys Latam Group, dictando una capacitación sobre sistemas de gestión ISO",
    heroHighlights: ["Estandarizamos sus procesos", "Gestionamos controles y responsabilidades", "Mejoramos su desempeño", "Digitalizamos su sistema"],
    primaryCta: "Solicitar diagnóstico ISO",
    secondaryCta: { label: "Conocer nuestras normas ISO", href: "#normas-iso" },
    whatsappText: "Hola, me interesa la consultoría en normas ISO para mi empresa.",
    leadSubject: "Nuevo lead: Consultoría ISO (sitio web)",
    leadNeedsLabel: "Norma ISO de interés",
    leadNeeds: [
      "ISO 9001 – Calidad",
      "ISO 14001 – Gestión ambiental",
      "ISO 45001 – Seguridad y salud en el trabajo",
      "ISO/IEC 27001 – Seguridad de la información",
      "ISO 22301 – Continuidad del negocio",
      "ISO 21001 – Organizaciones educativas",
      "Sistema integrado de gestión",
      "No estoy seguro, necesito asesoría",
    ],
    leadFields: [
      { name: "sector", label: "Sector económico", placeholder: "Ej.: manufactura, salud, educación, servicios" },
      {
        name: "estado",
        label: "Estado actual del sistema de gestión",
        options: [
          "No tenemos un sistema de gestión implementado",
          "Tenemos procesos documentados, pero no un sistema estructurado",
          "Estamos implementando una norma ISO",
          "Ya estamos certificados y necesitamos mejorar",
          "Necesitamos prepararnos para una auditoría",
          "Queremos integrar varias normas",
        ],
      },
    ],
    leadAskPhone: true,
    leadSubmitLabel: "Solicitar diagnóstico ISO",
    leadTitle: "Solicite su diagnóstico ISO",
    leadText: "Cuéntenos en qué punto está su empresa. Le contactamos para conocer su operación y, después, le presentamos una propuesta con el alcance, las etapas y los plazos, sin compromiso.",
    breadcrumb: "Consultoría ISO",
    schema: {
      type: "Service",
      name: "Consultoría en sistemas de gestión ISO",
      serviceType: "Consultoría e implementación de normas ISO",
      offers: [
        { name: "Consultoría ISO 9001", description: "Implementación y mejora de sistemas de gestión de la calidad." },
        { name: "Consultoría ISO 14001", description: "Implementación y mejora de sistemas de gestión ambiental." },
        { name: "Consultoría ISO 45001", description: "Implementación y mejora de sistemas de gestión de seguridad y salud en el trabajo." },
        { name: "Consultoría ISO/IEC 27001", description: "Implementación y mejora de sistemas de gestión de seguridad de la información." },
        { name: "Consultoría ISO 22301", description: "Implementación y mejora de sistemas de gestión de continuidad del negocio." },
        { name: "Consultoría ISO 21001", description: "Implementación y mejora de sistemas de gestión para organizaciones educativas." },
      ],
    },
    sections: [
      {
        kind: "problems",
        id: "organizar-procesos",
        eyebrow: "¿Le suena familiar?",
        title: "¿Su empresa necesita organizar y estandarizar sus procesos?",
        questions: [
          "¿Sus colaboradores realizan las mismas actividades de diferentes maneras?",
          "¿Los procesos dependen demasiado del conocimiento de determinadas personas?",
          "¿Tiene dificultades para controlar los documentos y registros?",
          "¿No cuenta con indicadores para evaluar el desempeño de sus procesos?",
          "¿Se presentan errores o reprocesos que podrían prevenirse?",
          "¿Le cuesta identificar y gestionar los riesgos de su operación?",
          "¿Necesita mejorar la satisfacción de sus clientes?",
          "¿Su empresa requiere fortalecer sus prácticas ambientales?",
          "¿Necesita organizar la gestión de seguridad y salud en el trabajo?",
          "¿Tiene que prepararse para una auditoría o certificación ISO?",
        ],
        closing: "Una empresa organizada no depende de la improvisación. Trabaja con procesos definidos, responsabilidades claras y mecanismos de control.",
      },
      {
        kind: "cta",
        id: "diagnostico",
        eyebrow: "El primer paso",
        title: "Todo empieza con un diagnóstico ISO",
        text: "Revisamos cómo opera hoy su empresa frente a los requisitos de la norma que le interesa. Si aún no sabe cuál necesita, le ayudamos a identificarla.",
        points: [
          "Estado actual de sus procesos frente a la norma",
          "Brechas y prioridades identificadas",
          "Propuesta con alcance, etapas y plazos",
          "Sin compromiso comercial",
        ],
        primary: "Solicitar diagnóstico ISO",
        secondary: "Hablar con un consultor",
      },
      {
        kind: "cards",
        id: "propuesta",
        eyebrow: "Nuestra propuesta",
        title: "Estandarizamos sus procesos para fortalecer la gestión y el crecimiento de su empresa",
        intro: "Acompañamos a las pymes en la implementación, el mantenimiento y la mejora de sistemas de gestión basados en normas ISO, con soluciones adaptadas a la realidad de cada organización.",
        items: [
          { icon: "process", title: "Gestión", text: "Organización, estandarización y control de los procesos." },
          { icon: "checklist", title: "Cumplimiento", text: "Identificación y gestión de los requisitos aplicables a su organización." },
          { icon: "growth", title: "Mejora", text: "Seguimiento del desempeño, análisis de resultados y mejora continua." },
        ],
        note: "No vendemos manuales, procedimientos ni formatos: le acompañamos a construir un sistema de gestión que se pueda aplicar y mantener en la operación diaria.",
      },
      {
        kind: "services",
        id: "normas-iso",
        eyebrow: "Normas ISO que implementamos",
        title: "Seis líneas de consultoría especializada",
        intro: "Elija la norma que le interesa. Si necesita más de una, las integramos en un solo sistema de gestión.",
        wide: true,
        pointsLabel: "Le ayuda a",
        benefitsLabel: "Ejemplos de aplicación",
        quickNav: [
          ["iso-9001", "ISO 9001 · Calidad"],
          ["iso-14001", "ISO 14001 · Ambiental"],
          ["iso-45001", "ISO 45001 · Seguridad y salud"],
          ["iso-27001", "ISO/IEC 27001 · Información"],
          ["iso-22301", "ISO 22301 · Continuidad"],
          ["iso-21001", "ISO 21001 · Educación"],
        ],
        items: [
          {
            id: "iso-9001",
            featured: true,
            icon: "checklist",
            badge: "ISO 9001:2026",
            title: "ISO 9001: Sistema de Gestión de la Calidad",
            kicker: "Calidad en sus procesos, confianza en sus clientes",
            text: "Busca que su organización entregue de manera consistente productos y servicios que cumplan lo que sus clientes esperan. Es aplicable a organizaciones de diferentes tamaños y sectores.",
            points: [
              "Estandarizar sus procesos",
              "Definir responsabilidades y controles",
              "Mejorar la gestión de productos y servicios",
              "Identificar riesgos y oportunidades",
              "Gestionar las necesidades y expectativas de los clientes",
              "Medir el desempeño mediante indicadores",
              "Gestionar no conformidades y acciones correctivas",
              "Promover la mejora continua",
            ],
            benefits: [
              "Empresas de servicios que unifican su forma de atender",
              "Fabricantes que controlan la calidad de sus productos",
              "Proveedores cuyos clientes piden un sistema de calidad",
            ],
          },
          {
            id: "iso-14001",
            icon: "leaf",
            badge: "ISO 14001:2026",
            title: "ISO 14001: Sistema de Gestión Ambiental",
            kicker: "Gestione su impacto ambiental de manera responsable",
            text: "Busca que su organización conozca y gestione la forma en que sus actividades afectan el ambiente.",
            points: [
              "Identificar aspectos e impactos ambientales",
              "Gestionar riesgos y oportunidades ambientales",
              "Establecer controles operacionales",
              "Mejorar el uso de recursos",
              "Gestionar residuos y prácticas ambientales",
              "Evaluar el cumplimiento de obligaciones ambientales",
              "Establecer objetivos de desempeño ambiental",
            ],
            benefits: [
              "Plantas con vertimientos, emisiones o residuos",
              "Empresas de logística y construcción",
              "Proveedores con exigencias ambientales de sus clientes",
            ],
          },
          {
            id: "iso-45001",
            icon: "hardhat",
            badge: "ISO 45001:2018",
            title: "ISO 45001: Seguridad y Salud en el Trabajo",
            kicker: "Fortalezca la seguridad y la salud en su entorno laboral",
            text: "Busca prevenir lesiones y deterioro de la salud relacionados con el trabajo.",
            points: [
              "Identificar peligros y evaluar riesgos laborales",
              "Establecer controles preventivos",
              "Promover la participación de los trabajadores",
              "Fortalecer la cultura preventiva",
              "Gestionar incidentes y oportunidades de mejora",
              "Establecer objetivos de seguridad y salud",
              "Evaluar el desempeño del sistema",
            ],
            benefits: [
              "Empresas con trabajo en planta, obra o en campo",
              "Empresas que quieren ir más allá del SG-SST",
              "Proveedores de sectores con altas exigencias",
            ],
            note: "En Colombia, el SG-SST del Decreto 1072 de 2015 y los estándares mínimos de la Resolución 0312 de 2019 son obligaciones legales. ISO 45001 es voluntaria y no las sustituye: implementarla no exime de cumplirlas.",
          },
          {
            id: "iso-27001",
            icon: "lock",
            badge: "ISO/IEC 27001:2022",
            title: "ISO/IEC 27001: Seguridad de la Información",
            kicker: "Proteja la información que mantiene su empresa en funcionamiento",
            text: "Busca proteger la confidencialidad, la integridad y la disponibilidad de la información.",
            points: [
              "Identificar riesgos de seguridad de la información",
              "Establecer políticas y controles de seguridad",
              "Gestionar accesos y responsabilidades",
              "Fortalecer la gestión de incidentes",
              "Mejorar la protección de la información empresarial",
              "Gestionar riesgos de proveedores y servicios tecnológicos",
              "Promover una cultura de seguridad",
            ],
            benefits: [
              "Empresas de tecnología y servicios digitales",
              "Organizaciones que manejan datos de sus clientes",
              "Proveedores a los que se les exigen controles de seguridad",
            ],
            note: "Implementar un sistema de gestión no elimina todos los riesgos ni garantiza inmunidad frente a incidentes de seguridad.",
          },
          {
            id: "iso-22301",
            icon: "continuity",
            badge: "ISO 22301:2019",
            title: "ISO 22301: Continuidad del Negocio",
            kicker: "Prepare su empresa para continuar operando ante situaciones inesperadas",
            text: "Busca que su empresa esté preparada para responder a los eventos que pueden interrumpir sus operaciones.",
            points: [
              "Identificar actividades y procesos críticos",
              "Analizar el impacto de las interrupciones",
              "Evaluar riesgos para la continuidad",
              "Definir estrategias de continuidad",
              "Establecer planes de continuidad del negocio",
              "Preparar procedimientos de respuesta y recuperación",
              "Realizar ejercicios y pruebas",
            ],
            benefits: [
              "Empresas que no pueden detener su servicio",
              "Operaciones que dependen de sistemas o de un solo proveedor",
              "Organizaciones expuestas a eventos naturales o fallas",
            ],
          },
          {
            id: "iso-21001",
            icon: "education",
            badge: "ISO 21001:2025",
            title: "ISO 21001: Organizaciones Educativas",
            kicker: "Fortalezca la gestión y la calidad de los servicios educativos",
            text: "Busca que las organizaciones educativas respondan mejor a las necesidades de sus estudiantes y de otras partes interesadas.",
            points: [
              "Organizar los procesos institucionales",
              "Identificar necesidades de estudiantes y partes interesadas",
              "Mejorar la prestación de servicios educativos",
              "Establecer mecanismos de evaluación",
              "Gestionar recursos y competencias",
              "Dar seguimiento a los resultados educativos",
              "Promover la mejora continua",
            ],
            benefits: [
              "Colegios",
              "Instituciones de formación",
              "Centros de capacitación",
            ],
          },
        ],
        note: "Ediciones vigentes a noviembre de 2026. ISO 45001, ISO/IEC 27001 e ISO 22301 se aplican junto con su enmienda de 2024 sobre cambio climático.",
      },
      {
        kind: "text",
        id: "ediciones-vigentes",
        eyebrow: "Nuevas ediciones",
        title: "ISO 9001:2026, ISO 14001:2026 e ISO 21001:2025: implementación y transición",
        paragraphs: [
          "ISO publicó en septiembre de 2026 la ISO 9001:2026, en abril de 2026 la ISO 14001:2026 y en 2025 la ISO 21001:2025. Si su empresa empieza ahora, implementamos directamente la edición vigente para que no tenga que hacerlo dos veces.",
          "Si ya está certificada en una edición anterior, le ayudamos a planear la transición dentro del plazo que defina su organismo certificador, enfocándonos en los cambios que más valor aportan a su operación.",
        ],
        link: { label: "Lea: ISO 9001 para pymes, por dónde empezar", href: "/blog/iso-9001-pymes-colombia-por-donde-empezar" },
      },
      {
        kind: "benefits",
        id: "que-logra",
        eyebrow: "Beneficios",
        title: "¿Qué logra su empresa al implementar un sistema de gestión ISO?",
        items: [
          "Procesos definidos y estandarizados",
          "Responsabilidades claramente establecidas",
          "Mayor control de las operaciones",
          "Documentación organizada",
          "Mejor gestión de riesgos",
          "Indicadores para evaluar resultados",
          "Identificación de oportunidades de mejora",
          "Mayor trazabilidad de las actividades",
          "Más confianza de clientes y partes interesadas",
          "Mejor preparación para auditorías",
          "Una cultura de mejora continua",
        ],
        note: "Los beneficios dependen del compromiso de la dirección, de la participación de los colaboradores y de la aplicación real del sistema de gestión.",
      },
      {
        kind: "steps",
        id: "metodologia",
        eyebrow: "Cómo trabajamos",
        title: "Nuestra metodología de consultoría",
        intro: "Desde Barranquilla acompañamos a empresas de Colombia y Latinoamérica en seis etapas:",
        layout: "line",
        items: [
          { title: "Diagnóstico organizacional", text: "Analizamos el estado de su empresa, sus procesos, sus necesidades y su nivel de cumplimiento frente a la norma." },
          { title: "Planificación del sistema", text: "Definimos el alcance, los objetivos, las actividades, los responsables y el plan de implementación." },
          { title: "Diseño y estandarización", text: "Identificamos procesos, responsabilidades, interacciones, controles y la documentación necesaria." },
          { title: "Implementación y apropiación", text: "Acompañamos a sus equipos en la aplicación de los procedimientos, controles y herramientas." },
          { title: "Evaluación y auditoría interna", text: "Apoyamos la evaluación de los requisitos, la identificación de hallazgos y las acciones de mejora." },
          { title: "Preparación y mejora continua", text: "Le acompañamos en la preparación para la auditoría externa y en el fortalecimiento del sistema." },
        ],
        note: "La auditoría de certificación y la decisión de otorgar el certificado corresponden a un organismo certificador independiente y competente.",
      },
      {
        kind: "text",
        id: "consultoria-y-certificacion",
        eyebrow: "Una diferencia importante",
        title: "Consultoría y certificación son servicios distintos",
        paragraphs: [
          "DataSys Latam Group presta consultoría: le ayudamos a implementar, mantener y mejorar su sistema de gestión, y a prepararse para la auditoría. No emitimos certificados ni garantizamos el resultado de una certificación.",
          "La certificación es una evaluación independiente que realiza un organismo certificador competente. En Colombia le recomendamos verificar que esté acreditado ante ONAC, y le acompañamos en esa elección.",
        ],
      },
      {
        kind: "benefits",
        id: "adaptada-a-pymes",
        eyebrow: "Consultoría ISO adaptada a las pymes",
        title: "Implementar una norma ISO no tiene que convertirse en una carga para su empresa",
        intro: "Una pyme puede avanzar progresivamente hacia un sistema de gestión organizado y sostenible. Adaptamos el alcance y la metodología de trabajo a:",
        items: [
          "El tamaño de su organización",
          "Su actividad económica",
          "El número de procesos",
          "La complejidad de sus operaciones",
          "Los recursos disponibles",
          "Sus riesgos y necesidades",
          "Sus objetivos empresariales",
        ],
        note: "La documentación debe ser proporcional a la naturaleza y la complejidad de sus procesos. No proponemos estructuras documentales extensas ni burocráticas.",
      },
      {
        kind: "service",
        id: "sistemas-integrados",
        eyebrow: "Sistemas integrados de gestión",
        title: "Varias normas ISO, un solo sistema de gestión",
        intro: "Algunas organizaciones implementan más de una norma mediante un Sistema Integrado de Gestión (SIG), que aprovecha lo que las normas tienen en común.",
        examplesTitle: "Ejemplos de integración",
        examples: [
          "ISO 9001 + ISO 14001",
          "ISO 9001 + ISO 45001",
          "ISO 9001 + ISO/IEC 27001",
          "ISO 9001 + ISO 14001 + ISO 45001",
          "Varias normas, según las necesidades de su organización",
        ],
        note: "Las normas no tienen exactamente los mismos requisitos: la integración debe considerar los requisitos particulares de cada una.",
        benefitsTitle: "Beneficios de integrar sus sistemas de gestión",
        benefits: [
          "Procesos comunes y mejor organizados",
          "Menos duplicidad documental",
          "Gestión coordinada de riesgos",
          "Auditorías internas integradas, cuando corresponde",
          "Indicadores y objetivos articulados",
          "Mejor aprovechamiento de los recursos",
        ],
      },
      {
        kind: "service",
        id: "digitalizacion",
        eyebrow: "Digitalización y tecnología",
        title: "No solo le ayudamos a estructurar su sistema de gestión. También podemos ayudarle a digitalizar su operación",
        intro: "Unimos gestión de calidad, tecnología y transformación digital. Elegimos las herramientas según lo que su sistema necesita.",
        examplesTitle: "Lo que las herramientas digitales pueden facilitar",
        examples: [
          "Gestión documental",
          "Control de versiones",
          "Seguimiento de procesos",
          "Gestión de riesgos",
          "Registro de no conformidades",
          "Seguimiento de acciones correctivas",
          "Control de indicadores",
          "Gestión de auditorías",
          "Consulta de información",
          "Seguimiento de objetivos y planes de mejora",
        ],
        benefitsTitle: "Governex, nuestra plataforma para sistemas de gestión de calidad, incluye",
        benefits: [
          "Mapa de procesos y caracterizaciones",
          "Matriz de riesgos y oportunidades",
          "Listado maestro de documentos",
          "Programa de auditorías y hallazgos",
          "No conformidades y acciones de mejora",
          "Indicadores y revisión por la dirección",
        ],
        image: governexDashboard,
        imageAlt: "Resumen ejecutivo de un sistema de gestión de calidad en Governex con indicadores, cumplimiento por proceso y mapa de riesgos",
        width: 1892,
        height: 921,
        caption: "Governex está orientada a sistemas de gestión de calidad con ISO 9001. Para otras normas, evaluamos la herramienta adecuada en cada proyecto.",
        link: { label: "Conozca Governex", href: "/producto/governex" },
      },
      {
        kind: "levels",
        id: "tres-niveles",
        eyebrow: "Una oferta que crece con usted",
        title: "De la consultoría a la gestión con datos",
        intro: "No solo le acompañamos a implementar su sistema de gestión: también podemos ayudarle a digitalizarlo y a aprovechar la información que genera.",
        items: [
          { name: "Consultoría", title: "Implementación de normas ISO", text: "Estandarice y fortalezca la gestión de su empresa." },
          { name: "Tecnología", title: "Governex", text: "Digitalice y controle su sistema de gestión de calidad.", href: "/producto/governex", linkLabel: "Ver Governex" },
          { name: "Evolución", title: "Analítica e inteligencia artificial", text: "Aproveche la información para mejorar el seguimiento y las decisiones.", href: "/servicios/analitica-de-datos", linkLabel: "Ver analítica de datos" },
        ],
      },
      {
        kind: "profile",
        id: "quien-lidera",
        eyebrow: "Quién lidera la consultoría",
        title: "Experiencia en sistemas de gestión y formación",
        name: "Armando José López González",
        paragraphs: [
          "Ingeniero industrial, magíster en Gerencia de Empresas y especialista en Gerencia del Talento Humano, con 26 años de experiencia en ingeniería, implementación y gestión de sistemas de gestión y formación profesional.",
          "Desde 2016 se desempeña como profesional en educación de ICONTEC y es conferencista del posgrado en Gerencia de la Calidad de la Universidad del Norte (Uninorte).",
        ],
        image: fundador,
        imageAlt: "Armando José López González durante una capacitación sobre certificación ISO",
      },
      {
        kind: "cards",
        id: "por-que-datasys",
        eyebrow: "Por qué DataSys",
        title: "¿Por qué elegir a DataSys Latam Group?",
        intro: "Comprendemos tanto los requisitos de las normas como las necesidades operativas de las empresas.",
        items: [
          { icon: "fit", title: "Necesidades reales de las pymes", text: "Una consultoría a la medida de su tamaño, no una plantilla." },
          { icon: "process", title: "Enfoque en procesos", text: "Estandarizamos procesos y responsabilidades para que el sistema funcione en el día a día." },
          { icon: "layers", title: "Calidad, tecnología y transformación digital", text: "Integramos la gestión con las herramientas que la facilitan." },
          { icon: "support", title: "Acompañamiento en la implementación", text: "Trabajamos con su equipo para que el sistema funcione sin depender del consultor." },
          { icon: "checklist", title: "Preparación para auditorías", text: "Apoyamos la auditoría interna y la preparación para la auditoría externa." },
          { icon: "growth", title: "Mejora continua y digitalización", text: "Su sistema puede seguir mejorando y digitalizarse cuando lo necesite." },
        ],
      },
      {
        kind: "cta",
        id: "siguiente-paso",
        title: "Es momento de fortalecer la gestión de su empresa",
        text: "Identifiquemos qué sistema de gestión necesita su organización y cómo podemos ayudarle a estandarizar sus procesos, gestionar sus riesgos y mejorar su desempeño. En DataSys le acompañamos en el camino hacia una gestión empresarial más organizada y eficiente.",
        primary: "Solicitar diagnóstico ISO",
        secondary: "Hablar con un consultor",
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es una norma ISO y para qué sirve?",
        a: "Es un estándar internacional que recoge buenas prácticas para gestionar un tema, como la calidad, el ambiente o la seguridad de la información. Sirve para organizar los procesos, definir controles y mejorar de forma ordenada.",
      },
      {
        q: "¿Qué norma ISO necesita mi empresa?",
        a: "Depende de su actividad, de sus riesgos y de lo que le exigen sus clientes. ISO 9001 suele ser el punto de partida, pero no siempre es la prioridad. En el diagnóstico le ayudamos a identificar la que más le conviene.",
      },
      {
        q: "¿Una pyme puede implementar una norma ISO?",
        a: "Sí. Las normas ISO de sistemas de gestión se aplican a organizaciones de diferentes tamaños. Adaptamos el alcance y la documentación a su empresa para que el sistema sea útil y sostenible.",
      },
      {
        q: "¿Cuál es la diferencia entre implementar y certificar un sistema de gestión?",
        a: "Implementar es poner el sistema en funcionamiento en su empresa. Certificar es que un organismo independiente audite ese sistema y decida si cumple la norma. Puede implementar una norma sin certificarse.",
      },
      {
        q: "¿Cuánto tiempo puede tomar implementar una norma ISO?",
        a: "Depende del tamaño de su empresa, del alcance, de la complejidad de sus procesos y de su estado inicial. Después del diagnóstico le presentamos un plan con etapas y plazos para su caso.",
      },
      {
        q: "¿Es posible implementar varias normas ISO al mismo tiempo?",
        a: "Sí, mediante un sistema integrado de gestión que aprovecha los procesos comunes. Evaluamos con usted si conviene hacerlo a la vez o por etapas, y atendemos los requisitos particulares de cada norma.",
      },
      {
        q: "¿Qué documentos necesita una empresa para implementar ISO 9001?",
        a: "La norma pide información documentada como el alcance del sistema, la política y los objetivos de calidad, además de los registros que evidencian la operación. No hay una cantidad fija: depende de la naturaleza y la complejidad de sus procesos.",
      },
      {
        q: "¿Es obligatorio contratar una consultoría para implementar una norma ISO?",
        a: "No. Una empresa puede hacerlo con su propio equipo. La consultoría aporta experiencia y método para ahorrar reprocesos, y trabajamos para que el sistema funcione sin depender del consultor.",
      },
      {
        q: "¿Qué sucede durante una auditoría de certificación?",
        a: "Un organismo certificador revisa la documentación y la preparación de su sistema, y luego evalúa cómo funciona en la operación. Si encuentra no conformidades, su empresa debe atenderlas. Con esa evidencia, el organismo decide si otorga el certificado.",
      },
      {
        q: "¿DataSys entrega el certificado ISO?",
        a: "No. El certificado lo otorga un organismo de certificación independiente; le recomendamos verificar que esté acreditado ante ONAC. Nosotros le acompañamos para llegar preparado a esa auditoría, sin garantizar el resultado.",
      },
      {
        q: "¿Cómo se mantienen y mejoran los sistemas de gestión después de la certificación?",
        a: "Con auditorías internas, revisión por la dirección, seguimiento de indicadores y acciones de mejora. Además, el organismo certificador realiza auditorías periódicas de seguimiento y de renovación.",
      },
      {
        q: "¿Es posible digitalizar la documentación y los procesos del sistema de gestión?",
        a: "Sí. Puede llevar procesos, riesgos, auditorías, no conformidades e indicadores a herramientas digitales. Para sistemas de calidad contamos con Governex, nuestra plataforma, y para otras necesidades evaluamos la herramienta adecuada.",
      },
      {
        q: "¿Implementan la edición vigente de cada norma?",
        a: "Sí. Si su empresa empieza ahora, implementamos la edición vigente, como ISO 9001:2026 o ISO 14001:2026. Si ya está certificada en una edición anterior, le ayudamos a planear la transición con su organismo certificador.",
      },
      {
        q: "¿Es obligatorio certificarse en ISO 9001 en Colombia?",
        a: "No, la certificación es voluntaria. Se vuelve indispensable cuando un cliente privado la exige como condición para comprarle. En la contratación estatal, la Ley 1150 de 2007 establece que las certificaciones de calidad no pueden exigirse como requisito habilitante ni dar puntaje.",
      },
      { q: "¿Cuánto cuesta la consultoría ISO?", a: PRICE_ANSWER },
    ],
    related: [
      { label: "Haga el autodiagnóstico gratuito de 10 minutos", href: "/#autodiagnostico" },
      { label: "Governex: software para sistemas de gestión de calidad", href: "/producto/governex" },
      { label: "Digitalización de procesos para pymes", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Analítica de datos para empresas", href: "/servicios/analitica-de-datos" },
      { label: "Inteligencia artificial para empresas", href: "/servicios/inteligencia-artificial-empresas" },
      { label: "Proveedores certificados ISO 9001: por qué los exigen", href: "/blog/proveedores-certificados-iso-9001-exigencias" },
      { label: "Documentar procesos sin llenarse de papeles", href: "/blog/documentar-procesos-empresa-sin-papeles" },
    ],
  },
  {
    path: "/servicios/desarrollo-software-medida",
    metaTitle: "Desarrollo de software a la medida, apps web e IA | DataSys",
    metaDescription:
      "Desarrollo de software a la medida, aplicaciones web y asistentes de IA para empresas en Colombia y Latinoamérica. Cuéntenos su idea y solicite una asesoría.",
    metaKeywords: [
      "desarrollo de software a la medida",
      "desarrollo de aplicaciones web",
      "diseño de aplicaciones web empresariales",
      "desarrollo de software empresarial",
      "desarrollo de asistentes de inteligencia artificial",
      "asistentes de IA para empresas",
      "automatización de procesos empresariales",
      "soluciones tecnológicas empresariales",
      "desarrollo de sistemas de información",
      "integración de inteligencia artificial en empresas",
    ],
    shareImage: {
      src: "/og-desarrollo-software.jpg",
      alt: "DataSys Latam Group: aplicaciones web, asistentes de inteligencia artificial y software a la medida para empresas",
      width: 1200,
      height: 630,
    },
    eyebrow: "Software a la medida, aplicaciones web e IA",
    h1: "Creamos soluciones digitales que hacen evolucionar su empresa",
    lead: "Desde aplicaciones web hasta asistentes de inteligencia artificial y software a la medida: creamos soluciones digitales que conectan sus procesos, optimizan su operación y convierten sus ideas en herramientas funcionales.",
    heroImage: desarrolloSoftwareHero,
    heroImageMobile: desarrolloSoftwareHeroMovil,
    heroImageAlt: "Equipo de desarrollo de software trabajando en código, con un tablero de proyecto en pantalla y diagramas de arquitectura en la pizarra",
    heroImagePosition: "65% center",
    heroHighlights: ["Aplicaciones web", "Asistentes de IA", "Software a la medida"],
    primaryCta: "Solicitar asesoría",
    secondaryCta: { label: "Conocer nuestros servicios", href: "#nuestros-servicios" },
    whatsappText: "Hola, quiero asesoría para desarrollar una solución tecnológica para mi empresa.",
    leadSubject: "Nuevo lead: Desarrollo de software a la medida (sitio web)",
    leadNeeds: ["Aplicación web", "Asistente de IA", "Software a la medida", "Aún no lo sé"],
    breadcrumb: "Desarrollo de software a la medida",
    schema: {
      type: "Service",
      name: "Desarrollo de software a la medida para empresas",
      serviceType: "Desarrollo de software a la medida",
      offers: [
        {
          name: "Diseño y desarrollo de aplicaciones web",
          description: "Aplicaciones web empresariales para digitalizar procesos, centralizar información y gestionar operaciones desde cualquier dispositivo.",
        },
        {
          name: "Desarrollo de asistentes de inteligencia artificial",
          description: "Asistentes conversacionales que consultan la información autorizada de la empresa para atender clientes y apoyar a los equipos.",
        },
        {
          name: "Desarrollo de software a la medida",
          description: "Sistemas de información, automatización de procesos e integración de sistemas ajustados a las reglas de negocio de cada organización.",
        },
      ],
    },
    sections: [
      {
        kind: "services",
        id: "nuestros-servicios",
        eyebrow: "Nuestros servicios",
        title: "Transformamos sus ideas y procesos en soluciones digitales inteligentes",
        intro: "Diseñamos y desarrollamos aplicaciones web, asistentes de inteligencia artificial y software a la medida que responden a las necesidades reales de su negocio. Combinamos ingeniería de software e inteligencia artificial para crear herramientas que optimizan procesos, conectan información y facilitan la toma de decisiones.",
        items: [
          {
            icon: "web",
            title: "Aplicaciones web",
            text: "Plataformas que su equipo, sus clientes o sus proveedores usan desde el navegador para gestionar la operación y consultar información.",
            points: ["Acceso desde computador, tableta o celular", "Información centralizada y organizada", "Crecen junto con su negocio"],
            href: "#aplicaciones-web",
            linkLabel: "Conocer más sobre aplicaciones web",
          },
          {
            icon: "ai",
            title: "Asistentes de inteligencia artificial",
            text: "Asistentes que conversan con sus clientes o su equipo y responden con la información que su empresa autoriza.",
            points: ["Respuestas ágiles a cualquier hora", "Menos consultas repetitivas", "Conectados a sus documentos y sistemas"],
            href: "#asistentes-ia",
            linkLabel: "Conocer más sobre asistentes de IA",
          },
          {
            icon: "software",
            title: "Software a la medida",
            text: "Herramientas construidas alrededor de sus procesos y reglas de negocio, cuando las soluciones estándar no se ajustan a su forma de trabajar.",
            points: ["Se adapta a sus procesos", "Automatiza tareas manuales", "Usted decide cómo evoluciona"],
            href: "#software-a-la-medida",
            linkLabel: "Conocer más sobre software a la medida",
          },
        ],
      },
      {
        kind: "service",
        id: "aplicaciones-web",
        eyebrow: "Diseño y desarrollo de aplicaciones web",
        title: "Aplicaciones web que impulsan la operación de su empresa",
        intro: "Diseñamos y desarrollamos aplicaciones web empresariales para digitalizar procesos, centralizar información y facilitar la gestión de sus operaciones. Plataformas funcionales e intuitivas que se usan desde el navegador y se adaptan a la forma de trabajar de cada organización.",
        examplesTitle: "Aplicaciones web que podemos desarrollar",
        examples: [
          "Sistemas de gestión administrativa y operativa",
          "Plataformas de gestión empresarial",
          "Portales para clientes, proveedores y colaboradores",
          "Paneles de control y tableros de indicadores",
          "Sistemas de registro, seguimiento y trazabilidad",
          "Plataformas de gestión documental",
          "Aplicaciones web progresivas (PWA)",
          "Sistemas de información con bases de datos centralizadas",
        ],
        benefitsTitle: "Beneficios de una aplicación web empresarial",
        benefits: [
          "Acceso a la información desde diferentes dispositivos",
          "Actividades y procedimientos digitalizados",
          "Datos centralizados y organizados",
          "Mejor control y seguimiento de las operaciones",
          "Experiencias de uso intuitivas",
          "Nuevas funcionalidades a medida que su negocio crece",
        ],
        image: novixRoles,
        imageAlt: "Módulo de roles y permisos de Novix ERP, aplicación web de gestión empresarial desarrollada por DataSys Latam Group",
        width: 1242,
        height: 786,
        caption: "Novix ERP, nuestra aplicación web de gestión empresarial, con roles y permisos por usuario.",
      },
      {
        kind: "service",
        id: "asistentes-ia",
        eyebrow: "Asistentes de inteligencia artificial",
        title: "Asistentes de IA que trabajan con la información de su negocio",
        intro: "Integramos inteligencia artificial en sus procesos mediante asistentes capaces de conversar con los usuarios, consultar información, responder preguntas y apoyar actividades operativas y administrativas.",
        examplesTitle: "Asistentes de IA que podemos desarrollar",
        examples: [
          "Asistentes virtuales para atención al cliente",
          "Asistentes internos para colaboradores",
          "Consulta de documentos empresariales",
          "Búsqueda y recuperación de información",
          "Chatbots inteligentes para su sitio web",
          "Apoyo a procesos administrativos",
          "Integración de IA con sus aplicaciones y sistemas",
          "Automatización de consultas y tareas con IA",
        ],
        note: "Cada asistente hace lo que su proyecto define: sus capacidades dependen de las integraciones, los permisos y las fuentes de información que se configuren. Responde con base en esa información y, cuando un caso lo requiere, lo deriva a una persona de su equipo.",
        benefitsTitle: "Beneficios de un asistente de IA para su empresa",
        benefits: [
          "Información disponible de manera ágil",
          "Menos consultas operativas repetitivas",
          "Mejor experiencia de atención al usuario",
          "Acceso conversacional al conocimiento de su empresa",
          "Apoyo a sus equipos en el día a día",
          "Inteligencia artificial integrada a sus procesos actuales",
        ],
        image: asistenteNovaMovil,
        imageAlt: "Nova, asistente virtual con inteligencia artificial de DataSys Latam Group, abierto en un celular",
        width: 1200,
        height: 800,
        caption: "Nova, el asistente de este sitio: responde con el contenido publicado por DataSys y conecta con un asesor cuando hace falta.",
        reverse: true,
        link: { label: "Vea cómo aplicamos la inteligencia artificial en las empresas", href: "/servicios/inteligencia-artificial-empresas" },
      },
      {
        kind: "service",
        id: "software-a-la-medida",
        eyebrow: "Desarrollo de software a la medida",
        title: "Software diseñado alrededor de las necesidades de su negocio",
        intro: "Desarrollamos software empresarial para organizaciones que necesitan herramientas ajustadas a sus procesos, reglas de negocio y objetivos estratégicos. No todas las empresas funcionan igual: por eso analizamos cada necesidad antes de proponer una solución.",
        examplesTitle: "Software a la medida que podemos desarrollar",
        examples: [
          "Sistemas de información empresarial",
          "Software administrativo y operativo",
          "Sistemas de gestión de procesos",
          "Plataformas de control y seguimiento",
          "Inventarios y gestión de recursos",
          "Aplicaciones para automatizar procesos",
          "Integraciones entre diferentes sistemas",
          "Modernización de aplicaciones existentes",
          "Soluciones con funciones de inteligencia artificial",
        ],
        benefitsTitle: "Beneficios del software a la medida",
        benefits: [
          "Se adapta a los procesos de su organización",
          "Automatiza actividades y reduce tareas manuales",
          "Mayor trazabilidad de la información",
          "Integración con sus sistemas, cuando es técnicamente viable",
          "Flexibilidad para incorporar nuevas funcionalidades",
          "Control sobre la evolución de su solución",
        ],
        image: governexRiesgos,
        imageAlt: "Matriz de riesgos y oportunidades de Governex, software con funciones de inteligencia artificial desarrollado por DataSys Latam Group",
        width: 1885,
        height: 916,
        caption: "Governex, nuestro software para sistemas de gestión ISO, propone riesgos con IA para que el equipo los revise y confirme.",
        link: { label: "Vea cómo digitalizamos y automatizamos procesos", href: "/servicios/digitalizacion-de-procesos" },
      },
      {
        kind: "cards",
        id: "casos-de-uso",
        eyebrow: "Casos de uso",
        title: "¿Qué podemos desarrollar para su empresa?",
        intro: "Estas son algunas de las necesidades que más resolvemos con soluciones tecnológicas empresariales:",
        items: [
          { icon: "process", title: "Digitalización de procesos manuales", text: "Formatos en papel, correos y hojas de cálculo convertidos en flujos digitales con responsables, fechas y registros." },
          { icon: "automation", title: "Automatización de tareas administrativas", text: "Reportes, aprobaciones, recordatorios y cálculos que se ejecutan solos y liberan tiempo de su equipo." },
          { icon: "search", title: "Consulta inteligente de información", text: "Asistentes que responden preguntas sobre sus documentos, políticas o productos en lenguaje natural." },
          { icon: "platform", title: "Plataformas de gestión", text: "Sistemas para controlar operaciones, inventarios, solicitudes o proyectos en un solo lugar." },
          { icon: "integration", title: "Integración de sistemas empresariales", text: "Conectamos su contabilidad, ERP, CRM, sitio web u otras herramientas para no digitar los mismos datos dos veces." },
          { icon: "portal", title: "Portales y aplicaciones personalizadas", text: "Portales para clientes, proveedores o colaboradores, con acceso seguro a la información que cada uno necesita." },
        ],
      },
      {
        kind: "cards",
        id: "soluciones-desarrolladas",
        eyebrow: "Lo que ya construimos",
        title: "Soluciones desarrolladas por DataSys",
        intro: "Nuestros propios productos muestran cómo combinamos aplicaciones web, software a la medida e inteligencia artificial.",
        items: [
          {
            icon: "platform",
            title: "Novix ERP",
            text: "Sistema de gestión empresarial web con compras, almacén, calidad, ventas, contabilidad y tableros gerenciales, con roles y permisos por usuario.",
            href: "/producto/novix-erp",
            linkLabel: "Conocer Novix ERP",
          },
          {
            icon: "checklist",
            title: "Governex",
            text: "Software para gestionar sistemas ISO: procesos, riesgos, auditorías, no conformidades e indicadores, con asistentes de IA que proponen borradores.",
            href: "/producto/governex",
            linkLabel: "Conocer Governex",
          },
          {
            icon: "ai",
            title: "Nova, asistente del sitio",
            text: "Responde preguntas con el contenido publicado en este sitio, guía el autodiagnóstico y conecta con un asesor por WhatsApp. Pruébelo en el botón de la esquina inferior.",
          },
        ],
      },
      {
        kind: "steps",
        id: "metodologia",
        eyebrow: "Metodología",
        title: "Nuestra metodología de trabajo, en cinco etapas",
        items: [
          { title: "Diagnóstico de la necesidad", text: "Entendemos su negocio, sus procesos, sus usuarios y el problema que quiere resolver." },
          { title: "Requerimientos y alcance", text: "Definimos qué hará la solución, sus prioridades, etapas y plazos, antes de escribir código." },
          { title: "Experiencia de usuario y arquitectura", text: "Diseñamos pantallas claras y la arquitectura técnica que soportará el crecimiento." },
          { title: "Desarrollo, pruebas y validación", text: "Construimos por entregas, probamos cada funcionalidad y la validamos con su equipo." },
          { title: "Implementación y evolución", text: "Ponemos la solución en marcha, acompañamos a sus usuarios y la mejoramos según su operación." },
        ],
      },
      {
        kind: "chips",
        id: "tecnologias",
        eyebrow: "Tecnologías",
        title: "Tecnologías con las que desarrollamos su solución",
        intro: "Trabajamos con tecnologías modernas, probadas y con amplio soporte, elegidas según lo que su proyecto necesita:",
        chips: ["React", "Python", "Django", "Node.js", "PostgreSQL", "MySQL", "Docker", "GitHub", "Power BI", "OpenAI"],
      },
      {
        kind: "cards",
        id: "por-que-datasys",
        eyebrow: "Por qué DataSys",
        title: "¿Por qué desarrollar su solución con DataSys?",
        items: [
          { icon: "fit", title: "Soluciones adaptadas a su negocio", text: "Partimos de cómo opera su empresa, no de una plantilla. Si una herramienta existente le sirve, también se lo diremos." },
          { icon: "layers", title: "Ingeniería de software e IA", text: "Integramos inteligencia artificial donde aporta valor, dentro de software bien construido y seguro." },
          { icon: "checklist", title: "Primero el proceso, después el código", text: "Con criterio de sistemas de gestión ordenamos el proceso antes de automatizarlo, para resolver el problema correcto." },
          { icon: "user", title: "Pensado para quien lo usa", text: "Diseñamos interfaces claras y las validamos con sus usuarios para facilitar la adopción." },
          { icon: "support", title: "Acompañamiento en todo el ciclo", text: "Del diagnóstico a la puesta en marcha, con soporte y mantenimiento después de implementar." },
          { icon: "growth", title: "Visión de crecimiento", text: "Arquitecturas que permiten sumar módulos, usuarios e integraciones cuando su negocio lo necesite." },
        ],
      },
      {
        kind: "cta",
        id: "su-proyecto",
        title: "Su próximo proyecto tecnológico comienza con una idea",
        text: "Cuéntenos qué necesita su empresa. Analizamos su requerimiento y le orientamos sobre la solución tecnológica más adecuada.",
        primary: "Solicitar una asesoría",
        secondary: "Hablar con un asesor",
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué tipo de aplicaciones web desarrolla DataSys?",
        a: "Aplicaciones web empresariales a la medida: sistemas de gestión administrativa y operativa, portales para clientes, proveedores o colaboradores, tableros de indicadores, sistemas de seguimiento y trazabilidad, gestión documental y aplicaciones web progresivas (PWA), que se usan desde el celular como una app.",
      },
      {
        q: "¿Puedo solicitar un software diseñado específicamente para mi empresa?",
        a: "Sí. Analizamos sus procesos, reglas de negocio y usuarios, y diseñamos la solución alrededor de ellos. Si una herramienta que ya existe resuelve bien su necesidad, también se lo diremos.",
      },
      {
        q: "¿Qué es un asistente de inteligencia artificial empresarial?",
        a: "Es un asistente conversacional que responde preguntas y apoya tareas usando la información de su empresa: documentos, políticas, catálogos o datos de sus sistemas. Sus capacidades dependen de las fuentes de información, las integraciones y los permisos que se definan en el proyecto, y las decisiones siguen a cargo de su equipo.",
      },
      {
        q: "¿Es posible integrar inteligencia artificial con mis sistemas actuales?",
        a: "En muchos casos, sí: cuando el sistema permite conectarse por API, base de datos o exportación de archivos. En el diagnóstico revisamos qué tan viable es la integración y qué información puede usar el asistente de forma segura.",
      },
      {
        q: "¿Puedo automatizar procesos que hoy hago en Excel?",
        a: "Sí, es una de las necesidades más frecuentes. Llevamos esas hojas de cálculo a una aplicación con datos centralizados, validaciones, permisos por usuario y reportes automáticos, y trasladamos la información que ya tiene.",
      },
      {
        q: "¿Cómo comienza un proyecto de desarrollo de software?",
        a: "Con una conversación sin compromiso para entender su necesidad. Después hacemos el diagnóstico y definimos el alcance, las etapas y los plazos antes de empezar a desarrollar. Puede solicitar la asesoría en el formulario de esta página o por WhatsApp.",
      },
      {
        q: "¿Cuánto cuesta un desarrollo de software a la medida?",
        a: PRICE_ANSWER,
      },
      {
        q: "¿Desarrollan aplicaciones móviles además de web?",
        a: "Sí. Además de aplicaciones web, desarrollamos aplicaciones móviles y aplicaciones web progresivas (PWA), que se instalan en el celular desde el navegador. Le recomendamos la opción que mejor se ajuste a sus usuarios.",
      },
      {
        q: "¿DataSys ofrece soporte y mantenimiento después de implementar una solución?",
        a: "Sí. Acompañamos la puesta en marcha y ofrecemos soporte y mantenimiento para la continuidad de la solución, además de su evolución con nuevas funcionalidades cuando su negocio lo requiera.",
      },
    ],
    related: [
      { label: "Inteligencia artificial para empresas", href: "/servicios/inteligencia-artificial-empresas" },
      { label: "Digitalización y automatización de procesos", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Analítica de datos para empresas", href: "/servicios/analitica-de-datos" },
      { label: "Novix ERP: software de gestión empresarial", href: "/producto/novix-erp" },
      { label: "Governex: software para sistemas de gestión ISO", href: "/producto/governex" },
      { label: "Artículos de tecnología en el blog", href: "/blog?categoria=tecnologia" },
    ],
  },
  {
    path: "/servicios/inteligencia-artificial-empresas",
    metaTitle: "Inteligencia artificial para pymes y empresas | DataSys",
    metaDescription:
      "Inteligencia artificial para pymes en Colombia y Latinoamérica: asistentes, automatización e integración, con control humano. Solicite su diagnóstico de IA.",
    metaKeywords: [
      "inteligencia artificial para empresas",
      "inteligencia artificial para pymes",
      "implementación de IA en empresas",
      "automatización con inteligencia artificial",
      "asistentes de inteligencia artificial empresariales",
      "chatbots inteligentes para empresas",
      "consultoría en inteligencia artificial",
      "integración de IA en procesos empresariales",
      "automatización de tareas administrativas",
      "inteligencia artificial para atención al cliente",
      "soluciones de IA para pequeñas empresas",
    ],
    shareImage: {
      src: "/og-inteligencia-artificial.jpg",
      alt: "DataSys Latam Group: inteligencia artificial para hacer más eficiente su empresa, con control humano",
      width: 1200,
      height: 630,
    },
    eyebrow: "Consultoría e implementación de IA para pymes",
    h1: "Inteligencia artificial para hacer más eficiente su empresa",
    lead: "Integramos IA en su operación para automatizar tareas repetitivas, analizar información y atender mejor a sus clientes, con sus datos protegidos y siempre con una persona de su equipo al mando de las decisiones.",
    heroImage: inteligencia,
    heroImageMobile: inteligenciaMovil,
    heroImageAlt: "Profesional trabajando en su computador con herramientas de inteligencia artificial para analizar datos, atender clientes y proteger la información",
    heroImagePosition: "60% center",
    heroHighlights: ["Automatizamos tareas repetitivas", "Asistimos a su equipo y a sus clientes", "Integramos IA en sus sistemas", "Potenciamos sus decisiones"],
    primaryCta: "Solicitar asesoría en IA",
    secondaryCta: { label: "Descubrir soluciones", href: "#soluciones-ia" },
    whatsappText: "Hola, me interesa aplicar inteligencia artificial en mi empresa.",
    leadSubject: "Nuevo lead: Inteligencia artificial (sitio web)",
    leadNeedsLabel: "Área donde desea aplicar inteligencia artificial",
    leadNeeds: [
      "Automatización de tareas",
      "Asistentes inteligentes",
      "Atención al cliente",
      "Consulta de documentos",
      "Análisis de información",
      "Integración con sistemas empresariales",
      "Otro",
    ],
    leadAskPhone: true,
    leadSubmitLabel: "Solicitar diagnóstico de IA",
    leadTitle: "Solicite su diagnóstico de IA",
    leadText: "Cuéntenos qué tarea le quita más tiempo a su equipo o qué información le cuesta encontrar. Le contactamos para evaluarlo y, después, le presentamos una propuesta con la solución, el alcance, las etapas y los plazos, sin compromiso.",
    breadcrumb: "Inteligencia artificial",
    schema: {
      type: "Service",
      name: "Inteligencia artificial para empresas",
      serviceType: "Consultoría, implementación e integración de inteligencia artificial en procesos empresariales",
      offers: [
        { name: "Asistentes inteligentes empresariales", description: "Asistentes de IA para clientes y colaboradores que consultan documentos, procedimientos e información corporativa autorizada." },
        { name: "Automatización inteligente de tareas", description: "Clasificación de solicitudes, extracción de información de documentos, resúmenes y borradores, con supervisión." },
        { name: "Inteligencia artificial para atención al cliente", description: "Chatbots y asistentes conversacionales para preguntas frecuentes y orientación inicial, con paso a una persona cuando hace falta." },
        { name: "IA para consulta y análisis de información empresarial", description: "Consulta conversacional de documentos, búsqueda inteligente y resumen de informes." },
        { name: "IA integrada con aplicaciones y sistemas empresariales", description: "Incorporación de funciones de IA en aplicaciones web, plataformas administrativas y flujos de trabajo." },
        { name: "IA como apoyo a la toma de decisiones", description: "Síntesis de información, análisis de reportes e identificación de tendencias, con decisiones bajo supervisión humana." },
      ],
    },
    sections: [
      {
        kind: "problems",
        id: "que-puede-hacer",
        eyebrow: "Situaciones reales",
        title: "¿Qué puede hacer la inteligencia artificial por su empresa?",
        affirmative: true,
        questions: [
          "Responder consultas frecuentes de clientes",
          "Consultar información contenida en documentos empresariales",
          "Clasificar y organizar información",
          "Apoyar la elaboración de informes",
          "Resumir documentos extensos",
          "Automatizar actividades administrativas",
          "Facilitar la búsqueda de información",
          "Apoyar el seguimiento de solicitudes",
          "Generar borradores de comunicaciones y respuestas",
          "Identificar información relevante para tomar decisiones",
        ],
        closing: "La inteligencia artificial puede encargarse de parte del trabajo operativo para que su equipo concentre sus esfuerzos en lo que realmente genera valor.",
        note: "Cada aplicación requiere evaluar su viabilidad, su alcance, las fuentes de información que usará y el nivel de supervisión que necesita.",
      },
      {
        kind: "cta",
        id: "diagnostico",
        eyebrow: "El primer paso",
        title: "Todo empieza con un diagnóstico de IA",
        text: "Antes de hablar de herramientas, conocemos su operación: qué tareas consumen más tiempo y qué información le cuesta encontrar. Con eso identificamos dónde la IA aporta y le proponemos una solución con un alcance definido.",
        points: [
          "Tareas repetitivas y problemas de información identificados",
          "Casos de uso donde la IA realmente aporta",
          "Propuesta con solución, alcance, etapas y plazos",
          "Sin compromiso comercial",
        ],
        primary: "Solicitar diagnóstico de IA",
        secondary: "Hablar con un asesor",
      },
      {
        kind: "services",
        id: "soluciones-ia",
        eyebrow: "Nuestras soluciones",
        title: "Soluciones de inteligencia artificial que podemos implementar",
        intro: "Trabajamos en seis líneas de aplicación, según lo que su empresa necesita resolver:",
        wide: true,
        items: [
          {
            icon: "ai",
            title: "Asistentes inteligentes empresariales",
            text: "Desarrollamos e integramos asistentes de IA que permiten interactuar con la información y apoyan las actividades de sus equipos.",
            points: [
              "Asistentes virtuales para atención al cliente",
              "Asistentes internos para colaboradores",
              "Asistentes especializados en procesos",
              "Consulta de procedimientos y documentos",
              "Resolución de preguntas frecuentes",
              "Apoyo administrativo",
              "Consulta de información corporativa",
            ],
            benefits: [
              "Acceso más rápido a la información",
              "Menos consultas repetitivas",
              "Información disponible de forma conversacional",
              "Apoyo a colaboradores y clientes",
              "Mejor uso del conocimiento de la empresa",
            ],
          },
          {
            icon: "automation",
            title: "Automatización inteligente de tareas",
            text: "La IA complementa la automatización en las tareas donde hay que interpretar un texto o clasificar una solicitud.",
            points: [
              "Clasificación de solicitudes",
              "Extracción de información de documentos",
              "Borradores de respuestas",
              "Organización de registros",
              "Generación de resúmenes",
              "Apoyo con correos y comunicaciones",
              "Tareas administrativas con supervisión",
            ],
            benefits: [
              "Menos carga de tareas repetitivas",
              "Mayor agilidad operativa",
              "Menos actividades manuales",
              "Información mejor organizada",
              "Más tiempo para actividades estratégicas",
            ],
          },
          {
            icon: "support",
            title: "IA para atención al cliente",
            text: "Soluciones que ayudan a mejorar la experiencia de atención en su sitio web y otros canales.",
            points: [
              "Chatbots inteligentes para páginas web",
              "Asistentes conversacionales",
              "Respuestas a preguntas frecuentes",
              "Orientación inicial a clientes",
              "Información sobre productos y servicios",
              "Clasificación y direccionamiento de solicitudes",
              "Atención inicial fuera del horario, si se configura",
            ],
            benefits: [
              "Atención más ágil",
              "Más información disponible",
              "Menos consultas operativas repetitivas",
              "Atención más consistente",
              "Solicitudes mejor organizadas",
            ],
            note: "Los reclamos, los casos sensibles y lo que el asistente no puede resolver con seguridad se escalan a una persona de su equipo.",
          },
          {
            icon: "search",
            title: "Consulta y análisis de información",
            text: "Aproveche la IA para interactuar con la información que su organización ya tiene.",
            points: [
              "Consulta conversacional de documentos",
              "Búsqueda inteligente de información",
              "Resumen de informes y documentos",
              "Identificación de información relevante",
              "Comparación de contenidos",
              "Apoyo a la interpretación de reportes",
              "Información estructurada, con la integración adecuada",
            ],
            benefits: [
              "Acceso más sencillo al conocimiento",
              "Menos tiempo buscando documentos",
              "Mejor comprensión de la información",
              "Apoyo en la elaboración de reportes",
              "Uso de información antes dispersa",
            ],
          },
          {
            icon: "integration",
            title: "IA integrada con sus sistemas",
            text: "Incorporamos capacidades de IA en sus plataformas tecnológicas o en aplicaciones desarrolladas a la medida.",
            points: [
              "Asistentes integrados con aplicaciones web",
              "Conexión con bases de datos mediante mecanismos controlados",
              "Consulta inteligente de información empresarial",
              "Integración con plataformas administrativas",
              "Automatización de flujos de trabajo",
              "Funciones inteligentes en sistemas existentes",
            ],
            note: "Las integraciones dependen de la arquitectura, las interfaces disponibles, los permisos y las condiciones técnicas de cada sistema.",
            href: "/servicios/desarrollo-software-medida",
            linkLabel: "Ver desarrollo de software a la medida",
          },
          {
            icon: "dashboard",
            title: "IA como apoyo a la toma de decisiones",
            text: "Apoya a los responsables de la empresa a entender mejor la información disponible.",
            points: [
              "Síntesis de información",
              "Análisis de reportes",
              "Identificación de tendencias",
              "Comparación de resultados",
              "Generación de preguntas de análisis",
              "Posibles oportunidades y alertas",
              "Apoyo a la interpretación de indicadores",
            ],
            note: "La IA ofrece información y recomendaciones que deben evaluar los responsables de la organización. Las decisiones siguen bajo supervisión humana.",
            href: "/servicios/analitica-de-datos",
            linkLabel: "Ver analítica de datos",
          },
        ],
      },
      {
        kind: "services",
        id: "por-area",
        eyebrow: "Casos de uso",
        title: "¿Cómo puede ayudar la IA en las diferentes áreas de su empresa?",
        items: [
          {
            icon: "process",
            title: "Administración",
            text: "Menos tiempo en documentos y tareas de oficina.",
            points: ["Borradores de documentos", "Clasificación de información", "Consulta de procedimientos", "Resumen de informes", "Apoyo a tareas administrativas"],
          },
          {
            icon: "commercial",
            title: "Comercial y ventas",
            text: "Más agilidad para responder y preparar propuestas.",
            points: ["Asistentes para responder consultas", "Apoyo en la elaboración de propuestas", "Información de productos y servicios", "Clasificación de solicitudes comerciales", "Análisis de información comercial"],
          },
          {
            icon: "support",
            title: "Servicio al cliente",
            text: "Respuestas más rápidas y un equipo con más apoyo.",
            points: ["Asistentes conversacionales", "Atención de preguntas frecuentes", "Orientación inicial", "Clasificación de solicitudes", "Apoyo a los equipos de atención"],
          },
          {
            icon: "documents",
            title: "Gestión documental y calidad",
            text: "Encuentre lo que necesita en sus documentos.",
            points: ["Consulta inteligente de procedimientos", "Búsqueda de información documental", "Resumen de documentos", "Identificación de información relevante", "Asistencia con borradores"],
            href: "/producto/governex",
            linkLabel: "Conozca Governex",
          },
          {
            icon: "operations",
            title: "Operaciones",
            text: "Información a la mano para el trabajo diario.",
            points: ["Consulta de instrucciones de trabajo", "Clasificación de novedades", "Resumen de registros", "Apoyo al seguimiento de actividades", "Automatización de tareas administrativas"],
          },
        ],
        note: "La IA no reemplaza la responsabilidad profesional de sus colaboradores ni ejecuta todas las actividades sin intervención humana: los apoya en su trabajo.",
      },
      {
        kind: "steps",
        id: "como-implementamos",
        eyebrow: "Metodología",
        title: "¿Cómo implementamos inteligencia artificial en su empresa?",
        layout: "line",
        items: [
          { title: "Identificación de oportunidades", text: "Analizamos sus actividades y detectamos tareas repetitivas, problemas de información y oportunidades de aplicar IA." },
          { title: "Diagnóstico y alcance", text: "Evaluamos los procesos, la información disponible, las necesidades de los usuarios y los objetivos del proyecto." },
          { title: "Diseño de la solución", text: "Definimos la arquitectura, las herramientas, las fuentes de información, los permisos y la supervisión humana." },
          { title: "Desarrollo e integración", text: "Implementamos el asistente o la solución, hacemos las integraciones necesarias y ejecutamos pruebas funcionales." },
          { title: "Implementación y acompañamiento", text: "Facilitamos la puesta en marcha, orientamos a los usuarios y evaluamos oportunidades de mejora." },
        ],
      },
      {
        kind: "cards",
        id: "control-humano",
        eyebrow: "Datos protegidos y control humano",
        title: "Inteligencia artificial con control, seguridad y responsabilidad",
        intro: "Diseñamos cada solución con criterio de seguridad de la información, tomando como referencia la ISO/IEC 27001, y conforme a la ley colombiana de protección de datos personales (Ley 1581 de 2012).",
        items: [
          { icon: "shield", title: "Protección de la información", text: "Definimos con usted qué datos usa la solución, dónde se procesan y cómo se protegen." },
          { icon: "lock", title: "Control de acceso", text: "Cada usuario consulta solo lo que permiten los permisos definidos para su rol." },
          { icon: "search", title: "Fuentes de información evaluadas", text: "Revisamos de dónde toma la información la solución, para que sus respuestas partan de fuentes confiables." },
          { icon: "customers", title: "Supervisión humana y validación", text: "Los procesos críticos siguen a cargo de personas, y los resultados se validan cuando es necesario." },
          { icon: "eye", title: "Transparencia", text: "Le explicamos con claridad qué hace la IA, con qué datos trabaja y en qué puede equivocarse." },
          { icon: "checklist", title: "Responsabilidades y reglas de uso", text: "Acordamos quién responde por cada proceso y cómo debe usar la herramienta su equipo." },
        ],
        note: "Las medidas de protección dependen de la arquitectura, los proveedores tecnológicos, la configuración y los controles establecidos en cada proyecto. Antes de elegir un proveedor, revisamos sus condiciones sobre el uso de los datos.",
      },
      {
        kind: "benefits",
        id: "por-que-comenzar",
        eyebrow: "Beneficios",
        title: "¿Por qué las pymes deberían comenzar a utilizar IA?",
        intro: "La inteligencia artificial también está al alcance de las pequeñas y medianas empresas. Estos son algunos de los beneficios que puede aportar:",
        items: [
          "Mejor uso del tiempo de trabajo",
          "Menos tareas repetitivas",
          "Más agilidad al consultar información",
          "Apoyo en la atención de clientes",
          "Mejor uso del conocimiento de la empresa",
          "Más capacidad para procesar información",
          "Apoyo a los colaboradores en sus actividades",
          "Oportunidades para mejorar la eficiencia operativa",
        ],
        note: "Los beneficios dependen del proceso seleccionado, de la calidad de los datos, de la implementación y de la adopción por parte de los usuarios. Y si un problema se resuelve mejor sin IA, con una regla, un formulario o un reporte, se lo decimos.",
      },
      {
        kind: "levels",
        id: "a-la-medida",
        eyebrow: "Soluciones adaptadas a cada empresa",
        title: "No necesita implementar IA en toda su empresa. Comience por resolver una necesidad concreta",
        intro: "Le ayudamos a avanzar de forma progresiva, según sus prioridades:",
        items: [
          {
            name: "Nivel inicial",
            title: "Primeras aplicaciones",
            text: "Para empezar con una necesidad acotada.",
            points: ["Asistentes para preguntas frecuentes", "Consulta de información documental", "Resumen y clasificación de documentos", "Apoyo en tareas administrativas"],
          },
          {
            name: "Nivel intermedio",
            title: "IA conectada a su operación",
            text: "Para llevar la IA a sus herramientas y procesos.",
            points: ["Asistentes conectados a sus fuentes de información", "Automatización de tareas con IA", "Integración con aplicaciones web", "Flujos de trabajo con capacidades inteligentes"],
          },
          {
            name: "Nivel avanzado",
            title: "IA integrada a la empresa",
            text: "Para organizaciones con varios sistemas y más información.",
            points: ["IA integrada con diferentes sistemas", "Automatización de procesos con múltiples etapas", "Análisis de información con modelos de IA", "Aplicaciones personalizadas con capacidades inteligentes"],
          },
        ],
        note: "Estos niveles son orientativos. El alcance real se define según sus necesidades, su infraestructura, los datos disponibles y la viabilidad de cada proyecto.",
      },
      {
        kind: "showcase",
        id: "lo-usamos",
        eyebrow: "Lo usamos nosotros",
        title: "Inteligencia artificial que puede probar ahora mismo",
        intro: "Usamos en nuestros propios productos lo que le proponemos a su empresa:",
        points: [
          "Nova, el asistente de este sitio: responde preguntas sobre nuestros servicios usando solo la información publicada y, cuando hace falta, le ofrece hablar con una persona por WhatsApp. Pruébelo en el botón de la esquina inferior.",
          "Governex, nuestra plataforma para sistemas de gestión ISO: sus asistentes de IA proponen borradores y su equipo los revisa y decide.",
        ],
        image: asistenteNovaMovil,
        imageAlt: "Nova, asistente virtual con inteligencia artificial de DataSys Latam Group, abierto en un celular",
        width: 1200,
        height: 800,
        reverse: true,
      },
      {
        kind: "chips",
        id: "tecnologias",
        eyebrow: "Tecnologías",
        title: "Tecnologías de inteligencia artificial que usamos",
        intro: "Elegimos la herramienta según el problema, el costo y dónde deben quedar sus datos:",
        chips: ["Machine learning", "Procesamiento de lenguaje natural", "Chatbots y asistentes virtuales", "RPA", "Python", "OpenAI", "Google Gemini"],
      },
      {
        kind: "cards",
        id: "por-que-datasys",
        eyebrow: "Por qué DataSys",
        title: "¿Por qué elegir a DataSys Latam Group?",
        intro: "Primero comprendemos la necesidad de su empresa y después seleccionamos la tecnología apropiada.",
        items: [
          { icon: "checklist", title: "Entendemos sus procesos", text: "Si el proceso no está ordenado, primero lo ordenamos: la IA es tan buena como la información que recibe." },
          { icon: "ai", title: "Asistentes a la medida de su negocio", text: "Los adaptamos a sus preguntas, sus documentos y sus reglas de trabajo." },
          { icon: "integration", title: "IA integrada con su tecnología", text: "La conectamos con sus aplicaciones y sistemas cuando es viable, o con software a la medida." },
          { icon: "idea", title: "Problemas reales de las pymes", text: "Nos enfocamos en la eficiencia, la eficacia y el aprovechamiento de su información." },
          { icon: "growth", title: "Soluciones escalables", text: "Empiece con un caso concreto y amplíe la solución a medida que crece su organización." },
          { icon: "support", title: "Acompañamiento en la implementación", text: "Orientamos a sus usuarios durante la puesta en marcha y evaluamos oportunidades de mejora." },
        ],
      },
      {
        kind: "cta",
        id: "siguiente-paso",
        title: "Su empresa está lista para trabajar de forma más inteligente",
        text: "Identifiquemos juntos cómo la inteligencia artificial puede ayudarle a optimizar tareas, aprovechar la información y mejorar la operación de su negocio. En DataSys le acompañamos desde la identificación de oportunidades hasta la implementación de soluciones de IA.",
        primary: "Solicitar diagnóstico de IA",
        secondary: "Hablar con un asesor",
        footnote: "La inteligencia artificial no tiene que reemplazar la experiencia de su equipo. Debe ayudarlo a trabajar mejor.",
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué puede hacer la inteligencia artificial por mi empresa?",
        a: "Puede responder consultas frecuentes, buscar información en sus documentos, clasificar solicitudes, resumir textos y preparar borradores, entre otras tareas. Así su equipo dedica menos tiempo al trabajo repetitivo y más a lo que genera valor.",
      },
      {
        q: "¿Una pyme puede implementar soluciones de inteligencia artificial?",
        a: "Sí. Muchas aplicaciones útiles, como un asistente para preguntas frecuentes o la lectura de facturas, son proyectos acotados. Empezamos por un caso de uso concreto y crecemos solo si da resultados.",
      },
      {
        q: "¿Necesito conocimientos técnicos para utilizar asistentes de IA?",
        a: "No. Un asistente se usa conversando, como en un chat. Nosotros nos encargamos de la parte técnica y orientamos a sus usuarios durante la puesta en marcha.",
      },
      {
        q: "¿Puedo crear un asistente que consulte los documentos de mi empresa?",
        a: "Sí. Se puede construir un asistente que responda con base en sus documentos, como procedimientos, políticas o catálogos. La calidad de las respuestas depende de esos documentos, y definimos quién puede consultar cada información.",
      },
      {
        q: "¿Es posible integrar IA con mis aplicaciones actuales?",
        a: "En muchos casos, sí. Depende de la arquitectura de cada sistema, de las interfaces disponibles y de los permisos. En el diagnóstico revisamos qué tan viable es y cuál es la mejor forma de hacerlo.",
      },
      {
        q: "¿La inteligencia artificial puede automatizar tareas administrativas?",
        a: "Puede encargarse de una parte: clasificar solicitudes, extraer datos de documentos, preparar resúmenes o borradores. Definimos en qué pasos debe revisar una persona según la importancia de cada tarea.",
      },
      {
        q: "¿Puedo utilizar IA para mejorar la atención a mis clientes?",
        a: "Sí. Un asistente puede responder preguntas frecuentes, orientar al cliente y dirigir cada solicitud al área correcta. Los casos que lo requieren pasan a una persona de su equipo.",
      },
      {
        q: "¿Cómo se protege la información de mi empresa?",
        a: "Definimos con usted qué datos usa la solución, dónde se procesan y quién accede a ellos. Trabajamos con criterio de seguridad de la información, con la ISO/IEC 27001 como referencia, y conforme a la Ley 1581 de 2012. Las medidas concretas dependen de cada proyecto y de las condiciones del proveedor elegido, que revisamos con usted.",
      },
      {
        q: "¿La IA puede tomar decisiones por mi empresa?",
        a: "No es lo que recomendamos. La IA ofrece información y recomendaciones, y puede equivocarse. Las decisiones que afectan a sus clientes, a su equipo o a su dinero se quedan en manos de una persona.",
      },
      {
        q: "¿La inteligencia artificial va a reemplazar a mi equipo?",
        a: "Nuestro enfoque es que la IA haga las tareas repetitivas para que su equipo dedique su tiempo a atender clientes y a decidir. No reemplaza su experiencia: la apoya.",
      },
      {
        q: "¿Necesito tener mis datos organizados antes de empezar?",
        a: "Ayuda, pero no es requisito. En el diagnóstico revisamos el estado de su información y, si hace falta, primero la ordenamos, porque la IA es tan buena como los datos que recibe.",
      },
      {
        q: "¿Cómo puedo comenzar a implementar inteligencia artificial?",
        a: "Solicite un diagnóstico de IA en el formulario de esta página o por WhatsApp. Identificamos juntos la tarea donde la IA puede aportar más y definimos el alcance antes de empezar.",
      },
      { q: "¿Cuánto cuesta implementar una solución de IA?", a: PRICE_ANSWER },
    ],
    related: [
      { label: "Haga el autodiagnóstico gratuito de 10 minutos", href: "/#autodiagnostico" },
      { label: "Desarrollo de software a la medida para empresas", href: "/servicios/desarrollo-software-medida" },
      { label: "Digitalización de procesos para pymes", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Analítica de datos para empresas", href: "/servicios/analitica-de-datos" },
      { label: "Governex: software para sistemas de gestión ISO", href: "/producto/governex" },
    ],
  },
  {
    path: "/servicios/analitica-de-datos",
    metaTitle: "Analítica de datos y dashboards para pymes | DataSys",
    metaDescription:
      "Analítica de datos para pymes en Colombia y Latinoamérica: dashboards, indicadores de gestión y reportes para decidir con información. Solicite un diagnóstico.",
    metaKeywords: [
      "analítica de datos para pymes",
      "analítica de datos empresariales",
      "análisis de datos para empresas",
      "inteligencia de negocios para pymes",
      "business intelligence para empresas",
      "dashboards empresariales",
      "tableros de control gerencial",
      "indicadores de gestión empresarial",
      "análisis de ventas y datos comerciales",
      "toma de decisiones basada en datos",
      "consultoría en analítica de datos",
    ],
    shareImage: {
      src: "/og-analitica-datos.jpg",
      alt: "DataSys Latam Group: analítica de datos para pymes, con un dashboard comercial de ejemplo",
      width: 1200,
      height: 630,
    },
    eyebrow: "Analítica de datos para pymes",
    h1: "Sus datos tienen respuestas. Le ayudamos a descubrirlas",
    lead: "Convierta los datos de su empresa en información estratégica. Analizamos sus ventas, compras, inventarios y operaciones para crear indicadores y tableros de control que le permitan comprender su negocio y tomar mejores decisiones.",
    heroImage: analiticaDatosHero,
    heroImageMobile: analiticaDatosHeroMovil,
    heroImageAlt: "Gerente de una empresa revisando en su computador un tablero de indicadores con ventas, metas e inventarios",
    heroImagePosition: "35% center",
    heroHighlights: ["Organizamos sus datos", "Analizamos su información", "Facilitamos sus decisiones"],
    primaryCta: "Solicitar diagnóstico de datos",
    secondaryCta: { label: "Conocer nuestras soluciones", href: "#soluciones" },
    whatsappText: "Hola, me interesa la analítica de datos y un tablero de indicadores para mi empresa.",
    leadSubject: "Nuevo lead: Analítica de datos (sitio web)",
    leadNeedsLabel: "Área de interés",
    leadNeeds: [
      "Ventas y gestión comercial",
      "Finanzas y administración",
      "Inventarios y compras",
      "Operaciones y procesos",
      "Indicadores de gestión",
      "Dashboard gerencial",
      "Otro",
    ],
    leadAskPhone: true,
    leadSubmitLabel: "Solicitar diagnóstico de datos",
    leadTitle: "Solicite su diagnóstico de datos",
    leadText: "Cuéntenos qué información le gustaría entender mejor. Le contactamos para revisar sus datos y, después, le presentamos una propuesta con los indicadores, el alcance, las etapas y los plazos, sin compromiso.",
    breadcrumb: "Analítica de datos",
    schema: {
      type: "Service",
      name: "Analítica de datos para empresas",
      serviceType: "Analítica de datos e inteligencia de negocios",
      offers: [
        { name: "Organización y análisis de datos", description: "Consolidación, limpieza y organización de datos, reportes periódicos e indicadores básicos para empresas que trabajan con Excel y archivos dispersos." },
        { name: "Inteligencia de negocios (Business Intelligence)", description: "Dashboards interactivos, indicadores de gestión, reportes dinámicos e integración de fuentes de datos." },
        { name: "Analítica avanzada", description: "Análisis de tendencias, segmentación, modelos de pronóstico y detección de comportamientos atípicos, cuando los datos lo permiten." },
      ],
    },
    sections: [
      {
        kind: "problems",
        id: "aprovecha-sus-datos",
        eyebrow: "¿Le suena familiar?",
        title: "¿Está aprovechando los datos de su empresa?",
        questions: [
          "¿Sabe cuáles son sus productos o servicios más vendidos?",
          "¿Puede ver cómo evolucionan sus ventas mes a mes?",
          "¿Conoce cuáles clientes generan más actividad comercial?",
          "¿Tiene claro el comportamiento de sus inventarios?",
          "¿Identifica fácilmente los gastos que más afectan su operación?",
          "¿Conoce el cumplimiento de sus metas comerciales?",
          "¿Tiene que combinar varios archivos de Excel para elaborar un informe?",
          "¿Puede consultar los indicadores de su negocio sin esperar a que alguien prepare un reporte?",
        ],
        closing: "Su empresa genera datos todos los días. El verdadero valor está en saber interpretarlos y utilizarlos para decidir.",
      },
      {
        kind: "cta",
        id: "diagnostico",
        eyebrow: "El primer paso",
        title: "Todo empieza con un diagnóstico de sus datos",
        text: "Revisamos qué información tiene su empresa, dónde está y qué preguntas necesita responder la gerencia. Con eso le proponemos los indicadores, reportes o tableros adecuados, con un alcance definido.",
        points: [
          "Revisión de sus fuentes: Excel, sistemas y bases de datos",
          "Preguntas de negocio e indicadores prioritarios",
          "Propuesta con alcance, etapas y plazos",
          "Sin compromiso comercial",
        ],
        primary: "Solicitar diagnóstico de datos",
        secondary: "Hablar con un asesor",
      },
      {
        kind: "services",
        id: "que-analizamos",
        eyebrow: "Qué analizamos",
        title: "¿Qué podemos analizar en su empresa?",
        intro: "Organizamos la analítica por áreas, según las decisiones que necesita tomar:",
        items: [
          {
            icon: "growth",
            title: "Analítica comercial y de ventas",
            text: "Comprenda el comportamiento comercial de su empresa.",
            points: [
              "Evolución de ventas por períodos",
              "Ventas por productos y servicios",
              "Ventas por clientes",
              "Comparación de resultados comerciales",
              "Cumplimiento de metas",
              "Análisis de oportunidades comerciales",
              "Comportamiento de la demanda",
              "Tendencias de ventas",
            ],
          },
          {
            icon: "finance",
            title: "Analítica financiera y administrativa",
            text: "Entienda cómo se comportan sus recursos financieros y administrativos.",
            points: [
              "Análisis de ingresos y gastos",
              "Seguimiento y ejecución presupuestal",
              "Comparación de períodos financieros",
              "Análisis de costos",
              "Cuentas por cobrar y por pagar, cuando existen los datos",
              "Indicadores administrativos",
            ],
          },
          {
            icon: "inventory",
            title: "Analítica de inventarios y compras",
            text: "Analice el movimiento de sus recursos y de sus adquisiciones.",
            points: [
              "Rotación de inventarios",
              "Productos con mayor movimiento",
              "Existencias y niveles de inventario",
              "Tendencias de consumo",
              "Comportamiento de compras y proveedores",
              "Productos de baja rotación",
              "Costos de adquisición",
            ],
          },
          {
            icon: "operations",
            title: "Analítica operativa y de procesos",
            text: "Haga seguimiento al desempeño de las actividades de su empresa.",
            points: [
              "Cumplimiento de actividades",
              "Tiempos de atención y ejecución",
              "Seguimiento de órdenes de trabajo",
              "Indicadores de productividad",
              "Actividades pendientes",
              "Análisis de incidencias",
              "Objetivos operativos",
            ],
            href: "/servicios/digitalizacion-de-procesos",
            linkLabel: "Ver digitalización de procesos",
          },
          {
            icon: "customers",
            title: "Analítica de clientes",
            text: "Conozca mejor a sus clientes y su forma de comprar.",
            points: [
              "Frecuencia de compra",
              "Comportamiento de clientes",
              "Segmentación según criterios comerciales",
              "Clientes recurrentes",
              "Tendencias de consumo",
              "Seguimiento de relaciones comerciales",
            ],
          },
        ],
        note: "Los análisis posibles dependen de la información disponible: su calidad, su estructura y su nivel de detalle. La analítica financiera es información de apoyo y no sustituye la asesoría contable, financiera o tributaria especializada.",
      },
      {
        kind: "steps",
        id: "de-los-datos-a-las-decisiones",
        eyebrow: "Cómo trabajamos",
        title: "De los datos a las decisiones",
        intro: "Organizamos sus datos, analizamos su información y le facilitamos las decisiones, en cuatro etapas:",
        layout: "line",
        flow: ["Datos", "Análisis", "Información", "Decisiones"],
        items: [
          { title: "Recopilamos y organizamos los datos", text: "Identificamos las fuentes de información de su empresa: archivos de Excel, sistemas administrativos, bases de datos y otras fuentes disponibles." },
          { title: "Procesamos y analizamos la información", text: "Organizamos los datos, verificamos su consistencia y los analizamos para identificar comportamientos, tendencias y relaciones relevantes." },
          { title: "Visualizamos los resultados", text: "Construimos reportes, indicadores y dashboards que facilitan la interpretación de la información." },
          { title: "Apoyamos la toma de decisiones", text: "Le ayudamos a interpretar los resultados para identificar oportunidades de mejora y respaldar sus decisiones." },
        ],
      },
      {
        kind: "showcase",
        id: "dashboards",
        eyebrow: "Dashboards e indicadores",
        title: "Visualice lo que sucede en su empresa y comprenda hacia dónde se dirige",
        intro: "Un tablero de control reúne en una sola pantalla los indicadores que la gerencia necesita, actualizados y fáciles de leer. Con él puede:",
        points: [
          "Consultar indicadores de diferentes áreas",
          "Comparar resultados entre períodos",
          "Identificar tendencias",
          "Detectar desviaciones frente a las metas",
          "Analizar la información con filtros",
          "Consolidar información de diferentes fuentes",
          "Presentar resultados a la gerencia con facilidad",
        ],
        image: analiticaDashboardEjecutivo,
        imageAlt: "Ejemplo ilustrativo con datos ficticios de un dashboard ejecutivo con ventas, gastos frente al presupuesto, rotación de inventario y desviaciones detectadas",
        width: 1200,
        height: 600,
      },
      {
        kind: "cards",
        id: "tipos-de-dashboard",
        eyebrow: "Ejemplos de tableros",
        title: "Tableros de control para cada área de su empresa",
        items: [
          { icon: "dashboard", title: "Dashboard ejecutivo", text: "Los indicadores clave de todas las áreas en una sola vista, para la gerencia." },
          { icon: "growth", title: "Dashboard comercial", text: "Ventas, metas, clientes y productos, con filtros por período, sede o vendedor." },
          { icon: "finance", title: "Dashboard financiero", text: "Ingresos, gastos, presupuesto y costos comparados entre períodos." },
          { icon: "inventory", title: "Dashboard de inventarios", text: "Existencias, rotación, productos de baja rotación y compras." },
          { icon: "operations", title: "Dashboard operativo", text: "Cumplimiento de actividades, tiempos de atención y órdenes de trabajo." },
        ],
      },
      {
        kind: "levels",
        id: "soluciones",
        eyebrow: "Soluciones de analítica de datos para pymes",
        title: "Una solución según la madurez de su empresa",
        intro: "No necesita una infraestructura tecnológica compleja para empezar: cada nivel parte de lo que su empresa ya tiene.",
        items: [
          {
            name: "Nivel 1",
            title: "Organización y análisis de datos",
            text: "Para empresas que trabajan principalmente con Excel y archivos dispersos.",
            points: ["Consolidación de información", "Limpieza y organización de datos", "Reportes periódicos", "Indicadores básicos", "Análisis comparativo"],
          },
          {
            name: "Nivel 2",
            title: "Inteligencia de negocios (BI)",
            text: "Para empresas que necesitan visualizar y monitorear sus resultados.",
            points: ["Dashboards interactivos", "Indicadores de gestión", "Reportes dinámicos", "Integración de fuentes de datos", "Seguimiento de metas", "Análisis multidimensional"],
          },
          {
            name: "Nivel 3",
            title: "Analítica avanzada",
            text: "Para organizaciones que requieren análisis más profundos y cuentan con información suficiente.",
            points: [
              "Identificación de patrones y tendencias",
              "Segmentación de información",
              "Modelos de pronóstico",
              "Detección de comportamientos atípicos",
              "Inteligencia artificial y aprendizaje automático",
            ],
          },
        ],
        note: "La analítica avanzada requiere evaluar antes la disponibilidad, la calidad y el volumen de sus datos. Solo la proponemos cuando es técnicamente viable y aporta valor a su empresa.",
      },
      {
        kind: "chips",
        id: "tecnologia",
        eyebrow: "Tecnología",
        title: "Tecnología al servicio de sus decisiones",
        intro: "Elegimos la tecnología según su necesidad, no al revés, y siempre que es posible aprovechamos las herramientas que su empresa ya tiene. Estas son las que usamos en nuestros proyectos:",
        chips: ["Excel", "Power BI", "SQL", "PostgreSQL", "MySQL", "Python", "Machine learning", "OpenAI"],
      },
      {
        kind: "benefits",
        id: "beneficios",
        eyebrow: "Beneficios",
        title: "Beneficios de la analítica de datos para su pyme",
        items: [
          "Mayor visibilidad del comportamiento del negocio",
          "Información organizada y centralizada",
          "Menos dependencia de reportes manuales",
          "Seguimiento oportuno de indicadores",
          "Mejor comprensión de ventas, costos y operaciones",
          "Identificación de oportunidades comerciales",
          "Detección de desviaciones y comportamientos relevantes",
          "Más capacidad para evaluar el cumplimiento de objetivos",
          "Decisiones respaldadas por información",
        ],
        note: "La analítica de datos no garantiza resultados económicos por sí sola: su valor depende de la calidad de la información, de su interpretación y de las decisiones que se tomen con ella.",
      },
      {
        kind: "cards",
        id: "por-que-datasys",
        eyebrow: "Por qué DataSys",
        title: "¿Por qué elegir a DataSys Latam Group?",
        intro: "No le entregamos solo gráficos o reportes: le ayudamos a comprender su negocio con información.",
        items: [
          { icon: "fit", title: "Entendemos su negocio", text: "Partimos de las decisiones que toma la gerencia y de las preguntas que necesita responder." },
          { icon: "checklist", title: "Primero los indicadores correctos", text: "Definimos qué medir con el criterio que piden los sistemas de gestión ISO y después construimos el tablero." },
          { icon: "idea", title: "Enfoque práctico para pymes", text: "Información útil para el día a día, sin tecnicismos ni reportes que nadie lee." },
          { icon: "layers", title: "Tecnología y gestión empresarial", text: "Unimos el conocimiento de los procesos con la tecnología para que cada cifra tenga sentido para el negocio." },
          { icon: "support", title: "Acompañamiento en la interpretación", text: "Le ayudamos a leer los resultados y a convertirlos en acciones." },
          { icon: "growth", title: "Soluciones que evolucionan", text: "Empiece con lo básico y sume fuentes, indicadores y análisis a medida que su empresa crece." },
        ],
      },
      {
        kind: "cta",
        id: "siguiente-paso",
        title: "Deje de acumular datos. Comience a utilizarlos para hacer crecer su negocio",
        text: "En DataSys le ayudamos a descubrir el valor de la información que genera su empresa. Identifiquemos qué datos necesita analizar y cómo convertirlos en indicadores útiles para tomar mejores decisiones.",
        primary: "Solicitar diagnóstico de datos",
        secondary: "Hablar con un asesor",
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es la analítica de datos y cómo puede ayudar a mi empresa?",
        a: "Es organizar y analizar los datos que genera su negocio (ventas, compras, inventarios y operaciones) para convertirlos en información útil. Le ayuda a saber qué está pasando, por qué y dónde hay oportunidades de mejora, para decidir con información y no solo por intuición.",
      },
      {
        q: "¿Una pyme puede implementar soluciones de analítica de datos?",
        a: "Sí. No necesita una infraestructura tecnológica compleja: puede empezar con los datos que ya tiene en Excel o en su sistema contable, con unos pocos indicadores clave, y avanzar por etapas.",
      },
      {
        q: "¿Necesito tener un sistema ERP para analizar los datos de mi negocio?",
        a: "No. Un ERP facilita el análisis porque centraliza la información, pero también trabajamos con archivos de Excel, sistemas contables y otras fuentes. Si en el diagnóstico vemos que la forma de registrar los datos limita el análisis, se lo diremos.",
      },
      {
        q: "¿Puedo utilizar los archivos Excel que actualmente tiene mi empresa?",
        a: "Sí, es el punto de partida más común. Integramos esos archivos y, si hace falta, primero ordenamos la forma en que se registran los datos para que los indicadores sean confiables.",
      },
      {
        q: "¿Qué información necesito para comenzar un proyecto de analítica?",
        a: "Basta con los datos que ya registra: ventas, compras, inventarios, gastos o actividades, en Excel o en sus sistemas. En el diagnóstico revisamos qué información tiene, su calidad y qué preguntas puede responder.",
      },
      {
        q: "¿Qué es un dashboard empresarial?",
        a: "Es una pantalla que reúne los indicadores clave de su negocio, como ventas, márgenes, cartera, inventario o productividad, actualizados y fáciles de leer. Le permite ver a tiempo lo que hoy descubre semanas después, con el cierre contable.",
      },
      {
        q: "¿Qué diferencia existe entre un reporte y un tablero de control?",
        a: "Un reporte muestra la información de un momento, normalmente en un documento que alguien prepara. Un tablero de control se actualiza con los datos, permite filtrar y comparar períodos y muestra los indicadores en una sola pantalla, sin esperar a que alguien arme el informe.",
      },
      {
        q: "¿Puedo consultar los indicadores de mi empresa desde un celular?",
        a: "Sí. Los tableros se pueden consultar desde el computador o el celular, según la herramienta elegida y los permisos que se definan para cada usuario.",
      },
      {
        q: "¿Es posible integrar información de diferentes sistemas?",
        a: "Sí, cuando los sistemas permiten exportar la información o conectarse a ella. Unimos los datos de Excel, el sistema contable, el ERP y otras fuentes para verlos en un mismo tablero.",
      },
      { q: "¿Cuánto cuesta implementar una solución de analítica de datos?", a: PRICE_ANSWER },
      {
        q: "¿Necesito comprar licencias de Power BI?",
        a: "Depende del número de usuarios y de cómo se compartan los tableros. En el diagnóstico le recomendamos la opción más económica para su caso, incluidas las herramientas que ya tenga.",
      },
      {
        q: "¿Quién puede ver la información de los tableros?",
        a: "Configuramos el acceso según el rol: cada persona ve solo la información que necesita. La seguridad de la información es parte de nuestros valores y la aplicamos con la ISO/IEC 27001 como referencia.",
      },
    ],
    related: [
      { label: "Haga el autodiagnóstico gratuito de 10 minutos", href: "/#autodiagnostico" },
      { label: "Digitalización de procesos para pymes", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Inteligencia artificial para empresas", href: "/servicios/inteligencia-artificial-empresas" },
      { label: "Desarrollo de software a la medida para empresas", href: "/servicios/desarrollo-software-medida" },
      { label: "Novix ERP: software de gestión empresarial", href: "/producto/novix-erp" },
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
    ],
  },
  {
    path: "/servicios/digitalizacion-de-procesos",
    metaTitle: "Digitalización de procesos para pymes | DataSys Latam",
    metaDescription:
      "Digitalización y automatización de procesos para pymes en Colombia y Latinoamérica: organice su información y controle su operación. Solicite un diagnóstico.",
    metaKeywords: [
      "digitalización de procesos para pymes",
      "digitalización de procesos empresariales",
      "servicios de digitalización empresarial",
      "automatización de procesos para pequeñas empresas",
      "transformación digital para pymes",
      "optimización de procesos empresariales",
      "digitalización de procesos administrativos",
      "automatización de tareas empresariales",
      "soluciones digitales para pequeñas empresas",
      "consultoría en transformación digital",
    ],
    shareImage: {
      src: "/og-digitalizacion-procesos.jpg",
      alt: "DataSys Latam Group: digitalización de procesos para pymes, de la hoja de cálculo a una plataforma de seguimiento",
      width: 1200,
      height: 630,
    },
    eyebrow: "Digitalización de procesos para pymes",
    h1: "Mejoramos la forma en que las pymes realizan y controlan su trabajo",
    lead: "Le ayudamos a reducir las tareas repetitivas, organizar la información y saber qué pasa en su operación. Empezamos por un diagnóstico de sus procesos y, con base en él, le proponemos la solución adecuada para su empresa.",
    heroImage: digitalizacionProcesosHero,
    heroImageMobile: digitalizacionProcesosHeroMovil,
    heroImageAlt: "Equipo de una empresa revisando en una pantalla el control de sus operaciones, con el mapa de un proceso y las tareas automatizadas",
    heroImagePosition: "70% center",
    heroHighlights: ["Identificamos lo que le quita tiempo", "Digitalizamos con la herramienta adecuada", "Optimizamos el control de su operación"],
    primaryCta: "Solicitar diagnóstico",
    secondaryCta: { label: "Conocer cómo funciona", href: "#como-funciona" },
    whatsappText: "Hola, quiero digitalizar y automatizar procesos de mi empresa.",
    leadSubject: "Nuevo lead: Digitalización de procesos (sitio web)",
    leadNeedsLabel: "¿Qué proceso desea digitalizar?",
    leadNeeds: ["Administrativos", "Comerciales", "Operativos", "Inventarios y compras", "Gestión documental y calidad", "Otro"],
    leadAskPhone: true,
    leadSubmitLabel: "Solicitar diagnóstico",
    leadTitle: "Solicite su diagnóstico de procesos",
    leadText: "Cuéntenos qué proceso le quita más tiempo a su equipo. Le contactamos para conocer cómo opera su empresa y, después, le presentamos una propuesta con la solución, el alcance, las etapas y los plazos, sin compromiso.",
    breadcrumb: "Digitalización de procesos",
    schema: {
      type: "Service",
      name: "Digitalización y automatización de procesos",
      serviceType: "Digitalización y automatización de procesos empresariales",
      offers: [
        { name: "Diagnóstico de procesos", description: "Análisis de cómo opera la empresa para identificar actividades manuales, dificultades y oportunidades de digitalización." },
        { name: "Diseño de soluciones digitales", description: "Definición del proceso mejorado y selección de las herramientas tecnológicas adecuadas." },
        { name: "Digitalización y automatización de procesos", description: "Implementación de soluciones para gestionar información, organizar actividades y automatizar tareas cuando es técnicamente viable." },
        { name: "Acompañamiento y mejora continua", description: "Apoyo en la adopción de las soluciones e identificación de nuevas oportunidades de optimización." },
      ],
    },
    sections: [
      {
        kind: "problems",
        id: "trabaja-manual",
        eyebrow: "¿Le suena familiar?",
        title: "¿Su empresa todavía trabaja de forma manual?",
        questions: [
          "¿Controla sus inventarios en archivos de Excel?",
          "¿Registra a mano las compras, las ventas o los servicios?",
          "¿Depende de correos y mensajes para hacer seguimiento a las actividades?",
          "¿Pierde tiempo buscando documentos e información?",
          "¿Sus colaboradores repiten varias veces el mismo registro?",
          "¿Le cuesta saber en qué estado están las tareas pendientes?",
          "¿Tiene que consolidar varios archivos para elaborar un informe?",
          "¿Si alguien clave se ausenta, nadie sabe en qué va un pedido o un trámite?",
        ],
        closing: "Estos problemas no necesariamente requieren más personal o más trabajo. Muchas veces necesitan procesos mejor organizados y herramientas digitales adecuadas.",
      },
      {
        kind: "cta",
        id: "diagnostico",
        eyebrow: "El primer paso",
        title: "Todo empieza con un diagnóstico de sus procesos",
        text: "Antes de hablar de tecnología, conocemos su operación: cómo trabaja su equipo, dónde se pierde el tiempo y qué le impide tener el control. Con eso le proponemos una solución con un alcance definido.",
        points: [
          "Conversación sobre cómo opera su empresa",
          "Tareas manuales y cuellos de botella identificados",
          "Propuesta con solución, alcance, etapas y plazos",
          "Sin compromiso comercial",
        ],
        primary: "Solicitar diagnóstico de procesos",
        secondary: "Hablar con un asesor",
      },
      {
        kind: "services",
        id: "procesos",
        eyebrow: "Qué digitalizamos",
        title: "¿Qué procesos podemos digitalizar en su empresa?",
        intro: "Organizamos las soluciones por áreas. Estos son ejemplos de procesos que cualquier pyme reconoce en su día a día:",
        items: [
          {
            icon: "process",
            title: "Procesos administrativos",
            text: "Menos correos y papeles para gestionar el día a día de la oficina.",
            points: [
              "Gestión de solicitudes internas",
              "Control y seguimiento de actividades",
              "Gestión de documentos y registros",
              "Elaboración y consolidación de informes",
              "Control de tareas y responsables",
              "Flujos de aprobación",
            ],
          },
          {
            icon: "commercial",
            title: "Procesos comerciales",
            text: "Clientes, cotizaciones y pedidos con seguimiento, sin depender de la memoria de cada vendedor.",
            points: [
              "Registro y seguimiento de clientes",
              "Gestión de cotizaciones",
              "Seguimiento de oportunidades comerciales",
              "Control de pedidos",
              "Registro de solicitudes de servicio",
              "Seguimiento de compromisos con clientes",
            ],
          },
          {
            icon: "operations",
            title: "Procesos operativos",
            text: "Órdenes de trabajo, servicios y entregas con responsables y trazabilidad.",
            points: [
              "Registro de actividades operativas",
              "Control de órdenes de trabajo",
              "Seguimiento de servicios y entregas",
              "Gestión de novedades",
              "Control de recursos y actividades",
              "Trazabilidad de operaciones",
            ],
          },
          {
            icon: "inventory",
            title: "Inventarios y compras",
            text: "Existencias al día y compras con soporte, sin conteos a ciegas.",
            points: [
              "Registro de entradas y salidas",
              "Control de existencias",
              "Solicitudes de compra",
              "Seguimiento de pedidos",
              "Control de proveedores",
              "Registro de movimientos de inventario",
            ],
            href: "/producto/novix-erp",
            linkLabel: "Conozca Novix ERP",
          },
          {
            icon: "documents",
            title: "Gestión documental y calidad",
            text: "Documentos, registros e indicadores organizados y listos para una auditoría.",
            points: [
              "Organización de documentos",
              "Control de versiones",
              "Gestión de formatos y registros",
              "Seguimiento de procedimientos",
              "Registro de no conformidades",
              "Seguimiento de acciones correctivas",
              "Control de indicadores de gestión",
            ],
            href: "/producto/governex",
            linkLabel: "Conozca Governex",
          },
        ],
        note: "Cada empresa es distinta: seleccionamos los procesos y las funcionalidades según sus necesidades. No todas las pymes necesitan digitalizar los mismos procesos ni implementar todo a la vez.",
      },
      {
        kind: "compare",
        id: "antes-y-despues",
        eyebrow: "Antes y después",
        title: "¿Cómo transformamos sus procesos?",
        intro: "Así cambia el trabajo diario cuando un proceso se digitaliza:",
        items: [
          {
            icon: "process",
            title: "Solicitudes internas",
            before: "Un colaborador recibe la solicitud por correo, la registra en Excel, pregunta a sus compañeros en qué va y después consolida todo en un informe.",
            after: "La solicitud se registra en una plataforma, se asigna a un responsable, se actualiza su estado y la información queda lista para el seguimiento y los reportes.",
          },
          {
            icon: "inventory",
            title: "Inventarios",
            before: "Las entradas y salidas se anotan en una hoja de cálculo cuando hay tiempo, y las existencias se confirman contando en bodega.",
            after: "Cada movimiento se registra al momento, las existencias se consultan en línea y se pueden configurar alertas de stock mínimo.",
          },
          {
            icon: "approval",
            title: "Compras",
            before: "El pedido de compra se hace por WhatsApp, se aprueba de palabra y después nadie sabe quién lo autorizó.",
            after: "La solicitud pasa por un flujo de aprobación con responsables definidos y queda registrada con su soporte.",
          },
          {
            icon: "commercial",
            title: "Ventas y cotizaciones",
            before: "Las cotizaciones viven en el correo de cada vendedor y el seguimiento depende de su memoria.",
            after: "Cada cotización queda registrada con su estado y su fecha de seguimiento, a la vista de quien la necesite.",
          },
          {
            icon: "documents",
            title: "Gestión documental",
            before: "Hay varias versiones del mismo procedimiento en carpetas y correos, y nadie sabe cuál es la vigente.",
            after: "Los documentos están en un solo lugar, con su versión vigente, su responsable y acceso según el rol.",
          },
          {
            icon: "checklist",
            title: "Seguimiento de actividades",
            before: "Las tareas se reparten en reuniones y mensajes, y saber qué está pendiente exige preguntar uno por uno.",
            after: "Cada tarea tiene responsable, fecha y estado, y un tablero muestra lo pendiente en todo momento.",
          },
        ],
        note: "No todos los procesos pueden automatizarse por completo. El nivel de automatización depende de cada proceso: en el diagnóstico definimos qué conviene digitalizar, qué automatizar y qué debe seguir a cargo de su equipo.",
      },
      {
        kind: "steps",
        id: "como-funciona",
        eyebrow: "Nuestra propuesta de servicio",
        title: "Un acompañamiento progresivo en cuatro etapas",
        intro: "Identificamos lo que le quita tiempo, lo digitalizamos con la herramienta adecuada y le ayudamos a optimizar el control de su operación.",
        layout: "line",
        items: [
          { title: "Diagnóstico de procesos", text: "Analizamos cómo funciona hoy su empresa e identificamos actividades manuales, dificultades operativas y oportunidades de digitalización." },
          { title: "Diseño de soluciones digitales", text: "Definimos cómo debe funcionar el proceso mejorado y seleccionamos las herramientas tecnológicas adecuadas según sus requerimientos." },
          { title: "Digitalización y automatización", text: "Implementamos soluciones para gestionar la información, organizar actividades, conectar tareas y automatizar operaciones cuando es técnicamente viable." },
          { title: "Acompañamiento y mejora continua", text: "Apoyamos la adopción de las soluciones por parte de su equipo e identificamos nuevas oportunidades de optimización." },
        ],
      },
      {
        kind: "cards",
        id: "soluciones-tecnologicas",
        eyebrow: "Soluciones tecnológicas",
        title: "Herramientas para digitalizar su empresa",
        intro: "La solución puede ser sencilla o más avanzada, según el alcance de su proyecto. La prioridad es resolver una necesidad real, no implementar tecnología innecesaria: siempre que es posible aprovechamos e integramos lo que ya usa, y desarrollamos a la medida solo cuando hace falta.",
        items: [
          { icon: "form", title: "Formularios digitales", text: "Reemplazan formatos en papel y hojas sueltas para capturar información desde el computador o el celular." },
          {
            icon: "web",
            title: "Plataformas web",
            text: "Para gestionar actividades, solicitudes y responsables desde cualquier lugar.",
            href: "/servicios/desarrollo-software-medida",
            linkLabel: "Ver desarrollo de software",
          },
          { icon: "database", title: "Sistemas de información empresariales", text: "Centralizan los datos de varias áreas en una sola fuente confiable." },
          { icon: "documents", title: "Gestión documental digital", text: "Documentos con su versión vigente, responsables y permisos de acceso." },
          { icon: "approval", title: "Flujos de trabajo y aprobaciones", text: "Solicitudes que pasan de un responsable a otro con reglas claras y trazabilidad." },
          { icon: "automation", title: "Automatización de tareas repetitivas", text: "Reportes, recordatorios, notificaciones y traspasos de datos que se ejecutan solos." },
          { icon: "integration", title: "Integración de herramientas", text: "Conectamos su sistema contable, ERP, sitio web u otras herramientas para no digitar dos veces." },
          {
            icon: "dashboard",
            title: "Tableros de control e indicadores",
            text: "Información actualizada para decidir sin esperar el informe del mes.",
            href: "/servicios/analitica-de-datos",
            linkLabel: "Ver analítica de datos",
          },
          {
            icon: "ai",
            title: "Asistentes de inteligencia artificial",
            text: "Para consultar información o apoyar procesos, cuando aportan un valor real.",
            href: "/servicios/inteligencia-artificial-empresas",
            linkLabel: "Ver IA para empresas",
          },
        ],
      },
      {
        kind: "benefits",
        id: "beneficios",
        eyebrow: "Beneficios",
        title: "Beneficios de digitalizar los procesos de su pyme",
        items: [
          "Menos actividades manuales y repetitivas",
          "Información mejor organizada",
          "Mayor trazabilidad de las operaciones",
          "Menos errores por registros duplicados",
          "Seguimiento más oportuno de las actividades",
          "Mejor coordinación entre colaboradores",
          "Información a la mano para tomar decisiones",
          "Mayor control de las operaciones",
          "Procesos organizados que permiten crecer",
        ],
      },
      {
        kind: "levels",
        id: "a-la-medida",
        eyebrow: "Digitalización a la medida de las pymes",
        title: "Comience por el proceso que más tiempo y esfuerzo le consume",
        intro: "No es necesario digitalizar toda la empresa al mismo tiempo. Le ayudamos a priorizar y a avanzar por proyectos graduales, al ritmo de su operación y de su capacidad de inversión.",
        items: [
          { name: "Nivel inicial", title: "Registros y documentos digitales", text: "Formularios, registros y documentos que dejan el papel y las hojas sueltas, y quedan organizados y disponibles." },
          { name: "Nivel intermedio", title: "Procesos organizados y con seguimiento", text: "Procesos definidos, responsables asignados y control del estado de cada actividad." },
          { name: "Nivel avanzado", title: "Automatización e integración", text: "Flujos de trabajo automatizados, sistemas integrados, indicadores y soluciones inteligentes." },
        ],
        note: "Estos niveles son orientativos: el alcance de cada proyecto se define en el diagnóstico de su empresa.",
      },
      {
        kind: "cards",
        id: "por-que-datasys",
        eyebrow: "Por qué DataSys",
        title: "¿Por qué elegir a DataSys Latam Group?",
        intro: "No buscamos venderle herramientas innecesarias: identificamos qué necesita mejorar su empresa y cómo la tecnología puede ayudarle.",
        items: [
          { icon: "checklist", title: "Entendemos sus procesos", text: "Analizamos cómo trabaja hoy su empresa antes de proponer cualquier herramienta." },
          { icon: "layers", title: "Primero ordenamos, después automatizamos", text: "Integramos gestión de procesos con criterio ISO y tecnología, para que la herramienta resuelva el problema correcto." },
          { icon: "fit", title: "A la medida de cada pyme", text: "Soluciones adaptadas a su tamaño, a su operación y a su capacidad de inversión." },
          { icon: "idea", title: "Orientación práctica", text: "Empezamos por lo que más tiempo le quita y resolvemos problemas concretos del negocio." },
          { icon: "support", title: "Acompañamiento en la implementación", text: "Involucramos a su equipo desde el diseño y lo capacitamos para que adopte las herramientas." },
          { icon: "growth", title: "Soluciones que crecen con usted", text: "Digitalización progresiva según sus prioridades, con soluciones que evolucionan a medida que crece su organización." },
        ],
      },
      {
        kind: "cta",
        id: "siguiente-paso",
        title: "Su empresa no necesita seguir trabajando como siempre",
        text: "Identifiquemos juntos qué procesos puede digitalizar para mejorar la organización, el control y la eficiencia de su negocio. En DataSys le ayudamos a dar el siguiente paso hacia una gestión más digital.",
        primary: "Solicitar diagnóstico de procesos",
        secondary: "Hablar con un asesor",
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué significa digitalizar los procesos de una empresa?",
        a: "Es pasar la información y las actividades del papel, el correo o las hojas sueltas a herramientas digitales donde quedan organizadas, con responsables y seguimiento. Automatizar es el paso siguiente: que esas herramientas ejecuten por sí solas las tareas repetitivas.",
      },
      {
        q: "¿Una pequeña empresa puede implementar soluciones de digitalización?",
        a: "Sí. La digitalización no es exclusiva de las grandes empresas: se puede empezar con soluciones sencillas, como formularios digitales o un tablero de seguimiento, y avanzar por etapas según sus prioridades y su presupuesto.",
      },
      {
        q: "¿Qué procesos de mi negocio puedo digitalizar?",
        a: "Procesos administrativos, comerciales, operativos, de inventarios y compras, y de gestión documental y calidad, entre otros. En el diagnóstico identificamos cuáles le generan más trabajo manual y dónde la digitalización aporta más.",
      },
      {
        q: "¿Necesito cambiar todos mis sistemas actuales?",
        a: "No necesariamente. Siempre que es posible integramos y aprovechamos las herramientas que su empresa ya tiene; solo recomendamos reemplazarlas cuando el cambio genera un beneficio claro.",
      },
      {
        q: "¿Puedo comenzar digitalizando solamente un proceso?",
        a: "Sí, y suele ser lo más recomendable: empezar por el proceso que más tiempo o errores le genera, comprobar los resultados y avanzar con el siguiente. Si no sabe por dónde empezar, el autodiagnóstico gratuito de 10 minutos le muestra en qué etapa está su empresa.",
      },
      {
        q: "¿Es posible digitalizar procesos que actualmente gestiono en Excel?",
        a: "Sí, es uno de los casos más frecuentes. Llevamos esas hojas de cálculo a una herramienta con datos centralizados, validaciones, permisos por usuario y reportes, y trasladamos la información que ya tiene.",
      },
      {
        q: "¿La digitalización permite automatizar actividades repetitivas?",
        a: "En muchos casos, sí: reportes, recordatorios, notificaciones, aprobaciones o el traspaso de datos entre sistemas. El nivel de automatización depende de cada proceso, y algunas tareas conviene que sigan a cargo de una persona.",
      },
      {
        q: "¿Cuánto tiempo puede tomar implementar una solución?",
        a: "Depende del alcance, de la complejidad del proceso y de las integraciones necesarias. Después del diagnóstico le presentamos una propuesta con etapas y plazos definidos para su caso.",
      },
      { q: "¿Qué inversión requiere digitalizar los procesos de una pyme?", a: PRICE_ANSWER },
      {
        q: "¿DataSys puede desarrollar una solución adaptada a las necesidades de mi empresa?",
        a: "Sí. Cuando las herramientas existentes no se ajustan a su operación, desarrollamos software a la medida; y cuando sí se ajustan, le ayudamos a configurarlas e integrarlas.",
      },
      {
        q: "¿Cómo logramos que el equipo use las nuevas herramientas?",
        a: "Involucramos desde el diseño a quienes ejecutan el proceso y los capacitamos durante la implementación. Una herramienta pensada con el equipo se adopta con más facilidad.",
      },
    ],
    related: [
      { label: "Haga el autodiagnóstico gratuito de 10 minutos", href: "/#autodiagnostico" },
      { label: "Transformación digital para pymes", href: "/servicios/transformacion-digital" },
      { label: "Desarrollo de software a la medida para empresas", href: "/servicios/desarrollo-software-medida" },
      { label: "Novix ERP: software de gestión empresarial", href: "/producto/novix-erp" },
      { label: "Governex: software para sistemas de gestión ISO", href: "/producto/governex" },
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
      { label: "Lea: documentar procesos sin llenarse de papeles", href: "/blog/documentar-procesos-empresa-sin-papeles" },
    ],
  },
  {
    path: "/servicios/transformacion-digital",
    metaTitle: "Transformación digital para pymes en Colombia | DataSys",
    metaDescription:
      "Transformación digital para pymes en Colombia: diagnóstico, hoja de ruta por fases y modernización de su operación con tecnología, sin desperdiciar dinero.",
    eyebrow: "Transformación digital",
    h1: "Transformación digital para pymes",
    lead: "Diseñamos con usted una hoja de ruta clara y por fases para modernizar su operación con tecnología: primero lo que más retorno genera, sin comprar herramientas que su empresa todavía no necesita.",
    heroImage: transformacion,
    heroImageMobile: transformacionMovil,
    heroImageAlt: "Ciudad iluminada con trazos de luz que representan la evolución digital de una empresa",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, quiero una hoja de ruta de transformación digital para mi empresa.",
    leadSubject: "Nuevo lead: Transformación digital (sitio web)",
    breadcrumb: "Transformación digital",
    schema: { type: "Service", name: "Transformación digital para pymes", serviceType: "Consultoría en transformación digital" },
    sections: [
      {
        kind: "text",
        id: "que-es",
        eyebrow: "Qué es",
        title: "Transformación digital no es comprar software",
        paragraphs: [
          "Es cambiar la forma en que su empresa opera para que funcione con procesos claros, información confiable y herramientas que su equipo realmente usa. La tecnología es el medio; el objetivo es una empresa que no dependa de la memoria de dos o tres personas y que decida con datos.",
          "Por eso no empezamos por la herramienta, sino por su operación: cómo vende, cómo produce, cómo factura y cómo decide hoy. Comprar un software sin haber ordenado el proceso solo hace más rápido el desorden.",
        ],
      },
      {
        kind: "steps",
        id: "hoja-de-ruta",
        eyebrow: "Metodología",
        title: "Cómo construimos su hoja de ruta de transformación digital",
        items: [
          { title: "Diagnóstico de madurez", text: "Evaluamos procesos, sistemas, datos, infraestructura y equipo para saber en qué etapa está su empresa." },
          { title: "Prioridades", text: "Identificamos los problemas que más tiempo, dinero o clientes le cuestan y los ordenamos por impacto y esfuerzo." },
          { title: "Hoja de ruta por fases", text: "Un plan con etapas, responsables, inversión estimada y resultados esperados en cada fase." },
          { title: "Implementación", text: "Ejecutamos cada fase con su equipo: procesos, software, integración, datos o infraestructura." },
          { title: "Gestión del cambio", text: "Formamos y acompañamos a las personas, porque la transformación la hacen ellas, no la herramienta." },
          { title: "Medición y ajuste", text: "Medimos los resultados de cada fase y ajustamos el plan antes de invertir en la siguiente." },
        ],
      },
      {
        kind: "cards",
        id: "que-modernizamos",
        eyebrow: "Qué modernizamos",
        title: "Los frentes de la transformación digital de su empresa",
        items: [
          { title: "Procesos", text: "Ordenamos y estandarizamos los procesos con criterio ISO antes de digitalizarlos." },
          { title: "Sistemas y software", text: "ERP, plataformas a la medida e integración de los sistemas que ya usa." },
          { title: "Datos y decisiones", text: "Tableros de indicadores para que la gerencia decida con información a tiempo." },
          { title: "Infraestructura en la nube", text: "Hosting, servidores virtuales y respaldo de la información, con la seguridad como requisito." },
          { title: "Presencia digital", text: "Sitios web que generan clientes y que Google y los asistentes de IA pueden leer." },
          { title: "Personas y cultura", text: "Formación a la medida para que su equipo adopte las nuevas formas de trabajar." },
        ],
      },
      {
        kind: "text",
        id: "primer-paso",
        eyebrow: "Primer paso",
        title: "¿No sabe por dónde empezar su transformación digital?",
        paragraphs: [
          "El autodiagnóstico gratuito le muestra en menos de 10 minutos en qué etapa de la ruta Ordenar → Estandarizar → Automatizar → Decidir con datos está su empresa, cuáles son sus principales riesgos y cuál es el siguiente paso recomendado.",
        ],
        link: { label: "Hacer el autodiagnóstico gratuito", href: "/#autodiagnostico" },
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es la transformación digital para una pyme?",
        a: "Es modernizar la forma en que la empresa opera, con procesos claros, información confiable y herramientas que el equipo usa, para crecer sin depender de unas pocas personas y decidir con datos. La tecnología es el medio, no el fin.",
      },
      {
        q: "¿Por dónde empieza la transformación digital de una empresa?",
        a: "Por un diagnóstico de cómo opera hoy y de qué problemas le cuestan más. Con eso se define una hoja de ruta por fases, empezando por lo que más retorno genera. Comprar un software sin ordenar antes el proceso solo hace más rápido el desorden.",
      },
      { q: "¿Cuánto cuesta la transformación digital?", a: PRICE_ANSWER },
      {
        q: "¿Cuánto tiempo toma la transformación digital?",
        a: "Depende del punto de partida y del alcance. Por eso la hoja de ruta se divide en fases cortas, cada una con resultados medibles, para que vea valor desde la primera etapa y decida si continúa.",
      },
      {
        q: "¿Tengo que cambiar todos mis sistemas?",
        a: "No. Aprovechamos lo que funciona e integramos lo que ya tiene; solo recomendamos reemplazar una herramienta cuando el cambio tiene un retorno claro.",
      },
    ],
    related: [
      { label: "Digitalización y automatización de procesos", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Novix ERP: software de gestión empresarial", href: "/producto/novix-erp" },
      { label: "Gobernanza de TI para empresas", href: "/servicios/gobernanza-ti" },
    ],
  },
  {
    path: "/servicios/gobernanza-ti",
    metaTitle: "Gobernanza de TI y seguridad de la información | DataSys",
    metaDescription:
      "Gobernanza de TI para empresas en Colombia: alineamos la tecnología con sus objetivos y fortalecemos la seguridad de la información, los riesgos y el cumplimiento.",
    eyebrow: "Gobernanza TI",
    h1: "Gobernanza de TI para empresas",
    lead: "Alineamos la tecnología con los objetivos de su negocio: sabrá en qué invierte, quién responde por cada sistema, cómo está protegida su información y si cumple lo que la ley y sus clientes le exigen.",
    heroImage: redes,
    heroImageMobile: redesMovil,
    heroImageAlt: "Red de conexiones luminosas que representa sistemas de información protegidos y bajo control",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, me interesa la gobernanza de TI y la seguridad de la información para mi empresa.",
    leadSubject: "Nuevo lead: Gobernanza de TI (sitio web)",
    breadcrumb: "Gobernanza de TI",
    schema: { type: "Service", name: "Gobernanza de TI para empresas", serviceType: "Gobernanza de tecnologías de la información y seguridad de la información" },
    sections: [
      {
        kind: "cards",
        id: "senales",
        eyebrow: "¿Le suena familiar?",
        title: "Señales de que su empresa necesita gobernanza de TI",
        items: [
          { title: "Nadie tiene el inventario completo", text: "No se sabe con certeza qué sistemas, licencias, equipos y accesos tiene la empresa." },
          { title: "Accesos sin control", text: "Personas que ya no trabajan con usted conservan acceso a correos, carpetas o sistemas." },
          { title: "Inversiones sin plan", text: "La tecnología se compra por urgencia y no por un plan alineado con los objetivos del negocio." },
          { title: "Respaldos sin probar", text: "Hay copias de seguridad, pero nadie ha comprobado que se puedan restaurar." },
          { title: "Clientes que preguntan por seguridad", text: "Un cliente grande le pide políticas de seguridad de la información o de protección de datos que su empresa no tiene." },
          { title: "Todo depende de una persona", text: "Si su proveedor o la persona de sistemas se va, nadie sabe cómo funciona la tecnología de la empresa." },
        ],
      },
      {
        kind: "cards",
        id: "que-hacemos",
        eyebrow: "Qué hacemos",
        title: "Tecnología alineada, segura y bajo control",
        items: [
          { title: "Plan estratégico de TI", text: "Alineamos las inversiones en tecnología con los objetivos del negocio, con prioridades y presupuesto." },
          { title: "Inventario y responsables", text: "Identificamos sistemas, datos, licencias y proveedores, y definimos quién responde por cada uno." },
          { title: "Seguridad de la información", text: "Políticas, control de accesos, respaldo y protección contra amenazas, con la ISO/IEC 27001 como referencia." },
          { title: "Protección de datos personales", text: "Políticas y procedimientos para el tratamiento de datos personales conforme a la Ley 1581 de 2012." },
          { title: "Riesgos y continuidad", text: "Identificamos los riesgos tecnológicos y preparamos a la empresa para seguir operando ante una falla o un ciberataque." },
          { title: "Proveedores de tecnología", text: "Criterios para elegir, contratar y controlar a sus proveedores de software, soporte y servicios en la nube." },
        ],
      },
      {
        kind: "text",
        id: "nuestro-enfoque",
        eyebrow: "Nuestro enfoque",
        title: "Gobernanza de TI con criterio de sistemas de gestión",
        paragraphs: [
          "La gobernanza de TI es un sistema de gestión aplicado a la tecnología: objetivos, responsables, riesgos, controles y mejora continua. Es el mismo criterio con el que acompañamos a las empresas en la implementación de normas ISO, adaptado a su tamaño: sin burocracia y con políticas que su equipo puede cumplir.",
          "Con Governex, nuestra plataforma de gobernanza corporativa, puede llevar en un solo lugar el seguimiento de los procesos, el cumplimiento y las decisiones.",
        ],
        link: { label: "Conozca Governex", href: "/producto/governex" },
      },
      {
        kind: "chips",
        id: "marcos",
        eyebrow: "Marcos de referencia",
        title: "Normas y marcos de referencia para la gobernanza de TI",
        intro: "Tomamos de cada referente lo que su empresa necesita, sin exigirle una certificación que no busca:",
        chips: [
          "ISO/IEC 38500 (gobierno de TI)",
          "ISO/IEC 27001 (seguridad de la información)",
          "ISO 31000 (gestión de riesgos)",
          "ISO 22301 (continuidad del negocio)",
          "Ley 1581 de 2012 (protección de datos personales)",
        ],
      },
      {
        kind: "steps",
        id: "metodologia",
        eyebrow: "Metodología",
        title: "Cómo implementamos la gobernanza de TI",
        items: [
          { title: "Diagnóstico", text: "Revisamos sistemas, accesos, proveedores, respaldos y riesgos, y los comparamos con los objetivos del negocio." },
          { title: "Plan", text: "Priorizamos los riesgos y definimos qué hacer, quién lo hace y con qué presupuesto." },
          { title: "Políticas y controles", text: "Redactamos políticas sencillas y ponemos en marcha los controles que más protegen." },
          { title: "Formación", text: "Capacitamos a su equipo, porque la seguridad también depende de las personas, por ejemplo al reconocer un correo fraudulento." },
          { title: "Seguimiento", text: "Revisiones periódicas e indicadores para comprobar que los controles funcionan y mejorar." },
        ],
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es la gobernanza de TI?",
        a: "Es el conjunto de decisiones, responsables, políticas y controles que aseguran que la tecnología de la empresa apoye sus objetivos, esté protegida y cumpla con la ley y con lo que exigen sus clientes.",
      },
      {
        q: "¿La gobernanza de TI es solo para empresas grandes?",
        a: "No. Una pyme también tiene información valiosa, accesos que controlar y proveedores de los que depende. Adaptamos el alcance al tamaño de su empresa, con políticas sencillas que se puedan cumplir.",
      },
      {
        q: "¿Necesito certificarme en ISO 27001?",
        a: "No necesariamente: la certificación es voluntaria. Podemos aplicar los controles de la norma que su empresa necesita y, si un cliente le exige el certificado, prepararla para la auditoría. El certificado lo otorga un organismo de certificación independiente.",
      },
      {
        q: "¿Qué tiene que ver con la protección de datos personales?",
        a: "En Colombia, la Ley 1581 de 2012 establece reglas para el tratamiento de datos personales, entre ellas contar con la autorización del titular y proteger la información con medidas de seguridad. La gobernanza de TI incluye las políticas y los controles para cumplirlas.",
      },
      { q: "¿Cuánto cuesta un proyecto de gobernanza de TI?", a: PRICE_ANSWER },
    ],
    related: [
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
      { label: "Governex: software para sistemas de gestión ISO", href: "/producto/governex" },
      { label: "Ciberseguridad básica para pymes", href: "/blog/ciberseguridad-basica-pymes-bajo-costo" },
    ],
  },
  {
    path: "/producto/novix-erp",
    metaTitle: "Novix ERP: software ERP para pymes en Colombia | DataSys",
    metaDescription:
      "Compras, inventario por lotes, calidad, ventas, despachos y contabilidad en un solo sistema, con trazabilidad total. Solicite una demostración de Novix ERP.",
    eyebrow: "Novix ERP · Software de gestión empresarial",
    h1: "Software ERP para controlar su operación de punta a punta",
    lead: "Compras, inventario, calidad, ventas, despachos y contabilidad en un solo sistema. Lo que su equipo registra una vez actualiza el inventario, la cartera y la contabilidad, y cada documento se conecta con el siguiente hasta su asiento contable.",
    heroImage: novixDashboard,
    heroImageAlt: "Tablero ejecutivo de Novix ERP con indicadores de finanzas, compras, inventario y operaciones",
    heroMockup: novixEquiposSinFondo,
    heroHighlights: ["53 indicadores con fórmula visible", "13 roles de usuario y roles propios", "Colombia (DIAN) y Venezuela (SENIAT)"],
    primaryCta: "Solicitar una demostración",
    whatsappText: "Hola, quisiera conocer Novix ERP para mi empresa.",
    leadSubject: "Nuevo lead: Novix ERP, demostración (sitio web)",
    breadcrumb: "Novix ERP",
    schema: { type: "SoftwareApplication", name: "Novix ERP", category: "BusinessApplication" },
    sections: [
      {
        kind: "text",
        id: "que-es",
        eyebrow: "Qué es Novix ERP",
        title: "Cada operación, rastreable de principio a fin",
        paragraphs: [
          "Novix ERP es el sistema de gestión empresarial desarrollado por DataSys Latam Group. Integra en una sola base de datos compras, inventario, calidad, ventas, logística, facturación, contabilidad, tesorería e indicadores, con acceso desde el navegador y permisos por rol.",
          "Está diseñado para pymes y medianas empresas comerciales, distribuidoras e industriales que ya superaron el Excel, y para entidades educativas que necesitan ordenar su gestión logística, administrativa y financiera. Opera en Colombia y en Venezuela, con varias empresas, sedes, bodegas y monedas.",
        ],
      },
      {
        kind: "cards",
        id: "problemas",
        eyebrow: "¿Le suena familiar?",
        title: "Cuando la información vive en lugares distintos, la empresa pierde control",
        intro: "Las compras van por correo, el inventario en una hoja de cálculo, la facturación en otro programa y la contabilidad se alimenta a fin de mes. No es un problema de esfuerzo: es un problema de sistema.",
        items: [
          { title: "Doble digitación", text: "La misma factura se registra en ventas, en cartera y en contabilidad. Cada paso es una oportunidad de error." },
          { title: "Inventario que no cuadra", text: "Lo que dice el sistema no coincide con la bodega: se vende lo que no hay y se vencen productos que nadie vio." },
          { title: "Compras sin control", text: "Se paga una factura sin comprobar que la mercancía llegó completa y al precio pactado." },
          { title: "Proveedores sin medición", text: "Nadie sabe con datos quién entrega a tiempo y quién envía mercancía con defectos." },
          { title: "Cifras que no se pueden explicar", text: "La gerencia recibe un número, pero no puede ver de qué documentos sale." },
          { title: "Accesos sin control", text: "Cualquiera puede crear y aprobar lo mismo, y no queda claro quién hizo qué." },
        ],
      },
      {
        kind: "cards",
        id: "beneficios",
        eyebrow: "La solución",
        title: "Un solo sistema donde cada operación alimenta a la siguiente",
        items: [
          { title: "Registre una vez", text: "Recepciones, despachos, facturas y pagos generan su asiento contable de forma automática; los comprobantes manuales los aprueba un segundo usuario." },
          { title: "Vea la cadena completa", text: "Desde cualquier número de documento ve de dónde viene, qué generó, cómo se pagó y qué asientos produjo." },
          { title: "Proteja su inventario", text: "Existencias por bodega, ubicación y lote; reserva primero lo que vence primero y nunca despacha lotes vencidos, bloqueados o en cuarentena." },
          { title: "Pague solo lo que recibió", text: "La factura del proveedor se cruza con la orden de compra y la recepción, con tolerancia de precio configurable." },
          { title: "Decida con indicadores auditables", text: "53 indicadores con fórmula, fuente, meta y responsable. Si faltan datos, el indicador lo dice: nunca rellena cifras." },
          { title: "Controle quién hace qué", text: "Roles por empresa y por sede, segregación de funciones, límites de aprobación por monto y bitácora de auditoría." },
        ],
      },
      {
        kind: "cards",
        id: "modulos",
        eyebrow: "Módulos",
        title: "Módulos de Novix ERP",
        intro: "Todos comparten la misma base de datos. Los módulos operativos se activan por empresa: una comercializadora puede trabajar sin producción y una industria puede activarla.",
        items: [
          { title: "Gerencia e indicadores", text: "Tablero ejecutivo por área, periodo, sede y centro de costo, con alertas, metas, presupuestos y tendencia de seis meses." },
          { title: "Trazabilidad de documentos", text: "La cadena completa de cualquier orden, recepción, pedido, despacho, factura o pago, a un clic." },
          { title: "Compras y abastecimiento", text: "Solicitudes, comparativo de cotizaciones, órdenes con aprobación y presupuesto, recepciones y evaluación de proveedores." },
          { title: "Inventario y almacén", text: "Kardex valorizado, lotes y vencimientos, reabastecimiento sugerido, ajustes con aprobación y conteos físicos ciegos." },
          { title: "Calidad", text: "Planes de inspección por etapa, cuarentena y bloqueo de lotes, y no conformidades con causa raíz y acciones correctivas." },
          { title: "Ventas, precios y promociones", text: "Cotizaciones, pedidos con cupo de crédito y reserva de inventario, listas de precios por cliente y promociones." },
          { title: "Logística y despachos", text: "Preparación, empaque, envío y entrega, rutas del día, seguimiento, incidencias y devoluciones." },
          { title: "Facturación electrónica", text: "Facturas y notas desde el despacho, con numeración autorizada. Preparada para conectarse con el proveedor autorizado por la DIAN o la imprenta digital del SENIAT que contrate su empresa." },
          { title: "Producción y operaciones (opcional)", text: "Órdenes de producción, servicio y mantenimiento con listas de materiales, desperdicio, horas y costo real." },
          { title: "Contabilidad y tesorería", text: "Cartera por edades, anticipos, recaudos y pagos con retenciones, conciliación bancaria con extractos y estados financieros." },
          { title: "Libros y reportes fiscales", text: "Venezuela: libros de IVA, retenciones de IVA y TXT para el SENIAT. Colombia: auxiliar de IVA y certificados de retención." },
          { title: "Importación y administración", text: "Plantillas CSV o Excel con validación previa, documentos en PDF y por correo, usuarios, roles y auditoría." },
        ],
      },
      {
        kind: "showcase",
        id: "indicadores",
        eyebrow: "Gerencia",
        title: "Indicadores que se pueden auditar",
        intro: "El tablero ejecutivo calcula 53 indicadores de finanzas, compras, inventario, calidad, logística y operaciones directamente de las transacciones registradas.",
        points: [
          "Estado frente a la meta: en meta, alerta, crítico o sin meta.",
          "Fórmula, fuente, frecuencia y responsable de cada indicador.",
          "Tendencia de seis meses y acceso a las transacciones de origen.",
          "Si aún no hay datos, muestra «Pendiente de datos»: nunca inventa cifras.",
        ],
        image: novixDashboard,
        imageAlt: "Dashboard ejecutivo de Novix ERP con filtros por periodo y sede e indicadores por estado",
        width: 1582,
        height: 872,
      },
      {
        kind: "showcase",
        id: "contabilidad",
        eyebrow: "Contabilidad",
        title: "La contabilidad se alimenta sola desde la operación",
        intro: "Cada recepción, despacho, factura y pago genera su asiento. El equipo contable revisa y concilia en lugar de digitar.",
        points: [
          "Plan de cuentas de referencia para Colombia y Venezuela, ajustable por su contador.",
          "Cuentas por cobrar y por pagar por edades, anticipos y estados de cuenta en PDF o por correo.",
          "Conciliación bancaria con extractos en CSV, Excel u OFX.",
          "Estados financieros, libro mayor, libro diario y cierre de periodos que ya no se pueden modificar.",
        ],
        image: novixPlanCuentas,
        imageAlt: "Plan de cuentas en el módulo de contabilidad de Novix ERP",
        width: 1262,
        height: 836,
        reverse: true,
      },
      {
        kind: "showcase",
        id: "roles",
        eyebrow: "Control de acceso",
        title: "Cada persona ve y hace solo lo que le corresponde",
        intro: "Novix trae 13 roles listos para usar, del comprador al contador, y cada empresa puede crear los suyos con su propia matriz de permisos.",
        points: [
          "Roles por empresa y por sede, con fecha de vencimiento para reemplazos o auditores externos.",
          "Quien crea un documento no lo aprueba: segregación de funciones configurable.",
          "Límites de aprobación por monto para compras, ajustes y pagos.",
          "Bitácora de auditoría y revisión periódica de accesos exportable.",
        ],
        image: novixRoles,
        imageAlt: "Roles y permisos de Novix ERP: administrador, almacenista, comprador, contador, vendedor y otros",
        width: 1242,
        height: 786,
      },
      {
        kind: "steps",
        id: "diferenciadores",
        eyebrow: "Por qué Novix",
        title: "Por qué elegir Novix ERP",
        items: [
          { title: "Trazabilidad que se ve", text: "La cadena de cada documento aparece en la misma pantalla, del origen al asiento contable." },
          { title: "Calidad dentro del ERP", text: "Inspección en recepción, cuarentena de lotes y no conformidades con causa raíz, sin un sistema aparte." },
          { title: "Indicadores honestos", text: "Cada indicador muestra su fórmula y su fuente; si no hay datos, lo dice en lugar de mostrar un número." },
          { title: "Integridad desde la base de datos", text: "Impide inventario negativo, asientos descuadrados y cambios en periodos cerrados, aunque alguien intente saltarse una pantalla." },
          { title: "Colombia y Venezuela en un mismo sistema", text: "Impuestos, retenciones, numeración y reportes de cada país, por empresa y con varias monedas." },
          { title: "Implementación con método", text: "Primero ordenamos sus procesos con criterio ISO; después configuramos el sistema, migramos sus datos y capacitamos a su equipo. En la nube o en su servidor." },
        ],
      },
      {
        kind: "cards",
        id: "sectores",
        eyebrow: "Sectores",
        title: "Sectores que pueden aprovechar Novix ERP",
        items: [
          { title: "Distribución y comercialización", text: "Listas de precios por cliente, cupo de crédito, reservas, despachos por ruta y cartera por edades." },
          { title: "Industria liviana y manufactura por órdenes", text: "Listas de materiales con desperdicio, órdenes de producción con costo real e inspección en proceso y producto final." },
          { title: "Alimentos, bebidas, agroinsumos y químicos", text: "Control por lote y vencimiento, salida de lo que vence primero, cuarentena y bloqueo de lotes." },
          { title: "Servicios técnicos y mantenimiento", text: "Órdenes de servicio y de mantenimiento con materiales y horas registradas." },
          { title: "Entidades educativas", text: "Gestión logística, administrativa y financiera de la institución, y formación práctica de estudiantes en procesos empresariales." },
          { title: "Grupos en Colombia y Venezuela", text: "Varias empresas en un mismo sistema, cada una con su jurisdicción, impuestos y moneda." },
        ],
      },
      {
        kind: "text",
        id: "educacion",
        eyebrow: "Entidades educativas",
        title: "Novix ERP para colegios, institutos y universidades",
        paragraphs: [
          "Gestión logística, administrativa y financiera: solicitudes de compra con aprobación y presupuesto; almacén de insumos, papelería y material didáctico con entregas por centro de costo (sede, programa o dependencia); contabilidad, tesorería, conciliación bancaria y presupuesto, con control de quién aprueba cada gasto.",
          "Herramienta educativa: los programas de contabilidad, logística, administración e ingeniería industrial pueden practicar con un ERP real, comprando, recibiendo, inspeccionando, vendiendo, despachando, facturando en ambiente de pruebas y contabilizando, para ver cómo cada operación afecta a las demás. Los roles permiten que cada estudiante asuma un cargo y la bitácora de auditoría muestra quién hizo cada operación.",
          "Novix ERP no gestiona procesos académicos como matrículas, notas o pensiones.",
        ],
      },
      {
        kind: "cards",
        id: "experiencia",
        eyebrow: "Experiencia de uso",
        title: "Diseñado para el trabajo diario",
        items: [
          { title: "Desde el navegador", text: "No requiere instalar programas en cada equipo; la interfaz se adapta al computador, la tableta y el celular." },
          { title: "Menú por áreas y por rol", text: "Gerencia, Compras, Almacén, Calidad, Ventas y logística, Contabilidad, Datos maestros y Administración: cada usuario ve solo lo que su rol permite." },
          { title: "Flujos guiados por estados", text: "Cada documento muestra solo las acciones válidas en su estado: enviar, aprobar, recibir, facturar o anular con motivo." },
          { title: "Varias empresas y sedes", text: "Un mismo acceso para todas las empresas del grupo, con la empresa activa siempre visible en la barra superior." },
          { title: "Documentos listos para enviar", text: "PDF y correo desde el mismo documento, con historial de envío." },
          { title: "Arranque con sus datos", text: "Plantillas para terceros, artículos, plan de cuentas y saldos iniciales, con validación antes de importar." },
        ],
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es Novix ERP?",
        a: "Es el sistema de gestión empresarial de DataSys Latam Group. Integra compras, inventario, calidad, ventas, logística, facturación, contabilidad, tesorería e indicadores en una sola base de datos, con acceso desde el navegador.",
      },
      {
        q: "¿Para qué tipo de empresas está pensado?",
        a: "Para pymes y medianas empresas comerciales, distribuidoras e industriales, y para entidades educativas que quieren ordenar su gestión logística, administrativa y financiera. Es especialmente útil cuando hay varias bodegas o sedes, productos con lote o vencimiento, o necesidad de control interno.",
      },
      {
        q: "¿Novix ERP emite factura electrónica válida ante la DIAN o el SENIAT?",
        a: "Novix ERP genera las facturas y notas, las numera y las contabiliza, y está preparado para conectarse con el proveedor tecnológico autorizado por la DIAN o la imprenta digital autorizada por el SENIAT que contrate su empresa. La validez fiscal depende de esa conexión, que se configura durante la implementación.",
      },
      {
        q: "¿Funciona en Colombia y en Venezuela?",
        a: "Sí. Cada empresa se configura con su país: impuestos, retenciones, numeración y reportes. Para Venezuela incluye libros de IVA, comprobantes de retención y el TXT para el SENIAT; para Colombia, el auxiliar de IVA y los certificados de retención en la fuente, IVA e ICA. Su contador debe validar los parámetros y reportes antes de presentarlos.",
      },
      {
        q: "¿Se instala en la nube o en nuestros servidores?",
        a: "Puede funcionar en la nube o en un servidor propio. En ambos casos se usa desde el navegador.",
      },
      {
        q: "¿Puedo activar solo los módulos que necesito?",
        a: "Sí. Los módulos operativos se activan por empresa; por ejemplo, una comercializadora puede trabajar sin el módulo de producción.",
      },
      {
        q: "¿Cómo pasamos nuestros datos actuales a Novix ERP?",
        a: "Con plantillas en CSV o Excel para terceros, artículos, plan de cuentas y saldos iniciales. El sistema valida cada fila antes de importarla, señala los errores para corregirlos y exige que otro usuario apruebe los saldos iniciales antes de contabilizarlos.",
      },
      {
        q: "¿Cómo se protege la información?",
        a: "Contraseñas cifradas, bloqueo tras cinco intentos fallidos, sesiones que vencen, permisos por rol, empresa y sede, segregación de funciones, límites de aprobación y bitácora de auditoría. También admite el inicio de sesión corporativo de su organización.",
      },
      {
        q: "¿Sirve para colegios, institutos o universidades?",
        a: "Sí, para su gestión logística, administrativa y financiera (compras, almacén, contabilidad, tesorería y presupuesto) y como herramienta educativa para que los estudiantes practiquen procesos empresariales reales. No gestiona procesos académicos como matrículas, notas o pensiones.",
      },
      {
        q: "¿Incluye nómina o CRM?",
        a: "No. Novix ERP se concentra en la operación, la logística y las finanzas. Las integraciones con otros sistemas se evalúan en el diagnóstico de cada proyecto.",
      },
      {
        q: "¿Tiene aplicación para celular?",
        a: "Se usa desde el navegador del celular o la tableta, con una interfaz que se adapta a la pantalla. Requiere conexión a internet.",
      },
      {
        q: "¿Cuánto cuesta Novix ERP?",
        a: "No manejamos cotizaciones estandarizadas. El valor depende de los módulos, el número de usuarios, la migración de datos y el acompañamiento que necesite. Tras un diagnóstico sin compromiso le entregamos una propuesta a la medida.",
      },
    ],
    related: [
      { label: "Digitalización y automatización de procesos", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
      { label: "Analítica de datos para empresas", href: "/servicios/analitica-de-datos" },
    ],
  },
  {
    path: "/producto/governex",
    metaTitle: "Governex: software para ISO 9001 y gestión de calidad",
    metaDescription:
      "Gestione su sistema de calidad ISO 9001 en una sola plataforma: procesos, riesgos, auditorías, no conformidades e indicadores, con IA. Pida una demostración.",
    eyebrow: "Governex · Plataforma de gestión de calidad",
    h1: "Software para sistemas de gestión de calidad ISO 9001",
    lead: "Su sistema de gestión de calidad completo y conectado, del contexto de la organización a la mejora continua. Governex reemplaza carpetas, hojas de cálculo y correos por un espacio donde procesos, riesgos, auditorías, indicadores y acciones de mejora trabajan juntos. La inteligencia artificial propone los borradores; su equipo revisa y decide.",
    heroImage: governexDashboard,
    heroImageAlt: "Resumen ejecutivo del sistema de gestión de calidad en Governex con indicadores, cumplimiento por proceso y mapa de riesgos",
    heroMockup: appGovernexSinFondo,
    heroHighlights: ["25 módulos del capítulo 4 al 10", "22 asistentes de inteligencia artificial", "Permisos por módulo y acción"],
    primaryCta: "Solicitar demostración",
    whatsappText: "Hola, quiero conocer Governex, el software para sistemas de gestión de calidad.",
    leadSubject: "Nuevo lead: Governex, demostración (sitio web)",
    breadcrumb: "Governex",
    schema: { type: "SoftwareApplication", name: "Governex", category: "BusinessApplication" },
    sections: [
      {
        kind: "cards",
        id: "problemas",
        eyebrow: "¿Le suena familiar?",
        title: "¿Su sistema de gestión de calidad vive en carpetas, correos y hojas de cálculo?",
        intro: "No es falta de compromiso: es falta de una plataforma que conecte el sistema.",
        items: [
          { title: "Documentos dispersos", text: "Nadie sabe cuál es la versión vigente ni en qué carpeta está." },
          { title: "Procesos desconectados", text: "La caracterización está en Word, los indicadores en Excel y los riesgos en otro archivo." },
          { title: "Acciones correctivas que se pierden", text: "Se abren después de cada auditoría y nadie hace seguimiento hasta la siguiente." },
          { title: "Sin trazabilidad", text: "No es posible ver qué hallazgo originó qué acción ni si fue eficaz." },
          { title: "Auditorías a contrarreloj", text: "Cada auditoría obliga a reconstruir evidencias durante semanas." },
          { title: "Indicadores tardíos", text: "Llegan a fin de mes, cuando ya no hay tiempo de corregir." },
        ],
      },
      {
        kind: "steps",
        id: "solucion",
        eyebrow: "La solución",
        title: "Un sistema de gestión de calidad conectado, de principio a fin",
        intro: "Governex organiza su SGC en los mismos capítulos que la norma y conecta la información entre módulos: el mapa de procesos alimenta los riesgos y los indicadores, los hallazgos de auditoría se convierten en no conformidades y la revisión por la dirección reúne lo que el sistema ya sabe.",
        items: [
          { title: "Describa su organización", text: "Registre los datos de la empresa, su mapa de procesos (también desde una imagen) y su organigrama." },
          { title: "Construya con IA", text: "Governex propone PESTEL, DOFA, caracterizaciones, matrices de roles y recursos, indicadores y riesgos; su equipo los ajusta." },
          { title: "Opere y mejore", text: "Auditorías, indicadores, no conformidades y acciones conectadas, con permisos para cada rol." },
        ],
      },
      {
        kind: "cards",
        id: "modulos",
        eyebrow: "Módulos",
        title: "Todo su SGC, organizado en seis áreas",
        intro: "25 módulos agrupados para que cada equipo encuentre lo suyo.",
        items: [
          { title: "Contexto y estrategia", text: "Ficha de la organización, partes interesadas, alcance del SGC, mapa de procesos, PESTEL y DOFA. Un contexto documentado y coherente en días, no en meses." },
          { title: "Riesgos y planificación", text: "Matriz de riesgos y oportunidades con mapa de calor y evaluación de eficacia, objetivos de calidad con mediciones y planificación de los cambios." },
          { title: "Procesos y operación", text: "Caracterización, planificación y control, requisitos de productos y servicios, diseño y desarrollo, compras, proveedores, producción, liberación y salidas no conformes." },
          { title: "Liderazgo y personas", text: "Política de calidad con registro de lectura, roles y autoridades, competencias, perfiles de cargo, capacitación, toma de conciencia y comunicación." },
          { title: "Evaluación del desempeño", text: "Programa de auditorías, hallazgos, indicadores, satisfacción del cliente y revisión por la dirección." },
          { title: "Mejora continua", text: "No conformidades, corrección inmediata, análisis de causa raíz con 5 Porqués e Ishikawa, acciones y oportunidades de mejora." },
        ],
      },
      {
        kind: "showcase",
        id: "contexto",
        eyebrow: "Contexto de la organización",
        title: "Del mapa de procesos al análisis completo",
        intro: "Construya su mapa de procesos a mano o cargue el de su empresa, y Governex arma el análisis del contexto para que su equipo lo revise.",
        points: [
          "Procesos estratégicos, misionales y de apoyo, con entradas del cliente y salidas de satisfacción.",
          "Lectura del mapa de procesos o del organigrama desde una imagen.",
          "PESTEL, DOFA y caracterización de procesos propuestos con inteligencia artificial.",
          "Partes interesadas y alcance del sistema documentados en la ficha de la organización.",
        ],
        image: governexMapaProcesos,
        imageAlt: "Mapa de procesos en Governex con procesos estratégicos, misionales y de apoyo",
        width: 1900,
        height: 910,
      },
      {
        kind: "showcase",
        id: "riesgos",
        eyebrow: "Pensamiento basado en riesgos",
        title: "Riesgos y oportunidades visibles para decidir a tiempo",
        intro: "La matriz parte del análisis del contexto y se mantiene viva con el tratamiento de cada riesgo.",
        points: [
          "Riesgos y oportunidades identificados desde PESTEL, DOFA y las actividades de los procesos.",
          "Mapa de calor por probabilidad e impacto, y niveles bajo, medio, alto y crítico.",
          "Estado de tratamiento, evidencias adjuntas y evaluación de la eficacia de las acciones.",
          "Los borradores propuestos por la IA se confirman antes de quedar en el registro.",
        ],
        image: governexRiesgos,
        imageAlt: "Matriz de riesgos y oportunidades de Governex con mapa de calor y registro de riesgos",
        width: 1885,
        height: 916,
        reverse: true,
      },
      {
        kind: "showcase",
        id: "roles",
        eyebrow: "Liderazgo",
        title: "Roles, responsabilidades y autoridad claros",
        intro: "Governex propone la matriz de roles a partir del organigrama y cada celda se puede editar.",
        points: [
          "Responsable, autoridad de decisión, funciones, recursos y rendición de cuentas por proceso.",
          "Procesos clasificados en estratégicos, misionales y de apoyo.",
          "Matriz de cargos complementaria y perfiles de cargo con su plan de capacitación.",
          "Política de calidad con registro de lectura del personal.",
        ],
        image: governexRoles,
        imageAlt: "Matriz de roles, responsabilidades y autoridad por proceso en Governex",
        width: 1900,
        height: 918,
      },
      {
        kind: "cards",
        id: "informacion-documentada",
        eyebrow: "Información documentada",
        title: "Su información documentada, organizada y bajo control",
        intro: "Del documento suelto en una carpeta a un listado maestro conectado con sus procesos.",
        items: [
          { title: "Listado maestro", text: "Manuales, políticas, procesos, instructivos y formatos en un solo lugar." },
          { title: "Codificación automática", text: "Cada documento recibe su código según el tipo, sin consecutivos manuales." },
          { title: "Ciclo de vida", text: "Estados borrador, en revisión, aprobado y obsoleto, con permisos por rol para cambiarlos." },
          { title: "Vínculo con los procesos", text: "Cada documento asociado a su proceso, con búsqueda y filtros por tipo y estado." },
          { title: "Documentación con IA", text: "Caracterizaciones, mapa y manual de procedimientos, fichas técnicas y guías de capacitación como punto de partida." },
          { title: "Evidencias seguras", text: "Archivos en almacenamiento en la nube, accesibles solo para su organización mediante enlaces temporales." },
        ],
      },
      {
        kind: "cards",
        id: "iso-9001",
        eyebrow: "ISO 9001:2015",
        title: "Organizado según la estructura de ISO 9001:2015",
        intro: "Cada capítulo tiene dónde gestionarse. Governex facilita la gestión de los requisitos; el uso de la plataforma no garantiza la certificación, que otorga un organismo de certificación independiente tras evaluar su sistema.",
        items: [
          { title: "4 · Contexto de la organización", text: "Ficha de la empresa, partes interesadas, alcance del SGC, mapa de procesos, PESTEL, DOFA y caracterización." },
          { title: "5 · Liderazgo", text: "Política de calidad con registro de lectura, matrices de roles y autoridades, y enfoque al cliente con PQRS y encuestas." },
          { title: "6 · Planificación", text: "Riesgos y oportunidades con mapa de calor y eficacia, objetivos de calidad con mediciones y planificación de los cambios." },
          { title: "7 · Apoyo", text: "Recursos, competencias, perfiles de cargo, capacitación, toma de conciencia, comunicación e información documentada." },
          { title: "8 · Operación", text: "Requisitos de productos y servicios, diseño y desarrollo, compras, proveedores, producción, liberación y salidas no conformes." },
          { title: "9 · Evaluación del desempeño", text: "Indicadores, satisfacción del cliente, programa y hallazgos de auditoría, y revisión por la dirección con análisis." },
          { title: "10 · Mejora", text: "No conformidades, corrección, causa raíz con 5 Porqués e Ishikawa, acciones y mejoras vinculadas a hallazgos." },
        ],
      },
      {
        kind: "cards",
        id: "ia",
        eyebrow: "Inteligencia artificial",
        title: "Inteligencia artificial que le propone, usted decide",
        intro: "22 asistentes convierten la información de su empresa en borradores listos para revisar. Nada se guarda ni se aprueba sin la revisión de su equipo.",
        items: [
          { title: "De la imagen al mapa", text: "Suba la imagen de su mapa de procesos o de su organigrama y Governex la convierte en información editable." },
          { title: "Contexto en un análisis", text: "PESTEL, DOFA, caracterizaciones, matrices de roles, cargos y recursos, e indicadores sugeridos." },
          { title: "Causa raíz guiada", text: "Propuesta de 5 Porqués o diagrama de Ishikawa (6M) para cada no conformidad, que su equipo edita." },
          { title: "Operación asistida", text: "Matriz legal, revisión de requisitos, fichas técnicas, lectura de cotizaciones, control de diseño y evaluación de proveedores." },
          { title: "Personas y capacitación", text: "Análisis del manual de funciones, lista de verificación del perfil, plan y guía de capacitación." },
          { title: "Cliente y dirección", text: "Encuestas de satisfacción, análisis de las respuestas y análisis de la revisión por la dirección." },
        ],
      },
      {
        kind: "chips",
        id: "beneficios",
        eyebrow: "Beneficios",
        title: "Convierta la gestión de calidad en una ventaja estratégica",
        intro: "Resultados para la organización, no solo funciones.",
        chips: [
          "Información del SGC en un solo lugar",
          "Control de la información documentada",
          "Trazabilidad del hallazgo a la acción",
          "Acciones vencidas visibles en el tablero",
          "No conformidades tratadas con método",
          "Riesgos, indicadores y revisión conectados",
          "Desempeño visible para la dirección",
          "Mejora continua con seguimiento",
        ],
      },
      {
        kind: "cards",
        id: "para-quien",
        eyebrow: "¿Para quién es?",
        title: "Diseñado para quienes gestionan la calidad",
        items: [
          { title: "Pymes", text: "Digitalice su SGC sin un equipo grande de calidad: la IA le ahorra semanas de redacción." },
          { title: "Empresas certificadas", text: "Mantenga el sistema vivo entre auditorías y llegue preparado a la de seguimiento." },
          { title: "Empresas en implementación", text: "Pase del diagnóstico a un sistema estructurado con una ruta clara por capítulos." },
          { title: "Consultores ISO", text: "Gestione a cada cliente en su propio espacio aislado, con la misma estructura de trabajo." },
          { title: "Responsables de calidad", text: "Deje de perseguir archivos y dedique su tiempo a analizar y mejorar." },
        ],
      },
      {
        kind: "cards",
        id: "diferenciadores",
        eyebrow: "Diferenciadores",
        title: "De la gestión tradicional a una plataforma integrada",
        items: [
          { title: "Listado maestro con códigos y estados", text: "En lugar de carpetas compartidas con versiones duplicadas." },
          { title: "Contexto, procesos, riesgos e indicadores conectados", text: "En lugar de matrices en hojas de cálculo separadas." },
          { title: "No conformidades con causa raíz y seguimiento", text: "En lugar de acciones correctivas perdidas en el correo." },
          { title: "Hallazgos vinculados a su no conformidad o mejora", text: "En lugar de hallazgos que se olvidan entre auditorías." },
          { title: "Revisión por la dirección consolidada", text: "En lugar de un informe armado a mano cada año, con análisis de IA sobre la información de los módulos." },
          { title: "Permisos por módulo y acción", text: "En lugar de archivos que cualquiera puede editar, con bitácora de actividad." },
        ],
      },
      {
        kind: "text",
        id: "respaldo",
        eyebrow: "DataSys Latam Group",
        title: "El software de un equipo que implementa sistemas de gestión",
        paragraphs: [
          "Governex nace de la experiencia de DataSys Latam Group en consultoría de sistemas de gestión y en desarrollo de software empresarial. Combinamos conocimiento de la norma, automatización de procesos e inteligencia artificial con un principio: primero ordenamos, después automatizamos.",
          "Si está empezando, puede combinar la plataforma con nuestra consultoría para diseñar e implementar su sistema.",
        ],
        link: { label: "Conozca la consultoría ISO 9001", href: "/servicios/consultoria-iso-9001" },
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es Governex?",
        a: "Es una plataforma web de DataSys Latam Group para gestionar y digitalizar el sistema de gestión de calidad: contexto, procesos, riesgos, operación, auditorías, indicadores y mejora, con asistentes de inteligencia artificial.",
      },
      {
        q: "¿Qué problemas resuelve?",
        a: "Información dispersa en carpetas y hojas de cálculo, procesos desconectados, acciones correctivas sin seguimiento, falta de trazabilidad y auditorías que obligan a reconstruir evidencias.",
      },
      {
        q: "¿Qué módulos incluye?",
        a: "25 módulos agrupados en contexto y estrategia, riesgos y planificación, procesos y operación, liderazgo y personas, evaluación del desempeño y mejora continua.",
      },
      {
        q: "¿Cómo funciona la gestión documental?",
        a: "Governex lleva el listado maestro de su información documentada, con codificación automática por tipo, estados (borrador, en revisión, aprobado y obsoleto) controlados por permisos y el vínculo de cada documento con su proceso.",
      },
      {
        q: "¿Cómo controla las versiones de los documentos?",
        a: "Cada documento registra su versión vigente y su estado dentro del ciclo de vida, y solo los roles autorizados pueden cambiarlos.",
      },
      {
        q: "¿Qué relación tiene con ISO 9001?",
        a: "Está organizado según la estructura de ISO 9001:2015, del capítulo 4 al 10, para que cada requisito tenga dónde gestionarse. Facilita la gestión, pero no garantiza la certificación, que otorga un organismo de certificación independiente.",
      },
      {
        q: "¿Cómo apoya las auditorías internas?",
        a: "Con un programa anual de auditorías con enfoque ISO 19011, su calendario y su PDF, el registro de hallazgos y su conversión en no conformidades u oportunidades de mejora.",
      },
      {
        q: "¿Cómo facilita las acciones correctivas?",
        a: "Cada no conformidad registra su origen, la corrección inmediata, el análisis de causa raíz con 5 Porqués o Ishikawa (que la IA puede proponer) y las acciones con fechas y estado.",
      },
      {
        q: "¿Qué hace la inteligencia artificial?",
        a: "Propone borradores: análisis del contexto, caracterizaciones, matrices, riesgos, fichas técnicas, encuestas, causa raíz y análisis de la revisión por la dirección, entre otros. Su equipo revisa, edita y decide.",
      },
      {
        q: "¿Mis datos están separados de los de otras empresas?",
        a: "Sí. Cada organización trabaja en su propio espacio, los archivos se entregan con enlaces temporales y el acceso se controla por rol, módulo y acción.",
      },
      {
        q: "¿Qué empresas pueden usarlo?",
        a: "Pymes, empresas en implementación o ya certificadas, consultores ISO y responsables de calidad de cualquier sector.",
      },
      {
        q: "¿Sirve para consultores que atienden varias empresas?",
        a: "Sí. Cada empresa cliente trabaja en su propio espacio aislado, con la misma estructura, y el consultor accede a cada una con su usuario.",
      },
      {
        q: "¿Cómo solicito una demostración?",
        a: "Con el formulario de esta página o por WhatsApp. Le mostramos la plataforma con un recorrido adaptado a su organización.",
      },
      {
        q: "¿Cómo se implementa y contrata?",
        a: PRICE_ANSWER,
      },
    ],
    related: [
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
      { label: "Novix ERP: software de gestión empresarial", href: "/producto/novix-erp" },
      { label: "Documentar procesos sin llenarse de papeles", href: "/blog/documentar-procesos-empresa-sin-papeles" },
    ],
  },
];

export const findLanding = (path: string) => LANDING_PAGES.find((p) => p.path === path) ?? null;
