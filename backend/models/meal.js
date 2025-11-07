const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealTime: { type: String, enum: ["day", "night", "both"], default: "both" },
  date: Date,
  mealOwner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
},
{timestamps:true}
);

const MealModel = mongoose.model("meal", mealSchema);

module.exports = MealModel;
