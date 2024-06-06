const express = require("express");
const {
  getAllMeals,
  addMeals,
  getMealById,
  mealUpdatedById,
  mealDeleteById,
} = require("../controllers/mealController.js");
const isVerify = require("../middleware/auth.js");

const router = express.Router();

router.get("/", getAllMeals);
router.get("/:id", getMealById);
router.post("/addmeal", isVerify, addMeals);
router.put("/:id", mealUpdatedById);
router.delete("/:id", mealDeleteById);

module.exports = router;
