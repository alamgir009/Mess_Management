const MarketModel = require("../models/market");
const UserModel = require("../models/user");

// Get All Markets
const getAllMarkets = async (req, res) => {
  try {
    const markets = await MarketModel.find();
    res.status(200).json(markets);
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

const addMarkets = async (req, res) => {
  try {
    const newMarket = new MarketModel(req.body);
    await newMarket.save();

    // Add the market ID to the user's markets array
    await UserModel.findByIdAndUpdate(req.body.marketOwner, {
      $push: { markets: newMarket._id },
    });

    return res.status(201).json(newMarket);
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

module.exports = { getAllMarkets, addMarkets };
