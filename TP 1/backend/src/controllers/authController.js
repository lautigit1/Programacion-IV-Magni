'use strict';

const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * Auth Controller
 *
 * Handles HTTP concerns ONLY:
 * - Parse and validate request body
 * - Delegate to authService
 * - Format and send response
 *
 * Zero business logic lives here.
 */
const authController = {

  /**
   * Validation rules for POST /api/auth/login
   */
  loginValidation: [
    body('usuario')
      .trim()
      .notEmpty().withMessage('El campo usuario es obligatorio')
      .isLength({ max: 50 }).withMessage('El usuario no puede superar 50 caracteres'),
    body('password')
      .notEmpty().withMessage('El campo password es obligatorio')
      .isLength({ max: 100 }).withMessage('El password no puede superar 100 caracteres'),
  ],

  /**
   * POST /api/auth/login
   */
  login: async (req, res, next) => {
    try {
      // 1. Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.fail(
          errors.array().map(e => e.msg).join(', '),
          400
        );
      }

      // 2. Destructure only what we need — never blindly spread req.body
      const { usuario, password } = req.body;

      // 3. Delegate to service — controller knows nothing about bcrypt or DB
      const result = await authService.login(usuario, password);

      if (!result.success) {
        return res.fail(result.reason, 401);
      }

      // 4. Respond with user data (toJSON automatically strips password)
      return res.success(
        { user: result.user },
        'Login exitoso'
      );

    } catch (err) {
      next(err);
    }
  },

};

module.exports = authController;
