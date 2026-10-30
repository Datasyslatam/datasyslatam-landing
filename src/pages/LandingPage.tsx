import { ArrowRight, CheckCircle2, ChevronDown, Quote } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ContactSection from "@/components/ContactSection";
import { heroBtnOrange, heroBtnOutline } from "@/components/heroButtons";
import { whatsappUrl } from "@/lib/whatsapp";
import { landingJsonLd } from "@/blog/seo";
import type { LandingPage as LandingData, LandingSection } from "@/landing/pages";

const SectionHeader = ({ eyebrow, title, intro, id }: { eyebrow?: string; title: string; intro?: string; id: string }) => (
  <div className="mb-8 max-w-3xl">
    {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-electric-600">{eyebrow}</p>}
    <h2 id={`${id}-titulo`} className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
      {title}
    </h2>
    {intro && <p className="mt-3 text-base leading-relaxed text-[#0b2a5e]/80">{intro}</p>}
  </div>
);

const Section = ({ section, index }: { section: LandingSection; index: number }) => {
  const bg = index % 2 === 0 ? "bg-white" : "bg-[#f5f7fb]";
  const wrap = (children: React.ReactNode) => (
    <section id={section.id} aria-labelledby={`${section.id}-titulo`} className={`${bg} py-14 md:py-16`}>
      <div className="container mx-auto max-w-6xl px-4">{children}</div>
    </section>
  );

  switch (section.kind) {
    case "cards":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <li key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <CheckCircle2 className="mb-3 h-6 w-6 text-electric-600" aria-hidden="true" />
                <h3 className="mb-1.5 text-base font-bold text-navy-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#0b2a5e]/75">{item.text}</p>
              </li>
            ))}
          </ul>
        </>,
      );
    case "steps":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item, i) => (
              <li key={item.title} className="relative rounded-2xl border border-gray-200 bg-white p-6 pt-8 shadow-sm">
                <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF8024] text-sm font-bold text-navy-900">
                  {i + 1}
                </span>
                <h3 className="mb-1.5 text-base font-bold text-navy-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#0b2a5e]/75">{item.text}</p>
              </li>
            ))}
          </ol>
        </>,
      );
    case "chips":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ul className="flex flex-wrap gap-2.5">
            {section.chips.map((chip) => (
              <li key={chip} className="rounded-full bg-blue-100/70 px-4 py-2 text-sm font-bold text-[#0b2a5e]">
                {chip}
              </li>
            ))}
          </ul>
        </>,
      );
    case "text":
      return wrap(
        <div className="max-w-3xl">
          <SectionHeader {...section} />
          {section.paragraphs.map((p) => (
            <p key={p} className="mb-4 text-base leading-relaxed text-[#0b2a5e]/85">
              {p}
            </p>
          ))}
          {section.link && (
            <a href={section.link.href} className="inline-flex items-center gap-1 font-semibold text-electric-600 hover:text-electric-500">
              {section.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>,
      );
    case "profile":
      return wrap(
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <img src={section.image} alt={section.imageAlt} width={1200} height={800} loading="lazy" decoding="async" className="h-72 w-full rounded-2xl object-cover object-[35%_center] shadow-card lg:h-96" />
          <div>
            <SectionHeader {...section} />
            <p className="mb-3 text-lg font-bold text-[#0b2a5e]">{section.name}</p>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-3 text-base leading-relaxed text-[#0b2a5e]/80">
                {p}
              </p>
            ))}
          </div>
        </div>,
      );
    case "case":
      return wrap(
        <>
          <SectionHeader {...section} />
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h3 className="mb-4 text-lg font-bold text-navy-900">{section.name}</h3>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {(
                [
                  ["Desafío", section.challenge],
                  ["Solución", section.solution],
                  ["Tecnologías", section.tech],
                  ["Resultado", section.result],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold text-navy-900">{label}</dt>
                  <dd className="text-[#0b2a5e]/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>,
      );
  }
};

/** Página comercial de un servicio o producto: héroe con la palabra clave en el H1, secciones, FAQ y formulario. */
const LandingPage = ({ page }: { page: LandingData }) => (
  <SiteChrome>
    {/* Mismo lenguaje visual que el héroe del inicio: la foto ocupa el lado derecho y se funde con el azul hacia el texto.
        En móvil queda de fondo, cubierta casi por completo para que el texto se lea. Los productos muestran su captura
        sin fondo flotando sobre luces difuminadas. */}
    <section className="relative flex items-center overflow-hidden bg-navy-900 text-white lg:min-h-[560px]">
      {page.heroMockup ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" aria-hidden="true">
          <div className="absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-electric-500/40 blur-3xl lg:right-[6%]" />
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-electric-500/15 blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-[#FF8024]/10 blur-3xl" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 lg:left-[38%]">
            <img
              src={page.heroImage}
              alt={page.heroImageAlt}
              width={1200}
              height={800}
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: page.heroImagePosition ?? "center" }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-navy-900 to-transparent lg:block" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-navy-900/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-900 lg:via-navy-900/75 lg:to-navy-900/10" />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-navy-900/20" />
      <div className="container relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <nav aria-label="Ruta de navegación" className="mb-5 text-sm text-white/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <a href="/" className="hover:text-white">
                  Inicio
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white/85">
                {page.breadcrumb}
              </li>
            </ol>
          </nav>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#FF8024]">{page.eyebrow}</p>
          <h1 className="mb-5 font-heading text-3xl font-bold leading-tight md:text-5xl">{page.h1}</h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80">{page.lead}</p>
          <div className="flex flex-wrap gap-3">
            <a href="#contacto" className={heroBtnOrange}>
              {page.primaryCta}
            </a>
            <a href={whatsappUrl(page.whatsappText)} target="_blank" rel="noopener noreferrer" className={heroBtnOutline}>
              Hablar por WhatsApp
            </a>
          </div>
        </div>
        {page.heroMockup && (
          <img
            src={page.heroMockup}
            alt={page.heroImageAlt}
            width={956}
            height={602}
            decoding="async"
            className="mx-auto w-full max-w-xl drop-shadow-[0_30px_45px_rgba(2,8,23,0.6)] lg:max-h-[440px] lg:w-auto"
          />
        )}
      </div>
    </section>

    {page.sections.map((section, i) => (
      <Section key={section.id} section={section} index={i} />
    ))}

    {page.testimonials.length > 0 && (
      <section aria-labelledby="testimonios-titulo" className="bg-white py-14 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeader id="testimonios" eyebrow="Testimonios" title="Lo que dicen las empresas que acompañamos" />
          <ul className="grid gap-5 md:grid-cols-2">
            {page.testimonials.map((t) => (
              <li key={t.name} className="rounded-2xl border border-gray-200 bg-[#f5f7fb] p-6">
                <Quote className="mb-3 h-6 w-6 text-[#FF8024]" aria-hidden="true" />
                <blockquote className="mb-4 text-base leading-relaxed text-[#0b2a5e]/85">{t.quote}</blockquote>
                <p className="text-sm font-bold text-navy-900">{t.name}</p>
                <p className="text-sm text-steel-500">
                  {t.role}, {t.company} · {t.city}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}

    <section aria-labelledby="faq-titulo" className="bg-[#f5f7fb] py-14 md:py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <SectionHeader id="faq" eyebrow={page.breadcrumb} title="Preguntas frecuentes" />
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {page.faq.map(({ q, a }) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#0b2a5e]">
                <h3 className="text-base">{q}</h3>
                <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-electric-600 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#0b2a5e]/80">{a}</p>
            </details>
          ))}
        </div>
        {page.related.length > 0 && (
          <div className="mt-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-navy-900">También le puede interesar</p>
            <ul className="space-y-2">
              {page.related.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="inline-flex items-center gap-1 font-semibold text-electric-600 hover:text-electric-500">
                    {r.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>

    <ContactSection subject={page.leadSubject} />

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd(page)) }} />
  </SiteChrome>
);

export default LandingPage;
