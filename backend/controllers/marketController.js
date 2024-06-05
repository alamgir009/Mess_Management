const MarketModel = require("../models/market");
const UserModel = require("../models/user");

// Get All Markets
const getAllMarkets = async (req, res) => {
  try {
    const markets = await MarketModel.find({});
    console.log(markets);
    return res.status(200).json(markets);
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

// add new market via (POST)
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

const getMarketById = async (req, res) => {
  const market = await MarketModel.findById(req.params.id);
  if (!market) {
    return res.status(404).json({ message: "Market not found!" });
  }
  res.status(200).json(market);
};

module.exports = { getAllMarkets, addMarkets, getMarketById };
