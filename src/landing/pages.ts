// Páginas comerciales (landing pages) orientadas a palabras clave de compra. Cada una genera su HTML prerenderizado,
// sus metadatos, sus datos estructurados (Service o SoftwareApplication, migas de pan y FAQPage) y entra al sitemap.
// Todo el contenido sale de información ya publicada en el sitio: no se inventan cifras, clientes ni testimonios.
import fundador from "@/assets/consultoria-fundador.webp";
import appGovernex from "@/assets/banners/app-governex.webp";
import appSoft from "@/assets/banners/app-producto-soft.webp";
import inteligencia from "@/assets/banners/inteligencia-corporativo.webp";
import tecnologia from "@/assets/banners/tecnologia-corporativo.webp";
import gestion from "@/assets/banners/gestion-corporativo.webp";

// Respuesta común sobre el precio: el brochure establece que no hay cotizaciones estandarizadas, sino diagnóstico a la medida.
const PRICE_ANSWER =
  "No trabajamos con cotizaciones estandarizadas: cada empresa es distinta. Tras un diagnóstico a la medida de su operación le presentamos una ruta de acción clara, con alcance, etapas y plazos, sin ningún compromiso comercial, para que invierta solo en lo que realmente le genera retorno.";

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
    path: "/servicios/inteligencia-artificial-empresas",
    metaTitle: "Inteligencia artificial para empresas | DataSys Latam",
    metaDescription:
      "Inteligencia artificial para empresas en Colombia: asistentes virtuales, lectura de documentos y modelos predictivos, con sus datos protegidos y una persona al mando.",
    eyebrow: "Inteligencia artificial",
    h1: "Inteligencia artificial para empresas",
    lead: "Integramos IA en su operación para automatizar tareas repetitivas, analizar información y atender mejor a sus clientes, con sus datos protegidos y siempre con una persona de su equipo al mando de las decisiones.",
    heroImage: inteligencia,
    heroImageAlt: "Profesional frente a una visualización de red neuronal que representa la inteligencia artificial aplicada a la empresa",
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
    metaTitle: "Digitalización y automatización de procesos | DataSys",
    metaDescription:
      "Digitalización y automatización de procesos para pymes en Colombia: primero ordenamos con criterio ISO, después automatizamos con software, RPA e integraciones.",
    eyebrow: "Digitalización de operaciones",
    h1: "Digitalización y automatización de procesos",
    lead: "Optimizamos los procesos repetitivos de su empresa para que su equipo deje de copiar datos entre Excel, correo y WhatsApp: más productividad, menos errores y menores costos operativos.",
    heroImage: gestion,
    heroImageAlt: "Equipo de trabajo reunido en una sala con trazos de luz que representan procesos digitalizados",
    primaryCta: "Solicitar un diagnóstico",
    whatsappText: "Hola, quiero digitalizar y automatizar procesos de mi empresa.",
    leadSubject: "Nuevo lead: Digitalización de procesos (sitio web)",
    breadcrumb: "Digitalización de procesos",
    schema: { type: "Service", name: "Digitalización y automatización de procesos", serviceType: "Digitalización y automatización de procesos empresariales" },
    sections: [
      {
        kind: "cards",
        id: "senales",
        eyebrow: "¿Le suena familiar?",
        title: "Señales de que su empresa necesita digitalizar sus procesos",
        items: [
          { title: "Los mismos datos se digitan varias veces", text: "Pedidos que llegan por WhatsApp, se pasan a Excel y después al sistema contable." },
          { title: "La información depende de una persona", text: "Si alguien clave se ausenta, nadie sabe dónde está un pedido o en qué va un trámite." },
          { title: "Aprobaciones perdidas en el correo", text: "Solicitudes, compras y permisos que solo avanzan a punta de recordatorios." },
          { title: "Reportes que llegan tarde", text: "Armar el informe del mes toma días y, cuando llega, ya no sirve para decidir." },
          { title: "Errores que se repiten", text: "Cifras que no cuadran, despachos equivocados o facturas con datos incorrectos." },
          { title: "Crecer exige más trabajo manual", text: "Cada cliente nuevo aumenta las tareas repetitivas en lugar de aprovechar lo que ya existe." },
        ],
      },
      {
        kind: "cards",
        id: "que-hacemos",
        eyebrow: "Qué hacemos",
        title: "Qué digitalizamos y automatizamos",
        items: [
          { title: "Flujos de trabajo y aprobaciones", text: "Solicitudes, compras, permisos y aprobaciones en línea, con responsables y tiempos a la vista." },
          { title: "Formularios digitales", text: "Reemplazamos formatos en papel y hojas sueltas por formularios web y móviles que alimentan un solo sistema." },
          { title: "Automatización robótica (RPA)", text: "Robots de software que ejecutan tareas repetitivas: copiar datos entre sistemas, generar reportes o enviar notificaciones." },
          { title: "Integración de sistemas", text: "Conectamos su sitio web, ERP, sistema contable y demás herramientas para que la información fluya sin digitarla dos veces." },
          { title: "Gestión documental", text: "Documentos y registros organizados, con control de versiones y acceso según el rol, listos para una auditoría." },
          { title: "Plataformas a la medida", text: "Cuando ninguna herramienta del mercado se ajusta a su operación, desarrollamos la solución que necesita." },
        ],
      },
      {
        kind: "text",
        id: "nuestro-enfoque",
        eyebrow: "Nuestro enfoque",
        title: "Primero ordenamos, después automatizamos. Siempre con criterio ISO",
        paragraphs: [
          "Automatizar un proceso desordenado solo hace más rápido el desorden. Por eso, antes de elegir una herramienta, documentamos cómo funciona hoy el proceso, quién hace qué y dónde se pierde el tiempo, con el criterio de los sistemas de gestión ISO que aplicamos en nuestra consultoría.",
          "Esa es nuestra diferencia: entendemos el proceso y también construimos la herramienta. El resultado no es una carpeta de procedimientos ni un software que nadie usa, sino una operación que funciona sin depender de una sola persona.",
        ],
        link: { label: "Lea: documentar procesos sin llenarse de papeles", href: "/blog/documentar-procesos-empresa-sin-papeles" },
      },
      {
        kind: "steps",
        id: "ruta",
        eyebrow: "Metodología",
        title: "La ruta para digitalizar sus operaciones",
        items: [
          { title: "Ordenar", text: "Levantamos el mapa de sus procesos e identificamos las tareas repetitivas que más tiempo consumen." },
          { title: "Estandarizar", text: "Definimos cómo debe hacerse cada proceso y qué información necesita antes de llevarlo a una herramienta." },
          { title: "Automatizar", text: "Implementamos la solución por fases, empezando por el proceso que más retorno genera." },
          { title: "Decidir con datos", text: "Medimos tiempos y errores antes y después, y dejamos indicadores para seguir mejorando." },
        ],
      },
    ],
    testimonials: [],
    faq: [
      {
        q: "¿Qué diferencia hay entre digitalizar y automatizar?",
        a: "Digitalizar es pasar la información y los procesos del papel, el correo o las hojas sueltas a un sistema. Automatizar es que ese sistema ejecute por sí solo las tareas repetitivas. Normalmente se hace en ese orden.",
      },
      {
        q: "¿Por dónde empiezo a digitalizar mi empresa?",
        a: "Por el proceso que más tiempo consume o más errores genera. Si no lo tiene claro, el autodiagnóstico gratuito de 10 minutos le muestra en qué etapa está su empresa y cuál es el siguiente paso.",
      },
      {
        q: "¿Tengo que cambiar los sistemas que ya uso?",
        a: "No necesariamente. Siempre que es posible integramos y aprovechamos las herramientas que su empresa ya tiene; solo recomendamos reemplazarlas cuando el cambio genera un retorno claro.",
      },
      { q: "¿Cuánto cuesta digitalizar un proceso?", a: PRICE_ANSWER },
      {
        q: "¿Cómo logramos que el equipo use las nuevas herramientas?",
        a: "Involucramos desde el diseño a quienes ejecutan el proceso y los capacitamos durante la implementación. Una herramienta pensada con el equipo se adopta con más facilidad.",
      },
    ],
    related: [
      { label: "Desarrollo de software a la medida para empresas", href: "/servicios/desarrollo-software-medida" },
      { label: "Inteligencia artificial para empresas", href: "/servicios/inteligencia-artificial-empresas" },
      { label: "Consultoría ISO 9001 en Colombia", href: "/servicios/consultoria-iso-9001" },
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
