import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ResultsSection from "@/components/ResultsSection";
import ServicesGridSection from "@/components/ServicesGridSection";
import CompanySection from "@/components/CompanySection";
import TechCarouselSection from "@/components/TechCarouselSection";
import MethodologySection from "@/components/MethodologySection";
import SectoresSection from "@/components/SectoresSection";
import ProductosSection from "@/components/ProductosSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <main className="min-h-screen pt-[72px]">
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <ResultsSection />
    <ServicesGridSection />
    <CompanySection />
      <MethodologySection />
      <SectoresSection />
      <ProductosSection />
      <TechCarouselSection />
    <ContactSection />
    <Footer />
      <WhatsAppButton />
  </main>
);

export default Index;
