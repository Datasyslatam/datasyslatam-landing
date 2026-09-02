import { Building2, Share2, MonitorSmartphone, ShieldCheck, CloudUpload, Headphones } from "lucide-react";

const items = [
  {
    icon:  Building2,
    title: "Consultoría Tecnológica",
    desc:  "Analizamos su negocio y diseñamos la mejor estrategia tecnológica.",
  },
  {
    icon:  Share2,
    title: "Integración de Sistemas",
    desc:  "Conectamos sistemas, datos, APIs y servicios existentes.",
  },
  {
    icon:  MonitorSmartphone,
    title: "Desarrollo Web y Móvil",
    desc:  "Creamos aplicaciones escalables, modernas y seguras.",
  },
  {
    icon:  ShieldCheck,
    title: "Ciberseguridad",
    desc:  "Protegemos su información con estándares y mejores prácticas.",
  },
  {
    icon:  CloudUpload,
    title: "Cloud & DevOps",
    desc:  "Infraestructura en la nube, automatización y despliegue continuo.",
  },
  {
    icon:  Headphones,
    title: "Soporte y Mantenimiento",
    desc:  "Acompañamiento técnico para la continuidad y evolución de su solución.",
  },
];

const ServicesGridSection = () => (
  <section className="bg-white py-12">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">NUESTROS SERVICIOS</p>
        <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">Acompañamos cada etapa de su transformación</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((it) => (
          <div key={it.title} className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <it.icon className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-bold text-navy-900">{it.title}</h3>
            <p className="text-xs leading-snug text-gray-600">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesGridSection;