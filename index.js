import "dotenv/config.js";
import express from "express";
import routes from "./routes/index.js";
import swaggerJsDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

const app = express();

// Configure Swagger -- to do

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Unittend API Documentation",
      servers: [`http://localhost:${process.env.PORT || 8080}/`],
      version: process.env.npm_package_version,
    },
    basePath: "/api",
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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
if (process.env.NODE_ENV !== "production")
  app.use("/api-docs", serve, setup(swaggerDocs));

app.use(express.json());
app.use("/api", routes);

app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));
