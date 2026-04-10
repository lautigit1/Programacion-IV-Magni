export type Nivel = 'Básico' | 'Intermedio' | 'Avanzado';
export type Modalidad = 'Presencial' | 'Virtual';

export class Participante {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  nivel: Nivel;
  modalidad: Modalidad;

  constructor(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    nivel: Nivel,
    modalidad: Modalidad
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.nivel = nivel;
    this.modalidad = modalidad;
  }
}
