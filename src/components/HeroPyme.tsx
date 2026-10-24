import { ArrowLeft, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-evolucion-digital.webp";
import { heroBtnBlue, heroBtnOrange } from "./heroButtons";
import { whatsappUrl } from "@/lib/whatsapp";
import { AUTODIAGNOSTICO_HASH } from "./autodiagnostico/data";

interface HeroPymeProps {
  active: number;
  total: number;
  go: (direction: number) => void;
}

const WHATSAPP_URL = whatsappUrl("Hola, quisiera ordenar y automatizar los procesos de mi empresa.");

const risks = [
  "Procesos clave sin documentar: dependen de 2 o 3 personas.",
  "Información repartida entre Excel, correo y WhatsApp.",
  "Sin indicadores para decidir a tiempo.",
];

const STAGES = 4;

const HeroPyme = ({ active, total, go }: HeroPymeProps) => (
  <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-900 text-white">
    <img src={heroBg} alt="" aria-hidden="true" width={1920} height={1080} decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/10" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/30" />
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:py-10">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="label-corp text-electric-400 mb-5">
            01 — Para micro, pequeñas y medianas empresas
          </p>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-6">
            Su empresa ya creció. Ahora hagamos que{" "}
            <span className="text-[#FF8024]">funcione sin depender de usted.</span>
          </h1>
          <p className="mb-8 max-w-xl text-base md:text-lg leading-relaxed text-white/80">
            Primero ordenamos sus procesos con criterio ISO. Después los automatizamos con software, ERP y web a la medida. Así usted deja de apagar incendios y decide con datos.
          </p>
          <div className="flex flex-col items-start gap-4">
            {/* CTA principal: pulsa suavemente para llamar la atención (solo halo, sin movimiento, si el usuario lo prefiere); se detiene al pasar el cursor. */}
            <a href={AUTODIAGNOSTICO_HASH} className={`${heroBtnOrange} animate-cta-pulse motion-reduce:animate-cta-glow hover:animate-none`}>
              Descubra en 10 minutos qué tan ordenada está su empresa
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={heroBtnBlue}>
              Hablar por WhatsApp
            </a>
          </div>
        </div>

        <aside aria-label="Ejemplo de resultado del autodiagnóstico" className="w-full rounded-2xl bg-white p-6 sm:p-7 text-[#0b2a5e] shadow-2xl lg:max-w-md lg:justify-self-end">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel-500">Ejemplo de resultado</p>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#B5560B]">Autodiagnóstico</span>
          </div>
          <h2 className="mb-4 text-xl sm:text-2xl font-bold leading-snug">
            Su empresa está en la etapa <span className="text-[#E07B1A]">1 · Ordenar</span>
          </h2>
          <div className="mb-5 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: STAGES }, (_, i) => (
              <span key={i} className={"h-1.5 flex-1 rounded-full " + (i === 0 ? "bg-[#F28C28]" : "bg-gray-200")} />
            ))}
          </div>
          <p className="mb-3 text-sm font-bold">Sus 3 riesgos principales</p>
          <ol className="mb-5 space-y-2.5 text-sm text-[#0b2a5e]/90">
            {risks.map((risk, i) => (
              <li key={risk} className="flex gap-3">
                <span className="font-bold text-[#E07B1A]">{i + 1}</span>
                <span>{risk}</span>
              </li>
            ))}
          </ol>
          <p className="border-t border-gray-200 pt-4 text-sm leading-relaxed">
            <strong>Siguiente paso recomendado:</strong> mapa de procesos y plan de trabajo ISO 9001.
          </p>
        </aside>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button type="button" onClick={() => go(-1)} aria-label="Diapositiva anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" /></button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-[#FF8024]" style={{ width: ((active + 1) / total) * 100 + "%" }} /></div>
        <button type="button" onClick={() => go(1)} aria-label="Diapositiva siguiente" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"><ArrowRight className="h-4 w-4" /></button>
        <span className="text-sm font-semibold text-white/80">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  </section>
);

export default HeroPyme;
