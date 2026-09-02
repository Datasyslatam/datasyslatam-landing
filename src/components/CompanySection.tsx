import { Clock, ShieldCheck, User, Check } from "lucide-react";

const points = [
  { title: "Governex:", desc: "Simplifica, acelera y asegura el Sistema de Gestión ISO con IA." },
  { title: "Digitalización de operaciones:", desc: "Automatiza y centraliza procesos de forma ágil, inteligente y eficiente." },
  { title: "Consultores de sistemas de gestión:", desc: "Formación a la medida, asistencia técnica, normas ISO." },
  { title: "IA y software a la medida:", desc: "Desarrollamos soluciones tecnológicas y agentes con IA diseñados según necesidades específicas." },
  { title: "Analítica de datos y Big data:", desc: "Recopila, interpreta y controla la data para tomar la mejor decisión." },
  { title: "Gestión institucional educativa:", desc: "Portafolio de capacitaciones, gobernanza y enfoque STEAM+." },
];

const metrics = [
  { icon: Clock,       value: "+10",  label: "Años de experiencia" },
  { icon: ShieldCheck, value: "+50",  label: "Proyectos exitosos" },
  { icon: User,        value: "+30",  label: "Clientes satisfechos" },
  { icon: ShieldCheck, value: "100%", label: "Comprometidos con su crecimiento" },
];

const CompanySection = () => (
  <section className="bg-white py-16">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">SOMOS DATASYSLATAM GROUP</p>
          <h2 className="mb-4 text-2xl font-bold text-navy-900 md:text-3xl">Tecnología, experiencia y compromiso con su éxito</h2>
          <p className="mb-6 text-gray-600">Somos una startup tecnológica que integra desarrollo de software, inteligencia artificial, datos y consultoría para transformar organizaciones.</p>
          <ul className="mb-5 space-y-2.5">
            {points.map((pt) => (
              <li key={pt.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700"><span className="font-bold text-[#0A192F]">{pt.title}</span> {pt.desc}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <a href="#contacto" className="inline-flex items-center justify-center rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition duration-300 hover:bg-blue-50">Conózcanos más</a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <m.icon className="mb-3 h-8 w-8 text-blue-600" strokeWidth={1.5} />
              <span className="text-3xl font-bold text-navy-900">{m.value}</span>
              <span className="mt-1 text-xs leading-snug text-gray-600">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl shadow-md">
          <img
            src="../public/assets/company-scene.jpg"
            alt="Equipo de Datasys Latam en sala de juntas corporativa: presentador con traje azul marino y tableta PROYECTO DATASYS LATAM, equipo con uniformes y laptops"
            className="h-full min-h-[360px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export default CompanySection;
