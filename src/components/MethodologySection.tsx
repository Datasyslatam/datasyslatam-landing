import { Search, Lightbulb, Code2, Rocket, BarChart2, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    num:   "01",
    icon:  Search,
    color: "text-cyan-400",
    title: "Descubrimos",
    desc:  "Entendemos su negocio, procesos, usuarios y objetivos.",
  },
  {
    num:   "02",
    icon:  Lightbulb,
    color: "text-cyan-400",
    title: "Diseñamos",
    desc:  "Definimos la arquitectura de solución y experiencia de usuario.",
  },
  {
    num:   "03",
    icon:  Code2,
    color: "text-cyan-400",
    title: "Desarrollamos",
    desc:  "Construimos la solución utilizando tecnologías modernas y seguras.",
  },
  {
    num:   "04",
    icon:  Rocket,
    color: "text-lime-400",
    title: "Integramos",
    desc:  "Conectamos sistemas, datos, APIs y servicios existentes.",
  },
  {
    num:   "05",
    icon:  BarChart2,
    color: "text-lime-400",
    title: "Implementamos",
    desc:  "Llevamos la solución al entorno productivo con éxito.",
  },
  {
    num:   "06",
    icon:  CheckCircle,
    color: "text-lime-400",
    title: "Evolucionamos",
    desc:  "Medimos resultados y mejoramos continuamente.",
  },
];

const MethodologySection = () => (
  <section className="relative overflow-hidden py-14" style={{ background: "linear-gradient(135deg, #061224 0%, #0A192F 100%)" }}>

    {/* node-network background overlay */}
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 600" aria-hidden="true" style={{ opacity: 0.22 }}>
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00B4D8" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#00B4D8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <polyline points="80,150 220,180 360,120 500,200 640,150 780,210 920,160" fill="none" stroke="#00B4D8" stroke-width="1.5" opacity="0.5"/>
      <polyline points="40,350 180,300 320,380 460,320 600,390 740,310 880,370" fill="none" stroke="#0052CC" stroke-width="1.5" opacity="0.4"/>
      <polyline points="100,480 260,420 400,500 540,430 680,490 820,400 960,460" fill="none" stroke="#00B4D8" stroke-width="1" opacity="0.3"/>
      <g fill="#00B4D8">
        <circle cx="220" cy="180" r="3"/><circle cx="500" cy="200" r="4"/><circle cx="780" cy="210" r="3"/>
        <circle cx="180" cy="300" r="3"/><circle cx="460" cy="320" r="4"/><circle cx="740" cy="310" r="3"/>
        <circle cx="260" cy="420" r="3"/><circle cx="540" cy="430" r="4"/><circle cx="820" cy="400" r="3"/>
      </g>
      <circle cx="200" cy="120" r="60" fill="url(#nodeGlow)"/>
      <circle cx="650" cy="280" r="80" fill="url(#nodeGlow)"/>
      <circle cx="850" cy="480" r="50" fill="url(#nodeGlow)"/>
    </svg>

    <div className="relative z-10 container mx-auto px-4 max-w-7xl">

      {/* header */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          NUESTRA METODOLOGÍA
        </p>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Un proceso claro para transformar su negocio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
          Acompañamos a su organización en cada etapa del proyecto.
        </p>
      </div>

      {/* 6-step flow with arrows */}
      <div className="grid grid-cols-2 items-start gap-y-8 gap-x-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
        {steps.map((step, i) => (
          <div key={step.num} className="relative flex flex-col items-center text-center">

            {/* glow ring behind number */}
            <div className="relative mb-3">
              <div className="absolute -inset-1 rounded-full bg-cyan-500/20 blur-sm" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/40 bg-[#0c1c32] shadow-[0_0_18px_rgba(0,180,216,0.25)]">
                <span className="text-lg font-bold text-cyan-400">{step.num}</span>
              </div>
            </div>

            {/* icon + title + desc */}
            <step.icon className={"mb-2 h-7 w-7 "+ step.color} strokeWidth={1.5} />
            <h3 className="mb-1 text-sm font-bold text-white">{step.title}</h3>
            <p className="max-w-[160px] text-xs leading-relaxed text-white/55">{step.desc}</p>

            {/* right arrow between steps (lg only) */}
            {i < steps.length - 1 && (
              <div className="absolute -right-2 top-6 z-20 hidden text-cyan-500 lg:block">
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MethodologySection;