'use strict';

const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

/**
 * GET /api/users
 * GET /api/users?usuario=xxx  (filter by partial username)
 *
 * Returns list of all users, optionally filtered.
 */
router.get('/', userController.getUsers);

/**
 * PATCH /api/users/:id/block
 * Body: { "bloqueado": true | false }
 *
 * Updates the blocked status of a specific user.
 * PATCH is correct here — we are partially updating one field.
 */
router.patch(
  '/:id/block',
  userController.blockValidation,
  userController.setBlockStatus
);

module.exports = router;
