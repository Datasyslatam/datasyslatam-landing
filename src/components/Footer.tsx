import logoImg from "@/assets/logo-datasyslatam.png";

const navLinks = [
  { label: "Inicio",    href: "#inicio" },
  { label: "Nosotros",  href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Propuesta", href: "#propuesta" },
  { label: "Contacto",  href: "#contacto" },
];

const Footer = () => (
  <footer className="bg-navy-950 border-t border-navy-800">
    <div className="container mx-auto px-6 max-w-6xl">

      {/* Fila principal */}
      <div className="py-10 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Logo + tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src={logoImg}
            alt="DataSys Latam Group"
            width={130}
            height={40}
            loading="lazy"
            style={{
              height: 34,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(1.05) saturate(1.1) drop-shadow(0 0 4px rgba(33,118,232,0.18))",
            }}
          />
          <p className="text-xs text-steel-500 tracking-wide">
            Barranquilla, Atlántico, Colombia
          </p>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-xs text-steel-400 hover:text-white transition-colors duration-200 tracking-wide"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto rápido */}
        <a
          href="mailto:contacto@datasyslatam.com"
          className="text-xs text-steel-400 hover:text-white transition-colors duration-200 tracking-wide hidden lg:block"
        >
          contacto@datasyslatam.com
        </a>
      </div>

      {/* Divisor + copyright */}
      <div className="border-t border-navy-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-steel-600">
          © {new Date().getFullYear()} DataSys Latam Group S.A.S. Todos los derechos reservados.
        </p>
        <p className="text-xs text-steel-700 tracking-widest uppercase">
          datasyslatam.com
        </p>
      </div>

    </div>
  </footer>
);

export default Footer;
