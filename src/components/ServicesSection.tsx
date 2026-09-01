import { Code2, BrainCircuit, BarChart3, Settings, Rocket, ShieldCheck, ArrowRight } from "lucide-react";

const services = [
  {
    icon:  Code2,
    color: "text-blue-600",
    tint:  "bg-blue-50",
    title: "Desarrollo de Software",
    desc:  "Aplicaciones web, móviles y sistemas empresariales adaptados a sus procesos.",
  },
  {
    icon:  BrainCircuit,
    color: "text-purple-600",
    tint:  "bg-purple-50",
    title: "Inteligencia Artificial",
    desc:  "Integramos IA para automatizar procesos, analizar información y crear nuevas capacidades.",
  },
  {
    icon:  BarChart3,
    color: "text-emerald-600",
    tint:  "bg-emerald-50",
    title: "Datos & Analítica",
    desc:  "Transformamos datos en información valiosa para tomar mejores decisiones.",
  },
  {
    icon:  Settings,
    color: "text-[#FF8024]",
    tint:  "bg-orange-50",
    title: "Digitalización de operaciones",
    desc:  "Optimizamos procesos repetitivos para aumentar productividad y reducir costos.",
  },
  {
    icon:  Rocket,
    color: "text-blue-600",
    tint:  "bg-blue-50",
    title: "Transformación Digital",
    desc:  "Diseñamos hojas de ruta y modernizamos su operación con tecnología.",
  },
  {
    icon:  ShieldCheck,
    color: "text-red-500",
    tint:  "bg-red-50",
    title: "Gobernanza TI",
    desc:  "Alineamos la tecnología con sus objetivos, mejorando seguridad y cumplimiento.",
  },
];

const ServicesSection = () => (
  <section id="servicios" className="bg-white py-12">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-electric-400">NUESTRAS SOLUCIONES</p>
        <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">Soluciones tecnológicas para cada desafío empresarial</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">Combinamos estrategia, tecnología y datos para crear soluciones que impulsan su negocio.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((svc) => (
          <div key={svc.title} className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className={"mb-2 flex h-10 w-10 items-center justify-center rounded-lg " + svc.tint}>
              <svc.icon className={"h-6 w-6 " + svc.color} strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-bold text-navy-900">{svc.title}</h3>
            <p className="mb-2 text-xs leading-snug text-gray-600">{svc.desc}</p>
            <a href="#contacto" className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700">
              Conocer más <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;