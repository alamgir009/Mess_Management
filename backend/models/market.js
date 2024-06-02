const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema({
  items: String,
  amount: Number,
  date: Date,
  marketOwner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const MarketModel = mongoose.model("market", marketSchema);

module.exports = MarketModel;
