import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssistantWidget from "@/components/assistant/AssistantWidget";
import AutodiagnosticoLazy from "@/components/autodiagnostico/AutodiagnosticoLazy";
import { useSectionLinks } from "@/lib/sectionLinks";

/** Menú, pie, asistente (con WhatsApp) y autodiagnóstico comunes a todas las páginas. */
const SiteChrome = ({ children }: { children: ReactNode }) => {
  useSectionLinks();
  return (
    <>
      {/* Para teclado y lectores de pantalla: salta el menú y va directo al contenido */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-[#0052CC] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="min-h-screen pt-[72px] outline-none">{children}</main>
      <Footer />
      <AssistantWidget />
      <AutodiagnosticoLazy />
    </>
  );
};

export default SiteChrome;
