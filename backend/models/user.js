const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: Number,
  image: String,
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
  resetPasswordOTP: { type: String },
  resetPasswordExpiry: { type: Date },
  // Add this field for TTL
  deleteIfNotApproved: { 
    type: Date, 
    default: function() {
      // Set to 7 days from creation if status is denied
      if (this.userStatus === 'denied') {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      }
      return null;
    }
  }
}, { timestamps: true });

// Add TTL index - automatically removes documents after deleteIfNotApproved date
userSchema.index({ deleteIfNotApproved: 1 }, { 
  expireAfterSeconds: 0,
  partialFilterExpression: { userStatus: "denied" }
});

// Middleware to update deleteIfNotApproved when userStatus changes
userSchema.pre('save', function(next) {
  if (this.isModified('userStatus')) {
    if (this.userStatus === 'approved') {
      // If approved, remove the deletion date
      this.deleteIfNotApproved = null;
    } else if (this.userStatus === 'denied' && !this.deleteIfNotApproved) {
      // If denied and no deletion date set, set it to 7 days from now
      this.deleteIfNotApproved = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;