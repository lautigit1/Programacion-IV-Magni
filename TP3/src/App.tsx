import { useState, useEffect } from 'react';
import { Participante } from './models/Participante';
import { Formulario } from './components/Formulario';
import { Filtros } from './components/Filtros';
import { ParticipanteCard } from './components/ParticipanteCard';

export default function App() {
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const datosGuardados = localStorage.getItem('participantes');
    if (datosGuardados) {
      try {
        const parsed = JSON.parse(datosGuardados);
        // Crucial: Los datos recuperados deben ser re-instanciados como objetos de la clase Participante
        return parsed.map((p: Participante) => new Participante(
          p.id, p.nombre, p.apellido, p.email, p.nivel, p.modalidad
        ));
      } catch (error) {
        console.error('Error al recuperar participantes del LocalStorage:', error);
      }
    }
    return [];
  });
  
  // Estados de Filtros
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState('');

  // Guardado Automático
  useEffect(() => {
    localStorage.setItem('participantes', JSON.stringify(participantes));
  }, [participantes]);

  // Funciones Globales
  const agregarParticipante = (participante: Participante) => {
    setParticipantes(prev => [...prev, participante]);
  };

  const eliminarParticipante = (id: string) => {
    setParticipantes(prev => prev.filter(p => p.id !== id));
  };

  const resetearApp = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.')) {
      setParticipantes([]);
      localStorage.removeItem('participantes');
    }
  };

  // Estado Derivado: Lista filtrada calculada al vuelo
  const participantesFiltrados = participantes.filter(p => {
    const termino = filtroNombre.toLowerCase().trim();
    const cumpleNombre = p.nombre.toLowerCase().includes(termino) || 
                         p.apellido.toLowerCase().includes(termino);
    const cumpleNivel = filtroNivel ? p.nivel === filtroNivel : true;
    const cumpleModalidad = filtroModalidad ? p.modalidad === filtroModalidad : true;

    return cumpleNombre && cumpleNivel && cumpleModalidad;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      <div className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-8 md:flex md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Participantes</h1>
            <p className="text-blue-200 mt-2 font-medium">UTN Mendoza - Programación IV</p>
          </div>
          <button 
            onClick={resetearApp}
            className="mt-6 md:mt-0 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            Resetear Datos de la App
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Panel Izquierdo: Formulario */}
          <section className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                Nuevo Participante
              </h2>
              <Formulario onAgregar={agregarParticipante} />
            </div>
          </section>

          {/* Panel Derecho: Filtros y Lista */}
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Filtrar Participantes
              </h2>
              <Filtros 
                filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre}
                filtroNivel={filtroNivel} setFiltroNivel={setFiltroNivel}
                filtroModalidad={filtroModalidad} setFiltroModalidad={setFiltroModalidad}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Lista de Participantes
                </h2>
                <div className="bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
                  {participantesFiltrados.length} visualizando
                </div>
              </div>

              {participantesFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-gray-50 border-2 border-dashed border-gray-200">
                  <span className="text-5xl mb-4">🕵️</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sin resultados</h3>
                  <p className="text-gray-500">No hay participantes que coincidan con la búsqueda actual.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participantesFiltrados.map(p => (
                    <ParticipanteCard key={p.id} participante={p} onEliminar={eliminarParticipante} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
