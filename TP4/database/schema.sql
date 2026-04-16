CREATE DATABASE IF NOT EXISTS techevent;
USE techevent;

CREATE TABLE IF NOT EXISTS participantes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  nivel ENUM('Basico', 'Intermedio', 'Avanzado') NOT NULL,
  modalidad ENUM('Presencial', 'Virtual', 'Hibrido') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_participantes_email (email)
);
