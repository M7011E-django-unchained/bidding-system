// import { jest } from "@jest/globals";

// const utils = jest.createMockFromModule("../utils");

// utils.isAuthorized = jest.fn((secret) => secret === "not wizard");

require("dotenv").config();

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../routes/routes");
const Model = require("../models/bid");
const mongoString = process.env.TEST_DATABASE_URL;

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(mongoString);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("Routes", () => {
  describe("POST /createBid", () => {
    it("should create a new bid", async () => {
      const response = await request(app).post("/createBid").send({
        auctionId: 1234567890,
        bidder: "bidder name",
        bidderId: 987654321,
        bidAmount: 100,
        bidTime: new Date(),
      });
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a validation error", async () => {
      const response = await request(app).post("/createBid").send({
        auctionId: 1234567890,
        bidder: "bidder name",
        bidderId: 987654321,
        bidAmount: "invalid",
        bidTime: new Date(),
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Validation error" });
    });
  });

  describe("GET /getAllBids", () => {
    it("should return all bids", async () => {
      const response = await request(app).get("/getAllBids");
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.find() function to throw an error
      jest.spyOn(Model, "find").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).get("/getAllBids");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("GET /getAllBidsByAuctionId/:auctionId", () => {
    it("should return all bids by auctionId", async () => {
      const response = await request(app).get(
        "/getAllBidsByAuctionId/1234567890"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.find() function to throw an error
      jest.spyOn(Model, "find").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).get(
        "/getAllBidsByAuctionId/1234567890"
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("GET /getAllBidsByBidderId/:bidderId", () => {
    it("should return all bids by bidderId", async () => {
      const response = await request(app).get(
        "/getAllBidsByBidderId/987654321"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.find() function to throw an error
      jest.spyOn(Model, "find").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).get(
        "/getAllBidsByBidderId/987654321"
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("GET /getAllBids/:bidderId/:auctionId", () => {
    it("should return all bids by bidderId and auctionId", async () => {
      const response = await request(app).get(
        "/getAllBids/987654321/1234567890"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.find() function to throw an error
      jest.spyOn(Model, "find").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).get(
        "/getAllBids/987654321/1234567890"
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("GET /getOneBid/:id", () => {
    it("should return a bid by ID", async () => {
      // Create a bid
      const bid = new Model({
        auctionId: 1234567890,
        bidder: "bidder name",
        bidderId: 987654321,
        bidAmount: 100,
        bidTime: new Date(),
      });
      await bid.save();

      const response = await request(app).get(`/getOneBid/${bid._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.findById() function to throw an error
      jest.spyOn(Model, "findById").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).get("/getOneBid/1234567890");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("GET /getWinnerByAuctionId/:auctionId", () => {
    it("should return the highest bidder by auctionId", async () => {
      const response = await request(app).get(
        "/getWinnerByAuctionId/1234567890"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.findOne() function to throw an error
      jest.spyOn(Model, "findOne").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).get(
        "/getWinnerByAuctionId/1234567890"
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("PATCH /updateOneBid/:id", () => {
    it("should update a bid by ID", async () => {
      // Create a bid
      const bid = new Model({
        auctionId: 1234567890,
        bidder: "bidder name",
        bidderId: 987654321,
        bidAmount: 100,
        bidTime: new Date(),
      });
      await bid.save();

      const response = await request(app)
        .patch(`/updateOneBid/${bid._id}`)
        .send({
          bidAmount: 200,
        });
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.findByIdAndUpdate() function to throw an error
      jest.spyOn(Model, "findByIdAndUpdate").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app)
        .patch("/updateOneBid/1234567890")
        .send({
          bidAmount: 200,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("DELETE /deleteOneBid/:id", () => {
    it("should delete a bid by ID", async () => {
      // Create a bid
      const bid = new Model({
        auctionId: 1234567890,
        bidder: "bidder name",
        bidderId: 987654321,
        bidAmount: 100,
        bidTime: new Date(),
      });
      await bid.save();

      const response = await request(app).delete(`/deleteOneBid/${bid._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.findByIdAndDelete() function to throw an error
      jest.spyOn(Model, "findByIdAndDelete").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).delete("/deleteOneBid/1234567890");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  describe("DELETE /deleteAllBidsByAuctionId/:auctionId", () => {
    it("should delete all bids by auctionId", async () => {
      const response = await request(app).delete(
        "/deleteAllBidsByAuctionId/1234567890"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions to validate the response data
    });

    it("should return an error if there is a server error", async () => {
      // Mock the Model.deleteMany() function to throw an error
      jest.spyOn(Model, "deleteMany").mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await request(app).delete(
        "/deleteAllBidsByAuctionId/1234567890"
      );
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });
});
