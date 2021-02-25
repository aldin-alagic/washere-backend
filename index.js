require("dotenv").config();
const express = require("express");
const routes = require("./routes/");

const app = express();

app.use("/api", routes);

// Configure Swagger -- to do

app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));
