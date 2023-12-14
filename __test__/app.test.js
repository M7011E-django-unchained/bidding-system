require("dotenv").config();

const mongoose = require(`mongoose`);
const request = require(`supertest`);
const app = require(`../app`);
const Bid = require(`../models/bid`);
const mongoString = process.env.TEST_DATABASE_URL;
const PORT = process.env.PORT || 5000;
const baseUrl = `/api/v1`;
const axios = require("axios");

var token = "";
process.env.NODE_ENV = "production";

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(mongoString);

  const url = process.env.DJANGO_API_TOKEN_URL;

  const requestBody = {
    username: process.env.DJANGO_API_SUPER_USER,
    password: process.env.DJANGO_API_SUPER_USER_PASSWORD,
  };

  await axios
    .post(url, requestBody)
    .then((response) => {
      token = response.data.access;
    })
    .catch((error) => {
      console.error(error);
    });
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe(`GET /`, () => {
  it(`should check connection`, async () => {
    const response = await request(app).get(`/`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ alive: "True" });
  });
});

if (process.env.NOT_TEST_GITHUB) {
  describe("Middleware Setup", () => {
    it("should pass the request to the next middleware if the token is valid", async () => {
      // Mock the request and response objects
      const req = {
        headers: {
          authorization: "Bearer " + token,
        },
      };
      const res = {};

      // Mock the next middleware function
      const next = jest.fn();

      // Call the middleware function
      await app.authorizationMiddleware(req, res, next);

      // Expect the next middleware to be called
      expect(next).toHaveBeenCalled();
    });

    it("should return an error response if the token is invalid", async () => {
      // Mock the request and response objects
      const req = {
        headers: {
          authorization: "Bearer invalid_token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the next middleware function
      const next = jest.fn();

      // Call the middleware function
      await authorizationMiddleware(req, res, next);

      // Expect the response status to be 500
      expect(res.status).toHaveBeenCalledWith(500);

      // Expect the response JSON to contain the error message
      expect(res.json).toHaveBeenCalledWith({
        message: "There was an issue processing the token",
        error: "Invalid token",
      });

      // Expect the next middleware not to be called
      expect(next).not.toHaveBeenCalled();
    });
  });
}
