# TP4 - Registro de Participantes

## 1) Base de datos (MySQL)
Ejecutar el script:

- `database/schema.sql`

Esto crea la base `techevent` y la tabla `participantes`.

## 2) Backend
Ubicacion: `backend/`

1. Copiar `backend/.env.example` a `backend/.env` y completar credenciales.
2. Instalar dependencias:
   - `npm install`
3. Levantar API:
   - Desarrollo: `npm run dev`
   - Produccion: `npm start`

API disponible en `http://localhost:4001`.
Documentacion Swagger en `http://localhost:4001/docs/`.

Endpoints:
- `GET /api/participantes`
- `POST /api/participantes`
- `DELETE /api/participantes/:id`

## 3) Frontend
Ubicacion: `frontend/`

1. Instalar dependencias:
   - `npm install`
2. Si queres cambiar URL del backend, definir:
   - `VITE_API_URL=http://localhost:4001/api`
3. Levantar app:
   - `npm run dev`

Frontend dev server: `http://localhost:5173`

Nota sobre barra del navegador: algunos navegadores ocultan `http://` visualmente y muestran solo `localhost:5173`, pero la URL efectiva sigue siendo `http://localhost:5173`.

## 4) Arquitectura implementada

### Backend
- `src/config/database.js` -> pool MySQL.
- `src/repositories/participantesRepository.js` -> acceso SQL.
- `src/services/participantesService.js` -> validaciones y reglas de negocio.
- `src/controllers/participantesController.js` -> request/response HTTP.
- `src/routes/participantesRoutes.js` -> router REST.
- `src/middlewares/errorHandler.js` -> manejo de errores.

### Frontend
- `src/models/Participante.ts` -> tipos del dominio.
- `src/services/participantesService.ts` -> llamadas HTTP centralizadas.
- `src/context/ParticipantesContext.tsx` -> estado global con Context API.
- `src/main.tsx` -> provider global envolviendo `App`.
- `src/components/Formulario.tsx` -> alta de participantes.
- `src/components/Filtros.tsx` -> filtros de visualizacion.
- `src/components/ParticipanteCard.tsx` -> tarjeta de cada participante.
