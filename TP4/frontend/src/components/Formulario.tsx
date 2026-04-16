import { useState } from 'react';
import type { Modalidad, Nivel, Participante } from '../models/Participante';

interface FormularioProps {
  onAgregar: (p: Participante) => void;
}

export const Formulario = ({ onAgregar }: FormularioProps) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState<Nivel | ''>('');
  const [modalidad, setModalidad] = useState<Modalidad | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !apellido.trim() || !email.trim() || !nivel || !modalidad) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setError('');

    onAgregar({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      nivel,
      modalidad
    });

    setNombre('');
    setApellido('');
    setEmail('');
    setNivel('');
    setModalidad('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
          placeholder="Ej: Juan"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
          placeholder="Ej: Perez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
          placeholder="ejemplo@utn.edu.ar"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value as Nivel)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm bg-white"
        >
          <option value="" disabled>
            Seleccionar nivel
          </option>
          <option value="Basico">Basico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
        <select
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value as Modalidad)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm bg-white"
        >
          <option value="" disabled>
            Seleccionar modalidad
          </option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Hibrido">Hibrido</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors shadow-sm mt-4"
      >
        Agregar Participante
      </button>
    </form>
  );
};
