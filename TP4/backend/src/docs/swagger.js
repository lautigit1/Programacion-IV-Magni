const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 4001;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TP4 API - Registro de Participantes',
      version: '1.0.0',
      description: 'Documentacion de endpoints obligatorios del TP4'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor local'
      }
    ],
    tags: [
      {
        name: 'Participantes',
        description: 'Gestion de participantes'
      }
    ],
    paths: {
      '/api/participantes': {
        get: {
          tags: ['Participantes'],
          summary: 'Retorna todos los participantes',
          responses: {
            '200': {
              description: 'Lista de participantes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Participante'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Participantes'],
          summary: 'Crea un participante',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CrearParticipante'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Participante creado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Participante'
                  }
                }
              }
            },
            '400': {
              description: 'Datos invalidos'
            },
            '409': {
              description: 'Email duplicado'
            }
          }
        }
      },
      '/api/participantes/{id}': {
        delete: {
          tags: ['Participantes'],
          summary: 'Elimina un participante por id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Participante eliminado'
            },
            '400': {
              description: 'Id invalido'
            },
            '404': {
              description: 'Participante no encontrado'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Participante: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan' },
            apellido: { type: 'string', example: 'Perez' },
            email: { type: 'string', example: 'juan@utn.edu.ar' },
            nivel: {
              type: 'string',
              enum: ['Basico', 'Intermedio', 'Avanzado']
            },
            modalidad: {
              type: 'string',
              enum: ['Presencial', 'Virtual', 'Hibrido']
            }
          }
        },
        CrearParticipante: {
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'nivel', 'modalidad'],
          properties: {
            nombre: { type: 'string', example: 'Juan' },
            apellido: { type: 'string', example: 'Perez' },
            email: { type: 'string', example: 'juan@utn.edu.ar' },
            nivel: {
              type: 'string',
              enum: ['Basico', 'Intermedio', 'Avanzado']
            },
            modalidad: {
              type: 'string',
              enum: ['Presencial', 'Virtual', 'Hibrido']
            }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec
};
