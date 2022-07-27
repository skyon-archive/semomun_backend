const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'Semomun API',
      version: 'Beta',
      description: 'Semomun API Document',
      contact: {
        // name: "",
        // url: "",
        // email: ""
      }
    },
    servers: [{ url: 'http://localhost:8080' }, { url: 'https://dev.api.semomun.com' }],
  },
  apis: ['./app/routes/*.js', './swagger/*'],
};
const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
