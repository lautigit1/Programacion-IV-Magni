const participantesRepository = require('../repositories/participantesRepository');

const ALLOWED_NIVELES = ['Basico', 'Intermedio', 'Avanzado'];
const ALLOWED_MODALIDADES = ['Presencial', 'Virtual', 'Hibrido'];

const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeText = (value) => String(value || '').trim();

const validateParticipante = (payload) => {
  const nombre = normalizeText(payload.nombre);
  const apellido = normalizeText(payload.apellido);
  const email = normalizeText(payload.email).toLowerCase();
  const nivel = normalizeText(payload.nivel);
  const modalidad = normalizeText(payload.modalidad);

  if (!nombre || !apellido || !email || !nivel || !modalidad) {
    throw buildError('Todos los campos son obligatorios', 400);
  }

  const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!simpleEmailRegex.test(email)) {
    throw buildError('El email no tiene un formato valido', 400);
  }

  if (!ALLOWED_NIVELES.includes(nivel)) {
    throw buildError('Nivel invalido', 400);
  }

  if (!ALLOWED_MODALIDADES.includes(modalidad)) {
    throw buildError('Modalidad invalida', 400);
  }

  return { nombre, apellido, email, nivel, modalidad };
};

const obtenerTodos = async () => participantesRepository.findAll();

const crear = async (payload) => {
  const participante = validateParticipante(payload);

  try {
    return await participantesRepository.create(participante);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      throw buildError('El email ya esta registrado', 409);
    }
    throw error;
  }
};

const eliminarPorId = async (id) => {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw buildError('El id debe ser un numero entero positivo', 400);
  }

  const affectedRows = await participantesRepository.deleteById(parsedId);

  if (affectedRows === 0) {
    throw buildError('Participante no encontrado', 404);
  }
};

module.exports = {
  obtenerTodos,
  crear,
  eliminarPorId
};
