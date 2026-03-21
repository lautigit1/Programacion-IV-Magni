import React from "react";
import type { Participant } from "../types/Participant";
import ParticipantCard from "./ParticipantCard";

interface Props {
  participants: Participant[];
  onDelete: (id: number) => void;
}

/**
 * Displays participants in a responsive grid.
 * Shows an empty state when the list is empty.
 */
const ParticipantList: React.FC<Props> = ({ participants, onDelete }) => {
  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-slate-700">Sin resultados</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-xs">
          No hay participantes que coincidan con los filtros activos, o aún no se han registrado
          participantes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {participants.map((p) => (
        <ParticipantCard key={p.id} participant={p} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ParticipantList;
