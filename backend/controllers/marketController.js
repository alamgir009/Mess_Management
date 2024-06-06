const MarketModel = require("../models/market");
const UserModel = require("../models/user");

// Get All Markets
const getAllMarkets = async (req, res) => {
  try {
    const markets = await MarketModel.find({});
    return res.status(200).json(markets);
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

// add new market via (POST)
const addMarkets = async (req, res) => {
  const { id } = req.user;
  try {
    req.body.marketOwner = id;
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

// Get market by id
const getMarketById = async (req, res) => {
  try {
    const market = await MarketModel.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ message: "Market not found!" });
    }
    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// Update market by id
const marketUpdatedById = async (req, res) => {
  try {
    const market = await MarketModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!market) {
      return res.status(404).json({ message: "Market not found!" });
    }
    res.status(200).json({ message: "Market updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// Delete market by ID
const marketDeleteById = async (req, res) => {
  try {
    const market = await MarketModel.findByIdAndDelete(req.params.id);
    if (!market) {
      return res.status(404).json({ message: "Market not found!" });
    }

    // Remove the market ID from the user's markets array
    await UserModel.findByIdAndUpdate(market.marketOwner, {
      $pull: { markets: market._id },
    });

    res.status(200).json({ message: "Market deleted!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  getAllMarkets,
  addMarkets,
  getMarketById,
  marketUpdatedById,
  marketDeleteById,
};
