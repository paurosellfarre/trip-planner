const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trip Planner API',
      version: '1.0.0',
      description: 'API for searching, saving, listing, and deleting trips',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Local Development Server'
      }
    ],
    components: {
      schemas: {
        Trip: {
          type: 'object',
          required: ['origin', 'destination', 'cost', 'duration', 'type'],
          properties: {
            id: {
              type: 'string',
              description: 'Trip unique identifier',
              example: 'a749c866-7928-4d08-9d5c-a6821a583d1a'
            },
            origin: {
              type: 'string',
              description: 'IATA 3-letter code of origin',
              example: 'JFK'
            },
            destination: {
              type: 'string',
              description: 'IATA 3-letter code of destination',
              example: 'LAX'
            },
            cost: {
              type: 'number',
              description: 'Trip cost',
              example: 300
            },
            duration: {
              type: 'number',
              description: 'Trip duration',
              example: 6
            },
            type: {
              type: 'string',
              description: 'Trip type',
              example: 'flight'
            },
            display_name: {
              type: 'string',
              description: 'Human readable trip description',
              example: 'from JFK to LAX by flight'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                },
                status: {
                  type: 'integer'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/presentation/routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Configure Swagger middleware
 * @param {Express} app - Express application
 */
const setupSwagger = (app) => {
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Serve swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = { setupSwagger };
