import { useState } from 'react';
import type { Modalidad, Nivel } from '../models/Participante';
import { useParticipantes } from '../context/ParticipantesContext';

export const ParticipantesEjemplo = () => {
  const { participantes, agregar, eliminar, resetear } = useParticipantes();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState<Nivel>('Basico');
  const [modalidad, setModalidad] = useState<Modalidad>('Presencial');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    agregar({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      nivel,
      modalidad
    });

    setNombre('');
    setApellido('');
    setEmail('');
    setNivel('Basico');
    setModalidad('Presencial');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Registro de Participantes - TP4</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />
        <input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />

        <select value={nivel} onChange={(e) => setNivel(e.target.value as Nivel)}>
          <option value="Basico">Basico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>

        <select value={modalidad} onChange={(e) => setModalidad(e.target.value as Modalidad)}>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
        </select>

        <button type="submit">Agregar</button>
        <button type="button" onClick={resetear}>
          Resetear
        </button>
      </form>

      <ul style={{ display: 'grid', gap: 12, padding: 0, listStyle: 'none' }}>
        {participantes.map((p) => (
          <li key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <strong>
              {p.nombre} {p.apellido}
            </strong>
            <div>{p.email}</div>
            <div>
              {p.nivel} - {p.modalidad}
            </div>
            <button type="button" onClick={() => p.id && eliminar(p.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
