const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: Number,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  userStatus: { type: String, enum: ["approved", "denied"], default: "denied" },
  markets: [{ type: mongoose.Schema.Types.ObjectId, ref: "market" }],
  meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "meal" }],
  payment: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  gasBill: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
