require("dotenv").config();

const mongoose = require(`mongoose`);
const request = require(`supertest`);
const app = require(`../app`);
const Bid = require(`../models/bid`);
const mongoString = process.env.TEST_DATABASE_URL;
const baseUrl = `/api/v1`;

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(mongoString);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe(`POST /createBid`, () => {
  it(`should create a new bid`, async () => {
    const time = new Date();
    const response = await request(app).post(`${baseUrl}/createBid`).send({
      auctionId: 1234567890,
      bidder: `bidder name`,
      bidderId: 987654321,
      bidAmount: 10000,
      bidTime: time.toISOString(),
    });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.auctionId).toStrictEqual(1234567890);
    expect(response.body.bidder).toStrictEqual(`bidder name`);
    expect(response.body.bidderId).toStrictEqual(987654321);
    expect(response.body.bidAmount).toStrictEqual(10000);
    expect(Date(response.body.bidTime)).toStrictEqual(Date(time));
  });

  it(`should return an error if there is a validation error`, async () => {
    const response = await request(app).post(`${baseUrl}/createBid`).send({
      auctionId: 1234567890,
      bidder: `bidder name`,
      bidderId: 987654321,
      bidAmount: `invalid`,
      bidTime: new Date().toISOString(),
    });
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if the auctionId is invalid`, async () => {
    const response = await request(app).post(`${baseUrl}/createBid`).send({
      auctionId: "invalid",
      bidder: `bidder name`,
      bidderId: 987654321,
      bidAmount: 100,
      bidTime: new Date().toISOString(),
    });
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  it(`should not create a new bid if the bidAmount is lower than existings bids`, async () => {
    const time = new Date();
    const response = await request(app).post(`${baseUrl}/createBid`).send({
      auctionId: 34,
      bidder: `bidder name`,
      bidderId: 987654321,
      bidAmount: 1,
      bidTime: time,
    });
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });
});

describe(`GET /getAllBids`, () => {
  it(`should return all bids`, async () => {
    const response = await request(app).get(`${baseUrl}/getAllBids`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).get(`${baseUrl}/getAllBids`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe(`GET /getAllBidsByAuctionId/:auctionId`, () => {
  it(`should return all bids by auctionId`, async () => {
    const response = await request(app).get(
      `${baseUrl}/getAllBidsByAuctionId/3`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).get(
      `${baseUrl}/getAllBidsByAuctionId/anyId`
    );
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe(`GET /getAllBidsByBidderId/:bidderId`, () => {
  it(`should return all bids by bidderId`, async () => {
    const response = await request(app).get(
      `${baseUrl}/getAllBidsByBidderId/1`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).get(
      `${baseUrl}/getAllBidsByBidderId/anyId`
    );
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe(`GET /getAllBids/:bidderId/:auctionId`, () => {
  it(`should return all bids by bidderId and auctionId`, async () => {
    const response = await request(app).get(`${baseUrl}/getAllBids/1/3`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).get(
      `${baseUrl}/getAllBids/anyId/anyId`
    );
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe(`GET /getOneBid/:id`, () => {
  it(`should return a bid by ID`, async () => {
    // Create a bid
    const bid = new Bid({
      auctionId: 1234567890,
      bidder: `bidder name`,
      bidderId: 987654321,
      bidAmount: 100,
      bidTime: new Date(),
    });
    await bid.save();

    const response = await request(app).get(
      `${baseUrl}/getOneBid/6552210ba26de35068576cd7`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).get(`${baseUrl}/getOneBid/anyId`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe(`GET /getWinnerByAuctionId/:auctionId`, () => {
  it(`should return the highest bidder by auctionId`, async () => {
    const response = await request(app)
      .get(`${baseUrl}/getWinnerByAuctionId/34`)
      .send({ endTime: new Date().toISOString() });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return error if the auction is not over yet`, async () => {
    var date = new Date();
    date.setDate(date.getDate() - 100000);

    const response = await request(app)
      .get(`${baseUrl}/getWinnerByAuctionId/34`)
      .send({ endTime: date });
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  it(`should return error id endTime is not in an accepted format or type`, async () => {
    const response = await request(app)
      .get(`${baseUrl}/getWinnerByAuctionId/34`)
      .send({ endTime: "invalid" });
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).get(
      `${baseUrl}/getWinnerByAuctionId/anyId`
    );
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe("PATCH /updateOneBid/:id", () => {
  it("should update a bid by ID", async () => {
    const response = await request(app)
      .patch(`${baseUrl}/updateOneBid/6552210ba26de35068576cd7`)
      .send({
        auctionId: 34,
        bidder: "cappelumpa",
        bidderId: 1,
        bidAmount: 349,
        bidTime: new Date(),
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app)
      .patch(`${baseUrl}/updateOneBid/anyId`)
      .send({
        auctionId: 34,
        bidder: "cappelumpa",
        bidderId: 1,
        bidAmount: 349,
        bidTime: new Date(),
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe("DELETE /deleteOneBid/:id", () => {
  it("should create and then delete a bid by ID", async () => {
    const bid = await request(app).post(`${baseUrl}/createBid`).send({
      auctionId: 1234567890,
      bidder: `bidder name`,
      bidderId: 987654321,
      bidAmount: 100000,
      bidTime: new Date(),
    });
    expect(bid.status).toBe(201);
    expect(bid.body).toBeDefined();

    const response = await request(app).delete(
      `${baseUrl}/deleteOneBid/${bid.body._id}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).delete(`${baseUrl}/deleteOneBid/anyId`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});

describe("DELETE /deleteAllBidsByAuctionId/:auctionId", () => {
  it("should delete all bids by auctionId", async () => {
    const response = await request(app).delete(
      `${baseUrl}/deleteAllBidsByAuctionId/1234567890`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`should return an error if there is not db connection`, async () => {
    await mongoose.connection.close();

    const response = await request(app).delete(
      `${baseUrl}/deleteAllBidsByAuctionId/anyId`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();

    await mongoose.connect(mongoString);
  });
});
