import { useEffect, useState } from "react";

/*
 * Indica en el menú en qué sección del inicio está el visitante. Una sección cuenta como activa cuando cruza
 * una línea imaginaria a un tercio de la pantalla (debajo del menú fijo). Entre secciones que no están en el menú
 * (FAQ, metodología…) no se marca ninguna, para no señalar una sección que ya quedó atrás.
 *
 * Al pulsar un enlace del menú, la sección elegida se marca de inmediato y se mantiene mientras dura el
 * desplazamiento, para que el indicador no recorra todas las secciones intermedias.
 */
const LINE = 0.33;
const SETTLE_MS = 150;

const navOffset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

export const useActiveSection = (ids: string[], enabled: boolean) => {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    let frame = 0;
    let locked: string | null = null;
    let settle = 0;

    const compute = () => {
      frame = 0;
      if (locked) return;
      const top = navOffset();
      const line = top + (window.innerHeight - top) * LINE;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let found: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) found = id;
        // Al final de la página la última sección quizá no alcanza la línea: se marca si está a la vista.
        if (atBottom && rect.top < window.innerHeight && rect.bottom > top) found = id;
      }
      setActive(found);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    const release = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        locked = null;
        schedule();
      }, SETTLE_MS);
    };
    const onScroll = () => {
      if (locked) release();
      else schedule();
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link || link.origin !== location.origin || link.pathname !== location.pathname) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!ids.includes(id) || !document.getElementById(id)) return;
      locked = id;
      setActive(id);
      release(); // por si el salto es instantáneo y no hay más eventos de desplazamiento
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("click", onClick);
    window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      document.removeEventListener("click", onClick);
    };
  }, [key, enabled]); // `ids` se compara por su contenido (key), no por referencia

  return active;
};
