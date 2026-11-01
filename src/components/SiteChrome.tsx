import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssistantWidget from "@/components/assistant/AssistantWidget";
import AutodiagnosticoDialog from "@/components/autodiagnostico/AutodiagnosticoDialog";
import { useSectionLinks } from "@/lib/sectionLinks";

/** Menú, pie, asistente (con WhatsApp) y autodiagnóstico comunes a todas las páginas. */
const SiteChrome = ({ children }: { children: ReactNode }) => {
  useSectionLinks();
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px]">{children}</main>
      <Footer />
      <AssistantWidget />
      <AutodiagnosticoDialog />
    </>
  );
};

export default SiteChrome;
