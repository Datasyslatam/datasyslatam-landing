import { Component, type ReactNode } from "react";

interface Props {
  /** Qué no se pudo abrir, p. ej. «el autodiagnóstico». */
  feature: string;
  children: ReactNode;
}

/**
 * Aísla una parte diferida del sitio (autodiagnóstico, asistente): si falla al descargarse o al mostrarse, se ve un
 * aviso con opción de recargar y el resto de la página sigue funcionando. Sin esto, React desmonta toda la página.
 */
type Status = "ok" | "failed" | "dismissed";

class ChunkErrorBoundary extends Component<Props, { status: Status }> {
  state: { status: Status } = { status: "ok" };

  static getDerivedStateFromError(): { status: Status } {
    return { status: "failed" };
  }

  componentDidCatch(error: unknown) {
    console.error(`[${this.props.feature}]`, error);
  }

  render() {
    if (this.state.status === "ok") return this.props.children;
    // Al cerrar el aviso no se vuelve a intentar: la parte que falló queda oculta hasta recargar.
    if (this.state.status === "dismissed") return null;
    return (
      <div
        role="alert"
        className="fixed bottom-24 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-navy-900 px-4 py-3 text-sm text-white shadow-2xl"
      >
        <span>No pudimos abrir {this.props.feature}. Recargue la página para intentarlo de nuevo.</span>
        <span className="flex shrink-0 gap-2">
          <button type="button" onClick={() => window.location.reload()} className="rounded-md bg-[#FF8024] px-3 py-1.5 font-semibold text-navy-900">
            Recargar
          </button>
          <button type="button" onClick={() => this.setState({ status: "dismissed" })} aria-label="Cerrar aviso" className="rounded-md px-2 py-1.5 text-white/70 hover:text-white">
            ✕
          </button>
        </span>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
