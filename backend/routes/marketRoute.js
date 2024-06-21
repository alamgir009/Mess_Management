const express = require("express");
const {
  addMarkets,
  getAllMarkets,
  getMarketById,
  marketUpdatedById,
  marketDeleteById,
  addMarketByAdmin,
  deleteMarketByAdmin,
} = require("../controllers/marketController.js");
const isVerify = require("../middleware/auth.js");

const router = express.Router();

router.post("/addMarket", isVerify, addMarkets);
router.get("/getMarket", getAllMarkets);
router.get("/:id", getMarketById);
router.put("/:id", marketUpdatedById);
router.delete("/:id", marketDeleteById);
router.post("/addmarketbyadmin/:id", isVerify, addMarketByAdmin);
router.delete("/deletemarketbyadmin/:id", isVerify, deleteMarketByAdmin);

module.exports = router;
