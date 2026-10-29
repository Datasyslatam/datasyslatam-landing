import armandoImg from "@/assets/authors/armando-lopez.webp";
import fabianImg from "@/assets/authors/fabian-florian.webp";
import agustinImg from "@/assets/authors/agustin-robledo.webp";
import type { BlogArea } from "./types";

/** Categorías del blog: coinciden con el campo "area" de scripts/blog-agent/topics.json. */
export const AREAS: Record<BlogArea, { label: string; slug: string }> = {
  gestion: { label: "Sistemas de gestión ISO", slug: "gestion" },
  tecnologia: { label: "Tecnología", slug: "tecnologia" },
  analitica: { label: "Analítica de datos", slug: "analitica" },
};

export interface Author {
  name: string;
  /** Nombre corto para tarjetas. */
  short: string;
  role: string;
  photo: string;
}

// Cada área tiene un responsable (ver AUTHORS en scripts/blog-agent/generate.mjs).
const AUTHORS: Author[] = [
  { name: "Armando José López González", short: "Armando López", role: "Fundador · Sistemas de gestión ISO", photo: armandoImg },
  { name: "Fabián Florián", short: "Fabián Florián", role: "Tecnología", photo: fabianImg },
  { name: "Agustín Robledo", short: "Agustín Robledo", role: "Analítica de datos", photo: agustinImg },
];

export const findAuthor = (name: string): Author =>
  AUTHORS.find((a) => a.name === name) ?? { name, short: name, role: "DataSys Latam Group", photo: "" };
