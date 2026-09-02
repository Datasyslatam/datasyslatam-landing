import { useEffect } from "react";

const useSecurity = () => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (e.key === "F12") { e.preventDefault(); return; }
      if (isMeta && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) { e.preventDefault(); return; }
      if (isMeta && e.key.toUpperCase() === "U") { e.preventDefault(); return; }
      if (isMeta && e.key.toUpperCase() === "S") { e.preventDefault(); return; }
    };
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("keydown", onKey, { passive: false });
    document.addEventListener("contextmenu", onContext, { passive: false });
    document.addEventListener("dragstart", onDragStart, { passive: false });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);
};

export default useSecurity;
