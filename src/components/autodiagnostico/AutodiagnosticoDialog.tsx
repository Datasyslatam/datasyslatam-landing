import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, RotateCcw, X } from "lucide-react";
import { AUTODIAGNOSTICO_HASH, QUESTIONS, STAGES, computeResult, type DiagnosisResult } from "./data";
import { heroBtnBlue, heroBtnOrange, heroBtnOutlineLight } from "../heroButtons";
import { SUBMIT_ERROR_MESSAGES, submitWeb3Forms } from "@/lib/web3forms";
import { whatsappUrl } from "@/lib/whatsapp";

type Step = "intro" | number | "result";
type LeadStatus = "idle" | "sending" | "sent";

const SCALE_UP = {
  description: "Su empresa ya opera con orden, herramientas y datos. El reto ahora es escalar con analítica avanzada e inteligencia artificial.",
  nextStep: "analítica avanzada e inteligencia artificial aplicada a su operación.",
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-navy-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const emptyAnswers = () => QUESTIONS.map(() => null as number | null);

const AutodiagnosticoDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState(emptyAnswers);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadError, setLeadError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  // Se dispara al cerrar con Esc, con la X o al hacer clic fuera.
  const handleClose = () => {
    setOpen(false);
    if (window.location.hash === AUTODIAGNOSTICO_HASH) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const choose = (index: number, value: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    setStep(index + 1 < QUESTIONS.length ? index + 1 : "result");
  };

  const restart = () => {
    setAnswers(emptyAnswers());
    setLeadStatus("idle");
    setLeadError("");
    setFieldErrors({});
    setStep("intro");
  };

  const result: DiagnosisResult | null =
    step === "result" && answers.every((a) => a !== null) ? computeResult(answers as number[]) : null;

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!result) return;
    const formData = new FormData(event.currentTarget);
    const lead = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    };
    const errs: Record<string, string> = {};
    if (!lead.name) errs.name = "El nombre es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errs.email = "Ingrese un correo válido.";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLeadError("");
    // Honeypot: los bots suelen marcar el campo oculto; se descarta sin enviar.
    if (formData.get("botcheck")) {
      setLeadStatus("sent");
      return;
    }

    const { stage } = result;
    setLeadStatus("sending");
    const sent = await submitWeb3Forms({
      subject: `Autodiagnóstico: etapa ${stage.number} · ${stage.name} — ${lead.company || lead.name}`,
      ...lead,
      etapa: `${stage.number} · ${stage.name}`,
      puntaje_por_area: result.areas.map((a) => `${a.stage.area}: ${a.percent}%`).join(" | "),
      riesgos_principales: result.risks.join(" | ") || "Sin riesgos críticos",
      siguiente_paso: result.allMastered ? SCALE_UP.nextStep : stage.nextStep,
      respuestas: QUESTIONS.map((q, i) => `${i + 1}. ${q.text} → ${q.options[answers[i] as number]}`).join("\n"),
    });
    if (sent.ok) {
      setLeadStatus("sent");
    } else {
      setLeadStatus("idle");
      setLeadError(SUBMIT_ERROR_MESSAGES[sent.reason]);
    }
  };

  const renderIntro = () => (
    <>
      <h2 ref={headingRef} tabIndex={-1} className="mb-3 font-heading text-2xl sm:text-3xl font-bold leading-tight outline-none">
        ¿Qué tan ordenada está su empresa?
      </h2>
      <p className="mb-6 text-sm sm:text-base leading-relaxed text-navy-900/80">
        Responda 12 preguntas sobre procesos, calidad, herramientas y datos. En menos de 10 minutos sabrá en qué etapa está su empresa, cuáles son sus principales riesgos y cuál es el siguiente paso recomendado.
      </p>
      <ol className="mb-6 grid gap-2 sm:grid-cols-2">
        {STAGES.map((s) => (
          <li key={s.number} className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF8024] font-bold text-navy-900">{s.number}</span>
            <span><strong>{s.name}</strong> <span className="text-navy-900/60">· {s.area}</span></span>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => setStep(0)} className={heroBtnOrange}>
        Comenzar autodiagnóstico
      </button>
      <p className="mt-4 text-xs text-navy-900/60">
        Gratis. Sus respuestas se quedan en su navegador; solo se envían si usted pide que le contactemos.
      </p>
    </>
  );

  const renderQuestion = (index: number) => {
    const q = QUESTIONS[index];
    const stage = STAGES[q.stage - 1];
    return (
      <>
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-navy-900/60">
            <span>Pregunta {index + 1} de {QUESTIONS.length}</span>
            <span>Etapa {stage.number} · {stage.name}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-[#FF8024] transition-[width] duration-300" style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
        <h2 ref={headingRef} tabIndex={-1} id="autodiag-question" className="mb-5 text-xl sm:text-2xl font-bold leading-snug outline-none">
          {q.text}
        </h2>
        <div role="group" aria-labelledby="autodiag-question" className="grid gap-2.5">
          {q.options.map((option, value) => {
            const selected = answers[index] === value;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => choose(index, value)}
                className={
                  "rounded-lg border px-4 py-3 text-left text-sm sm:text-base transition-colors " +
                  (selected ? "border-primary bg-primary/10 font-semibold" : "border-gray-300 hover:border-primary hover:bg-primary/5")
                }
              >
                {option}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setStep(index === 0 ? "intro" : index - 1)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900/70 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </button>
      </>
    );
  };

  const renderResult = (r: DiagnosisResult) => {
    const description = r.allMastered ? SCALE_UP.description : r.stage.description;
    const nextStep = r.allMastered ? SCALE_UP.nextStep : r.stage.nextStep;
    const whatsappText = `Hola, hice el autodiagnóstico en datasyslatam.com: mi empresa está en la etapa ${r.stage.number} · ${r.stage.name}. Quisiera conversar sobre el siguiente paso.`;
    return (
      <>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-900/60">Su resultado</p>
        <h2 ref={headingRef} tabIndex={-1} className="mb-4 text-2xl sm:text-3xl font-bold leading-tight outline-none">
          Su empresa está en la etapa <span className="text-[#E07B1A]">{r.stage.number} · {r.stage.name}</span>
        </h2>
        <div className="mb-4 flex gap-1.5" aria-hidden="true">
          {STAGES.map((s) => (
            <span key={s.number} className={"h-1.5 flex-1 rounded-full " + (s.number <= r.stage.number ? "bg-[#FF8024]" : "bg-gray-200")} />
          ))}
        </div>
        <p className="mb-6 text-sm sm:text-base leading-relaxed text-navy-900/80">{description}</p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {r.areas.map((a) => (
            <div key={a.stage.number} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold">{a.stage.number}. {a.stage.area}</span>
                <span className="font-bold">{a.percent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
                <div className={"h-1.5 rounded-full " + (a.mastered ? "bg-primary" : "bg-[#FF8024]")} style={{ width: `${a.percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        {r.risks.length > 0 ? (
          <>
            <p className="mb-3 text-sm font-bold">{r.risks.length === 3 ? "Sus 3 riesgos principales" : "Riesgos detectados"}</p>
            <ol className="mb-5 space-y-2.5 text-sm text-navy-900/90">
              {r.risks.map((risk, i) => (
                <li key={risk} className="flex gap-3">
                  <span className="font-bold text-[#E07B1A]">{i + 1}</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="mb-5 text-sm">No detectamos riesgos críticos en sus respuestas.</p>
        )}
        <p className="mb-8 border-t border-gray-200 pt-4 text-sm leading-relaxed">
          <strong>Siguiente paso recomendado:</strong> {nextStep}
        </p>

        <div className="rounded-xl bg-slate-50 p-5 sm:p-6">
          {leadStatus === "sent" ? (
            <div className="flex items-start gap-3" role="status">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="font-bold">¡Listo! Recibimos su diagnóstico.</p>
                <p className="text-sm text-navy-900/80">Un consultor de DataSys Latam le contactará para revisar su resultado y el plan de acción.</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="mb-1 text-lg font-bold">¿Quiere que un consultor revise su resultado?</h3>
              <p className="mb-4 text-sm text-navy-900/80">Déjenos sus datos y le explicamos el diagnóstico y el plan de acción para su empresa.</p>
              <form onSubmit={handleLeadSubmit} noValidate className="grid gap-3 sm:grid-cols-2">
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                <div>
                  <label htmlFor="ad-name" className="mb-1 block text-xs font-semibold">Nombre <span className="text-destructive">*</span></label>
                  <input id="ad-name" name="name" autoComplete="name" maxLength={100} aria-invalid={!!fieldErrors.name} className={inputClass} />
                  {fieldErrors.name && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle size={12} /> {fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="ad-email" className="mb-1 block text-xs font-semibold">Correo electrónico <span className="text-destructive">*</span></label>
                  <input id="ad-email" name="email" type="email" autoComplete="email" maxLength={150} aria-invalid={!!fieldErrors.email} className={inputClass} />
                  {fieldErrors.email && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle size={12} /> {fieldErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="ad-company" className="mb-1 block text-xs font-semibold">Empresa</label>
                  <input id="ad-company" name="company" autoComplete="organization" maxLength={150} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="ad-phone" className="mb-1 block text-xs font-semibold">Teléfono o WhatsApp</label>
                  <input id="ad-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} className={inputClass} />
                </div>
                {leadError && (
                  <p className="sm:col-span-2 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle size={14} /> {leadError}</p>
                )}
                <div className="sm:col-span-2 flex flex-col items-start gap-2">
                  <button type="submit" disabled={leadStatus === "sending"} className={`${heroBtnOrange} disabled:cursor-not-allowed disabled:opacity-60`}>
                    {leadStatus === "sending" ? "Enviando..." : "Quiero que me contacten"}
                  </button>
                  <p className="text-xs text-navy-900/60">Usaremos estos datos solo para contactarle sobre su diagnóstico.</p>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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
    <dialog
      ref={dialogRef}
      aria-label="Autodiagnóstico de orden empresarial"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-2xl bg-white p-0 text-navy-900 shadow-2xl backdrop:bg-navy-900/80 backdrop:backdrop-blur-sm"
    >
      <div ref={scrollRef} className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#B5560B]">Autodiagnóstico</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar autodiagnóstico"
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy-900/60 transition hover:bg-navy-900/5 hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {open && (step === "intro" ? renderIntro() : step === "result" ? result && renderResult(result) : renderQuestion(step))}
      </div>
    </dialog>
  );
};

export default AutodiagnosticoDialog;
