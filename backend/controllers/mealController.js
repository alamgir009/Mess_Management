const MealModel = require("../models/meal");
const UserModel = require("../models/user");

// Get All meals
const getAllMeals = async (req, res) => {
  try {
    const meals = await MealModel.find({});
    return res.status(200).json(meals);
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

// add new meal via (POST)
const addMeals = async (req, res) => {
  const { id } = req.user;
  try {
    req.body.mealOwner = id;
    const newMeal = new MealModel(req.body);
    await newMeal.save();

    // Add the meal ID to the user's meals array
    await UserModel.findByIdAndUpdate(req.body.mealOwner, {
      $push: { meals: newMeal._id },
    });

    return res.status(201).json({ message: "Meal added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

// Get meal by id
const getMealById = async (req, res) => {
  try {
    const meal = await MealModel.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found!" });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// Update meal by id
const mealUpdatedById = async (req, res) => {
  try {
    const meal = await MealModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!meal) {
      return res.status(404).json({ message: "Meal not found!" });
    }
    res.status(200).json({ message: "Meal updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// Delete meal by ID
const mealDeleteById = async (req, res) => {
  try {
    const meal = await MealModel.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found!" });
    }

    // Remove the meal ID from the user's meals array
    await UserModel.findByIdAndUpdate(meal.mealOwner, {
      $pull: { meals: meal._id },
    });

    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  getAllMeals,
  addMeals,
  getMealById,
  mealUpdatedById,
  mealDeleteById,
};
