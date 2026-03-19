'use strict';

const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

/**
 * POST /api/auth/login
 * Authenticates a user and returns their profile data.
 */
router.post(
  '/login',
  authController.loginValidation,
  authController.login
);

module.exports = router;
