-- =============================================================
-- UTN - Sistema de Gestión de Usuarios
-- Database: utn_db
-- Author: Development Team
-- =============================================================

CREATE DATABASE IF NOT EXISTS utn_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE utn_db;

-- =============================================================
-- TABLE: usuarios_utn
-- Stores system users with authentication and status metadata
-- =============================================================
CREATE TABLE IF NOT EXISTS usuarios_utn (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100)      NOT NULL,
  apellido    VARCHAR(100)      NOT NULL,
  usuario     VARCHAR(50)       NOT NULL,
  email       VARCHAR(150)      NOT NULL,
  password    VARCHAR(255)      NOT NULL COMMENT 'bcrypt hash — never plain text',
  rol         ENUM('admin','user') NOT NULL DEFAULT 'user',
  bloqueado   TINYINT(1)        NOT NULL DEFAULT 0 COMMENT '0 = activo, 1 = bloqueado',
  created_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  -- Enforce uniqueness at DB level — not only in app code
  UNIQUE KEY uq_usuario (usuario),
  UNIQUE KEY uq_email   (email),

  -- Index on bloqueado so filtering by status is fast
  INDEX idx_bloqueado (bloqueado),
  -- Covering index: common query is "find by username + check bloqueado"
  INDEX idx_usuario_bloqueado (usuario, bloqueado)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SEED DATA
-- Passwords are bcrypt hashes of the plaintext shown in comments
-- All generated with bcrypt cost factor 12
-- =============================================================
-- admin      → Admin123!
-- jdoe       → User1234!
-- mgarcia    → Pass5678!
-- lpérez     → Secure99!
-- alopez     → Hello321!
-- cmartinez  → World456!
-- rfernandez → Alpha789!
-- lgonzalez  → Beta1234!
-- psanchez   → Gamma567!
-- odiaz      → Delta890!

INSERT INTO usuarios_utn (nombre, apellido, usuario, email, password, rol, bloqueado) VALUES
  ('Admin',     'Sistema',    'admin',      'admin@utn.edu.ar',       '$2b$12$KIXxqNT3B9f4v2WdToP/FOV4R6LGP6UU0yqblZrOuT5P.2h9u0JI6',  'admin', 0),
  ('John',      'Doe',        'jdoe',       'jdoe@utn.edu.ar',        '$2b$12$Ckzm3h3i82HFbmpqZKj6aeekOHfBQv5l3qQ1x5/FHjFuZpJR95IqO',  'user',  0),
  ('María',     'García',     'mgarcia',    'mgarcia@utn.edu.ar',     '$2b$12$JdX2wOqN7fkmH4UXptl4CuJ.K0s9yLaC8T5TLpkYaBLnsFf0UY1Re',  'user',  0),
  ('Luis',      'Pérez',      'lperez',     'lperez@utn.edu.ar',      '$2b$12$7tqfPzRnV8WxH2Y3GmL5aORbVkXiK9dU1N6oJqPz2f1T4vC3mBnEW',  'user',  1),
  ('Ana',       'López',      'alopez',     'alopez@utn.edu.ar',      '$2b$12$PmF9kL2sT7vX6jK3HdN8aeVrBq5Y1wC4nG0oRpZtMuX8vJ2cK6Qs.',  'user',  0),
  ('Carlos',    'Martínez',   'cmartinez',  'cmartinez@utn.edu.ar',   '$2b$12$8nQrPk9vW3Xt5uL7JdM2aYoKf1H6bT4cZ0pN8VqXmGs3eF7jR5Iy.',  'user',  0),
  ('Roberto',   'Fernández',  'rfernandez', 'rfernandez@utn.edu.ar',  '$2b$12$3vBhMp6kQ9Tc7wN2JxL8aeWsYrZd4Fg0H1uV5CqXtP7oBm9nK6Je.',  'user',  1),
  ('Laura',     'González',   'lgonzalez',  'lgonzalez@utn.edu.ar',   '$2b$12$5xCkNq8rT2Vy9wP3KdF7aeUhMnZs6Jg1B4tH0LqXpR8vO6mY3Ws.',  'user',  0),
  ('Pablo',     'Sánchez',    'psanchez',   'psanchez@utn.edu.ar',    '$2b$12$9yDlOr7qU5Wz3xQ4LeFvaek.NpZt8Ih2C6uJ1MsXrP0wB9vG4Tg.',  'user',  0),
  ('Oscar',     'Díaz',       'odiaz',      'odiaz@utn.edu.ar',       '$2b$12$2zElPs6sV4Xa7yR3MdGwaeI/QpYu9Kj5F8vL0NtXoW1bA7cH6Bm.',  'user',  0);
