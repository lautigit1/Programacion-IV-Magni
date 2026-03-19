'use strict';

const db   = require('../config/database');
const User = require('../models/User');

/**
 * User Repository — Data Access Layer
 *
 * The ONLY place in the application that executes SQL.
 * No business logic here — just pure data access operations.
 * All queries are parameterised to prevent SQL injection.
 */
const userRepository = {

  /**
   * Returns all users, optionally filtered by a partial username match.
   * Excludes password from the SELECT for defence in depth.
   *
   * @param {string|null} usuarioFilter - Partial username to filter by (or null for all)
   * @returns {Promise<User[]>}
   */
  findAll: async (usuarioFilter = null) => {
    let sql = `
      SELECT id, nombre, apellido, usuario, email, rol, bloqueado, created_at, updated_at
      FROM   usuarios_utn
    `;
    const params = [];

    if (usuarioFilter) {
      sql += ' WHERE usuario LIKE ? OR nombre LIKE ? OR apellido LIKE ?';
      const likeQuery = `%${usuarioFilter}%`;
      params.push(likeQuery, likeQuery, likeQuery);
    }

    sql += ' ORDER BY apellido ASC, nombre ASC';

    const rows = await db.query(sql, params);
    return rows.map(row => new User(row));
  },

  /**
   * Finds a single user by their exact username.
   * Includes password hash — ONLY for authentication checks.
   *
   * @param {string} usuario
   * @returns {Promise<User|null>}
   */
  findByUsername: async (usuario) => {
    const sql = `
      SELECT id, nombre, apellido, usuario, email, password, rol, bloqueado, created_at, updated_at
      FROM   usuarios_utn
      WHERE  usuario = ?
      LIMIT  1
    `;
    const rows = await db.query(sql, [usuario]);
    return rows.length ? new User(rows[0]) : null;
  },

  /**
   * Finds a single user by their primary key.
   *
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  findById: async (id) => {
    const sql = `
      SELECT id, nombre, apellido, usuario, email, rol, bloqueado, created_at, updated_at
      FROM   usuarios_utn
      WHERE  id = ?
      LIMIT  1
    `;
    const rows = await db.query(sql, [id]);
    return rows.length ? new User(rows[0]) : null;
  },

  /**
   * Updates the blocked status of a user.
   *
   * @param {number}  id        - User primary key
   * @param {boolean} bloqueado - true = block, false = unblock
   * @returns {Promise<boolean>} true if a row was actually updated
   */
  updateBlockStatus: async (id, bloqueado) => {
    const sql = `
      UPDATE usuarios_utn
      SET    bloqueado = ?
      WHERE  id = ?
    `;
    const result = await db.query(sql, [bloqueado ? 1 : 0, id]);
    return result.affectedRows > 0;
  },

};

module.exports = userRepository;
