import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo-datasyslatam.png";

const navLinks = [
  { label: "Inicio",    href: "#inicio" },
  { label: "Nosotros",  href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Propuesta", href: "#propuesta" },
  { label: "Contacto",  href: "#contacto" },
];

const Logo = () => (
  <div className="flex items-center">
    <img
      src={logoImg}
      alt="DataSys Latam Group"
      width={150}
      height={48}
      loading="eager"
      style={{
        height: 40,
        width: "auto",
        objectFit: "contain",
        filter: "brightness(1.08) saturate(1.1) drop-shadow(0 0 6px rgba(33,118,232,0.25))",
      }}
    />
  </div>
);


const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] w-full bg-white/85 backdrop-blur-[12px] border-b border-gray-200/50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">

        <a href="#inicio" onClick={() => setOpen(false)} className="flex-shrink-0">
          <Logo />
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="px-4 py-2 rounded text-sm font-medium text-[#0A192F] hover:text-[#FF6B00] hover:bg-[#0A192F]/5 transition-all duration-200 tracking-wide">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#contacto" className="px-5 py-2 rounded text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#00B4D8] transition-all duration-200 tracking-wide shadow-sm">
            Hablemos de su proyecto
          </a>
        </div>

        {/* Boton menu movil */}
        <button
          className="md:hidden p-2 rounded text-[#0A192F] hover:text-[#FF6B00] hover:bg-[#0A192F]/5 transition-all duration-200"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu movil */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-[12px]"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className="block px-4 py-3 rounded text-sm font-medium text-[#0A192F] hover:text-[#FF6B00] hover:bg-[#0A192F]/5 transition-all duration-200 tracking-wide">
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3 mt-1 border-t border-gray-200/50">
                <a href="#contacto" onClick={() => setOpen(false)} className="block text-center px-4 py-3 rounded text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#00B4D8] transition-all duration-200 tracking-wide">
                  Hablemos de su proyecto
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
