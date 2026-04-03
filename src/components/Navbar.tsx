import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo-datasyslatam.png";

const navLinks = [
  { label: "Inicio",    href: "#inicio"    },
  { label: "Nosotros",  href: "#nosotros"  },
  { label: "Servicios", href: "#servicios" },
  { label: "Propuesta", href: "#propuesta" },
  { label: "Contacto",  href: "#contacto"  },
];

const Logo = () => (
  <div className="flex items-center">
    <img
      src={logoImg}
      alt="Datasys Latam Group"
      width={160}
      height={52}
      loading="eager"
      style={{
        height: 44,
        width: "auto",
        objectFit: "contain",
        // mix-blend-mode elimina visualmente el fondo blanco del JPG sobre fondos oscuros
        mixBlendMode: "screen",
        // brightness y contrast para nitidez y contraste leve con el fondo
        filter: "brightness(1.05) contrast(1.05) drop-shadow(0 0 6px rgba(96,165,250,0.25))",
      }}
    />
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/90 backdrop-blur-md border-b border-primary/10">

      {/* Barra principal */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        <a href="#inicio" onClick={() => setOpen(false)} className="flex-shrink-0">
          <Logo />
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-hero-muted hover:text-hero-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contacto"
              className="gradient-bg text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Solicita tu Consultoría
            </a>
          </li>
        </ul>

        {/* Botón hamburguesa mobile */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg text-hero-foreground hover:bg-hero-foreground/10 transition-colors flex-shrink-0"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menú mobile */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden md:hidden bg-hero/95 backdrop-blur-md border-t border-primary/10"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-hero-muted hover:text-hero-foreground hover:bg-hero-foreground/5 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 pb-2">
                <a
                  href="#contacto"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full gradient-bg text-primary-foreground text-sm font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Solicita tu Consultoría
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;