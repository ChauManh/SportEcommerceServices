require("dotenv").config();
const User = require("../models/User.model");
const { createJwtPayload } = require("../utils/JwtUtil");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async ({ user_name, email, password }) => {
  try {
    // Check exists
    const existingUser = await User.findOne({
      $or: [{ user_name }, { email }],
    });
    if (existingUser) {
      return {
        EC: 2,
        EM: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return {
      EC: 0,
      EM: "User created successfully",
    };
  } catch (err) {
    return {
      EC: 1,
      EM: "Error occurred during sign-up",
      details: err.message,
    };
  }
};

const loginService = async (user_name, password) => {
  try {
    console.log(user_name);
    const user = await User.findOne({
      $or: [{ user_name: user_name }, { email: user_name }],
    });

    if (!user) {
      return {
        EC: 2,
        EM: "User not found",
      };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 3,
        EM: "Invalid password",
      };
    }

    const payload = createJwtPayload(user);

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      EC: 0,
      EM: "Logged in successfully",
      accessToken,
    };
  } catch (e) {
    console.log(e.message);
    return {
      EC: 1,
      EM: "Error occurred during login",
    };
  }
};

module.exports = {
  createUserService,
  loginService,
};
