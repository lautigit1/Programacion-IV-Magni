import { Participante } from '../models/Participante';

interface ParticipanteCardProps {
  participante: Participante;
  onEliminar: (id: string) => void;
}

export const ParticipanteCard = ({ participante, onEliminar }: ParticipanteCardProps) => {
  return (
    <div className="bg-white border text-left border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEliminar(participante.id)}
          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-1.5 rounded-md transition-colors"
          title="Eliminar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="pr-8">
        <h3 className="font-bold text-gray-900 text-lg">{participante.nombre} {participante.apellido}</h3>
        <p className="text-gray-500 text-sm mb-4">{participante.email}</p>
        
        <div className="flex gap-2 text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded-full ${
            participante.nivel === 'Básico' ? 'bg-green-100 text-green-700' :
            participante.nivel === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {participante.nivel}
          </span>
          <span className={`px-2.5 py-1 rounded-full ${
            participante.modalidad === 'Presencial' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
          }`}>
            {participante.modalidad}
          </span>
        </div>
      </div>
    </div>
  );
};
