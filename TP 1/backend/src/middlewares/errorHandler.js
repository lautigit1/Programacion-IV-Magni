'use strict';

/**
 * Centralized Error Handler Middleware
 *
 * Must be registered LAST in the Express middleware stack.
 * Catches all errors passed via next(err) from any route or middleware.
 *
 * Rules:
 * - Never expose stack traces in production
 * - Map known error types to semantically correct HTTP status codes
 * - Always return the standard { success, message, data } shape
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const isDev = process.env.NODE_ENV === 'development';

  // Log full error server-side (in production use a proper logger like Winston/Pino)
  console.error(`[ERROR] ${req.method} ${req.path}`, {
    message: err.message,
    status:  err.status,
    ...(isDev && { stack: err.stack }),
  });

  // Determine HTTP status: use attached status, fallback to 500
  const status = err.status || err.statusCode || 500;

  // In production, mask 5xx details to not leak implementation info
  const message = status >= 500 && !isDev
    ? 'Ocurrió un error interno. Por favor, intente más tarde.'
    : err.message || 'Error desconocido';

  return res.status(status).json({
    success: false,
    message,
    data:    null,
  });
};

module.exports = errorHandler;
