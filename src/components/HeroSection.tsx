import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import tecnologia from "@/assets/banners/tecnologia-corporativo.png";
import inteligencia from "@/assets/banners/inteligencia-corporativo.png";
import gestion from "@/assets/banners/gestion-corporativo.png";
import transformacion from "@/assets/banners/transformacion-corporativo.png";
import banner01 from "@/assets/banners/banner01.png";
import HeroPremium from "./HeroPremium";


const banners = [
  {
    title: "**Diseñamos e implementamos**",
    eyebrow: "01 — Diseño de soluciones",
    text: "soluciones de software, datos e inteligencia artificial que __optimizan procesos__, fortalecen la toma de decisiones y generan valor sostenible.",
    image: banner01,
  },
  {
    title: "**Tecnología**\nque __entiende__\ntu negocio",
    eyebrow: "02 — Tecnología aplicada",
    text: "En DatasysLatam Group Comprendemos primero el desafío para diseñar después la solución, integrando metodologías de innovación como Design Thinking.",
    image: tecnologia,
  },
  {
    title: "**Gestión proactiva**\n__asistida__\ncon IA",
    eyebrow: "03 — Gestión asistida",
    text: "Transita de una administración reactiva a una gestión proactiva asistida con IA, vive la experiencia de formular y definir los requerimientos de la norma ISO con IA generativa.",
    image: inteligencia,
  },
  {
    title: "**Gestión**\nque __construye__\nexcelencia",
    eyebrow: "04 — Gestión de excelencia",
    text: "Nuestra plataforma convierte la gestión diaria en evidencia de excelencia, garantizando el cumplimiento y la mejora continua de tu empresa.",
    image: gestion,
  },
  {
    title: "**Transformación**\n__digital__ con\npropósito",
    eyebrow: "05 — Transformación digital",
    text: "Convertimos procesos tradicionales en ecosistemas digitales inteligentes, preparados para evolucionar junto con las organizaciones.",
    image: transformacion,
  },
];

const INTERVAL_MS = 8000;

const hl = (str: string): ReactNode[] => {
 const out: ReactNode[] = [];
  str.split("**").forEach((np, a) => {
    if (a % 2 === 1) {
      out.push(<span key={"n" + a} className="text-navy-200">{np}</span>);
    } else {
      np.split("__").forEach((op, b) => {
        if (b % 2 === 1) {
          out.push(<span key={"o" + a + "_" + b} className="text-[#FF8024]">{op}</span>);
        } else if (op !== "") {
          out.push(<span key={"t" + a + "_" + b}>{op}</span>);
        }
      });
    }
  });
  return out;
};
const HeroSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((c) => (c + 1) % banners.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((c) => (c + dir + banners.length) % banners.length);
  };

  const banner = banners[active];

  const variants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -40 : 40,
    }),
  };

  return (
    active === 0 ? <HeroPremium active={active} total={banners.length} go={go} /> : (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-900">
      <AnimatePresence mode="sync">
        <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
          <img src={banner.image} alt="" aria-hidden className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-navy-900/20" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent hidden lg:block" />
      <div className="relative z-10 container mx-auto px-4 max-w-6xl pt-32 pb-24">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.p key={active + "-eyebrow"} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: "easeOut" }} className="label-corp text-electric-400 mb-4">
              {banner.eyebrow}
            </motion.p>
            <motion.h1 key={active + "-title"} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }} className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight mb-6">
              {banner.title.split("\n").map((line, i) => (<span key={i} className="block">{hl(line)}</span>))}
            </motion.h1>
            <motion.p key={active + "-text"} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }} className="text-base md:text-lg text-steel-200 leading-relaxed max-w-lg">
              {hl(banner.text)}
            </motion.p>
          </AnimatePresence>
          <motion.div className="flex flex-wrap gap-4 mt-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <a href="#servicios" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-white font-semibold text-sm tracking-wide hover:bg-electric-400 transition-colors duration-200 shadow-card">
              Ver servicios
              <ChevronRight size={16} />
            </a>
            <a href="#contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded border border-steel-400/50 text-steel-200 font-semibold text-sm tracking-wide hover:border-electric-400 hover:text-white transition-all duration-200">
              Hablar con un experto
            </a>
          </motion.div>
        </div>
        <div className="flex items-center gap-4 mt-12">
          <button onClick={() => go(-1)} aria-label="Anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-[#FF8024]" style={{ width: ((active + 1) / banners.length) * 100 + "%" }} />
          </div>
          <button onClick={() => go(1)} aria-label="Siguiente" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10">
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-white/80">{String(active + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />
    </section>
  )
  );
};

export default HeroSection;
