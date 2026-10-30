// Cliente del asistente: habla con /api/chat (server/chat.mjs), que es quien llama a Gemini.

export type AssistantAction = "whatsapp" | "mensaje" | "agendar" | "autodiagnostico";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  actions?: AssistantAction[];
  suggestions?: string[];
  /** Mensajes generados en el navegador (saludo, avisos de error): no se envían al modelo. */
  local?: boolean;
}

export type AskResult =
  | { ok: true; message: ChatMessage }
  | { ok: false; reason: "rate" | "unavailable" };

export const askAssistant = async (history: ChatMessage[]): Promise<AskResult> => {
  const messages = history.filter((m) => !m.local).map(({ role, text }) => ({ role, text }));
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(60_000),
    });
    if (res.status === 429) return { ok: false, reason: "rate" };
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const data = await res.json();
    return {
      ok: true,
      message: { role: "assistant", text: data.answer, actions: data.actions ?? [], suggestions: data.suggestions ?? [] },
    };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
};

/** La conversación en texto plano, para adjuntarla al correo o al mensaje de WhatsApp. */
export const transcriptText = (history: ChatMessage[], maxTurns = 10) =>
  history
    .filter((m) => !m.local)
    .slice(-maxTurns)
    .map((m) => `${m.role === "user" ? "Visitante" : "Nova (asistente)"}: ${m.text}`)
    .join("\n\n");
