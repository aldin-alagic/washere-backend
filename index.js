import "dotenv/config.js";
import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

import routes from "./routes/index.js";
import swaggerOptions from "./config/swagger.js";

const app = express();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
if (process.env.NODE_ENV !== "production") app.use("/api-docs", serve, setup(swaggerDocs));

app.use(express.json());
app.use("/", routes);

app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));
