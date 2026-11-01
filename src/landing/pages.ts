// Páginas comerciales (landing pages) orientadas a palabras clave de compra. Cada una genera su HTML prerenderizado,
// sus metadatos, sus datos estructurados (Service o SoftwareApplication, migas de pan y FAQPage) y entra al sitemap.
// Todo el contenido sale de información ya publicada en el sitio: no se inventan cifras, clientes ni testimonios.
import fundador from "@/assets/consultoria-fundador.webp";
import appSoft from "@/assets/banners/app-producto-soft.webp";
import desarrolloSoftwareIa from "@/assets/banners/desarrollo-software-ia-sin-fondo.webp";
import asistenteNovaMovil from "@/assets/banners/asistente-nova-movil.webp";
import digitalizacionProcesos from "@/assets/banners/digitalizacion-procesos-sin-fondo.webp";
import inteligencia from "@/assets/banners/inteligencia-corporativo.webp";
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
  | "idea";

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
  | { kind: "cards"; id: string; eyebrow?: string; title: string; intro?: string; items: LandingCard[] }
  /** `layout: "line"` las muestra como una línea de proceso horizontal en escritorio. */
  | { kind: "steps"; id: string; eyebrow?: string; title: string; intro?: string; items: LandingCard[]; layout?: "line" }
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
      items: { icon: LandingIcon; title: string; text: string; points: string[]; href?: string; linkLabel?: string }[];
      /** Aclaración debajo de las tarjetas. */
      note?: string;
    }
  /** Preguntas en las que el visitante reconoce los problemas de su negocio, con un mensaje de cierre destacado. */
  | { kind: "problems"; id: string; eyebrow?: string; title: string; intro?: string; questions: string[]; closing: string }
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
  | { kind: "benefits"; id: string; eyebrow?: string; title: string; intro?: string; items: string[] }
  /** Niveles progresivos de intervención (inicial, intermedio, avanzado). */
  | {
      kind: "levels";
      id: string;
      eyebrow?: string;
      title: string;
      intro?: string;
      items: { name: string; title: string; text: string }[];
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
      image: string;
      imageAlt: string;
      width: number;
      height: number;
      caption?: string;
      reverse?: boolean;
      link?: { label: string; href: string };
    }
  /** Franja de llamado a la acción: el botón principal lleva al formulario y el secundario a WhatsApp. `points` resume lo que recibe el visitante. */
  | { kind: "cta"; id: string; eyebrow?: string; title: string; text: string; points?: string[]; primary: string; secondary: string }
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
    metaTitle: "Consultoría ISO 9001:2026 en Colombia | DataSys Latam Group",
    metaDescription:
      "Implementamos ISO 9001:2026 en Colombia y Latinoamérica: diagnóstico, transición desde 2015, auditoría interna y preparación para certificar. ¡Hablemos hoy!",
    metaKeywords: [
      "consultoria iso 9001",
      "consultoria iso barranquilla",
      "certificacion iso 9001 barranquilla",
      "auditoria iso barranquilla",
      "consultores de calidad atlantico",
      "consultoria iso colombia",
      "implementacion iso 9001 colombia",
      "transicion iso 9001 2026 colombia",
      "certificacion de calidad empresas colombia",
      "consultoria iso para pymes colombia",
      "consultoria iso latinoamerica",
      "asesoria certificacion iso latam",
      "sistemas de gestion de calidad latam",
      "ISO 9001:2026",
    ],
    shareImage: {
      src: "/og-consultoria-iso-9001.jpg",
      alt: "Consultoría ISO 9001:2026 de DataSys Latam Group para empresas de Barranquilla, Colombia y Latinoamérica",
      width: 1200,
      height: 630,
    },
    eyebrow: "Consultoría en sistemas de gestión",
    h1: "Consultoría ISO 9001 en Colombia",
    lead: "Implementamos su sistema de gestión de la calidad con criterio práctico y sin papeleo innecesario, para que su empresa llegue preparada a la certificación y el sistema funcione sin depender del consultor.",
    heroImage: fundador,
    heroImageAlt: "Armando José López González, consultor de DataSys Latam Group, dictando una capacitación sobre certificación ISO",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, me interesa la consultoría ISO 9001 para mi empresa.",
    leadSubject: "Nuevo lead: Consultoría ISO 9001 (sitio web)",
    breadcrumb: "Consultoría ISO 9001",
    schema: { type: "Service", name: "Consultoría ISO 9001 en Colombia", serviceType: "Consultoría e Implementación ISO 9001" },
    sections: [
      {
        kind: "steps",
        id: "como-trabajamos",
        eyebrow: "Cómo trabajamos",
        title: "Qué incluye la consultoría ISO 9001",
        intro: "Desde Barranquilla acompañamos a empresas de Colombia y Latinoamérica en cada etapa, de la primera evaluación a la auditoría de certificación.",
        items: [
          { title: "Diagnóstico de brechas", text: "Comparamos cómo opera hoy su empresa con los requisitos de la norma y definimos un alcance realista." },
          { title: "Diseño del sistema", text: "Mapa de procesos, riesgos y oportunidades, objetivos de calidad e información documentada a la medida de su tamaño." },
          { title: "Implementación y formación", text: "Ponemos el sistema en marcha con su equipo y lo capacitamos para que funcione sin depender del consultor." },
          { title: "Auditoría interna", text: "Verificamos que lo planificado se cumple, corregimos hallazgos y preparamos la revisión por la dirección." },
          { title: "Preparación para la certificación", text: "Le acompañamos al elegir un organismo certificador acreditado ante ONAC y al prepararse para la auditoría externa." },
        ],
      },
      {
        kind: "text",
        id: "iso-9001-2026",
        eyebrow: "Nueva edición",
        title: "Consultoría ISO 9001:2026 y transición desde la versión 2015",
        paragraphs: [
          "En septiembre de 2026 ISO publicó la ISO 9001:2026, sexta edición de la norma. Si su empresa empieza ahora, implementamos directamente la nueva edición para que no tenga que hacerlo dos veces.",
          "Si ya está certificada en ISO 9001:2015, le ayudamos a planear la transición dentro del plazo que defina su organismo certificador, enfocándonos en los cambios que más valor aportan a su operación.",
        ],
        link: { label: "Lea: ISO 9001 para pymes, por dónde empezar", href: "/blog/iso-9001-pymes-colombia-por-donde-empezar" },
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
        kind: "chips",
        id: "otras-normas",
        eyebrow: "Sistemas integrados",
        title: "Consultoría ISO más allá de la calidad",
        intro: "Si su empresa necesita integrar varios sistemas de gestión, también le acompañamos en:",
        chips: ["ISO 14001 (ambiental)", "ISO 45001 (seguridad y salud en el trabajo)", "ISO 27001 (seguridad de la información)", "ISO 22301 (continuidad del negocio)", "ISO 21001 (organizaciones educativas)"],
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Cuánto cuesta la consultoría ISO 9001?",
        a: "Depende del tamaño de la empresa, del número de procesos y del punto de partida. Tras un diagnóstico inicial le entregamos una propuesta con alcance y plazos definidos.",
      },
      {
        q: "¿Cuánto tiempo toma implementar ISO 9001?",
        a: "Depende de la madurez de sus procesos, del alcance que se defina y del tiempo que el equipo directivo dedique al proyecto. El sistema debe funcionar y generar evidencia durante un periodo antes de la auditoría externa.",
      },
      {
        q: "¿Es obligatorio certificarse en ISO 9001 en Colombia?",
        a: "No, la certificación es voluntaria. Se vuelve indispensable cuando un cliente privado la exige como condición para comprarle. En la contratación estatal, la Ley 1150 de 2007 establece que las certificaciones de calidad no pueden exigirse como requisito habilitante ni dar puntaje.",
      },
      {
        q: "¿Implementan la ISO 9001:2026 o la versión 2015?",
        a: "Si su empresa empieza ahora, implementamos directamente la ISO 9001:2026, publicada en septiembre de 2026. Si ya está certificada en la versión 2015, le ayudamos a planear la transición con su organismo certificador.",
      },
      {
        q: "¿Ustedes otorgan el certificado?",
        a: "No. El certificado lo otorga un organismo de certificación independiente; le recomendamos verificar que esté acreditado ante ONAC. Nosotros le acompañamos para llegar preparado a esa auditoría.",
      },
    ],
    related: [
      { label: "Governex: software para sistemas de gestión ISO", href: "/producto/governex" },
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
    heroImage: appSoft,
    heroImageAlt: "Aplicación web de gestión y asistente de inteligencia artificial en un celular, desarrollados por DataSys Latam Group",
    heroMockup: desarrolloSoftwareIa,
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
    metaTitle: "Inteligencia artificial para empresas | DataSys Latam",
    metaDescription:
      "Inteligencia artificial para empresas en Colombia: asistentes virtuales, lectura de documentos y modelos predictivos, con sus datos protegidos y una persona al mando.",
    eyebrow: "Inteligencia artificial",
    h1: "Inteligencia artificial para empresas",
    lead: "Integramos IA en su operación para automatizar tareas repetitivas, analizar información y atender mejor a sus clientes, con sus datos protegidos y siempre con una persona de su equipo al mando de las decisiones.",
    heroImage: inteligencia,
    heroImageAlt: "Profesional frente a una visualización de red neuronal que representa la inteligencia artificial aplicada a la empresa",
    heroImagePosition: "70% center",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, me interesa aplicar inteligencia artificial en mi empresa.",
    leadSubject: "Nuevo lead: Inteligencia artificial (sitio web)",
    breadcrumb: "Inteligencia artificial",
    schema: { type: "Service", name: "Inteligencia artificial para empresas", serviceType: "Integración de inteligencia artificial en procesos empresariales" },
    sections: [
      {
        kind: "cards",
        id: "que-hacemos",
        eyebrow: "Qué hacemos",
        title: "Inteligencia artificial aplicada a problemas concretos de su empresa",
        intro: "No aplicamos IA por moda: la usamos donde ahorra tiempo, reduce errores o le da información que hoy no tiene.",
        items: [
          { title: "Asistentes virtuales y chatbots", text: "Responden las preguntas frecuentes de sus clientes en su sitio web o WhatsApp a cualquier hora, y pasan a una persona los casos que lo requieren." },
          { title: "Lectura de documentos", text: "Extraen los datos de facturas, órdenes, formularios y correos para que su equipo deje de digitarlos." },
          { title: "Automatización inteligente", text: "Robots de software (RPA) para las tareas repetitivas, apoyados en IA cuando hay que interpretar un texto o clasificar una solicitud." },
          { title: "Modelos predictivos", text: "Anticipan la demanda, la rotación del inventario o el riesgo de cartera a partir de la historia de su propia empresa." },
          { title: "Minería de procesos", text: "Descubrimos cómo fluyen en realidad sus procesos a partir de los registros de sus sistemas, y dónde se pierden tiempo y dinero." },
          { title: "IA generativa para su equipo", text: "Redacción de informes, resúmenes y respuestas, con reglas de uso claras para no exponer información confidencial." },
        ],
      },
      {
        kind: "text",
        id: "ia-responsable",
        eyebrow: "IA responsable",
        title: "Sus datos protegidos y una persona al mando",
        paragraphs: [
          "La seguridad y la transparencia son parte de nuestros valores. Diseñamos cada solución con criterio de seguridad de la información, tomando como referencia la ISO/IEC 27001, y conforme a la ley colombiana de protección de datos personales (Ley 1581 de 2012).",
          "Le explicamos con claridad qué hace la IA, con qué datos trabaja y en qué puede equivocarse. Las decisiones que afectan a sus clientes, a su equipo o a su dinero se quedan en manos de una persona.",
          "Y si un problema se resuelve mejor sin IA, con una regla, un formulario o un reporte, se lo decimos: usted debe invertir solo en lo que le genera retorno.",
        ],
      },
      {
        kind: "steps",
        id: "metodologia",
        eyebrow: "Metodología",
        title: "Cómo llevamos la inteligencia artificial a su empresa",
        items: [
          { title: "Elegimos el caso de uso", text: "Buscamos la tarea donde la IA ahorra más tiempo o dinero y acordamos cómo vamos a medir el resultado." },
          { title: "Revisamos datos y procesos", text: "La IA es tan buena como la información que recibe: si el proceso no está ordenado, primero lo ordenamos." },
          { title: "Construimos un piloto", text: "Una primera versión acotada, con usuarios reales, para comprobar el valor antes de invertir más." },
          { title: "Integramos", text: "Conectamos la solución con su sitio web, WhatsApp, correo, ERP o los sistemas que ya usa." },
          { title: "Acompañamos y mejoramos", text: "Capacitamos a su equipo, medimos los resultados y ajustamos la solución con el uso." },
        ],
      },
      {
        kind: "text",
        id: "lo-usamos",
        eyebrow: "Lo usamos nosotros",
        title: "Inteligencia artificial que puede probar ahora mismo",
        paragraphs: [
          "El asistente de este sitio lo construimos nosotros: responde preguntas sobre nuestros servicios usando solo la información publicada, no registra el contenido de las conversaciones y, cuando hace falta, le ofrece hablar con una persona por WhatsApp o dejarnos un mensaje.",
          "Governex, nuestra plataforma para sistemas de gestión ISO, usa inteligencia artificial generativa para ayudar a formular los requisitos de la norma.",
        ],
        link: { label: "Conozca Governex", href: "/producto/governex" },
      },
      {
        kind: "chips",
        id: "tecnologias",
        eyebrow: "Tecnologías",
        title: "Tecnologías de inteligencia artificial que usamos",
        intro: "Elegimos la herramienta según el problema, el costo y dónde deben quedar sus datos:",
        chips: ["Machine learning", "Procesamiento de lenguaje natural", "Chatbots y asistentes virtuales", "RPA", "Python", "OpenAI", "Google Gemini"],
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Mi empresa es demasiado pequeña para usar inteligencia artificial?",
        a: "No. Muchas aplicaciones útiles, como un asistente para preguntas frecuentes o la lectura automática de facturas, son proyectos acotados. Empezamos por un caso de uso pequeño y medible, y crecemos solo si da resultados.",
      },
      { q: "¿Cuánto cuesta implementar inteligencia artificial en mi empresa?", a: PRICE_ANSWER },
      {
        q: "¿Qué pasa con la confidencialidad de mi información?",
        a: "Definimos con usted qué datos usa la solución, dónde se procesan y quién accede a ellos. Trabajamos con criterio de seguridad de la información, con la ISO/IEC 27001 como referencia, y conforme a la Ley 1581 de 2012 de protección de datos personales.",
      },
      {
        q: "¿La inteligencia artificial va a reemplazar a mi equipo?",
        a: "Nuestro enfoque es que la IA haga las tareas repetitivas para que su equipo dedique su tiempo a atender clientes y a decidir. Las decisiones importantes siguen en manos de personas.",
      },
      {
        q: "¿Necesito tener mis datos organizados antes de empezar?",
        a: "Ayuda, pero no es requisito. En el diagnóstico revisamos el estado de su información y, si hace falta, primero la ordenamos, porque la IA es tan buena como los datos que recibe.",
      },
    ],
    related: [
      { label: "Analítica de datos para empresas", href: "/servicios/analitica-de-datos" },
      { label: "Digitalización y automatización de procesos", href: "/servicios/digitalizacion-de-procesos" },
      { label: "Desarrollo de software a la medida para empresas", href: "/servicios/desarrollo-software-medida" },
    ],
  },
  {
    path: "/servicios/analitica-de-datos",
    metaTitle: "Analítica de datos para empresas | DataSys Latam",
    metaDescription:
      "Analítica de datos para empresas en Colombia: tableros de indicadores en Power BI, integración y calidad de datos, y modelos predictivos para decidir a tiempo.",
    eyebrow: "Datos & Analítica",
    h1: "Analítica de datos para empresas",
    lead: "Convertimos los datos que hoy están repartidos entre hojas de Excel, el sistema contable y el ERP en tableros de indicadores claros, para que usted deje de decidir por intuición y vea su negocio a tiempo.",
    heroImage: tecnologia,
    heroImageAlt: "Sala de trabajo con una pared de visualizaciones de datos que representa la analítica empresarial",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, me interesa la analítica de datos y un tablero de indicadores para mi empresa.",
    leadSubject: "Nuevo lead: Analítica de datos (sitio web)",
    breadcrumb: "Analítica de datos",
    schema: { type: "Service", name: "Analítica de datos para empresas", serviceType: "Analítica de datos e inteligencia de negocios" },
    sections: [
      {
        kind: "cards",
        id: "que-hacemos",
        eyebrow: "Qué hacemos",
        title: "De datos dispersos a decisiones a tiempo",
        items: [
          { title: "Tableros de indicadores", text: "Ventas, márgenes, cartera, inventario y productividad en un solo tablero, actualizado y fácil de leer para la gerencia." },
          { title: "Integración de datos", text: "Unimos la información de Excel, el sistema contable, el ERP y otras fuentes en una base ordenada y confiable." },
          { title: "Calidad de los datos", text: "Detectamos duplicados, vacíos e inconsistencias, y definimos reglas para que sus reportes cuadren." },
          { title: "Analítica descriptiva", text: "Entienda qué pasó y por qué: tendencias y comparaciones por periodo, cliente, producto o sede." },
          { title: "Modelos predictivos", text: "Anticipe la demanda, las ventas o el riesgo de cartera con modelos construidos sobre la historia de su empresa." },
          { title: "Datos en tiempo real", text: "Para las operaciones que no pueden esperar al cierre del mes, información que se actualiza a medida que ocurre." },
        ],
      },
      {
        kind: "text",
        id: "nuestro-enfoque",
        eyebrow: "Nuestro enfoque",
        title: "Primero los indicadores correctos, después el tablero",
        paragraphs: [
          "Un tablero atractivo con datos equivocados lleva a malas decisiones. Por eso empezamos por las preguntas que usted necesita responder y por los indicadores de cada proceso, con el mismo criterio de medición que piden los sistemas de gestión ISO.",
          "Después revisamos de dónde sale cada cifra y quién la actualiza, para que todos en la empresa confíen en el mismo número.",
        ],
        link: { label: "Haga el autodiagnóstico gratuito de 10 minutos", href: "/#autodiagnostico" },
      },
      {
        kind: "steps",
        id: "metodologia",
        eyebrow: "Metodología",
        title: "Cómo construimos su tablero de indicadores",
        items: [
          { title: "Definimos las preguntas", text: "Qué decisiones toma la gerencia y qué indicadores necesita para tomarlas." },
          { title: "Conectamos las fuentes", text: "Ubicamos dónde está cada dato y lo integramos sin que su equipo tenga que digitarlo de nuevo." },
          { title: "Limpiamos y validamos", text: "Corregimos inconsistencias y verificamos las cifras con su equipo antes de publicarlas." },
          { title: "Construimos el tablero", text: "Visualizaciones claras, con acceso según el rol de cada persona." },
          { title: "Formamos a su equipo", text: "Capacitamos a los usuarios para leer los indicadores y mantener la información al día." },
          { title: "Mejoramos", text: "Ajustamos indicadores y análisis a medida que su empresa crece." },
        ],
      },
      {
        kind: "chips",
        id: "herramientas",
        eyebrow: "Herramientas",
        title: "Herramientas de analítica de datos",
        intro: "Usamos herramientas probadas y, cuando es posible, aprovechamos las que su empresa ya tiene:",
        chips: ["Power BI", "Excel", "Python", "SQL", "PostgreSQL", "MySQL"],
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es un tablero de indicadores y para qué le sirve a mi empresa?",
        a: "Es una pantalla que reúne los indicadores clave de su negocio, como ventas, márgenes, cartera, inventario o productividad, actualizados y fáciles de leer. Le permite ver a tiempo lo que hoy descubre semanas después, con el cierre contable.",
      },
      {
        q: "Mis datos están en Excel y en varios sistemas, ¿se puede?",
        a: "Sí, es el punto de partida más común. Integramos las fuentes que ya tiene y, si hace falta, primero ordenamos la forma en que se capturan los datos.",
      },
      {
        q: "¿Necesito comprar licencias de Power BI?",
        a: "Depende del número de usuarios y de cómo se compartan los tableros. En el diagnóstico le recomendamos la opción más económica para su caso, incluidas las herramientas que ya tenga.",
      },
      { q: "¿Cuánto cuesta un proyecto de analítica de datos?", a: PRICE_ANSWER },
      {
        q: "¿Quién puede ver la información de los tableros?",
        a: "Configuramos el acceso según el rol: cada persona ve solo la información que necesita. La seguridad de la información es parte de nuestros valores y la aplicamos con la ISO/IEC 27001 como referencia.",
      },
    ],
    related: [
      { label: "Inteligencia artificial para empresas", href: "/servicios/inteligencia-artificial-empresas" },
      { label: "Digitalización y automatización de procesos", href: "/servicios/digitalizacion-de-procesos" },
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
    heroImage: gestion,
    heroImageAlt: "Hoja de cálculo de pedidos que pasa a una plataforma web de seguimiento de solicitudes y a un formulario digital en el celular",
    heroMockup: digitalizacionProcesos,
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
