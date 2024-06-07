// const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const UserModel = require("../models/user");
const mongoose = require("mongoose");

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

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found Registerd first!" });
    }

    // Checking password and compare
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Email or Password is wrong!" });
    }

    // Check userStatus for "approved"
    if (user.userStatus !== "approved") {
      return res
        .status(403)
        .json({ message: "Pending Approval. Please Await!" });
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
    const userWithLookups = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "markets",
          localField: "markets",
          foreignField: "_id",
          as: "marketDetails",
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "meals",
          foreignField: "_id",
          as: "mealDetails",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          userStatus: 1,
          payment: 1,
          gasBill: 1,
          marketDetails: {
            _id: 1,
            items: 1,
            amount: 1,
            date: 1,
          },
          mealDetails: {
            _id: 1,
            mealTime: 1,
            date: 1,
          },
        },
      },
    ]);

    // Check if user exists
    if (!userWithLookups || userWithLookups.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming we only match one user by ID, take the first result
    const user = userWithLookups[0];

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a user by ID (PUT)
const updateUser = async (req, res) => {
  const { id } = req.user;
  //   id = req.params.id;
  console.log(id);
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      //   req.params.id,
      { _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json({ message: "User data updated", updatedUser });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update userDetails by "Admin" with the user Id (PUT)
const updateUserByAdmin = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    console.log(role);

    if (role !== "admin") {
      return res.status(403).json({ message: "Restricted resource access!" });
    }
    const user = await UserModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// Delete a user by ID (DELETE)
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

// Signout user
const signoutUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(401).json({ message: "Signin first!" });
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  signoutUser,
  updateUserByAdmin,
};
