const express = require("express");
const axios = require("axios");
require("dotenv").config();
const routes = require("./routes/routes");
const authorizationMiddleware = require("./middleware/authorization");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

if (process.env.NODE_ENV == "production") {
  app.use(authorizationMiddleware);
}

app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});

app.use("/api/v1", routes);

module.exports = app;
