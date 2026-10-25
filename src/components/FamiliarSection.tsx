import { motion } from "framer-motion";
import { ArrowRight, Calculator, FileSpreadsheet, Search, ShieldCheck, type LucideIcon } from "lucide-react";
import { heroBtnOrange } from "./heroButtons";
import { AUTODIAGNOSTICO_HASH } from "./autodiagnostico/data";

interface Pain {
  quote: string;
  solution: string;
  icon: LucideIcon;
  /** Tonos de la tarjeta: fondo del icono, color del icono/solución y línea superior. */
  tint: string;
  accent: string;
  bar: string;
}

// Mismos tonos que "Nuestras soluciones" para mantener la coherencia del sitio.
const pains: Pain[] = [
  {
    quote: "Mi gente pasa el día copiando datos entre Excel, correo y WhatsApp.",
    solution: "Automatización de procesos",
    icon: FileSpreadsheet,
    tint: "bg-blue-50",
    accent: "text-blue-600",
    bar: "bg-blue-500",
  },
  {
    quote: "Un cliente grande me exige ISO y no sé por dónde empezar.",
    solution: "ISO 9001 con Governex",
    icon: ShieldCheck,
    tint: "bg-orange-50",
    accent: "text-orange-600",
    bar: "bg-orange-500",
  },
  {
    quote: "No sé cuánto gano de verdad hasta que el contador me entrega el cierre.",
    solution: "Tableros de indicadores",
    icon: Calculator,
    tint: "bg-emerald-50",
    accent: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  {
    quote: "Mis clientes me buscan en Google y encuentran a la competencia.",
    solution: "Sitio web y SEO",
    icon: Search,
    tint: "bg-purple-50",
    accent: "text-purple-600",
    bar: "bg-purple-500",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FamiliarSection = () => (
  <section aria-labelledby="familiar-title" className="bg-white py-16 md:py-20">
    <div className="container mx-auto px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 max-w-2xl"
      >
        <h2 id="familiar-title" className="mb-3 text-3xl md:text-4xl font-bold text-[#0b2a5e]">
          ¿Le suena familiar?
        </h2>
        <p className="text-base text-steel-500">
          Son las frases que más escuchamos de dueños y gerentes de empresas como la suya.
        </p>
      </motion.div>

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {pains.map(({ quote, solution, icon: Icon, tint, accent, bar }) => (
          <motion.li
            key={quote}
            variants={card}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${bar}`} />
            <span aria-hidden="true" className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${tint}`}>
              <Icon className={`h-5 w-5 ${accent}`} strokeWidth={1.75} />
            </span>
            <blockquote className="mb-5 text-base font-semibold leading-relaxed text-[#0b2a5e]">
              “{quote}”
            </blockquote>
            {/* Altura mínima para dos líneas: así los separadores quedan alineados entre tarjetas. */}
            <p className="mt-auto min-h-[4.5rem] border-t border-gray-100 pt-4 text-sm">
              <span className="block text-xs text-steel-500">Lo resolvemos con</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${accent}`}>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> {solution}
              </span>
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#0b2a5e]/5 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-lg font-bold text-[#0b2a5e]">¿Se identificó con alguna?</p>
          <p className="text-sm text-steel-500">Descubra en 10 minutos qué tan ordenada está su empresa y cuál es el siguiente paso.</p>
        </div>
        <a href={AUTODIAGNOSTICO_HASH} className={`${heroBtnOrange} shrink-0`}>
          Hacer el autodiagnóstico gratis
        </a>
      </motion.div>
    </div>
  </section>
);

export default FamiliarSection;
