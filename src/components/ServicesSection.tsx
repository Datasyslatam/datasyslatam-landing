import { motion } from "framer-motion";
import { Settings, Code2, Server } from "lucide-react";

const services = [
  {
    icon: Settings,
    title: "Consultoría de Gestión",
    description: "Asistencia técnica y capacitación empresarial para la implementación de sistemas de gestión, normas de calidad (ISO) y gobernanza corporativa.",
    tags: ["ISO 9001", "Gobernanza", "Capacitación"],
  },
  {
    icon: Code2,
    title: "Desarrollo de Software",
    description: "Planificación, análisis, diseño, programación, implementación y soporte de software a la medida y plataformas digitales escalables.",
    tags: ["Apps Web", "Plataformas", "Soporte"],
  },
  {
    icon: Server,
    title: "Consultoría e Infraestructura IT",
    description: "Arquitectura tecnológica, diseño, instalación y mantenimiento de redes, equipos de cómputo, periféricos y soluciones en la nube.",
    tags: ["Redes", "Cloud", "Mantenimiento"],
  },
];

const ServicesSection = () => (
  <section id="servicios" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-lm font-semibold uppercase tracking-widest mb-3" style={{ color: "#e8711a" }}> Portafolio</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Nuestros <span className="gradient-text">Servicios</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Soluciones integrales que potencian cada dimensión de tu operación tecnológica.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
            className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 border border-border hover:border-primary/30"
          >
            <div className="p-6 flex justify-center items-center bg-muted/30 group-hover:bg-primary/5 transition-colors">
              <div className="w-20 h-20 rounded-xl gradient-bg flex items-center justify-center animate-float">
                <s.icon size={36} className="text-primary-foreground" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-card-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.description}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;