import { useEffect, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Download, Loader2, RotateCcw, X } from "lucide-react";
import {
  ANSWERS,
  AUTODIAGNOSTICO_HASH,
  CHAPTERS,
  LEVELS,
  REQUIREMENTS,
  answerLabel,
  computeResult,
  type Answer,
  type DiagnosisResult,
} from "./data";
import { heroBtnBlue, heroBtnOrange, heroBtnOutlineLight } from "../heroButtons";
import { SUBMIT_ERROR_MESSAGES, submitWeb3Forms } from "@/lib/web3forms";
import { whatsappUrl } from "@/lib/whatsapp";

type Step = "intro" | "datos" | number | "result";
type SendStatus = "idle" | "sending" | "sent" | "error";

interface Lead {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  size: string;
}

const SECTORS = [
  "Servicios",
  "Comercio",
  "Industria y manufactura",
  "Construcción",
  "Salud",
  "Educación",
  "Transporte y logística",
  "Tecnología",
  "Agroindustria",
  "Sector público",
  "Otro",
];

const SIZES = ["Micro (1 a 10 personas)", "Pequeña (11 a 50)", "Mediana (51 a 200)", "Grande (más de 200)"];

const CONSENT_TEXT =
  "Autorizo a DataSys Latam Group a tratar mis datos personales para analizar este diagnóstico y contactarme sobre él, conforme a la Ley 1581 de 2012.";

const DISCLAIMER =
  "Este autodiagnóstico es una herramienta orientativa de la etapa PLANEAR del ciclo PHVA. No reemplaza una auditoría, ya que no garantiza los principios de objetividad, imparcialidad e independencia. Resultado basado en ISO 9001:2015 (incluye la enmienda 1:2024 sobre cambio climático).";

const PRINT_TITLE = "Diagnóstico ISO 9001 | DataSys Latam";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-navy-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const ANSWER_STYLE: Record<Answer, string> = {
  completo: "bg-emerald-100 text-emerald-800",
  parcial: "bg-amber-100 text-amber-800",
  ninguno: "bg-red-100 text-red-700",
  na: "bg-gray-100 text-gray-600",
};

const emptyAnswers = () => REQUIREMENTS.map(() => null as Answer | null);
const emptyLead = (): Lead => ({ name: "", role: "", company: "", email: "", phone: "", sector: "", size: "" });

const today = () => new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
      <AlertCircle size={12} /> {message}
    </p>
  ) : null;

const Bar = ({ percent, className = "bg-primary" }: { percent: number; className?: string }) => (
  <div className="h-2 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
    <div className={`h-2 rounded-full ${className}`} style={{ width: `${percent}%` }} />
  </div>
);

const ReportSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="autodiag-avoid-break mb-7">
    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-navy-900/60">{title}</h3>
    {children}
  </section>
);

/** Informe de resultados: se muestra en el diálogo y se reutiliza tal cual para el PDF. */
const Report = ({ result, lead, date, headingRef }: { result: DiagnosisResult; lead: Lead; date: string; headingRef?: Ref<HTMLHeadingElement> }) => {
  const levelIndex = LEVELS.indexOf(result.level);
  return (
    <>
      <header className="mb-6 border-b border-gray-200 pb-5">
        <p className="mb-1 text-sm font-bold text-primary">DataSys Latam</p>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-navy-900/60">Informe de autodiagnóstico ISO 9001:2015</p>
        <h2 ref={headingRef} tabIndex={-1} className="mb-2 font-heading text-2xl font-bold leading-tight outline-none sm:text-3xl">
          ¿En qué nivel está su Sistema de Gestión de la Calidad?
        </h2>
        <p className="text-sm text-navy-900/80">
          <strong>{lead.company}</strong> — {lead.name}
          {lead.role && ` (${lead.role})`}
        </p>
        <p className="text-sm text-navy-900/60">
          {[lead.sector, lead.size, date].filter(Boolean).join(" · ")}
        </p>
      </header>

      {result.applicable === 0 ? (
        <section role="note" className="autodiag-avoid-break mb-7 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed">
          <p className="mb-1 font-bold">No es posible calcular el cumplimiento</p>
          <p>
            Marcó todos los requisitos como «No aplica». En un sistema de gestión de la calidad casi todos estos requisitos aplican a
            cualquier empresa: repita el autodiagnóstico o hable con un consultor para revisarlo.
          </p>
        </section>
      ) : (
      <section className="autodiag-avoid-break mb-7 rounded-xl bg-[#0b2a5e] p-5 text-white sm:p-6">
        <p className="mb-1 text-sm text-white/70">Nivel de madurez</p>
        <p className="mb-1 font-heading text-3xl font-bold text-[#FF8024]">{result.level.name}</p>
        <p className="mb-4 text-lg font-bold">{result.percent}% de cumplimiento</p>
        <p className="mb-5 text-sm leading-relaxed text-white/85">{result.level.description}</p>
        <ol className="grid grid-cols-5 gap-1.5" aria-label="Escala de niveles de madurez">
          {LEVELS.map((level, i) => (
            <li key={level.name} aria-current={i === levelIndex ? "true" : undefined} className="text-center">
              <span className={`mb-1.5 block h-2 rounded-full ${i <= levelIndex ? "bg-[#FF8024]" : "bg-white/20"}`} />
              {/* En el celular no caben los cinco nombres: solo se muestra el del nivel obtenido. */}
              <span className={i === levelIndex ? "block" : "hidden sm:block"}>
                <span className={`block text-[11px] leading-tight sm:text-xs ${i === levelIndex ? "font-bold text-white" : "text-white/60"}`}>{level.name}</span>
                <span className="block text-[10px] text-white/50 sm:text-[11px]">
                  {level.min}–{level.max}%
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      )}

      <ReportSection title="Distribución de respuestas">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ANSWERS.map((a) => (
            <div key={a.value} className={`rounded-lg px-3 py-2.5 ${ANSWER_STYLE[a.value]}`}>
              <p className="text-2xl font-bold">{result.counts[a.value]}</p>
              <p className="text-xs font-semibold">{a.label}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection title="Resultado por capítulo">
        <ul className="space-y-3">
          {result.chapters.map(({ chapter, percent }) => (
            <li key={chapter.number}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold">
                  {chapter.number}. {chapter.name}
                </span>
                <span className="font-bold">{percent === null ? "No aplica" : `${percent}%`}</span>
              </div>
              <Bar percent={percent ?? 0} className={percent !== null && percent >= 51 ? "bg-primary" : "bg-[#FF8024]"} />
            </li>
          ))}
        </ul>
      </ReportSection>

      {result.strongest.length > 0 && (
        <ReportSection title="Fortalezas y brechas principales">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="mb-2 text-sm font-bold">Capítulos más fuertes</p>
              <ul className="space-y-1 text-sm">
                {result.strongest.map(({ chapter, percent }) => (
                  <li key={chapter.number}>
                    <strong className="text-primary">{percent}%</strong> · {chapter.number}. {chapter.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="mb-2 text-sm font-bold">Capítulos que requieren atención</p>
              <ul className="space-y-1 text-sm">
                {result.weakest.map(({ chapter, percent }) => (
                  <li key={chapter.number}>
                    <strong className="text-[#E07B1A]">{percent}%</strong> · {chapter.number}. {chapter.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ReportSection>
      )}

      <section className="mb-7">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-navy-900/60">Plan de acción sugerido</h3>
        {result.plan.length > 0 ? (
          <>
            <p className="mb-3 text-sm text-navy-900/70">
              Requisitos con respuesta Ninguno (prioridad alta) y Parcial (prioridad media), ordenados por prioridad.
            </p>
            <ol className="space-y-2.5">
              {result.plan.map((item) => (
                <li key={item.clause} className="autodiag-avoid-break rounded-lg border border-gray-200 p-3.5 text-sm">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#0b2a5e]/10 px-2 py-0.5 text-xs font-bold">Numeral {item.clause}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${ANSWER_STYLE[item.answer]}`}>{answerLabel(item.answer)}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${item.priority === "Alta" ? "bg-red-600 text-white" : "bg-amber-500 text-white"}`}>
                      Prioridad {item.priority.toLowerCase()}
                    </span>
                  </div>
                  <p className="mb-1 text-navy-900/80">{item.text}</p>
                  <p>
                    <strong>Acción recomendada:</strong> {item.action}
                  </p>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="text-sm">
            {result.applicable === 0
              ? "Sin requisitos evaluados: no hay plan de acción que sugerir."
              : "Todos los requisitos que aplican están completos. Mantenga la evidencia al día y la mejora continua."}
          </p>
        )}
      </section>

      <p className="border-t border-gray-200 pt-4 text-xs leading-relaxed text-navy-900/60">{DISCLAIMER}</p>
      <p className="mt-2 text-xs text-navy-900/60">© {new Date().getFullYear()} DataSys Latam · Consultoría en sistemas de gestión y soluciones digitales</p>
    </>
  );
};

const AutodiagnosticoDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState(emptyAnswers);
  const [lead, setLead] = useState(emptyLead);
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [sendError, setSendError] = useState("");
  const [date, setDate] = useState("");
  const sentFor = useRef<string | null>(null);
  /** Aumenta con cada envío o al repetir: una respuesta que llega tarde de un envío anterior se descarta. */
  const sendSeq = useRef(0);
  /** Título de la página antes de imprimir (el PDF toma el nombre del título). */
  const pageTitle = useRef<string | null>(null);
  /** El clic empezó sobre el fondo: solo así un clic en el fondo cierra el diálogo. */
  const pressedBackdrop = useRef(false);

  // Se abre con cualquier enlace a #autodiagnostico, también al cargar la página con ese hash.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === AUTODIAGNOSTICO_HASH) setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // En cada paso: volver arriba y llevar el foco al título para lectores de pantalla y teclado.
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [open, step]);

  const result: DiagnosisResult | null =
    step === "result" && answers.every((a) => a !== null) ? computeResult(answers as Answer[]) : null;

  // Al llegar al resultado, se envía a DataSys Latam una sola vez por cada diagnóstico (el interesado ya lo autorizó).
  const send = async (r: DiagnosisResult) => {
    const seq = ++sendSeq.current;
    setSendStatus("sending");
    setSendError("");
    const sent = await submitWeb3Forms({
      subject: `Autodiagnóstico ISO 9001: ${r.level.name} (${r.percent}%) — ${lead.company}`,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      phone: lead.phone || "No indicado",
      cargo: lead.role || "No indicado",
      sector: lead.sector,
      tamano: lead.size,
      autorizacion_datos: `Sí. ${CONSENT_TEXT}`,
      nivel: r.applicable ? r.level.name : "Sin calcular (todo No aplica)",
      cumplimiento: r.applicable ? `${r.percent}%` : "Sin calcular",
      distribucion: ANSWERS.map((a) => `${a.label}: ${r.counts[a.value]}`).join(" | "),
      por_capitulo: r.chapters.map((c) => `${c.chapter.number}. ${c.chapter.short}: ${c.percent === null ? "No aplica" : `${c.percent}%`}`).join(" | "),
      plan_de_accion: r.plan.map((p) => `[${p.priority}] ${p.clause}: ${p.action}`).join("\n") || "Sin brechas",
      respuestas: REQUIREMENTS.map((req, i) => `${req.clause} ${req.text} → ${answerLabel(answers[i] as Answer)}`).join("\n"),
    });
    if (seq !== sendSeq.current) return;
    if (sent.ok) {
      setSendStatus("sent");
    } else {
      setSendStatus("error");
      setSendError(SUBMIT_ERROR_MESSAGES[sent.reason]);
      sentFor.current = null;
    }
  };

  useEffect(() => {
    if (!result) return;
    const key = answers.join(",");
    if (sentFor.current === key) return;
    sentFor.current = key;
    setDate(today());
    void send(result);
    // `result` se recalcula en cada render; basta con reaccionar al llegar al paso de resultado.
  }, [step]);

  // PDF: una copia del informe vive fuera del diálogo (oculta en pantalla) y solo esa copia se imprime. Se imprime
  // dentro del clic, sin esperar un render, y cada clic vuelve a imprimir aunque el navegador no avise el final.
  const endPrint = () => {
    document.body.classList.remove("autodiag-printing");
    if (pageTitle.current !== null) document.title = pageTitle.current;
    pageTitle.current = null;
  };

  const printReport = () => {
    if (pageTitle.current === null) pageTitle.current = document.title;
    document.title = PRINT_TITLE;
    document.body.classList.add("autodiag-printing");
    window.addEventListener("afterprint", endPrint, { once: true });
    window.print();
  };

  useEffect(() => () => endPrint(), []);

  // Se dispara al cerrar con Esc, con la X o al hacer clic fuera.
  const handleClose = () => {
    setOpen(false);
    endPrint();
    if (window.location.hash === AUTODIAGNOSTICO_HASH) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const restart = () => {
    sendSeq.current++;
    setAnswers(emptyAnswers());
    setSendStatus("idle");
    setSendError("");
    sentFor.current = null;
    setStep(0);
  };

  const handleDatos = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Honeypot: los bots suelen marcar el campo oculto; se descarta sin continuar.
    if (formData.get("botcheck")) return;
    const errs: Record<string, string> = {};
    if (!lead.name.trim()) errs.name = "El nombre es obligatorio.";
    if (!lead.company.trim()) errs.company = "La empresa es obligatoria.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) errs.email = "Ingrese un correo válido.";
    if (!lead.sector) errs.sector = "Seleccione el sector.";
    if (!lead.size) errs.size = "Seleccione el tamaño.";
    if (!consent) errs.consent = "Necesitamos su autorización para continuar.";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLead((l) => ({ ...l, name: l.name.trim(), company: l.company.trim(), email: l.email.trim(), role: l.role.trim(), phone: l.phone.trim() }));
    setStep(0);
  };

  const field = (key: keyof Lead) => ({
    value: lead[key],
    onChange: (e: { target: { value: string } }) => setLead((l) => ({ ...l, [key]: e.target.value })),
    "aria-invalid": !!fieldErrors[key],
  });

  const renderIntro = () => (
    <>
      <h2 ref={headingRef} tabIndex={-1} className="mb-3 font-heading text-2xl font-bold leading-tight outline-none sm:text-3xl">
        ¿En qué nivel está su Sistema de Gestión de la Calidad?
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-navy-900/80 sm:text-base">
        Evalúe los {REQUIREMENTS.length} requisitos clave de la norma ISO 9001:2015, del capítulo 4 al 10. En unos 10 minutos obtendrá su nivel de madurez, el cumplimiento por capítulo y un plan de acción priorizado que puede descargar en PDF.
      </p>
      <p className="mb-2 text-sm font-bold">Para cada requisito elija una opción:</p>
      <ul className="mb-5 grid gap-2 sm:grid-cols-2">
        {ANSWERS.map((a) => (
          <li key={a.value} className="flex items-start gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
            <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${ANSWER_STYLE[a.value]}`}>{a.label}</span>
            <span className="text-navy-900/75">{a.hint}</span>
          </li>
        ))}
      </ul>
      <p className="mb-2 text-sm font-bold">Niveles de madurez</p>
      <ol className="mb-6 flex flex-wrap gap-2 text-xs">
        {LEVELS.map((l) => (
          <li key={l.name} className="rounded-full bg-[#0b2a5e]/5 px-3 py-1">
            <strong>{l.name}</strong> {l.min}–{l.max}%
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => setStep("datos")} className={heroBtnOrange}>
        Comenzar autodiagnóstico
      </button>
      <p className="mt-4 text-xs text-navy-900/60">Gratis. Herramienta orientativa: no reemplaza una auditoría.</p>
    </>
  );

  const renderDatos = () => (
    <>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-900/60">Antes de empezar</p>
      <h2 ref={headingRef} tabIndex={-1} className="mb-2 text-xl font-bold leading-snug outline-none sm:text-2xl">
        Sus datos para el informe
      </h2>
      <p className="mb-5 text-sm text-navy-900/75">Aparecen en su informe y nos permiten revisar el resultado con usted.</p>
      <form onSubmit={handleDatos} noValidate className="grid gap-3 sm:grid-cols-2">
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <div>
          <label htmlFor="ad-name" className="mb-1 block text-xs font-semibold">
            Nombre <span className="text-destructive">*</span>
          </label>
          <input id="ad-name" autoComplete="name" maxLength={100} className={inputClass} {...field("name")} />
          <FieldError message={fieldErrors.name} />
        </div>
        <div>
          <label htmlFor="ad-role" className="mb-1 block text-xs font-semibold">Cargo</label>
          <input id="ad-role" autoComplete="organization-title" maxLength={100} className={inputClass} {...field("role")} />
        </div>
        <div>
          <label htmlFor="ad-company" className="mb-1 block text-xs font-semibold">
            Empresa <span className="text-destructive">*</span>
          </label>
          <input id="ad-company" autoComplete="organization" maxLength={150} className={inputClass} {...field("company")} />
          <FieldError message={fieldErrors.company} />
        </div>
        <div>
          <label htmlFor="ad-email" className="mb-1 block text-xs font-semibold">
            Correo electrónico <span className="text-destructive">*</span>
          </label>
          <input id="ad-email" type="email" autoComplete="email" maxLength={150} className={inputClass} {...field("email")} />
          <FieldError message={fieldErrors.email} />
        </div>
        <div>
          <label htmlFor="ad-sector" className="mb-1 block text-xs font-semibold">
            Sector <span className="text-destructive">*</span>
          </label>
          <select id="ad-sector" className={inputClass} {...field("sector")}>
            <option value="">Seleccione…</option>
            {SECTORS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <FieldError message={fieldErrors.sector} />
        </div>
        <div>
          <label htmlFor="ad-size" className="mb-1 block text-xs font-semibold">
            Tamaño de la empresa <span className="text-destructive">*</span>
          </label>
          <select id="ad-size" className={inputClass} {...field("size")}>
            <option value="">Seleccione…</option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <FieldError message={fieldErrors.size} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ad-phone" className="mb-1 block text-xs font-semibold">Teléfono o WhatsApp</label>
          <input id="ad-phone" type="tel" autoComplete="tel" maxLength={30} className={inputClass} {...field("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2.5 text-sm text-navy-900/80">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={!!fieldErrors.consent}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#1d4ed8]"
            />
            <span>
              {CONSENT_TEXT} <span className="text-destructive">*</span>
            </span>
          </label>
          <FieldError message={fieldErrors.consent} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" className={heroBtnOrange}>
            Continuar <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setStep("intro")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900/70 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>
        </div>
      </form>
    </>
  );

  const renderChapter = (index: number) => {
    const chapter = CHAPTERS[index];
    const first = REQUIREMENTS.findIndex((r) => r.chapter === chapter);
    const indexes = chapter.requirements.map((_, i) => first + i);
    const answered = indexes.filter((i) => answers[i] !== null).length;
    const complete = answered === indexes.length;
    const isLast = index === CHAPTERS.length - 1;
    return (
      <>
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-navy-900/60">
            <span>
              Capítulo {chapter.number} · Paso {index + 1} de {CHAPTERS.length}
            </span>
            <span>
              {answered} de {indexes.length} respondidos
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-[#FF8024] transition-[width] duration-300" style={{ width: `${((index + answered / indexes.length) / CHAPTERS.length) * 100}%` }} />
          </div>
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mb-2 text-xl font-bold leading-snug outline-none sm:text-2xl">
          {chapter.number}. {chapter.name}
        </h2>
        <p className="mb-5 text-xs text-navy-900/60">Completo: se cumple con evidencia · Parcial: en parte · Ninguno: no se cumple · No aplica: no cuenta.</p>
        <div className="space-y-4">
          {indexes.map((i) => {
            const req = REQUIREMENTS[i];
            return (
              <fieldset key={req.clause} className="rounded-xl border border-gray-200 p-4">
                <legend className="sr-only">
                  Numeral {req.clause}: {req.text}
                </legend>
                <p className="mb-3 text-sm leading-relaxed sm:text-base" aria-hidden="true">
                  <span className="mr-2 rounded bg-[#0b2a5e]/10 px-2 py-0.5 text-xs font-bold">{req.clause}</span>
                  {req.text}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ANSWERS.map((a) => (
                    <label key={a.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name={`req-${i}`}
                        value={a.value}
                        checked={answers[i] === a.value}
                        onChange={() => setAnswers((prev) => prev.map((x, j) => (j === i ? a.value : x)))}
                        className="peer sr-only"
                      />
                      <span className="block rounded-lg border border-gray-300 px-2 py-2 text-center text-sm transition-colors hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:font-semibold peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1">
                        {a.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!complete}
            onClick={() => setStep(isLast ? "result" : index + 1)}
            className={`${heroBtnOrange} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isLast ? "Ver mi resultado" : "Siguiente capítulo"} <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setStep(index === 0 ? "datos" : index - 1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900/70 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>
          {!complete && <p className="w-full text-xs text-navy-900/60">Responda los {indexes.length} requisitos para continuar.</p>}
        </div>
      </>
    );
  };

  const renderResult = (r: DiagnosisResult) => {
    const whatsappText = `Hola, hice el autodiagnóstico ISO 9001 en datasyslatam.com: mi sistema de gestión está en nivel ${r.level.name} (${r.percent}% de cumplimiento). Quisiera revisar el plan de acción.`;
    return (
      <>
        <Report result={r} lead={lead} date={date} headingRef={headingRef} />
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm" role="status">
          {sendStatus === "sending" && (
            <p className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando su resultado a DataSys Latam…
            </p>
          )}
          {sendStatus === "sent" && (
            <p className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <strong>Recibimos su diagnóstico.</strong> Un consultor de DataSys Latam le contactará para revisar el resultado y el plan de acción.
              </span>
            </p>
          )}
          {sendStatus === "error" && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-1.5 text-destructive">
                <AlertCircle size={14} /> {sendError}
              </p>
              <button type="button" onClick={() => void send(r)} className="font-semibold text-primary underline">
                Reintentar envío
              </button>
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={printReport} className={heroBtnOrange}>
            <Download className="h-4 w-4" /> Descargar informe (PDF)
          </button>
          <a href={whatsappUrl(whatsappText)} target="_blank" rel="noopener noreferrer" className={heroBtnBlue}>
            Hablar por WhatsApp
          </a>
          <button type="button" onClick={restart} className={heroBtnOutlineLight}>
            <RotateCcw className="h-4 w-4" /> Repetir autodiagnóstico
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <dialog
        ref={dialogRef}
        aria-label="Autodiagnóstico ISO 9001"
        onClose={handleClose}
        // Cierra solo si el clic empieza y termina en el fondo: seleccionar texto y soltar fuera no lo cierra.
        onPointerDown={(e) => {
          pressedBackdrop.current = e.target === dialogRef.current;
        }}
        onClick={(e) => {
          if (pressedBackdrop.current && e.target === dialogRef.current) dialogRef.current?.close();
          pressedBackdrop.current = false;
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-2xl bg-white p-0 text-navy-900 shadow-2xl backdrop:bg-navy-900/80 backdrop:backdrop-blur-sm"
      >
        <div ref={scrollRef} className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#B5560B]">Autodiagnóstico ISO 9001</span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Cerrar autodiagnóstico"
              className="flex h-9 w-9 items-center justify-center rounded-full text-navy-900/60 transition hover:bg-navy-900/5 hover:text-navy-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {open &&
            (step === "intro"
              ? renderIntro()
              : step === "datos"
                ? renderDatos()
                : step === "result"
                  ? result && renderResult(result)
                  : renderChapter(step))}
        </div>
      </dialog>
      {result &&
        createPortal(
          <div className="autodiag-print bg-white p-2 text-navy-900">
            <Report result={result} lead={lead} date={date} />
          </div>,
          document.body,
        )}
    </>
  );
};

export default AutodiagnosticoDialog;
