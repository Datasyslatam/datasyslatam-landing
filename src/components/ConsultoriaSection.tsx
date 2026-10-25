import { motion } from "framer-motion";
import fundador from "@/assets/consultoria-fundador.webp";

const NORMAS = ["ISO 9001", "ISO 14001", "ISO 45001", "ISO 27001", "ISO 22301", "ISO 21001"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const ConsultoriaSection = () => (
  <section id="consultoria" aria-labelledby="consultoria-title" className="bg-[#f5f7fb] py-16 md:py-20">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        {/* Foto: entra desde la izquierda, hace un zoom suave al pasar el cursor y en escritorio ocupa el alto del texto */}
        <motion.figure
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group overflow-hidden rounded-2xl shadow-card"
        >
          <img
            src={fundador}
            alt="Armando José López González, fundador de DataSys Latam Group, dictando una capacitación sobre certificación ISO"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="h-80 w-full object-cover object-[35%_center] transition-transform duration-700 ease-out group-hover:scale-105 sm:h-96 lg:h-full lg:min-h-[520px]"
          />
        </motion.figure>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <motion.p variants={fadeUp} className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#B5560B]">
            Asesoría especializada
          </motion.p>
          {/* Mismo estilo que el título de "Nuestras soluciones" */}
          <motion.h2 variants={fadeUp} id="consultoria-title" className="mb-5 text-2xl font-bold text-navy-900 md:text-3xl">
            Experiencia que genera valor, conocimiento que transforma
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-3 text-lg font-bold text-[#0b2a5e]">
            Armando José López González
          </motion.p>
          {/* Justificado con guiones automáticos (lang="es") para evitar huecos entre palabras en pantallas estrechas */}
          <motion.p variants={fadeUp} className="mb-4 text-justify hyphens-auto text-base leading-relaxed text-[#0b2a5e]/80">
            Ingeniero industrial, magíster en Gerencia de Empresas y especialista en Gerencia del Talento Humano, con una trayectoria de 26 años de experiencia profesional en los campos de la ingeniería, la implementación y gestión de sistemas de gestión, y la formación profesional. Su experiencia integra conocimientos técnicos, visión estratégica y desarrollo del talento humano, orientados al fortalecimiento organizacional, la optimización de procesos y la mejora continua.
          </motion.p>
          <motion.p variants={fadeUp} className="mb-6 text-justify hyphens-auto text-base leading-relaxed text-[#0b2a5e]/80">
            Desde 2016, se desempeña como profesional en educación de ICONTEC, contribuyendo a la formación y actualización de profesionales en temas relacionados con los sistemas de gestión y la calidad. Asimismo, es conferencista del posgrado en Gerencia de la Calidad de la Universidad del Norte (Uninorte), donde comparte su experiencia y conocimientos para impulsar el desarrollo de competencias, el liderazgo y la excelencia en la gestión organizacional.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="mb-1.5 text-base font-bold text-[#0b2a5e]">Formación y talleres a la medida</h3>
            <p className="text-sm leading-relaxed text-[#0b2a5e]/75">
              Capacitamos a su equipo para que el sistema funcione sin depender del consultor. Talleres abiertos para empresarios, como "ISO sin papeleo: cómo ordenar su empresa en 90 días".
            </p>
          </motion.div>

          <motion.ul variants={stagger} aria-label="Normas en las que acompañamos" className="flex flex-wrap gap-2.5">
            {NORMAS.map((norma) => (
              <motion.li
                key={norma}
                variants={fadeUp}
                className="rounded-full bg-blue-100/70 px-4 py-1.5 text-sm font-bold text-[#0b2a5e] transition-colors hover:bg-blue-200/70"
              >
                {norma}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ConsultoriaSection;
