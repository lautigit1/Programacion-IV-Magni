export type Nivel = 'Basico' | 'Intermedio' | 'Avanzado';
export type Modalidad = 'Presencial' | 'Virtual' | 'Hibrido';

export interface Participante {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  nivel: Nivel;
  modalidad: Modalidad;
}

export type CrearParticipantePayload = Omit<Participante, 'id'>;
