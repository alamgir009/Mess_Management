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

// Get Grand total meal of all users
const totalMeal = async (req, res) => {
  try {
    const totalMeal = await MealModel.aggregate([
      {
        $addFields: {
          mealValue: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$mealTime", "day"] },
                  then: 1,
                },
                {
                  case: { $eq: ["$mealTime", "night"] },
                  then: 1,
                },
                {
                  case: { $eq: ["$mealTime", "both"] },
                  then: 2,
                },
              ],
              default: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$mealOwner",
          overAllMeal: {
            $sum: "$mealValue",
          },
        },
      },
      {
        $group: {
          _id: null,
          grandTotalMeal: {
            $sum: "$overAllMeal",
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          grandTotalMeal: 1, // Include only the grandTotalMeal field
        },
      },
    ]);
    return res.status(200).json(totalMeal[0]); // Return the object directly
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
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

// Add meal by Admin
const addMealByAdmin = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  try {
    req.body.mealOwner = id;
    if (role !== "admin") {
      return res.status(403).json({ message: "Restricted resource access!" });
    }

    const meal = new MealModel(req.body);
    await meal.save();

    await UserModel.findByIdAndUpdate(req.body.mealOwner, {
      $push: { meals: meal._id },
    });

    return res.status(201).json({ message: "meal added successfully", meal });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
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

// Update meal by Admin (PUT)
const updateMealByAdmin = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  try {
    if (role !== "admin")
      return res.status(403).json({ message: "Restricted resource access!" });

    const meal = await MealModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!meal) return res.status(404).json({ message: "Meal not found!" });

    return res.status(200).json({ message: "Meal updated Successful." });
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

//Delete meal by Admin (Delete)
const deleteMealByAdmin = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  try {
    if (role !== "admin") {
      return res.status(403).json({ message: "Restricted resource access!" });
    }
    const newmeal = await MealModel.findByIdAndDelete(id);
    if (!newmeal) {
      return res.status(404).json({ message: "meal not found!" });
    }

    await UserModel.findByIdAndUpdate(newmeal.mealOwner, {
      $pull: { meals: newmeal._id },
    });

    return res.status(200).json({ message: "meal deleted!", newmeal });
  } catch (error) {
    return res.status(500).jsin({ message: "Something went wrong!" });
  }
};

module.exports = {
  getAllMeals,
  totalMeal,
  addMeals,
  getMealById,
  mealUpdatedById,
  mealDeleteById,
  addMealByAdmin,
  updateMealByAdmin,
  deleteMealByAdmin,
};
