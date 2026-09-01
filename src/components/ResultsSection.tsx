import { Shield, ArrowDown, UserCog, Settings, FileSearch, Rocket, ShieldCheck } from "lucide-react";

const metrics = [
  {
    icon:    Shield,
    overlay: ArrowDown,
    color:   "text-cyan-400",
    arrow:   "↓",
    label:   "Costos operativos",
  },
  {
    icon:  UserCog,
    color: "text-cyan-400",
    arrow: "↑",
    label: "Productividad y eficiencia",
  },
  {
    icon:  Settings,
    color: "text-lime-400",
    arrow: "↑",
    label: "Automatización de procesos",
  },
  {
    icon:  FileSearch,
    color: "text-lime-400",
    arrow: "↑",
    label: "Calidad de la información",
  },
  {
    icon:  Rocket,
    color: "text-lime-400",
    arrow: "↑",
    label: "Capacidad de decisión",
  },
  {
    icon:  ShieldCheck,
    color: "text-lime-400",
    arrow: "↑",
    label: "Experiencia del cliente",
  },
];

const ResultsSection = () => (
  <section className="relative overflow-hidden py-10" style={{ background: "linear-gradient(135deg, #061224 0%, #0A192F 100%)" }}>
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 200" style={{ opacity: 0.22 }}>
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="#00B4D8" strokeWidth="1" fill="none" opacity="0.45">
        <path d="M80 70 L260 45 L430 95 L600 55 L780 90 L960 50 L1140 100" />
        <path d="M150 150 L340 125 L520 160 L700 130 L900 155 L1080 125" />
        <path d="M260 45 L340 125" />
        <path d="M600 55 L700 130" />
        <path d="M960 50 L900 155" />
      </g>
      <g fill="#00B4D8">
        <circle cx="80" cy="70" r="2.5" /><circle cx="260" cy="45" r="2.5" /><circle cx="430" cy="95" r="2.5" /><circle cx="600" cy="55" r="2.5" /><circle cx="780" cy="90" r="2.5" /><circle cx="960" cy="50" r="2.5" /><circle cx="1140" cy="100" r="2.5" />
        <circle cx="150" cy="150" r="2.5" /><circle cx="340" cy="125" r="2.5" /><circle cx="520" cy="160" r="2.5" /><circle cx="700" cy="130" r="2.5" /><circle cx="900" cy="155" r="2.5" /><circle cx="1080" cy="125" r="2.5" />
      </g>
      <g fill="url(#nodeGlow)">
        <circle cx="260" cy="45" r="16" />
        <circle cx="600" cy="55" r="16" />
        <circle cx="960" cy="50" r="16" />
      </g>
    </svg>
    <div className="relative z-10 container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="lg:w-2/5">
          <h2 className="text-2xl font-bold leading-snug text-white md:text-3xl">No se trata de implementar tecnología. Se trata de generar resultados.</h2>
          <p className="mt-3 text-sm text-white/70">Nuestro enfoque combina estrategia, tecnología, datos e inteligencia artificial para lograr:</p>
        </div>
        <div className="hidden w-px self-stretch bg-white/15 lg:block" />
        <div className="lg:w-3/5 grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center px-1 text-center">
              <div className="relative">
                <m.icon className={"h-7 w-7 " + m.color} strokeWidth={1.5} />
                {m.overlay && <m.overlay className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-navy-900 text-cyan-300" strokeWidth={2.5} />}
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-white"><span className={m.color}>{m.arrow}</span> {m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ResultsSection;