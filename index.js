import "dotenv/config.js";
import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import cors from "cors";
import fileUpload from "express-fileupload";

import routes from "./routes/index.js";
import swaggerOptions from "./config/swagger.js";
import wss from "./websocket/index.js";

const app = express();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
if (process.env.NODE_ENV !== "production") app.use("/api-docs", serve, setup(swaggerDocs));

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(fileUpload());
app.use("/", routes);

// Start Express server
const server = app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));

// Start socket.io server
wss(server);
