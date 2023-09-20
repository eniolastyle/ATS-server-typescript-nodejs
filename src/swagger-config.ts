import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATS Sample API',
      version: '1.0.0',
      description: 'API documentation for ATS TypeScript Node.js Application',
    },
  },
  apis: ['./src/routes/*.ts'], // Path to route files (TypeScript)
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
