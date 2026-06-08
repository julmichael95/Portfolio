import type { Project } from "./_types";
import alune from "./alune";
import tovi from "./tovi";
import anse from "./anse";
import sudoku from "./sudoku";
import chess from "./chess";

// Ordered: featured first (by order), then experiments (by order)
export const allProjects: Project[] = [
  alune,
  tovi,
  anse,
  sudoku,
  chess,
];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

/** Returns [prev, next] projects relative to the given slug (wraps around). */
export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const idx = allProjects.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;
  return { prev: prev ?? null, next: next ?? null };
}
