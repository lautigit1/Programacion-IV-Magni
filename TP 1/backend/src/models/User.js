'use strict';

/**
 * User Domain Model
 *
 * A plain, framework-agnostic representation of a User entity.
 * This class is intentionally simple — it only models the domain,
 * it does NOT interact with the database.
 *
 * Sensitive fields (password) are stripped on serialization
 * via the toJSON() method, ensuring they never leak into API responses.
 */
class User {
  /**
   * @param {object} data - Raw row from database
   */
  constructor(data) {
    this.id        = data.id;
    this.nombre    = data.nombre;
    this.apellido  = data.apellido;
    this.usuario   = data.usuario;
    this.email     = data.email;
    this.rol       = data.rol;
    this.bloqueado = Boolean(data.bloqueado);
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    // password is kept internally for auth checks, never serialised
    this._password = data.password;
  }

  /**
   * Returns the full name formatted as "Nombre Apellido"
   * @returns {string}
   */
  get fullName() {
    return `${this.nombre} ${this.apellido}`;
  }

  /**
   * Overridden to exclude the password hash from JSON output.
   * Called automatically by JSON.stringify().
   * @returns {object}
   */
  toJSON() {
    return {
      id:        this.id,
      nombre:    this.nombre,
      apellido:  this.apellido,
      usuario:   this.usuario,
      email:     this.email,
      rol:       this.rol,
      bloqueado: this.bloqueado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;
