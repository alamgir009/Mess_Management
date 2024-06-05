// const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const UserModel = require("../models/user");

env.config();

// Create a new user (Register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(403).json({ message: "User already registerd" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPasswrod = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPasswrod,
      phone,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successful",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went worng!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found Registerd first!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Email or Password is wrong!" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY
    );
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "Signin successful" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
