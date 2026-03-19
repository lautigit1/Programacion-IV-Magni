'use strict';

const userRepository = require('../repositories/userRepository');

/**
 * User Service — User Management Business Logic
 *
 * Orchestrates user-related operations.
 * Enforces business rules (e.g., cannot block non-existent user).
 * Does NOT know about HTTP — no req/res/status codes here.
 */
const userService = {

  /**
   * Retrieves all users, optionally filtered by partial username.
   *
   * @param {string|null} usuarioFilter
   * @returns {Promise<User[]>}
   */
  getUsers: async (usuarioFilter = null) => {
    // Sanitize: empty string is treated as "no filter"
    const filter = usuarioFilter?.trim() || null;
    return userRepository.findAll(filter);
  },

  /**
   * Toggles the blocked state of a user.
   *
   * @param {number}  id        - User ID from route param (already parsed to int)
   * @param {boolean} bloqueado - Desired block state
   * @returns {Promise<User>} Updated user object
   * @throws {Error} NotFound if user does not exist
   */
  setBlockStatus: async (id, bloqueado) => {
    // Verify user exists BEFORE updating — gives a meaningful 404 instead of silent no-op
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error(`Usuario con id ${id} no encontrado`);
      err.status = 404;
      throw err;
    }

    // Idempotency check: if already in the desired state, skip the UPDATE
    if (user.bloqueado === bloqueado) {
      return user; // Nothing changed — return current state
    }

    await userRepository.updateBlockStatus(id, bloqueado);

    // Return fresh state from DB (reflects actual persisted value)
    return userRepository.findById(id);
  },

};

module.exports = userService;
