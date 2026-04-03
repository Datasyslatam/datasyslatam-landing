import logoImg from "@/assets/logo-datasyslatam.png";

const navLinks = ["Inicio", "Nosotros", "Servicios", "Contacto"];

const Footer = () => (
  <footer className="bg-hero py-12 border-t border-primary/10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Datasys Latam Group"
            width={130}
            height={42}
            loading="lazy"
            style={{
              height: 36,
              width: "auto",
              objectFit: "contain",
              mixBlendMode: "screen",
              filter: "brightness(1.05) contrast(1.05) drop-shadow(0 0 4px rgba(96,165,250,0.20))",
            }}
          />
          <p className="text-xs text-hero-muted">
            Barranquilla, Atlántico, Colombia
          </p>
        </div>

        <div className="flex gap-6">
          {navLinks.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-xs text-hero-muted hover:text-hero-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-hero-muted/20 text-center">
        <p className="text-xs text-hero-muted">
          © {new Date().getFullYear()} DataSys Latam Group S.A.S. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;