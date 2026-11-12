// Página /servicios/gobernanza-ti: se descarga solo al visitarla (ver loadLanding en ../pages.ts).
import redesMovil from "@/assets/hero-evolucion-digital-movil.webp";
import redes from "@/assets/hero-evolucion-digital.webp";
import { PRICE_ANSWER, type LandingPage } from "../types";

const page: LandingPage = {
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
};

export default page;
