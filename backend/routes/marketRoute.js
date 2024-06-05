const express = require("express");
const {
  addMarkets,
  getAllMarkets,
  getMarketById,
} = require("../controllers/marketController.js");

const router = express.Router();

router.post("/addMarket", addMarkets);
router.get("/getMarket", getAllMarkets);
router.get("/:id", getMarketById);

module.exports = router;
