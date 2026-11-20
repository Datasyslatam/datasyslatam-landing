import empresario from "@/assets/hero-empresario.webp";
import { heroBtnBlue, heroBtnOutline } from "./heroButtons";

/** Fondo de la diapositiva 2. La imagen es pequeña (508×576): en escritorio ocupa solo el lado derecho para no ampliarla demasiado. */
export const PremiumBackground = () => (
  <>
    <div className="absolute inset-0 lg:left-[40%]">
      <img src={empresario} alt="" width={508} height={576} decoding="async" className="h-full w-full object-cover object-[75%_20%]" />
    </div>
    <div className="absolute inset-0 bg-navy-900/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-900 lg:via-navy-900/85 lg:to-navy-900/20" />
    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-navy-900/20" />
  </>
);

/** Contenido de la diapositiva 2. */
export const PremiumContent = () => (
  <div className="max-w-2xl">
    <p className="label-corp text-electric-400 mb-4">02 — Evolución digital</p>
    <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight mb-6">
      Impulsamos la evolución <span className="text-[#FF8024]">digital de tu empresa.</span>
    </h2>
    <p className="mb-8 text-base md:text-lg text-steel-200 leading-relaxed max-w-lg">
      Creemos que la transformación digital no consiste simplemente en incorporar nuevas tecnologías. Comienza por comprender las necesidades reales de cada organización y convertirlas en soluciones que generen valor.
    </p>
    <div className="flex flex-wrap gap-4">
      <a href="#soluciones" className={heroBtnBlue}>Conocer nuestras soluciones</a>
      <a href="#contacto" className={heroBtnOutline}>Hablemos de su proyecto</a>
    </div>
  </div>
);
