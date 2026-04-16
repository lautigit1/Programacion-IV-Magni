const participantesService = require('../services/participantesService');

const getParticipantes = async (_req, res, next) => {
  try {
    const participantes = await participantesService.obtenerTodos();
    res.status(200).json(participantes);
  } catch (error) {
    next(error);
  }
};

const postParticipante = async (req, res, next) => {
  try {
    const participante = await participantesService.crear(req.body);
    res.status(201).json(participante);
  } catch (error) {
    next(error);
  }
};

const deleteParticipante = async (req, res, next) => {
  try {
    await participantesService.eliminarPorId(req.params.id);
    res.status(200).json({ message: 'Participante eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParticipantes,
  postParticipante,
  deleteParticipante
};
