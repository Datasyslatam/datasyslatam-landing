const RELOADED_KEY = "datasys-chunk-reload";

/** Ventana en la que una segunda falla se considera la misma: así no hay ciclo de recargas, pero otra falla más tarde
 * en la misma pestaña (otro despliegue) sí vuelve a recargar. */
const WINDOW_MS = 30_000;

const alreadyReloaded = () => {
  try {
    const last = Number(sessionStorage.getItem(RELOADED_KEY));
    if (last && Date.now() - last < WINDOW_MS) return true;
    sessionStorage.setItem(RELOADED_KEY, String(Date.now()));
    return false;
  } catch {
    // Sin almacenamiento no se puede evitar un ciclo de recargas: no se recarga.
    return true;
  }
};

/**
 * Envuelve una descarga diferida de JavaScript (import()). Después de cada despliegue, los archivos de la versión
 * anterior dejan de existir: si alguien tenía la página abierta, la descarga falla. En ese caso se recarga la página
 * una sola vez (conservando el #hash) para tomar la versión nueva; si vuelve a fallar, se propaga el error para que
 * lo atienda un ChunkErrorBoundary en lugar de dejar la página en blanco.
 */
export const withChunkReload =
  <T,>(load: () => Promise<T>) =>
  async (): Promise<T> => {
    // La marca de la recarga no se borra al cargar bien otra parte: así una pieza que sigue fallando no recarga sin fin.
    try {
      return await load();
    } catch (error) {
      if (!alreadyReloaded()) {
        window.location.reload();
        return new Promise<T>(() => {});
      }
      throw error;
    }
  };
