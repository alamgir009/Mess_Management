const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  signoutUser,
  updateUserByAdmin,
  deleteUserByAdmin,
  getProfile,
  getUsersWithAggregation,
} = require("../controllers/userController");
const isVerify = require("../middleware/auth");
const {
  requestOTP,
  validateOTP,
  resetPassword,
} = require("../utils/otpValidation");
const { requestMobileOtp, verifyMobileOtp } = require("../utils/mobileOtp");

const router = express.Router();

// User Authentication
router.post("/register", registerUser);
router.post("/signin", loginUser);
router.post("/signout", isVerify, signoutUser);

router.get("/", getUsers);
router.get("/aggregatedUsers", getUsersWithAggregation);
router.get("/profile", isVerify, getProfile);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/update", isVerify, updateUser);
router.put("/updatebyadmin/:id", isVerify, updateUserByAdmin);
router.delete("/delete/:id", isVerify, deleteUserByAdmin);

//Email OTP Validation
router.post("/requestotp", requestOTP);
router.post("/validateotp", validateOTP);
router.post("/resetpassword", resetPassword);

//Mobile OTP Validation
router.post("/requestmobileotp", requestMobileOtp);
router.post("/verifymobileotp", verifyMobileOtp);

module.exports = router;
