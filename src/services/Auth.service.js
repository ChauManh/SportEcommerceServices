require("dotenv").config();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const saltRounds = 10;

const createUserService = async ({
  user_name,
  full_name,
  email,
  phone,
  password,
  birth,
  gender,
  addresses,
}) => {
  try {
    // Check exists
    const existingUser = await User.findOne({
      $or: [{ user_name }, { email }, { phone }],
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
      full_name,
      email,
      phone,
      password: hashedPassword,
      birth,
      gender,
      addresses,
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

module.exports = {
  createUserService,
};
