import type { FilterState, Level, Modality, Participant } from "../types/Participant";

// ─── Validation Helpers ──────────────────────────────────────────────────────

/**
 * Validates an email string using a standard RFC-compliant regex.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Returns trimmed value; used to clean user inputs before validation.
 */
export function trim(value: string): string {
  return value.trim();
}

// ─── Filter Logic ─────────────────────────────────────────────────────────────

/**
 * Applies all active filters to a list of participants.
 * All conditions are combined with AND logic.
 *
 * @param participants - Full list of participants.
 * @param filters - Active filter state.
 * @returns Filtered array of participants.
 */
export function applyFilters(participants: Participant[], filters: FilterState): Participant[] {
  return participants.filter((p) => {
    const matchesName = filters.searchName
      ? p.nombre.toLowerCase().includes(filters.searchName.toLowerCase())
      : true;

    const matchesModalidad = filters.modalidad
      ? p.modalidad === filters.modalidad
      : true;

    const matchesNivel = filters.nivel
      ? p.nivel === filters.nivel
      : true;

    return matchesName && matchesModalidad && matchesNivel;
  });
}

// ─── Styling Helpers ──────────────────────────────────────────────────────────

/**
 * Returns the Tailwind badge color classes based on the participant's level.
 */
export function getLevelBadgeClasses(nivel: Level): string {
  switch (nivel) {
    case "Principiante":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Intermedio":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Avanzado":
      return "bg-rose-100 text-rose-800 border border-rose-200";
  }
}

/**
 * Returns the Tailwind classes for the level indicator dot/stripe.
 */
export function getLevelAccentClass(nivel: Level): string {
  switch (nivel) {
    case "Principiante":
      return "bg-emerald-500";
    case "Intermedio":
      return "bg-amber-500";
    case "Avanzado":
      return "bg-rose-500";
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const MODALITY_OPTIONS: Modality[] = ["Presencial", "Virtual", "Híbrido"];
export const LEVEL_OPTIONS: Level[] = ["Principiante", "Intermedio", "Avanzado"];

/** Common tech stack options shown as quick-select toggles in the form. */
export const TECH_OPTIONS: string[] = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Rust",
  "Docker",
  "Kubernetes",
  "AWS",
  "SQL",
  "MongoDB",
];

/** Generates a unique numeric ID based on current timestamp + random suffix. */
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
