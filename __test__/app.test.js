require("dotenv").config();

const mongoose = require(`mongoose`);
const request = require(`supertest`);
const app = require(`../app`);
const Bid = require(`../models/bid`);
const mongoString = process.env.TEST_DATABASE_URL;

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(mongoString);
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
