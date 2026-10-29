// Páginas comerciales (landing pages) orientadas a palabras clave de compra. Cada una genera su HTML prerenderizado,
// sus metadatos, sus datos estructurados (Service o SoftwareApplication, migas de pan y FAQPage) y entra al sitemap.
// Todo el contenido sale de información ya publicada en el sitio: no se inventan cifras, clientes ni testimonios.
import fundador from "@/assets/consultoria-fundador.webp";
import appGovernex from "@/assets/banners/app-governex.webp";
import appSoft from "@/assets/banners/app-producto-soft.webp";

export interface LandingCard {
  title: string;
  text: string;
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
  | { kind: "steps"; id: string; eyebrow?: string; title: string; intro?: string; items: LandingCard[] }
  | { kind: "chips"; id: string; eyebrow?: string; title: string; intro: string; chips: string[] }
  | { kind: "text"; id: string; eyebrow?: string; title: string; paragraphs: string[]; link?: { label: string; href: string } }
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
  eyebrow: string;
  h1: string;
  lead: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCta: string;
  whatsappText: string;
  /** Asunto del correo cuando alguien llena el formulario de esta página. */
  leadSubject: string;
  breadcrumb: string;
  schema:
    | { type: "Service"; name: string; serviceType: string }
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
    metaTitle: "Consultoría ISO 9001 en Colombia | DataSys Latam Group",
    metaDescription:
      "Consultoría ISO 9001 en Colombia y Latinoamérica: diagnóstico, implementación, auditoría interna y preparación para la certificación con la edición 2026.",
    eyebrow: "Consultoría en sistemas de gestión",
    h1: "Consultoría ISO 9001 en Colombia",
    lead: "Implementamos su sistema de gestión de la calidad con criterio práctico y sin papeleo innecesario, para que su empresa llegue preparada a la certificación y el sistema funcione sin depender del consultor.",
    heroImage: fundador,
    heroImageAlt: "Armando José López González, consultor de DataSys Latam Group, dictando una capacitación sobre certificación ISO",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, me interesa la consultoría ISO 9001 para mi empresa.",
    leadSubject: "Nuevo lead: Consultoría ISO 9001 (sitio web)",
    breadcrumb: "Consultoría ISO 9001",
    schema: { type: "Service", name: "Consultoría ISO 9001 en Colombia", serviceType: "Consultoría en sistemas de gestión de la calidad ISO 9001" },
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
    metaTitle: "Desarrollo de software a la medida para empresas | DataSys",
    metaDescription:
      "Desarrollo de software a la medida para empresas en Colombia: aplicaciones web y móviles, sistemas empresariales e integración de sistemas con React, Python y Node.js.",
    eyebrow: "Desarrollo de software",
    h1: "Desarrollo de software a la medida para empresas",
    lead: "Construimos aplicaciones web, móviles y sistemas empresariales adaptados a sus procesos, integrados con lo que ya usa, para que su operación deje de depender de hojas de cálculo y tareas manuales.",
    heroImage: appSoft,
    heroImageAlt: "Plataforma de gestión empresarial desarrollada a la medida por DataSys Latam Group",
    primaryCta: "Cotizar mi proyecto",
    whatsappText: "Hola, quiero cotizar un desarrollo de software a la medida para mi empresa.",
    leadSubject: "Nuevo lead: Desarrollo de software a la medida (sitio web)",
    breadcrumb: "Desarrollo de software a la medida",
    schema: { type: "Service", name: "Desarrollo de software a la medida para empresas", serviceType: "Desarrollo de software a la medida" },
    sections: [
      {
        kind: "cards",
        id: "que-desarrollamos",
        eyebrow: "Qué desarrollamos",
        title: "Software a la medida para cada necesidad de su empresa",
        items: [
          { title: "Aplicaciones web y móviles", text: "Aplicaciones escalables, modernas y seguras para sus clientes, su equipo o sus proveedores." },
          { title: "Sistemas empresariales", text: "Plataformas de gestión y ERP a la medida que centralizan procesos que hoy están dispersos." },
          { title: "Integración de sistemas", text: "Conectamos sistemas, datos, APIs y servicios existentes para no digitar los mismos datos dos veces." },
          { title: "Automatización e inteligencia artificial", text: "Integramos IA para automatizar procesos, analizar información y crear nuevas capacidades." },
          { title: "Datos y tableros", text: "Transformamos sus datos en indicadores para tomar mejores decisiones." },
          { title: "Soporte y mantenimiento", text: "Acompañamiento técnico para la continuidad y evolución de su solución." },
        ],
      },
      {
        kind: "chips",
        id: "tecnologias",
        eyebrow: "Tecnologías",
        title: "Desarrollo de software a la medida para empresas en React y Python",
        intro: "Trabajamos con tecnologías modernas, probadas y con amplio soporte, elegidas según lo que su proyecto necesita:",
        chips: ["React", "Python", "Django", "Node.js", "PostgreSQL", "MySQL", "Docker", "GitHub", "Power BI", "OpenAI"],
      },
      {
        kind: "steps",
        id: "metodologia",
        eyebrow: "Metodología",
        title: "Un proceso claro, de la idea al software en producción",
        items: [
          { title: "Descubrimos", text: "Entendemos su negocio, procesos, usuarios y objetivos." },
          { title: "Diseñamos", text: "Definimos la arquitectura de la solución y la experiencia de usuario." },
          { title: "Desarrollamos", text: "Construimos la solución con tecnologías modernas y seguras." },
          { title: "Integramos", text: "Conectamos sistemas, datos, APIs y servicios existentes." },
          { title: "Implementamos", text: "Llevamos la solución al entorno productivo." },
          { title: "Evolucionamos", text: "Medimos resultados y mejoramos continuamente." },
        ],
      },
      {
        kind: "case",
        id: "caso",
        eyebrow: "Caso de éxito",
        title: "Del proceso manual a una plataforma integrada",
        name: "Plataforma de gestión empresarial",
        challenge: "Procesos manuales y dispersos.",
        solution: "Desarrollo de una plataforma web empresarial integrada.",
        tech: "Python · React · Node.js · PostgreSQL · APIs",
        result: "Centralización de procesos y disponibilidad de información en tiempo real.",
      },
      {
        kind: "text",
        id: "primero-procesos",
        eyebrow: "Nuestro enfoque",
        title: "Primero ordenamos el proceso, después lo automatizamos",
        paragraphs: [
          "Automatizar un proceso desordenado solo hace más rápido el desorden. Por eso, antes de escribir código, entendemos y ordenamos el proceso con criterio de sistemas de gestión; así el software resuelve el problema correcto.",
        ],
        link: { label: "Lea nuestros artículos de tecnología", href: "/blog?categoria=tecnologia" },
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Cuánto cuesta un desarrollo de software a la medida?",
        a: "Depende del alcance, del número de usuarios y de las integraciones necesarias. Tras entender su necesidad le entregamos una propuesta con alcance, etapas y plazos.",
      },
      {
        q: "¿Pueden integrar el nuevo software con los sistemas que ya usamos?",
        a: "Sí. La integración de sistemas es uno de nuestros servicios: conectamos sistemas, datos, APIs y servicios existentes para que la información fluya sin digitarla dos veces.",
      },
      {
        q: "¿Desarrollan aplicaciones móviles además de web?",
        a: "Sí. Desarrollamos aplicaciones web, móviles y sistemas empresariales adaptados a sus procesos.",
      },
      {
        q: "¿Qué pasa después de entregar el software?",
        a: "Ofrecemos soporte y mantenimiento para la continuidad y evolución de su solución, y medimos resultados para mejorarla de forma continua.",
      },
    ],
    related: [
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
      { label: "Governex: software para sistemas de gestión ISO", href: "/producto/governex" },
      { label: "Ciberseguridad básica para pymes", href: "/blog/ciberseguridad-basica-pymes-bajo-costo" },
    ],
  },
  {
    path: "/producto/governex",
    metaTitle: "Software para sistemas de gestión ISO | Governex",
    metaDescription:
      "Governex, software para sistemas de gestión ISO con inteligencia artificial: simplifica, acelera y asegura su sistema de gestión, cumplimiento y toma de decisiones.",
    eyebrow: "Governex · Nuestro producto",
    h1: "Software para sistemas de gestión ISO",
    lead: "Governex simplifica, acelera y asegura su sistema de gestión ISO con inteligencia artificial: pase de una administración reactiva a una gestión proactiva, con la información y el cumplimiento en un solo lugar.",
    heroImage: appGovernex,
    heroImageAlt: "Governex, plataforma de gobernanza corporativa inteligente para sistemas de gestión ISO",
    primaryCta: "Solicitar una demostración",
    whatsappText: "Hola, quiero conocer Governex, el software para sistemas de gestión ISO.",
    leadSubject: "Nuevo lead: Governex, demostración (sitio web)",
    breadcrumb: "Governex",
    schema: { type: "SoftwareApplication", name: "Governex", category: "BusinessApplication" },
    sections: [
      {
        kind: "cards",
        id: "que-hace",
        eyebrow: "Qué hace Governex",
        title: "Gobernanza corporativa inteligente para su sistema de gestión",
        intro: "Una plataforma diseñada para gestionar de manera estructurada los procesos de gobierno corporativo, la información, el cumplimiento y la toma de decisiones.",
        items: [
          { title: "Requisitos de la norma con IA", text: "Formule y defina los requerimientos de la norma ISO con inteligencia artificial generativa." },
          { title: "Procesos e información en un solo lugar", text: "Gestione de forma estructurada los procesos y la información de su sistema de gestión." },
          { title: "Cumplimiento bajo control", text: "Haga seguimiento al cumplimiento de su sistema y anticípese en lugar de reaccionar." },
          { title: "Decisiones informadas", text: "Apoye la toma de decisiones de la dirección con información organizada y disponible." },
        ],
      },
      {
        kind: "text",
        id: "consultoria-y-software",
        eyebrow: "Software y acompañamiento",
        title: "El software de un equipo que implementa sistemas de gestión",
        paragraphs: [
          "Governex nace de la experiencia de DataSys Latam Group en consultoría de sistemas de gestión ISO. Además de la plataforma, puede contar con nuestro acompañamiento para diseñar e implementar su sistema.",
        ],
        link: { label: "Conozca la consultoría ISO 9001", href: "/servicios/consultoria-iso-9001" },
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué es Governex?",
        a: "Governex es nuestra plataforma de gobernanza corporativa inteligente: simplifica, acelera y asegura el sistema de gestión ISO con inteligencia artificial, y ayuda a gestionar procesos, información, cumplimiento y toma de decisiones.",
      },
      {
        q: "¿Cómo puedo ver Governex en funcionamiento?",
        a: "Solicite una demostración con el formulario de esta página o por WhatsApp y le mostraremos cómo se adapta a su sistema de gestión.",
      },
      {
        q: "¿Necesito tener ya un sistema de gestión ISO para usar Governex?",
        a: "No necesariamente. Si está empezando, puede combinar la plataforma con nuestra consultoría para diseñar e implementar el sistema.",
      },
    ],
    related: [
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
      { label: "Desarrollo de software a la medida para empresas", href: "/servicios/desarrollo-software-medida" },
      { label: "Documentar procesos sin llenarse de papeles", href: "/blog/documentar-procesos-empresa-sin-papeles" },
    ],
  },
];

export const findLanding = (path: string) => LANDING_PAGES.find((p) => p.path === path) ?? null;
