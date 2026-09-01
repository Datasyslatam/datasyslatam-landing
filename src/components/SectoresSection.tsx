import { Building2, Landmark, GraduationCap, HeartPulse, ShoppingCart, Building } from "lucide-react";

const sectors = [
  { icon: Building2,     title: "Empresas",        desc: "Soluciones para optimizar procesos y gestionar su operación." },
  { icon: Landmark,      title: "Sector Público",  desc: "Digitalización, automatización y gestión de información." },
  { icon: GraduationCap, title: "Educación",        desc: "Plataformas educativas y gestión académica inteligente." },
  { icon: HeartPulse,    title: "Salud",            desc: "Sistemas de información y automatización para instituciones de salud." },
  { icon: ShoppingCart,  title: "Comercio",          desc: "E-commerce, CRM y automatización de procesos comerciales." },
  { icon: Building,      title: "Inmobiliario",      desc: "Plataformas para gestión, comercialización y análisis de proyectos." },
];

const SectoresSection = () => (
  <section className="bg-white py-12">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          SOLUCIONES PARA DIFERENTES SECTORES
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {sectors.map((s) => (
          <div key={s.title} className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <s.icon className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-bold text-navy-900">{s.title}</h3>
            <p className="text-xs leading-snug text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SectoresSection;