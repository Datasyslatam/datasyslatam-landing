// Respaldo del horario del blog: martes y viernes lanza el flujo .github/workflows/blog-agent.yml desde este servidor.
// El cron de GitHub Actions no es confiable: hasta el 30 de octubre de 2026 no había disparado ni una ejecución
// programada en este repositorio (todas fueron manuales). Desde las 7:00 a. m. (Colombia), si GitHub aún no corrió
// el flujo ese día, el servidor lo lanza con `programado: true`, que aplica la misma comprobación de "ya hay artículo
// de hoy" que las ejecuciones programadas. Nunca publica nada: el flujo solo abre un PR para revisión.
// Requiere BLOG_DISPATCH_TOKEN: token de GitHub de grano fino, solo para este repositorio, con permiso Actions: lectura y escritura.

const REPO = process.env.BLOG_REPO?.trim() || "Datasyslatam/datasyslatam-landing";
const WORKFLOW = "blog-agent.yml";
const API = `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}`;
const DAYS = new Set(["Tue", "Fri"]);
// Después de los dos horarios del cron (5:17 y 6:47 a. m.), para no duplicar si GitHub sí cumple.
const START_HOUR = 7;
const CHECK_EVERY_MS = 10 * 60_000;
// Lanzamientos por día como máximo: si el flujo falla (p. ej. Gemini caído), se reintenta, pero sin insistir sin fin.
const MAX_ATTEMPTS = 3;

const doneDays = new Set();

/** Fecha, día de la semana y hora en Colombia. */
export const bogotaNow = (date = new Date()) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", hourCycle: "h23" })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, weekday: parts.weekday, hour: Number(parts.hour) };
};

/** Decide qué hacer con las ejecuciones del flujo creadas hoy: esperar, dar el día por cumplido o lanzarlo. */
export const decide = (runs) => {
  if (runs.some((r) => r.status !== "completed")) return "wait";
  if (runs.some((r) => r.conclusion === "success")) return "done";
  return runs.length >= MAX_ATTEMPTS ? "give_up" : "dispatch";
};

const github = (token, path, init = {}) =>
  fetch(`${API}${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "datasyslatam-blog-schedule",
      ...init.headers,
    },
    signal: AbortSignal.timeout(20_000),
  });

const check = async (token) => {
  const { day, weekday, hour } = bogotaNow();
  if (!DAYS.has(weekday) || hour < START_HOUR || doneDays.has(day)) return;

  // Colombia no tiene horario de verano: la medianoche local es siempre las 05:00 UTC.
  const res = await github(token, `/runs?per_page=20&created=${encodeURIComponent(`>=${day}T05:00:00Z`)}`);
  if (!res.ok) throw new Error(`no se pudieron leer las ejecuciones (HTTP ${res.status})`);
  const action = decide((await res.json()).workflow_runs ?? []);

  if (action === "done") doneDays.add(day);
  if (action === "give_up") {
    doneDays.add(day);
    console.error(`[blog] El flujo del blog falló ${MAX_ATTEMPTS} veces hoy (${day}); revise GitHub Actions.`);
  }
  if (action !== "dispatch") return;

  const dispatch = await github(token, "/dispatches", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ref: "main", inputs: { programado: "true" } }),
  });
  if (!dispatch.ok) throw new Error(`no se pudo lanzar el flujo (HTTP ${dispatch.status})`);
  console.log(`[blog] GitHub no lanzó el artículo de hoy (${day}); se lanzó el flujo desde el servidor.`);
};

export const startBlogSchedule = () => {
  const token = process.env.BLOG_DISPATCH_TOKEN?.trim();
  if (!token) {
    console.log("[blog] Sin BLOG_DISPATCH_TOKEN: el respaldo del horario del blog está inactivo.");
    return;
  }
  const tick = () => check(token).catch((err) => console.error(`[blog] ${err?.message ?? err}`));
  tick();
  setInterval(tick, CHECK_EVERY_MS).unref();
};
