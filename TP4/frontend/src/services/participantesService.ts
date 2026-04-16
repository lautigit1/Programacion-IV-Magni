import axios from 'axios';
import type { CrearParticipantePayload, Participante } from '../models/Participante';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api'
});

export const obtenerParticipantes = async (): Promise<Participante[]> => {
  const { data } = await api.get<Participante[]>('/participantes');
  return data;
};

export const crearParticipante = async (
  payload: CrearParticipantePayload
): Promise<Participante> => {
  const { data } = await api.post<Participante>('/participantes', payload);
  return data;
};

export const eliminarParticipante = async (id: number): Promise<void> => {
  await api.delete(`/participantes/${id}`);
};
