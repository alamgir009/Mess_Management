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
} = require("../controllers/userController");
const isVerify = require("../middleware/auth");
const {
  requestOTP,
  validateOTP,
  resetPassword,
} = require("../utils/otpValidation");

const router = express.Router();

router.post("/register", registerUser);
router.post("/signin", loginUser);
router.post("/signout", isVerify, signoutUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/update", isVerify, updateUser);
router.put("/updatebyadmin/:id", isVerify, updateUserByAdmin);
router.delete("/delete/:id", isVerify, deleteUserByAdmin);
router.post("/requestotp", requestOTP);
router.post("/validateotp", validateOTP);
router.post("/resetpassword", resetPassword);

module.exports = router;
