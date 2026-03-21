/**
 * Modality options for event attendance.
 */
export type Modality = "Presencial" | "Virtual" | "Híbrido";

/**
 * Experience level of the participant.
 */
export type Level = "Principiante" | "Intermedio" | "Avanzado";

/**
 * Core data model for a registered event participant.
 */
export interface Participant {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: Modality;
  tecnologias: string[];
  nivel: Level;
  aceptaTerminos: boolean;
}

/**
 * Shape of active filter state used in the Filters component.
 */
export interface FilterState {
  searchName: string;
  modalidad: Modality | "";
  nivel: Level | "";
}
