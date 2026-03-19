'use strict';

const mysql = require('mysql2/promise');

/**
 * Database configuration module.
 *
 * Creates a connection pool (NOT single connection) to support
 * concurrent requests without connection bottlenecks.
 * All DB config comes from environment — zero hardcoding.
 */

const pool = mysql.createPool({
  host:            process.env.DB_HOST,
  port:            parseInt(process.env.DB_PORT, 10),
  user:            process.env.DB_USER,
  password:        process.env.DB_PASSWORD,
  database:        process.env.DB_NAME,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  waitForConnections: true,
  queueLimit:         0,
  timezone:           '+00:00',
  charset:            'utf8mb4',
});

/**
 * Executes a parameterised SQL query against the pool.
 *
 * @param {string}  sql    - Parameterised SQL string (use ? placeholders)
 * @param {Array}   params - Values to bind (prevents SQL injection)
 * @returns {Promise<Array>} Rows returned by the query
 */
const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

/**
 * Tests the connection on startup so we fail fast with a clear message
 * rather than a cryptic runtime error on the first request.
 */
const testConnection = async () => {
  const conn = await pool.getConnection();
  conn.release();
  console.log(`[DB] Connected to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
};

module.exports = { query, testConnection };
