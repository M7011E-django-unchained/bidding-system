require("dotenv").config();

const assert = require("assert");
const mongoose = require("mongoose");
const Bid = require("../models/bid");
const mongoString = process.env.TEST_DATABASE_URL;

describe("Bid model", () => {
  before(async () => {
    await mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Bid.deleteMany({});
  });

  afterEach(async () => {
    await Bid.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should create a new bid", async () => {
    const bid = new Bid({
      auctionId: 1234567890,
      bidderId: 987654321,
      bidAmount: 100,
      bidder: "bidder name",
      bidTime: new Date(),
    });
    const savedBid = await bid.save();
    assert(savedBid._id != null);
    assert(savedBid.auctionId === 1234567890);
    assert(savedBid.bidderId === 987654321);
    assert(savedBid.bidAmount === 100);
    assert(savedBid.bidTime instanceof Date);
  });

  it("should not create a bid without an auctionId", async () => {
    const bid = new Bid({
      bidderId: 987654321,
      bidAmount: 100,
      bidder: "bidder name",
      bidTime: new Date(),
    });
    let error = null;
    try {
      await bid.save();
    } catch (err) {
      error = err;
    }
    assert(error != null);
    assert(error.errors.auctionId != null);
  });

  it("should not create a bid without a bidderId", async () => {
    const bid = new Bid({
      auctionId: 1234567890,
      bidAmount: 100,
      bidder: "bidder name",
      bidTime: new Date(),
    });
    let error = null;
    try {
      await bid.save();
    } catch (err) {
      error = err;
    }
    assert(error != null);
    assert(error.errors.bidderId != null);
  });

  it("should not create a bid without an bidAmount", async () => {
    const bid = new Bid({
      auctionId: 1234567890,
      bidderId: 987654321,
      bidder: "bidder name",
      bidTime: new Date(),
    });
    let error = null;
    try {
      await bid.save();
    } catch (err) {
      error = err;
    }
    assert(error != null);
    assert(error.errors.bidAmount != null);
  });

  it("should not create a bid without an bidder", async () => {
    const bid = new Bid({
      auctionId: 1234567890,
      bidderId: 987654321,
      bidAmount: 100,
      bidTime: new Date(),
    });
    let error = null;
    try {
      await bid.save();
    } catch (err) {
      error = err;
    }
    assert(error != null);
    assert(error.errors.bidder != null);
  });

  it("should not create a bid without an bidTime", async () => {
    const bid = new Bid({
      auctionId: 1234567890,
      bidderId: 987654321,
      bidAmount: 100,
      bidder: "bidder name",
    });
    let error = null;
    try {
      await bid.save();
    } catch (err) {
      error = err;
    }
    assert(error != null);
    assert(error.errors.bidTime != null);
  });
});
