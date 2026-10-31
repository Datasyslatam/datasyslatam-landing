import { ArrowRight } from "lucide-react";
import appGovernex from "@/assets/banners/app-governex.webp";
import novixDashboard from "@/assets/novix/novix-dashboard.webp";
import logoGovernex from "@/assets/logo-governex.webp";
import logoNovix from "@/assets/logo-novix.webp";

const ProductosSection = () => (
  <section className="bg-white py-12">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ===== LEFT CARD: Governex ===== */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">NUESTRO PRODUCTO</p>

          {/* Governex logo */}
          <div className="mb-5 flex items-center gap-3">
            <img src={logoGovernex} alt="" width={30} height={36} loading="lazy" decoding="async" className="h-9 w-auto object-contain" />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-navy-900">Govern</span><span className="text-orange-500">ex</span>
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-5 sm:flex-row">

          {/* left: product image */}
          <div className="flex-1">
            <img src={appGovernex} alt="Governex - Gobernanza corporativa inteligente" width={1000} height={915} loading="lazy" decoding="async" className="h-auto w-full rounded-lg object-cover" />
          </div>

            {/* right: text */}
            <div className="flex-1">
              <h3 className="mb-2 text-base font-bold text-navy-900">Gobernanza corporativa inteligente</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Plataforma diseñada para ayudar a las organizaciones a gestionar de manera estructurada sus procesos de gobierno corporativo, información, cumplimiento y toma de decisiones.
              </p>
              <a href="/producto/governex" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800">
                Conocer Governex <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        {/* ===== RIGHT CARD: Novix ERP ===== */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">NUESTRO PRODUCTO</p>

          {/* Novix ERP logo */}
          <div className="mb-5 flex items-center">
            <img src={logoNovix} alt="Novix ERP" width={480} height={120} loading="lazy" decoding="async" className="h-9 w-auto object-contain" />
          </div>

          <div className="flex flex-1 flex-col gap-5 sm:flex-row">

            {/* left: product image */}
            <div className="flex-1">
              <img src={novixDashboard} alt="Dashboard ejecutivo de Novix ERP con indicadores de gestión" width={1582} height={872} loading="lazy" decoding="async" className="h-auto w-full rounded-lg border border-gray-200 object-cover" />
            </div>

            {/* right: text */}
            <div className="flex-1">
              <h3 className="mb-2 text-base font-bold text-navy-900">Gestión empresarial integrada</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                ERP que conecta compras, inventario, calidad, ventas, despachos y contabilidad en un solo sistema, con cada documento rastreable hasta su asiento contable e indicadores para decidir con datos.
              </p>
              <a href="/producto/novix-erp" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800">
                Conocer Novix ERP <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProductosSection;
