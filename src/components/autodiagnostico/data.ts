// Autodiagnóstico de orden empresarial: 12 preguntas, 3 por cada etapa del método
// Ordenar → Estandarizar → Automatizar → Decidir con datos.

/** Cualquier enlace a este hash abre el autodiagnóstico (también sirve como URL para campañas). */
export const AUTODIAGNOSTICO_HASH = "#autodiagnostico";

export interface Stage {
  number: 1 | 2 | 3 | 4;
  name: string;
  area: string;
  description: string;
  nextStep: string;
}

export const STAGES: Stage[] = [
  {
    number: 1,
    name: "Ordenar",
    area: "Procesos y responsabilidades",
    description:
      "Su operación funciona, pero depende de personas clave y de la memoria del equipo. El primer paso es ordenar: documentar los procesos y definir quién hace qué.",
    nextStep: "mapa de procesos y plan de trabajo ISO 9001.",
  },
  {
    number: 2,
    name: "Estandarizar",
    area: "Calidad y mejora",
    description:
      "Ya existe un orden básico, pero la calidad todavía depende del esfuerzo del día a día. Es momento de estandarizar con un sistema de gestión que asegure resultados repetibles.",
    nextStep: "implementación de su sistema de gestión ISO 9001 asistida con IA (Governex).",
  },
  {
    number: 3,
    name: "Automatizar",
    area: "Herramientas e información",
    description:
      "Sus procesos están definidos; ahora el tiempo se pierde en tareas manuales y en datos repartidos. Es momento de automatizar con software a la medida.",
    nextStep: "digitalización de operaciones con software, ERP o web a la medida para centralizar la información.",
  },
  {
    number: 4,
    name: "Decidir con datos",
    area: "Indicadores y decisiones",
    description:
      "Su empresa tiene procesos estables y herramientas. El siguiente salto es decidir con información confiable y a tiempo.",
    nextStep: "tablero de indicadores y analítica de datos para decidir a tiempo.",
  },
];

export interface Question {
  stage: Stage["number"];
  text: string;
  /** Opciones de peor (0 puntos) a mejor (3 puntos). */
  options: [string, string, string, string];
  /** Riesgo que se reporta cuando la respuesta es débil (0 o 1 punto). */
  risk: string;
}

export const QUESTIONS: Question[] = [
  {
    stage: 1,
    text: "¿Sus procesos clave (ventas, compras, producción o servicio) están documentados?",
    options: ["No, están en la cabeza de las personas", "Algunos, de manera informal", "La mayoría, pero desactualizados", "Sí, documentados y actualizados"],
    risk: "Procesos clave sin documentar: el conocimiento depende de pocas personas.",
  },
  {
    stage: 1,
    text: "Si una persona clave falta una semana, ¿qué pasa con la operación?",
    options: ["Se detiene o se retrasa mucho", "Sigue, pero con errores y llamadas constantes", "Sigue con algunos ajustes", "Sigue con normalidad"],
    risk: "La operación depende de 2 o 3 personas: una ausencia la frena.",
  },
  {
    stage: 1,
    text: "¿Cada persona tiene claras sus funciones y responsabilidades?",
    options: ["No, todos hacen de todo", "Más o menos, se acuerdan de palabra", "Sí, aunque no está por escrito", "Sí, con cargos y responsabilidades definidos"],
    risk: "Funciones poco claras: tareas duplicadas o que nadie asume.",
  },
  {
    stage: 2,
    text: "¿Cómo manejan los errores, quejas o reclamos de los clientes?",
    options: ["Se resuelven cuando aparecen, sin registro", "Se registran a veces", "Se registran y se corrigen", "Se registran, se analiza la causa y se evita que se repitan"],
    risk: "Los errores se corrigen pero no se analizan: tienden a repetirse.",
  },
  {
    stage: 2,
    text: "¿Tienen implementado un sistema de gestión (por ejemplo, ISO 9001)?",
    options: ["No, y no lo hemos considerado", "Lo estamos considerando", "Está en implementación", "Sí, implementado o certificado"],
    risk: "Sin sistema de gestión: la calidad depende del esfuerzo del día a día.",
  },
  {
    stage: 2,
    text: "¿Revisan y mejoran sus procesos de forma periódica?",
    options: ["Nunca", "Solo cuando hay un problema grave", "Una vez al año", "Sí, con revisiones y planes de mejora periódicos"],
    risk: "Los procesos no se revisan: la mejora solo ocurre ante las crisis.",
  },
  {
    stage: 3,
    text: "¿Dónde está la información de su operación (clientes, pedidos, inventario)?",
    options: ["En papel, WhatsApp y correos", "En hojas de Excel separadas", "En un sistema, con Excel de apoyo", "En un sistema o ERP integrado"],
    risk: "Información repartida entre Excel, correo y WhatsApp.",
  },
  {
    stage: 3,
    text: "¿Cuántas tareas repetitivas se hacen a mano (digitar, copiar datos, armar informes)?",
    options: ["Casi todas", "Muchas", "Algunas", "Muy pocas: están automatizadas"],
    risk: "Exceso de tareas manuales: tiempo perdido y errores de digitación.",
  },
  {
    stage: 3,
    text: "¿Sus sistemas (facturación, inventario, ventas, web) se comunican entre sí?",
    options: ["No tenemos sistemas", "No, hay que pasar los datos a mano", "Algunos están conectados", "Sí, están integrados"],
    risk: "Sistemas desconectados: los mismos datos se digitan varias veces.",
  },
  {
    stage: 4,
    text: "¿Tienen indicadores definidos (ventas, cumplimiento, rentabilidad, satisfacción)?",
    options: ["No", "Algunos, pero no se miden con regularidad", "Sí, se miden cada mes", "Sí, se miden y se revisan contra metas"],
    risk: "Sin indicadores para decidir a tiempo.",
  },
  {
    stage: 4,
    text: "¿Cuánto tarda en saber cómo va el mes (ventas, gastos, utilidad)?",
    options: ["No lo sé hasta el cierre contable", "Varios días armando reportes", "Un día o menos", "Lo veo en tiempo real en un tablero"],
    risk: "La información llega tarde: las decisiones se toman a ciegas.",
  },
  {
    stage: 4,
    text: "¿Cómo se toman las decisiones importantes?",
    options: ["Por intuición", "Con experiencia y algunos datos sueltos", "Con reportes periódicos", "Con datos, tableros y análisis"],
    risk: "Las decisiones se basan en la intuición más que en los datos.",
  },
];

const MAX_POINTS = 3;
/** Un área se considera resuelta con al menos 2 de 3 puntos de promedio y ninguna respuesta en 0 (brecha crítica). */
const MASTERY = 2 / MAX_POINTS;

export interface AreaScore {
  stage: Stage;
  percent: number;
  mastered: boolean;
}

export interface DiagnosisResult {
  stage: Stage;
  /** true cuando las cuatro áreas están resueltas: la empresa está lista para escalar. */
  allMastered: boolean;
  areas: AreaScore[];
  risks: string[];
}

export const computeResult = (answers: number[]): DiagnosisResult => {
  const areas: AreaScore[] = STAGES.map((stage) => {
    const scores = QUESTIONS.flatMap((q, i) => (q.stage === stage.number ? [answers[i]] : []));
    const ratio = scores.reduce((sum, s) => sum + s, 0) / (scores.length * MAX_POINTS);
    return { stage, percent: Math.round(ratio * 100), mastered: ratio >= MASTERY && !scores.includes(0) };
  });

  const firstGap = areas.find((a) => !a.mastered);

  // Los 3 riesgos más graves: menor puntaje primero; a igual puntaje, la etapa más temprana.
  const risks = QUESTIONS.map((q, i) => ({ q, score: answers[i], i }))
    .filter(({ score }) => score <= 1)
    .sort((a, b) => a.score - b.score || a.i - b.i)
    .slice(0, 3)
    .map(({ q }) => q.risk);

  return {
    stage: firstGap ? firstGap.stage : STAGES[STAGES.length - 1],
    allMastered: !firstGap,
    areas,
    risks,
  };
};
