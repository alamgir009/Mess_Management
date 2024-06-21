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
} = require("../controllers/mealController.js");
const isVerify = require("../middleware/auth.js");

const router = express.Router();

router.get("/", getAllMeals);
router.get("/:id", getMealById);
router.post("/addmeal", isVerify, addMeals);
router.put("/:id", mealUpdatedById);
router.delete("/:id", mealDeleteById);
router.post("/addmealbyadmin/:id", isVerify, addMealByAdmin);
router.put("/updatebyadmin/:id", isVerify, updateMealByAdmin);
router.delete("/deletebyadmin/:id", isVerify, deleteMealByAdmin);

module.exports = router;
