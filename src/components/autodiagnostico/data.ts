// Autodiagnóstico ISO 9001:2015: lista de chequeo de 41 requisitos (capítulos 4 a 10) con respuesta única por requisito.
// Cumplimiento = (Completo × 1 + Parcial × 0,5) / requisitos que aplican; «No aplica» no cuenta en el cálculo.
// Es una herramienta orientativa de la etapa PLANEAR del ciclo PHVA: no reemplaza una auditoría.

export { AUTODIAGNOSTICO_HASH } from "./hash";

export type Answer = "completo" | "parcial" | "ninguno" | "na";

export const ANSWERS: { value: Answer; label: string; hint: string }[] = [
  { value: "completo", label: "Completo", hint: "Se cumple y hay evidencia." },
  { value: "parcial", label: "Parcial", hint: "Se cumple en parte o sin evidencia suficiente." },
  { value: "ninguno", label: "Ninguno", hint: "No se cumple." },
  { value: "na", label: "No aplica", hint: "No aplica a su empresa; no cuenta en el cálculo." },
];

export const answerLabel = (a: Answer) => ANSWERS.find((x) => x.value === a)!.label;

const POINTS: Record<Exclude<Answer, "na">, number> = { completo: 1, parcial: 0.5, ninguno: 0 };

export interface Requirement {
  /** Numeral de la norma, p. ej. «4.1» u «8.2.2–8.2.4». */
  clause: string;
  text: string;
  /** Acción recomendada cuando la respuesta es Parcial o Ninguno. */
  action: string;
}

export interface Chapter {
  number: number;
  name: string;
  short: string;
  requirements: Requirement[];
}

export const CHAPTERS: Chapter[] = [
  {
    number: 4,
    name: "Contexto de la organización",
    short: "Contexto",
    requirements: [
      {
        clause: "4.1",
        text: "Se han determinado las cuestiones externas e internas (p. ej. DOFA/PESTEL, incluido el cambio climático) y se les hace seguimiento y revisión.",
        action: "Elaborar y actualizar el análisis de contexto (DOFA/PESTEL), incluyendo cambio climático, y definir su frecuencia de revisión.",
      },
      {
        clause: "4.2",
        text: "Se han identificado las partes interesadas pertinentes y sus requisitos, y se les hace seguimiento.",
        action: "Elaborar la matriz de partes interesadas con sus necesidades, expectativas y seguimiento.",
      },
      {
        clause: "4.3",
        text: "El alcance del SGC está definido y documentado, con la justificación de los requisitos que no aplican.",
        action: "Definir y documentar el alcance del SGC (productos, servicios y sedes) y justificar los requisitos que no aplican.",
      },
      {
        clause: "4.4",
        text: "Los procesos del SGC están identificados en un mapa de procesos con su secuencia e interacción.",
        action: "Diseñar el mapa de procesos (estratégicos, misionales, de apoyo y evaluación) y su interacción.",
      },
      {
        clause: "4.4.2",
        text: "Cada proceso tiene su caracterización: entradas, salidas, responsables, recursos, criterios de control e indicadores.",
        action: "Elaborar la caracterización de cada proceso con entradas, salidas, responsables, recursos, controles e indicadores.",
      },
    ],
  },
  {
    number: 5,
    name: "Liderazgo",
    short: "Liderazgo",
    requirements: [
      {
        clause: "5.1.1",
        text: "La alta dirección demuestra liderazgo y compromiso con el SGC: asume su eficacia, asigna recursos y promueve el enfoque a procesos y el pensamiento basado en riesgos.",
        action: "Formalizar el compromiso de la dirección con responsables, recursos asignados y seguimiento periódico al SGC.",
      },
      {
        clause: "5.1.2",
        text: "Se determinan y cumplen los requisitos del cliente, legales y reglamentarios, y se mantiene el enfoque en aumentar la satisfacción.",
        action: "Establecer mecanismos para identificar requisitos del cliente y legales, y su verificación de cumplimiento.",
      },
      {
        clause: "5.2.1",
        text: "Existe una política de calidad apropiada al propósito y contexto de la organización, con el compromiso de cumplir requisitos y de mejora continua.",
        action: "Establecer la política de calidad con los compromisos que exige la norma.",
      },
      {
        clause: "5.2.2",
        text: "La política está documentada, comunicada, entendida y disponible para las partes interesadas.",
        action: "Diseñar una estrategia de socialización de la política y verificar su comprensión.",
      },
      {
        clause: "5.3",
        text: "Los roles, responsabilidades y autoridades del SGC están asignados, comunicados y entendidos.",
        action: "Elaborar la matriz de roles y responsabilidades del SGC y comunicarla.",
      },
    ],
  },
  {
    number: 6,
    name: "Planificación",
    short: "Planificación",
    requirements: [
      {
        clause: "6.1.1",
        text: "Se han identificado y valorado los riesgos y oportunidades de cada proceso.",
        action: "Construir la matriz de riesgos y oportunidades por proceso con metodología de valoración.",
      },
      {
        clause: "6.1.2",
        text: "Se planifican acciones para abordar riesgos y oportunidades, integradas a los procesos, y se evalúa su eficacia.",
        action: "Definir planes de tratamiento de riesgos con responsables, fechas y evaluación de eficacia.",
      },
      {
        clause: "6.2.1",
        text: "Los objetivos de calidad son medibles, coherentes con la política, comunicados y con seguimiento.",
        action: "Definir objetivos SMART alineados a la política y su tablero de seguimiento.",
      },
      {
        clause: "6.2.2",
        text: "Existe un plan para lograr los objetivos: qué se hará, recursos, responsable, plazo y cómo se evaluarán los resultados.",
        action: "Elaborar la matriz de planificación de objetivos (qué, recursos, quién, cuándo, cómo se evalúa).",
      },
      {
        clause: "6.3",
        text: "Los cambios en el SGC se planifican considerando su propósito, consecuencias, recursos y responsabilidades.",
        action: "Establecer un procedimiento de gestión del cambio con su registro.",
      },
    ],
  },
  {
    number: 7,
    name: "Apoyo",
    short: "Apoyo",
    requirements: [
      {
        clause: "7.1.1–7.1.4",
        text: "Se determinan y proporcionan las personas, la infraestructura y el ambiente necesarios para operar los procesos.",
        action: "Identificar necesidades de recursos y establecer planes de mantenimiento de infraestructura.",
      },
      {
        clause: "7.1.5",
        text: "Los equipos de seguimiento y medición están identificados, calibrados o verificados y con trazabilidad.",
        action: "Levantar el inventario de equipos de medición y programar calibraciones/verificaciones.",
      },
      {
        clause: "7.1.6",
        text: "Se determinan, mantienen y ponen a disposición los conocimientos de la organización.",
        action: "Implementar una estrategia de gestión del conocimiento (lecciones aprendidas, repositorio, mentorías).",
      },
      {
        clause: "7.2",
        text: "Se definen las competencias requeridas por cargo, se forma al personal y se evalúa la eficacia de la formación.",
        action: "Actualizar perfiles de cargo, plan de capacitación y evaluación de eficacia de la formación.",
      },
      {
        clause: "7.3",
        text: "El personal es consciente de la política, los objetivos, su contribución y las implicaciones de incumplir.",
        action: "Desarrollar un programa de toma de conciencia y verificar su apropiación.",
      },
      {
        clause: "7.4",
        text: "La comunicación interna y externa está planificada: qué, cuándo, a quién, cómo y quién comunica.",
        action: "Elaborar la matriz de comunicaciones internas y externas.",
      },
      {
        clause: "7.5",
        text: "La información documentada está controlada: creación, actualización, versiones, acceso, conservación y disposición.",
        action: "Implementar el procedimiento y listado maestro de control de información documentada (idealmente digital).",
      },
    ],
  },
  {
    number: 8,
    name: "Operación",
    short: "Operación",
    requirements: [
      {
        clause: "8.1",
        text: "La operación se planifica y controla con criterios definidos, incluido el control de procesos contratados externamente.",
        action: "Documentar la planificación operacional con criterios de aceptación y controles.",
      },
      {
        clause: "8.2.1",
        text: "Existe comunicación con el cliente sobre productos, consultas, contratos, quejas y propiedad del cliente.",
        action: "Definir canales de comunicación con el cliente y un sistema de PQRS.",
      },
      {
        clause: "8.2.2–8.2.4",
        text: "Los requisitos de productos y servicios se determinan y revisan antes de comprometerse con el cliente.",
        action: "Implementar la revisión de requisitos previa a cotizaciones, contratos o pedidos.",
      },
      {
        clause: "8.3",
        text: "El diseño y desarrollo se planifica y controla: entradas, revisiones, verificación, validación, salidas y cambios.",
        action: "Establecer el procedimiento de diseño y desarrollo por etapas, o justificar su exclusión.",
      },
      {
        clause: "8.4",
        text: "Se aplican criterios para seleccionar, evaluar, hacer seguimiento y reevaluar a los proveedores externos.",
        action: "Implementar el procedimiento de selección, evaluación y reevaluación de proveedores.",
      },
      {
        clause: "8.4.3",
        text: "Se comunican a los proveedores los requisitos de lo que se compra, competencia, controles y verificaciones.",
        action: "Estandarizar órdenes de compra/contratos con los requisitos comunicados al proveedor.",
      },
      {
        clause: "8.5.1",
        text: "La producción o prestación del servicio se realiza en condiciones controladas (instrucciones, recursos, personal competente, validación).",
        action: "Documentar instructivos y puntos de control de la prestación del servicio o producción.",
      },
      {
        clause: "8.5.2–8.5.4",
        text: "Se asegura la identificación, trazabilidad, cuidado de la propiedad del cliente y preservación de las salidas.",
        action: "Definir mecanismos de identificación, trazabilidad y preservación, y registro de propiedad del cliente.",
      },
      {
        clause: "8.5.5–8.5.6",
        text: "Se gestionan las actividades posteriores a la entrega y se controlan los cambios en la producción o el servicio.",
        action: "Establecer el protocolo de posventa y el control de cambios operativos.",
      },
      {
        clause: "8.6",
        text: "Se verifica el cumplimiento de requisitos antes de liberar productos y servicios, con evidencia y trazabilidad de quien autoriza.",
        action: "Diseñar listas de chequeo de liberación con criterios de aceptación.",
      },
      {
        clause: "8.7",
        text: "Las salidas no conformes se identifican, controlan, documentan y se decide su tratamiento.",
        action: "Implementar el procedimiento de producto/servicio no conforme y su registro.",
      },
    ],
  },
  {
    number: 9,
    name: "Evaluación del desempeño",
    short: "Evaluación",
    requirements: [
      {
        clause: "9.1.1",
        text: "Están definidos qué se mide, los métodos, la frecuencia y los indicadores de desempeño de los procesos.",
        action: "Construir el tablero de indicadores por proceso (ficha técnica, meta, frecuencia, responsable).",
      },
      {
        clause: "9.1.2",
        text: "Se mide y analiza la percepción de satisfacción del cliente.",
        action: "Aplicar la encuesta de satisfacción y analizar sus resultados con planes de acción.",
      },
      {
        clause: "9.1.3",
        text: "Se analizan y evalúan los datos para tomar decisiones (conformidad, eficacia, riesgos, proveedores, mejoras).",
        action: "Establecer informes periódicos de análisis de datos para la toma de decisiones.",
      },
      {
        clause: "9.2",
        text: "Se realizan auditorías internas planificadas, con auditores competentes e imparciales, y se toman acciones sobre sus hallazgos.",
        action: "Establecer el programa de auditorías internas con auditores competentes e imparciales y el seguimiento de hallazgos.",
      },
      {
        clause: "9.3",
        text: "La alta dirección revisa el SGC a intervalos planificados con las entradas y salidas exigidas por la norma.",
        action: "Programar la revisión por la dirección con un informe que cubra todas las entradas requeridas.",
      },
    ],
  },
  {
    number: 10,
    name: "Mejora",
    short: "Mejora",
    requirements: [
      {
        clause: "10.1",
        text: "Se determinan y seleccionan oportunidades de mejora para cumplir requisitos y aumentar la satisfacción del cliente.",
        action: "Implementar un banco de oportunidades de mejora con priorización.",
      },
      {
        clause: "10.2",
        text: "Las no conformidades se corrigen, se analiza su causa raíz, se toman acciones correctivas y se verifica su eficacia.",
        action: "Implementar el procedimiento de acciones correctivas con análisis de causa raíz (5 porqués, Ishikawa).",
      },
      {
        clause: "10.3",
        text: "Existe evidencia de mejora continua de la conveniencia, adecuación y eficacia del SGC.",
        action: "Documentar los resultados de mejora y su seguimiento en la revisión por la dirección.",
      },
    ],
  },
];

/** Todos los requisitos en orden, con el capítulo al que pertenecen. */
export const REQUIREMENTS = CHAPTERS.flatMap((chapter) => chapter.requirements.map((req) => ({ ...req, chapter })));

export interface Level {
  name: string;
  /** Porcentaje mínimo (incluido) para estar en el nivel. */
  min: number;
  max: number;
  description: string;
}

export const LEVELS: Level[] = [
  {
    name: "Inicial",
    min: 0,
    max: 25,
    description:
      "El sistema de gestión está en sus primeros pasos: la mayoría de los requisitos no se cumplen o dependen de prácticas informales. Conviene empezar por el contexto, el mapa de procesos y un plan de implementación.",
  },
  {
    name: "En desarrollo",
    min: 26,
    max: 50,
    description:
      "Hay elementos del sistema definidos, pero con vacíos importantes en documentación, seguimiento y evidencia. Es momento de estructurar un plan de implementación por fases.",
  },
  {
    name: "Implementado",
    min: 51,
    max: 75,
    description:
      "El sistema funciona en la mayoría de los procesos, pero quedan brechas de evidencia, seguimiento o mejora. Es momento de cerrarlas y prepararse para una auditoría interna.",
  },
  {
    name: "Consolidado",
    min: 76,
    max: 90,
    description:
      "El sistema está implementado y genera evidencia de forma consistente. El siguiente paso es afinar indicadores, auditorías y mejora para una certificación o renovación sin contratiempos.",
  },
  {
    name: "Optimizado",
    min: 91,
    max: 100,
    description:
      "El sistema cumple los requisitos de la norma y se mejora de forma continua. El reto es sostenerlo con eficiencia: evidencia digital, indicadores en tiempo real y decisiones con datos.",
  },
];

export interface ChapterScore {
  chapter: Chapter;
  /** null cuando ningún requisito del capítulo aplica. */
  percent: number | null;
}

export interface ActionItem {
  clause: string;
  text: string;
  answer: "ninguno" | "parcial";
  action: string;
  priority: "Alta" | "Media";
}

export interface DiagnosisResult {
  percent: number;
  /** Requisitos que no se marcaron «No aplica»; con 0 no hay cumplimiento que calcular. */
  applicable: number;
  level: Level;
  counts: Record<Answer, number>;
  chapters: ChapterScore[];
  /** Los dos capítulos con mayor y con menor cumplimiento (solo capítulos que aplican). */
  strongest: ChapterScore[];
  weakest: ChapterScore[];
  /** Requisitos en Ninguno (prioridad alta) y luego en Parcial (prioridad media), en el orden de la norma. */
  plan: ActionItem[];
}

const ratio = (answers: Answer[]) => {
  const scored = answers.filter((a): a is Exclude<Answer, "na"> => a !== "na");
  return scored.length ? scored.reduce((sum, a) => sum + POINTS[a], 0) / scored.length : null;
};

export const levelFor = (percent: number) => LEVELS.find((l) => percent <= l.max) ?? LEVELS[LEVELS.length - 1];

/** `answers` sigue el orden de REQUIREMENTS. */
export const computeResult = (answers: Answer[]): DiagnosisResult => {
  const percent = Math.round((ratio(answers) ?? 0) * 100);

  const counts: Record<Answer, number> = { completo: 0, parcial: 0, ninguno: 0, na: 0 };
  answers.forEach((a) => counts[a]++);

  const chapters = CHAPTERS.map((chapter) => {
    const own = REQUIREMENTS.flatMap((req, i) => (req.chapter === chapter ? [answers[i]] : []));
    const r = ratio(own);
    return { chapter, percent: r === null ? null : Math.round(r * 100) };
  });
  const ranked = chapters.filter((c) => c.percent !== null).sort((a, b) => b.percent! - a.percent! || a.chapter.number - b.chapter.number);
  const weakest = [...ranked].sort((a, b) => a.percent! - b.percent! || a.chapter.number - b.chapter.number);

  const plan = (["ninguno", "parcial"] as const).flatMap((answer) =>
    REQUIREMENTS.flatMap((req, i) =>
      answers[i] === answer
        ? [{ clause: req.clause, text: req.text, answer, action: req.action, priority: answer === "ninguno" ? ("Alta" as const) : ("Media" as const) }]
        : [],
    ),
  );

  return {
    percent,
    applicable: answers.length - counts.na,
    level: levelFor(percent),
    counts,
    chapters,
    strongest: ranked.slice(0, 2),
    weakest: weakest.slice(0, 2),
    plan,
  };
};
