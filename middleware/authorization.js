const axios = require("axios");
require("dotenv").config();

const authorizationMiddleware = function (req, res, next) {
  var JWTbearer = req.headers.Authorization || req.headers.authorization;

  if (JWTbearer === undefined) {
    res.status(500).json({
      message: "Authorization header is missing",
    });
  }

  if (JWTbearer.length < 150) {
    res.status(500).json({
      message: "The format of the token is invalid",
    });
  }

  const url = process.env.DJANGO_API_TOKEN_VERIFICATION_URL;
  const veryfyToken = axios
    .post(url, { token: JWTbearer.split(" ")[1] })
    .then((response, res) => {
      console.log("authentification successfull");
      next();
    })
    .catch((error) => {
      return "error";
    });
};

module.exports = authorizationMiddleware;
