require("dotenv").config();
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  const payload = {
    userId: user?._id || user.userId,
    user_name: user.user_name,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const createRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken };
