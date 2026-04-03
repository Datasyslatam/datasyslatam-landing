import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Cpu, Users } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Seguridad de la Información",
    text: "Protección de datos, buenas prácticas y cumplimiento normativo para blindar tu operación digital.",
  },
  {
    icon: TrendingUp,
    title: "Escalabilidad",
    text: "Arquitecturas diseñadas para crecer con tu negocio, desde startups hasta corporaciones multinacionales.",
  },
  {
    icon: Cpu,
    title: "Inteligencia Artificial",
    text: "Soluciones basadas en IA y analítica avanzada para automatizar procesos y potenciar la toma de decisiones.",
  },
  {
    icon: Users,
    title: "Buenas Prácticas",
    text: "Marcos de gobernanza, sistemas de gestión de calidad y metodologías ágiles alineadas a estándares internacionales.",
  },
];

const ValueSection = () => (
  <section id="propuesta" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-accent tracking-widest uppercase mb-3">Propuesta de Valor</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          ¿Por qué <span className="gradient-text">DATASYSLATAM</span>?
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 card-shadow hover:card-shadow-hover transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <v.icon size={24} className="text-primary-foreground" />
            </div>
            <h3 className="font-bold text-card-foreground mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ValueSection;