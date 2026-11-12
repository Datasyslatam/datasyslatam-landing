import { lazy, Suspense, useEffect, useState } from "react";
import { AUTODIAGNOSTICO_HASH } from "./hash";
import ChunkErrorBoundary from "../ChunkErrorBoundary";
import { withChunkReload } from "@/lib/chunkReload";

// El cuestionario (y su lógica) se descarga la primera vez que alguien lo abre: no pesa en la carga inicial.
// Si la descarga falla (p. ej. tras un despliegue), se recarga la página una vez; la precarga al pasar el mouse no recarga.
const loadDialog = () => import("./AutodiagnosticoDialog");
const AutodiagnosticoDialog = lazy(withChunkReload(loadDialog));

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
      if (isAutodiagnosticoLink(e.target)) loadDialog().catch(() => {});
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
    <ChunkErrorBoundary feature="el autodiagnóstico">
      <Suspense fallback={null}>
        <AutodiagnosticoDialog />
      </Suspense>
    </ChunkErrorBoundary>
  ) : null;
};

export default AutodiagnosticoLazy;
