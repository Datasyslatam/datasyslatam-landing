import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "2026",  label: "Fundada" },
  { value: "Latam", label: "Alcance Regional" },
  { value: "IA",    label: "Tecnología de Vanguardia" },
  { value: "ISO",   label: "Gestión de Calidad" },
];

// Gradiente reutilizable para texto
const gradientStyle: React.CSSProperties = {
  display: "inline-block",
  background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const HeroSection = () => (
  <section
    id="inicio"
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    {/* ── 1. Imagen de fondo ── */}
    <img
      src={heroBg}
      alt=""
      aria-hidden="true"
      width={1920}
      height={1080}
      loading="eager"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover object-center"
      style={{ zIndex: 0 }}
    />

    {/* ── 2. Overlay multi-capa para legibilidad total ── */}
    {/* Capa base: oscurece uniformemente toda la imagen */}
    <div
      className="absolute inset-0"
      style={{
        zIndex: 1,
        background: "rgba(8, 10, 24, 0.72)",
      }}
    />
    {/* Capa gradiente: más oscuro arriba (navbar) y abajo (stats) */}
    <div
      className="absolute inset-0"
      style={{
        zIndex: 2,
        background:
          "linear-gradient(to bottom, rgba(8,10,24,0.60) 0%, rgba(8,10,24,0.15) 35%, rgba(8,10,24,0.15) 65%, rgba(8,10,24,0.70) 100%)",
      }}
    />

    {/* ── 3. Glows decorativos encima del overlay ── */}
    <div
      className="absolute pointer-events-none animate-pulse-glow"
      style={{
        zIndex: 3,
        top: "30%", left: "15%",
        width: 420, height: 420,
        borderRadius: "50%",
        background: "hsl(221 83% 55% / 0.14)",
        filter: "blur(110px)",
      }}
    />
    <div
      className="absolute pointer-events-none animate-pulse-glow"
      style={{
        zIndex: 3,
        bottom: "20%", right: "12%",
        width: 340, height: 340,
        borderRadius: "50%",
        background: "hsl(292 84% 57% / 0.14)",
        filter: "blur(95px)",
      }}
    />

    {/* ── 4. Contenido ── */}
    <div
      className="relative w-full mx-auto px-4 sm:px-6 text-center"
      style={{ zIndex: 10, maxWidth: 900, paddingTop: 100, paddingBottom: 56 }}
    >

      {/* Subtítulo superior */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "hsl(292 84% 72%)",
          marginBottom: 24,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Transformación Digital · Innovación · IA
      </motion.p>

      {/* H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700,
          lineHeight: 1.12,
          color: "#f0f4ff",
          marginBottom: 24,
        }}
        className="text-[40px] sm:text-[54px] lg:text-[72px]"
      >
        <span style={{ color: "#f0f4ff" }}>Impulsamos la </span>
        <span
          style={{
            ...gradientStyle,
            background: "linear-gradient(90deg, #818cf8 0%, #a78bfa 60%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          evolución
        </span>
        <br />
        <span
          style={{
            ...gradientStyle,
            background: "linear-gradient(90deg, #a78bfa 0%, #c084fc 55%, #d946ef 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          digital
        </span>
        <span style={{ color: "#f0f4ff" }}> de tu empresa</span>
      </motion.h1>

      {/* Párrafo */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        style={{
          fontSize: 17,
          lineHeight: 1.75,
          color: "#cbd5e1",
          maxWidth: 600,
          margin: "0 auto",
          marginBottom: 40,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Soluciones tecnológicas, consultoría especializada e inteligencia artificial para
        organizaciones en Colombia, Suramérica y Centroamérica.
      </motion.p>

      {/* Botones */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.44 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <a
          href="#contacto"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 52,
            minWidth: 240,
            paddingInline: 32,
            borderRadius: 10,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 0 28px hsl(262 83% 58% / 0.50)",
            transition: "opacity 180ms",
            fontFamily: "Inter, system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Solicita tu Consultoría
        </a>

        <a
          href="#servicios"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 52,
            minWidth: 240,
            paddingInline: 32,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(203,213,225,0.30)",
            color: "#e2e8f0",
            fontWeight: 500,
            fontSize: 15,
            textDecoration: "none",
            transition: "background 180ms",
            fontFamily: "Inter, system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          Conoce Nuestros Servicios
        </a>
      </motion.div>

      {/* Stats */}
      <motion.dl
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.62 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-y-8"
        style={{
          maxWidth: 680,
          margin: "72px auto 0",
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <dd
              style={{
                display: "inline-block",
                fontSize: 34,
                fontWeight: 700,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                lineHeight: 1.1,
                marginBottom: 6,
                background:
                  "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.value}
            </dd>
            <dt
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 400,
                color: "#94a3b8",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {stat.label}
            </dt>
          </div>
        ))}
      </motion.dl>

    </div>
  </section>
);

export default HeroSection;