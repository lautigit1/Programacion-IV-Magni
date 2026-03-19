'use strict';

/**
 * Application Entry Point
 *
 * Bootstraps the Express application:
 * 1. Load environment variables
 * 2. Configure middleware stack (order matters in Express)
 * 3. Mount route modules under their base paths
 * 4. Register the centralized error handler (must be last)
 * 5. Test DB connection, then start listening
 */

require('dotenv').config();

const express         = require('express');
const cors            = require('cors');
const responseFormatter = require('./src/middlewares/responseFormatter');
const errorHandler    = require('./src/middlewares/errorHandler');
const authRoutes      = require('./src/routes/authRoutes');
const userRoutes      = require('./src/routes/userRoutes');
const { testConnection } = require('./src/config/database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security / CORS ─────────────────────────────────────────────
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5500';
app.use(cors({
  origin:      corsOrigin === '*' ? '*' : corsOrigin,
  methods:     ['GET', 'POST', 'PATCH'],
  credentials: false,
}));


// ── Body parsers ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Custom response helpers (must come before routes) ────────────
app.use(responseFormatter);

// ── Health check (useful for Docker / load balancers) ────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/users', userRoutes);

// ── 404 handler (must come after routes, before error handler) ───
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    data:    null,
  });
});

// ── Centralized error handler (must be last) ─────────────────────
app.use(errorHandler);

// ── Start server after DB connection is confirmed ────────────────
(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`[SERVER] Running on http://localhost:${PORT} — env: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('[FATAL] Could not connect to database. Server not started.', err.message);
    process.exit(1);
  }
})();
