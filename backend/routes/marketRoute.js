const express = require("express");
const {
  addMarkets,
  getAllMarkets,
  getMarketById,
  marketUpdatedById,
  marketDeleteById,
} = require("../controllers/marketController.js");

const router = express.Router();

router.post("/addMarket", addMarkets);
router.get("/getMarket", getAllMarkets);
router.get("/:id", getMarketById);
router.put("/:id", marketUpdatedById);
router.delete("/:id", marketDeleteById);

module.exports = router;
