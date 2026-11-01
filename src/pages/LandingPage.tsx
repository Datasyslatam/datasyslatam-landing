import {
  AppWindow,
  ArrowDown,
  ArrowRight,
  ChartColumn,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  ClipboardPen,
  CodeXml,
  Database,
  FileCheck2,
  GitBranch,
  Handshake,
  Info,
  Lightbulb,
  Package,
  Wrench,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  MessagesSquare,
  MonitorSmartphone,
  MousePointerClick,
  Network,
  Quote,
  Search,
  Target,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ContactSection from "@/components/ContactSection";
import { heroBtnOrange, heroBtnOutline } from "@/components/heroButtons";
import { whatsappUrl } from "@/lib/whatsapp";
import { landingJsonLd } from "@/blog/seo";
import type { LandingCard, LandingIcon, LandingPage as LandingData, LandingSection } from "@/landing/pages";

const ICONS: Record<LandingIcon, LucideIcon> = {
  web: MonitorSmartphone,
  ai: MessagesSquare,
  software: CodeXml,
  process: ClipboardList,
  automation: Workflow,
  search: Search,
  platform: LayoutDashboard,
  integration: Network,
  portal: AppWindow,
  fit: Target,
  layers: Layers,
  checklist: ListChecks,
  user: MousePointerClick,
  support: LifeBuoy,
  growth: TrendingUp,
  commercial: Handshake,
  operations: Wrench,
  inventory: Package,
  documents: FileCheck2,
  form: ClipboardPen,
  database: Database,
  approval: GitBranch,
  dashboard: ChartColumn,
  idea: Lightbulb,
};

const Note = ({ text, className = "" }: { text: string; className?: string }) => (
  <p className={`flex gap-2 rounded-xl border border-electric-600/20 bg-electric-600/5 p-4 text-sm leading-relaxed text-[#0b2a5e]/85 ${className}`}>
    <Info className="mt-0.5 h-4 w-4 shrink-0 text-electric-600" aria-hidden="true" />
    <span>{text}</span>
  </p>
);

const CheckPill = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#0b2a5e]">
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8024]" aria-hidden="true" />
    <span>{text}</span>
  </li>
);

const IconBadge = ({ icon, size = "md" }: { icon: LandingIcon; size?: "md" | "lg" }) => {
  const Icon = ICONS[icon];
  return (
    <span
      className={`mb-4 inline-flex items-center justify-center rounded-xl bg-electric-600/10 text-electric-600 ${size === "lg" ? "h-14 w-14" : "h-11 w-11"}`}
      aria-hidden="true"
    >
      <Icon className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
    </span>
  );
};

const CardLink = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-electric-600 hover:text-electric-500">
    {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
  </a>
);

const Card = ({ item }: { item: LandingCard }) => (
  <li className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    {item.icon ? <IconBadge icon={item.icon} /> : <CheckCircle2 className="mb-3 h-6 w-6 text-electric-600" aria-hidden="true" />}
    <h3 className="mb-1.5 text-base font-bold text-navy-900">{item.title}</h3>
    <p className="text-sm leading-relaxed text-[#0b2a5e]/75">{item.text}</p>
    {item.href && item.linkLabel && <CardLink href={item.href} label={item.linkLabel} />}
  </li>
);

const SectionHeader = ({ eyebrow, title, intro, id }: { eyebrow?: string; title: string; intro?: string; id: string }) => (
  <div className="mb-8 max-w-3xl">
    {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-electric-600">{eyebrow}</p>}
    <h2 id={`${id}-titulo`} className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
      {title}
    </h2>
    {intro && <p className="mt-3 text-base leading-relaxed text-[#0b2a5e]/80">{intro}</p>}
  </div>
);

const Section = ({ section, index, whatsappText }: { section: LandingSection; index: number; whatsappText: string }) => {
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
              <Card key={item.title} item={item} />
            ))}
          </ul>
        </>,
      );
    case "services":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ul className="grid gap-6 lg:grid-cols-3">
            {section.items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col rounded-2xl border border-gray-200 border-t-4 border-t-electric-600 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <IconBadge icon={item.icon} size="lg" />
                <h3 className="mb-2 font-heading text-xl font-bold text-navy-900">{item.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-[#0b2a5e]/80">{item.text}</p>
                <ul className="mb-2 space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-[#0b2a5e]/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8024]" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {item.href && item.linkLabel && (
                  <div className="mt-auto">
                    <CardLink href={item.href} label={item.linkLabel} />
                  </div>
                )}
              </li>
            ))}
          </ul>
          {section.note && <Note text={section.note} className="mt-8" />}
        </>,
      );
    case "problems":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.questions.map((q) => (
              <li key={q} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-[#0b2a5e]">
                <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#FF8024]" aria-hidden="true" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl border-l-4 border-[#FF8024] bg-navy-900 px-6 py-5 text-base font-medium leading-relaxed text-white md:text-lg">
            {section.closing}
          </p>
        </>,
      );
    case "compare":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ul className="grid gap-5 lg:grid-cols-2">
            {section.items.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <li key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-navy-900">
                    <Icon className="h-5 w-5 text-electric-600" aria-hidden="true" />
                    {item.title}
                  </h3>
                  <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
                    <div className="rounded-xl bg-gray-100 p-4">
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-steel-500">Antes</p>
                      <p className="text-sm leading-relaxed text-[#0b2a5e]/75">{item.before}</p>
                    </div>
                    <span className="flex items-center justify-center text-[#FF8024]" aria-hidden="true">
                      <ArrowRight className="hidden h-6 w-6 sm:block" />
                      <ArrowDown className="h-6 w-6 sm:hidden" />
                    </span>
                    <div className="rounded-xl bg-electric-600/10 p-4">
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-electric-600">Después</p>
                      <p className="text-sm leading-relaxed text-[#0b2a5e]">{item.after}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {section.note && <Note text={section.note} className="mt-8" />}
        </>,
      );
    case "benefits":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <CheckPill key={item} text={item} />
            ))}
          </ul>
        </>,
      );
    case "levels":
      return wrap(
        <>
          <SectionHeader {...section} />
          <ol className="grid gap-5 lg:grid-cols-3">
            {section.items.map((item, i) => (
              <li key={item.name} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-1.5" aria-hidden="true">
                  {section.items.map((_, j) => (
                    <span key={j} className={`h-2 flex-1 rounded-full ${j <= i ? "bg-[#FF8024]" : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-electric-600">{item.name}</p>
                <h3 className="mb-2 text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#0b2a5e]/75">{item.text}</p>
              </li>
            ))}
          </ol>
          {section.note && <Note text={section.note} className="mt-8" />}
        </>,
      );
    case "service":
      return wrap(
        <>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className={section.reverse ? "lg:order-2" : undefined}>
              <SectionHeader {...section} />
              <h3 className="mb-3 text-base font-bold text-navy-900">{section.examplesTitle}</h3>
              <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {section.examples.map((example) => (
                  <li key={example} className="flex gap-2 text-sm leading-relaxed text-[#0b2a5e]/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric-600" aria-hidden="true" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
              {section.note && <Note text={section.note} className="mt-5" />}
              {section.link && <CardLink href={section.link.href} label={section.link.label} />}
            </div>
            <figure className="lg:sticky lg:top-24">
              <img
                src={section.image}
                alt={section.imageAlt}
                width={section.width}
                height={section.height}
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl border border-gray-200 shadow-card"
              />
              {section.caption && <figcaption className="mt-3 text-center text-sm text-steel-500">{section.caption}</figcaption>}
            </figure>
          </div>
          <div className="mt-10">
            <h3 className="mb-4 text-base font-bold text-navy-900">{section.benefitsTitle}</h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.benefits.map((benefit) => (
                <CheckPill key={benefit} text={benefit} />
              ))}
            </ul>
          </div>
        </>,
      );
    case "cta":
      return (
        <section
          id={section.id}
          aria-labelledby={`${section.id}-titulo`}
          className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-16 text-white"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-electric-500/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#FF8024]/15 blur-3xl" aria-hidden="true" />
          <div className="container relative mx-auto max-w-3xl px-4 text-center">
            <h2 id={`${section.id}-titulo`} className="mb-4 font-heading text-2xl font-bold md:text-4xl">
              {section.title}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{section.text}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#contacto" className={`${heroBtnOrange} btn-shine`}>
                {section.primary}
              </a>
              <a href={whatsappUrl(whatsappText)} target="_blank" rel="noopener noreferrer" className={heroBtnOutline}>
                {section.secondary}
              </a>
            </div>
          </div>
        </section>
      );
    case "steps":
      if (section.layout === "line") {
        return wrap(
          <>
            <SectionHeader {...section} />
            <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {section.items.map((item, i) => (
                <li key={item.title} className="relative">
                  {/* Tramo de la línea hasta la etapa siguiente (solo en escritorio) */}
                  {i < section.items.length - 1 && (
                    <span
                      className="pointer-events-none absolute left-12 top-6 hidden h-0.5 w-[calc(100%-3rem+1.25rem)] bg-gradient-to-r from-[#FF8024] to-electric-600 lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF8024] font-heading text-lg font-bold text-navy-900 shadow-md ring-4 ring-white">
                    {i + 1}
                  </span>
                  <h3 className="mb-1.5 text-base font-bold text-navy-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0b2a5e]/75">{item.text}</p>
                </li>
              ))}
            </ol>
          </>,
        );
      }
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
    case "showcase":
      return wrap(
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className={section.reverse ? "lg:order-2" : undefined}>
            <SectionHeader {...section} />
            <ul className="space-y-3">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3 text-base leading-relaxed text-[#0b2a5e]/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric-600" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src={section.image}
            alt={section.imageAlt}
            width={section.width}
            height={section.height}
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl border border-gray-200 shadow-card"
          />
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
            {page.secondaryCta ? (
              <a href={page.secondaryCta.href} className={heroBtnOutline}>
                {page.secondaryCta.label}
              </a>
            ) : (
              <a href={whatsappUrl(page.whatsappText)} target="_blank" rel="noopener noreferrer" className={heroBtnOutline}>
                Hablar por WhatsApp
              </a>
            )}
          </div>
          {page.heroHighlights && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {page.heroHighlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-[#FF8024]" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          )}
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
      <Section key={section.id} section={section} index={i} whatsappText={page.whatsappText} />
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

    <ContactSection
      subject={page.leadSubject}
      needOptions={page.leadNeeds}
      needLabel={page.leadNeedsLabel}
      askPhone={page.leadAskPhone}
      submitLabel={page.leadSubmitLabel}
    />

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd(page)) }} />
  </SiteChrome>
);

export default LandingPage;
