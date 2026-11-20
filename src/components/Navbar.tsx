import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo-datasyslatam.webp";
import { NAV_LINKS } from "./navLinks";
import { useActiveSection } from "@/lib/activeSection";


const Logo = () => (
  <div className="flex items-center">
    <img
      src={logoImg}
      alt="DataSys Latam Group"
      width={130}
      height={40}
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

const SECTION_IDS = NAV_LINKS.filter((l) => l.href.startsWith("/#")).map((l) => l.href.slice(2));

/** Fuera del inicio, el enlace que corresponde a la página actual (blog, servicios, productos). */
const linkForPath = (path: string): string | null => {
  if (path === "/blog" || path.startsWith("/blog/")) return "/blog";
  if (path.startsWith("/servicios/")) return "/#servicios";
  if (path.startsWith("/producto/")) return "/#productos";
  return null;
};

const isHome = (path: string) => path === "/" || path === "/index.html";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => setPath(location.pathname.replace(/\/+$/, "") || "/"), []);

  const home = path !== null && isHome(path);
  const section = useActiveSection(SECTION_IDS, home);
  const current = home ? (section ? `/#${section}` : null) : path ? linkForPath(path) : null;

  // Barra de avance de lectura bajo el menú: muestra cuánto de la página se ha recorrido.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = progressRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Menú del celular: se cierra con Escape (devolviendo el foco al botón), al tocar fuera o al pasar a escritorio.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const ariaCurrent = (href: string) =>
    href === current ? (home ? ("location" as const) : ("page" as const)) : undefined;

  return (
    <nav ref={navRef} aria-label="Principal" className="fixed top-0 left-0 right-0 z-[100] w-full bg-white/85 backdrop-blur-[12px] border-b border-gray-200/50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">

        <a href="/" onClick={() => setOpen(false)} className="flex-shrink-0 rounded" aria-label="DataSys Latam Group, ir al inicio">
          <Logo />
        </a>

        {/* Links desktop */}
        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {NAV_LINKS.map((link) => {
            const isCurrent = link.href === current;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={ariaCurrent(link.href)}
                  className={`relative block px-2.5 xl:px-3.5 py-2 rounded text-sm tracking-wide transition-colors duration-200 hover:bg-[#0A192F]/5 ${
                    isCurrent ? "font-semibold text-[#0052CC]" : "font-medium text-[#0A192F] hover:text-[#FF6B00]"
                  }`}
                >
                  {link.label}
                  {/* Subrayado de la sección actual */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2.5 xl:inset-x-3.5 -bottom-0.5 h-0.5 origin-center rounded-full bg-[#FF6B00] transition-transform duration-300 motion-reduce:transition-none ${
                      isCurrent ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA desktop */}
        <div className="hidden xl:flex items-center gap-3">
          <a href="/#contacto" className="px-5 py-2 rounded text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99] transition-all duration-200 tracking-wide shadow-sm">
            Hablemos de su proyecto
          </a>
        </div>

        {/* Boton menu movil */}
        <button
          ref={toggleRef}
          type="button"
          className="lg:hidden -mr-1 flex h-11 w-11 items-center justify-center rounded text-[#0A192F] hover:text-[#FF6B00] hover:bg-[#0A192F]/5 transition-colors duration-200"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {/* Avance de lectura */}
      <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden">
        <div ref={progressRef} className="h-full origin-left bg-gradient-to-r from-[#0052CC] to-[#00B4D8]" style={{ transform: "scaleX(0)" }} />
      </div>

      {/* Menu movil */}
      <AnimatePresence>
        {open && (
          <m.div
            key="mobile-menu"
            id="menu-movil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-[12px]"
          >
            {/* En pantallas bajas (celular girado) el menú se desplaza en vez de quedar cortado */}
            <ul className="px-6 py-4 flex flex-col gap-1 max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain">
              {NAV_LINKS.map((link) => {
                const isCurrent = link.href === current;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={ariaCurrent(link.href)}
                      className={`flex items-center justify-between rounded border-l-[3px] px-4 py-3 text-sm tracking-wide transition-colors duration-200 ${
                        isCurrent
                          ? "border-[#FF6B00] bg-[#0052CC]/[0.07] font-semibold text-[#0052CC]"
                          : "border-transparent font-medium text-[#0A192F] hover:text-[#FF6B00] hover:bg-[#0A192F]/5"
                      }`}
                    >
                      {link.label}
                      {isCurrent && <span className="text-xs font-medium text-[#0052CC]/80">{home ? "Está aquí" : "Página actual"}</span>}
                    </a>
                  </li>
                );
              })}
              <li className="pt-3 mt-1 border-t border-gray-200/50">
                <a href="/#contacto" onClick={() => setOpen(false)} className="block text-center px-4 py-3 rounded text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99] transition-colors duration-200 tracking-wide">
                  Hablemos de su proyecto
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
