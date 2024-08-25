const swaggerJDDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Swagger Users - OpenAPI 3.0",
        version: "1.0.0",
        description: "Users server"
    },

    servers: [
        {
            url: "http://localhost:4200"
        }
    ]
}

const options = {
    swaggerDefinition,
    apis: ["./index.js"] // path to api routes
}

const swaggerSpec = swaggerJDDoc(options);
module.exports = swaggerSpec;