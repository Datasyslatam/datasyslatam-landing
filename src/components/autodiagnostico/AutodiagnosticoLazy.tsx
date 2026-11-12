import { lazy, Suspense, useEffect, useState } from "react";
import { AUTODIAGNOSTICO_HASH } from "./hash";

// El cuestionario (y su lógica) se descarga la primera vez que alguien lo abre: no pesa en la carga inicial.
const loadDialog = () => import("./AutodiagnosticoDialog");
const AutodiagnosticoDialog = lazy(loadDialog);

const isAutodiagnosticoLink = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest(`a[href$="${AUTODIAGNOSTICO_HASH}"]`);

/**
 * Monta el autodiagnóstico cuando la dirección llega a #autodiagnostico (también al cargar la página con ese hash).
 * Una vez montado, el propio diálogo atiende las siguientes aperturas. Al pasar el mouse o el foco por un enlace al
 * autodiagnóstico se adelanta la descarga, para que abra sin espera.
 */
const AutodiagnosticoLazy = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const sync = () => {
      if (window.location.hash === AUTODIAGNOSTICO_HASH) setMounted(true);
    };
    const prefetch = (e: Event) => {
      if (isAutodiagnosticoLink(e.target)) void loadDialog();
    };
    sync();
    window.addEventListener("hashchange", sync);
    document.addEventListener("pointerover", prefetch);
    document.addEventListener("focusin", prefetch);
    return () => {
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("pointerover", prefetch);
      document.removeEventListener("focusin", prefetch);
    };
  }, [mounted]);

  return mounted ? (
    <Suspense fallback={null}>
      <AutodiagnosticoDialog />
    </Suspense>
  ) : null;
};

export default AutodiagnosticoLazy;
