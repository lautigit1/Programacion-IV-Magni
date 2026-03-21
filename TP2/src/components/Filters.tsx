import React from "react";
import type { FilterState } from "../types/Participant";
import { LEVEL_OPTIONS, MODALITY_OPTIONS } from "../utils/helpers";

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalMatching: number;
  totalAll: number;
}

/**
 * Filter bar with:
 * - Real-time name search
 * - Modality dropdown filter
 * - Level dropdown filter
 * - Clear filters button (shown only when filters are active)
 *
 * All filter updates are combined and propagated to the parent at once.
 */
const Filters: React.FC<Props> = ({ filters, onFilterChange, totalMatching, totalAll }) => {
  const isFiltering =
    filters.searchName !== "" || filters.modalidad !== "" || filters.nivel !== "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    onFilterChange({ searchName: "", modalidad: "", nivel: "" });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Name search */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            name="searchName"
            value={filters.searchName}
            onChange={handleChange}
            placeholder="Buscar por nombre..."
            aria-label="Buscar participante por nombre"
            className="input-field pl-9 w-full"
          />
        </div>

        {/* Modalidad filter */}
        <select
          name="modalidad"
          value={filters.modalidad}
          onChange={handleChange}
          aria-label="Filtrar por modalidad"
          className="input-field w-full sm:w-44"
        >
          <option value="">Todas las modalidades</option>
          {MODALITY_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Nivel filter */}
        <select
          name="nivel"
          value={filters.nivel}
          onChange={handleChange}
          aria-label="Filtrar por nivel"
          className="input-field w-full sm:w-44"
        >
          <option value="">Todos los niveles</option>
          {LEVEL_OPTIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Clear filters button */}
        {isFiltering && (
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Results summary */}
      {isFiltering && (
        <p className="text-xs text-slate-400 mt-3">
          Mostrando{" "}
          <span className="font-semibold text-slate-600">{totalMatching}</span> de{" "}
          <span className="font-semibold text-slate-600">{totalAll}</span> participantes
        </p>
      )}
    </div>
  );
};

export default Filters;
