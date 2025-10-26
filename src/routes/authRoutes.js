const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const userControllers = require("../controllers/userControllers");

authRouter.post("/login", userControllers.loginUser);

authRouter.post("/register", userControllers.registerUser);

module.exports = authRouter;
