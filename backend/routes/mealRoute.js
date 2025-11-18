const express = require("express");
const {
  getAllMeals,
  addMeals,
  getMealById,
  mealUpdatedById,
  mealDeleteById,
  addMealByAdmin,
  updateMealByAdmin,
  deleteMealByAdmin,
  totalMeal,
} = require("../controllers/mealController.js");
const isVerify = require("../middleware/auth.js");

const router = express.Router();

router.get("/", isVerify, getAllMeals);
router.get("/totalMeal", isVerify, totalMeal);
router.get("/:id", isVerify, getMealById);
router.post("/addmeal", isVerify, addMeals);
router.put("/:id", isVerify, mealUpdatedById);
router.delete("/:id", isVerify, mealDeleteById);
router.post("/addmealbyadmin/:id", isVerify, addMealByAdmin);
router.put("/updatebyadmin/:id", isVerify, updateMealByAdmin);
router.delete("/deletebyadmin/:id", isVerify, deleteMealByAdmin);

module.exports = router;
