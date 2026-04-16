const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const participantesRoutes = require('./routes/participantesRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const { swaggerSpec } = require('./docs/swagger');

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: frontendUrl
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/participantes', participantesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
