const express = require("express");

const routes = require("./routes/routes");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});

app.use("/api/v1", routes);

module.exports = app;
