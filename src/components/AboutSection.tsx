import { motion } from "framer-motion";
import { Target, Eye, Gem } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Misión",
    text: "Impulsar la transformación digital de organizaciones en Colombia, Suramérica y Centroamérica mediante soluciones tecnológicas innovadoras, consultoría especializada y servicios integrales orientados a optimizar procesos y fortalecer la toma de decisiones.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "Ser líder en Latinoamérica en consultoría tecnológica y transformación digital, reconocida por convertir procesos tradicionales en ecosistemas digitales inteligentes mediante analítica de datos, automatización e inteligencia artificial.",
  },
  {
    icon: Gem,
    title: "Valores",
    text: "Innovación tecnológica, orientación al cliente, integridad y transparencia, excelencia operativa, colaboración, adaptabilidad digital y compromiso con los resultados.",
  },
];

const AboutSection = () => (
  <section id="nosotros" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-accent tracking-widest uppercase mb-3">Sobre Nosotros</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Tecnología con <span className="gradient-text">propósito</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <strong>DataSys Latam Group S.A.S.</strong> es una empresa de tecnología constituida en 2026,
          con sede en Barranquilla, Atlántico, Colombia. Nuestro liderazgo técnico fusiona experiencia
          en sistemas de gestión, infraestructura IT e inteligencia artificial para acompañar a las
          organizaciones en su camino hacia la transformación digital.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
            className="bg-card rounded-xl p-8 card-shadow hover:card-shadow-hover transition-shadow duration-300 border border-border"
          >
            <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-5">
              <p.icon size={22} className="text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-3">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;