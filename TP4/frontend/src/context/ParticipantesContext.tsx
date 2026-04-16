import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react';
import type { Participante } from '../models/Participante';
import {
  crearParticipante,
  eliminarParticipante,
  obtenerParticipantes
} from '../services/participantesService';

interface ContextType {
  participantes: Participante[];
  agregar: (p: Participante) => void;
  eliminar: (id: string | number) => void;
  resetear: () => void;
}

const ParticipantesContext = createContext<ContextType | undefined>(undefined);

export const ParticipantesProvider = ({ children }: PropsWithChildren) => {
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  const cargarParticipantes = useCallback(async () => {
    try {
      const data = await obtenerParticipantes();
      setParticipantes(data);
    } catch (error) {
      console.error('Error al obtener participantes:', error);
    }
  }, []);

  useEffect(() => {
    void cargarParticipantes();
  }, [cargarParticipantes]);

  const agregar = useCallback((p: Participante) => {
    void (async () => {
      try {
        const { id: _omitId, ...payload } = p;
        const creado = await crearParticipante(payload);
        setParticipantes((prev) => [creado, ...prev]);
      } catch (error) {
        console.error('Error al crear participante:', error);
      }
    })();
  }, []);

  const eliminar = useCallback((id: string | number) => {
    void (async () => {
      const parsedId = Number(id);
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return;
      }

      try {
        await eliminarParticipante(parsedId);
        setParticipantes((prev) => prev.filter((p) => p.id !== parsedId));
      } catch (error) {
        console.error('Error al eliminar participante:', error);
      }
    })();
  }, []);

  const resetear = useCallback(() => {
    void (async () => {
      try {
        const ids = participantes
          .map((p) => p.id)
          .filter((id): id is number => Number.isInteger(id));

        await Promise.all(ids.map((id) => eliminarParticipante(id)));
        setParticipantes([]);
      } catch (error) {
        console.error('Error al resetear participantes:', error);
      }
    })();
  }, [participantes]);

  const value = useMemo(
    () => ({ participantes, agregar, eliminar, resetear }),
    [participantes, agregar, eliminar, resetear]
  );

  return (
    <ParticipantesContext.Provider value={value}>
      {children}
    </ParticipantesContext.Provider>
  );
};

export const useParticipantes = (): ContextType => {
  const context = useContext(ParticipantesContext);

  if (!context) {
    throw new Error('useParticipantes debe usarse dentro de ParticipantesProvider');
  }

  return context;
};
