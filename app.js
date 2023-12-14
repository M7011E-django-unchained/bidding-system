const express = require("express");
const axios = require("axios");
require("dotenv").config();
const routes = require("./routes/routes");

const app = express();

const authorizationMiddleware = function (req, res, next) {
  const JWTbearer = req.headers.Authorization || req.headers.authorization;

  try {
    const url = process.env.DJANGO_API_TOKEN_VERIFICATION_URL;
    const requestBody = {
      token: JWTbearer.split(" ")[1],
    };

    axios
      .post(url, requestBody)
      .then((response) => {
        next();
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    res.status(500).json({
      message: "There was an issue processing the token",
      error: error.message,
    });
  }
};

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
