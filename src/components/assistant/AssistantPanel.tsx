import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Home,
  Mail,
  MessageCircle,
  MessagesSquare,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import logoImg from "@/assets/logo-datasyslatam.webp";
import { whatsappUrl } from "@/lib/whatsapp";
import { submitWeb3Forms, SUBMIT_ERROR_MESSAGES } from "@/lib/web3forms";
import { AUTODIAGNOSTICO_HASH } from "@/components/autodiagnostico/data";
import { askAssistant, transcriptText, type AssistantAction, type ChatMessage } from "./api";
import RichText from "./RichText";

const STORAGE_KEY = "datasys-assistant";
const MAX_CHARS = 800;

const GREETING: ChatMessage = {
  role: "assistant",
  local: true,
  text: "Hola 👋 Soy el asistente virtual de DataSys Latam. Pregúnteme por nuestros servicios, la consultoría ISO o cómo empezar.",
  suggestions: ["¿Qué servicios ofrecen?", "Un cliente me exige ISO 9001", "Quiero automatizar procesos", "¿Cuánto cuesta?"],
};

const ERRORS: Record<"rate" | "unavailable", ChatMessage> = {
  rate: {
    role: "assistant",
    local: true,
    text: "Ha enviado varias preguntas seguidas. Espere unos minutos o, si prefiere, continúe con un asesor.",
    actions: ["whatsapp", "mensaje"],
  },
  unavailable: {
    role: "assistant",
    local: true,
    text: "No pude responder en este momento. Un asesor puede ayudarle de inmediato por WhatsApp o puede dejarnos un mensaje.",
    actions: ["whatsapp", "mensaje"],
  },
};

type View = "home" | "chat" | "form";
type FormMode = "mensaje" | "agendar";

interface Stored {
  messages: ChatMessage[];
  view: View;
}

const loadStored = (): Stored | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
};

const ACTION_LABELS: Record<AssistantAction, { label: string; Icon: typeof Mail }> = {
  whatsapp: { label: "Hablar por WhatsApp", Icon: MessageCircle },
  agendar: { label: "Agendar una reunión", Icon: CalendarDays },
  mensaje: { label: "Dejar un mensaje", Icon: Mail },
  autodiagnostico: { label: "Hacer el autodiagnóstico", Icon: ClipboardCheck },
};

interface Props {
  onClose: () => void;
}

const AssistantPanel = ({ onClose }: Props) => {
  const stored = useRef(loadStored()).current;
  const [messages, setMessages] = useState<ChatMessage[]>(stored?.messages?.length ? stored.messages : [GREETING]);
  const [view, setView] = useState<View>(stored?.view === "chat" ? "chat" : "home");
  const [formMode, setFormMode] = useState<FormMode>("mensaje");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, view: view === "form" ? "chat" : view }));
    } catch {
      /* Navegación privada o almacenamiento bloqueado: la conversación solo dura mientras el panel esté abierto. */
    }
  }, [messages, view]);

  useEffect(() => {
    if (view === "chat") listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, view]);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus();
    else panelRef.current?.focus();
  }, [view]);

  const lastUserText = [...messages].reverse().find((m) => m.role === "user")?.text ?? "";
  const whatsappLink = whatsappUrl(
    lastUserText
      ? `Hola, vengo del asistente del sitio web. Mi consulta: ${lastUserText}`
      : "Hola, quisiera más información sobre sus servicios",
  );

  const send = async (text: string) => {
    const clean = text.trim().slice(0, MAX_CHARS);
    if (!clean || pending) return;
    const next = [...messages, { role: "user" as const, text: clean }];
    setMessages(next);
    setDraft("");
    setView("chat");
    setPending(true);
    const result = await askAssistant(next);
    setMessages((prev) => [...prev, result.ok ? result.message : ERRORS[result.reason]]);
    setPending(false);
  };

  const openForm = (mode: FormMode) => {
    setFormMode(mode);
    setView("form");
  };

  const openAutodiagnostico = () => {
    onClose();
    window.location.hash = AUTODIAGNOSTICO_HASH;
  };

  const runAction = (action: AssistantAction) => {
    if (action === "autodiagnostico") openAutodiagnostico();
    else if (action === "mensaje" || action === "agendar") openForm(action);
  };

  const onInputKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="assistant-title"
      // En pantallas grandes, el panel queda entre el menú del sitio (72 px) y el botón flotante.
      className="fixed inset-0 z-[110] flex flex-col overflow-hidden bg-[#f5f7fb] font-body text-navy-900 shadow-2xl outline-none sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-11rem))] sm:w-[390px] sm:rounded-2xl sm:border sm:border-navy-900/10"
    >
      {/* Encabezado */}
      {view === "home" ? (
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-navy-600 px-6 pb-16 pt-6 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric-500/30 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <img src={logoImg} alt="DataSys Latam Group" width={120} height={37} className="h-9 w-auto object-contain" />
            <button type="button" onClick={onClose} aria-label="Cerrar el asistente" className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 id="assistant-title" className="relative mt-8 font-heading text-[1.65rem] font-bold leading-tight">
            Hola 👋
            <br />
            ¿Cómo podemos ayudarle?
          </h2>
        </header>
      ) : (
        <header className="flex shrink-0 items-center gap-3 border-b border-navy-900/10 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setView(view === "form" ? "chat" : "home")}
            aria-label="Volver"
            className="rounded-full p-1.5 text-navy-700 hover:bg-navy-900/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-electric-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="assistant-title" className="truncate text-sm font-semibold">
              {view === "form" ? (formMode === "agendar" ? "Agendar una reunión" : "Envíenos un mensaje") : "Asistente DataSys"}
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-steel-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {view === "form" ? "Le responde una persona del equipo" : "Responde al instante con IA"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar el asistente" className="rounded-full p-1.5 text-navy-700 hover:bg-navy-900/5">
            <X className="h-5 w-5" />
          </button>
        </header>
      )}

      {/* Contenido */}
      {view === "home" && (
        <div className="relative z-10 -mt-10 flex-1 space-y-3 overflow-y-auto px-5 pb-5">
          <HomeCard
            title="Pregúntele a nuestro asistente"
            text="Respuestas al instante sobre servicios, normas ISO y tecnología"
            Icon={Send}
            onClick={() => setView("chat")}
            highlight
          />
          <HomeCard title="Hacer el autodiagnóstico gratis" text="Sepa en 10 minutos en qué etapa está su empresa" Icon={ClipboardCheck} onClick={openAutodiagnostico} />
          <HomeCard title="Hablar por WhatsApp" text="Un asesor le atiende directamente" Icon={MessageCircle} href={whatsappLink} />
          <HomeCard title="Agendar una reunión" text="Cuéntenos su necesidad y cuándo le sirve" Icon={CalendarDays} onClick={() => openForm("agendar")} />
          <HomeCard title="Leer el blog" text="Guías prácticas sobre ISO, procesos y tecnología" Icon={BookOpen} href="/blog" internal onNavigate={onClose} />
          <div className="flex items-center gap-3 rounded-xl border border-navy-900/10 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-sm font-semibold">Asistente disponible</p>
              <p className="text-xs text-steel-500">Si lo necesita, un asesor continúa por WhatsApp o correo.</p>
            </div>
          </div>
        </div>
      )}

      {view === "chat" && (
        <>
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-navy-800 px-4 py-2.5 text-sm leading-relaxed text-white">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="flex max-w-[92%] flex-col gap-2">
                  <div className="space-y-2 rounded-2xl rounded-bl-md border border-navy-900/10 bg-white px-4 py-3 text-sm leading-relaxed shadow-sm">
                    <RichText text={m.text} onNavigate={onClose} />
                  </div>
                  {!!m.actions?.length && (
                    <div className="flex flex-wrap gap-2">
                      {m.actions.map((action) => {
                        const { label, Icon } = ACTION_LABELS[action];
                        const cls =
                          "inline-flex items-center gap-1.5 rounded-full bg-[#FF8024] px-3.5 py-2 text-xs font-semibold text-navy-900 transition hover:brightness-110";
                        return action === "whatsapp" ? (
                          <a key={action} href={whatsappLink} target="_blank" rel="noopener noreferrer" className={cls}>
                            <Icon className="h-3.5 w-3.5" /> {label}
                          </a>
                        ) : (
                          <button key={action} type="button" onClick={() => runAction(action)} className={cls}>
                            <Icon className="h-3.5 w-3.5" /> {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            )}
            {pending && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-navy-900/10 bg-white px-4 py-3" aria-label="El asistente está escribiendo">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-steel-400" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </div>
            )}
            {!pending && lastMessage?.role === "assistant" && !!lastMessage.suggestions?.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {lastMessage.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-electric-500/40 bg-white px-3 py-1.5 text-xs font-medium text-electric-600 transition hover:bg-electric-500/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            className="shrink-0 border-t border-navy-900/10 bg-white px-3 pb-2 pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
          >
            <div className="flex items-end gap-2 rounded-xl border border-navy-900/15 bg-[#f5f7fb] px-3 py-2 focus-within:border-electric-500">
              <label htmlFor="assistant-input" className="sr-only">
                Escriba su pregunta
              </label>
              <textarea
                id="assistant-input"
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={MAX_CHARS}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Escriba su pregunta…"
                className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-steel-400"
              />
              <button
                type="submit"
                disabled={!draft.trim() || pending}
                aria-label="Enviar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-white transition hover:bg-electric-600 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] leading-snug text-steel-500">
              Respuestas generadas con IA a partir de este sitio; pueden contener errores. No comparta datos sensibles.
            </p>
          </form>
        </>
      )}

      {view === "form" && <ContactForm mode={formMode} messages={messages} whatsappLink={whatsappLink} />}

      {/* Pestañas */}
      {view !== "form" && (
        <nav className="flex shrink-0 border-t border-navy-900/10 bg-white" aria-label="Secciones del asistente">
          {(
            [
              ["home", "Inicio", Home],
              ["chat", "Mensajes", MessagesSquare],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-current={view === key ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${view === key ? "text-navy-900" : "text-steel-400 hover:text-navy-700"}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------

interface HomeCardProps {
  title: string;
  text: string;
  Icon: typeof Mail;
  onClick?: () => void;
  href?: string;
  internal?: boolean;
  onNavigate?: () => void;
  highlight?: boolean;
}

const HomeCard = ({ title, text, Icon, onClick, href, internal, onNavigate, highlight }: HomeCardProps) => {
  const cls = `group flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
    highlight ? "border-electric-500/40" : "border-navy-900/10"
  }`;
  const body = (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-[#FF8024] text-navy-900" : "bg-navy-900/5 text-navy-700"}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-navy-900">{title}</span>
        <span className="block text-xs text-steel-500">{text}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-steel-400 transition group-hover:translate-x-0.5 group-hover:text-navy-700" />
    </>
  );
  if (href) {
    return internal ? (
      <a href={href} className={cls} onClick={onNavigate}>
        {body}
      </a>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
};

// ---------------------------------------------------------------------------

const ContactForm = ({ mode, messages, whatsappLink }: { mode: FormMode; messages: ChatMessage[]; whatsappLink: string }) => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const conversation = transcriptText(messages);
  const lastQuestion = [...messages].reverse().find((m) => m.role === "user")?.text ?? "";
  const defaultMessage =
    mode === "agendar"
      ? `Quisiera agendar una reunión.\nTema: ${lastQuestion}\nDías y horarios que me sirven: `
      : lastQuestion;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("botcheck")) return;
    setStatus("sending");
    setError("");
    const result = await submitWeb3Forms({
      subject: mode === "agendar" ? "Asistente web: solicitud de reunión" : "Asistente web: nuevo mensaje",
      from_name: "Asistente de datasyslatam.com",
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
      conversacion: conversation || "(sin conversación con el asistente)",
    });
    if (result.ok) setStatus("sent");
    else {
      setStatus("idle");
      setError(SUBMIT_ERROR_MESSAGES[result.reason]);
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <p className="font-heading text-lg font-bold">¡Gracias! Recibimos su {mode === "agendar" ? "solicitud" : "mensaje"}.</p>
        <p className="text-sm text-steel-500">Le responderemos a {email} lo antes posible.</p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-electric-600 underline underline-offset-2">
          ¿Es urgente? Escríbanos por WhatsApp
        </a>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-electric-500";
  return (
    <form onSubmit={submit} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
      <p className="text-sm text-steel-500">
        {mode === "agendar"
          ? "Indíquenos el tema y los días u horarios que le sirven; le confirmaremos la reunión por correo."
          : "Déjenos sus datos y su consulta; una persona del equipo le responderá por correo."}
      </p>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="block text-xs font-semibold">
        Nombre *
        <input name="name" required autoComplete="name" className={`${field} mt-1`} />
      </label>
      <label className="block text-xs font-semibold">
        Correo electrónico *
        <input name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${field} mt-1`} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-semibold">
          Teléfono
          <input name="phone" type="tel" autoComplete="tel" className={`${field} mt-1`} />
        </label>
        <label className="block text-xs font-semibold">
          Empresa
          <input name="company" autoComplete="organization" className={`${field} mt-1`} />
        </label>
      </div>
      <label className="block text-xs font-semibold">
        {mode === "agendar" ? "Tema y disponibilidad *" : "Mensaje *"}
        <textarea name="message" required rows={4} maxLength={2000} defaultValue={defaultMessage} className={`${field} mt-1 resize-none`} />
      </label>
      {conversation && <p className="text-[11px] text-steel-500">Adjuntaremos su conversación con el asistente para entender mejor su necesidad.</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8024] px-4 py-3 text-sm font-semibold text-navy-900 transition hover:brightness-110 disabled:opacity-60"
      >
        {mode === "agendar" ? <CalendarDays className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
        {status === "sending" ? "Enviando…" : mode === "agendar" ? "Solicitar la reunión" : "Enviar mensaje"}
      </button>
    </form>
  );
};

export default AssistantPanel;
