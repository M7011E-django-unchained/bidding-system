const express = require("express");
const Bid = require("../models/bid");
const router = express.Router();

//Create general bid
router.post("/createBid", async (req, res) => {
  const data = new Bid({
    auctionId: req.body.auctionId,
    bidder: req.body.bidder,
    bidderId: req.body.bidderId,
    bidAmount: req.body.bidAmount,
    bidTime: req.body.bidTime,
  });

  try {
    const dataToSave = await data.save();
    res.status(201).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Bids
router.get("/getAllBids", async (req, res) => {
  try {
    const data = await Bid.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Bids by auctionId
router.get("/getAllBidsByAuctionId/:auctionId", async (req, res) => {
  try {
    const data = await Bid.find({
      auctionId: req.params.auctionId,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Bids by bidderId
router.get("/getAllBidsByBidderId/:bidderId", async (req, res) => {
  try {
    const data = await Bid.find({
      bidderId: req.params.bidderId,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Bids by bidderId and auctionId
router.get("/getAllBids/:bidderId/:auctionId", async (req, res) => {
  try {
    const data = await Bid.find({
      bidderId: req.params.bidderId,
      auctionId: req.params.auctionId,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get bid by ID
router.get("/getOneBid/:id", async (req, res) => {
  try {
    const data = await Bid.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get winner by auctionId, i.e the highest bidder
router.get("/getWinnerByAuctionId/:auctionId", async (req, res) => {
  try {
    const data = await Bid.findOne({ auctionId: req.params.auctionId }).sort({
      bidAmount: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update bid by ID
router.patch("/updateOneBid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const data = await Bid.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete bid by ID
router.delete("/deleteOneBid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Bid.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete all bids by Auction ID
router.delete("/deleteAllBidsByAuctionId/:auctionId", async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const data = await Bid.deleteMany({ auctionId: auctionId });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
