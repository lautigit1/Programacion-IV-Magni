interface FiltrosProps {
  filtroNombre: string;
  setFiltroNombre: (v: string) => void;
  filtroNivel: string;
  setFiltroNivel: (v: string) => void;
  filtroModalidad: string;
  setFiltroModalidad: (v: string) => void;
}

export const Filtros = ({
  filtroNombre,
  setFiltroNombre,
  filtroNivel,
  setFiltroNivel,
  filtroModalidad,
  setFiltroModalidad
}: FiltrosProps) => {
  const handleLimpiar = () => {
    setFiltroNombre('');
    setFiltroNivel('');
    setFiltroModalidad('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre o Apellido</label>
        <input
          type="text"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Buscar..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Todos</option>
          <option value="Basico">Basico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
        <select
          value={filtroModalidad}
          onChange={(e) => setFiltroModalidad(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Todas</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Hibrido">Hibrido</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleLimpiar}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm border border-gray-300 h-9.5"
      >
        Limpiar Filtros
      </button>
    </div>
  );
};
