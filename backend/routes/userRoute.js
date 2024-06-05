const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const isVerify = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/signin", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/update", isVerify, updateUser);

module.exports = router;
