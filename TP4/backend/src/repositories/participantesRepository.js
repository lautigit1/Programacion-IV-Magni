const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre, apellido, email, nivel, modalidad
     FROM participantes
     ORDER BY id DESC`
  );
  return rows;
};

const create = async (participante) => {
  const query = `
    INSERT INTO participantes (nombre, apellido, email, nivel, modalidad)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    participante.nombre,
    participante.apellido,
    participante.email,
    participante.nivel,
    participante.modalidad
  ];

  const [result] = await pool.query(query, values);

  return {
    id: result.insertId,
    ...participante
  };
};

const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM participantes WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  findAll,
  create,
  deleteById
};
