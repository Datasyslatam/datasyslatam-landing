const navLinks = ["Inicio", "Nosotros", "Servicios", "Contacto"];

const Footer = () => (
  <footer className="bg-hero py-12 border-t border-primary/10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/40">
            <svg viewBox="0 0 36 36" width="18" height="18" fill="none" aria-label="logo">
              <rect x="3" y="8" width="10" height="20" rx="2" fill="hsl(221 83% 53%)"/>
              <rect x="16" y="4" width="10" height="24" rx="2" fill="hsl(292 84% 57%)"/>
              <rect x="23" y="14" width="10" height="14" rx="2" fill="hsl(221 83% 53%)" opacity="0.7"/>
            </svg>
          </div>
          <p className="text-xs text-hero-muted">DataSys Latam Group S.A.S. — Barranquilla, Colombia</p>
        </div>

        <div className="flex gap-6">
          {navLinks.map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} className="text-xs text-hero-muted hover:text-hero-foreground transition-colors">
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