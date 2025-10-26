const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userControllers = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password, profileImage } = req.body;

      //validations
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUserEmail = await User.findOne({ email });

      if (existingUserEmail) {
        return res.status(400).json({ message: "You are already registered" });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      const newUser = new User({
        username,
        email,
        password,
        profileImage,
      });

      await newUser.save();

      //create token
      const token = generateToken(newUser._id);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profileImage: newUser.profileImage,
          token: token,
        },
      });
    } catch (error) {
      console.log("Error in registerUser:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      //validations
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      //check if user exists
      const userExists = await User.findOne({ email });
      if (!userExists) {
        return res.status(400).json({
          message: "user does not exists. please register first",
        });
      }

      //check password
      const isPasswordCorrect = await userExists.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      //generate token
      const token = generateToken(userExists._id);

      res.status(200).json({
        token,
        user: {
          _id: userExists._id,
          username: userExists.username,
          email: userExists.email,
          profileImage: userExists.profileImage,
        },
      });
    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = userControllers;
