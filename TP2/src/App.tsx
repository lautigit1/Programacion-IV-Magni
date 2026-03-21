import React, { useMemo } from "react";
import type { Participant, FilterState } from "./types/Participant";
import useLocalStorage from "./hooks/useLocalStorage";
import ParticipantForm from "./components/ParticipantForm";
import ParticipantList from "./components/ParticipantList";
import Filters from "./components/Filters";
import { applyFilters } from "./utils/helpers";

const INITIAL_FILTERS: FilterState = {
  searchName: "",
  modalidad: "",
  nivel: "",
};

/**
 * Root application component.
 * Owns the participant list state (persisted in localStorage) and filter state.
 * Passes handlers down to child components.
 */
const App: React.FC = () => {
  const [participants, setParticipants] = useLocalStorage<Participant[]>(
    "tp2_participants",
    []
  );
  const [filters, setFilters] = React.useState<FilterState>(INITIAL_FILTERS);

  /** Add a new participant to the list. */
  const handleAddParticipant = (participant: Participant) => {
    setParticipants((prev) => [participant, ...prev]);
  };

  /** Remove a participant by ID. */
  const handleDeleteParticipant = (id: number) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  /** Memoized filtered list to avoid redundant computation on every render. */
  const filteredParticipants = useMemo(
    () => applyFilters(participants, filters),
    [participants, filters]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      {/* ── Top Navigation Bar ──────────────────── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              ⚡
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">TechEvent 2025</h1>
              <p className="text-xs text-slate-400 leading-none">Sistema de registro de participantes</p>
            </div>
          </div>

          {/* Participant counter */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm font-semibold text-indigo-700">
              {participants.length}{" "}
              <span className="font-normal text-indigo-500">
                {participants.length === 1 ? "participante registrado" : "participantes registrados"}
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Hero */}
        <section className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Registro de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Participantes
            </span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
            Inscribite al evento de tecnología más grande del año. Completá el formulario y
            aparecé en el listado.
          </p>
        </section>

        {/* Registration Form */}
        <ParticipantForm onAddParticipant={handleAddParticipant} />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            Participantes
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Filters */}
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          totalMatching={filteredParticipants.length}
          totalAll={participants.length}
        />

        {/* Participant Grid */}
        <ParticipantList
          participants={filteredParticipants}
          onDelete={handleDeleteParticipant}
        />
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-400">
        TechEvent 2025 · Programación IV · TP2
      </footer>
    </div>
  );
};

export default App;
