import { useEffect } from "react";

/*
 * En el celular, los enlaces a secciones (#servicios, #contacto…) se resuelven aquí y no con el
 * salto nativo: el desplazamiento suave recorre miles de píxeles mientras el contenido de arriba
 * cambia de alto (carrusel del héroe, imágenes, fuentes) y Safari no compensa esos cambios, así
 * que el salto se quedaba corto o en otra sección. En escritorio se deja el salto nativo.
 */
const MOBILE = "(max-width: 1023px)";
const KEEP_ALIGNED_MS = 1500;
const USER_SCROLL = ["touchstart", "wheel", "keydown"] as const;

const navOffset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

/** Lleva la sección justo debajo del menú, sin animación, y la sostiene ahí mientras termina de cargar lo de arriba. */
export const jumpToSection = (el: HTMLElement) => {
  const html = document.documentElement;
  const align = () => {
    const delta = el.getBoundingClientRect().top - navOffset();
    if (Math.abs(delta) < 2) return;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, window.scrollY + delta);
    html.style.scrollBehavior = "";
  };
  let userScrolled = false;
  const stop = () => { userScrolled = true; };
  USER_SCROLL.forEach((type) => window.addEventListener(type, stop, { passive: true }));
  const until = performance.now() + KEEP_ALIGNED_MS;
  const tick = () => {
    if (userScrolled || performance.now() > until) {
      USER_SCROLL.forEach((type) => window.removeEventListener(type, stop));
      return;
    }
    align();
    requestAnimationFrame(tick);
  };
  align();
  requestAnimationFrame(tick);
};

const sectionFor = (hash: string) => (hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null);

/** Activa los saltos a secciones del celular en toda la página, también al llegar desde otra (/blog → /#servicios). */
export const useSectionLinks = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!window.matchMedia(MOBILE).matches) return;
      const link = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link || link.target || link.origin !== location.origin || link.pathname !== location.pathname) return;
      const el = sectionFor(link.hash);
      if (!el) return; // p. ej. #autodiagnostico abre un diálogo, no es una sección
      e.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      jumpToSection(el);
    };
    document.addEventListener("click", onClick);

    // Al abrir la página con #sección el navegador salta antes de que cargue todo: se realinea al terminar.
    let userScrolled = false;
    const stop = () => { userScrolled = true; };
    const onLoad = () => {
      const el = sectionFor(location.hash);
      if (el && !userScrolled && window.matchMedia(MOBILE).matches) jumpToSection(el);
    };
    if (location.hash) {
      USER_SCROLL.forEach((type) => window.addEventListener(type, stop, { passive: true, once: true }));
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
      USER_SCROLL.forEach((type) => window.removeEventListener(type, stop));
    };
  }, []);
};
