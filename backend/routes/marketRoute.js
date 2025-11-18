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
router.get("/getMarket", isVerify, getAllMarkets);
router.get("/getTotalMarket",isVerify, getTotalMarket);
router.get("/:id", isVerify, getMarketById);
router.put("/:id", isVerify, marketUpdatedById);
router.delete("/:id", isVerify, marketDeleteById);
router.post("/addmarketbyadmin/:id", isVerify, addMarketByAdmin);
router.delete("/deletemarketbyadmin/:id", isVerify, deleteMarketByAdmin);
router.put("/updatemarketbyadmin/:id", isVerify, updateMarketByAdmin);

module.exports = router;
