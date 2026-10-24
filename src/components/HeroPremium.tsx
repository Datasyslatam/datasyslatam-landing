import { ArrowLeft, ArrowRight, Handshake, Target, Network, Shield } from "lucide-react";
import heroBg from "@/assets/hero-evolucion-digital.webp";

interface HeroPremiumProps {
  active: number;
  total: number;
  go: (direction: number) => void;
}

const HeroPremium = ({ active, total, go }: HeroPremiumProps) => {
  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-900 text-white">
      <img src={heroBg} alt="" aria-hidden="true" width={1920} height={1080} decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14 lg:py-20">
        <div className="max-w-2xl">
          <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight mb-6">
            Impulsamos la evolución <span className="text-[#FF8024]">digital de tu empresa.</span>
          </h1>
          <p className="mb-8 text-base md:text-lg text-steel-200 leading-relaxed max-w-lg">
            Creemos que la transformación digital no consiste simplemente en incorporar nuevas tecnologías. Comienza por comprender las necesidades reales de cada organización y convertirlas en soluciones que generen valor.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#servicios" className="rounded-full bg-[#FF8024] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">Conocer nuestras soluciones</a>
            <a href="#contacto" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">Hablemos de su proyecto</a>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Diapositiva anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" /></button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-[#FF8024]" style={{ width: ((active + 1) / total) * 100 + "%" }} /></div>
          <button type="button" onClick={() => go(1)} aria-label="Diapositiva siguiente" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"><ArrowRight className="h-4 w-4" /></button>
          <span className="text-sm font-semibold text-white/80">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <div className="mt-10 grid gap-4 rounded-2xl bg-white p-6 text-navy-900 sm:grid-cols-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Target className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">+10 años</p><p className="text-xs text-navy-900/70">Años de experiencia</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Network className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">+50</p><p className="text-xs text-navy-900/70">Proyectos Implementados</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Shield className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">100% Calidad</p><p className="text-xs text-navy-900/70">Enfoque Integral</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Handshake className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">Socios Aliados</p><p className="text-xs text-navy-900/70">Acompañamiento Estratégico</p></div></div>
        </div>
      </div>
    </section>
  );
};

export default HeroPremium;
