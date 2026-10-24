// Se define en .env.local (local) o como variable del servicio en Railway. Ver .env.example.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? "";

export type SubmitResult = { ok: true } | { ok: false; reason: "config" | "api" | "network" };

/** Envía un formulario a Web3Forms; los campos llegan tal cual en el correo de notificación. */
export const submitWeb3Forms = async (fields: Record<string, string>): Promise<SubmitResult> => {
  if (!WEB3FORMS_KEY) {
    console.error("[Web3Forms] Falta VITE_WEB3FORMS_ACCESS_KEY en la configuración del build.");
    return { ok: false, reason: "config" };
  }
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, botcheck: false, ...fields }),
    });
    const json = await res.json();
    if (json.success) return { ok: true };
    console.error("[Web3Forms] API error:", json);
    return { ok: false, reason: "api" };
  } catch (err) {
    console.error("[Web3Forms] Error de red:", err);
    return { ok: false, reason: "network" };
  }
};

export const SUBMIT_ERROR_MESSAGES: Record<"config" | "api" | "network", string> = {
  config: "El formulario no está disponible en este momento. Escríbanos a contacto@datasyslatam.com.",
  api: "No se pudo enviar el mensaje. Inténtelo de nuevo.",
  network: "Error de red. Revise su conexión e inténtelo de nuevo.",
};
