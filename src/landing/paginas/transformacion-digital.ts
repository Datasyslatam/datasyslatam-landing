// Página /servicios/transformacion-digital: se descarga solo al visitarla (ver loadLanding en ../pages.ts).
import transformacionMovil from "@/assets/banners/transformacion-corporativo-movil.webp";
import transformacion from "@/assets/banners/transformacion-corporativo.webp";
import { PRICE_ANSWER, type LandingPage } from "../types";

const page: LandingPage = {
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
};

export default page;
