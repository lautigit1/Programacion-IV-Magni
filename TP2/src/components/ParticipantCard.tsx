import React from "react";
import type { Participant } from "../types/Participant";
import { getLevelAccentClass, getLevelBadgeClasses } from "../utils/helpers";

interface Props {
  participant: Participant;
  onDelete: (id: number) => void;
}

/**
 * Renders a single participant as a styled card.
 * Displays name, country, modality, level badge, and technology chips.
 * Includes a delete button that propagates the action up to the parent.
 */
const ParticipantCard: React.FC<Props> = ({ participant, onDelete }) => {
  const { id, nombre, email, edad, pais, modalidad, tecnologias, nivel } = participant;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col animate-slide-up">
      {/* Level color accent stripe */}
      <div className={`h-1.5 w-full ${getLevelAccentClass(nivel)}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">{nombre}</h3>
            <p className="text-slate-400 text-xs mt-0.5">{email}</p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${getLevelBadgeClasses(nivel)}`}
          >
            {nivel}
          </span>
        </div>

        {/* Details */}
        <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="text-slate-400">🌎</span>
            <span>{pais}</span>
            <span className="text-slate-300 mx-1">·</span>
            <span className="text-slate-400">🎂</span>
            <span>{edad} años</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-400">📡</span>
            <span className="font-medium text-indigo-600">{modalidad}</span>
          </li>
        </ul>

        {/* Technology chips */}
        <div className="mt-4 flex flex-wrap gap-1.5 flex-1 content-start">
          {tecnologias.map((tech) => (
            <span
              key={tech}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Delete button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => onDelete(id)}
            aria-label={`Eliminar a ${nombre}`}
            className="w-full text-xs font-semibold text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 hover:border-rose-500 rounded-lg py-1.5 transition-all duration-150"
          >
            🗑 Eliminar participante
          </button>
        </div>
      </div>
    </article>
  );
};

export default ParticipantCard;
