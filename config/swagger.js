export default {
  swaggerDefinition: {
    info: {
      title: "WasHere API Documentation",
      servers: [`http://localhost:${process.env.PORT || 8080}/`],
      version: process.env.npm_package_version,
    },
    basePath: `${process.env.NODE_ENV === "production" ? "api" : "dev"}.washere.rocks `,
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: ["./routes/*.js"],
};
