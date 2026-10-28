import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

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
          className="fixed bottom-[5.6rem] right-5 z-50 max-w-[15rem] animate-fade-in rounded-2xl rounded-br-sm bg-white px-4 py-3 text-left text-sm text-navy-900 shadow-xl ring-1 ring-navy-900/10 sm:right-6"
        >
          <span className="font-semibold">¿Tiene alguna pregunta?</span>
          <br />
          <span className="text-steel-500">Nuestro asistente le responde al instante.</span>
        </button>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        onMouseEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        aria-label={open ? "Cerrar el asistente" : "Abrir el asistente de DataSys Latam"}
        aria-expanded={open}
        className={`assistant-launcher fixed bottom-4 right-4 z-[111] h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-electric-600 text-white shadow-xl transition hover:scale-105 sm:bottom-6 sm:right-6 sm:h-[60px] sm:w-[60px] ${
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {!open && <span className="assistant-pulse" aria-hidden="true" />}
        {open ? <ChevronDown className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </>
  );
};

export default AssistantWidget;
