import React, { useState } from "react";
import type { Participant } from "../types/Participant";
import {
  LEVEL_OPTIONS,
  MODALITY_OPTIONS,
  TECH_OPTIONS,
  generateId,
  isValidEmail,
} from "../utils/helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  nombre: string;
  email: string;
  edad: string;
  pais: string;
  modalidad: Participant["modalidad"];
  tecnologias: string[];
  nivel: Participant["nivel"];
  aceptaTerminos: boolean;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  edad?: string;
  pais?: string;
  tecnologias?: string;
  aceptaTerminos?: string;
}

interface Props {
  onAddParticipant: (participant: Participant) => void;
}

// ─── Default State ────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  nombre: "",
  email: "",
  edad: "",
  pais: "",
  modalidad: "Presencial",
  tecnologias: [],
  nivel: "Principiante",
  aceptaTerminos: false,
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  if (!data.email.trim()) {
    errors.email = "El email es obligatorio.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "El email no tiene un formato válido.";
  }
  if (!data.edad) {
    errors.edad = "La edad es obligatoria.";
  } else if (Number(data.edad) <= 0) {
    errors.edad = "La edad debe ser mayor a 0.";
  }
  if (!data.pais.trim()) errors.pais = "El país es obligatorio.";
  if (data.tecnologias.length === 0)
    errors.tecnologias = "Seleccioná al menos una tecnología.";
  if (!data.aceptaTerminos)
    errors.aceptaTerminos = "Debés aceptar los términos para continuar.";
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Controlled form to register a new event participant.
 * Includes per-field validation, real-time error display, and reset on submit.
 */
const ParticipantForm: React.FC<Props> = ({ onAddParticipant }) => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (touched[name as keyof FormData]) {
      const newErrors = validate({ ...form, [name]: type === "checkbox" ? checked : value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const toggleTechnology = (tech: string) => {
    setForm((prev) => {
      const updated = prev.tecnologias.includes(tech)
        ? prev.tecnologias.filter((t) => t !== tech)
        : [...prev.tecnologias, tech];
      const newForm = { ...prev, tecnologias: updated };
      if (touched.tecnologias) setErrors(validate(newForm));
      return newForm;
    });
    setTouched((prev) => ({ ...prev, tecnologias: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      nombre: true, email: true, edad: true, pais: true,
      tecnologias: true, aceptaTerminos: true,
    });
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const newParticipant: Participant = {
      id: generateId(),
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      edad: Number(form.edad),
      pais: form.pais.trim(),
      modalidad: form.modalidad,
      tecnologias: form.tecnologias,
      nivel: form.nivel,
      aceptaTerminos: form.aceptaTerminos,
    };

    onAddParticipant(newParticipant);
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const hasErrors = Object.keys(validate(form)).length > 0;

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
        <h2 className="text-xl font-bold text-white tracking-tight">
          📝 Registrar Participante
        </h2>
        <p className="text-indigo-200 text-sm mt-1">
          Completá el formulario para inscribirte al evento.
        </p>
      </div>

      {/* Success Banner */}
      {submitted && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 animate-fade-in">
          <span className="text-emerald-600 text-sm font-medium">
            ✅ Participante registrado exitosamente.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label htmlFor="nombre" className="text-sm font-semibold text-slate-700">
              Nombre completo <span className="text-rose-500">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: María García"
              aria-describedby="nombre-error"
              className={`input-field ${errors.nombre && touched.nombre ? "input-error" : ""}`}
            />
            {errors.nombre && touched.nombre && (
              <p id="nombre-error" className="text-xs text-rose-500">{errors.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: maria@email.com"
              aria-describedby="email-error"
              className={`input-field ${errors.email && touched.email ? "input-error" : ""}`}
            />
            {errors.email && touched.email && (
              <p id="email-error" className="text-xs text-rose-500">{errors.email}</p>
            )}
          </div>

          {/* Edad */}
          <div className="flex flex-col gap-1">
            <label htmlFor="edad" className="text-sm font-semibold text-slate-700">
              Edad <span className="text-rose-500">*</span>
            </label>
            <input
              id="edad"
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: 25"
              min={1}
              aria-describedby="edad-error"
              className={`input-field ${errors.edad && touched.edad ? "input-error" : ""}`}
            />
            {errors.edad && touched.edad && (
              <p id="edad-error" className="text-xs text-rose-500">{errors.edad}</p>
            )}
          </div>

          {/* País */}
          <div className="flex flex-col gap-1">
            <label htmlFor="pais" className="text-sm font-semibold text-slate-700">
              País <span className="text-rose-500">*</span>
            </label>
            <input
              id="pais"
              type="text"
              name="pais"
              value={form.pais}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Argentina"
              aria-describedby="pais-error"
              className={`input-field ${errors.pais && touched.pais ? "input-error" : ""}`}
            />
            {errors.pais && touched.pais && (
              <p id="pais-error" className="text-xs text-rose-500">{errors.pais}</p>
            )}
          </div>

          {/* Modalidad */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modalidad" className="text-sm font-semibold text-slate-700">
              Modalidad
            </label>
            <select
              id="modalidad"
              name="modalidad"
              value={form.modalidad}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field"
            >
              {MODALITY_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Nivel */}
          <div className="flex flex-col gap-1">
            <label htmlFor="nivel" className="text-sm font-semibold text-slate-700">
              Nivel de experiencia
            </label>
            <select
              id="nivel"
              name="nivel"
              value={form.nivel}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field"
            >
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Tecnologías — full width */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Tecnologías <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((tech) => {
                const selected = form.tecnologias.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTechnology(tech)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                      selected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
            {errors.tecnologias && touched.tecnologias && (
              <p className="text-xs text-rose-500">{errors.tecnologias}</p>
            )}
          </div>

          {/* Términos — full width */}
          <div className="md:col-span-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="aceptaTerminos"
                id="aceptaTerminos"
                checked={form.aceptaTerminos}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                Acepto los{" "}
                <span className="text-indigo-600 font-medium underline underline-offset-2">
                  términos y condiciones
                </span>{" "}
                del evento tecnológico.
              </span>
            </label>
            {errors.aceptaTerminos && touched.aceptaTerminos && (
              <p className="text-xs text-rose-500 mt-1 ml-7">{errors.aceptaTerminos}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={Object.keys(touched).length > 0 && hasErrors}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-md hover:shadow-indigo-200 active:scale-95"
          >
            Registrar Participante →
          </button>
        </div>
      </form>
    </section>
  );
};

export default ParticipantForm;
