// Diagnóstico del asistente: GET /api/diagnostico.
// Mide en paralelo cuánto tarda Gemini con distintas configuraciones, para saber si la lentitud viene del modelo,
// de la forma de la solicitud (instrucciones largas, salida JSON) o de la cuenta. Nunca devuelve la clave ni el
// contenido de conversaciones; los mensajes de error de Google se recortan y se ocultan los números largos.
import { GEMINI_URL, MODEL, RESPONSE_SCHEMA, SERVICE_TIER, THINKING, loadKnowledge, outputText, systemInstruction } from "./chat.mjs";

const API = "https://generativelanguage.googleapis.com/v1beta";
const PROBE_TIMEOUT_MS = 40_000;
// Cada ejecución hace unas 7 llamadas pequeñas a Gemini: como mucho una cada 2 minutos para todo el sitio.
const MIN_INTERVAL_MS = 2 * 60_000;
const ALT_MODELS = (process.env.CHAT_DIAG_MODELS || "gemini-3.1-flash-lite,gemini-3.8-flash").split(",").map((m) => m.trim()).filter(Boolean);
const PING = "Responde únicamente con la palabra: ok";

let lastRun = 0;
let lastResult = null;

const headers = () => ({ "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY });
const clean = (text) => String(text ?? "").replace(/\d{6,}/g, "…").replace(/\s+/g, " ").slice(0, 220);

/** Ejecuta una prueba y devuelve su tiempo y resultado, sin lanzar errores. */
const probe = async (name, run) => {
  const started = Date.now();
  try {
    const detail = await run(AbortSignal.timeout(PROBE_TIMEOUT_MS));
    return { prueba: name, ok: true, ms: Date.now() - started, ...detail };
  } catch (err) {
    const timedOut = err?.name === "TimeoutError" || err?.name === "AbortError";
    return { prueba: name, ok: false, ms: Date.now() - started, error: timedOut ? `sin respuesta en ${PROBE_TIMEOUT_MS / 1000} s` : clean(err?.message) };
  }
};

const failIfNotOk = async (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${clean(await res.text())}`);
  return res.json();
};

const interaction = (body) => async (signal) => {
  const json = await failIfNotOk(await fetch(GEMINI_URL, { method: "POST", headers: headers(), body: JSON.stringify({ store: false, ...body }), signal }));
  return {
    estado: json.status,
    nivel_servicio: json.service_tier ?? "(no informado)",
    tokens_entrada: json.usage?.total_input_tokens,
    tokens_salida: json.usage?.total_output_tokens,
    tokens_razonamiento: json.usage?.total_thought_tokens,
    texto: clean(outputText(json)).slice(0, 80),
  };
};

export const runDiagnostic = async () => {
  const kb = await loadKnowledge();
  const realRequest = {
    model: MODEL,
    system_instruction: systemInstruction(kb),
    input: "Visitante: ¿Qué es Governex?\n\nResponde al último mensaje del visitante.",
    response_format: { type: "text", mime_type: "application/json", schema: RESPONSE_SCHEMA },
    generation_config: { thinking_level: THINKING },
    ...(SERVICE_TIER ? { service_tier: SERVICE_TIER } : {}),
  };

  const probes = [
    probe("1. Conexión y clave (lista de modelos)", async (signal) => {
      const json = await failIfNotOk(await fetch(`${API}/models?pageSize=200`, { headers: headers(), signal }));
      const names = (json.models ?? []).map((m) => m.name.replace("models/", ""));
      return { modelos_flash_disponibles: names.filter((n) => /flash/.test(n)).slice(0, 15), modelo_configurado_disponible: names.includes(MODEL) };
    }),
    probe(`2. ${MODEL}: pregunta mínima`, interaction({ model: MODEL, input: PING, generation_config: { thinking_level: THINKING } })),
    probe(`3. ${MODEL}: solicitud real del asistente`, interaction(realRequest)),
    probe(`4. ${MODEL}: solicitud real sin salida JSON`, interaction({ ...realRequest, response_format: undefined })),
    probe(`5. ${MODEL}: API generateContent, pregunta mínima`, async (signal) => {
      const json = await failIfNotOk(
        await fetch(`${API}/models/${MODEL}:generateContent`, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: PING }] }] }),
          signal,
        }),
      );
      return { texto: clean(json.candidates?.[0]?.content?.parts?.map((p) => p.text).join("")).slice(0, 80), version_modelo: json.modelVersion };
    }),
    ...ALT_MODELS.map((model, i) =>
      probe(`${6 + i}. ${model}: pregunta mínima`, interaction({ model, input: PING, generation_config: { thinking_level: "minimal" } })),
    ),
  ];

  return {
    fecha: new Date().toISOString(),
    configuracion: {
      modelo: MODEL,
      razonamiento: THINKING,
      nivel_servicio: SERVICE_TIER || "estándar (predeterminado)",
      clave_configurada: Boolean(process.env.GEMINI_API_KEY),
      base_conocimiento_caracteres: kb.length,
      region_servidor: process.env.RAILWAY_REPLICA_REGION ?? "(no informada)",
    },
    pruebas: await Promise.all(probes),
  };
};

const send = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body, null, 2));
};

export const handleDiagnostic = async (req, res) => {
  if (req.method !== "GET") return send(res, 405, { error: "method" });
  if (!process.env.GEMINI_API_KEY) return send(res, 503, { error: "Falta GEMINI_API_KEY en el servidor." });
  const wait = MIN_INTERVAL_MS - (Date.now() - lastRun);
  if (wait > 0) return send(res, 200, { nota: `Resultado de hace menos de 2 minutos; la próxima medición en ${Math.ceil(wait / 1000)} s.`, ...lastResult });
  lastRun = Date.now();
  lastResult = await runDiagnostic();
  console.log(`[diagnóstico] ${lastResult.pruebas.map((p) => `${p.prueba.split(".")[0]}=${p.ok ? p.ms : "error"}`).join(" ")}`);
  return send(res, 200, lastResult);
};
