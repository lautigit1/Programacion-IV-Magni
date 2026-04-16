require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const port = process.env.PORT || 4001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

const startServer = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Backend corriendo en http://localhost:${port}`);
      console.log(`Swagger disponible en http://localhost:${port}/docs`);
      console.log(`Frontend esperado en ${frontendUrl}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
