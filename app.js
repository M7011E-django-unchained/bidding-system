const express = require("express");
const axios = require("axios");

const routes = require("./routes/routes");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});

app.use((req, res, next) => {
  console.log("Run auth middleware");

  const JWTbearer = req.headers.Authorization || req.headers.authorization;

  try {
    const requestBody = {
      token: JWTbearer.split(" ")[1],
    };

    axios
      .post("http://127.0.0.1:8000/user/token/verify/", requestBody)
      .then((response) => {
        console.log(response.data);
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
});

app.use("/api/v1", routes);

module.exports = app;
