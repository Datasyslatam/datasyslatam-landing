import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AutodiagnosticoDialog from "@/components/autodiagnostico/AutodiagnosticoDialog";

/** Menú, pie, botón de WhatsApp y autodiagnóstico comunes a todas las páginas. */
const SiteChrome = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    <main className="min-h-screen pt-[72px]">{children}</main>
    <Footer />
    <WhatsAppButton />
    <AutodiagnosticoDialog />
  </>
);

export default SiteChrome;
