import { ArrowRight } from "lucide-react";
import appGovernex from "@/assets/banners/app_governex.jpg";
import appSoft from "@/assets/banners/app_producto_soft.jpg";

const ProductosSection = () => (
  <section className="bg-white py-12">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ===== LEFT CARD: Governex ===== */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">NUESTRO PRODUCTO</p>

          {/* Governex logo */}
          <div className="mb-5 flex items-center gap-3">
            <img src="/assets/logo_governex.png" alt="Governex logo" width="36" height="36" className="h-9 w-9 object-contain" />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-navy-900">Govern</span><span className="text-orange-500">ex</span>
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-5 sm:flex-row">

          {/* left: product image */}
          <div className="flex-1">
            <img src={appGovernex} alt="Governex - Gobernanza corporativa inteligente" className="h-auto w-full rounded-lg object-cover" />
          </div>

            {/* right: text */}
            <div className="flex-1">
              <h3 className="mb-2 text-base font-bold text-navy-900">Gobernanza corporativa inteligente</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Plataforma diseñada para ayudar a las organizaciones a gestionar de manera estructurada sus procesos de gobierno corporativo, información, cumplimiento y toma de decisiones.
              </p>
              <a href="#contacto" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800">
                Conocer Governex <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        {/* ===== RIGHT CARD: Caso de Éxito ===== */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">CASOS DE ÉXITO</p>
          <h2 className="mb-5 text-xl font-bold text-navy-900">Transformamos desafíos en soluciones reales</h2>

          <div className="flex flex-1 flex-col gap-5 sm:flex-row">

            {/* left: product image */}
            <div className="flex-1">
              <img src={appSoft} alt="Caso de exito - Plataforma de gestion empresarial" className="h-auto w-full rounded-lg object-cover" />
            </div>

            {/* right: case info */}
            <div className="flex-1">
              <h3 className="mb-3 text-base font-bold text-navy-900">Plataforma de gestión empresarial</h3>
              <div className="space-y-2.5 text-sm">
                <div>
                  <span className="font-semibold text-navy-900">Desafío: </span>
                  <span className="text-gray-600">Procesos manuales y dispersos.</span>
                </div>
                <div>
                  <span className="font-semibold text-navy-900">Solución: </span>
                  <span className="text-gray-600">Desarrollo de plataforma web empresarial integrada.</span>
                </div>
                <div>
                  <span className="font-semibold text-navy-900">Tecnologías: </span>
                  <span className="text-gray-600">Python · React · Node.js · PostgreSQL · APIs</span>
                </div>
                <div className="mt-3 rounded-lg bg-blue-50 p-3">
                  <span className="font-semibold text-navy-900">Resultado: </span>
                  <span className="text-gray-700">Centralización de procesos y disponibilidad de información en tiempo real.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProductosSection;
