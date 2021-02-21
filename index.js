require("dotenv").config();

const express = require("express");
const app = express();

// Configure Swagger -- to do

const server = app.listen(process.env.PORT || 8080, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
