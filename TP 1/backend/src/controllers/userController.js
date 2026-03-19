'use strict';

const { param, query, body, validationResult } = require('express-validator');
const userService = require('../services/userService');

/**
 * User Controller
 *
 * Handles HTTP concerns for user-related endpoints.
 * Delegates ALL business logic to userService.
 * Each method follows the same pattern: validate → delegate → respond.
 */
const userController = {

  /**
   * GET /api/users
   * GET /api/users?usuario=xxx
   */
  getUsers: async (req, res, next) => {
    try {
      // ?usuario is optional — passed as null if missing
      const usuarioFilter = req.query.usuario || null;
      const users = await userService.getUsers(usuarioFilter);

      return res.success(
        { users, total: users.length },
        users.length ? 'Usuarios obtenidos correctamente' : 'No se encontraron usuarios'
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Validation rules for PATCH /api/users/:id/block
   */
  blockValidation: [
    param('id')
      .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
      .toInt(),
    body('bloqueado')
      .isBoolean().withMessage('El campo bloqueado debe ser booleano (true/false)')
      .toBoolean(),
  ],

  /**
   * PATCH /api/users/:id/block
   * Body: { "bloqueado": true | false }
   */
  setBlockStatus: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.fail(
          errors.array().map(e => e.msg).join(', '),
          400
        );
      }

      const { id }       = req.params;
      const { bloqueado } = req.body;

      const updatedUser = await userService.setBlockStatus(id, bloqueado);

      const action  = bloqueado ? 'bloqueado' : 'desbloqueado';
      return res.success(
        { user: updatedUser },
        `Usuario ${action} correctamente`
      );
    } catch (err) {
      next(err);
    }
  },

};

module.exports = userController;
