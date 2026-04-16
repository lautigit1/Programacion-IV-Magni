import { useMemo, useState } from 'react';
import { Filtros } from './components/Filtros';
import { Formulario } from './components/Formulario';
import { ParticipanteCard } from './components/ParticipanteCard';
import { useParticipantes } from './context/ParticipantesContext';

export default function App() {
  const { participantes, agregar, eliminar, resetear } = useParticipantes();

  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState('');

  const participantesFiltrados = useMemo(() => {
    const termino = filtroNombre.toLowerCase().trim();

    return participantes.filter((p) => {
      const cumpleNombre =
        p.nombre.toLowerCase().includes(termino) || p.apellido.toLowerCase().includes(termino);
      const cumpleNivel = filtroNivel ? p.nivel === filtroNivel : true;
      const cumpleModalidad = filtroModalidad ? p.modalidad === filtroModalidad : true;

      return cumpleNombre && cumpleNivel && cumpleModalidad;
    });
  }, [participantes, filtroNombre, filtroNivel, filtroModalidad]);

  const handleResetear = () => {
    if (
      window.confirm(
        'Estas seguro de que deseas eliminar todos los participantes? Esta accion no se puede deshacer.'
      )
    ) {
      resetear();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      <div className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-8 md:flex md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestion de Participantes</h1>
            <p className="text-blue-200 mt-2 font-medium">UTN Mendoza - Programacion IV - TP4</p>
          </div>
          <button
            type="button"
            onClick={handleResetear}
            className="mt-6 md:mt-0 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            Resetear Datos
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Nuevo Participante</h2>
              <Formulario onAgregar={agregar} />
            </div>
          </section>

          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filtrar Participantes</h2>
              <Filtros
                filtroNombre={filtroNombre}
                setFiltroNombre={setFiltroNombre}
                filtroNivel={filtroNivel}
                setFiltroNivel={setFiltroNivel}
                filtroModalidad={filtroModalidad}
                setFiltroModalidad={setFiltroModalidad}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Lista de Participantes</h2>
                <div className="bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
                  {participantesFiltrados.length} visualizando
                </div>
              </div>

              {participantesFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-gray-50 border-2 border-dashed border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sin resultados</h3>
                  <p className="text-gray-500">
                    No hay participantes que coincidan con la busqueda actual.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participantesFiltrados.map((p) =>
                    p.id ? (
                      <ParticipanteCard key={p.id} participante={p} onEliminar={eliminar} />
                    ) : null
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
