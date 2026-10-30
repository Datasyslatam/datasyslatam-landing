import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import NovaAvatar from "./NovaAvatar";

// El panel (y su lógica) se descarga solo cuando el visitante abre el asistente: no pesa en la carga inicial.
const loadPanel = () => import("./AssistantPanel");
const AssistantPanel = lazy(loadPanel);

/** Botón flotante del asistente del sitio; reemplaza al antiguo botón de WhatsApp, que ahora vive dentro del panel. */
const AssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Pequeño aviso la primera vez en la sesión, para que se note que hay un asistente.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("datasys-assistant-hint") === "1";
    } catch {
      /* sin almacenamiento: se muestra igual */
    }
    if (seen) return;
    const show = setTimeout(() => setHint(true), 4000);
    const hide = setTimeout(() => setHint(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setHint(false);
    try {
      sessionStorage.setItem("datasys-assistant-hint", "1");
    } catch {
      /* sin almacenamiento */
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  return (
    <>
      {open && (
        <Suspense fallback={null}>
          <AssistantPanel onClose={close} />
        </Suspense>
      )}

      {hint && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="nova-glass fixed bottom-[5.6rem] right-5 z-50 max-w-[16rem] animate-fade-in rounded-2xl rounded-br-sm px-4 py-3 text-left text-sm text-navy-900 shadow-xl ring-1 ring-[#7c3aed]/20 sm:right-6"
        >
          <span className="font-semibold">¡Hola! Soy Nova ✨</span>
          <br />
          <span className="text-steel-500">¿Tiene alguna pregunta? Le respondo al instante.</span>
        </button>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        onMouseEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        aria-label={open ? "Cerrar el chat con Nova" : "Abrir el chat con Nova, asistente virtual de DataSys Latam"}
        aria-expanded={open}
        className={`assistant-launcher nova-launcher fixed bottom-4 right-4 z-[111] h-14 w-14 items-center justify-center rounded-full text-white transition hover:scale-105 sm:bottom-6 sm:right-6 sm:h-[60px] sm:w-[60px] ${
          open ? "nova-gradient hidden sm:flex" : "flex"
        }`}
      >
        {!open && <span className="assistant-pulse" aria-hidden="true" />}
        {open ? <ChevronDown className="h-7 w-7" /> : <NovaAvatar size={60} animated className="h-full w-full" />}
      </button>
    </>
  );
};

export default AssistantWidget;
