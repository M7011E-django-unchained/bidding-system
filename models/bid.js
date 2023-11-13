const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  auctionId: {
    required: true,
    type: Number,
  },
  bidder: {
    required: true,
    type: String,
  },
  bidderId: {
    required: true,
    type: Number,
  },
  bidAmount: {
    required: true,
    type: Number,
  },
  bidTime: {
    required: true,
    type: Date,
  },
});

module.exports = mongoose.model("Bid", dataSchema);
