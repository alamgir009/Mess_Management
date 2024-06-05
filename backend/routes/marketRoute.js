const express = require("express");
const {
  addMarkets,
  getAllMarkets,
} = require("../controllers/marketController");

const router = express.Router();

router.post("/addMarket", addMarkets);
router.get("/getMarket", getAllMarkets);

module.exports = router;
