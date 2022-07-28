const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>',
          in: 'header',
        },
      },
    },
    security: [{ Authorization: [] }],
    openapi: '3.0.0',
    info: {
      title: 'Semomun API',
      version: 'Beta',
      description: 'Semomun API Document',
      contact: {
        // name: "",
        // url: "",
        // email: ""
      },
    },
    servers: [
        // { url: 'http://localhost:8080' },
        { url: 'https://dev.api.semomun.com' }
    ],
    // host: 'localhost:8080',
    // host: 'https://dev.api.semomun.com',
    // basePath: '/',
    tags: [
      { name: 'Workbooks', description: '워크북(도서) 관련 API' },
      //   { name: 'Pay', description: '결제 관련' },
      { name: 'Bootpay Card', description: '부트페이에 등록한 카드 정보' },
      { name: 'Auto Charge', description: '자동충전과 관련된 API' },
    ],
  },
  apis: ['./app/routes/*.js', './swagger/*'],
};
const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
