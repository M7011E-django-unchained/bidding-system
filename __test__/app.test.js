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
  describe("Authorization middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        json: jest.fn(),
      };
    });

    test("without headers", async () => {
      const expectedResponse = {
        error: "Missing JWT token from the 'Authorization' header",
      };
      authorizationMiddleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('without "authorization" header', async () => {
      const expectedResponse = {
        error: "Missing JWT token from the 'Authorization' header",
      };
      mockRequest = {
        headers: {},
      };
      authorizationMiddleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('with "authorization" header', async () => {
      mockRequest = {
        headers: {
          authorization: "Bearer abc",
        },
      };
      authorizationMiddleware(mockRequest, mockResponse, nextFunction);

      expect(nextFunction).toBeCalledTimes(1);
    });
  });
}
