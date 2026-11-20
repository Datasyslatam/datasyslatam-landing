import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import tecnologia from "@/assets/banners/tecnologia-corporativo.webp";
import inteligencia from "@/assets/banners/inteligencia-corporativo.webp";
import gestion from "@/assets/banners/gestion-corporativo.webp";
import transformacion from "@/assets/banners/transformacion-corporativo.webp";
import tecnologiaMovil from "@/assets/banners/tecnologia-corporativo-movil.webp";
import inteligenciaMovil from "@/assets/banners/inteligencia-corporativo-movil.webp";
import gestionMovil from "@/assets/banners/gestion-corporativo-movil.webp";
import transformacionMovil from "@/assets/banners/transformacion-corporativo-movil.webp";
import heroBg from "@/assets/hero-procesos-datasys.webp";
import heroBgMovil from "@/assets/hero-procesos-datasys-movil.webp";
import empresario from "@/assets/hero-empresario.webp";
import { PremiumBackground, PremiumContent } from "./HeroPremium";
import { PymeBackground, PymeContent } from "./HeroPyme";
import { heroBtnBlue, heroBtnOutline } from "./heroButtons";
import ResponsiveImage, { MOBILE_IMAGE_QUERY } from "./ResponsiveImage";

// Diapositivas 3 a 6: misma composición (foto a todo lo ancho y texto a la izquierda).
const banners = [
  {
    title: "**Tecnología**\nque __entiende__\ntu negocio",
    eyebrow: "03 — Tecnología aplicada",
    text: "En DatasysLatam Group Comprendemos primero el desafío para diseñar después la solución, integrando metodologías de innovación como Design Thinking.",
    image: tecnologia,
    imageMobile: tecnologiaMovil,
  },
  {
    title: "**Gestión proactiva**\n__asistida__\ncon IA",
    eyebrow: "04 — Gestión asistida",
    text: "Transita de una administración reactiva a una gestión proactiva asistida con IA, vive la experiencia de formular y definir los requerimientos de la norma ISO con IA generativa.",
    image: inteligencia,
    imageMobile: inteligenciaMovil,
  },
  {
    title: "**Gestión**\nque __construye__\nexcelencia",
    eyebrow: "05 — Gestión de excelencia",
    text: "Nuestra plataforma convierte la gestión diaria en evidencia de excelencia, garantizando el cumplimiento y la mejora continua de tu empresa.",
    image: gestion,
    imageMobile: gestionMovil,
  },
  {
    title: "**Transformación**\n__digital__ con\npropósito",
    eyebrow: "06 — Transformación digital",
    text: "Convertimos procesos tradicionales en ecosistemas digitales inteligentes, preparados para evolucionar junto con las organizaciones.",
    image: transformacion,
    imageMobile: transformacionMovil,
  },
];

type Banner = (typeof banners)[number];

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
const BannerBackground = ({ banner }: { banner: Banner }) => (
  <>
    <ResponsiveImage src={banner.image} mobileSrc={banner.imageMobile} alt="" decoding="async" className="h-full w-full object-cover object-center" />
    <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/30" />
    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-navy-900/20" />
  </>
);

const BannerContent = ({ banner }: { banner: Banner }) => (
  <div className="max-w-2xl">
    <p className="label-corp text-electric-400 mb-4">{banner.eyebrow}</p>
    <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight mb-6">
      {banner.title.split("\n").map((line, i) => (<span key={i} className="block">{hl(line)}</span>))}
    </h2>
    <p className="text-base md:text-lg text-steel-200 leading-relaxed max-w-lg">{hl(banner.text)}</p>
    <div className="flex flex-wrap gap-4 mt-10">
      <a href="#servicios" className={heroBtnBlue}>
        Ver servicios
        <ChevronRight size={16} aria-hidden="true" />
      </a>
      <a href="#contacto" className={heroBtnOutline}>
        Hablar con un experto
      </a>
    </div>
  </div>
);

/*
 * Todas las diapositivas comparten un mismo marco: el fondo se funde de una foto a la otra y el contenido sale y
 * entra deslizándose, igual en las seis. Los contenidos se apilan en la misma celda de una cuadrícula, así que el
 * héroe mide siempre lo que mide la diapositiva más alta: la barra de avance queda a la misma altura en todas y lo
 * que sigue en la página no sube ni baja al cambiar de diapositiva.
 */
const slides = [
  { background: <PymeBackground />, content: <PymeContent /> },
  { background: <PremiumBackground />, content: <PremiumContent /> },
  ...banners.map((banner) => ({ background: <BannerBackground banner={banner} />, content: <BannerContent banner={banner} /> })),
];

const TOTAL_SLIDES = slides.length;
const INTERVAL_MS = 8000;

// La entrada usa fotogramas (desde → hasta) para que siempre empiece del lado correcto según la dirección.
const contentVariants = {
  center: (d: number) => ({
    opacity: [0, 1],
    x: [d > 0 ? 40 : -40, 0],
    transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
  }),
  exit: (d: number) => ({
    opacity: 0,
    x: d > 0 ? -40 : 40,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

const HeroSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  // Se detiene mientras el foco está dentro del héroe (teclado, lector de pantalla o tras usar las flechas), para que
  // la diapositiva no cambie bajo el botón que el visitante está por usar (WCAG 2.2.2). No se pausa al pasar el
  // cursor: el héroe ocupa toda la pantalla y el carrusel dejaría de rotar.
  const [paused, setPaused] = useState(false);

  // Solo rota mientras el héroe está a la vista: no tiene sentido cambiar de diapositiva (ni gastar animaciones)
  // cuando el visitante ya está leyendo más abajo.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cuando la página termina de cargar, descarga en segundo plano las fotos de las demás diapositivas (la versión
  // liviana en el celular) para que cada cambio de diapositiva se vea de inmediato.
  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_IMAGE_QUERY).matches;
    const urls = [mobile ? heroBgMovil : heroBg, empresario, ...banners.map((b) => (mobile ? b.imageMobile : b.image))];
    const preload = () => urls.forEach((url) => (new Image().src = url));
    if (document.readyState === "complete") preload();
    else window.addEventListener("load", preload, { once: true });
    return () => window.removeEventListener("load", preload);
  }, []);

  // Se reinicia en cada cambio de diapositiva para que la navegación manual tenga el intervalo completo.
  useEffect(() => {
    if (!visible || paused) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActive((c) => (c + 1) % TOTAL_SLIDES);
    }, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, visible, paused]);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((c) => (c + dir + TOTAL_SLIDES) % TOTAL_SLIDES);
  };

  return (
    <section
      ref={ref}
      id="inicio"
      aria-roledescription="carrusel"
      aria-label="Presentación de DataSys Latam Group"
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setPaused(false)}
      className="relative flex min-h-[calc(100svh-72px)] flex-col overflow-hidden bg-navy-900 text-white"
    >
      <AnimatePresence initial={false}>
        <m.div key={active} aria-hidden="true" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
          {slides[active].background}
        </m.div>
      </AnimatePresence>
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent hidden lg:block" />

      {/* El héroe ocupa justo el espacio bajo el menú fijo (72 px). El contenido se centra en el alto que sobra y la
          barra de avance queda abajo, en el mismo lugar en las seis diapositivas. */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-10 pb-8 [@media(max-height:720px)]:pt-6 [@media(max-height:720px)]:pb-6">
        <div className="grid flex-1">
          {slides.map((slide, i) => {
            const isActive = i === active;
            return (
              <m.div
                key={i}
                custom={direction}
                variants={contentVariants}
                initial={false}
                animate={isActive ? "center" : "exit"}
                aria-hidden={!isActive || undefined}
                // inert: las diapositivas ocultas no reciben el foco del teclado ni clics mientras se desvanecen.
                {...(isActive ? {} : { inert: "" })}
                className={`[grid-area:1/1] self-center ${isActive ? "" : "pointer-events-none"}`}
              >
                {slide.content}
              </m.div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-4 [@media(max-height:720px)]:mt-5">
          <button type="button" onClick={() => go(-1)} aria-label="Diapositiva anterior" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-[#FF8024] transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: ((active + 1) / TOTAL_SLIDES) * 100 + "%" }} />
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Diapositiva siguiente" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold text-white/80 tabular-nums">
            <span aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}</span>
            <span className="sr-only">Diapositiva {active + 1} de {TOTAL_SLIDES}</span>
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />
    </section>
  );
};

export default HeroSection;
