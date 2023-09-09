const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "HMAC-signature-API",
    version: "1.0.0",
    description: "API description",
  },
  servers: [
    {
      url: "https://hmac-signature-api-a2c57b64280e.herokuapp.com",
      description: "Production server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./index.js"], // Replace with the path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; // Use module.exports to export the swaggerJsdoc(options) object
