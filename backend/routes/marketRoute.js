const express = require("express");
const {
  addMarkets,
  getAllMarkets,
  getMarketById,
  marketUpdatedById,
  marketDeleteById,
  addMarketByAdmin,
  deleteMarketByAdmin,
  updateMarketByAdmin,
  getTotalMarket,
} = require("../controllers/marketController.js");
const isVerify = require("../middleware/auth.js");

const router = express.Router();

router.post("/addMarket", isVerify, addMarkets);
router.get("/getMarket", getAllMarkets);
router.get("/getTotalMarket", getTotalMarket);
router.get("/:id", getMarketById);
router.put("/:id", marketUpdatedById);
router.delete("/:id", marketDeleteById);
router.post("/addmarketbyadmin/:id", isVerify, addMarketByAdmin);
router.delete("/deletemarketbyadmin/:id", isVerify, deleteMarketByAdmin);
router.put("/updatemarketbyadmin/:id", isVerify, updateMarketByAdmin);

module.exports = router;
