'use strict';

/**
 * Response Formatter Middleware
 *
 * Adds helper methods to the response object so every controller
 * can produce a consistent payload without repeating the structure.
 *
 * { success: boolean, message: string, data: any }
 */
const responseFormatter = (req, res, next) => {
  /**
   * Send a successful response.
   * @param {any}    data    - Payload to include (object, array, null)
   * @param {string} message - Human-readable success message
   * @param {number} status  - HTTP status code (default 200)
   */
  res.success = (data, message = 'OK', status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  /**
   * Send an error response.
   * @param {string} message - Human-readable error message
   * @param {number} status  - HTTP status code (default 400)
   * @param {any}    data    - Optional additional context (null in production)
   */
  res.fail = (message = 'Error', status = 400, data = null) => {
    return res.status(status).json({
      success: false,
      message,
      data,
    });
  };

  next();
};

module.exports = responseFormatter;
