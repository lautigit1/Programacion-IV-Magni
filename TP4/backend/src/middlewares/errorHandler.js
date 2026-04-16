const notFoundHandler = (_req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || 'Error interno del servidor'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
