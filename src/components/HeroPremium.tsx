import { ArrowLeft, ArrowRight, Brain, Handshake, Target, Network, Shield } from "lucide-react";
interface HeroPremiumProps {
  active: number;
  total: number;
  go: (direction: number) => void;
}

const HeroPremium = ({ active, total, go }: HeroPremiumProps) => {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#1a63c8] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-24 h-[420px] w-[420px] rounded-full bg-[#FF8024] opacity-20 blur-3xl" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 600">
        <g stroke="rgba(120,180,255,0.25)" strokeWidth="1" fill="none">
          <path d="M0 120 L300 200 L560 140 L820 260 L1200 180" />
          <path d="M0 420 L260 360 L520 440 L840 360 L1200 460" />
          <path d="M120 0 L260 200 L200 420 L360 600" />
          <path d="M980 0 L900 220 L1020 440 L900 600" />
        </g>
        <g fill="#7db8ff">
          <circle cx="300" cy="200" r="3" /><circle cx="560" cy="140" r="3" /><circle cx="820" cy="260" r="3" />
        </g>
        <g fill="#FF8024">
          <circle cx="260" cy="360" r="3" /><circle cx="900" cy="220" r="3" /><circle cx="1020" cy="440" r="3" />
        </g>
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight mb-6">
              Impulsamos la evolución <span className="text-[#FF8024]">digital de tu empresa.</span>
            </h1>
            <p className="mb-8 text-base md:text-lg text-steel-200 leading-relaxed max-w-lg">
              Creemos que la transformación digital no consiste simplemente en incorporar nuevas tecnologías. Comienza por comprender las necesidades reales de cada organización y convertirlas en soluciones que generen valor.
            </p>
            <div className="mb-10 flex flex-wrap gap-4">
              <button className="rounded-full bg-[#FF8024] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">Conocer nuestras soluciones</button>
              <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">Hablemos de su proyecto</button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-3 text-xs font-semibold tracking-wide text-white/60">KPIs Globales</p>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[11px] text-white/50">Ventas</p><p className="text-lg font-bold text-white">$ 3.45M</p><p className="text-[11px] text-emerald-400">+15.1%</p></div>
                <div><p className="text-[11px] text-white/50">Clientes</p><p className="text-lg font-bold text-white">21,500</p><p className="text-[11px] text-emerald-400">+7.8%</p></div>
                <div><p className="text-[11px] text-white/50">Conversión</p><p className="text-lg font-bold text-white">4.15%</p><p className="text-[11px] text-emerald-400">+4.15%</p></div>
                <div className="flex items-center justify-center"><div className="h-14 w-14 rounded-full border-2 border-[#7db8ff] flex items-center justify-center text-[#7db8ff]"><Brain className="h-6 w-6" /></div></div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-2 text-xs font-semibold tracking-wide text-white/60">Modelos IA integrados</p>
              <p className="text-sm leading-relaxed text-white/80">Modelos IA integrados automatizarán un proceso de vanguardia.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-2 text-xs font-semibold tracking-wide text-white/60">Evolución de ventas</p>
              <svg viewBox="0 0 200 80" className="h-20 w-full">
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF8024" stop-opacity="0.5" /><stop offset="1" stop-color="#FF8024" stop-opacity="0" /></linearGradient></defs>
                <path d="M0 60 L40 50 L80 55 L120 30 L160 35 L200 12 L200 80 L0 80 Z" fill="url(#g1)" />
                <path d="M0 60 L40 50 L80 55 L120 30 L160 35 L200 12" fill="none" stroke="#FF8024" strokeWidth="2" />
              </svg>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-2 text-xs font-semibold tracking-wide text-white/60">Distribución por canal</p>
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 36 36" className="h-16 w-16">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a63c8" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF8024" strokeWidth="4" strokeDasharray="40 60" strokeDashoffset="25" />
                </svg>
                <div className="text-[11px] text-white/70"><p>Web 40%</p><p>Tienda 25%</p><p>Marketplace 20%</p><p>Otros 15%</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-1 text-xs font-semibold tracking-wide text-white/60">Rendimiento</p>
              <p className="mb-3 text-lg font-bold text-white">Total $ 2.45M</p>
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-white/10"><div className="h-2 rounded bg-[#FF8024]" style={{ width: "70%" }} /></div>
                <div className="h-2 w-full rounded bg-white/10"><div className="h-2 rounded bg-[#7db8ff]" style={{ width: "45%" }} /></div>
                <div className="h-2 w-full rounded bg-white/10"><div className="h-2 rounded bg-emerald-400" style={{ width: "60%" }} /></div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-2 text-xs font-semibold tracking-wide text-white/60">Actividad global</p>
              <svg viewBox="0 0 200 100" className="h-24 w-full">
                <path d="M10 70 Q40 40 70 60 T130 50 T190 65" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <circle cx="55" cy="55" r="3" fill="#FF8024" /><circle cx="110" cy="48" r="3" fill="#7db8ff" /><circle cx="160" cy="60" r="3" fill="#FF8024" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-4">
          <button onClick={() => go(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" /></button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-[#FF8024]" style={{ width: ((active + 1) / total) * 100 + "%" }} /></div>
          <button onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"><ArrowRight className="h-4 w-4" /></button>
          <span className="text-sm font-semibold text-white/80">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <div className="mt-10 grid gap-4 rounded-2xl bg-white p-6 text-navy-900 sm:grid-cols-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Target className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">+10 años</p><p className="text-xs text-navy-900/70">Años Impulsando</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Network className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">+50</p><p className="text-xs text-navy-900/70">Proyectos Implementados</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Shield className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">100% Calidad</p><p className="text-xs text-navy-900/70">Enfoque Integral</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"><Handshake className="h-5 w-5" /></span><div><p className="text-xl font-extrabold">Socios Aliados</p><p className="text-xs text-navy-900/70">Acompañamiento Estratégico</p></div></div>
        </div>
      </div>
    </section>
  );
};

export default HeroPremium;
