import { ChevronDown } from "lucide-react";

// Respuestas basadas solo en información publicada en el sitio. Se muestran como acordeón
// nativo (el texto está en el HTML aunque esté cerrado) y se publican como FAQPage para
// que Google y los asistentes de IA puedan citarlas.
const faqs = [
  {
    q: "¿Qué servicios ofrece DataSys Latam Group?",
    a: "Somos una empresa de Barranquilla que integra consultoría en sistemas de gestión ISO, desarrollo de software a la medida, inteligencia artificial, analítica de datos, sitios web y SEO. Acompañamos a las empresas desde ordenar sus procesos hasta automatizarlos y decidir con datos.",
  },
  {
    q: "¿Ofrecen consultoría ISO en Barranquilla?",
    a: "Sí. Desde Barranquilla acompañamos la implementación de sistemas de gestión con las normas ISO 9001 (calidad), ISO 14001 (ambiental), ISO 45001 (seguridad y salud en el trabajo), ISO 27001 (seguridad de la información), ISO 22301 (continuidad del negocio) e ISO 21001 (organizaciones educativas).",
  },
  {
    q: "¿Quién lidera la consultoría?",
    a: "Armando José López González, fundador. Ingeniero industrial, magíster en Gerencia de Empresas y especialista en Gerencia del Talento Humano, con 26 años de experiencia en ingeniería y sistemas de gestión. Desde 2016 es profesional en educación de ICONTEC y es conferencista del posgrado en Gerencia de la Calidad de la Universidad del Norte.",
  },
  {
    q: "¿Por qué ordenar los procesos antes de automatizarlos?",
    a: "Porque automatizar un proceso desordenado solo hace más rápido el desorden. Primero documentamos y ordenamos los procesos con criterio ISO; después los automatizamos con software, ERP y web a la medida, y finalmente construimos indicadores para decidir con datos.",
  },
  {
    q: "¿Qué es Governex?",
    a: "Governex es nuestra plataforma de gobernanza corporativa inteligente: simplifica, acelera y asegura el sistema de gestión ISO con inteligencia artificial, y ayuda a gestionar procesos, información, cumplimiento y toma de decisiones.",
  },
  {
    q: "¿Desarrollan sitios web y posicionamiento SEO?",
    a: "Sí. Diseñamos y desarrollamos sitios web y aplicaciones a la medida, y los optimizamos para que sus clientes lo encuentren en Google y en los asistentes de inteligencia artificial.",
  },
  {
    q: "¿Con qué tipo de empresas trabajan?",
    a: "Trabajamos con micro, pequeñas y medianas empresas, y con organizaciones de sectores como el público, la educación, la salud, el comercio y el inmobiliario.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Haga nuestro autodiagnóstico gratuito: en menos de 10 minutos sabrá en qué etapa está su empresa, sus principales riesgos y el siguiente paso recomendado. También puede escribirnos por WhatsApp al +57 324 624 9237 o a contacto@datasyslatam.com.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const FaqSection = () => (
  <section id="preguntas-frecuentes" aria-labelledby="faq-title" className="bg-white py-16 md:py-20">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Preguntas frecuentes</p>
        <h2 id="faq-title" className="text-2xl font-bold text-navy-900 md:text-3xl">
          Consultoría ISO, software y transformación digital en Barranquilla
        </h2>
      </div>
      <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group px-5 py-4 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-[#0b2a5e]">
              <h3 className="text-base">{q}</h3>
              <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-600 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[#0b2a5e]/80">{a}</p>
          </details>
        ))}
      </div>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
  </section>
);

export default FaqSection;
