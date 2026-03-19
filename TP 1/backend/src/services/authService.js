'use strict';

const bcrypt         = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

/**
 * Auth Service — Authentication Business Logic
 *
 * Responsible for:
 * - Validating credentials against the database
 * - Comparing hashed passwords securely
 *
 * No HTTP knowledge here — no req/res, no status codes.
 * Returns plain objects that controllers can act on.
 */
const authService = {

  /**
   * Validates a login attempt.
   *
   * @param {string} usuario  - Username provided by the user
   * @param {string} password - Plain-text password provided by the user
   * @returns {Promise<{ success: boolean, user?: User, reason?: string }>}
   */
  login: async (usuario, password) => {
    // Step 1: Check user exists
    const user = await userRepository.findByUsername(usuario);
    if (!user) {
      // Return generic message — never reveal WHICH field was wrong
      return { success: false, reason: 'Credenciales inválidas' };
    }

    // Step 2: Deny blocked users BEFORE doing the expensive hash comparison
    if (user.bloqueado) {
      return { success: false, reason: 'La cuenta está bloqueada. Contacte al administrador.' };
    }

    // Step 3: Compare plain-text password with stored bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user._password);
    if (!passwordMatch) {
      return { success: false, reason: 'Credenciales inválidas' };
    }

    // Step 4: Success — return the user (toJSON strips the password hash)
    return { success: true, user };
  },

};

module.exports = authService;
