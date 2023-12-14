const axios = require("axios");
require("dotenv").config();

const authorizationMiddleware = function (req, res, next) {
  const JWTbearer = req.headers.Authorization || req.headers.authorization;

  if (JWTbearer === "Bearer None" || JWTbearer === "Bearer undefined") {
    res.status(500).json({
      message: "There was an issue processing the token",
    });
  }

  const url = process.env.DJANGO_API_TOKEN_VERIFICATION_URL;
  const requestBody = {
    token: JWTbearer.split(" ")[1],
  };

  axios
    .post(url, { token: JWTbearer.split(" ")[1] })
    .then((response) => {
      next();
    })
    .catch((error) => {
      if (process.env.NODE_ENV == "production") {
        console.error(error);
        res.status(500).json({
          message: "There was an issue processing the token",
        });
      }
    });
};

module.exports = authorizationMiddleware;
