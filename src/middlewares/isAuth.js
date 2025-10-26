const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const headerObj = req.headers;

    if (!headerObj.authorization) {
      return res.status(401).json({
        message: "Unauthorized , please login to access this resource",
      });
    }

    const token = headerObj.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized , please login to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized , token invalid",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Unauthorized , please login to access this resource",
    });
  }
};
module.exports = isAuthenticatedUser;
