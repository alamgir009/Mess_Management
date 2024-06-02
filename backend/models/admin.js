const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: Number,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  markets: { type: mongoose.Schema.Types.ObjectId, ref: "market" },
  meals: { type: mongoose.Schema.Types.ObjectId, ref: "meal" },
  gasBill: Number,
  cookingAmount: Number,
  waterAmount: Number,
  payment: { type: Number, enum: ["pending", "success", "failed"] },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const AdminModel = mongoose.model("admin", adminSchema);

module.exports = AdminModel;
