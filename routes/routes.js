const express = require("express");
const Model = require("../models/bid");
const router = express.Router();

//Create general bid
router.post("/createBid", async (req, res) => {
  const data = new Model({
    auctionId: req.body.auctionId,
    bidder: req.body.bidder,
    bidderId: req.body.bidderId,
    bidAmount: req.body.bidAmount,
    bidTime: req.body.bidTime,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Bids
router.get("/getAllBids", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Bids by auctionId
router.get("/getAllBidsByAuctionId/:auctionId", async (req, res) => {
  try {
    const data = await Model.find({
      auctionId: req.params.auctionId,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Bids by bidderId
router.get("/getAllBidsByBidderId/:bidderId", async (req, res) => {
  try {
    const data = await Model.find({
      bidderId: req.params.bidderId,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Bids by bidderId and auctionId
router.get("/getAllBids/:bidderId/:auctionId", async (req, res) => {
  try {
    const data = await Model.find({
      bidderId: req.params.bidderId,
      auctionId: req.params.auctionId,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get bid by ID
router.get("/getOneBid/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get winner by auctionId, i.e the highest bidder
router.get("/getWinnerByAuctionId/:auctionId", async (req, res) => {
  try {
    const data = await Model.findOne({ auctionId: req.params.auctionId }).sort({
      bidAmount: -1,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update bid by ID
router.patch("/updateOneBid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete bid by ID
router.delete("/deleteOneBid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Bid with id = ${data._id} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete all bids by Auction ID
router.delete("/deleteAllBidsByAuctionId/:auctionId", async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const data = await Model.deleteMany(auctionId);
    res.send(
      `All bids with on auction with auctionId = ${data.auctionId} has been deleted..`
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
